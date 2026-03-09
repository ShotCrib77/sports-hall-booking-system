"use client"
import { useEffect, useState } from "react";
import { Calendar } from "../components/ui/calendar";
import AvailableTimes from "../components/AvailableTimes";
import { useRouter } from "next/navigation";
import SportsSelection from "../components/SportsSelection";
import { motion } from "framer-motion"

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function BookingPage() {
    const router = useRouter();
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [bookings, setBookings] = useState<BookingSummary[]>([]);
    const [allCourts, setAllCourts] = useState<Court[]>([])
    const [courts, setCourts] = useState<Court[]>([])
    
    const [selectedSport, setSelectedSport] = useState("Tennis");

    const [selectedBookings, setSelectedBookings] = useState<BookingSummary[]>([])
    const highlightedDates = [...new Set(selectedBookings.map(booking => booking.booked_date))].map(dateStr => new Date(dateStr + "T00:00:00"))

    const dateLabel = date ? `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}` : "Select a date";
    const formattedDate = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : ""
    const bookedBookings = bookings.filter((booking) => booking.booked_date === formattedDate);

    
    const sports = [...new Set(allCourts.map((court) => court.sport))]

    const handleSelect = (booking: BookingSummary) => {
        setSelectedBookings(prev => {
            const exists = prev.some(s => 
                s.court_id === booking.court_id && 
                s.booked_time === booking.booked_time && 
                s.booked_date === booking.booked_date
            );
            if (exists) {
                return prev.filter(s => !(
                    s.court_id === booking.court_id && 
                    s.booked_time === booking.booked_time && 
                    s.booked_date === booking.booked_date
                ));
            }
            return [...prev, booking];
        })
    }

    const getBookings = async () => {
        const today = new Date()
        const formattedCurrentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
        console.log(`/api/bookings?startDate=${formattedCurrentDate}&days=40`)
        const res = await fetch(`/api/bookings?startDate=${formattedCurrentDate}&days=40`);
        const { bookings: fetchedBookings }: { bookings: BookingSummary[] } = await res.json();
        console.log(fetchedBookings)
        fetchedBookings.forEach(booking => booking.booked_time = booking.booked_time.slice(0, 5))
        return fetchedBookings;
    }

    const getCourts = async () => {
        const res = await fetch(`/api/courts`);
        const { courts: fetchedCourts }: { courts: Court[] } = await res.json();
        return fetchedCourts;
    }
    
    const handleConfirmation = () => {
        const pendingBookings: UserBooking[] = selectedBookings.map((booking) => ({
            ...booking,
            court_name: allCourts.find((c) => c.court_id === booking.court_id)?.court_name ?? "Unknown Court",
        }));
        localStorage.setItem("pendingBookings", JSON.stringify(pendingBookings))
        router.push("booking/confirm")
    }

    useEffect(() => {
        const fetchData = async () => {
            const fetchedBookings = await getBookings();
            setBookings(fetchedBookings);
            const fetchedCourts = await getCourts();
            setAllCourts(fetchedCourts);
        }
        fetchData()
    }, [])

    useEffect(() => {
        const filterCourts = () => {
            const filteredCourts = allCourts.filter(court => court.sport === selectedSport.toLowerCase())
            setCourts(filteredCourts)
        }
        filterCourts()
    }, [selectedSport, allCourts])

    return (
        <main>
            <section className="flex rounded-lg bg-white w-full min-h-[calc(100vh-80px)]">
                <div className="p-6 flex flex-col md:flex-row gap-8 w-full">
                    <div className="w-1/4 shrink-0">
                        <div>
                            <h2 className="text-base text-green-500 uppercase tracking-[1px] font-semibold">Select a sport</h2>
                            <SportsSelection sports={sports} selectedSport={selectedSport} setSelectedSport={setSelectedSport} />
                        </div>
                        {/* Calendar */}
                        <div>
                            <h2 className="text-base text-green-500 uppercase tracking-[1px] font-semibold">Select a date</h2>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <Calendar
                                    modifiers={{ highlighted: highlightedDates }}
                                    modifiersClassNames={{ highlighted: "bg-green-600/50 rounded-md hover:bg-green-700/70 [&_button]:hover:bg-green-500/60 text-white" }}
                                    disabled={{ before: new Date() }}
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-lg [&_.rdp-day_button]:text-lg [--cell-size:--spacing(10)]"
                                    classNames={{
                                        weekday: "flex-1 rounded-md text-base font-normal text-muted-foreground select-none",
                                        caption_label: "text-lg font-semibold",
                                    }}
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* Divider — hidden on mobile */}
                    <div className="hidden md:block self-stretch w-px bg-gray-200" />

                    {/* Time selection */}
                    <div className="flex flex-col flex-1 pb-10 relative">
                        <h2 className="text-base text-green-500 uppercase tracking-[1px] font-semibold">Select a time</h2>
                        <h1 className="pb-2 font-bold text-2xl">{dateLabel}</h1>

                        <div className="max-w-xl">
                            <AvailableTimes
                                bookings={bookedBookings}
                                courts={courts}
                                date={formattedDate}
                                selectedBookings={selectedBookings}
                                handleSelect={handleSelect}
                            />
                        </div>


                        {/* Footer */}
                        <div className="absolute bottom-0 w-full pt-4 flex justify-between items-center md:border-t">
                            <div className="flex items-center text-base">
                                <span className="text-gray-500">{selectedBookings.length} slots selected</span>
                                <button
                                    onClick={() => setSelectedBookings([])}
                                    className="text-gray-500"
                                >
                                    &nbsp;— Clear
                                </button>
                            </div>
                            <button
                                disabled={selectedBookings.length === 0}
                                onClick={() => handleConfirmation()}
                                className={`px-6 py-1.5 text-lg font-bold rounded-md transition-colors ${
                                    selectedBookings.length === 0
                                        ? "bg-gray-200 text-gray-500 cursor-default"
                                        : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                            >
                                Book
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}

