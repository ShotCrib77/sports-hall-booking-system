"use client";

import LogoutButton from "./components/LogoutButton";
import LoginButton from "./components/LoginButton";
import { useAuth } from "./context/AuthContext";
import Link from "next/link";

export default function Home() {
    const { userRole, loading } = useAuth();
    const isLoggedIn = userRole !== null

    return (
        <div className="min-h-screen flex flex-col justify-center items-center font-mono">
            <div className="flex flex-col items-center justify-center w-1/2 rounded-md min-h-screen">
                <h1 className="bold text-5xl text-black mb-4">Welcome!</h1>
                {loading ? <p>Loading...</p> : (isLoggedIn ? 
                    <Link
                        href="/booking"
                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors hidden md:block"
                    >
                        + Book a slot
                    </Link> : <LoginButton />
                )}
            </div>
        </div>
    );
}
