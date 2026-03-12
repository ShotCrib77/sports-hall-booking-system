import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../../lib/db";
import { getUserIsAdmin } from "../../../../lib/getUserIsAdmin";

export async function PATCH(req: NextRequest) {
    try {
        if (!await getUserIsAdmin(req)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const { bookingId, status } = await req.json();

        if (!bookingId || !status) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        if (!["confirmed", "completed", "cancelled", "no_show"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const sql = "UPDATE bookings SET booking_status = ? WHERE booking_id = ?";
        const [result] = await pool.execute<ResultSetHeader>(sql, [status, bookingId]);
        
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Booking updated" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}