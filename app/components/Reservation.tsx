export default function Reservation({ reservation }: { reservation: Reservation } ) {
    const formattedDate = new Date(reservation.booked_date + "T00:00:00").toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    
    const formattedTime = `${reservation.booked_time} - ${String((parseInt(reservation.booked_time) + 1) % 24).padStart(2, "0")}:00`;
    return (
        <div>
                <div
                    className="px-3 py-2 text-sm md:text-base rounded-md font-bold bg-green-100 text-green-700"
                >
                    {formattedTime}
                </div>
        </div>
    );
}