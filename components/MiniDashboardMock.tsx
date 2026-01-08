// "use client";

// import React from "react";
// import {
//   CalendarDays,
//   Users,
//   Bell,
//   Settings,
//   LayoutGrid,
//   Search,
//   Plus,
//   Pencil,
//   Trash2,
//   ExternalLink,
//   Link as LinkIcon,
//   Clock as ClockIcon,
//   ChevronLeft,
//   ChevronRight,
//   Sparkles,
//   Globe2,
//   Zap,
//   ArrowRight,
// } from "lucide-react";

// /* =========================================================
//    SINGLE-FILE: Dashboard + 4 Far Callouts + Animated Connectors
//    UPDATE (per your ask):
//    - Cards are MUCH FARTHER from the dashboard
//    - Still connected with lines (clean geometry)
//    - Subtle connector animation (flow + glow pulse)
//    ========================================================= */

// export default function DashboardMockupSection() {
//   // Layout constants (kept in code so you can tweak quickly)
//   const W = 1360;
//   const H = 860;

//   // Center frame (smaller than before -> more empty space around it)
//   const FRAME_W = 660;
//   const FRAME_H = 440;

//   // Derived anchor positions in the SVG coordinate system
//   const CX = W / 2; // 680
//   const CY = H / 2; // 430

//   const frameLeft = CX - FRAME_W / 2; // 350
//   const frameRight = CX + FRAME_W / 2; // 1010
//   const frameTop = CY - FRAME_H / 2; // 210
//   const frameBottom = CY + FRAME_H / 2; // 650

//   // Callout card geometry (we keep cards fixed-height so connectors can hit their midpoints perfectly)
//   const CARD_W = 320;
//   const CARD_H = 170;
//   const EDGE_PAD = 18;
//   const TOP_CARD_TOP = 150;
//   const BOTTOM_CARD_TOP = H - 150 - CARD_H; // 540

//   // Card X positions
//   const LEFT_CARD_X = EDGE_PAD; // 18
//   const RIGHT_CARD_X = W - EDGE_PAD - CARD_W; // 1022

//   // Connector target points (attach to the inner edge middle of each card)
//   const leftCardInnerX = LEFT_CARD_X + CARD_W; // right edge of left card
//   const rightCardInnerX = RIGHT_CARD_X; // left edge of right card
//   const topCardMidY = TOP_CARD_TOP + CARD_H / 2; // 235
//   const bottomCardMidY = BOTTOM_CARD_TOP + CARD_H / 2; // 625

//   // Connector start points (attach to frame edges)
//   const startLeftX = frameLeft + 28; // slightly inside the frame edge
//   const startRightX = frameRight - 28;
//   const startTopY = frameTop + 115; // top connector attach point on frame
//   const startBottomY = frameBottom - 115; // bottom connector attach point on frame

//   return (
//     <section className="relative w-full py-20 bg-[#0b0c0f] overflow-hidden">
//       {/* Ambient background */}
//       <div aria-hidden className="pointer-events-none absolute inset-0">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(255,255,255,0.06),transparent_60%)]" />
//         <div className="absolute -top-40 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/12 to-purple-500/10 blur-[170px]" />
//         <div className="absolute -bottom-56 right-[-180px] h-[560px] w-[560px] rounded-full bg-indigo-500/10 blur-[180px]" />
//       </div>

//       <div className="relative mx-auto max-w-[1600px] px-6">
//         {/* Title */}
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-semibold text-white">
//             A Dashboard That Explains Itself
//           </h2>
//           <p className="mt-2 text-white/60">
//             Four workflow advantages — mapped around the product experience.
//           </p>
//         </div>

//         {/* Structure wrapper (bigger canvas => cards can be far + still visible) */}
//         <div className="relative mx-auto w-full max-w-[1360px]" style={{ height: H }}>
//           {/* Animated connectors (SVG in absolute layer) */}
//           <svg
//             className="pointer-events-none absolute inset-0 h-full w-full"
//             viewBox={`0 0 ${W} ${H}`}
//             preserveAspectRatio="none"
//             aria-hidden="true"
//           >
//             <defs>
//               <linearGradient id="connGrad" x1="0" y1="0" x2="1" y2="0">
//                 <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
//                 <stop offset="40%" stopColor="rgba(255,255,255,0.26)" />
//                 <stop offset="65%" stopColor="rgba(59,130,246,0.32)" />
//                 <stop offset="100%" stopColor="rgba(255,255,255,0.14)" />
//               </linearGradient>

