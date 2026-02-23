"use client";

import { useEffect, useState } from "react";

const DAILY_QUIZ_TARGET = 3; // Daily goal: complete 3 quizzes

export default function DailyGoal() {
    const [quizzesCompleted, setQuizzesCompleted] = useState(0);
    const [studyMinutes, setStudyMinutes] = useState(0);

    useEffect(() => {
        loadDailyData();

        // Re-check every 30 seconds for live updates
        const interval = setInterval(loadDailyData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadDailyData = () => {
        try {
            const today = new Date().toDateString();

            // Load quiz completions for today
            const quizData = localStorage.getItem("ruraledu-daily-quizzes");
            if (quizData) {
                const parsed = JSON.parse(quizData);
                if (parsed.date === today) {
                    setQuizzesCompleted(parsed.count || 0);
                } else {
                    // Reset for new day
                    setQuizzesCompleted(0);
                }
            }

            // Load study time for today
            const timeData = localStorage.getItem("ruraledu-study-time");
            if (timeData) {
                const parsed = JSON.parse(timeData);
                if (parsed.date === today) {
                    setStudyMinutes(parsed.minutes || 0);
                } else {
                    setStudyMinutes(0);
                }
            }
        } catch (error) {
            console.error("Error loading daily data:", error);
        }
    };

    const percentage = Math.min(Math.round((quizzesCompleted / DAILY_QUIZ_TARGET) * 100), 100);
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 text-lg">Daily Goal</h3>
            <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg
                        height={radius * 2}
                        width={radius * 2}
                        className="transform -rotate-90"
                    >
                        <circle
                            stroke="#e5e7eb"
                            strokeWidth={stroke}
                            fill="transparent"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                        <circle
                            stroke={percentage >= 100 ? "#22c55e" : "#18659e"}
                            strokeWidth={stroke}
                            strokeDasharray={circumference + " " + circumference}
                            style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s ease" }}
                            fill="transparent"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-black text-gray-800">{percentage}%</span>
                        <span className="text-xs text-gray-500 font-medium">
                            {percentage >= 100 ? "🎉 Done!" : "Completed"}
                        </span>
                    </div>
                </div>

                <div className="mt-6 w-full space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#18659e]">
                            ⏱️
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">{studyMinutes} mins</p>
                            <p className="text-xs text-gray-500">Study time today</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            ✅
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">
                                {quizzesCompleted} / {DAILY_QUIZ_TARGET} Quizzes
                            </p>
                            <p className="text-xs text-gray-500">Completed today</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
