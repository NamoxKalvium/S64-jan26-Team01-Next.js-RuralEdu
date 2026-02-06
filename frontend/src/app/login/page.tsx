"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get("message");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push("/dashboard");
            } else {
                setError(data.error || "Invalid email or password.");
            }
        } catch (err) {
            setError("Failed to connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col items-center justify-center p-6 text-gray-800">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h1 className="text-3xl font-extrabold text-[#18659e] text-center mb-2">Welcome Back</h1>
                <p className="text-gray-500 text-center mb-8">Log in to continue learning</p>

                {message && (
                    <div className="mb-6 p-4 bg-blue-50 text-[#18659e] rounded-xl text-sm font-medium border border-blue-100">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#18659e] focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-2 ml-1">
                            <label className="block text-sm font-bold text-gray-700">Password</label>
                            <button type="button" className="text-xs text-[#18659e] font-bold hover:underline">Forgot?</button>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#18659e] focus:outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full mt-2 py-4 rounded-2xl font-bold text-lg transition-all ${isLoading
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-[#18659e] text-white hover:bg-[#145385] shadow-lg shadow-blue-100"
                            }`}
                    >
                        {isLoading ? "Logging in..." : "Log In"}
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
                    onClick={() => { }} // Simulation
                    className="w-full py-4 rounded-2xl border-2 border-gray-100 font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
                >
                    <img src="https://img.icons8.com/color/48/google-logo.png" className="w-5 h-5" alt="Google" />
                    Google
                </button>

                <p className="text-center mt-8 text-gray-500 text-sm">
                    Don't have an account?{" "}
                    <button onClick={() => router.push("/signup/dob")} className="text-[#18659e] font-bold hover:underline">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
