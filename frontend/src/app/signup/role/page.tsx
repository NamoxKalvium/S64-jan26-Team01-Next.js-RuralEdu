"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoleSelectionPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedRole === "LEARNER") {
            router.push("/signup/dob");
        } else if (selectedRole === "TEACHER") {
            // Logic for teacher signup can be added here
            alert("Teacher signup coming soon!");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h1 className="text-3xl font-extrabold text-[#18659e] text-center mb-2">Join RuralEdu</h1>
                <p className="text-gray-500 text-center mb-8">Choose your role to get started</p>

                <div className="space-y-4">
                    <button
                        onClick={() => setSelectedRole("LEARNER")}
                        className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${selectedRole === "LEARNER"
                                ? "border-[#18659e] bg-[#f0f7ff]"
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                    >
                        <div className="w-12 h-12 bg-[#18659e] rounded-full flex items-center justify-center text-white text-2xl">
                            🎓
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">I am a Learner</h3>
                            <p className="text-sm text-gray-500">I want to learn new skills and courses</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setSelectedRole("TEACHER")}
                        className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${selectedRole === "TEACHER"
                                ? "border-[#18659e] bg-[#f0f7ff]"
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                    >
                        <div className="w-12 h-12 bg-white border-2 border-[#18659e] rounded-full flex items-center justify-center text-[#18659e] text-2xl">
                            👨‍🏫
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">I am a Teacher</h3>
                            <p className="text-sm text-gray-500">I want to share knowledge and teach</p>
                        </div>
                    </button>
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!selectedRole}
                    className={`w-full mt-10 py-4 rounded-2xl font-bold text-lg transition-all ${selectedRole
                            ? "bg-[#18659e] text-white hover:bg-[#145385] shadow-lg shadow-blue-100"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    Continue
                </button>

                <p className="text-center mt-6 text-gray-500 text-sm">
                    Already have an account?{" "}
                    <button onClick={() => router.push("/login")} className="text-[#18659e] font-bold hover:underline">
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
}
