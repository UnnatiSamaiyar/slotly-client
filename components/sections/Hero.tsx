<<<<<<< HEAD
=======
// "use client";

// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// export function Hero() {
//   return (
//     <section className="relative isolate overflow-hidden bg-white">
//       {/* Soft gradient backdrop */}
//       <div
//         aria-hidden="true"
//         className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]"
//       />

//       <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:flex lg:items-center lg:justify-between">
//         {/* Left Content */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="max-w-2xl"
//         >
//           <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
//             The future of <span className="text-blue-600">time</span> management.
//           </h1>

//           <p className="mt-6 text-lg leading-8 text-gray-600">
//             Slotly makes scheduling feel effortless. No back-and-forth emails,
//             no timezone headaches — just seamless coordination that adapts to
//             you and your team.
//           </p>

//           <div className="mt-10 flex items-center gap-x-6">
//             <Button size="lg" className="px-8 rounded-full">
//               Get Started
//             </Button>
//             <Button
//               variant="ghost"
//               className="text-gray-700 hover:text-blue-600 hover:bg-transparent"
//             >
//               Watch demo →
//             </Button>
//           </div>
//         </motion.div>

//         {/* Right Visual */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1, delay: 0.2 }}
//           className="mt-16 lg:mt-0 lg:w-1/2 flex justify-center"
//         >
//           <div className="relative w-full max-w-[560px] rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden">
//             <Image
//               src="/dashboardhero.webp"
//               alt="Slotly dashboard preview"
//               width={800}
//               height={500}
//               className="w-full h-auto"
//               priority
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent" />
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }





>>>>>>> 6f1a8f49dde73878af27096bfbd1418fcc8ff0bb



"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* FULL-WIDTH ambient background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.18),rgba(255,255,255,0))]"
      />

      {/* CONTENT WRAPPER (centered, not boxed background) */}
      <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-16 py-32 sm:py-40 flex flex-col lg:flex-row items-center justify-between gap-20">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="max-w-2xl text-center lg:text-left"
        >
          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-gray-900 leading-[1.05]">
            Scheduling that
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              works for you.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Slotly removes friction from scheduling. One link, real-time
            availability, automatic time zone handling — built for individuals
            and teams who value speed.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-x-6">
<<<<<<< HEAD
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="px-10 py-6 rounded-full text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_14px_50px_-12px_rgba(37,99,235,0.7)] transition-all"
=======
            <Button
              size="lg"
              className="px-10 py-6 rounded-full text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_14px_50px_-12px_rgba(37,99,235,0.7)] transition-all"
            >
              Get started free
            </Button>

            <Button
              variant="ghost"
              className="text-gray-700 hover:text-blue-600 hover:bg-transparent text-base"
>>>>>>> 6f1a8f49dde73878af27096bfbd1418fcc8ff0bb
            >
              Get started free
            </Button>

            
          </div>
        </motion.div>

        {/* RIGHT VISUAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative w-full lg:w-[52%] flex justify-center"
        >
          <div className="relative w-full max-w-[720px] rounded-3xl overflow-hidden ring-1 ring-gray-200/70 shadow-[0_40px_120px_-40px_rgba(59,130,246,0.5)]">
            <Image
              src="/assets/Home/Homepage-Hero-new.webp"
              alt="Slotly scheduling dashboard"
              width={1400}
              height={900}
              priority
              className="w-full h-auto object-cover"
            />

            {/* Glass highlight */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
