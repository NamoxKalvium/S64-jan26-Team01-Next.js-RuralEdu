import { getLessons } from "@/app/actions/lesson";
import Link from "next/link";
import { Lesson } from "@prisma/client";

export default async function LessonsPage() {
    const lessons = await getLessons();

    return (
        <div className="min-h-screen bg-[#f8fbff] p-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#18659e]">My Lessons</h1>
                    <p className="text-gray-500">Manage and create learning content</p>
                </div>
                <Link
                    href="/teacher/dashboard/lessons/create"
                    className="px-6 py-3 bg-[#18659e] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-[#145385] transition-all flex items-center gap-2"
                >
                    + Create Lesson
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson: Lesson) => (
                    <div key={lesson.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl text-[#18659e]">
                                📝
                            </div>
                            <button className="text-gray-400 hover:text-[#18659e]">
                                •••
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#18659e] transition-colors">
                            {lesson.title}
                        </h2>
                        <p className="text-gray-500 line-clamp-2 text-sm mb-4">
                            {lesson.description || "No description provided."}
                        </p>
                        <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
                            <span>Updated {new Date(lesson.updatedAt).toLocaleDateString()}</span>
                            <span className="bg-green-50 text-green-600 px-2 py-1 rounded-md">Synced</span>
                        </div>
                    </div>
                ))}

                {lessons.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
                        <div className="text-4xl mb-4">📭</div>
                        <h3 className="text-lg font-bold text-gray-800">No lessons yet</h3>
                        <p className="text-gray-500 mb-6">Start by creating your first lesson note.</p>
                        <Link
                            href="/teacher/dashboard/lessons/create"
                            className="inline-block px-6 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50"
                        >
                            Create Lesson
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
