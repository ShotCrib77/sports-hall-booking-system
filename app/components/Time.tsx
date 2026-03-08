interface TimeProps {
    booked?: boolean;
    courtId: number;
    date: string;
    time: string;
    selected?: boolean;
    handleSelect?: (booking: BookingSummary) => void;
}

export default function Time({ booked = false, courtId, date, time, selected, handleSelect }: TimeProps) {
    return booked ? (
        <button 
            disabled
            className="w-16 h-10 text-xs rounded-md font-semibold bg-gray-50 text-gray-300 line-through decoration-2 cursor-not-allowed"
        >
            {time}
        </button >
    ) : (
        <button
            onClick={() => handleSelect!({court_id: courtId, booked_date: date, booked_time: time})}
            className={`w-16 h-10 text-base rounded-md font-semibold ${selected ? "text-green-800 bg-green-100 border-2 border-green-800 cursor-pointer" : "bg-green-50 text-green-700 cursor-pointer"}`}
        >
            {time}
        </button>
    )
}