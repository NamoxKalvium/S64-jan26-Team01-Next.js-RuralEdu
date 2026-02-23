"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DownloadedCourse {
    id: string;
    title: string;
    downloaded: boolean;
    progress: number;
}

const COURSE_META: Record<string, { title: string; description: string; icon: string }> = {
    "math-class-1": { title: "NCERT Math Class 1", description: "Basic mathematics for Class 1 students", icon: "🧮" },
    "math-class-2": { title: "NCERT Math Class 2", description: "Mathematics fundamentals for Class 2", icon: "📐" },
    "math-class-4": { title: "NCERT Math Class 4", description: "Advanced concepts for Class 4", icon: "📊" },
    "math-class-5": { title: "NCERT Math Class 5", description: "Comprehensive math curriculum for Class 5", icon: "🔢" },
    "math-class-7": { title: "NCERT Math Class 7", description: "Mathematics for Class 7 students", icon: "📏" },
    "math-class-8": { title: "NCERT Math Class 8", description: "Advanced mathematics concepts", icon: "🔺" },
    "math-class-9": { title: "NCERT Math Class 9", description: "Foundation for higher mathematics", icon: "📈" },
    "math-class-11": { title: "NCERT Math Class 11", description: "Higher secondary mathematics", icon: "🧠" },
};

export default function DownloadedCourses() {
    const [courses, setCourses] = useState<DownloadedCourse[]>([]);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Load downloaded courses from localStorage
        loadCourses();

        // Listen for storage changes (e.g. from home page downloads)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "ruraledu-progress") {
                loadCourses();
            }
        };
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const loadCourses = () => {
        try {
            const stored = localStorage.getItem("ruraledu-progress");
            if (stored) {
                const data = JSON.parse(stored);
                const courseList: DownloadedCourse[] = [];
                for (const [id, info] of Object.entries(data.courses || {})) {
                    const courseInfo = info as { downloaded: boolean; progress: number };
                    if (courseInfo.downloaded) {
                        courseList.push({
                            id,
                            title: COURSE_META[id]?.title || id,
                            downloaded: true,
                            progress: courseInfo.progress || 0,
                        });
                    }
                }
                setCourses(courseList);
            }
        } catch (error) {
            console.error("Error loading downloaded courses:", error);
        }
    };

    if (courses.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
                <div className="text-4xl mb-3">📥</div>
                <h4 className="font-bold text-gray-700 mb-1">No Downloads Yet</h4>
                <p className="text-sm text-gray-500 mb-4">
                    Browse the library to download courses for offline access.
                </p>
                <Link
                    href="/home"
                    className="inline-block px-5 py-2 bg-[#18659e] text-white text-sm font-bold rounded-xl hover:bg-[#145385] transition-all"
                >
                    📚 Browse Library
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((course) => {
                const meta = COURSE_META[course.id];
                return (
                    <div
                        key={course.id}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#18659e] transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#f0f7ff] flex items-center justify-center text-xl">
                                {meta?.icon || "📚"}
                            </div>
                            <div className="flex items-center gap-2">
                                {!isOnline && (
                                    <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-100">
                                        Offline Ready
                                    </span>
                                )}
                                <div className="text-green-500 bg-green-50 p-1.5 rounded-full" title="Downloaded">
                                    ✅
                                </div>
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mb-1 line-clamp-1">{meta?.title || course.title}</h4>
                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{meta?.description || "Downloaded course"}</p>

                        {course.progress > 0 && (
                            <div className="mb-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Progress</span>
                                    <span>{course.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <Link
                            href={`/course/${course.id}`}
                            className="block w-full py-2.5 rounded-xl text-sm font-bold border transition-all bg-white border-gray-100 text-gray-800 hover:bg-gray-50 text-center"
                        >
                            {course.progress > 0 ? "Continue" : "Start Learning"}
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
