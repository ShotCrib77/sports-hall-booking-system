import Time from "./Time";

interface AvailableTimesProps {
    bookings: BookingSummary[];
    courts: Court[];
    date: string;
    selectedSlots: BookingSummary[];
    handleSelect: (booking: BookingSummary) => void;
}

export default function AvailableTimes({bookings, courts, date, selectedSlots, handleSelect} : AvailableTimesProps) {
    const baseArray = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

    return (
        <div className="flex flex-col gap-6 pr-12">
            {courts.map(court => (
                <div key={court.court_id}>
                    <h2 className="mb-1">{court.court_name} - 1h</h2>
                    <div className="grid grid-cols-5 gap-4">
                        {baseArray.map(time => {
                            const booking = bookings.filter(
                                b => b.booked_time === time && b.court_id === court.court_id
                            )
                            return booking.length ? 
                                    <Time 
                                        key={time}
                                        booked={true}
                                        time={booking[0].booked_time}
                                        date={booking[0].booked_date}
                                        courtId={booking[0].court_id}
                                    /> :
                                    <Time 
                                        key={time} 
                                        time={time} 
                                        date={date} 
                                        courtId={court.court_id} 
                                        selected={selectedSlots.some(booking => booking.court_id === court.court_id && booking.booked_date === date && booking.booked_time === time)}
                                        handleSelect={handleSelect}
                                    />
                            })
                        }
                    </div>
                </div>
            ))}
        </div>
    );
}