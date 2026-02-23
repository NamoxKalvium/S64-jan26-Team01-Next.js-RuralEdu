import { login } from "@/lib/auth";
import { prisma, validatePrismaModel } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (validatePrismaModel('user')) {
            return NextResponse.json(
                { error: "Database service starting up. Please try again in a few seconds." },
                { status: 503 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "No user found with this email" },
                { status: 404 }
            );
        }

        if (!user.password) {
            return NextResponse.json(
                { error: "This account was created via social login. Please use Google to sign in." },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Incorrect password" },
                { status: 401 }
            );
        }

        // Login successful, create session
        await login(user);

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            ...userWithoutPassword,
            redirectTo: user.role === "TEACHER" ? "/teacher/dashboard" : "/dashboard"
        });
    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error. Please check if the database is running." },
            { status: 500 }
        );
    }
}