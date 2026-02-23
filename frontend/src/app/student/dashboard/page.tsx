import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import DailyGoal from "@/components/dashboard/DailyGoal";
import DownloadedCourses from "@/components/dashboard/DownloadedCourses";
import ResumeLesson from "@/components/dashboard/ResumeLesson";
import StorageWidget from "@/components/dashboard/StorageWidget";
import SyncStatus from "@/components/SyncStatus";
import AnnouncementsPanel from "@/components/dashboard/AnnouncementsPanel";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const { user } = session;

    return (
        <div className="min-h-screen bg-[#f8fbff] text-gray-800 pb-20">
            {/* Header */}
            <header className="bg-white px-6 py-4 sticky top-0 z-10 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#18659e] rounded-lg flex items-center justify-center text-white font-bold text-sm">RE</div>
                    <span className="font-black text-[#18659e] tracking-tight">RuralEdu</span>
                </div>

                <div className="flex items-center gap-3">
                    <SyncStatus />
                    <button className="bg-[#f0f7ff] text-[#18659e] p-2 rounded-full hover:bg-blue-50 transition-colors">
                        🔄
                    </button>
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-[#18659e] font-bold border-2 border-white shadow-sm">
                        {user.fullName?.[0]?.toUpperCase()}
                    </div>
                </div>
            </header>

            {/* Offline Banner Hero */}
            <div className="bg-gradient-to-r from-[#ebf5ff] to-[#f0f9ff] border-b border-blue-50 p-6 sm:p-10 mb-8 relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="inline-block bg-orange-100 text-orange-700 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                        Offline Ready
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-[#153b52] leading-tight mb-4">
                        Learn Anytime,<br />
                        Even <span className="text-[#18659e]">Offline</span>.
                    </h1>
                    <p className="text-gray-600 max-w-md mb-6 text-sm font-medium">
                        Your lessons have been successfully synced. Welcome back to your dashboard, {user.fullName}!
                    </p>
                    <div className="flex gap-3">
                        <Link
                            href="/home"
                            className="px-6 py-3 bg-[#18659e] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-[#145385] transition-all text-sm flex items-center gap-2"
                        >
                            📚 Browse Library
                        </Link>
                        <a
                            href="#downloads"
                            className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm"
                        >
                            View Downloads
                        </a>
                    </div>
                </div>

                {/* Abstract decoration */}
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                    <svg width="300" height="300" viewBox="0 0 200 200">
                        <path fill="#18659e" d="M45.7,-76.3C58.9,-69.3,69.1,-59.3,77.2,-48.1C85.3,-36.9,91.3,-24.5,90.4,-12.3C89.5,-0.1,81.7,11.9,73.4,22.4C65.1,32.9,56.3,41.9,46.8,50.1C37.3,58.3,27.1,65.7,15.6,69.5C4.1,73.3,-8.7,73.5,-20.8,70.5C-32.9,67.5,-44.3,61.3,-53.6,52.8C-62.9,44.3,-70.1,33.5,-75.3,21.5C-80.5,9.5,-83.7,-3.7,-81.4,-16.1C-79.1,-28.5,-71.3,-40.1,-61.6,-48.8C-51.9,-57.5,-40.3,-63.3,-28.8,-69.1C-17.3,-74.9,-5.9,-80.7,6.1,-81.8L18.1,-82.9" transform="translate(100 100)" />
                    </svg>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Announcements */}
                    <AnnouncementsPanel />

                    {/* Continue Learning */}
                    <section>
                        <h2 className="flex items-center gap-2 font-black text-gray-800 text-lg mb-4">
                            <span className="text-[#18659e]">▶</span> Continue Learning
                        </h2>
                        <ResumeLesson />
                    </section>

                    {/* Your Downloads (dynamically loaded from localStorage) */}
                    <section id="downloads">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-black text-gray-800 text-lg">Your Downloads</h2>
                            <Link href="/home" className="text-sm font-bold text-[#18659e] hover:underline">Browse More</Link>
                        </div>
                        <DownloadedCourses />
                    </section>
                </div>

                {/* Right Column (Sidebar/Widgets) */}
                <div className="space-y-6">
                    <DailyGoal />

                    {/* Recent Badges */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 text-lg">Recent Badges</h3>
                            <span className="text-gray-400 text-xl">🏆</span>
                        </div>
                        <div className="flex gap-2 justify-between">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center text-2xl border-2 border-yellow-100">
                                    🌟
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">Week Streak</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-2xl border-2 border-blue-100">
                                    📚
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">Bookworm</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 opacity-50 grayscale">
                                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-2xl border-2 border-gray-100">
                                    🚀
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">Fast Learner</span>
                            </div>
                        </div>
                    </div>

                    <StorageWidget />

                    <form action="/api/auth/logout" method="POST">
                        <button className="w-full py-3 text-red-500 font-bold text-sm bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                            Log Out
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
