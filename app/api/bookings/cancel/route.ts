import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { getUserId } from "../../../lib/getUserId";

export async function PATCH(req: NextRequest) {
    const userId = await getUserId(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { courtId, bookedDate, bookedTime } = await req.json();

    if (!courtId || !bookedDate || !bookedTime) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const sql = "UPDATE bookings SET booking_status = 'cancelled' WHERE user_id = ? AND court_id = ? AND booked_date = ? AND booked_time = ?";
        await pool.execute(sql, [userId, courtId, bookedDate, bookedTime]);
        
        return NextResponse.json({ message: "Booking cancelled" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}