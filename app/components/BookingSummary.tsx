import Link from "next/link";
import { SummaryField } from "./SumnmaryField"

export function BookingSummary({ bookings } : { bookings: UserBooking[] }) {
    const totalSlots = bookings?.length ?? 0;
    const uniqueCourts = [...new Set(bookings.map((booking) => booking.court_name))].join("\n");

    const dates = [...new Set(bookings.map((booking) => booking.booked_date))]
    const formattedDates = dates.map(date => new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    })).join("\n");

    return (
        <div className="w-full md:w-1/3 flex flex-col">
            <div className="text-sm md:text-base font-semibold text-green-500 uppercase tracking-[1px] mb-1.5">
                Summary
            </div>
            <div className="text-2xl font-bold mb-4">
                {totalSlots} slot{totalSlots !== 1 ? "s" : ""}
            </div>

            <div className="flex flex-col gap-4">
                <SummaryField label="Dates" value={formattedDates} />
                <SummaryField label="Duration" value={`${totalSlots}h total`} />
                <SummaryField label="Courts" value={uniqueCourts} />
            </div>

            <div className="mt-auto">
                <Link
                    href="/booking"
                    className="text-gray-500 text-base font-medium bg-transparent border-none cursor-pointer p-0 hover:text-gray-600 transition-colors hidden md:block"
                >
                    ← Go back
                </Link>
            </div>
        </div>
    );
}