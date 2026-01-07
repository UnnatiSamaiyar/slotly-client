"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative w-full overflow-hidden bg-[radial-gradient(ellipse_80%_100%_at_center_bottom,_#eaf1ff_0%,_#ffffff_60%)]">
      {/* Ambient light glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[15%] left-[8%] w-[380px] h-[380px] bg-blue-100 blur-[170px] opacity-45" />
        <div className="absolute bottom-[5%] right-[8%] w-[520px] h-[520px] bg-indigo-100 blur-[190px] opacity-35" />
      </div>

      {/* ✅ tighter container + tighter padding so it doesn't feel "faila faila" */}
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] items-center gap-12 lg:gap-16">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-2xl text-center lg:text-left"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] tracking-tight text-gray-900">
              Simplify{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                your day
              </span>{" "}
              with effortless scheduling.
            </h2>

            <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
              No more coordination chaos. Slotly brings automation, clarity, and flow —
              so you can focus on work, not your calendar.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start">
              <Button
                size="lg"
                className="px-9 py-6 rounded-full text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_18px_55px_-25px_rgba(37,99,235,0.65)] transition-all"
              >
                Get Started Free
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-gray-700 hover:text-blue-600 hover:bg-transparent transition-all text-base"
              >
                Watch Demo →
              </Button>
            </div>

            {/* subtle micro trust line (Calendly-ish, but minimal) */}
            {/* <div className="mt-6 text-sm text-gray-500">
              No credit card required • Works with Google Calendar & Outlook
            </div> */}
          </motion.div>

          {/* Right: Image (smaller + cleaner) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.05 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <Image
                src="/assets/Home/cta_trans.png"
                alt="Smiling man using tablet"
                width={420}
                height={420}
                className="relative z-10 w-[320px] sm:w-[360px] lg:w-[420px] h-auto object-contain drop-shadow-[0_18px_45px_rgba(59,130,246,0.18)]"
                priority
              />

              {/* ✅ smaller platform so it doesn’t make the whole section feel huge */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[520px] h-[220px] rounded-full bg-gradient-to-t from-blue-50 via-transparent to-transparent blur-3xl opacity-80" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
