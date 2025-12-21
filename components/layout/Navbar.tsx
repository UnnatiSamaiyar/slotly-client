"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";
import { CommandPalette } from "./commandpallete";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import Image from "next/image";
=======
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

<<<<<<< HEAD
=======
  
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
  const router = useRouter();
  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg transition-all duration-500 ${
          isScrolled
            ? "bg-white/70 border-b border-gray-200 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.08)] py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
<<<<<<< HEAD
            <motion.div whileHover={{ scale: 1.05 }}>
              <Image
                src="/assets/slotly-logo.png"
                alt="Slotly Logo"
                width={120}
                height={40}
                priority
                className="object-contain"
              />
            </motion.div>
=======
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              Slotly
            </motion.span>
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {["Features", "Solutions", "Pricing", "About"].map((item, i) => (
              <Link
                key={i}
                href={`/${item.toLowerCase()}`}
                className="relative text-gray-700 font-medium transition-colors hover:text-blue-600 group"
              >
                {item}
                <span className="absolute left-0 bottom-[-3px] w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"></span>
              </Link>
            ))}

            {/* Command palette trigger */}
            <button
              onClick={() => setOpen(true)}
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Open Command Palette"
            >
              <Search className="w-5 h-5" />
              <span className="absolute -bottom-3 right-0 text-[10px] text-gray-400">
                ⌘K
              </span>
            </button>

            {/* CTA button */}
            <Button
<<<<<<< HEAD
              onClick={() => router.push("/login")}
=======
            onClick={() => router.push("/login")}
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
              className="rounded-full text-sm font-semibold px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.5)] transition-all"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-800 focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile drawer */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden md:hidden bg-white/80 backdrop-blur-lg border-t border-gray-100 shadow-inner"
        >
          <div className="flex flex-col items-center gap-6 py-8">
            {["Features", "Solutions", "Pricing", "About"].map((item, i) => (
              <Link
                key={i}
                href={`/${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
              >
                {item}
              </Link>
            ))}

            {/* Mobile Command Palette Button */}
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all"
            >
              <Search className="w-5 h-5" /> Command
            </button>

            <Button
              onClick={() => setIsOpen(false)}
              className="rounded-full text-sm font-semibold px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all"
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Command Palette Overlay */}
      <CommandPalette open={open} setOpen={setOpen} />
    </>
  );
}
