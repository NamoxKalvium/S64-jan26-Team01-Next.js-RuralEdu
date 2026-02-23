import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = "secret";
const key = new TextEncoder().encode(process.env.JWT_SECRET || secretKey);

async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ["HS256"],
        });
        return payload?.user as { role: string; id: string } | undefined;
    } catch (error) {
        return undefined;
    }
}

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    // 1. Decrypt session if it exists
    let user = undefined;
    if (session) {
        user = await verifyToken(session);
    }

    // 2. Define protected routes
    const isTeacherRoute = pathname.startsWith("/teacher");
    const isStudentRoute = pathname.startsWith("/student");
    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");
    const isHome = pathname === "/";

    // 3. Handle Unauthenticated Users trying to access protected routes
    if (!user && (isTeacherRoute || isStudentRoute)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 4. Handle Authenticated Users
    if (user) {
        const { role } = user;

        // Redirect from Auth pages (Login/Signup) or Home to Dashboard
        if (isAuthRoute || isHome) {
            if (role === "TEACHER") {
                return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
            } else if (role === "LEARNER") {
                return NextResponse.redirect(new URL("/student/dashboard", request.url));
            }
        }

        // Role-Based Access Control
        // Teacher trying to access Student routes
        if (isStudentRoute && role === "TEACHER") {
            return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
        }

        // Student trying to access Teacher routes
        if (isTeacherRoute && role !== "TEACHER") {
            return NextResponse.redirect(new URL("/student/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
