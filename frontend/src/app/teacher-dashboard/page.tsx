import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TeacherDashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const { user } = session;

    // Ensure only teachers can access this page
    if (user.role !== "TEACHER") {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-[#f8fbff] text-gray-800">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#18659e] rounded-xl flex items-center justify-center text-white text-xl font-bold italic">
                        RE
                    </div>
                    <span className="text-xl font-black text-[#18659e] tracking-tight">RuralEdu Teacher</span>
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
            <div className="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white p-8 md:p-12 mb-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Welcome, Teacher<br />{user.fullName || user.email?.split('@')[0] || "Educator"}! 👨‍🏫</h1>
                    <p className="text-purple-100 text-lg md:text-xl font-medium max-w-2xl">
                        Manage your courses, track student progress, and create amazing learning experiences.
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
                                    <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                                    Your Courses
                                </h2>
                                <Link href="/home" className="text-purple-600 font-bold hover:underline px-4 py-2 bg-purple-50 rounded-full text-sm">
                                    Create New Course
                                </Link>
                            </div>

                            <div className="bg-white rounded-3xl p-10 border-2 border-dashed border-gray-200 text-center space-y-4">
                                <div className="text-5xl">📝</div>
                                <h3 className="text-xl font-bold text-gray-800">No courses created yet</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    Start creating your first course to share knowledge with learners. Design engaging content and track student progress.
                                </p>
                                <Link
                                    href="/home"
                                    className="inline-block mt-4 px-8 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100"
                                >
                                    Create Course
                                </Link>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                                Teaching Analytics
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold">
                                            👥
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Students</p>
                                            <p className="text-2xl font-black text-gray-800">0</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">Total students enrolled</p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-xl font-bold">
                                            📊
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Completion</p>
                                            <p className="text-2xl font-black text-gray-800">0%</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">Average course completion</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="font-black text-gray-800 mb-6 uppercase tracking-wider text-sm">Teacher Tools</h3>
                            <div className="space-y-4">
                                <Link href="/home" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        ➕
                                    </div>
                                    <span className="font-medium text-gray-700">Create Course</span>
                                </Link>
                                
                                <Link href="/home" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                        📋
                                    </div>
                                    <span className="font-medium text-gray-700">Manage Content</span>
                                </Link>
                                
                                <Link href="/home" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                        📈
                                    </div>
                                    <span className="font-medium text-gray-700">View Analytics</span>
                                </Link>
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