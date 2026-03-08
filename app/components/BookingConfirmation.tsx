import { useState } from "react";

interface BookingConfirmationProps {
    courtName: string;
    date: string;
    time: string;
    handleRemove: (booking: Omit<UserBooking, "court_id">) => void;
}

export default function BookingConfirmation({courtName, date, time, handleRemove}: BookingConfirmationProps) {
    const [confirmPending, setConfirmPending] = useState(false);
    const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    
    const formattedTime = `${time} - ${String((parseInt(time) + 1) % 24).padStart(2, "0")}:00`;

    return (
        <div className="flex justify-between">
            <div className="flex items-center gap-4">
                <div
                    className="px-3 py-2 text-sm md:text-base rounded-md font-bold bg-green-100 text-green-700"
                >
                    {formattedTime}
                </div>
                <div className="flex flex-col">
                    <h3 className="font-semibold md:text-lg">{courtName}</h3>
                    <h4 className="text-sm md:text-base text-gray-600">{formattedDate}</h4>
                </div>
            </div>
            <button 
                title={confirmPending ? "Click again to remove" : "Remove slot"}
                onClick={() => {
                    if (confirmPending) {
                        handleRemove({court_name: courtName, booked_date: date, booked_time: time});
                    } else {
                        setConfirmPending(true);
                    }
                }}
                onBlur={() => setConfirmPending(false)}
                className={`mr-2 transition-colors ${confirmPending ? "text-red-500" : "text-gray-500"}`}
            >
                ✖
            </button>
        </div>
    );
}