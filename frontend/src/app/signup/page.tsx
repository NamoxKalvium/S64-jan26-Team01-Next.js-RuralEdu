"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-[#153b52]">
            <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Left Side: Illustration */}
                <div className="hidden md:flex flex-col items-center text-center">
                    <div className="relative">
                        {/* Abstract shapes simulation */}
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#fdf2f2] rounded-full opacity-60"></div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#f0f9ff] rounded-full opacity-60"></div>

                        <img
                            src="/hero_image.png"
                            alt="Illustration"
                            className="relative z-10 w-80 h-80 object-cover shadow-2xl border-4 border-white"
                            style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" }}
                        />

                        {/* Squiggle decoration */}
                        <svg className="absolute -bottom-10 left-10 w-40 h-10" viewBox="0 0 200 50">
                            <path d="M5 40 Q 30 10, 55 40 T 105 40 Q 130 10, 155 40 T 195 40" stroke="#80c995" strokeWidth="4" fill="none" />
                        </svg>
                    </div>

                    <div className="mt-16 max-w-sm">
                        <h2 className="text-2xl font-bold mb-4">Did you know?</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Regardless of who you are, mastering even just one more skill on RuralEdu results in learning gains.
                        </p>
                    </div>
                </div>

                {/* Right Side: Role Selection */}
                <div className="flex flex-col w-full max-w-sm">
                    <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Sign up for RuralEdu!</h1>

                    <div className="space-y-4">
                        <Link
                            href="/signup/dob"
                            className="flex items-center justify-between w-full p-5 border-2 border-blue-50 bg-[#f0f7ff] rounded-xl hover:border-[#18659e] transition-all group shadow-sm"
                        >
                            <span className="text-lg font-bold text-[#18659e]">I'm a learner</span>
                            <span className="text-2xl text-[#18659e] group-hover:translate-x-1 transition-transform">›</span>
                        </Link>

                        <button
                            onClick={() => alert("Teacher signup coming soon!")}
                            className="flex items-center justify-between w-full p-5 border-2 border-blue-50 bg-[#f0f7ff] rounded-xl hover:border-[#18659e] transition-all group shadow-sm"
                        >
                            <span className="text-lg font-bold text-[#18659e]">I'm a teacher</span>
                            <span className="text-2xl text-[#18659e] group-hover:translate-x-1 transition-transform">›</span>
                        </button>

                        <button
                            onClick={() => alert("Parent signup coming soon!")}
                            className="flex items-center justify-between w-full p-5 border-2 border-blue-50 bg-[#f0f7ff] rounded-xl hover:border-[#18659e] transition-all group shadow-sm"
                        >
                            <span className="text-lg font-bold text-[#18659e]">I'm a parent</span>
                            <span className="text-2xl text-[#18659e] group-hover:translate-x-1 transition-transform">›</span>
                        </button>
                    </div>

                    <p className="mt-10 text-center md:text-left text-gray-500 font-medium">
                        Already have a RuralEdu account?{" "}
                        <Link href="/login" className="text-[#18659e] font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
