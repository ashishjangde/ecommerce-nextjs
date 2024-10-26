import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((request) => {
    const { nextUrl } = request;
    const isLoggedIn = !!request.auth?.user.id;

    const publicPaths = ["/login", "/signup", "/forget-password"];
    const isPublicPath = publicPaths.some(path => nextUrl.pathname.startsWith(path));

    console.log(`User is logged in: ${isLoggedIn}`);
    console.log(`Requesting path: ${nextUrl.pathname}`);
    console.log(`Is public path: ${isPublicPath}`);

    if (isLoggedIn && isPublicPath) {
        console.log(`Redirecting logged in user from ${nextUrl.pathname} to home page`);
        return NextResponse.redirect(new URL("/", nextUrl)); 
    }

    if (!isLoggedIn && !isPublicPath) {
        console.log(`Redirecting to login from ${nextUrl.pathname}`);
        return NextResponse.redirect(new URL("/login", nextUrl));
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
