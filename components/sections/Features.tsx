


// // "use client";

// // import { motion } from "framer-motion";
// // import {
// //   CalendarDays,
// //   Bell,
// //   Clock,
// //   Users,
// //   ArrowRight,
// //   Sparkles,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardHeader, CardContent } from "../ui/card";

// // const features = [
// //   {
// //     icon: CalendarDays,
// //     title: "Intelligent Scheduling",
// //     desc: "Slotly reads availability patterns and suggests the best times for every participant — automatically.",
// //     color: "from-blue-600 to-indigo-600",
// //     chip: "AI-powered",
// //   },
// //   {
// //     icon: Clock,
// //     title: "Real-time Calendar Sync",
// //     desc: "Two-way sync across Google, Outlook, and iCal with instant updates — no more double-bookings.",
// //     color: "from-emerald-600 to-teal-600",
// //     chip: "Two-way sync",
// //   },
// //   {
// //     icon: Bell,
// //     title: "Smart Reminders",
// //     desc: "Automated confirmations and adaptive reminders that respect time zones and attendee behavior.",
// //     color: "from-purple-600 to-pink-600",
// //     chip: "Automations",
// //   },
// //   {
// //     icon: Users,
// //     title: "Team Coordination",
// //     desc: "Round-robin pages, shared availability, and team routing — built for high-volume scheduling.",
// //     color: "from-orange-600 to-red-600",
// //     chip: "For teams",
// //   },
// // ];

// // export function Features() {
// //   return (
// //     <section id="features" className="relative w-full overflow-hidden bg-white">
// //       {/* Calendly-level ambient backdrop */}
// //       <div aria-hidden="true" className="absolute inset-0 -z-10">
// //         <div className="absolute -top-[240px] left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-200/60 via-indigo-200/40 to-purple-200/30 blur-[120px]" />
// //         <div className="absolute -bottom-[260px] right-[-140px] h-[560px] w-[560px] rounded-full bg-blue-200/40 blur-[140px]" />
// //         <div className="absolute -bottom-[220px] left-[-160px] h-[520px] w-[520px] rounded-full bg-indigo-200/35 blur-[160px]" />
// //         {/* subtle grid */}
// //         <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
// //         {/* vignette */}
// //         <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white to-white" />
// //       </div>

// //       <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
// //         {/* Heading + CTA row */}
// //         <div className="mx-auto max-w-3xl text-center">
// //           <motion.div
// //             initial={{ opacity: 0, y: 18 }}
// //             whileInView={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.7, ease: "easeOut" }}
// //             viewport={{ once: true }}
// //             className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur"
// //           >
// //             <Sparkles className="h-4 w-4 text-blue-600" />
// //             Built for speed. Designed for teams.
// //           </motion.div>

// //           <motion.h2
// //             initial={{ opacity: 0, y: 22 }}
// //             whileInView={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
// //             viewport={{ once: true }}
// //             className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl leading-[1.05]"
// //           >
// //             Built with precision,
// //             <br />
// //             <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
// //               designed for flow.
// //             </span>
// //           </motion.h2>

// //           <motion.p
// //             initial={{ opacity: 0, y: 18 }}
// //             whileInView={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
// //             viewport={{ once: true }}
// //             className="mt-6 text-lg leading-8 text-gray-600"
// //           >
// //             Slotly brings structure, automation, and clarity — turning scheduling
// //             from back-and-forth into a single, confident step.
// //           </motion.p>

// //           <motion.div
// //             initial={{ opacity: 0, y: 16 }}
// //             whileInView={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.7, ease: "easeOut", delay: 0.18 }}
// //             viewport={{ once: true }}
// //             className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
// //           >
// //             {/* <Button
// //               size="lg"
// //               className="rounded-full px-10 py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_18px_55px_-18px_rgba(37,99,235,0.75)] transition-all"
// //             >
// //               Explore features <ArrowRight className="ml-2 h-4 w-4" />
// //             </Button>

// //             <Button
// //               variant="ghost"
// //               size="lg"
// //               className="rounded-full text-gray-700 hover:text-blue-600 hover:bg-transparent"
// //             >
// //               Watch demo →
// //             </Button> */}
// //           </motion.div>
// //         </div>

// //         {/* Feature Grid */}
// //         <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
// //           {features.map((f, i) => (
// //             <motion.div
// //               key={i}
// //               initial={{ opacity: 0, y: 26 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.65, ease: "easeOut", delay: i * 0.08 }}
// //               viewport={{ once: true }}
// //               className="h-full"
// //             >
// //               <Card className="relative h-full overflow-hidden rounded-3xl border border-gray-200/80 bg-white/75 p-1 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_30px_90px_-45px_rgba(59,130,246,0.45)]">
// //                 {/* Top gradient rail */}
// //                 <div
// //                   className={`absolute inset-x-0 top-0 h-[5px] bg-gradient-to-r ${f.color} opacity-80`}
// //                 />

