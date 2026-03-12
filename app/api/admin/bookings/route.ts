import { NextRequest, NextResponse } from "next/server"
import { pool } from "../../../lib/db"
import { getUserIsAdmin } from "../../../lib/getUserIsAdmin"

export async function GET(req: NextRequest) {
    try {
        if (!await getUserIsAdmin(req)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
        
        const { searchParams } = new URL(req.url)
        const date = searchParams.get("date")

        if (!date) {
            return NextResponse.json({ error: "Missing params"}, {status: 400})
        }

        const sql = `
            SELECT b.booking_id, b.booked_time, b.booking_status, c.court_name, u.first_name, u.last_name, u.email
            FROM bookings b
            JOIN courts c ON b.court_id = c.court_id
            JOIN users u ON b.user_id = u.user_id
            WHERE b.booking_status != 'cancelled' AND b.booked_date = ?
        `;

        const [rows] = await pool.execute(sql, [date]);
        const bookings = rows as AdminBooking[];
        
        return NextResponse.json({ bookings }, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: "Server Error"}, {status: 500})

    }
}