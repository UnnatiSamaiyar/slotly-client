// "use client";

// import React, { useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   ShieldCheck,
//   Lock,
//   BadgeCheck,
//   Fingerprint,
//   ChevronDown,
//   Sparkles,
//   Globe2,
//   Users,
//   CalendarDays,
//   Clock,
//   RefreshCw,
// } from "lucide-react";

// /* =========================================================
//    Attractive (Calendly-level) Rebuild:
//    1) Security & Trust: dark premium panel + trust metrics + cards
//    2) FAQ: elegant accordion + left "quick facts" rail

//    - No external UI components
//    - Single file exports: SecurityTrustSection, FAQSection
//    ========================================================= */

// export function SecurityTrustSection() {
//   const pillars = [
//     {
//       icon: ShieldCheck,
//       title: "Secure OAuth",
//       desc: "Industry-standard OAuth with scoped permissions to keep access controlled.",
//     },
//     {
//       icon: Lock,
//       title: "Data encrypted",
//       desc: "Encryption in transit and at rest to protect scheduling data end-to-end.",
//     },
//     {
//       icon: BadgeCheck,
//       title: "GDPR-ready",
//       desc: "Privacy controls and data handling designed to support GDPR workflows.",
//     },
//     {
//       icon: Fingerprint,
//       title: "Privacy-first",
//       desc: "Share availability without exposing private calendar details to attendees.",
//     },
//   ];

//   const metrics = [
//     { label: "OAuth-based access", value: "Scoped" },
//     { label: "Data protection", value: "Encrypted" },
//     { label: "Privacy posture", value: "Minimal sharing" },
//     { label: "Compliance readiness", value: "GDPR" },
//   ];

//   return (
//     <section className="relative w-full overflow-hidden bg-white">
//       {/* Premium background */}
//       <div aria-hidden className="absolute inset-0 -z-10">
//         <div className="absolute -top-44 left-1/2 h-[680px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-100/70 via-indigo-50/50 to-white blur-[140px]" />
//         <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white" />
//       </div>

//       <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
//         {/* Headline row */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
//           <motion.div
//             initial={{ opacity: 0, y: 14 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.55, ease: "easeOut" }}
//             viewport={{ once: true }}
//           >
//             <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">
//               <Sparkles className="h-4 w-4 text-blue-600" />
//               Security & Trust
//             </div>

//             <h2 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
//               Security that feels invisible. <span className="text-blue-600">Trust you can prove.</span>
//             </h2>

//             <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
//               Slotly is engineered to protect sensitive scheduling data while keeping booking simple for attendees.
//               Secure defaults, clear controls, and privacy-first sharing.
//             </p>
//           </motion.div>

//           {/* Right: Metric capsule */}
//           <motion.div
//             initial={{ opacity: 0, y: 14 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.55, delay: 0.06, ease: "easeOut" }}
//             viewport={{ once: true }}
//             className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.25)]"
//           >
//             <div className="text-sm font-semibold text-gray-900">Trust at a glance</div>
//             <div className="mt-4 grid grid-cols-2 gap-3">
//               {metrics.map((m) => (
//                 <div
//                   key={m.label}
//                   className="rounded-2xl border border-gray-200 bg-white px-4 py-3"
//                 >
//                   <div className="text-xs text-gray-500">{m.label}</div>
//                   <div className="mt-1 text-sm font-semibold text-gray-900">{m.value}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-5 text-xs text-gray-500 leading-relaxed">
//               Availability is shared without revealing personal event titles, notes, or private calendar details.
//             </div>
//           </motion.div>
//         </div>

//         {/* Premium trust panel */}
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           viewport={{ once: true }}
//           className="mt-10 rounded-[28px] overflow-hidden border border-gray-200 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.25)]"
//         >
//           <div className="relative bg-[#0b0c0f]">
//             {/* subtle glow */}
//             <div aria-hidden className="absolute inset-0">
//               <div className="absolute -top-24 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/18 via-indigo-500/10 to-purple-500/8 blur-[140px]" />
//               <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_10%,rgba(255,255,255,0.08),transparent_55%)]" />
//             </div>

//             <div className="relative px-6 py-10 sm:px-10">
//               <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
//                 <div>
//                   <div className="text-white/70 text-sm">Built for modern teams</div>
//                   <div className="mt-1 text-white text-2xl sm:text-3xl font-semibold tracking-tight">
//                     Privacy-first scheduling for serious work.
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-2">
//                   <PillDark icon={Lock} text="Encryption" />
//                   <PillDark icon={ShieldCheck} text="Secure auth" />
//                   <PillDark icon={BadgeCheck} text="GDPR-ready" />
//                 </div>
//               </div>