//               <filter id="connGlow" x="-50%" y="-50%" width="200%" height="200%">
//                 <feGaussianBlur stdDeviation="3.8" result="blur" />
//                 <feColorMatrix
//                   in="blur"
//                   type="matrix"
//                   values="
//                     1 0 0 0 0
//                     0 1 0 0 0
//                     0 0 1 0 0
//                     0 0 0 0.65 0
//                   "
//                   result="glow"
//                 />
//                 <feMerge>
//                   <feMergeNode in="glow" />
//                   <feMergeNode in="SourceGraphic" />
//                 </feMerge>
//               </filter>
//             </defs>

//             {/* TOP LEFT: frame -> long horizontal -> up/down -> card */}
//             <ConnectorPath
//               d={[
//                 `M ${startLeftX} ${startTopY}`,
//                 `L ${leftCardInnerX} ${startTopY}`,
//                 `L ${leftCardInnerX} ${topCardMidY}`,
//               ].join(" ")}
//             />

//             {/* TOP RIGHT */}
//             <ConnectorPath
//               d={[
//                 `M ${startRightX} ${startTopY}`,
//                 `L ${rightCardInnerX} ${startTopY}`,
//                 `L ${rightCardInnerX} ${topCardMidY}`,
//               ].join(" ")}
//             />

//             {/* BOTTOM LEFT */}
//             <ConnectorPath
//               d={[
//                 `M ${startLeftX} ${startBottomY}`,
//                 `L ${leftCardInnerX} ${startBottomY}`,
//                 `L ${leftCardInnerX} ${bottomCardMidY}`,
//               ].join(" ")}
//             />

//             {/* BOTTOM RIGHT */}
//             <ConnectorPath
//               d={[
//                 `M ${startRightX} ${startBottomY}`,
//                 `L ${rightCardInnerX} ${startBottomY}`,
//                 `L ${rightCardInnerX} ${bottomCardMidY}`,
//               ].join(" ")}
//             />
//           </svg>

//           {/* Callout cards (pushed to edges + fixed size so connectors hit perfectly) */}
//           <CalloutCard
//             style={{ left: LEFT_CARD_X, top: TOP_CARD_TOP, width: CARD_W, height: CARD_H }}
//             label="Point 1"
//             title="Instant Clarity"
//             desc="See your agenda, participants, and quick actions instantly — zero friction."
//             Icon={Sparkles}
//           />

//           <CalloutCard
//             style={{ left: RIGHT_CARD_X, top: TOP_CARD_TOP, width: CARD_W, height: CARD_H }}
//             label="Point 2"
//             title="Timezone Perfect"
//             desc="Slotly auto-localizes time for every attendee. No conversions, no confusion."
//             Icon={Globe2}
//           />

//           <CalloutCard
//             style={{ left: LEFT_CARD_X, top: BOTTOM_CARD_TOP, width: CARD_W, height: CARD_H }}
//             label="Point 3"
//             title="Automations Built-in"
//             desc="Reminders, follow-ups, routing — handled automatically so your workflow stays clean."
//             Icon={Zap}
//           />

//           <CalloutCard
//             style={{ left: RIGHT_CARD_X, top: BOTTOM_CARD_TOP, width: CARD_W, height: CARD_H }}
//             label="Point 4"
//             title="Team Ready"
//             desc="Event types, team links, and scalable scheduling that works for solo or teams."
//             Icon={Users}
//           />

//           {/* Center frame */}
//           <div
//             className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
//             style={{ width: FRAME_W, height: FRAME_H }}
//           >
//             {/* outer frame */}
//             <div className="absolute inset-0 rounded-[42px] border-2 border-white/80 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.9)]" />
//             {/* inner frame */}
//             <div className="absolute inset-[18px] rounded-[32px] border-2 border-white/75" />

//             {/* content window */}
//             <div className="absolute inset-[34px] rounded-[26px] overflow-hidden bg-black/20 flex items-center justify-center">
//               {/* Dashboard mockup (scaled) */}
//               <div className="origin-center scale-[0.50]">
//                 {DashboardMockup()}
//               </div>
//               <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
//             </div>
//           </div>
//         </div>

