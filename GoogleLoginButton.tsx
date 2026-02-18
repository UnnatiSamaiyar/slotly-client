"use client";

import { useMemo, useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton() {
  const [hover, setHover] = useState(false);

  const redirect = process.env.NEXT_PUBLIC_REDIRECT_URI!;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

  const authUrl = useMemo(() => {
    const params = new URLSearchParams({
      client_id: clientId,
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

    return "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
  }, [clientId, redirect]);

  const handleLogin = () => {
    window.location.href = authUrl;
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Continue with Google"
      className={[
        "relative w-full",
        "px-5 py-4 rounded-2xl",
        "flex flex-nowrap items-center justify-center gap-3",
        "text-white font-semibold",
        "text-base sm:text-lg",
        "whitespace-nowrap",
        "transition-all duration-300",
        "active:scale-[0.99]",
        "focus:outline-none focus:ring-4 focus:ring-indigo-500/20",
        hover ? "sm:scale-[1.01]" : "scale-100",
      ].join(" ")}
      style={{
        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
        boxShadow: hover
          ? "0 10px 40px rgba(99,102,241,0.45)"
          : "0 6px 25px rgba(99,102,241,0.25)",
      }}
    >
      {/* Gradient border */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl border-[2px] border-transparent"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.65), rgba(99,102,241,0.35), rgba(59,130,246,0.65)) border-box",
          WebkitMask:
            "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* Shine */}
      <span
        className={[
          "pointer-events-none absolute inset-0 rounded-2xl bg-white/20 blur-xl transition-opacity duration-300",
          hover ? "opacity-20" : "opacity-0",
        ].join(" ")}
      />

      {/* Google Icon */}
      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm shrink-0">
        <FcGoogle className="text-2xl" />
      </span>

      {/* Text – FORCED SINGLE LINE */}
      <span className="leading-none whitespace-nowrap">
        Continue with Google
      </span>
    </button>
  );
}
