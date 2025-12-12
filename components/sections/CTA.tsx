"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative w-full overflow-hidden bg-[radial-gradient(ellipse_80%_100%_at_center_bottom,_#eaf1ff_0%,_#ffffff_60%)] py-40">
      {/* Ambient light glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-blue-100 blur-[180px] opacity-50" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-100 blur-[200px] opacity-40" />
      </div>

      <div className="container relative z-10 mx-auto flex flex-col lg:flex-row items-center justify-between px-6 gap-20">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-xl text-center lg:text-left"
        >
          <h2 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-gray-900">
            Simplify <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">your day</span> with effortless scheduling.
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            No more coordination chaos. Slotly brings automation, clarity, and flow — 
            so you can focus on work, not your calendar.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-start justify-center">
            <Button
              size="lg"
              className="px-10 py-6 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_35px_-10px_rgba(37,99,235,0.6)] transition-all"
            >
              Get Started Free
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-gray-700 hover:text-blue-600 hover:bg-transparent transition-all"
            >
              Watch Demo →
            </Button>
          </div>
        </motion.div>

        {/* Right: Human + depth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative flex justify-center"
        >
          <div className="relative">
            <Image
              src="/menwithtab.png"
              alt="Smiling man using tablet"
              width={500}
              height={500}
              className="relative z-10 w-auto h-auto object-contain drop-shadow-[0_20px_40px_rgba(59,130,246,0.2)]"
              priority
            />

            {/* Circular soft platform under figure */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-gradient-to-t from-blue-50 via-transparent to-transparent blur-3xl opacity-80" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
