"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-6 gap-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/slotly-logo.png"
            alt="Slotly Logo"
            width={110}
            height={36}
            className="object-contain"
          />
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <Link
            href="/privacy-policy"
            className="hover:text-blue-600 transition-colors"
          >
            Privacy
          </Link>

          <Link
            href="/terms-and-conditions"
            className="hover:text-blue-600 transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
