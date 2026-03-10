"use client";

import { useCallback, useEffect, useState } from "react";
import DateTab from "../../components/DateTab";
import StatusButton from "../../components/StatusButton";
import StatusCard from "../../components/StatusCard";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";

const TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

type DateTab = "today" | "tomorrow" | "pick";
const dateToStr = (d: Date) => d.toISOString().split("T")[0];

export default function AdminBookings() {
    const [activeTab, setActiveTab] = useState<DateTab>("today");
    const [activeCell, setActiveCell] = useState<number | null>(null);
    const [pickedDate, setPickedDate] = useState(dateToStr(new Date()))
    const [bookings, setBookings] = useState<AdminBooking[]>([])
    const [courts, setCourts] = useState<Court[]>([])

    
    const fetchBookings = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/bookings?date=${pickedDate}`);

            if (res.ok) {
                const { bookings: fetchedBookings } : { bookings: AdminBooking[] } = await res.json();
                fetchedBookings.forEach(booking => {
                    booking.booked_time = booking.booked_time.slice(0, 5);
                    booking.first_name = booking.first_name.charAt(0).toUpperCase() + booking.first_name.slice(1);
                    booking.last_name = booking.last_name.charAt(0).toUpperCase() + booking.last_name.slice(1);

                });
                setBookings(fetchedBookings);
            } else {
                toast.error("Something went wrong, please try again.");
            }
        } catch {
            toast.error("Network error, please try again.");
        }
    }, [pickedDate])

    const updateStatus = async (bookingId: number, status: string) => {
        try {
            const res = await fetch("/api/admin/bookings/status", { 
                method: "PATCH", 
                body: JSON.stringify({ bookingId, status }) 
            });

            if (res.ok) {
                await fetchBookings();
            } else {
                toast.error("Something went wrong, please try again.");
            }
            
        } catch {
            toast.error("Network error, please try again.");
        }
        setActiveCell(null);
    };

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const res = await fetch("/api/courts");

                if (res.ok) {
                    const { courts: fetchedCourts } : { courts: Court[] } = await res.json();
                    setCourts(fetchedCourts)
                } else {
                    toast.error("Something went wrong, please try again.");
                }

            } catch {
                toast.error("Network error, please try again.");
            }
        }

        fetchCourts();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await fetchBookings();
        }
        fetchData();
    }, [fetchBookings])

    const getBooking = (court: Court, time: string): AdminBooking | undefined => {
        return bookings?.find(booking => booking.court_name === court.court_name && booking.booked_time === time)
    }

    const setTomorrowsDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setPickedDate(dateToStr(tomorrow));
    }

    return (
        <main className="min-h-screen bg-white font-sans">

            <div className="px-6 py-6 max-w-7xl mx-auto">

                <div className="flex items-center gap-2 mb-5">
                    <DateTab type="today" active={activeTab === "today"} onClick={() => {setActiveTab("today"); setPickedDate(dateToStr(new Date()))}} />

                    <DateTab type="tomorrow" active={activeTab === "tomorrow"} onClick={() => {setActiveTab("tomorrow"); setTomorrowsDate()}} />

                    <DateTab type="pick" active={activeTab === "pick"} onClick={() => setActiveTab("pick")} pickedDate={pickedDate} onPickedDate={setPickedDate} />
                </div>

                {/* Time tabel */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-4 py-3 text-gray-400 font-medium w-16 sticky left-0 bg-white">Time</th>
                                {courts.map((court) => (
                                    <th key={court.court_id} className="text-left px-3 py-3 text-gray-600 font-medium whitespace-nowrap min-w-36">
                                        {court.court_name}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {TIMES.map((time, i) => (
                                <tr key={time} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                                    <td className="px-4 py-2.5 text-gray-400 font-mono text-xs sticky left-0 bg-inherit">{time}</td>

                                    {courts.map((court) => {
                                        const booking = getBooking(court, time);
                                        if (!booking) return <td key={court.court_id} className="px-3 py-2.5" />;

                                        const isActive = activeCell === booking.booking_id;

                                        return (
                                            <td key={court.court_id} className="px-3 py-2 relative">
                                                <StatusCard bookingId={booking.booking_id} bookingStatus={booking.booking_status} customerName={`${booking.first_name} ${booking.last_name}`} isActive={isActive} setActiveCell={setActiveCell} />


                                                {/* Inline action panel */}
                                                {isActive && (
                                                    <div className="absolute z-20 top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-48">
                                                        <div className="text-xs text-gray-500 mb-1">{booking.email}</div>
                                                        <div className="text-xs font-medium text-gray-700 mb-2">{booking.court_name} · {booking.booked_time}</div>
                                                        <div className="flex flex-col gap-1">
                                                            <StatusButton variant="completed" disabled={booking.booking_status === "completed"} onClick={() => updateStatus(booking.booking_id, "completed")} />
                                                            <StatusButton variant="no_show" disabled={booking.booking_status === "no_show"} onClick={() => updateStatus(booking.booking_id, "no_show")} />
                                                            <StatusButton variant="confirmed" disabled={booking.booking_status === "confirmed"} onClick={() => updateStatus(booking.booking_id, "confirmed")} />
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-gray-400 mt-3">Click any booking to complete, mark no-show, or reset.</p>
            </div>
            <Toaster position="top-center" />
        </main>
    );
}