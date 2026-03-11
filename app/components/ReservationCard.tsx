"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"
import DateTooltip from "./DateTooltip";

interface ReservationCardProps {
    index: number;
    reservation: Reservation;
    isPast?: boolean;
    onCancel?: (bookingId: number) => void;
    loadingCancel: boolean;
}

export default function ReservationCard({ index, reservation, isPast = false, onCancel, loadingCancel }: ReservationCardProps) {
    const [confirming, setConfirming] = useState(false)
    const date = new Date(reservation.booked_date);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "short" });
    const weekday = date.toLocaleString("en-GB", { weekday: "short" });

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!confirming) return;
        const handler = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                setConfirming(false)
            };
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [confirming]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.1 }}
            className={`bg-gray-50 border-2 rounded-2xl px-4 sm:px-6 py-5 flex items-center gap-5 transition-shadow hover:shadow-md ${isPast ? "border-gray-100 opacity-80" : "border-gray-100"}`}
        >
            <DateTooltip text={date.toISOString().slice(0, 10)}>
                <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl shrink-0 ${isPast ? "bg-gray-50 border" : "bg-white border"}`} >
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isPast ? "text-gray-400" : "text-green-500"}`}>
                        {month}
                    </span>

                    <span className="text-xl font-bold leading-tight text-gray-900">
                        {day}
                    </span>

                    <span className="text-xs text-gray-400">
                        {weekday}
                    </span>
                </div>
            </DateTooltip>

            {/* Info */}
            <div className="flex-1 min-w-0 flex items-center gap-4">
                <div className="flex flex-col items-center gap-">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isPast ? "bg-gray-100 text-gray-400" : "bg-green-50 text-green-600"}`}>
                        {reservation.court_name}
                    </span>

                    <span className={`font-mono text-sm font-medium px-2.5 py-0.5 rounded-md ${isPast ? "bg-gray-100 text-gray-400" : "bg-green-500 text-white"}`}>
                        {reservation.booked_time}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="relative" ref={ref}>
                {!isPast && (
                    confirming ? (
                        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-lg rounded-xl p-3 flex flex-col gap-2 w-48 z-10">
                            <span className="text-sm text-gray-600 font-medium">Cancel this booking?</span>
                            <div className="flex gap-2">
                                <button
                                    disabled={loadingCancel}
                                    onClick={() => onCancel?.(reservation.booking_id)}
                                    className="flex-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors px-1 py-1 rounded-lg"
                                >
                                    {loadingCancel ? "Cancelling" : "Yes, cancel"}
                                </button>
                                <button
                                    onClick={() => setConfirming(false)}
                                    className="flex-1 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors px-1 py-1 rounded-lg"
                                >
                                    Keep
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="text-sm font-semibold text-red-500 bg-red-100 hover:bg-red-200 transition-colors px-3.5 py-1.5 rounded-lg"
                            onClick={() => setConfirming(true)}
                        >
                            Cancel
                        </button>
                ))}
            </div>
            
            {(isPast && reservation.booking_status === "no_show") && (
                <div className="text-sm font-semibold text-red-500 px-3.5 py-1.5">
                    Missed
                </div>
            )}

        </motion.div>
    );
}