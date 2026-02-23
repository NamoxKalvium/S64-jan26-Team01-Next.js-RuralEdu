"use client";

import { useEffect, useState } from "react";
import { getAllAnnouncements, saveAnnouncements, AnnouncementData } from "@/lib/indexeddb";

export default function AnnouncementsPanel() {
    const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setIsOffline(!navigator.onLine);

            // Try to load from offline storage first for instant feedback
            const offlineData = await getAllAnnouncements();
            if (offlineData.length > 0) {
                setAnnouncements(offlineData);
                setLoading(false);
            }

            if (navigator.onLine) {
                try {
                    const response = await fetch("/api/announcements");
                    if (response.ok) {
                        const data = await response.json();
                        setAnnouncements(data);
                        // Update offline storage
                        await saveAnnouncements(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch announcements from API:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchAnnouncements();

        const handleOnline = () => {
            setIsOffline(false);
            fetchAnnouncements();
        };
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (loading && announcements.length === 0) {
        return (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-pulse mb-8">
                <div className="h-6 w-48 bg-gray-100 rounded mb-4"></div>
                <div className="space-y-4">
                    <div className="h-20 bg-gray-50 rounded-2xl"></div>
                    <div className="h-20 bg-gray-50 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (!loading && announcements.length === 0) {
        return null; // Don't show anything if no announcements
    }

    return (
        <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="flex items-center gap-2 font-black text-gray-800 text-lg">
                    <span className="text-[#18659e]">📢</span> Announcements
                </h2>
                {isOffline && (
                    <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-100">
                        Offline Mode
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <div
                        key={announcement.id}
                        className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-100 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 leading-snug group-hover:text-[#18659e] transition-colors">
                                {announcement.title}
                            </h3>
                            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-4">
                                {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                            {announcement.content}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-[10px] font-bold text-[#18659e]">
                                {announcement.teacher?.fullName?.[0] || "T"}
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                {announcement.teacher?.fullName || "Teacher"}
                                {announcement.class && (
                                    <span className="text-blue-400 ml-1">• {announcement.class.name}</span>
                                )}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
