"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { userRole, loading } = useAuth();
    const isLoggedIn = userRole !== null
    
    const pathname = usePathname()
    const isActive = (href: string) => pathname === href

    useEffect(() => {
        const handleChangePage = () => {
            setOpen(false);  
        }
        handleChangePage();
    }, [pathname])

    return (
        <header className="bg-white border-b-2 h-20 text-xl flex items-center px-8 text-gray-800">
            <h1 className="text-3xl font-bold text-green-700">Courtside</h1>
            <nav className="hidden md:flex items-center ml-auto text-lg">
                <div className="px-6 py-1 border-r border-gray-400 mr-6 gap-8 flex *hover:underline">
                    <Link href="/" className={isActive("/") ? "font-bold" : "font-normal text-gray-500"}>Home</Link>
                    <Link href="/booking" className={isActive("/booking") ? "font-bold" : "font-normal text-gray-500"}>Book a slot</Link>
                    <Link href="/reservations" className={isActive("/reservations") ? "font-bold" : "font-normal text-gray-500"}>My bookings</Link>
                </div>
                {loading ? <p>Loading...</p> : (isLoggedIn ? <LogoutButton /> : <LoginButton />)}
            </nav>

            <div className="md:hidden ml-auto">
                <HamburgerButton open={open} toggle={() => setOpen(!open)} />
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-20 left-0 right-0 bg-white border-b-2 flex flex-col px-8 py-4 gap-4"
                    >
                        <Link href="/" className={isActive("/") ? "font-bold" : "font-normal text-gray-500"}>Home</Link>
                        <Link href="/booking" className={isActive("/booking") ? "font-bold" : "font-normal text-gray-500"}>Book a slot</Link>
                        <Link href="/reservations" className={isActive("/reservations") ? "font-bold" : "font-normal text-gray-500"}>My bookings</Link>
                        {loading ? <p>Loading...</p> : (isLoggedIn ? <LogoutButton /> : <LoginButton />)}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function HamburgerButton({ open, toggle }: {open: boolean, toggle: () => void}) {
    return (
        <button onClick={toggle} className="flex flex-col gap-1.5 p-2">
            <motion.span
                animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="block w-6 h-0.5 bg-gray-800 origin-center"
            />
            <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-0.5 bg-gray-800"
            />
            <motion.span
                animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="block w-6 h-0.5 bg-gray-800 origin-center"
            />
        </button>
    )
}