"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { userRole, loading } = useAuth();
    const isLoggedIn = userRole !== null
    
    const pathname = usePathname()
    const isActive = (href: string) => pathname === href

    return (
        <header className="bg-white border-b-2 h-20 text-xl flex items-center px-8 text-gray-800">
            <h1 className="text-3xl font-bold text-green-700">Courtside</h1>
            <nav className="flex items-center ml-auto text-lg">
                <div className="px-6 py-1 border-r border-gray-600 mr-6 gap-8 flex *hover:underline">
                    <Link href="/" className={isActive("/") ? "font-bold" : "font-normal text-gray-500"}>Home</Link>
                    <Link href="/booking" className={isActive("/booking") ? "font-bold" : "font-normal text-gray-500"}>Book a slot</Link>
                    <Link href="/reservations" className={isActive("/reservations") ? "font-bold" : "font-normal text-gray-500"}>My bookings</Link>
                </div>
                {loading ? <p>Loading...</p> : (isLoggedIn ? <LogoutButton /> : <LoginButton />)}
            </nav>
        </header>
    );
}