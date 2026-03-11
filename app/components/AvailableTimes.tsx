import Time from "./Time";

interface AvailableTimesProps {
    today: Date | undefined;
    bookings: BookingSummary[];
    courts: Court[];
    date: string;
    selectedBookings: BookingSummary[];
    handleSelect: (booking: BookingSummary) => void;
}

const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
export default function AvailableTimes({today, bookings, courts, date, selectedBookings, handleSelect} : AvailableTimesProps) {
    const isPast = (time: string) => {
        if (!today) return false;
        const isToday = date === today.toISOString().split("T")[0];
        return isToday && today.getHours() >= parseInt(time.split(":")[0]);
    };

    return (
        <div className="flex flex-col gap-6 mb-8">
            {courts.map(court => (
                <div key={court.court_id}>
                    <h2 className="mb-1 text-lg font-semibold">{court.court_name} - 1h</h2>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,max-content))] gap-4">
                        {times.map((time, index) => {
                            const existing = bookings.find(
                                b => b.booked_time === time && b.court_id === court.court_id
                            );
                            
                            const past = isPast(time);

                            return (
                                <Time
                                    key={time}
                                    index={index}
                                    time={time}
                                    date={existing ? existing.booked_date : date}
                                    courtId={court.court_id}
                                    booked={!!existing || past}
                                    selected={!existing && selectedBookings.some(
                                        b => b.court_id === court.court_id && b.booked_date === date && b.booked_time === time
                                    )}
                                    handleSelect={!existing ? handleSelect : undefined}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}