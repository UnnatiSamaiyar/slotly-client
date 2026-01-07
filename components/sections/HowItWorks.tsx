// "use client";

// import { motion } from "framer-motion";
// import Image from "next/image";
// import { CalendarCheck2, Clock, Zap, Bell } from "lucide-react";

// const highlights = [
//   {
//     id: 1,
//     icon: CalendarCheck2,
//     title: "Smart Slot Detection",
//     desc: "Slotly predicts optimal meeting times using AI-driven pattern recognition.",
//     color: "from-blue-500 to-indigo-500",
//     position: "top-[8%] left-[5%]",
//   },
//   {
//     id: 2,
//     icon: Clock,
//     title: "Time Zone Intelligence",
//     desc: "Your calendar auto-adjusts for global participants without manual conversions.",
//     color: "from-purple-500 to-pink-500",
//     position: "bottom-[8%] left-[8%]",
//   },
//   {
//     id: 3,
//     icon: Zap,
//     title: "Workflow Automation",
//     desc: "Automate confirmations, reminders, and follow-ups — zero manual effort.",
//     color: "from-emerald-500 to-teal-500",
//     position: "top-[5%] right-[5%]",
//   },
//   {
//     id: 4,
//     icon: Bell,
//     title: "Adaptive Notifications",
//     desc: "AI learns when your attendees are most responsive and adjusts send times.",
//     color: "from-orange-500 to-red-500",
//     position: "bottom-[10%] right-[8%]",
//   },
// ];

// export function HowItWorks() {
//   return (
//     <section className="relative w-full py-40 bg-gradient-to-b from-white via-[#f9fbff] to-white overflow-hidden">
//       {/* ambient soft glow */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute top-[15%] left-[20%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[180px] opacity-40" />
//         <div className="absolute bottom-[5%] right-[20%] w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[180px] opacity-40" />
//       </div>

//       <div className="container mx-auto px-6 text-center">
//         {/* heading */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           viewport={{ once: true }}
//           className="max-w-3xl mx-auto mb-20"
//         >
//           <h2 className="text-5xl font-semibold tracking-tight text-gray-900 mb-4">
//             Smarter Scheduling, <span className="text-blue-600">Simplified.</span>
//           </h2>
//           <p className="text-gray-600 text-lg">
//             Slotly connects intelligent automation with a clean user experience — everything just works.
//           </p>
//         </motion.div>

//         {/* core image */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="relative mx-auto max-w-6xl"
//         >
//           <Image
//             src="/dashboardhero.webp"
//             alt="Slotly dashboard preview"
//             width={1200}
//             height={700}
//             className="w-full h-auto rounded-2xl shadow-[0_20px_80px_-20px_rgba(59,130,246,0.2)]"
//             priority
//           />

//           {/* floating highlights */}
//           {highlights.map((h, i) => (
//             <motion.div
//               key={h.id}
//               initial={{ opacity: 0, y: 15 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: i * 0.2 }}
//               viewport={{ once: true }}
//               className={`absolute ${h.position} w-[260px] hidden md:block`}
//             >
//               <div className="relative rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-[0_8px_25px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_35px_-10px_rgba(0,0,0,0.3)] transition-all duration-500">
//                 <div
//                   className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${h.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
//                 />
//                 <div className="flex items-start gap-3">
//                   <div
//                     className={`p-3 rounded-xl bg-gradient-to-br ${h.color} text-white shadow-md`}
//                   >
//                     <h.icon className="w-5 h-5" />
//                   </div>
//                   <div className="text-left">
//                     <h4 className="text-base font-semibold">{h.title}</h4>
//                     <p className="text-sm text-gray-600 mt-1">{h.desc}</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// }







"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  CalendarCheck2,
  Clock,
  Zap,
  Bell,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const highlights = [
  {
    id: 1,
    icon: CalendarCheck2,
    title: "Smart Slot Detection",
    desc: "Slotly finds the best meeting windows using availability signals and scheduling intent.",
    color: "from-blue-600 to-indigo-600",
    position: "top-[10%] left-[3%]",
    delay: 0.15,
  },
  {
    id: 2,
    icon: Clock,
    title: "Time Zone Intelligence",
    desc: "Automatic localization for every attendee — no manual conversions, no confusion.",
    color: "from-purple-600 to-pink-600",
    position: "bottom-[10%] left-[6%]",
    delay: 0.28,
  },
  {
    id: 3,
    icon: Zap,
    title: "Workflow Automation",
    desc: "Confirmations, reminders, follow-ups, routing — handled end-to-end with zero busywork.",
    color: "from-emerald-600 to-teal-600",
    position: "top-[8%] right-[3%]",
    delay: 0.22,
  },
  {
    id: 4,
    icon: Bell,
    title: "Adaptive Notifications",
    desc: "Smart nudges that learn response patterns and optimize delivery timing automatically.",
    color: "from-orange-600 to-red-600",
    position: "bottom-[12%] right-[6%]",
    delay: 0.35,
  },
];

