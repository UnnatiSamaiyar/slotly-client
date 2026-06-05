"use client";
import { useEffect } from "react";
import { motion, useAnimation, type Variants } from "framer-motion";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ZapIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface ZapIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

const zapVariants: Variants = {
    animate: {
        opacity: [0, 1, 1, 0],
        pathLength: [0, 1, 1, 0],
        transition: {
            duration: 2.8,
            ease: "easeInOut" as const,
            repeat: Infinity,
            repeatDelay: 0.6,
            times: [0, 0.45, 0.75, 1],
        },
    },
    normal: {
        opacity: 1,
        pathLength: 1,
        transition: {
            duration: 0.4,
        },
    },
};

export function ZapIcon({ className, size = 28, ...props }: ZapIconProps) {
    const controls = useAnimation();

    useEffect(() => {
        controls.start("animate");
    }, [controls]);

    return (
        <div className={cn(className)} {...props}>
            <svg
                fill="none"
                height={size}
                width={size}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: "visible" }}
            >
                <motion.path
                    animate={controls}
                    variants={zapVariants}
                    d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                />
            </svg>
        </div>
    );
}