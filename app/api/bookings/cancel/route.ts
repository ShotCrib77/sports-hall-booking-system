import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { getUserId } from "../../../lib/getUserId";
import { ResultSetHeader } from "mysql2";

export async function PATCH(req: NextRequest) {
    const userId = await getUserId(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { bookingId } = await req.json();

    if (!bookingId) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const sql = "UPDATE bookings SET booking_status = 'cancelled' WHERE booking_id = ? AND user_id = ?";
        const [result] = await pool.execute<ResultSetHeader>(sql, [bookingId, userId]);
        
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Booking cancelled" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}