//         {/* CTA */}
//         {/* <div className="mt-12 text-center">
//           <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-white/90 hover:bg-white/10 transition">
//             Explore More <ArrowRight className="h-4 w-4" />
//           </button>
//         </div> */}
//       </div>

//       {/* Connector animations */}
//       <style jsx>{`
//         .connGlow {
//           opacity: 0.3;
//           animation: connPulse 2.9s ease-in-out infinite;
//         }
//         .connDash {
//           stroke-dasharray: 10 14;
//           animation: connDash 2.8s linear infinite, connPulse 2.9s ease-in-out infinite;
//           opacity: 0.95;
//         }
//         @keyframes connDash {
//           0% {
//             stroke-dashoffset: 0;
//           }
//           100% {
//             stroke-dashoffset: -140;
//           }
//         }
//         @keyframes connPulse {
//           0%,
//           100% {
//             opacity: 0.3;
//           }
//           50% {
//             opacity: 0.72;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }

// /* ---------------- Connector Path (glow + moving dash) ---------------- */
// function ConnectorPath({ d }: { d: string }) {
//   return (
//     <>
//       {/* glow base */}
//       <path
//         d={d}
//         fill="none"
//         stroke="url(#connGrad)"
//         strokeWidth="9"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         filter="url(#connGlow)"
//         className="connGlow"
//       />
//       {/* crisp base */}
//       <path
//         d={d}
//         fill="none"
//         stroke="rgba(255,255,255,0.18)"
//         strokeWidth="3"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       {/* moving dash highlight */}
//       <path
//         d={d}
//         fill="none"
//         stroke="rgba(255,255,255,0.55)"
//         strokeWidth="3"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className="connDash"
//       />
//     </>
//   );
// }

// /* ---------------- Callout Card ---------------- */
// function CalloutCard({
//   style,
//   label,
//   title,
//   desc,
//   Icon,
// }: {
//   style: React.CSSProperties;
//   label: string;
//   title: string;
//   desc: string;
//   Icon: any;
// }) {
//   return (
//     <div
//       className="absolute rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4 shadow-[0_20px_90px_-60px_rgba(0,0,0,0.9)]"
//       style={style}
//     >
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <p className="text-[12px] text-white/45">{label}</p>
//           <h4 className="mt-1 text-[15px] font-semibold text-white">{title}</h4>
//         </div>

//         <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
//           <Icon className="h-5 w-5 text-white/85" />
//         </div>
//       </div>

//       <p className="mt-3 text-[12.5px] leading-relaxed text-white/60">{desc}</p>
//     </div>
//   );
// }

// /* ---------------- Dashboard Mockup (same file) ---------------- */
// function DashboardMockup() {
//   return (
//     <div className="relative w-[1024px] h-[650px] rounded-[28px] border border-gray-200 bg-white shadow-lg overflow-hidden">
//       <div className="grid grid-cols-[250px_1fr] h-full">
//         {/* SIDEBAR */}
//         <aside className="border-r border-gray-200 px-5 py-5 flex flex-col bg-white">
//           <div className="flex items-center gap-3 pb-5">
//             <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
//               <LayoutGrid className="h-5 w-5" />
//             </div>
//             <div>
//               <div className="text-sm font-semibold">Slotly</div>
//               <div className="text-[11px] text-gray-500">Dashboard</div>
//             </div>
//           </div>

//           <SidebarItem active icon={CalendarDays} label="Calendar" />
//           <SidebarItem icon={Plus} label="Event Types" />
//           <SidebarItem icon={Users} label="Contacts" />
//           <SidebarItem muted icon={Bell} label="Notifications" />
//           <SidebarItem muted icon={Settings} label="Settings" />

//           <div className="mt-auto pt-6">
//             <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-3 py-3">
//               <div className="h-9 w-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">
//                 N
//               </div>
//               <div>
//                 <div className="text-sm font-semibold">Workspace</div>
//                 <div className="text-[11px] text-gray-500">slotly.io</div>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* MAIN */}
//         <div className="flex flex-col">
//           <header className="border-b border-gray-200 px-6 py-4 flex justify-between bg-white">
//             <div>
//               <div className="text-lg font-semibold">Your Schedule</div>
//               <div className="text-sm text-gray-500">Manage your meetings</div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="relative w-[260px]">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <input
//                   className="w-full border rounded-full px-10 py-2 text-sm"
//                   placeholder="Search events..."
//                   readOnly
//                 />
//               </div>

