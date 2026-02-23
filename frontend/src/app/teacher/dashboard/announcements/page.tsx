"use client";

import { createAnnouncement, getAnnouncements, getClasses } from "@/app/actions/announcement";
import { useState, useEffect } from "react";

// Define a type that covers both Teacher and Student views
type Announcement = {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    teacher?: { fullName: string | null };
    class?: { name: string | null };
};

type Class = {
    id: string;
    name: string;
};

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("");
    const [status, setStatus] = useState<"idle" | "saving" | "offline-save">("idle");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [announcementData, classData] = await Promise.all([
                getAnnouncements(),
                getClasses()
            ]);
            setAnnouncements(announcementData as Announcement[]);
            setClasses(classData);
        } catch (e) {
            console.error("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const announcementData = {
            title,
            content,
            classId: selectedClassId || undefined
        };

        if (!navigator.onLine) {
            // Offline Optimistic UI
            const newAnnouncement: Announcement = {
                id: "temp-" + Date.now(),
                title,
                content: content,
                createdAt: new Date(),
            };
            setAnnouncements([newAnnouncement, ...announcements]);

            // Save to local queue
            const queue = JSON.parse(localStorage.getItem("announcement_queue") || "[]");
            queue.push({ content: announcementData, createdAt: Date.now() });
            localStorage.setItem("announcement_queue", JSON.stringify(queue));

            setTitle("");
            setContent("");
            setSelectedClassId("");
            setStatus("offline-save");
            setTimeout(() => setStatus("idle"), 3000);
            return;
        }

        setStatus("saving");
        const result = await createAnnouncement(announcementData);

        if (result.success) {
            setTitle("");
            setContent("");
            setSelectedClassId("");
            setStatus("idle");
            const data = await getAnnouncements(); // Refresh list
            setAnnouncements(data as Announcement[]);
        } else {
            alert(result.error);
            setStatus("idle");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fbff] p-6 pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#18659e]">Announcements</h1>
                <p className="text-gray-500">Share updates with your students</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Post Update</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Announcement Title"
                                className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#18659e] focus:outline-none mb-3"
                            />

                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                placeholder="What's happening in class?"
                                className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#18659e] focus:outline-none min-h-[120px] mb-3 resize-none"
                            ></textarea>

                            <select
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#18659e] focus:outline-none mb-4 bg-white"
                            >
                                <option value="">All Classes (Global)</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>

                            {status === "offline-save" && (
                                <p className="text-orange-500 text-xs font-bold mb-2">Saved offline. Will sync when online.</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === "saving" || !content.trim() || !title.trim()}
                                className="w-full py-3 bg-[#18659e] text-white font-bold rounded-xl hover:bg-[#145385] transition-all disabled:opacity-50"
                            >
                                {status === "saving" ? "Posting..." : "Post Announcement"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-400">Loading updates...</div>
                    ) : announcements.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                            <div className="text-4xl mb-2">📢</div>
                            <p className="text-gray-500 font-medium">No announcements yet</p>
                        </div>
                    ) : (
                        announcements.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                                {item.id.startsWith("temp-") && (
                                    <div className="absolute top-4 right-4 text-orange-400 text-xs font-bold border border-orange-200 px-2 py-1 rounded-full bg-orange-50">
                                        Pending Sync
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#18659e] font-bold">
                                        {item.teacher?.fullName?.[0] || "T"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 text-sm">{item.teacher?.fullName || "You"}</h3>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-[#18659e] bg-blue-50 px-2 py-0.5 rounded uppercase">
                                                {item.class?.name || "Global"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {item.content}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
