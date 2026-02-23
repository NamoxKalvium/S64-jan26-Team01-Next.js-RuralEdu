"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LastActive {
    courseId: string;
    courseTitle: string;
    lessonIndex: number;
    lessonTitle: string;
    timestamp: number;
}

export default function ResumeLesson() {
    const [lastActive, setLastActive] = useState<LastActive | null>(null);

    useEffect(() => {
        const loadLastActive = () => {
            try {
                const stored = localStorage.getItem("ruraledu-last-active");
                if (stored) {
                    setLastActive(JSON.parse(stored));
                }
            } catch (error) {
                console.error("Error loading last active lesson:", error);
            }
        };

        loadLastActive();

        // Also listen for storage changes
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "ruraledu-last-active") {
                loadLastActive();
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    if (!lastActive) {
        return (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center py-10">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Ready to start learning?</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">
                    Choose a course from the library to begin your educational journey.
                </p>
                <Link
                    href="/home"
                    className="px-6 py-2.5 bg-[#18659e] text-white text-sm font-bold rounded-xl hover:bg-[#145385] transition-all"
                >
                    Browse Library
                </Link>
            </div>
        );
    }

    // Reuse the styling from the hardcoded continue learning card
    return (
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-5 items-center sm:items-stretch">
            <div className="w-full sm:w-40 h-32 bg-gray-100 rounded-2xl flex-shrink-0 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#e0f2fe] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                    {lastActive.courseTitle.toLowerCase().includes("math") ? "🧮" : "📖"}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                        ▶
                    </div>
                </div>
            </div>
            <div className="flex-1 w-full flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#18659e] bg-blue-50 px-2 py-0.5 rounded-md">
                            {lastActive.courseTitle}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                            Active {new Date(lastActive.timestamp).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2">
                        {lastActive.lessonTitle}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                        Continue where you left off in Lesson {lastActive.lessonIndex + 1}
                    </p>
                </div>
                <Link
                    href={`/course/${lastActive.courseId}`}
                    className="self-start px-5 py-2 bg-[#18659e] text-white text-sm font-bold rounded-xl hover:scale-105 transition-transform shadow-md shadow-blue-100"
                >
                    Resume Lesson →
                </Link>
            </div>
        </div>
    );
}
