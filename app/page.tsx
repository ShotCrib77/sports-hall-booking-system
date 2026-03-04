"use client";

import LogoutButton from "./components/LogoutButton";
import LoginButton from "./components/LoginButton";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";

export default function Home() {
    const { userRole, loading } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(userRole !== null);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center font-mono">
            <div className="flex flex-col items-center justify-center bg-gray-50 w-1/2 rounded-md min-h-screen">
                <h1 className="bold text-5xl text-black mb-4">Welcome!</h1>
                {loading ? <p>Loading...</p> : (isLoggedIn ? <LogoutButton /> : <LoginButton />)}
            
            </div>
        


        </div>
    );
}
