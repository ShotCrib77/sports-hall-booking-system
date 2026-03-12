import { NextResponse, NextRequest } from "next/server";
import { getUserId } from "../../../lib/getUserId";
import { pool } from "../../../lib/db";

export async function POST(req: NextRequest) {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const bookings: { court_id: number, booked_date: string, booked_time: string }[] = await req.json()

        if (!Array.isArray(bookings) || bookings.length === 0 || bookings.length > 20) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 })
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            for (const booking of bookings) {
                await connection.execute(
                    "INSERT INTO bookings (user_id, court_id, booked_date, booked_time) VALUES (?, ?, ?, ?)",
                    [userId, booking.court_id, booking.booked_date, booking.booked_time]
                )
            }
            await connection.commit()
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            await connection.rollback()
            if (error.code === 'ER_DUP_ENTRY') {
                return NextResponse.json({ error: "One or more slots already booked" }, { status: 409 })
            }
            throw error
        } finally {
            connection.release()
        }

        return NextResponse.json({ message: "Bookings successful" }, { status: 201 })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: "Some slot already booked" }, { status: 409 })
        }
        console.error(error)
        return NextResponse.json({ error: "Server Error" }, { status: 500 })
    }
}