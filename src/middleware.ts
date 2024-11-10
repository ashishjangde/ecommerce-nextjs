import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((request) => {
    const { nextUrl } = request;
    const isLoggedIn = !!request.auth?.user.id;

    const publicPaths = ["/login", "/signup", "/forget-password"];
    const isPublicPath = publicPaths.some(path => nextUrl.pathname.startsWith(path));


    if (isLoggedIn && isPublicPath) {
        return NextResponse.redirect(new URL("/", nextUrl)); 
    }

    return NextResponse.next(); 
});

export const config = {
    matcher: [
        "/login",
        "/signup",
        "/forget-password",
        "/dashboard/:path*",
        "/",
    ],
};