"use client";

import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white to-[#f5f8ff] border-t border-gray-100">
      {/* Ambient soft glow */}
      <div className="absolute top-[-100px] left-[20%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[200px] opacity-40 -z-10" />

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-center">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center md:justify-center">
              <Image
                src="/assets/Slotlyio-logo.png"
                alt="Slotly"
                width={160}
                height={45}
                priority
                className="h-10 w-auto"
              />
            </div>

            <p className="mt-3 text-gray-600 text-sm max-w-xs mx-auto md:mx-0">
              The intelligent way to manage your meetings, time, and
              productivity.
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-16 border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Slotly. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/privacy-policy"
              className="hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
