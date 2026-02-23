"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(data: { title: string; content: string; classId?: string }) {
    const session = await getSession();
    if (!session || session.user.role !== "TEACHER") {
        return { error: "Unauthorized" };
    }

    if (!data.title?.trim() || !data.content?.trim()) {
        return { error: "Title and content are required" };
    }

    try {
        await prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                teacherId: session.user.id,
                classId: data.classId || null,
            },
        });

        revalidatePath("/teacher/dashboard/announcements");
        revalidatePath("/student/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to create announcement:", error);
        return { error: "Failed to create announcement" };
    }
}

export async function getAnnouncements() {
    const session = await getSession();
    if (!session) {
        return [];
    }

    const { user } = session;

    // Teachers see their own announcements
    if (user.role === "TEACHER") {
        return await prisma.announcement.findMany({
            where: { teacherId: user.id },
            include: {
                class: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" },
        });
    }

    // Learners see announcements for their specific class
    // First, fetch the student's classId if we don't have it in session
    let studentClassId = user.classId;

    // If not in session, fetch from DB
    if (user.role === "LEARNER" && !studentClassId) {
        const student = await prisma.user.findUnique({
            where: { id: user.id },
            select: { classId: true }
        });
        studentClassId = student?.classId;
    }

    return await prisma.announcement.findMany({
        where: {
            OR: [
                { classId: studentClassId },
                { classId: null } // Global announcements
            ]
        },
        orderBy: { createdAt: "desc" },
        include: {
            teacher: {
                select: { fullName: true },
            },
        },
    });
}

export async function getClasses() {
    const session = await getSession();
    if (!session || session.user.role !== "TEACHER") {
        return [];
    }
    return await prisma.class.findMany({
        orderBy: { name: "asc" }
    });
}
