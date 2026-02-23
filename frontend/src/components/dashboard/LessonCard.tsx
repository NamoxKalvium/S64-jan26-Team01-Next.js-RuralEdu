"use client";

interface LessonCardProps {
    title: string;
    description: string;
    status: "downloaded" | "downloadable" | "offline-ready";
    icon: string;
}

export default function LessonCard({ title, description, status, icon }: LessonCardProps) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#18659e] transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#f0f7ff] flex items-center justify-center text-xl">
                    {icon}
                </div>
                {status === "downloaded" ? (
                    <div className="text-green-500 bg-green-50 p-1.5 rounded-full" title="Offline Ready">
                        ✅
                    </div>
                ) : (
                    <div className="text-gray-400 bg-gray-50 p-1.5 rounded-full group-hover:text-[#18659e] cursor-pointer" title="Download">
                        ⬇️
                    </div>
                )}
            </div>

            <h4 className="font-bold text-gray-800 mb-1 line-clamp-1">{title}</h4>
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{description}</p>

            <button className={`w-full py-2.5 rounded-xl text-sm font-bold border transition-all ${status === "downloaded"
                    ? "bg-white border-gray-100 text-gray-800 hover:bg-gray-50"
                    : "bg-white border-dashed border-[#18659e] text-[#18659e] hover:bg-[#18659e] hover:text-white"
                }`}>
                {status === "downloaded" ? "Review" : "Download Lesson"}
            </button>

            {status === "downloaded" && (
                <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full"></div>
                </div>
            )}
        </div>
    );
}
