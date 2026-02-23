'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LearnerSignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);

    // Step 1: DOB State
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    // Step 2: Account Details State
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (month && year) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const dob = `${year}-${month}-01`;

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: 'learner',
                    dateOfBirth: new Date(dob).toISOString(),
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
            router.push('/student/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                        {step === 1
                            ? "Regardless of who you are, mastering even just one more skill on Khan Academy results in learning gains."
                            : "Learners have spent 58.7 billion minutes learning on Khan Academy. 58 billion minutes is equivalent to 110,171 years."
                        }
                    </p>
                </div>

                {/* Right Side: Form */}
                <div className="flex flex-col max-w-md w-full">
                    {step === 1 ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <button onClick={handleBack} className="text-[#1865f2] hover:underline mb-4 font-medium flex items-center text-left">
                                <span className="mr-1">‹</span> Back
                            </button>

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
                        </>
                    )}

                    <p className="mt-6 text-sm text-gray-600">
                        Already have a Khan Academy account? <Link href="/login" className="text-[#1865f2] hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
