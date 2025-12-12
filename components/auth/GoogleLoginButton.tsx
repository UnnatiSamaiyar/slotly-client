// "use client";

// import { signIn } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { FcGoogle } from "react-icons/fc";

// export function GoogleLoginButton() {
//   return (
//     <Button
//       onClick={() => signIn("google")}
//       className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
//     >
//       <FcGoogle className="w-5 h-5" />
//       Continue with Google
//     </Button>
//   );
// }

// "use client";

// export default function GoogleLoginButton() {
//   const handleLogin = () => {
//     const redirect = process.env.NEXT_PUBLIC_REDIRECT_URI!;

//     const params = new URLSearchParams({
//       client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//       redirect_uri: redirect,
//       response_type: "code",
//       access_type: "offline",
//       prompt: "consent",
//       scope: [
//         "openid",
//         "email",
//         "profile",
//         "https://www.googleapis.com/auth/calendar",
//         "https://www.googleapis.com/auth/calendar.events",
//       ].join(" "),
//     });

//     window.location.href =
//       "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
//   };

//   return (
//     <button
//       onClick={handleLogin}
//       className="px-3 py-2 bg-blue-600 rounded-lg text-white"
//     >
//       Connect Google Calendar
//     </button>
//   );
// }




"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton() {
  const [hover, setHover] = useState(false);

  const handleLogin = () => {
    const redirect = process.env.NEXT_PUBLIC_REDIRECT_URI!;

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: redirect,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ].join(" "),
    });

    window.location.href =
      "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
  };

  return (
    <button
      onClick={handleLogin}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`
        relative w-full max-w-xs py-4 px-6 rounded-2xl
        flex items-center justify-center gap-3
        text-white font-semibold text-lg
        transition-all duration-300 
        backdrop-blur-xl
        ${hover ? "scale-[1.04]" : "scale-100"}
        active:scale-[0.97]
      `}
      style={{
        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
        boxShadow: hover
          ? "0 10px 40px rgba(99,102,241,0.45)"
          : "0 6px 25px rgba(99,102,241,0.25)",
      }}
    >
      {/* 🔥 Animated glowing border */}
      <span
        className="absolute inset-0 rounded-2xl border-[2px] border-transparent"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.7), rgba(99,102,241,0.4), rgba(59,130,246,0.7)) border-box",
          WebkitMask:
            "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* Shine Overlay */}
      <span
        className={`absolute inset-0 rounded-2xl bg-white/20 blur-xl transition-opacity duration-300 ${
          hover ? "opacity-20" : "opacity-0"
        }`}
      />

      <FcGoogle className="text-2xl bg-white rounded-full p-1" />
      Connect Google Calendar
    </button>
  );
}