//               <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {pillars.map((p, i) => (
//                   <motion.div
//                     key={p.title}
//                     initial={{ opacity: 0, y: 14 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.55, delay: i * 0.06 }}
//                     viewport={{ once: true }}
//                     className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5"
//                   >
//                     <div className="flex items-start gap-3">
//                       <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
//                         <p.icon className="h-5 w-5" />
//                       </div>
//                       <div className="min-w-0">
//                         <div className="text-white font-semibold">{p.title}</div>
//                         <div className="mt-1 text-white/70 text-sm leading-relaxed">
//                           {p.desc}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                 <div className="text-white/80 text-sm">
//                   Attendees see your availability — not your private calendar.
//                 </div>
//                 <div className="text-white text-sm font-semibold">
//                   Built to earn trust from day one.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// export function FAQSection() {
//   const faqs = useMemo(
//     () => [
//       {
//         q: "Is Slotly free?",
//         a: "Yes. Slotly includes a free plan to get started quickly. Upgrade when you need advanced automation, team workflows, or higher usage limits.",
//       },
//       {
//         q: "Does Slotly support teams?",
//         a: "Yes. Create shared booking pages, manage multiple event types, and coordinate scheduling across teammates for smoother distribution and visibility.",
//       },
//       {
//         q: "How does Slotly handle time zones?",
//         a: "Slotly automatically detects an attendee’s time zone and shows available slots in their local time, while keeping your calendar consistent and accurate.",
//       },
//       {
//         q: "Does Slotly sync with my calendar?",
//         a: "Yes. Slotly supports real-time calendar sync to prevent double bookings and keep availability updated as your calendar changes.",
//       },
//       {
//         q: "What do attendees see when they book?",
//         a: "They only see the available times and booking details you choose to share. Slotly does not expose private event titles, notes, or sensitive calendar information.",
//       },
//     ],
//     []
//   );

//   const [open, setOpen] = useState<number | null>(0);

//   return (
//     <section className="relative w-full overflow-hidden bg-white">
//       {/* soft background */}
//       <div aria-hidden className="absolute inset-0 -z-10">
//         <div className="absolute -top-24 right-[-160px] h-[520px] w-[520px] rounded-full bg-indigo-100/60 blur-[130px]" />
//         <div className="absolute -bottom-28 left-[-170px] h-[520px] w-[520px] rounded-full bg-blue-100/60 blur-[130px]" />
//       </div>

//       <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
//         <motion.div
//           initial={{ opacity: 0, y: 14 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.55, ease: "easeOut" }}
//           viewport={{ once: true }}
//           className="max-w-3xl"
//         >
//           <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">
//             <Sparkles className="h-4 w-4 text-blue-600" />
//             FAQ
//           </div>
//           <h2 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
//             Clear answers. Faster decisions.
//           </h2>
//           <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
//             Everything you need to know about Slotly before you start scheduling.
//           </p>
//         </motion.div>

//         <div className="mt-10 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 items-start">
//           {/* Left rail (attractive, not boring) */}
//           <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.22)]">
//             <div className="text-base font-semibold text-gray-900">
//               Quick facts
//             </div>

//             <div className="mt-4 space-y-3">
//               <RailItem icon={CalendarDays} title="Fast booking" desc="One link. Instant availability." />
//               <RailItem icon={Globe2} title="Time zones" desc="Auto-localized for every attendee." />
//               <RailItem icon={Users} title="Teams" desc="Shared pages and multi-host workflows." />
//               <RailItem icon={RefreshCw} title="Calendar sync" desc="Two-way updates to avoid conflicts." />
//               <RailItem icon={Clock} title="Automation" desc="Reminders & follow-ups on autopilot." />
//             </div>

//             <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
//               Still have questions? Mail us at{" "}
//               <span className="font-semibold text-gray-900">support@slotly.io</span>
//             </div>
//           </div>

