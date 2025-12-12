"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CalendarCheck2, Clock, Zap, Bell } from "lucide-react";

const highlights = [
  {
    id: 1,
    icon: CalendarCheck2,
    title: "Smart Slot Detection",
    desc: "Slotly predicts optimal meeting times using AI-driven pattern recognition.",
    color: "from-blue-500 to-indigo-500",
    position: "top-[8%] left-[5%]",
  },
  {
    id: 2,
    icon: Clock,
    title: "Time Zone Intelligence",
    desc: "Your calendar auto-adjusts for global participants without manual conversions.",
    color: "from-purple-500 to-pink-500",
    position: "bottom-[8%] left-[8%]",
  },
  {
    id: 3,
    icon: Zap,
    title: "Workflow Automation",
    desc: "Automate confirmations, reminders, and follow-ups — zero manual effort.",
    color: "from-emerald-500 to-teal-500",
    position: "top-[5%] right-[5%]",
  },
  {
    id: 4,
    icon: Bell,
    title: "Adaptive Notifications",
    desc: "AI learns when your attendees are most responsive and adjusts send times.",
    color: "from-orange-500 to-red-500",
    position: "bottom-[10%] right-[8%]",
  },
];

export function HowItWorks() {
  return (
    <section className="relative w-full py-40 bg-gradient-to-b from-white via-[#f9fbff] to-white overflow-hidden">
      {/* ambient soft glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[15%] left-[20%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[180px] opacity-40" />
        <div className="absolute bottom-[5%] right-[20%] w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[180px] opacity-40" />
      </div>

      <div className="container mx-auto px-6 text-center">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-5xl font-semibold tracking-tight text-gray-900 mb-4">
            Smarter Scheduling, <span className="text-blue-600">Simplified.</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Slotly connects intelligent automation with a clean user experience — everything just works.
          </p>
        </motion.div>

        {/* core image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-6xl"
        >
          <Image
            src="/dashboardhero.webp"
            alt="Slotly dashboard preview"
            width={1200}
            height={700}
            className="w-full h-auto rounded-2xl shadow-[0_20px_80px_-20px_rgba(59,130,246,0.2)]"
            priority
          />

          {/* floating highlights */}
          {highlights.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`absolute ${h.position} w-[260px] hidden md:block`}
            >
              <div className="relative rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-[0_8px_25px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_35px_-10px_rgba(0,0,0,0.3)] transition-all duration-500">
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${h.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <div className="flex items-start gap-3">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${h.color} text-white shadow-md`}
                  >
                    <h.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-base font-semibold">{h.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{h.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
