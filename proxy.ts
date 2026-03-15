import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
export async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    
    console.log("PATH:", req.nextUrl.pathname);
    console.log("TOKEN:", token);
    console.log("ALL COOKIES:", req.cookies.getAll());
    
    if (!token) {
        console.log("No token?")
        const redirectTo = encodeURIComponent(req.nextUrl.pathname);
        return NextResponse.redirect(new URL(`/login?redirectTo=${redirectTo}`, req.url));
    }
    
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET_KEY) {
        console.error("JWT secret key is not defined");
        return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET_KEY));
        console.log(payload);
        if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }

    } catch (error) {
        console.error(error)
        const redirectTo = encodeURIComponent(req.nextUrl.pathname);
        return NextResponse.redirect(new URL(`/login?redirectTo=${redirectTo}`, req.url));
    }
}

export const config = {
    matcher: ["/booking/:path+", "/admin/:path*", "/reservations"]
}