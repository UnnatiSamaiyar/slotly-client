"use client";

<GoogleLoginButton />

import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef3ff] to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
      >
        <h1 className="text-3xl font-semibold text-center mb-2 text-gray-900">
          Welcome to <span className="text-blue-600">Slotly</span>
        </h1>

        <p className="text-center text-gray-500 mb-8 text-sm">
          Login to continue to your dashboard
        </p>

        <GoogleLoginButton />
      </motion.div>
    </div>
  );
}
