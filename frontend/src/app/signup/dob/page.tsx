import { Suspense } from "react";
import DOBForm from "./DOBForm";

export default function DOBPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f8fbff] flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
                    <p className="text-gray-500">Loading form...</p>
                </div>
            </div>
        }>
            <DOBForm />
        </Suspense>
    );
}
