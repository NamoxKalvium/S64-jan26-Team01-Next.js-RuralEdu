"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SyncStatus from "@/components/SyncStatus";

export default function TeacherDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ fullName: string } | null>(null);

    useEffect(() => {
        // ... (existing auth check)
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    if (data.role !== "TEACHER") {
                        router.push("/student/dashboard"); // Redirect students back
                    }
                    setUser(data);
                } else {
                    router.push("/login");
                }
            } catch (e) {
                router.push("/login");
            }
        };

        fetchUser();
    }, [router]);

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f8fbff] p-6">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-[#18659e]">Teacher Dashboard</h1>
                    <SyncStatus />
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-700">Welcome, {user.fullName}</span>
                    <button
                        onClick={async () => {
                            await fetch("/api/auth/logout", { method: "POST" });
                            router.push("/");
                        }}
                        className="text-sm text-red-600 hover:text-red-800 font-semibold"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">My Lessons</h2>
                    <p className="text-4xl font-bold text-[#18659e]">--</p>
                    <p className="text-sm text-gray-500 mt-2">Lessons created</p>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <a href="/teacher/dashboard/lessons" className="px-6 py-3 bg-[#eaf3fa] text-[#18659e] rounded-xl font-semibold hover:bg-[#18659e] hover:text-white transition-all text-center">
                            Manage Lessons
                        </a>
                        <a href="/teacher/dashboard/quizzes" className="px-6 py-3 bg-[#f3eafa] text-purple-700 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition-all text-center">
                            Manage Quizzes
                        </a>
                        <a href="/teacher/dashboard/announcements" className="px-6 py-3 bg-[#fff4e5] text-orange-700 rounded-xl font-semibold hover:bg-orange-600 hover:text-white transition-all text-center">
                            Announcements
                        </a>
                        <a href="/teacher/dashboard/progress" className="px-6 py-3 bg-[#e0f2fe] text-[#0e7490] rounded-xl font-semibold hover:bg-[#0e7490] hover:text-white transition-all text-center">
                            Class Progress
                        </a>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                    <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                        No recent activity to show
                    </div>
                </div>
            </main>
        </div>
    );
}
