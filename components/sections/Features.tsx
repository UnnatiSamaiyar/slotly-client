"use client";

import { motion } from "framer-motion";
import { CalendarDays, Bell, Clock, Users } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";

const features = [
  {
    icon: CalendarDays,
    title: "Intelligent Scheduling",
    desc: "Slotly analyzes availability patterns and suggests optimal meeting times for every participant.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Clock,
    title: "Real-time Calendar Sync",
    desc: "Two-way sync across Google, Outlook, and iCal with instant updates — no more double-bookings.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    desc: "Automated notifications and adaptive reminders based on time zones and attendee behavior.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Team Coordination",
    desc: "Collaborate with teammates using shared scheduling pages, round-robin meetings, and unified dashboards.",
    color: "from-orange-500 to-red-500",
  },
];

export function Features() {
  return (
    <section className="relative w-full py-32 overflow-hidden bg-gradient-to-b from-white via-[#f9fbff] to-white">
      {/* Soft light gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-[20%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[150px] opacity-40" />
        <div className="absolute bottom-[-150px] right-[15%] w-[700px] h-[700px] bg-indigo-100 rounded-full blur-[200px] opacity-50" />
      </div>

      <div className="container mx-auto px-6 text-center">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-5xl font-semibold tracking-tight text-gray-900 mb-4">
            Built with precision, designed for flow.
          </h2>
          <p className="text-gray-600 text-lg">
            Slotly brings structure, automation, and speed — transforming your scheduling workflow from chaos to clarity.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative group border border-gray-200 backdrop-blur-sm bg-white/80 hover:bg-white/95 hover:border-transparent shadow-[0_10px_40px_-15px_rgba(59,130,246,0.2)] transition-all duration-500 rounded-2xl p-1 overflow-hidden">
                {/* Icon Glow */}
                <div
                  className={`absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r ${f.color} opacity-70 group-hover:opacity-100 transition-all duration-500`}
                />

                <CardHeader className="flex flex-col items-center justify-center pt-10 pb-4">
                  <div
                    className={`relative flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-[0_10px_20px_rgba(0,0,0,0.08)] group-hover:scale-105 transition-transform duration-500`}
                  >
                    <f.icon className="w-8 h-8" />
                    {/* Soft glow halo */}
                    <div
                      className={`absolute inset-0 blur-xl bg-gradient-to-br ${f.color} opacity-30 group-hover:opacity-60 transition-opacity`}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{f.title}</h3>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed px-5 pb-8">
                    {f.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