//           {/* Accordion */}
//           <div className="space-y-3">
//             {faqs.map((item, idx) => {
//               const isOpen = open === idx;
//               return (
//                 <motion.div
//                   key={item.q}
//                   initial={{ opacity: 0, y: 10 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.45, delay: idx * 0.03 }}
//                   viewport={{ once: true }}
//                   className={[
//                     "rounded-3xl border border-gray-200 bg-white/85 backdrop-blur",
//                     "shadow-[0_24px_70px_-55px_rgba(15,23,42,0.18)] overflow-hidden",
//                   ].join(" ")}
//                 >
//                   <button
//                     type="button"
//                     onClick={() => setOpen(isOpen ? null : idx)}
//                     className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
//                     aria-expanded={isOpen}
//                   >
//                     <span className="text-base font-semibold text-gray-900">
//                       {item.q}
//                     </span>
//                     <div className="flex items-center gap-2">
//                       <span className="hidden sm:inline text-sm text-gray-500">
//                         {isOpen ? "Hide" : "View"}
//                       </span>
//                       <ChevronDown
//                         className={[
//                           "h-5 w-5 text-gray-500 transition-transform duration-300",
//                           isOpen ? "rotate-180" : "rotate-0",
//                         ].join(" ")}
//                       />
//                     </div>
//                   </button>

//                   <div
//                     className={[
//                       "grid transition-[grid-template-rows] duration-300 ease-out",
//                       isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
//                     ].join(" ")}
//                   >
//                     <div className="overflow-hidden">
//                       <div className="px-6 pb-6 text-sm leading-relaxed text-gray-600">
//                         {item.a}
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- helpers ---------------- */

// function PillDark({ icon: Icon, text }: { icon: any; text: string }) {
//   return (
//     <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80">
//       <Icon className="h-4 w-4 text-white/80" />
//       {text}
//     </span>
//   );
// }

// function RailItem({
//   icon: Icon,
//   title,
//   desc,
// }: {
//   icon: any;
//   title: string;
//   desc: string;
// }) {
//   return (
//     <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
//       <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
//         <Icon className="h-5 w-5" />
//       </div>
//       <div className="min-w-0">
//         <div className="text-sm font-semibold text-gray-900">{title}</div>
//         <div className="text-sm text-gray-600 leading-relaxed">{desc}</div>
//       </div>
//     </div>
//   );
// }










"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  BadgeCheck,
  Fingerprint,
  ChevronDown,
  Sparkles,
  Globe2,
  Users,
  CalendarDays,
  Clock,
  RefreshCw,
} from "lucide-react";

/* =========================================================
   RECREATE (like your screenshot) + FIXES:
   ✅ Icons: consistent sizing, no stretching, no layout jump
   ✅ Mobile: stacks correctly (no overflow, no squish)
   ✅ Same visual structure: headline + right metric card + dark panel
   ✅ Single file exports: SecurityTrustSection, FAQSection
   ========================================================= */

