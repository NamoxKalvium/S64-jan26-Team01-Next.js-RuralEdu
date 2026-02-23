"use client";

export default function StorageWidget() {
    return (
        <div className="bg-[#f8f9fa] p-5 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-600">💾</span>
                <h4 className="font-bold text-gray-700 text-sm">Device Storage</h4>
            </div>

            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gray-500 w-[30%]"></div>
            </div>
            <p className="text-xs text-gray-500 font-medium">1.2GB used of 4GB available for offline lessons.</p>
        </div>
    );
}