//               <div className="flex items-center gap-3 border rounded-full px-3 py-2">
//                 <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
//                   T
//                 </div>
//                 <div>
//                   <div className="text-sm font-semibold">Tushar</div>
//                   <div className="text-[11px] text-gray-500">
//                     ctushardev@gmail.com
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </header>

//           <div className="flex-1 grid grid-cols-[1fr_320px] gap-6 px-6 py-5">
//             {/* LEFT */}
//             <div className="space-y-6">
//               <CardShell>
//                 <div className="flex justify-between">
//                   <div>
//                     <div className="text-lg font-semibold">Today</div>
//                     <div className="text-sm text-gray-500">Dec 26, 2025</div>
//                   </div>
//                   <div className="text-sm text-gray-500">1 Events</div>
//                 </div>

//                 <div className="mt-4 border rounded-2xl p-4">
//                   <div className="grid grid-cols-[120px_1fr_160px] items-center gap-4">
//                     <div>
//                       <div className="font-semibold">14:00</div>
//                       <div className="text-sm text-gray-500">to 14:30</div>
//                     </div>

//                     <div>
//                       <div className="font-semibold">Swipe Demo</div>
//                       <div className="text-sm text-gray-500">
//                         ctushardev@gmail.com
//                       </div>

//                       <div className="flex gap-2 mt-3">
//                         <Pill primary>
//                           Join Meet <ExternalLink className="h-4 w-4" />
//                         </Pill>
//                         <Pill>
//                           Open Calendar <ExternalLink className="h-4 w-4" />
//                         </Pill>
//                       </div>
//                     </div>

//                     <div className="flex gap-2 justify-end">
//                       <SmallBtn>
//                         <Pencil className="h-4 w-4" /> Edit
//                       </SmallBtn>
//                       <SmallBtn danger>
//                         <Trash2 className="h-4 w-4" /> Delete
//                       </SmallBtn>
//                     </div>
//                   </div>
//                 </div>
//               </CardShell>

//               <CardShell>
//                 <div className="flex justify-between">
//                   <div>
//                     <div className="text-lg font-semibold">Calendar Overview</div>
//                     <div className="text-sm text-gray-500">Pick dates easily</div>
//                   </div>

//                   <button className="border rounded-full px-4 py-2 text-sm">
//                     Today
//                   </button>
//                 </div>

//                 <div className="mt-4">
//                   <div className="flex justify-between items-center">
//                     <div className="font-semibold">December 2025</div>

//                     <div className="flex gap-2">
//                       <IconBtn>
//                         <ChevronLeft className="h-4 w-4" />
//                       </IconBtn>
//                       <IconBtn>
//                         <ChevronRight className="h-4 w-4" />
//                       </IconBtn>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-7 gap-2 mt-4">
//                     {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
//                       (d) => (
//                         <div
//                           key={d}
//                           className="text-xs text-gray-500 text-center"
//                         >
//                           {d}
//                         </div>
//                       )
//                     )}

//                     {[
//                       { day: 30, muted: true },
//                       { day: 1 },
//                       { day: 2 },
//                       { day: 3 },
//                       { day: 4 },
//                       { day: 5 },
//                       { day: 6 },
//                       { day: 7 },
//                       { day: 8 },
//                       { day: 9, active: true },
//                       { day: 10 },
//                       { day: 11 },
//                       { day: 12 },
//                       { day: 13 },
//                     ].map((c, i) => (
//                       <div
//                         key={i}
//                         className={[
//                           "h-10 rounded-2xl flex items-center justify-center text-sm border",
//                           c.muted ? "bg-gray-50 text-gray-400" : "bg-white",
//                           c.active
//                             ? "bg-blue-50 text-blue-600 border-blue-400"
//                             : "border-gray-200",
//                         ].join(" ")}
//                       >
//                         {c.day}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardShell>
//             </div>

//             {/* RIGHT */}
//             <CardShell>
//               <div className="flex justify-between">
//                 <div>
//                   <div className="text-lg font-semibold">Event Types</div>
//                   <div className="text-sm text-gray-500">Quick access</div>
//                 </div>

//                 <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl text-xs">
//                   Create <br /> Event Type
//                 </button>
//               </div>

