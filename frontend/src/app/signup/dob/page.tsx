"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DOBPage() {
    const router = useRouter();
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const handleNext = () => {
        if (day && month && year) {
            // In a real app, we'd store this in a state management library or URL
            const dob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            router.push(`/signup/details?dob=${dob}`);
        }
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
                <button
                    onClick={() => router.back()}
                    className="self-start text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1"
                >
                    ← Back
                </button>

                <div className="text-5xl mb-6">🎂</div>
                <h1 className="text-3xl font-extrabold text-[#18659e] mb-2">When is your birthday?</h1>
                <p className="text-gray-500 mb-8">We use this to customize your learning experience</p>

                <div className="grid grid-cols-3 gap-3 mb-10">
                    <input
                        type="number"
                        placeholder="Day"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="p-4 rounded-xl border-2 border-gray-100 focus:border-[#18659e] focus:outline-none transition-all text-center text-lg font-medium"
                        min="1"
                        max="31"
                    />
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="p-4 rounded-xl border-2 border-gray-100 focus:border-[#18659e] focus:outline-none transition-all text-center text-lg font-medium bg-white"
                    >
                        <option value="" disabled>Month</option>
                        {months.map((m, i) => (
                            <option key={m} value={i + 1}>{m}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="p-4 rounded-xl border-2 border-gray-100 focus:border-[#18659e] focus:outline-none transition-all text-center text-lg font-medium"
                        min="1900"
                        max={new Date().getFullYear()}
                    />
                </div>

                <button
                    onClick={handleNext}
                    disabled={!day || !month || !year}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${day && month && year
                            ? "bg-[#18659e] text-white hover:bg-[#145385] shadow-lg shadow-blue-100"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    Next Step
                </button>
            </div>
        </div>
    );
}
