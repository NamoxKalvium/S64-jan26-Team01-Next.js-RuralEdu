📖 Overview

Routing is one of the most important features of any web application.
It defines how users navigate between pages, how data is loaded, and how access control is enforced.

This project demonstrates the power of the Next.js 13+ App Router, including:

✅ File-based routing
✅ Public vs Protected pages
✅ Middleware authentication guard
✅ Dynamic routes using route parameters
✅ Global navigation and layouts
✅ Custom 404 handling
✅ SEO + breadcrumbs reflection

By the end, we build a scalable route structure suitable for real-world applications.

🎯 Objectives

This assignment focuses on implementing:

A working route structure using the app/ directory

Public pages (/, /login)

Protected pages (/dashboard, /users/[id])

Middleware-based authentication using JWT stored in cookies

Dynamic routes for user profiles

Layout navigation shared across pages

Custom 404 page handling

Reflection on SEO, breadcrumbs, scalability, and UX

🧠 Understanding Routing in Next.js App Router

Next.js App Router uses file-based routing:

Each folder inside app/ becomes a route

Each page.tsx defines the UI for that route

Dynamic segments use brackets like [id]

📂 Route Structure
app/
 ├── page.tsx               → Home (Public)
 ├── login/
 │    └── page.tsx          → Login Page (Public)
 ├── dashboard/
 │    └── page.tsx          → Dashboard (Protected)
 ├── users/
 │    ├── page.tsx          → Users List (Protected)
 │    └── [id]/
 │         └── page.tsx     → Dynamic User Profile (Protected)
 ├── not-found.tsx          → Custom 404 Page
 └── layout.tsx             → Shared Layout + Navbar

middleware.ts               → Auth Guard for Protected Routes

✅ Key Routing Concepts
File/Folder	Purpose
page.tsx	Defines a route page
layout.tsx	Wraps shared UI (navbar/footer)
[id]/page.tsx	Dynamic route parameter
not-found.tsx	Custom 404 error page
middleware.ts	Runs before route loads (auth protection)
🌍 Public vs Protected Routes

A real application has:

Public Routes

Accessible by anyone:

/

/login

Protected Routes

Require authentication:

/dashboard

/users/[id]

We enforce protection using Next.js Middleware.

🔐 Middleware Authentication Guard
middleware.ts

Middleware runs before a request is completed.
Here we restrict access to protected pages unless a valid JWT exists in cookies.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  if (pathname.startsWith("/login") || pathname === "/") {
    return NextResponse.next();
  }

  // Protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/users")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*"],
};

✅ Key Idea

If token is missing → redirect to login

If token is invalid → redirect to login

If token is valid → allow access

🏠 Public Pages
Home Page (/)
app/page.tsx
export default function Home() {
  return (
    <main className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold">
        Welcome to the App 🚀
      </h1>
      <p>
        Navigate to /login to sign in or /dashboard after login.
      </p>
    </main>
  );
}

Login Page (/login)
app/login/page.tsx
"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();

  function handleLogin() {
    Cookies.set("token", "mock.jwt.token");
    router.push("/dashboard");
  }

  return (
    <main className="flex flex-col items-center mt-10">
      <h1 className="text-xl font-semibold">Login Page</h1>

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
      >
        Login
      </button>
    </main>
  );
}

Behavior

Clicking login sets a cookie token

Redirects user to /dashboard

🛡 Protected Dashboard Page
app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <main className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Only logged-in users can see this page.</p>
    </main>
  );
}

Protected Access Proof
User Status	Result
Not logged in	Redirected to /login
Logged in	Dashboard loads successfully
🔁 Dynamic Routes in Next.js

Dynamic routing allows pages like:

/users/1

/users/42

/users/100

Instead of manually creating separate pages for each user.

Dynamic User Profile Route
app/users/[id]/page.tsx
interface Props {
  params: { id: string };
}

export default async function UserProfile({ params }: Props) {
  const { id } = params;

  const user = { id, name: "User " + id };

  return (
    <main className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-bold">User Profile</h2>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
    </main>
  );
}

Example Output

Visiting /users/5 displays:

User Profile
ID: 5
Name: User 5

✅ Why Dynamic Routes Matter

Supports scalability

Improves SEO with structured URLs

Enables user-specific pages

🧭 Layout Navigation & Shared UI
app/layout.tsx

Layouts wrap all pages automatically.

import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="flex gap-4 p-4 bg-gray-100">
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/users/1">User 1</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}

Breadcrumb Tip

Dynamic routes like /users/[id] should include breadcrumbs:

Home → Users → User 5


This improves:

Navigation

SEO structure

User experience

❌ Custom 404 Page Handling
app/not-found.tsx
export default function NotFound() {
  return (
    <main className="flex flex-col items-center mt-10 text-red-600">
      <h1 className="text-2xl font-bold">
        404 — Page Not Found
      </h1>
      <p>Oops! This route doesn’t exist.</p>
    </main>
  );
}

Behavior

Visiting /random-route displays a friendly custom error page.

📸 Screenshots Required (Assignment Proof)

Include screenshots of:

Home page (/)

Redirect to login when accessing /dashboard unauthenticated

Dashboard after login

Dynamic routes /users/1, /users/2

Navigation bar in layout

Custom 404 page

📝 Reflection & Best Practices
✅ Dynamic Routing Scalability

Dynamic routing avoids creating hundreds of static pages.
Instead, one file handles infinite user profiles.

✅ SEO Benefits

Structured URLs like:

/users/5
/users/42


are more searchable and meaningful than query strings.

✅ Breadcrumbs Improve UX

Breadcrumb navigation helps users understand where they are:

Home → Users → User Profile

✅ Error Handling Matters

Custom not-found.tsx improves professionalism and prevents blank screens.