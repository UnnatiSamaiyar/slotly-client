// // "use client";

// // import { motion } from "framer-motion";
// // import { Facebook, Twitter, Linkedin, Github } from "lucide-react";
// // import Image from "next/image";
// // import Link from "next/link";

// // export function Footer() {
// //   return (
// //     <footer className="relative overflow-hidden bg-gradient-to-b from-white to-[#f5f8ff] border-t border-gray-100">
// //       {/* Ambient soft glow */}
// //       <div className="absolute top-[-100px] left-[20%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[200px] opacity-40 -z-10" />

// //       <div className="container mx-auto px-6 py-20">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-center">
// //           {/* Brand */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             whileInView={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6 }}
// //             viewport={{ once: true }}
// //           >
// //             <div className="flex justify-center md:justify-center">
// //               <Image
// //                 src="/assets/Slotlyio-logo.png"
// //                 alt="Slotly"
// //                 width={160}
// //                 height={45}
// //                 priority
// //                 className="h-10 w-auto"
// //               />
// //             </div>

// //             <p className="mt-3 text-gray-600 text-sm max-w-xs mx-auto md:mx-0">
// //               The intelligent way to manage your meetings, time, and
// //               productivity.
// //             </p>
// //           </motion.div>
// //         </div>

// //         {/* Divider */}
// //         <div className="mt-16 border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
// //           <p>© {new Date().getFullYear()} Slotly. All rights reserved.</p>
// //           <div className="flex gap-6 mt-4 md:mt-0">
// //             <Link
// //               href="/privacy-policy"
// //               className="hover:text-blue-600 transition-colors"
// //             >
// //               Privacy Policy
// //             </Link>
// //             <Link
// //               href="/terms-and-conditions"
// //               className="hover:text-blue-600 transition-colors"
// //             >
// //               Terms of Service
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </footer>
// //   );
// // }


// "use client";

// import { motion } from "framer-motion";
// import { Twitter, Linkedin, Youtube, ArrowRight, ShieldCheck, Lock, Globe } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// export function Footer() {
//   return (
//     <footer className="relative overflow-hidden bg-gradient-to-b from-white to-[#f5f8ff] border-t border-gray-100">
//       {/* Ambient glow */}
//       <div className="absolute top-[-100px] left-[20%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[200px] opacity-40 -z-10" />

//       {/* ── TOP CTA BAND ── */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         viewport={{ once: true }}
//         className="border-b border-gray-200"
//       >
//         <div className="container mx-auto px-6 py-12">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
//             <div className="max-w-xl">
//               <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
//                 The last scheduling tool you'll ever need.
//               </h3>
//               <p className="mt-2 text-sm sm:text-base text-gray-600">
//                 One intelligent link. Real-time availability. Zero back-and-forth —
//                 built for professionals who value their time.
//               </p>
//               <div className="mt-5 flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600">
//                 <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
//                   <ShieldCheck className="h-4 w-4 text-blue-600" />
//                   Enterprise-grade security
//                 </span>
//                 <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
//                   <Lock className="h-4 w-4 text-blue-600" />
//                   Privacy by default
//                 </span>
//                 <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
//                   <Globe className="h-4 w-4 text-blue-600" />
//                   Automatic time zone detection
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-3 shrink-0">
//               <Link
//                 href="/signup"
//                 className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_55px_-30px_rgba(37,99,235,0.8)] hover:bg-blue-700 transition"
//               >
//                 Start for free <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//               <Link
//                 href="/demo"
//                 className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
//               >
//                 Book a demo
//               </Link>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* ── LOGO + SOCIAL ── */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.05 }}
//         viewport={{ once: true }}
//         className="container mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-gray-200"
//       >
//         <Image
//           src="/assets/Slotlyio-logo.png"
//           alt="Slotly"
//           width={160}
//           height={45}
//           priority
//           className="h-10 w-auto"
//         />

//         <div className="flex items-center gap-3">
//           {[
//             { href: "https://twitter.com", Icon: Twitter, label: "Twitter" },
//             { href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn" },
//             { href: "https://youtube.com", Icon: Youtube, label: "YouTube" },
//           ].map(({ href, Icon, label }) => (
//             <a
//               key={label}
//               href={href}
//               aria-label={label}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-200 transition"
//             >
//               <Icon className="h-4 w-4" />
//             </a>
//           ))}
//         </div>
//       </motion.div>

//       {/* ── LEGAL BAR ── */}
//       <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
//         <p className="text-xs text-gray-500">
//           © {new Date().getFullYear()} Slotly, Inc. All rights reserved.
//         </p>
//         <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
//           <Link href="/privacy-policy" className="text-gray-500 hover:text-blue-600 transition">Privacy Policy</Link>
//           <Link href="/terms-and-conditions" className="text-gray-500 hover:text-blue-600 transition">Terms of Service</Link>
//           <Link href="/cookie-policy" className="text-gray-500 hover:text-blue-600 transition">Cookie Policy</Link>
//           <Link href="/gdpr" className="text-gray-500 hover:text-blue-600 transition">GDPR</Link>
//         </div>
//       </div>
//     </footer>
//   );
// }


