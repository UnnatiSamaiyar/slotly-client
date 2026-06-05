"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ClockIconAutoProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

export function ClockIconAuto({ className, size = 28, ...props }: ClockIconAutoProps) {
    const hourControls = useAnimation();
    const minuteControls = useAnimation();

    useEffect(() => {
        // Continuously spin the hour hand
        hourControls.start({
            rotate: 360,
            transition: {
                duration: 6,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
            },
        });

        // Minute hand moves faster
        minuteControls.start({
            rotate: 360,
            transition: {
                duration: 1,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
            },
        });
    }, [hourControls, minuteControls]);

    return (
        <div className={cn(className)} {...props}>
            <svg
                fill="none"
                height={size}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width={size}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="12" r="10" />
                {/* Hour hand */}
                <motion.line
                    animate={hourControls}
                    style={{ originX: "12px", originY: "12px" }}
                    x1="12" y1="12" x2="12" y2="6"
                />
                {/* Minute hand */}
                <motion.line
                    animate={minuteControls}
                    style={{ originX: "12px", originY: "12px" }}
                    x1="12" y1="12" x2="16" y2="12"
                />
            </svg>
        </div>
    );
}