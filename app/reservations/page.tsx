"use client";

import { useState, useEffect, useRef } from "react";
import ReservationCard from "../components/ReservationCard";
import StatCard from "../components/StatCard";
import Link from "next/link";
import { toast } from "sonner"
import { Toaster } from "../components/ui/sonner";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type Tab = "upcoming" | "past";
export default function MyReservationsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hasShownToast = useRef(false);
    const success = searchParams.get("success")
    const amount = searchParams.get("amount")

    const [loadingCancel, setLoadingCancel] = useState(false);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("upcoming");

    const getReservations = async () => {
        const res = await fetch("/api/reservations");
        const fetchedReservations: Reservation[] = await res.json();
        fetchedReservations.forEach(reservation => reservation.booked_time = reservation.booked_time.slice(0, 5))
        setReservations(fetchedReservations);
        setLoading(false);
    };

    useEffect(() => {
        getReservations();
        if (success && !hasShownToast.current) {
            hasShownToast.current = true;
            toast.message(`Successfully added ${amount} booking(s)`)
            router.replace(pathname, { scroll: false });
        }
    }, []);

    const handleCancel = async (bookingId: number) => {
        setLoadingCancel(true);
        try {
            const res = await fetch("/api/bookings/cancel", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({bookingId})
            });

            if (res.ok) {
                toast.message("Succesfully cancelled booking!")
                await getReservations();
            } else {
                toast.error("Something went wrong, please try again.");
            }
        } catch {
            toast.error("Network error, please try again.");
        } finally {
            setLoadingCancel(false);
        }
    };

    const upcoming = reservations.filter(r => r.booking_status === 'confirmed');
    const past = reservations.filter(r => r.booking_status !== 'confirmed');

    const nextReservation = upcoming[0];
    const nextDate = nextReservation ? 
        new Date(nextReservation.booked_date).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "long",
        }
    ) : "None scheduled";
    const displayed = activeTab === "upcoming" ? upcoming : past;

    return (
        <main className="min-h-screen bg-white font-sans">

            <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12">
                <div className="flex items-end justify-between mb-9">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-green-500 mb-1.5">
                            Reservations
                        </p>
                        <h1 className="text-[2rem] font-bold tracking-tight text-gray-900 leading-none">
                        Your bookings
                        </h1>
                    </div>
                    <Link
                        href="/booking"
                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors hidden md:block"
                    >
                        + Book a slot
                    </Link>
                </div>

                <div className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start">
                    <StatCard
                        label="Upcoming"
                        value={loading ? "–" : upcoming.length}
                        sub={`Next: ${nextDate}`}
                        green
                    />
                    <StatCard
                        label="Total hours played"
                        value={loading ? "–" : `${past.filter(r => r.booking_status !== "no_show").length}h`}
                        sub="This month"
                    />
                </div>

                <div className="flex gap-1 border-b border-gray-200 mb-6">
                {(["upcoming", "past"] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`capitalize text-sm font-medium px-4 py-2.5 border-b-2 -mb-px transition-colors ${
                            activeTab === tab
                            ? "text-gray-900 border-green-500"
                            : "text-gray-400 border-transparent hover:text-gray-700"
                        }`}
                    >
                        {tab}
                    <span
                        className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                        activeTab === tab
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                    >
                        {tab === "upcoming" ? upcoming.length : past.length}
                    </span>
                    </button>
                ))}
                </div>

                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-22 bg-white border border-gray-100 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : displayed.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-sm">
                        {activeTab === "upcoming"
                            ? "No upcoming reservations. Go book a slot!"
                            : "No past reservations yet."}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {displayed.map((r, index) => (
                            <ReservationCard
                                key={`${r.court_id}-${r.booked_date}-${r.booked_time}`}
                                index={index}
                                reservation={r}
                                isPast={activeTab === "past"}
                                onCancel={handleCancel}
                                loadingCancel={loadingCancel}
                            />
                        ))}
                    </div>
                )}
            </div>
            <Toaster position="top-center" />
        </main>
    );
}