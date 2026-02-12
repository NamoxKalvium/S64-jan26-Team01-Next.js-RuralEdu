"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const LoginContent = dynamic(() => import("@/components/auth/LoginContent"), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-[#f8fbff] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18659e]"></div>
        </div>
    )
});

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f8fbff] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18659e]"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
