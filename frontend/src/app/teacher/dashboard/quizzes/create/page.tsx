"use client";

import { createQuiz, QuestionInput } from "@/app/actions/quiz";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CreateQuizPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<QuestionInput[]>([
        { text: "", options: ["", "", "", ""], correctOptionIndex: 0 },
    ]);
    const [status, setStatus] = useState<"idle" | "saving" | "offline-save">("idle");

    // Load draft
    useEffect(() => {
        const savedDraft = localStorage.getItem("quiz_draft");
        if (savedDraft) {
            const data = JSON.parse(savedDraft);
            setTitle(data.title || "");
            setQuestions(data.questions || []);
        }
    }, []);

    // Save draft
    const saveDraft = (newTitle: string, newQuestions: QuestionInput[]) => {
        localStorage.setItem("quiz_draft", JSON.stringify({ title: newTitle, questions: newQuestions }));
    };

    const handleQuestionChange = (index: number, field: keyof QuestionInput, value: any) => {
        const newQuestions = [...questions];
        (newQuestions[index] as any)[field] = value;
        setQuestions(newQuestions);
        saveDraft(title, newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
        saveDraft(title, newQuestions);
    };

    const addQuestion = () => {
        const newQuestions = [...questions, { text: "", options: ["", "", "", ""], correctOptionIndex: 0 }];
        setQuestions(newQuestions);
        saveDraft(title, newQuestions);
    };

    const removeQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
        saveDraft(title, newQuestions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!navigator.onLine) {
            setStatus("offline-save");
            setTimeout(() => {
                router.push("/teacher/dashboard/quizzes");
            }, 1500);
            return;
        }

        setStatus("saving");
        const result = await createQuiz(title, null, questions); // lessonId is null for now

        if (result.success) {
            localStorage.removeItem("quiz_draft");
            router.push("/teacher/dashboard/quizzes");
        } else {
            alert("Error creating quiz: " + result.error);
            setStatus("idle");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fbff] p-6 flex justify-center pb-20">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 font-bold">
                        ← Cancel
                    </button>
                    <div className="text-sm font-bold text-gray-400">
                        {status === "offline-save" ? (
                            <span className="text-orange-500">Saved to Device (Offline)</span>
                        ) : status === "saving" ? (
                            <span className="text-purple-500">Syncing...</span>
                        ) : (
                            <span>Auto-saved locally</span>
                        )}
                    </div>
                </div>

                <h1 className="text-3xl font-black text-purple-700 mb-8">Create New Quiz</h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Quiz Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                saveDraft(e.target.value, questions);
                            }}
                            required
                            placeholder="e.g. Algebra Basics Test"
                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-purple-500 focus:outline-none transition-all font-bold text-lg"
                        />
                    </div>

                    <div className="space-y-6">
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-600">Question {qIndex + 1}</h3>
                                    {questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(qIndex)}
                                            className="text-red-400 hover:text-red-600 font-bold text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    value={q.text}
                                    onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                                    required
                                    placeholder="Enter your question here..."
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none mb-4"
                                />

                                <div className="space-y-3">
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name={`correct-${qIndex}`}
                                                checked={q.correctOptionIndex === oIndex}
                                                onChange={() => handleQuestionChange(qIndex, "correctOptionIndex", oIndex)}
                                                className="w-5 h-5 text-purple-600"
                                            />
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                required
                                                placeholder={`Option ${oIndex + 1}`}
                                                className={`flex-1 p-2 rounded-lg border focus:outline-none transition-all ${q.correctOptionIndex === oIndex
                                                        ? "border-green-400 bg-green-50 text-green-800 font-medium"
                                                        : "border-gray-200"
                                                    }`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full py-3 bg-purple-50 text-purple-600 font-bold rounded-xl border-2 border-dashed border-purple-100 hover:bg-purple-100 transition-all"
                    >
                        + Add Question
                    </button>

                    <button
                        type="submit"
                        disabled={status === "saving"}
                        className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 disabled:opacity-50"
                    >
                        {status === "saving" ? "Publishing..." : "Save & Publish Quiz"}
                    </button>
                </form>
            </div>
        </div>
    );
}