//               <div className="space-y-4 mt-4">
//                 {[
//                   {
//                     title: "Intro Meeting",
//                     meta: "30 minutes • Google Meet",
//                     url: "https://slotly.io/publicbook/intro-meeting",
//                   },
//                   {
//                     title: "Product Demo",
//                     meta: "45 minutes • Google Meet",
//                     url: "https://slotly.io/publicbook/product-demo",
//                   },
//                   {
//                     title: "Support Call",
//                     meta: "30 minutes • Live",
//                     url: "https://slotly.io/publicbook/support-call",
//                   },
//                 ].map((e) => (
//                   <div key={e.title} className="border rounded-2xl p-4">
//                     <div className="flex justify-between">
//                       <div className="flex gap-3">
//                         <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
//                           <ClockIcon className="h-5 w-5" />
//                         </div>

//                         <div>
//                           <div className="font-semibold">{e.title}</div>
//                           <div className="text-sm text-gray-500">{e.meta}</div>
//                         </div>
//                       </div>

//                       <button className="text-blue-600 text-sm font-semibold">
//                         Edit
//                       </button>
//                     </div>

//                     <div className="flex justify-between items-center bg-gray-50 border rounded-xl px-3 py-2 mt-3">
//                       <div className="text-sm flex items-center gap-2 text-gray-600 min-w-0">
//                         <LinkIcon className="h-4 w-4 text-gray-400" />
//                         <span className="truncate">{e.url}</span>
//                       </div>
//                       <ExternalLink className="h-4 w-4 text-gray-500" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardShell>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- Small UI bits ---------------- */
// function SidebarItem({
//   icon: Icon,
//   label,
//   active,
//   muted,
// }: {
//   icon: any;
//   label: string;
//   active?: boolean;
//   muted?: boolean;
// }) {
//   return (
//     <div
//       className={[
//         "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-default",
//         active ? "bg-blue-50 text-blue-700" : "",
//         muted ? "text-gray-400" : "text-gray-700 hover:bg-gray-50",
//       ].join(" ")}
//     >
//       <Icon className="h-5 w-5" />
//       {label}
//     </div>
//   );
// }

// function CardShell({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="border border-gray-200 rounded-3xl p-5 bg-white shadow-sm">
//       {children}
//     </div>
//   );
// }

// function Pill({
//   children,
//   primary,
// }: {
//   children: React.ReactNode;
//   primary?: boolean;
// }) {
//   return (
//     <button
//       className={[
//         "rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2",
//         primary
//           ? "bg-blue-600 text-white"
//           : "border border-gray-300 bg-white text-blue-600",
//       ].join(" ")}
//       type="button"
//     >
//       {children}
//     </button>
//   );
// }

// function SmallBtn({
//   children,
//   danger,
// }: {
//   children: React.ReactNode;
//   danger?: boolean;
// }) {
//   return (
//     <button
//       className={[
//         "rounded-full px-4 py-2 text-sm border inline-flex items-center gap-2",
//         danger
//           ? "border-red-300 text-red-600 bg-white"
//           : "border-gray-300 text-gray-700 bg-white",
//       ].join(" ")}
//       type="button"
//     >
//       {children}
//     </button>
//   );
// }

// function IconBtn({ children }: { children: React.ReactNode }) {
//   return (
//     <button
//       className="h-9 w-9 border border-gray-300 rounded-full flex items-center justify-center"
//       type="button"
//     >
//       {children}
//     </button>
//   );
// }











"use client";

import React from "react";
import {
  CalendarDays,
  Users,
  Bell,
  Settings,
  LayoutGrid,
  Search,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  Clock as ClockIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe2,
  Zap,
} from "lucide-react";

/* =========================================================
   DESKTOP-ONLY VERSION
   - Hidden on mobile/tablet
   - Shows from lg (>=1024px) and above
   - Same design + connectors + far callouts
   ========================================================= */

