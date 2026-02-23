"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAnnouncement } from "@/app/actions/announcement";
// Import other create actions if needed, though mostly we just need them available.
// In a real app we might have a dedicated sync action that handles batch processing.

export default function SyncStatus() {
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [pendingItems, setPendingItems] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Initial check
        setIsOnline(navigator.onLine);
        checkPendingItems();

        // Listeners
        const handleOnline = () => {
            setIsOnline(true);
            syncData();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Periodic check for pending items (in case they are added)
        const interval = setInterval(checkPendingItems, 2000);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            clearInterval(interval);
        };
    }, []);

    const checkPendingItems = () => {
        let count = 0;
        // Check Announcements
        const announcementQueue = JSON.parse(localStorage.getItem("announcement_queue") || "[]");
        count += announcementQueue.length;

        // We could also check for lesson drafts if we auto-published them, 
        // but currently lesson drafts are just "Saved to device" and waiting for user to click "Publish".
        // Announcements are "fire and forget" so they are in a queue.

        setPendingItems(count);
    };

    const syncData = async () => {
        if (isSyncing) return;
        setIsSyncing(true);

        try {
            // Process Announcements
            const announcementQueue = JSON.parse(localStorage.getItem("announcement_queue") || "[]");
            if (announcementQueue.length > 0) {
                for (const item of announcementQueue) {
                    // item.content now contains { title, content, classId }
                    await createAnnouncement(item.content);
                }
                localStorage.removeItem("announcement_queue");
                router.refresh(); // Refresh UI to show real data
            }

            // Future: Process other prioritized queues

            checkPendingItems();
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    if (isOnline && pendingItems === 0) {
        return (
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 transition-all">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Online</span>
            </div>
        );
    }

    if (!isOnline) {
        return (
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 transition-all">
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Offline</span>
                {pendingItems > 0 && (
                    <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 rounded-md border border-orange-200">
                        {pendingItems} Pending
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 transition-all animate-pulse">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Syncing...</span>
        </div>
    );
}
