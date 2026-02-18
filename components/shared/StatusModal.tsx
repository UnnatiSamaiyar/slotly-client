"use client";
import React, { useEffect, useState } from "react";

type Props = {
    open: boolean;
    type: "success" | "error";
    onClose: () => void;
};

export default function StatusModal({ open, type, onClose }: Props) {
    const [animateCircle, setAnimateCircle] = useState(false);
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        if (!open) {
            // Reset everything when closed
            setAnimateCircle(false);
            setShowText(false);
            return;
        }

        // Start animation immediately
        const startTimer = setTimeout(() => {
            setAnimateCircle(true);
        }, 50);

        // Show text after circle + tick complete
        const textTimer = setTimeout(() => {
            setShowText(true);
        }, 1300);

        // Auto close
        const closeTimer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(textTimer);
            clearTimeout(closeTimer);
        };
    }, [open, onClose]);

    if (!open) return null;

    const isSuccess = type === "success";

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 opacity-100">

                <div
                    className={`h-28 rounded-b-[50%] ${isSuccess ? "bg-green-50" : "bg-red-50"
                        }`}
                />

                <div className="absolute top-10 left-1/2 -translate-x-1/2">
                    <svg width="72" height="72" viewBox="0 0 72 72">
                        {/* background circle */}
                        <circle
                            cx="36"
                            cy="36"
                            r="30"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="4"
                        />

                        {/* animated circle */}
                        <circle
                            cx="36"
                            cy="36"
                            r="30"
                            fill="none"
                            stroke={isSuccess ? "#22c55e" : "#ef4444"}
                            strokeWidth="4"
                            strokeDasharray="188"
                            strokeDashoffset={animateCircle ? 0 : 188}
                            style={{
                                transition: "stroke-dashoffset 1s ease-out",
                            }}
                        />

                        {/* success tick or error cross */}
                        {isSuccess ? (
                            <path
                                d="M26 38 L34 46 L48 30"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="30"
                                strokeDashoffset={animateCircle ? 0 : 30}
                                style={{
                                    transition: "stroke-dashoffset 0.4s ease-out 1s",
                                }}
                            />
                        ) : (
                            <>
                                <line
                                    x1="28"
                                    y1="28"
                                    x2="44"
                                    y2="44"
                                    stroke="#ef4444"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                                <line
                                    x1="44"
                                    y1="28"
                                    x2="28"
                                    y2="44"
                                    stroke="#ef4444"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            </>
                        )}
                    </svg>
                </div>

                <div className="pt-20 pb-8 px-6 text-center transition-opacity duration-300">
                    {showText && (
                        <>
                            <h2 className="text-lg font-semibold mb-2">
                                {isSuccess ? "Successful!" : "Something went wrong"}
                            </h2>

                            <p className="text-sm text-gray-500 mb-4">
                                {isSuccess
                                    ? "Your meeting has been scheduled."
                                    : "Please try again."}
                            </p>

                            {isSuccess && (
                                <p className="text-xs text-gray-400">
                                    Redirecting to dashboard...
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