export default function DashboardMockupSection() {
  const W = 1360;
  const H = 860;

  const FRAME_W = 660;
  const FRAME_H = 440;

  const CX = W / 2;
  const CY = H / 2;

  const frameLeft = CX - FRAME_W / 2;
  const frameRight = CX + FRAME_W / 2;
  const frameTop = CY - FRAME_H / 2;
  const frameBottom = CY + FRAME_H / 2;

  const CARD_W = 320;
  const CARD_H = 170;
  const EDGE_PAD = 18;
  const TOP_CARD_TOP = 150;
  const BOTTOM_CARD_TOP = H - 150 - CARD_H;

  const LEFT_CARD_X = EDGE_PAD;
  const RIGHT_CARD_X = W - EDGE_PAD - CARD_W;

  const leftCardInnerX = LEFT_CARD_X + CARD_W;
  const rightCardInnerX = RIGHT_CARD_X;
  const topCardMidY = TOP_CARD_TOP + CARD_H / 2;
  const bottomCardMidY = BOTTOM_CARD_TOP + CARD_H / 2;

  const startLeftX = frameLeft + 28;
  const startRightX = frameRight - 28;
  const startTopY = frameTop + 115;
  const startBottomY = frameBottom - 115;

  return (
    <section className="relative w-full py-20 bg-[#0b0c0f] overflow-hidden hidden lg:block">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/12 to-purple-500/10 blur-[170px]" />
        <div className="absolute -bottom-56 right-[-180px] h-[560px] w-[560px] rounded-full bg-indigo-500/10 blur-[180px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-white">
            A Dashboard That Explains Itself
          </h2>
          <p className="mt-2 text-white/60">
            Four workflow advantages — mapped around the product experience.
          </p>
        </div>

        {/* Structure wrapper */}
        <div className="relative mx-auto w-full max-w-[1360px]" style={{ height: H }}>
          {/* Animated connectors */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="connGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.26)" />
                <stop offset="65%" stopColor="rgba(59,130,246,0.32)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.14)" />
              </linearGradient>

              <filter id="connGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.8" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.65 0
                  "
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <ConnectorPath
              d={[
                `M ${startLeftX} ${startTopY}`,
                `L ${leftCardInnerX} ${startTopY}`,
                `L ${leftCardInnerX} ${topCardMidY}`,
              ].join(" ")}
            />
            <ConnectorPath
              d={[
                `M ${startRightX} ${startTopY}`,
                `L ${rightCardInnerX} ${startTopY}`,
                `L ${rightCardInnerX} ${topCardMidY}`,
              ].join(" ")}
            />
            <ConnectorPath
              d={[
                `M ${startLeftX} ${startBottomY}`,
                `L ${leftCardInnerX} ${startBottomY}`,
                `L ${leftCardInnerX} ${bottomCardMidY}`,
              ].join(" ")}
            />
            <ConnectorPath
              d={[
                `M ${startRightX} ${startBottomY}`,
                `L ${rightCardInnerX} ${startBottomY}`,
                `L ${rightCardInnerX} ${bottomCardMidY}`,
              ].join(" ")}
            />
          </svg>

          {/* Callout cards */}
          <CalloutCard
            style={{ left: LEFT_CARD_X, top: TOP_CARD_TOP, width: CARD_W, height: CARD_H }}
            label="Point 1"
            title="Instant Clarity"
            desc="See your agenda, participants, and quick actions instantly — zero friction."
            Icon={Sparkles}
          />
          <CalloutCard
            style={{ left: RIGHT_CARD_X, top: TOP_CARD_TOP, width: CARD_W, height: CARD_H }}
            label="Point 2"
            title="Timezone Perfect"
            desc="Slotly auto-localizes time for every attendee. No conversions, no confusion."
            Icon={Globe2}
          />
          <CalloutCard
            style={{ left: LEFT_CARD_X, top: BOTTOM_CARD_TOP, width: CARD_W, height: CARD_H }}
            label="Point 3"
            title="Automations Built-in"
            desc="Reminders, follow-ups, routing — handled automatically so your workflow stays clean."
            Icon={Zap}
          />
          <CalloutCard
            style={{ left: RIGHT_CARD_X, top: BOTTOM_CARD_TOP, width: CARD_W, height: CARD_H }}
            label="Point 4"
            title="Team Ready"
            desc="Event types, team links, and scalable scheduling that works for solo or teams."
            Icon={Users}
          />

          {/* Center frame */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: FRAME_W, height: FRAME_H }}
          >
            <div className="absolute inset-0 rounded-[42px] border-2 border-white/80 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.9)]" />
            <div className="absolute inset-[18px] rounded-[32px] border-2 border-white/75" />

            <div className="absolute inset-[34px] rounded-[26px] overflow-hidden bg-black/20 flex items-center justify-center">
              <div className="origin-center scale-[0.50]">{DashboardMockup()}</div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Connector animations */}
      <style jsx>{`
        .connGlow {
          opacity: 0.3;
          animation: connPulse 2.9s ease-in-out infinite;
        }
        .connDash {
          stroke-dasharray: 10 14;
          animation: connDash 2.8s linear infinite, connPulse 2.9s ease-in-out infinite;
          opacity: 0.95;
        }
        @keyframes connDash {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -140;
          }
        }
        @keyframes connPulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.72;
          }
        }
      `}</style>
    </section>
  );
}