export function SecurityTrustSection() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Secure OAuth",
      desc: "Industry-standard OAuth with scoped permissions to keep access controlled.",
    },
    {
      icon: Lock,
      title: "Data encrypted",
      desc: "Encryption in transit and at rest to protect scheduling data end-to-end.",
    },
    {
      icon: BadgeCheck,
      title: "GDPR-ready",
      desc: "Privacy controls and data handling designed to support GDPR workflows.",
    },
    {
      icon: Fingerprint,
      title: "Privacy-first",
      desc: "Share availability without exposing private calendar details to attendees.",
    },
  ];

  const metrics = [
    { label: "OAuth-based access", value: "Scoped" },
    { label: "Data protection", value: "Encrypted" },
    { label: "Privacy posture", value: "Minimal sharing" },
    { label: "Compliance readiness", value: "GDPR" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Premium background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-44 left-1/2 h-[680px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-100/70 via-indigo-50/50 to-white blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        {/* Headline row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Security &amp; Trust
            </div>

            <h2 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              Security that feels invisible.{" "}
              <span className="text-blue-600">Trust you can prove.</span>
            </h2>

            <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
              Slotly is engineered to protect sensitive scheduling data while keeping
              booking simple for attendees. Secure defaults, clear controls, and
              privacy-first sharing.
            </p>
          </motion.div>

          {/* Right: Metric capsule */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: "easeOut" }}
            viewport={{ once: true }}
            className="rounded-3xl border border-gray-200 bg-white/85 backdrop-blur p-5 sm:p-6 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.25)]"
          >
            <div className="text-sm font-semibold text-gray-900">Trust at a glance</div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3"
                >
                  <div className="text-xs text-gray-500">{m.label}</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-xs text-gray-500 leading-relaxed">
              Availability is shared without revealing personal event titles, notes, or private
              calendar details.
            </div>
          </motion.div>
        </div>

        {/* Dark premium trust panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-10 rounded-[28px] overflow-hidden border border-gray-200 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.25)]"
        >
          <div className="relative bg-[#0b0c0f]">
            {/* subtle glow */}
            <div aria-hidden className="absolute inset-0">
              <div className="absolute -top-24 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/18 via-indigo-500/10 to-purple-500/8 blur-[140px]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_10%,rgba(255,255,255,0.08),transparent_55%)]" />
            </div>

            <div className="relative px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                  <div className="text-white/70 text-sm">Built for modern teams</div>
                  <div className="mt-1 text-white text-2xl sm:text-3xl font-semibold tracking-tight">
                    Privacy-first scheduling for serious work.
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <PillDark icon={Lock} text="Encryption" />
                  <PillDark icon={ShieldCheck} text="Secure auth" />
                  <PillDark icon={BadgeCheck} text="GDPR-ready" />
                </div>
              </div>

              {/* Cards: responsive grid */}
              <div className="mt-7 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {pillars.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5"
                  >
                    <div className="flex items-start gap-3">
                      {/* ✅ Icon fix: fixed box, no shrink, consistent */}
                      <div className="shrink-0">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                          <p.icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="text-white font-semibold">{p.title}</div>
                        <div className="mt-1 text-white/70 text-sm leading-relaxed">
                          {p.desc}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom assurance bar: stacks on mobile */}
              <div className="mt-7 sm:mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-white/80 text-sm">
                  Attendees see your availability — not your private calendar.
                </div>
                <div className="text-white text-sm font-semibold">
                  Built to earn trust from day one.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const faqs = useMemo(
    () => [
      {
        q: "Is Slotly free?",
        a: "Yes. Slotly includes a free plan to get started quickly. Upgrade when you need advanced automation, team workflows, or higher usage limits.",
      },
      {
        q: "Does Slotly support teams?",
        a: "Yes. Create shared booking pages, manage multiple event types, and coordinate scheduling across teammates for smoother distribution and visibility.",
      },
      {
        q: "How does Slotly handle time zones?",
        a: "Slotly automatically detects an attendee’s time zone and shows available slots in their local time, while keeping your calendar consistent and accurate.",
      },
      {
        q: "Does Slotly sync with my calendar?",
        a: "Yes. Slotly supports real-time calendar sync to prevent double bookings and keep availability updated as your calendar changes.",
      },
      {
        q: "What do attendees see when they book?",
        a: "They only see the available times and booking details you choose to share. Slotly does not expose private event titles, notes, or sensitive calendar information.",
      },
    ],
    []
  );

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* soft background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-24 right-[-160px] h-[520px] w-[520px] rounded-full bg-indigo-100/60 blur-[130px]" />
        <div className="absolute -bottom-28 left-[-170px] h-[520px] w-[520px] rounded-full bg-blue-100/60 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">
            <Sparkles className="h-4 w-4 text-blue-600" />
            FAQ
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
            Clear answers. Faster decisions.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
            Everything you need to know about Slotly before you start scheduling.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-10 items-start">
          {/* Left rail */}
          <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur p-5 sm:p-6 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.22)]">
            <div className="text-base font-semibold text-gray-900">Quick facts</div>

            <div className="mt-4 space-y-3">
              <RailItem icon={CalendarDays} title="Fast booking" desc="One link. Instant availability." />
              <RailItem icon={Globe2} title="Time zones" desc="Auto-localized for every attendee." />
              <RailItem icon={Users} title="Teams" desc="Shared pages and multi-host workflows." />
              <RailItem icon={RefreshCw} title="Calendar sync" desc="Two-way updates to avoid conflicts." />
              <RailItem icon={Clock} title="Automation" desc="Reminders & follow-ups on autopilot." />
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
              Still have questions? Mail us at{" "}
              <span className="font-semibold text-gray-900">support@slotly.io</span>
            </div>
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = open === idx;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.03 }}
                  viewport={{ once: true }}
                  className={[
                    "rounded-3xl border border-gray-200 bg-white/85 backdrop-blur",
                    "shadow-[0_24px_70px_-55px_rgba(15,23,42,0.18)] overflow-hidden",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  > 
                    <span className="text-base font-semibold text-gray-900">
                      {item.q}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline text-sm text-gray-500">
                        {isOpen ? "Hide" : "View"}
                      </span>
                      <ChevronDown
                        className={[
                          "h-5 w-5 text-gray-500 transition-transform duration-300",
                          isOpen ? "rotate-180" : "rotate-0",
                        ].join(" ")}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  <div
                    className={[
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 text-sm leading-relaxed text-gray-600">
                        {item.a}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- helpers ---------------- */

function PillDark({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80">
      {/* ✅ Icon fix: no shrink */}
      <Icon className="h-4 w-4 text-white/80 shrink-0" aria-hidden="true" />
      {text}
    </span>
  );
}

function RailItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
      {/* ✅ Icon fix: fixed box + shrink-0 */}
      <div className="shrink-0">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
          <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}
