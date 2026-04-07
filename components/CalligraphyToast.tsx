"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
    name: string;
    show: boolean;
    onDone?: () => void;
};

export default function CalligraphyToast({ name, show, onDone }: Props) {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
                onDone?.();
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!visible) return null;

    const text = `Welcome back, ${name}`;

    return (
        <div className="fixed top-6 right-6 z-50">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl px-6 py-4"
            >
                <CalligraphyText text={text} />
            </motion.div>
        </div>
    );
}

function CalligraphyText({ text }: { text: string }) {
    return (
        <svg
            viewBox="0 0 600 80"
            className="w-[300px] h-[50px]"
        >
            <text
                x="0"
                y="50"
                fill="none"
                stroke="black"
                strokeWidth="1.2"
                className="font-[cursive]"
            >
                <motion.tspan
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                    }}
                >
                    {text}
                </motion.tspan>
            </text>
        </svg>
    );
}