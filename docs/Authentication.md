📌 Overview
This assignment focuses on building secure authentication APIs using bcrypt for password hashing and JWT (JSON Web Tokens) for session management in a Next.js (App Router) backend.

Authentication is a critical part of modern web applications. A weak implementation can lead to severe security vulnerabilities such as data leaks or account hijacking.
In this project, we implemented Signup, Login, and Protected Routes following industry best practices.

🎯 Objectives
Implement secure user signup and login APIs

Hash passwords using bcrypt

Generate and validate JWT tokens

Protect private routes using token-based authentication

Document authentication flows clearly and professionally

🧠 Authentication vs Authorization
Concept	Description	Example
Authentication	Verifies who the user is	User logs in with email & password
Authorization	Determines what the user can access	Admin can access /api/admin
📌 This assignment focuses on Authentication.

🧰 Tech Stack & Libraries
Next.js (App Router)

Prisma ORM

PostgreSQL

bcrypt – password hashing

jsonwebtoken (JWT) – token generation & verification

Installed Packages
npm install bcrypt jsonwebtoken
📁 API Folder Structure
app/
 └── api/
      ├── auth/
      │    ├── signup/
      │    │    └── route.ts
      │    ├── login/
      │    │    └── route.ts
      └── users/
           └── route.ts
📝 Signup API — Secure Password Hashing
Endpoint
POST /api/auth/signup
Functionality
Accepts name, email, and password

Checks if the user already exists

Hashes password using bcrypt

Stores hashed password in the database

Code Snippet
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Signup successful",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Signup failed", error },
      { status: 500 }
    );
  }
}
🔐 Security Note
Passwords are never stored in plain text

10 salt rounds provide a balance between security and performance

🔑 Login API — JWT Token Generation
Endpoint
POST /api/auth/login
Functionality
Verifies user credentials

Compares password using bcrypt

Issues a JWT token on successful login

Code Snippet
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Login failed", error },
      { status: 500 }
    );
  }
}
🧠 Key JWT Concepts
Token is signed, not encrypted

Automatically expires after 1 hour

Prevents tampering and replay attacks

🔒 Protected Route — Token Validation
Endpoint
GET /api/users
Functionality
Reads JWT from Authorization header

Verifies token before granting access

Code Snippet
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token missing" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    return NextResponse.json({
      success: true,
      message: "Protected data accessed",
      user: decoded,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 403 }
    );
  }
}
🧪 API Testing (Postman / curl)
Signup
curl -X POST http://localhost:3000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"name":"Alice","email":"alice@example.com","password":"mypassword"}'
Login
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"alice@example.com","password":"mypassword"}'
Access Protected Route
curl -X GET http://localhost:3000/api/users \
-H "Authorization: Bearer <JWT_TOKEN>"
📦 Sample Responses
✅ Success
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
❌ Error
{
  "success": false,
  "message": "Invalid credentials"
}
🔍 Security & Design Considerations
Token Expiry
Tokens expire after 1 hour

Reduces risk if token is leaked

Token Storage
Recommended: HttpOnly cookies (production)

Used here: Authorization header (simpler for learning)

Refresh Strategy (Future Scope)
Refresh tokens for long-lived sessions

Silent token renewal without re-login

🧠 Reflection
bcrypt ensures passwords remain secure even if the database is compromised

JWT provides a stateless, scalable authentication mechanism

Centralized token validation makes it easy to protect APIs

This design supports future enhancements like role-based access control