function FloatingCard({
  h,
  index,
}: {
  h: (typeof highlights)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: h.delay }}
      viewport={{ once: true }}
      className={`absolute ${h.position} hidden lg:block w-[300px]`}
    >
      <div className="group relative overflow-hidden rounded-3xl border border-gray-200/70 bg-white/75 backdrop-blur-md shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_85px_-45px_rgba(59,130,246,0.5)]">
        {/* top rail */}
        <div className={`h-[5px] w-full bg-gradient-to-r ${h.color} opacity-90`} />

        {/* soft glow blob */}
        <div
          className={`pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-gradient-to-br ${h.color} blur-[70px] opacity-[0.16]`}
        />

        <div className="relative p-5">
          <div className="flex items-start gap-4">
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${h.color} text-white shadow-[0_16px_30px_-18px_rgba(0,0,0,0.6)]`}
            >
              <h.icon className="h-5 w-5" />
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${h.color} blur-xl opacity-35`}
              />
            </div>

            <div className="min-w-0 text-left">
              <h4 className="text-base font-semibold text-gray-900 leading-snug">
                {h.title}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {h.desc}
              </p>
            </div>
          </div>

          {/* micro footer */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Automated, not complicated
            </span>
            <span className="rounded-full border border-gray-200 bg-white/70 px-2 py-1">
              0{index + 1}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Calendly-level ambient backdrop */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* top wash */}
        <div className="absolute -top-[240px] left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-200/55 via-indigo-200/35 to-purple-200/25 blur-[130px]" />
        {/* side glows */}
        <div className="absolute top-[18%] left-[-220px] h-[520px] w-[520px] rounded-full bg-blue-200/35 blur-[160px]" />
        <div className="absolute bottom-[8%] right-[-240px] h-[560px] w-[560px] rounded-full bg-indigo-200/35 blur-[180px]" />

        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.30] [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
        {/* vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white to-white" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            How Slotly works
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.06 }}
            viewport={{ once: true }}
            className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl leading-[1.05]"
          >
            Smarter scheduling,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              simplified.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
            viewport={{ once: true }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            Connect calendars, define rules, and share one link. Slotly handles
            time zones, routing, reminders, and meeting hygiene automatically.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.18 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-3 text-base font-semibold text-white shadow-[0_18px_55px_-18px_rgba(37,99,235,0.75)] transition-all hover:shadow-[0_28px_75px_-30px_rgba(37,99,235,0.85)]">
              See it in action <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            <button className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-medium text-gray-700 hover:text-blue-600">
              Explore automations →
            </button>
          </motion.div>
        </div>

        {/* Visual + floating highlights */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative mx-auto mt-14 max-w-6xl"
        >
          {/* Main product frame */}
          <div className="relative overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-[0_30px_110px_-55px_rgba(59,130,246,0.55)]">
            <Image
              src="/dashboardhero.webp"
              alt="Slotly dashboard preview"
              width={1200}
              height={700}
              priority
              className="w-full h-auto object-cover"
            />

            {/* top sheen + bottom fade for premium depth */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/35 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_10%,rgba(255,255,255,0.55),transparent_60%)]" />
          </div>

          {/* floating highlight cards (desktop) */}
          {highlights.map((h, i) => (
            <FloatingCard key={h.id} h={h} index={i} />
          ))}

          {/* Mobile highlights (clean row below image) */}
          <div className="mt-10 grid grid-cols-1 gap-4 lg:hidden">
            {highlights.map((h) => (
              <div
                key={h.id}
                className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.35)] backdrop-blur"
              >
                <div
                  className={`absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${h.color} blur-[70px] opacity-[0.14]`}
                />
                <div className="relative flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${h.color} text-white shadow-[0_16px_30px_-18px_rgba(0,0,0,0.6)]`}
                  >
                    <h.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">
                      {h.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
