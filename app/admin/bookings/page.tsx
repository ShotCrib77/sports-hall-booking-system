"use client";

import { useCallback, useEffect, useState } from "react";
import DateTab from "../../components/DateTab";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import Tabel from "../../components/Tabel";

const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

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

                <Tabel
                    courts={courts}
                    times={times}
                    activeCell={activeCell}
                    getBooking={getBooking}
                    setActiveCell={setActiveCell}
                    updateStatus={updateStatus}
                />

            </div>
            <Toaster position="top-center" />
        </main>
    );
}