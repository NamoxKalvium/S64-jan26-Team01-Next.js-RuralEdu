'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LearnerDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dob = searchParams.get('dob');

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: 'learner',
                    dateOfBirth: dob ? new Date(dob).toISOString() : null,
                    email,
                    username,
                    password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // Success, redirect to dashboard
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                        Learners have spent 58.7 billion minutes learning on Khan Academy. 58 billion minutes is equivalent to 110,171 years.
                    </p>
                </div>

                {/* Right Side: Form */}
                <div className="flex flex-col max-w-md w-full">
                    <Link href="/signup/learner" className="text-[#1865f2] hover:underline mb-4 font-medium flex items-center">
                        <span className="mr-1">‹</span> Back
                    </Link>

                    <h1 className="text-2xl font-bold text-[#333333] mb-6">Sign up as a learner today!</h1>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="flex items-start gap-2 mb-4">
                            <input type="checkbox" id="terms" className="mt-1" required />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                By checking this box, I agree to the <a href="#" className="text-[#1865f2]">Terms of Service</a> and <a href="#" className="text-[#1865f2]">Privacy Policy</a>.
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                What is your parent or guardian's email? <span className="text-gray-400 text-xs float-right">required</span>
                            </label>
                            <p className="text-xs text-gray-500 mb-2">You'll need permission to use Khan Academy</p>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                Choose a username <span className="text-gray-400 text-xs float-right">required</span>
                            </label>
                            <p className="text-xs text-gray-500 mb-2">Use letters and numbers only. For safety, don't use your real name.</p>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Password <span className="text-gray-400 font-normal text-xs float-right">required</span>
                            </label>
                            <p className="text-xs text-gray-500 mb-2">Passwords should be at least 8 characters long and should contain a mixture of letters, numbers, and other characters.</p>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full p-3 bg-[#1865f2] hover:bg-[#0b5cff] rounded font-bold text-white transition-colors disabled:opacity-70"
                        >
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-gray-600">
                        Already have a Khan Academy account? <Link href="/login" className="text-[#1865f2] hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
