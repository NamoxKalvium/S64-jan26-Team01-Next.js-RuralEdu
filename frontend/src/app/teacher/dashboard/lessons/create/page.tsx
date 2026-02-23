"use client";

import { createLesson } from "@/app/actions/lesson";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function CreateLessonPage() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<"idle" | "saving" | "offline-save">("idle");
    const [formData, setFormData] = useState({ title: "", description: "", content: "" });

    // Load draft from local storage on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem("lesson_draft");
        if (savedDraft) {
            setFormData(JSON.parse(savedDraft));
        }
    }, []);

    // Save to local storage on change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newData = { ...formData, [name]: value };
        setFormData(newData);
        localStorage.setItem("lesson_draft", JSON.stringify(newData));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!navigator.onLine) {
            // Offline Mode: Just keep it in local storage (it's already there)
            setStatus("offline-save");
            setTimeout(() => {
                router.push("/teacher/dashboard/lessons");
            }, 1000);
            return;
        }

        setStatus("saving");
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("content", formData.content);

        const result = await createLesson(formDataToSend);

        if (result.success) {
            localStorage.removeItem("lesson_draft");
            router.push("/teacher/dashboard/lessons");
        } else {
            alert("Error creating lesson");
            setStatus("idle");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fbff] p-6 flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 font-bold">
                        ← Cancel
                    </button>
                    <div className="text-sm font-bold text-gray-400">
                        {status === "offline-save" ? (
                            <span className="text-orange-500">Saved to Device (Offline)</span>
                        ) : status === "saving" ? (
                            <span className="text-blue-500">Syncing...</span>
                        ) : (
                            <span>Auto-saved locally</span>
                        )}
                    </div>
                </div>

                <h1 className="text-3xl font-black text-[#18659e] mb-8">Create New Lesson</h1>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Lesson Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Introduction to Photosynthesis"
                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#18659e] focus:outline-none transition-all font-bold text-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief summary of what this lesson covers..."
                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#18659e] focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Lesson Notes (Content)</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            placeholder="Type your lesson content here..."
                            rows={10}
                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#18659e] focus:outline-none transition-all resize-y"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "saving"}
                        className="w-full py-4 bg-[#18659e] text-white font-bold rounded-xl hover:bg-[#145385] transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                    >
                        {status === "saving" ? "Publishing..." : "Save & Publish"}
                    </button>
                </form>
            </div>
        </div>
    );
}
