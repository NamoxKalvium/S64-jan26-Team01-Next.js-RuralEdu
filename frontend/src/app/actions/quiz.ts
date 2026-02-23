"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type QuestionInput = {
    text: string;
    options: string[];
    correctOptionIndex: number;
};

export async function createQuiz(title: string, lessonId: string | null, questions: QuestionInput[]) {
    const session = await getSession();
    if (!session || session.user.role !== "TEACHER") {
        return { error: "Unauthorized" };
    }

    if (!title || questions.length === 0) {
        return { error: "Title and at least one question are required" };
    }

    try {
        // Create Quiz with nested Questions and Options
        const quiz = await prisma.quiz.create({
            data: {
                title,
                lessonId: lessonId || null,
                teacherId: session.user.id,
                questions: {
                    create: questions.map((q) => ({
                        text: q.text,
                        options: {
                            create: q.options.map((opt) => ({
                                text: opt,
                            })),
                        },
                        // We'll update correctOptionId after creation or use a different schema approach.
                        // For MVP, simplistic approach: create options first? No, Prisma nested create is atomic.
                        // We will store correct Option TEXT or INDEX temporarily?
                        // Actually, let's adjust the schema or logic.
                        // Schema has `correctOptionId`. It's hard to know the ID before creation.
                    })),
                },
            },
            include: {
                questions: {
                    include: { options: true },
                },
            },
        });

        // Post-process to set correctOptionId based on index
        // This is not efficient for huge quizzes but fine for MVP
        for (let i = 0; i < quiz.questions.length; i++) {
            const qDb = quiz.questions[i];
            const qInput = questions[i];
            const correctOption = qDb.options[qInput.correctOptionIndex];

            if (correctOption) {
                await prisma.question.update({
                    where: { id: qDb.id },
                    data: { correctOptionId: correctOption.id },
                });
            }
        }

        revalidatePath("/teacher/dashboard/quizzes");
        return { success: true };
    } catch (error) {
        console.error("Failed to create quiz:", error);
        return { error: "Failed to create quiz" };
    }
}

export async function getQuizzes() {
    const session = await getSession();
    if (!session || session.user.role !== "TEACHER") {
        return [];
    }

    return await prisma.quiz.findMany({
        where: { teacherId: session.user.id },
        include: {
            _count: {
                select: { questions: true },
            },
            lesson: {
                select: { title: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}
