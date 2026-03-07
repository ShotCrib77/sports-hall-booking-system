"use client"
import { useEffect, useState } from "react";
import { Calendar } from "../components/ui/calendar";
import AvailableTimes from "../components/AvailableTimes";
import VerticalLine from "../components/VerticalLine";
import { generateMarch } from "../lib/dummy";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function BookingPage() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [bookings, setBookings] = useState<BookingSummary[]>([]);
    const [courts, setCourts] = useState<Court[]>([])

    const [selectedSlots, setSelectedSlots] = useState<BookingSummary[]>([])
    const highlightedDates = [...new Set(selectedSlots.map(slot => slot.booked_date))].map(dateStr => new Date(dateStr + "T00:00:00"))

    const dateLabel = date ? `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}` : "Select a date";
    const formattedDate = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : ""
    const bookedBookings = bookings.filter((booking) => booking.booked_date === formattedDate);

    const handleSelect = (booking: BookingSummary) => {
        setSelectedSlots(prev => {
            const exists = prev.some(s => 
                s.court_id === booking.court_id && 
                s.booked_time === booking.booked_time && 
                s.booked_date === booking.booked_date
            );
            if (exists) {
                return prev.filter(s => !(
                    s.court_id === booking.court_id && 
                    s.booked_time === booking.booked_time && 
                    s.booked_date === booking.booked_date
                ));
            }
            return [...prev, booking];
        })
    }

    const getBookings = async () => {
        const today = new Date()
        const formattedCurrentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
        console.log(`/api/bookings?startDate=${formattedCurrentDate}&days=40`)
        const res = await fetch(`/api/bookings?startDate=${formattedCurrentDate}&days=40`);
        const { bookings: fetchedBookings }: { bookings: BookingSummary[] } = await res.json();
        console.log(fetchedBookings)
        fetchedBookings.forEach(booking => booking.booked_time = booking.booked_time.slice(0, 5))
        return fetchedBookings;
    }

    const getCourts = async () => {
        const res = await fetch(`/api/courts?tennis`);
        const { courts: fetchedCourts }: { courts: Court[] } = await res.json();
        console.log(fetchedCourts)
        return fetchedCourts;
    }

    console.log(date, formattedDate)

    useEffect(() => {
        const fetchData = async () => {
            const fetchedBookings = await getBookings();
            setBookings(fetchedBookings);
            const fetchedCourts = await getCourts();
            setCourts(fetchedCourts);
        }
        fetchData()
    }, [])

    return (
        <main className="w-full min-h-screen flex justify-center items-center bg-gray-100">
            <section className="flex order-2 rounded-lg bg-white">
                <div className="p-6 flex gap-8">
                    <div className="h-82">
                        <Calendar
                            modifiers={{ highlighted: highlightedDates }}
                            modifiersClassNames={{ highlighted: "bg-green-600/50 rounded-md hover:bg-green-700/70 [&_button]:hover:bg-green-500/60 text-white"}}
                            disabled={{ before: new Date() }}
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-lg"
                            captionLayout="dropdown"
                        />
                    </div>
                    <VerticalLine />
                    <div>
                        <h2 className="text-xs text-green-500 uppercase">Select a Time</h2>
                        <h1 className="pb-2 font-bold text-lg">{dateLabel}</h1>
                        <AvailableTimes bookings={bookedBookings} courts={courts} date={formattedDate} selectedSlots={selectedSlots} handleSelect={handleSelect} />
                        <hr className="m-4" />
                        <div className="flex justify-between items-center gap-2">
                            <div className="flex">
                                <span className="text-xs text-gray-500">{selectedSlots.length} slots selected</span>
                                <button onClick={() => setSelectedSlots([])} className="text-xs text-gray-500">&nbsp;- Clear</button>
                            </div>
                            <button className={`px-4 py-1 text-sm font-bold rounded-md ${selectedSlots.length === 0 ? "bg-gray-200 text-gray-500 cursor-default" : "bg-green-500 text-white"}`}>Book</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}