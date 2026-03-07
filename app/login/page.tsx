"use client";

import Image from "next/image";
import { useMemo } from "react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import EmailAuthPanel from "@/components/auth/EmailAuthPanel";
import { motion } from "framer-motion";

export default function LoginPage() {

  /* ===== REAL BROWSER CALENDAR ===== */

  const today = new Date();

  const currentMonth = today.toLocaleString("default", {
    month: "long",
  });

  const currentYear = today.getFullYear();

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();

  const daysArray = useMemo<(number | null)[]>(() => {
    const blanks = Array.from({ length: startDay }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...blanks, ...days];
  }, [daysInMonth, startDay]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">

      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 flex justify-center px-6 sm:px-10 py-10">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            {/* Logo */}
            <div className="mb-6">
              <Image
                src="/Slotlyio-logo.webp"
                alt="Slotly Logo"
                width={100}
                height={20}
                priority
              />
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to your workspace
            </p>

            {/* Google Button */}
            <div className="mt-6">
              <GoogleLoginButton />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <EmailAuthPanel />
          </motion.div>
        </div>

        {/* RIGHT SECTION */}
        <div className="relative hidden lg:flex w-1/2 items-center justify-center bg-gray-50 overflow-hidden p-10">

          {/* Animated Blue Dots */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(37,99,235,0.8) 1.6px, transparent 1.6px)",
            
              backgroundSize: "30px 30px",
              animation: "moveDots 60s linear infinite",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
            }}
          />

          {/* Calendar Card */}
          <div className="relative z-10 bg-white p-7 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">

            {/* Month */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-gray-900">
                {currentMonth} {currentYear}
              </h3>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-3">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-7 text-center text-sm gap-y-2">
              {daysArray.map((day, index) =>
                day !== null ? (
                  <div
                    key={index}
                    className={`py-1.5 rounded-md transition-all duration-200 ${day === today.getDate()
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {day}
                  </div>
                ) : (
                  <div key={index} />
                )
              )}
            </div>

            {/* Bottom Content */}
            <div className="mt-7 text-center">
              <h2 className="text-sm font-semibold text-gray-900">
                Plan smarter. Stay organized.
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Schedule meetings and manage availability in one place.
              </p>
            </div>

          </div>
        </div>
      </div>
      <style jsx>{`
  @keyframes moveDots {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 0 400px;
    }
  }
`}</style>
    </div>
    
  );
}