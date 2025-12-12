"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Link from "next/link";

const commands = [
  { title: "Home", href: "/" },
  { title: "Features", href: "/features" },
  { title: "Pricing", href: "/pricing" },
  { title: "Dashboard", href: "/dashboard" },
  { title: "Integrations", href: "/integrations" },
  { title: "Contact", href: "/contact" },
];

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Command Palette */}
          <motion.div
            className="fixed top-[20%] left-1/2 z-[9999] w-[90%] max-w-lg -translate-x-1/2 rounded-2xl bg-white/90 backdrop-blur-lg shadow-2xl border border-gray-200 p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search or jump to..."
                  className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <ul className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
              {commands.map((cmd, i) => (
                <motion.li
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.15 }}
                >
                  <Link
                    href={cmd.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                  >
                    {cmd.title}
                    <span className="text-gray-400 text-xs">↵</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
