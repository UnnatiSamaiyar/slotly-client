"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Soft gradient backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]"
      />

      <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:flex lg:items-center lg:justify-between">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            The future of <span className="text-blue-600">time</span> management.
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Slotly makes scheduling feel effortless. No back-and-forth emails,
            no timezone headaches — just seamless coordination that adapts to
            you and your team.
          </p>

          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg" className="px-8 rounded-full">
              Get Started
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-blue-600 hover:bg-transparent"
            >
              Watch demo →
            </Button>
          </div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-16 lg:mt-0 lg:w-1/2 flex justify-center"
        >
          <div className="relative w-full max-w-[560px] rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden">
            <Image
              src="/dashboardhero.webp"
              alt="Slotly dashboard preview"
              width={800}
              height={500}
              className="w-full h-auto"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
