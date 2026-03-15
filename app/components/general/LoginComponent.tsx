"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react" ;
import { useRouter, useSearchParams } from "next/navigation";
import SuccessfulAuthentification from "./SuccessfulAuthentification";

export default function LoginComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = decodeURIComponent(searchParams.get("redirectTo") ?? "/")

    const [successful, setSuccessful] = useState(false)

    const handleLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const newFormErrors = {
            email: !email.trim(),
            password: !password.trim()
        };
        
        setFormErrors(newFormErrors);
        
        if (newFormErrors.email || newFormErrors.password) {
            return;
        }
        
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (!res.ok) {
                setApiError(true)
            } else {
                setSuccessful(true);
                window.location.href = redirectTo
                console.log("What da helli")
            }
        
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false)
        }
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({ email: false, password: false });
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(false)

    return (
        <main className="min-h-screen flex flex-col justify-center items-center font-mono">
            {successful ? <SuccessfulAuthentification authType="Login" /> : <div/>}

            <form onSubmit={handleLogin} className="flex flex-col text-center xs:w-full md:w-lg lg:w-xl xl:w-2xl p-12 gap-8 bg-white rounded-2xl text-black">
                <h1 className="font-bold text-4xl">
                    Login
                </h1>
                
                <div className="flex flex-col text-sm text-left gap-2">
                    <h2 className="text-xl">Email</h2>
                    <input 
                        type="text"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter email"
                        className={`text-lg outline-0 border-black border p-2 ${formErrors.email ? "border-red-600" : ""}`}
                    />
                    {formErrors.email ? <span className="text-red-600 mb-4">Input can&apos;t be empty</span> : <div className="mb-4"/>}

                    <h2 className="text-xl">Password</h2>
                    <div className="flex flex-col gap-2">
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className={`text-lg outline-0 border-black border p-2 w-full ${formErrors.password ? "border-red-600" : ""}`}
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>

                        {formErrors.password ? <span className="text-red-600">Input can&apos;t be empty</span> : <></>}
                    </div>
                    <Link href="" className="text-lg self-end text-blue-800">Forgot password?</Link>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        type="submit" 
                        disabled={isLoading}
                        className="text-xl border-2 w-fit py-2 px-4 self-center rounded-lg"
                    >
                        {isLoading ? "Loging in..." : "Login"}
                    </button>
                    {apiError ? <span className="my-2 text-red-600">Incorrect username/email or password</span> : <div/>}
                    <Link href={`/register?redirectTo=${redirectTo}`} className="text-blue-800 text-lg">Don&apos;t have an account? Sign up!</Link>
                </div>
            </form>
        </main>
    );
}