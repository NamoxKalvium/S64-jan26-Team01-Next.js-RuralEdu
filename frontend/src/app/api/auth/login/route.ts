<<<<<<< HEAD
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const JWT_SECRET = process.env.JWT_SECRET || "ruraledu-secret-key-change-in-production";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d", // Token expires in 7 days
      }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
=======
import { login } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing email or password" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Set cookie and session
        const { password: _, ...userWithoutPassword } = user;
        await login(userWithoutPassword);

        return NextResponse.json(
            { message: "Logged in successfully", user: userWithoutPassword },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
>>>>>>> e8e326fe3f272ef5a2b6bea1c38ef698a8762c2a
}
