"use client";

import { useEffect, useState } from "react";
import BookingConfirmation from "../../components/BookingConfirmation";
import Link from "next/link";
import { BookingSummary } from "../../components/BookingSummary";
import { useRouter } from "next/navigation";
import { Toaster } from "../../components/ui/sonner";
import { toast } from "sonner"

export default function ConfirmBooking() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<UserBooking[] | null>(null);
    const [loadingFetch, setLoadingFetch] = useState(false);

    useEffect(() => {
        const getBookings = () => {
            const storage = localStorage.getItem("pendingBookings");
            setBookings(storage ? JSON.parse(storage) : null);
            setLoading(false);
        }
        getBookings();

        window.addEventListener("focus", getBookings); // re-read when user "comes back"
        return () => window.removeEventListener("focus", getBookings);
    }, []);


    useEffect(() => {
        if (!loading && (!bookings || bookings.length === 0)) {
            setTimeout(() => router.push("/booking"), 500);
        }
    }, [bookings, loading, router]);

    const handleRemove = (booking: Omit<UserBooking, "court_id">) => {
        setBookings(prev => {
            return prev!.filter(b => !(
                b.court_name === booking.court_name && 
                b.booked_time === booking.booked_time && 
                b.booked_date === booking.booked_date
            ))
        });
        const storage = localStorage.getItem("pendingBookings");
        if (storage) {
            const parsed: UserBooking[] = JSON.parse(storage);
            const updated = parsed.filter(b => !(
                b.court_name === booking.court_name &&
                b.booked_time === booking.booked_time && 
                b.booked_date === booking.booked_date
            ));
            localStorage.setItem("pendingBookings", JSON.stringify(updated));
        }
    }

    const handleConfirm = async () => {
        if (!bookings || bookings.length === 0) return;

        setLoadingFetch(true);
        try {
            const isBulk = bookings.length > 1;
            const res = await fetch(isBulk ? "/api/bookings/bulk" : "/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(isBulk ? bookings : bookings[0])
            });

            if (res.ok) {
                localStorage.removeItem("pendingBookings")
                router.push(`/reservations?success=true&amount=${bookings.length}`);
            } else {
                toast.error("Something went wrong, please try again.");
            }
        } catch {
            toast.error("Network error, please try again.");
        } finally {
            setLoadingFetch(false);
        }
    };
    
    return (
        <main>
            {bookings && (
                <section className="flex rounded-lg bg-white w-full min-h-[calc(100vh-80px)]">
                    <div className="p-6 flex flex-col md:flex-row gap-6 w-full">
                        <BookingSummary bookings={bookings} />

                        <div className="hidden md:block self-stretch w-px bg-gray-200" />

                        <div className="relative w-full flex flex-col pb-10">
                            <h2 className="text-sm md:text-base font-semibold text-green-500 uppercase tracking-[1px] mb-1.5">
                                Confirm slots
                            </h2>
                            <h1 className="text-2xl font-bold pb-4">Review & book</h1>
                            <hr className="mb-4" />
                            <div className="flex flex-col pb-2 md:pb-0 mb-6">
                                {bookings.map((booking, index) => (
                                    <div key={`${booking.court_id}-${booking.booked_date}-${booking.booked_time}`}>
                                        <BookingConfirmation
                                            index={index}
                                            courtName={booking.court_name}
                                            date={booking.booked_date}
                                            time={booking.booked_time}
                                            handleRemove={handleRemove}
                                        />
                                        {(index < bookings.length - 1 || bookings.length === 1) && <hr className="my-4" />}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 flex justify-between items-center absolute bottom-0 w-full md:border-t">
                                <span className="text-sm md:text-base text-gray-500">{bookings.length} slots to confirm</span>
                                <div className="flex gap-4 md:gap-8">
                                    <Link
                                        href="/booking"
                                        className="px-3 md:px-4 py-1 md:text-lg font-bold rounded-md bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                    >
                                        Cancel
                                    </Link>

                                    <button
                                        disabled={loadingFetch}
                                        onClick={handleConfirm}
                                        className="px-3 md:px-4 py-1 md:text-lg font-bold rounded-md bg-green-500 text-white hover:bg-green-600"
                                    >
                                        {!loadingFetch ? "Confirm" : "Confirming..."}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Toaster position="top-center" />
                </section>
            )}
        </main>
    );
}