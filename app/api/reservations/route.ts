import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "../../lib/getUserId";
import { pool } from "../../lib/db";

export async function GET(req: NextRequest) {
    try {
        const userId = await getUserId(req);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, {status: 401})
        }

        const sql = `
            SELECT b.booking_id, b.court_id, b.booked_date, b.booked_time, b.booking_status, c.court_name
            FROM bookings b
            JOIN courts c ON b.court_id = c.court_id
            WHERE b.user_id = ?
            AND (
                (b.booking_status = 'confirmed' AND b.booked_date >= CURRENT_DATE)
                OR
                (b.booking_status IN ('completed', 'no_show') AND b.booked_date >= CURRENT_DATE - INTERVAL 30 DAY)
            )
            ORDER BY b.booked_date ASC, b.booked_time ASC
        `;

        const [rows] = await pool.execute(sql, [userId]);
        const reservations = rows as Reservation[];

        return NextResponse.json(reservations);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, {status: 500});
    }
}