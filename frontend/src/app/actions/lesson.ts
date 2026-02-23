"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createLesson(formData: FormData) {
    const session = await getSession();
    if (!session || session.user.role !== "TEACHER") {
        return { error: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;

    if (!title || !content) {
        return { error: "Title and content are required" };
    }

    try {
        await prisma.lesson.create({
            data: {
                title,
                description,
                content,
                teacherId: session.user.id,
            },
        });

        revalidatePath("/teacher/dashboard/lessons");
        return { success: true };
    } catch (error) {
        console.error("Failed to create lesson:", error);
        return { error: "Failed to create lesson" };
    }
}

export async function getLessons() {
    const session = await getSession();
    if (!session || session.user.role !== "TEACHER") {
        return [];
    }

    return await prisma.lesson.findMany({
        where: { teacherId: session.user.id },
        orderBy: { createdAt: "desc" },
    });
}
