"use client";

import { useState } from "react";

export default function LogoutButton() {
    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await fetch("/api/logout", { method: "POST" });
            window.location.reload();
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setIsLoading(false);
        }
    }
    const [isLoading, setIsLoading] = useState(false)
    
    return (
        <button disabled={isLoading} onClick={handleLogout} className="bg-green-500 hover:bg-green-600 text-white px-6 py-1 rounded-full">Logout</button>
    );
}