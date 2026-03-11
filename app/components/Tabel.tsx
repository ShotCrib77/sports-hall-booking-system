import StatusButton from "./StatusButton";
import StatusCard from "./StatusCard";

interface TabelProps {
    courts: Court[];
    times: string[];
    activeCell: number | null;
    getBooking: (court: Court, time: string) => AdminBooking | undefined;
    setActiveCell: (id: number | null) => void 
    updateStatus: (bookingId: number, status: string) => void;
}

export default function Tabel({ courts, times, activeCell, getBooking, setActiveCell, updateStatus }: TabelProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 ">
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
                    {times.map((time, i) => (
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
    )
}