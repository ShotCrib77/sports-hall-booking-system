import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET_KEY) {
        console.error("JWT secret key is not defined");
        return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET_KEY));
            
        if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }

    } catch (error) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/booking/:path*", "/admin/:path*"]
}