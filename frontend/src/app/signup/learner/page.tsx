'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LearnerSignupPage() {
    const router = useRouter();
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const handleNext = () => {
        if (month && year) {
            // Pass state via query params or context. For simplicity, we just navigate.
            // In a real app, valid date checking is needed.
            const dob = `${year}-${month}-01`;
            router.push(`/signup/learner/details?dob=${dob}`);
        }
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Side: Graphic */}
                <div className="hidden md:flex flex-col items-center text-center">
                    <div className="relative w-80 h-80 bg-[#f9f7f4] rounded-full flex items-center justify-center mb-6">
                        <div className="text-gray-400">Educational Graphic</div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Did you know?</h2>
                    <p className="text-gray-600 max-w-sm">
                        Regardless of who you are, mastering even just one more skill on Khan Academy results in learning gains.
                    </p>
                </div>

                {/* Right Side: Form */}
                <div className="flex flex-col max-w-md w-full">
                    <Link href="/signup" className="text-[#1865f2] hover:underline mb-4 font-medium flex items-center">
                        <span className="mr-1">‹</span> Choose a different role
                    </Link>

                    <h1 className="text-2xl font-bold text-[#333333] mb-2">Sign up as a learner today!</h1>
                    <p className="text-gray-600 mb-8">
                        First, we need your date of birth to help us give you the best experience!
                    </p>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Date of birth <span className="text-gray-400 font-normal float-right">required</span>
                        </label>
                        <div className="flex gap-4">
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-1/2 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                                <option value="" disabled>Month</option>
                                {months.map((m, index) => (
                                    // Using index + 1 for simple value, ensuring 2 digits
                                    <option key={m} value={String(index + 1).padStart(2, '0')}>{m}</option>
                                ))}
                            </select>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-1/2 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                                <option value="" disabled>Year</option>
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={!month || !year}
                        className={`w-full p-3 rounded font-bold text-white transition-colors ${month && year ? 'bg-[#1865f2] hover:bg-[#0b5cff]' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
