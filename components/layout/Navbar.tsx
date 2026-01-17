"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { CommandPalette } from "./commandpallete";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

type NavItem = { label: string; id: string; hideOnMobile?: boolean };

const NAV_ITEMS: NavItem[] = [
  { label: "Features", id: "features" },
  { label: "How it works", id: "how-it-works", hideOnMobile: true }, // hidden on mobile
  { label: "Security", id: "security" },
  { label: "FAQ", id: "faq" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const headerOffset = 88; // tweak if needed
  const elementPosition = el.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - headerOffset;

  window.scrollTo({ top: offsetPosition, behavior: "smooth" });

  // keep hash for nav clicks (good UX), but NOT for brand click
  history.replaceState(null, "", `#${id}`);
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (id: string) => {
    setIsOpen(false);

    // If user is on another page, go to home with hash
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    // Same page: smooth scroll
    requestAnimationFrame(() => scrollToSection(id));
  };

  const mobileItems = NAV_ITEMS.filter((x) => !x.hideOnMobile);

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);

    // ✅ hard reload to homepage; NO #hero
    // If already on "/", still reload.
    window.location.href = "/";
  };

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
          {/* Brand (hard reload, no hash) */}
         <Link href="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <Image
                src="/assets/Slotlyio-logo.png"
                alt="Slotly"
                width={240}
                height={40}
                priority
                className="h-14 w-auto"
              />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="relative text-gray-700 font-medium transition-colors hover:text-blue-600 group"
              >
                {item.label}
                <span className="absolute left-0 bottom-[-3px] w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300" />
              </button>
            ))}

            <Button
              onClick={() => router.push("/login")}
              className="rounded-full text-sm font-semibold px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.5)] transition-all"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((s) => !s)}
            className="md:hidden text-gray-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile overlay + drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.button
                type="button"
                aria-label="Close menu"
                className="fixed inset-0 z-[60] bg-black/10 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                className="relative z-[70] md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-inner pointer-events-auto"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex flex-col items-center gap-6 py-8">
                  {mobileItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}

                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/login");
                    }}
                    className="rounded-full text-sm font-semibold px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all"
                  >
                    Get Started
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      <CommandPalette open={open} setOpen={setOpen} />
    </>
  );
}