/* ---------------- Connector Path ---------------- */
function ConnectorPath({ d }: { d: string }) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="url(#connGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#connGlow)"
        className="connGlow"
      />
      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="connDash"
      />
    </>
  );
}

/* ---------------- Callout Card ---------------- */
function CalloutCard({
  style,
  label,
  title,
  desc,
  Icon,
}: {
  style: React.CSSProperties;
  label: string;
  title: string;
  desc: string;
  Icon: any;
}) {
  return (
    <div
      className="absolute rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4 shadow-[0_20px_90px_-60px_rgba(0,0,0,0.9)]"
      style={style}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] text-white/45">{label}</p>
          <h4 className="mt-1 text-[15px] font-semibold text-white">{title}</h4>
        </div>

        <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-white/85" />
        </div>
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed text-white/60">{desc}</p>
    </div>
  );
}

/* ---------------- Dashboard Mockup (same file) ---------------- */
function DashboardMockup() {
  return (
    <div className="relative w-[1024px] h-[650px] rounded-[28px] border border-gray-200 bg-white shadow-lg overflow-hidden">
      <div className="grid grid-cols-[250px_1fr] h-full">
        {/* SIDEBAR */}
        <aside className="border-r border-gray-200 px-5 py-5 flex flex-col bg-white">
          <div className="flex items-center gap-3 pb-5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Slotly</div>
              <div className="text-[11px] text-gray-500">Dashboard</div>
            </div>
          </div>

          <SidebarItem active icon={CalendarDays} label="Calendar" />
          <SidebarItem icon={Plus} label="Event Types" />
          <SidebarItem icon={Users} label="Contacts" />
          <SidebarItem muted icon={Bell} label="Notifications" />
          <SidebarItem muted icon={Settings} label="Settings" />

          <div className="mt-auto pt-6">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-3 py-3">
              <div className="h-9 w-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">
                N
              </div>
              <div>
                <div className="text-sm font-semibold">Workspace</div>
                <div className="text-[11px] text-gray-500">slotly.io</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex flex-col">
          <header className="border-b border-gray-200 px-6 py-4 flex justify-between bg-white">
            <div>
              <div className="text-lg font-semibold">Your Schedule</div>
              <div className="text-sm text-gray-500">Manage your meetings</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  className="w-full border rounded-full px-10 py-2 text-sm"
                  placeholder="Search events..."
                  readOnly
                />
              </div>

              <div className="flex items-center gap-3 border rounded-full px-3 py-2">
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                  T
                </div>
                <div>
                  <div className="text-sm font-semibold">Tushar</div>
                  <div className="text-[11px] text-gray-500">ctushardev@gmail.com</div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 grid grid-cols-[1fr_320px] gap-6 px-6 py-5">
            {/* LEFT */}
            <div className="space-y-6">
              <CardShell>
                <div className="flex justify-between">
                  <div>
                    <div className="text-lg font-semibold">Today</div>
                    <div className="text-sm text-gray-500">Dec 26, 2025</div>
                  </div>
                  <div className="text-sm text-gray-500">1 Events</div>
                </div>

                <div className="mt-4 border rounded-2xl p-4">
                  <div className="grid grid-cols-[120px_1fr_160px] items-center gap-4">
                    <div>
                      <div className="font-semibold">14:00</div>
                      <div className="text-sm text-gray-500">to 14:30</div>
                    </div>

                    <div>
                      <div className="font-semibold">Swipe Demo</div>
                      <div className="text-sm text-gray-500">ctushardev@gmail.com</div>

                      <div className="flex gap-2 mt-3">
                        <Pill primary>
                          Join Meet <ExternalLink className="h-4 w-4" />
                        </Pill>
                        <Pill>
                          Open Calendar <ExternalLink className="h-4 w-4" />
                        </Pill>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <SmallBtn>
                        <Pencil className="h-4 w-4" /> Edit
                      </SmallBtn>
                      <SmallBtn danger>
                        <Trash2 className="h-4 w-4" /> Delete
                      </SmallBtn>
                    </div>
                  </div>
                </div>
              </CardShell>

              <CardShell>
                <div className="flex justify-between">
                  <div>
                    <div className="text-lg font-semibold">Calendar Overview</div>
                    <div className="text-sm text-gray-500">Pick dates easily</div>
                  </div>

                  <button className="border rounded-full px-4 py-2 text-sm">Today</button>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">December 2025</div>

                    <div className="flex gap-2">
                      <IconBtn>
                        <ChevronLeft className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn>
                        <ChevronRight className="h-4 w-4" />
                      </IconBtn>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mt-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                      <div key={d} className="text-xs text-gray-500 text-center">
                        {d}
                      </div>
                    ))}

                    {[
                      { day: 30, muted: true },
                      { day: 1 },
                      { day: 2 },
                      { day: 3 },
                      { day: 4 },
                      { day: 5 },
                      { day: 6 },
                      { day: 7 },
                      { day: 8 },
                      { day: 9, active: true },
                      { day: 10 },
                      { day: 11 },
                      { day: 12 },
                      { day: 13 },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className={[
                          "h-10 rounded-2xl flex items-center justify-center text-sm border",
                          c.muted ? "bg-gray-50 text-gray-400" : "bg-white",
                          c.active ? "bg-blue-50 text-blue-600 border-blue-400" : "border-gray-200",
                        ].join(" ")}
                      >
                        {c.day}
                      </div>
                    ))}
                  </div>
                </div>
              </CardShell>
            </div>

            {/* RIGHT */}
            <CardShell>
              <div className="flex justify-between">
                <div>
                  <div className="text-lg font-semibold">Event Types</div>
                  <div className="text-sm text-gray-500">Quick access</div>
                </div>

                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl text-xs">
                  Create <br /> Event Type
                </button>
              </div>

              <div className="space-y-4 mt-4">
                {[
                  {
                    title: "Intro Meeting",
                    meta: "30 minutes • Google Meet",
                    url: "https://slotly.io/publicbook/intro-meeting",
                  },
                  {
                    title: "Product Demo",
                    meta: "45 minutes • Google Meet",
                    url: "https://slotly.io/publicbook/product-demo",
                  },
                  {
                    title: "Support Call",
                    meta: "30 minutes • Live",
                    url: "https://slotly.io/publicbook/support-call",
                  },
                ].map((e) => (
                  <div key={e.title} className="border rounded-2xl p-4">
                    <div className="flex justify-between">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                          <ClockIcon className="h-5 w-5" />
                        </div>

                        <div>
                          <div className="font-semibold">{e.title}</div>
                          <div className="text-sm text-gray-500">{e.meta}</div>
                        </div>
                      </div>

                      <button className="text-blue-600 text-sm font-semibold">Edit</button>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 border rounded-xl px-3 py-2 mt-3">
                      <div className="text-sm flex items-center gap-2 text-gray-600 min-w-0">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{e.url}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardShell>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Small UI bits ---------------- */
function SidebarItem({
  icon: Icon,
  label,
  active,
  muted,
}: {
  icon: any;
  label: string;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-default",
        active ? "bg-blue-50 text-blue-700" : "",
        muted ? "text-gray-400" : "text-gray-700 hover:bg-gray-50",
      ].join(" ")}
    >
      <Icon className="h-5 w-5" />
      {label}
    </div>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return <div className="border border-gray-200 rounded-3xl p-5 bg-white shadow-sm">{children}</div>;
}

function Pill({ children, primary }: { children: React.ReactNode; primary?: boolean }) {
  return (
    <button
      className={[
        "rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2",
        primary ? "bg-blue-600 text-white" : "border border-gray-300 bg-white text-blue-600",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

function SmallBtn({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      className={[
        "rounded-full px-4 py-2 text-sm border inline-flex items-center gap-2",
        danger ? "border-red-300 text-red-600 bg-white" : "border-gray-300 text-gray-700 bg-white",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="h-9 w-9 border border-gray-300 rounded-full flex items-center justify-center"
      type="button"
    >
      {children}
    </button>
  );
}
