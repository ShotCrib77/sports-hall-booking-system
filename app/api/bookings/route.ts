import { NextRequest, NextResponse } from "next/server"
import { pool } from "../../lib/db"
import { getUserId } from "../../lib/getUserId";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const startDate = searchParams.get("startDate")
        const days = Number(searchParams.get("days"))

        if (!days || !startDate) {
            return NextResponse.json({ error: "Missing params"}, {status: 400})
        }

        const sql = `SELECT court_id, booked_date, booked_time FROM bookings
                    WHERE booking_status = 'confirmed' AND
                    booked_date BETWEEN ? AND
                    DATE_ADD(?, INTERVAL ? DAY)`
        const [rows] = await pool.execute(sql, [startDate, startDate, days]);
        const bookings = rows as Partial<BookingRow>[];
        return NextResponse.json({ bookings }, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: "Server Error"}, {status: 500})

    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = await getUserId(req)
        if (!userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const { courtId, booked_date, booked_time } = await req.json();

        const sql = "INSERT INTO bookings (user_id, court_id, booked_date, booked_time) VALUES (?, ?, ?, ?)"
        await pool.execute(sql, [userId, courtId, booked_date, booked_time]);

        return NextResponse.json({ message: "Successfully added booking" }, {status: 201})
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: "Slot already booked" }, { status: 409 })
        }
        console.error(error)
        return NextResponse.json({error: "Server Error"}, {status: 500})
    }
}