// //                 {/* soft corner glow */}
// //                 <div
// //                   className={`absolute -right-20 -top-24 h-56 w-56 rounded-full bg-gradient-to-br ${f.color} blur-[70px] opacity-[0.18]`}
// //                 />

// //                 <CardHeader className="relative flex flex-col items-center justify-center pt-10 pb-4">
// //                   {/* chip */}
// //                   <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
// //                     <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${f.color}`} />
// //                     {f.chip}
// //                   </div>

// //                   {/* icon */}
// //                   <div
// //                     className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-[0_14px_28px_-18px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-105`}
// //                   >
// //                     <f.icon className="h-8 w-8" />
// //                     <div
// //                       className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.color} blur-xl opacity-35`}
// //                     />
// //                   </div>

// //                   <h3 className="mt-6 text-xl font-semibold text-gray-900">
// //                     {f.title}
// //                   </h3>
// //                 </CardHeader>

// //                 <CardContent className="relative">
// //                   <p className="px-6 pb-10 text-sm leading-relaxed text-gray-600">
// //                     {f.desc}
// //                   </p>

// //                   {/* bottom fade */}
// //                   <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/70 to-transparent" />
// //                 </CardContent>
// //               </Card>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// "use client";

// import { motion } from "framer-motion";
// import {
//   CalendarDays,
//   Bell,
//   Clock,
//   Users,
//   ArrowRight,
//   Sparkles,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardContent } from "../ui/card";

// const features = [
//   {
//     icon: CalendarDays,
//     title: "Intelligent Scheduling",
//     desc: "Slotly analyzes availability in real time and surfaces the optimal meeting window for every participant — no manual coordination required.",
//     color: "from-blue-600 to-indigo-600",
//     chip: "AI-powered",
//   },
//   {
//     icon: Clock,
//     title: "Real-time Calendar Sync",
//     desc: "Bi-directional sync with Google, Outlook, and iCal ensures your availability is always accurate — eliminating conflicts before they happen.",
//     color: "from-emerald-600 to-teal-600",
//     chip: "Two-way sync",
//   },
//   {
//     icon: Bell,
//     title: "Smart Reminders",
//     desc: "Automated confirmations and intelligent follow-ups adapt to each attendee's time zone — reducing no-shows without any manual effort.",
//     color: "from-purple-600 to-pink-600",
//     chip: "Automations",
//   },
//   {
//     icon: Users,
//     title: "Team Coordination",
//     desc: "Round-robin distribution, collective availability pages, and smart routing — purpose-built for high-performing scheduling teams.",
//     color: "from-orange-600 to-red-600",
//     chip: "For teams",
//   },
// ];

// export function Features() {
//   return (
//     <section id="features" className="relative w-full overflow-hidden bg-white">
//       {/* Calendly-level ambient backdrop */}
//       <div aria-hidden="true" className="absolute inset-0 -z-10">
//         <div className="absolute -top-[240px] left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-200/60 via-indigo-200/40 to-purple-200/30 blur-[120px]" />
//         <div className="absolute -bottom-[260px] right-[-140px] h-[560px] w-[560px] rounded-full bg-blue-200/40 blur-[140px]" />
//         <div className="absolute -bottom-[220px] left-[-160px] h-[520px] w-[520px] rounded-full bg-indigo-200/35 blur-[160px]" />
//         {/* subtle grid */}
//         <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
//         {/* vignette */}
//         <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white to-white" />
//       </div>

//       <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
//         {/* Heading + CTA row */}
//         <div className="mx-auto max-w-3xl text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 18 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, ease: "easeOut" }}
//             viewport={{ once: true }}
//             className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur"
//           >
//             <Sparkles className="h-4 w-4 text-blue-600" />
//             {/* ✏️ CHIP */}
//             Precision-built for modern teams.
//           </motion.div>

//           <motion.h2
//             initial={{ opacity: 0, y: 22 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
//             viewport={{ once: true }}
//             className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl leading-[1.05]"
//           >
//             {/* ✏️ H2 */}
//             Every feature built
//             <br />
//             <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//               to save you time.
//             </span>
//           </motion.h2>

//           <motion.p
//             initial={{ opacity: 0, y: 18 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
//             viewport={{ once: true }}
//             className="mt-6 text-lg leading-8 text-gray-600"
//           >
//             {/* ✏️ SUBTITLE */}
//             From solo professionals to enterprise teams — Slotly replaces
//             scheduling friction with intelligent automation that works quietly
//             in the background.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 16 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, ease: "easeOut", delay: 0.18 }}
//             viewport={{ once: true }}
//             className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
//           >
//             {/* <Button
//               size="lg"
//               className="rounded-full px-10 py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_18px_55px_-18px_rgba(37,99,235,0.75)] transition-all"
//             >
//               Explore features <ArrowRight className="ml-2 h-4 w-4" />
//             </Button>

