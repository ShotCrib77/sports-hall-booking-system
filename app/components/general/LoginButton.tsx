"use client";
import Link from "next/link";

export default function LoginButton() {
    
    return (
        <Link href="/login" className="bg-green-500 hover:bg-green-600 text-white px-6 py-1 rounded-full">Login</Link>
    );
}