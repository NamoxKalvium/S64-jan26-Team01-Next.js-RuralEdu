import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
    const session = req.cookies.get('session')?.value;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

    if (!session) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        await jwtVerify(session, secret);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/home/:path*'],
};
