"use client";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import EmailAuthPanel from "@/components/auth/EmailAuthPanel";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-[100svh] w-full bg-gradient-to-b from-[#eef3ff] to-white px-4 py-10 sm:py-12 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto w-full max-w-[460px] bg-white rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.12)] ring-1 ring-black/5 px-5 py-8 sm:px-8 sm:py-10"
      >
        <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-2 text-gray-900 tracking-tight">
          Welcome to <span className="text-blue-600">Slotly</span>
        </h1>

        <p className="text-center text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
          Login to continue to your dashboard
        </p>

        {/* ✅ Full width button, no unnecessary centering wrapper */}
        <GoogleLoginButton />

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <div className="text-xs text-gray-500">or</div>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <EmailAuthPanel />
      </motion.div>
    </div>
  );
}
