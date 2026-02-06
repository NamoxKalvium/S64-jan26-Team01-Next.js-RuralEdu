import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const { user } = session;

    return (
        <div className="min-h-screen bg-[#f8fbff] text-gray-800">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#18659e] rounded-xl flex items-center justify-center text-white text-xl font-bold italic">
                        RE
                    </div>
                    <span className="text-xl font-black text-[#18659e] tracking-tight">RuralEdu</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold text-gray-800">{user.fullName}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#18659e] font-bold border-2 border-white shadow-sm">
                        {user.fullName?.[0]?.toUpperCase()}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#18659e] to-[#2a86c9] text-white p-8 md:p-12 mb-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Welcome back,<br />{user.fullName || "Learner"}! 👋</h1>
                    <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl">
                        You're doing great. You've completed 0 courses and have a 1-day streak! Keep going.
                    </p>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-[#18659e] rounded-full"></span>
                                    Your Courses
                                </h2>
                                <Link href="/home" className="text-[#18659e] font-bold hover:underline px-4 py-2 bg-blue-50 rounded-full text-sm">
                                    View All
                                </Link>
                            </div>

                            <div className="bg-white rounded-3xl p-10 border-2 border-dashed border-gray-200 text-center space-y-4">
                                <div className="text-5xl">📚</div>
                                <h3 className="text-xl font-bold text-gray-800">No courses yet</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    Browse our catalog and start learning something new today. All courses are optimized for offline learning.
                                </p>
                                <Link
                                    href="/home"
                                    className="inline-block mt-4 px-8 py-3 bg-[#18659e] text-white font-bold rounded-2xl hover:bg-[#145385] transition-all shadow-lg shadow-blue-100"
                                >
                                    Explore Courses
                                </Link>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                                Achievements
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 text-center opacity-40 grayscale">
                                        <div className="text-3xl mb-2">🏆</div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full mb-2"></div>
                                        <div className="h-2 w-2/3 bg-gray-100 rounded-full mx-auto"></div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="font-black text-gray-800 mb-6 uppercase tracking-wider text-sm">Learning Profile</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 text-xl font-bold">
                                        🔥
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Streak</p>
                                        <p className="text-xl font-black text-gray-800">1 Day</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 text-xl font-bold">
                                        💎
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Points</p>
                                        <p className="text-xl font-black text-gray-800">150 XP</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-xl font-bold">
                                        ❤️
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Health</p>
                                        <p className="text-xl font-black text-gray-800">Full</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form action="/api/auth/logout" method="POST">
                            <button
                                type="submit"
                                className="w-full py-4 text-red-500 font-bold border-2 border-red-50 hover:bg-red-50 rounded-2xl transition-all"
                            >
                                Log Out
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
