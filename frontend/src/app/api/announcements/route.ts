import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;

    try {
        let announcements;

        if (user.role === "TEACHER") {
            announcements = await prisma.announcement.findMany({
                where: { teacherId: user.id },
                include: {
                    class: { select: { name: true } }
                },
                orderBy: { createdAt: "desc" },
            });
        } else {
            // Student
            let studentClassId = user.classId;
            if (!studentClassId) {
                const student = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { classId: true }
                });
                studentClassId = student?.classId;
            }

            announcements = await prisma.announcement.findMany({
                where: {
                    OR: [
                        { classId: studentClassId },
                        { classId: null }
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

        return NextResponse.json(announcements);
    } catch (error) {
        console.error("API Fetch Announcement Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
