"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function SignupDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dob = searchParams.get("dob");
    const roleParam = searchParams.get("role");
    const role = roleParam === "TEACHER" ? "TEACHER" : "LEARNER";

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    role,
                    dateOfBirth: dob,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const loginRes = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (loginRes.ok) {
                    const loginData = await loginRes.json();
                    const redirectPath = loginData.redirectTo || "/dashboard";
                    router.push(redirectPath);
                } else {
                    router.push("/login?message=Signup successful! Please log in.");
                }
            } else {
                setError(data.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Failed to connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#f8fbff] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18659e]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col items-center justify-center p-6 text-gray-800">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <button
                    onClick={() => router.back()}
                    className="self-start text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1"
                >
                    ← Back
                </button>

                <h1 className="text-3xl font-extrabold text-[#18659e] mb-2 text-center">Create Account</h1>
                <p className="text-gray-500 mb-8 text-center">Enter your details to get started</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#18659e] focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#18659e] focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#18659e] focus:outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all ${isLoading
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-[#18659e] text-white hover:bg-[#145385] shadow-lg shadow-blue-100"
                            }`}
                    >
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-gray-400 font-medium">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={() => signIn("google")}
                    className="w-full py-4 rounded-2xl border-2 border-gray-100 font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
                >
                    <img src="https://img.icons8.com/color/48/google-logo.png" className="w-5 h-5" alt="Google" />
                    Google
                </button>

                <div className="text-center mt-8 text-gray-500 text-sm">
                    By signing up, you agree to our{" "}
                    <span className="text-[#18659e] font-bold">Terms</span> and{" "}
                    <span className="text-[#18659e] font-bold">Privacy Policy</span>.
                </div>
            </div>
        </div>
    );
}