// "use client";

// import { motion } from "framer-motion";
// import {
//   Twitter,
//   Linkedin,
//   Youtube,
//   ArrowRight,
//   ShieldCheck,
//   Lock,
//   Globe,
//   CalendarCheck2,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// const socialLinks = [
//   { href: "https://twitter.com", Icon: Twitter, label: "Twitter" },
//   { href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn" },
//   { href: "https://youtube.com", Icon: Youtube, label: "YouTube" },
// ];

// const trustPoints = [
//   {
//     Icon: ShieldCheck,
//     text: "Enterprise-grade security",
//   },
//   {
//     Icon: Lock,
//     text: "Privacy by default",
//   },
//   {
//     Icon: Globe,
//     text: "Automatic time zone detection",
//   },
//   {
//     Icon: CalendarCheck2,
//     text: "Built for modern scheduling",
//   },
// ];

// const legalLinks = [
//   { href: "/privacy-policy", label: "Privacy Policy" },
//   { href: "/terms-and-conditions", label: "Terms of Service" },
//   { href: "/cookie-policy", label: "Cookie Policy" },
//   { href: "/gdpr", label: "GDPR" },
// ];

// export function Footer() {
//   return (
//     <footer className="relative overflow-hidden border-t border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_100%)]">
//       {/* ambient background */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute left-1/2 top-[-220px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />
//         <div className="absolute bottom-[-120px] right-[-60px] h-[260px] w-[260px] rounded-full bg-indigo-100/40 blur-3xl" />
//       </div>

//       {/* CTA */}
//       <motion.div
//         initial={{ opacity: 0, y: 18 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.55 }}
//         viewport={{ once: true }}
//         className="relative border-b border-slate-200/80"
//       >
      
//       </motion.div>

//       {/* Main footer */}
//       <motion.div
//         initial={{ opacity: 0, y: 14 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.55, delay: 0.05 }}
//         viewport={{ once: true }}
//         className="relative"
//       >
//         <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
//           {/* left */}
//           <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
//             <Image
//               src="/assets/Slotlyio-logo.webp"
//               alt="Slotly"
//               width={170}
//               height={48}
//               priority
//               className="h-11 w-auto"
//             />

//             <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
//               Slotly helps individuals and teams automate scheduling with a
//               faster, cleaner, and more professional booking experience.
//             </p>

//             <div className="mt-5 flex items-center gap-3">
//               {socialLinks.map(({ href, Icon, label }) => (
//                 <a
//                   key={label}
//                   href={href}
//                   aria-label={label}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:text-blue-600 hover:shadow-sm"
//                 >
//                   <Icon className="h-4 w-4" />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* right */}
//           <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
//             <div className="text-center sm:text-left">
//               <h4 className="text-sm font-semibold text-slate-900">Platform</h4>
//               <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
//                 <Link href="/signup" className="transition hover:text-blue-600">
//                   Get started
//                 </Link>
//                 <Link href="/demo" className="transition hover:text-blue-600">
//                   Book a demo
//                 </Link>
//                 <Link href="/login" className="transition hover:text-blue-600">
//                   Log in
//                 </Link>
//                 <Link href="/contact" className="transition hover:text-blue-600">
//                   Contact
//                 </Link>
//               </div>
//             </div>

//             <div className="text-center sm:text-left">
//               <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
//               <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
//                 {legalLinks.map((item) => (
//                   <Link
//                     key={item.label}
//                     href={item.href}
//                     className="transition hover:text-blue-600"
//                   >
//                     {item.label}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* bottom bar */}
//       <div className="relative border-t border-slate-200/80">
//         <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center sm:px-8 md:flex-row md:text-left lg:px-10">
//           <p className="text-xs text-slate-500">
//             © {new Date().getFullYear()} Slotly, Inc. All rights reserved.
//           </p>

//           <p className="text-xs text-slate-500">
//             Designed for seamless scheduling across teams, clients, and time
//             zones.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }


"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center text-center">

        {/* Logo */}
        <Image
          src="/assets/Slotlyio-logo.webp"
          alt="Slotly"
          width={160}
          height={40}
          className="h-10 w-auto"
          priority
        />

        {/* Links */}
        <div className="mt-5 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <Link href="/privacy-policy" className="hover:text-blue-600">
            Privacy Policy
          </Link>

          <Link href="/terms-and-conditions" className="hover:text-blue-600">
            Terms
          </Link>

         
        </div>

        {/* Copyright */}
        <p className="mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} Slotly. All rights reserved.
        </p>

      </div>
    </footer>
  );
}