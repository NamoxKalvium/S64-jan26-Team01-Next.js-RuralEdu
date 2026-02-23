"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getClassProgress() {
    const session = await getSession();
    if (!session || session.user.role !== "TEACHER") {
        return { error: "Unauthorized" };
    }

    try {
        // Fetch all students (LEARNER role)
        const students = await prisma.user.findMany({
            where: { role: "LEARNER" },
            select: {
                id: true,
                fullName: true,
                email: true,
                // Count completed lessons
                _count: {
                    select: {
                        progress: { where: { completed: true } },
                        results: true, // Count quizzes taken
                    },
                },
                // Get average quiz score
                results: {
                    select: { score: true },
                },
            },
            orderBy: { fullName: "asc" },
        });

        // Calculate average score for each student
        const data = students.map((s) => {
            const totalScore = s.results.reduce((acc, r) => acc + r.score, 0);
            const avgScore = s.results.length > 0 ? Math.round(totalScore / s.results.length) : 0;
            return {
                ...s,
                averageScore: avgScore,
                completedLessons: s._count.progress,
                quizzesTaken: s._count.results,
            };
        });

        return { success: true, data };
    } catch (error) {
        console.error("Failed to fetch class progress:", error);
        return { error: "Failed to fetch progress data" };
    }
}

export async function getStudentDetail(studentId: string) {
    const session = await getSession();
    if (!session || session.user.role !== "TEACHER") {
        return { error: "Unauthorized" };
    }

    try {
        const student = await prisma.user.findUnique({
            where: { id: studentId },
            include: {
                progress: {
                    include: { lesson: true },
                    where: { completed: true },
                },
                results: {
                    include: { quiz: true },
                    orderBy: { completedAt: "desc" },
                },
            },
        });

        if (!student) return { error: "Student not found" };

        return { success: true, data: student };
    } catch (error) {
        return { error: "Failed to fetch student details" };
    }
}
