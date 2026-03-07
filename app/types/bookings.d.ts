type BookingSlot = {
    time: string;
    booked: boolean;
}

type Court = {
    courtId: number;
    name: string;
    slots: BookingSlot[];
}

type TimesObject = {
    courts: Court[];
}

type SelectedSlot = {
    courtId: number;
    slot: BookingSlot;
    date: string;
}

type MonthAvailability = Record<string, TimesObject>

type BookingRow = {
    user_id: number
    court_id: number
    booked_date: string
    booked_time: string
    booking_status: "confirmed" | "cancelled" | "completed" | "no_show"
    created_at: Date
}

type Booking = {
    user_id: number
    court_id: number
    booked_date: string
    booked_time: string
    booking_status: "confirmed" | "cancelled" | "completed" | "no_show"
    created_at: string
}

type BookingSummary = Pick<Booking, "court_id" | "booked_date" | "booked_time">

type User = {
    user_id: number
    first_name: string | null
    last_name: string | null
    email: string
    role: "customer" | "admin"
    is_banned: boolean
    created_at: string
}

type Court = {
    court_id: number
    court_name: string
    sport: string | null
}