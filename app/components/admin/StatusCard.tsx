interface StatCardProps {
    bookingId: number;
    bookingStatus: string;
    customerName: string;
    isActive: boolean;
    setActiveCell: (isActive: number | null) => void;
};

const styleVariants: Record<string, string> = {
    confirmed: "bg-blue-50 border border-blue-200 text-blue-700",
    completed: "bg-emerald-50 border border-emerald-200 text-emerald-700",
    no_show: "bg-red-50 border border-red-200 text-red-400 line-through opacity-60",
};

export default function StatusCard({ bookingId, bookingStatus, customerName, isActive, setActiveCell }: StatCardProps) {
    return (
        <div
            className={`rounded-md px-2.5 py-1.5 cursor-pointer transition-all select-none ${styleVariants[bookingStatus] ?? ""}`}
            onClick={() => setActiveCell(isActive ? null : bookingId)}
        >
            <div className="font-medium text-xs truncate">{customerName}</div>
            <div className="text-xs opacity-70 mt-0.5">{bookingStatus}</div>
        </div>
    );
}