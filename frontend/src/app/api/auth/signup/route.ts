import { prisma, validatePrismaModel } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const SignupSchema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
            fullName: z.string().min(1).optional(),
            role: z.enum(["LEARNER", "TEACHER", "PARENT"]),
            dateOfBirth: z.string().optional(),
        });

        const parsed = SignupSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid input", issues: parsed.error.issues },
                { status: 400 }
            );
        }

        const { email, password, fullName, role, dateOfBirth } = parsed.data;

        if (!email || !password || !role) {
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

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                role,
                dateOfBirth:
                    dateOfBirth && !isNaN(Date.parse(dateOfBirth))
                        ? new Date(dateOfBirth).toISOString()
                        : null,
            },
        });

        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json(
                    { error: "Email already in use" },
                    { status: 400 }
                );
            }
        }
        if (
            error instanceof Error &&
            (error.message.includes("P1001") || error.message.includes("P1002"))
        ) {
            return NextResponse.json(
                { error: "Database connection failed" },
                { status: 503 }
            );
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
