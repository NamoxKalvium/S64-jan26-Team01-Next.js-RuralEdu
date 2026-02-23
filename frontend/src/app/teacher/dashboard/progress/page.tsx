"use client";

import { getClassProgress } from "@/app/actions/progress";
import { useEffect, useState } from "react";

type StudentStats = {
    id: string;
    fullName: string | null;
    email: string;
    averageScore: number;
    completedLessons: number;
    quizzesTaken: number;
};

export default function ProgressPage() {
    const [students, setStudents] = useState<StudentStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getClassProgress();
        if (res.success && res.data) {
            setStudents(res.data);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#f8fbff] p-6 pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#18659e]">Class Progress</h1>
                <p className="text-gray-500">Track student performance and engagement</p>
            </header>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-bold mb-1">Total Students</h3>
                    <p className="text-4xl font-black text-[#18659e]">{students.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-bold mb-1">Avg. Quiz Score</h3>
                    <p className="text-4xl font-black text-green-500">
                        {students.length > 0
                            ? Math.round(
                                students.reduce((acc, s) => acc + s.averageScore, 0) / students.length
                            )
                            : 0}
                        %
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-bold mb-1">Total Lessons Completed</h3>
                    <p className="text-4xl font-black text-purple-500">
                        {students.reduce((acc, s) => acc + s.completedLessons, 0)}
                    </p>
                </div>
            </div>

            {/* Student List Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Student Performance</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lessons</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quizzes</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Avg. Score</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading data...</td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No students found.</td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-[#18659e] font-bold">
                                                        {student.fullName?.[0] || "?"}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{student.fullName}</div>
                                                    <div className="text-sm text-gray-500">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                {student.completedLessons} Completed
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.quizzesTaken} Taken
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                    <div
                                                        className={`h-2 rounded-full ${student.averageScore >= 80 ? "bg-green-500" :
                                                                student.averageScore >= 50 ? "bg-yellow-500" : "bg-red-500"
                                                            }`}
                                                        style={{ width: `${student.averageScore}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">{student.averageScore}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-[#18659e] hover:text-[#145385] font-bold">Details</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
