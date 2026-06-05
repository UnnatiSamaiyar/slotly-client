"use client";
import { useEffect } from "react";
import { motion, useAnimation, type Variants } from "motion/react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CoffeeIconAutoProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

const steamVariants: Variants = {
    animate: (delaySeconds: number) => ({
        y: [0, -4, 0],
        opacity: [0, 1, 0],
        transition: {
            duration: 1.6,
            ease: "easeInOut",
            repeat: Infinity,
            delay: delaySeconds,
        },
    }),
};

export function CoffeeIconAuto({ className, size = 28, ...props }: CoffeeIconAutoProps) {
    const c1 = useAnimation();
    const c2 = useAnimation();
    const c3 = useAnimation();

    useEffect(() => {
        c1.start("animate");
        c2.start("animate");
        c3.start("animate");
    }, [c1, c2, c3]);

    return (
        <div className={cn(className)} {...props}>
            <svg
                fill="none"
                height={size}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                style={{ overflow: "visible" }}
                viewBox="0 0 24 24"
                width={size}
                xmlns="http://www.w3.org/2000/svg"
            >
                <motion.path animate={c1} custom={0} variants={steamVariants} d="M6 2v2" />
                <motion.path animate={c2} custom={0.3} variants={steamVariants} d="M10 2v2" />
                <motion.path animate={c3} custom={0.6} variants={steamVariants} d="M14 2v2" />
                <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
            </svg>
        </div>
    );
}