//             <Button
//               variant="ghost"
//               size="lg"
//               className="rounded-full text-gray-700 hover:text-blue-600 hover:bg-transparent"
//             >
//               Watch demo →
//             </Button> */}
//           </motion.div>
//         </div>

//         {/* Feature Grid */}
//         <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
//           {features.map((f, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 26 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.65, ease: "easeOut", delay: i * 0.08 }}
//               viewport={{ once: true }}
//               className="h-full"
//             >
//               <Card className="relative h-full overflow-hidden rounded-3xl border border-gray-200/80 bg-white/75 p-1 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_30px_90px_-45px_rgba(59,130,246,0.45)]">
//                 {/* Top gradient rail */}
//                 <div
//                   className={`absolute inset-x-0 top-0 h-[5px] bg-gradient-to-r ${f.color} opacity-80`}
//                 />

//                 {/* soft corner glow */}
//                 <div
//                   className={`absolute -right-20 -top-24 h-56 w-56 rounded-full bg-gradient-to-br ${f.color} blur-[70px] opacity-[0.18]`}
//                 />

//                 <CardHeader className="relative flex flex-col items-center justify-center pt-10 pb-4">
//                   {/* chip */}
//                   <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
//                     <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${f.color}`} />
//                     {f.chip}
//                   </div>

//                   {/* icon */}
//                   <div
//                     className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-[0_14px_28px_-18px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-105`}
//                   >
//                     <f.icon className="h-8 w-8" />
//                     <div
//                       className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.color} blur-xl opacity-35`}
//                     />
//                   </div>

//                   <h3 className="mt-6 text-xl font-semibold text-gray-900">
//                     {f.title}
//                   </h3>
//                 </CardHeader>

//                 <CardContent className="relative">
//                   <p className="px-6 pb-10 text-sm leading-relaxed text-gray-600">
//                     {f.desc}
//                   </p>

//                   {/* bottom fade */}
//                   <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/70 to-transparent" />
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { CalendarDays, Bell, Clock, Users, Sparkles } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";

const features = [
  {
    icon: CalendarDays,
    title: "Intelligent scheduling",
    desc: "Set your availability once. Slotly surfaces the best slots automatically and reduces back-and-forth for every meeting.",
    color: "from-blue-600 to-indigo-600",
    chip: "Smart availability",
  },
  {
    icon: Clock,
    title: "Real-time calendar sync",
    desc: "Two-way sync with Google and Outlook keeps availability accurate and helps prevent conflicts and double bookings.",
    color: "from-emerald-600 to-teal-600",
    chip: "Two-way sync",
  },
  {
    icon: Bell,
    title: "Reliable reminders",
    desc: "Automated confirmations and reminders that adapt to time zones—so attendees show up, on time, every time.",
    color: "from-violet-600 to-fuchsia-600",
    chip: "Automations",
  },
  {
    icon: Users,
    title: "Team routing",
    desc: "Round-robin, pooled availability, and team assignment—built for teams scheduling at scale.",
    color: "from-orange-600 to-rose-600",
    chip: "For teams",
  },
];

export function Features() {
  return (
    <section id="features" className="relative w-full bg-white">
      {/* Cleaner, more professional backdrop */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* subtle top wash */}
        <div className="absolute -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-100/60 via-indigo-100/35 to-transparent blur-[110px]" />
        {/* very light grid */}
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />
        {/* vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            Product capabilities
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            viewport={{ once: true }}
            className="mt-6 text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900 leading-[1.08]"
          >
            Scheduling infrastructure for
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              individuals and teams.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-5 text-base sm:text-lg leading-7 text-gray-600"
          >
            Built to reduce coordination overhead, keep calendars accurate, and
            deliver a consistent booking experience—across time zones and work
            flows.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.06 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <Card className="group relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_-45px_rgba(15,23,42,0.35)]">
                {/* subtle top rail */}
                <div
                  className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${f.color} opacity-80`}
                />

                <CardHeader className="relative pt-7 pb-3">
                  {/* chip */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700">
                    <span
                      className={`h-2 w-2 rounded-full bg-gradient-to-r ${f.color}`}
                    />
                    {f.chip}
                  </div>

                  {/* icon */}
                  <div className="mt-5 flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-[0_10px_26px_-18px_rgba(0,0,0,0.45)]`}
                    >
                      <f.icon className="h-5 w-5" />
                    </div>

                    <h3 className="text-base font-semibold text-gray-900">
                      {f.title}
                    </h3>
                  </div>
                </CardHeader>

                <CardContent className="relative pb-7">
                  <p className="text-sm leading-6 text-gray-600">{f.desc}</p>
                </CardContent>

                {/* professional hover border (subtle) */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-gray-200/70 transition" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}