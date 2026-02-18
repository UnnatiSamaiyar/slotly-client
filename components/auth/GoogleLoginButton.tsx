"use client";

import { useMemo, useState } from "react";
import { FcGoogle } from "react-icons/fc";

type Props = {
  /**
   * login: only basic scopes (openid/email/profile)
   * calendar: incremental consent for Calendar scopes
   */
  variant?: "login" | "calendar";
  /** Override button label */
  label?: string;
  /** Compact UI for tight spaces (e.g., sidebar) */
  compact?: boolean;
  /** Where to redirect after successful callback (encoded into OAuth state) */
  returnTo?: string;
};

function safeBase64UrlEncode(input: string) {
  // btoa expects latin1; we only encode JSON with ASCII keys/values.
  const base64 = typeof window !== "undefined" ? window.btoa(input) : "";
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export default function GoogleLoginButton({
  variant = "login",
  label,
  compact = false,
  returnTo,
}: Props) {
  const [hover, setHover] = useState(false);

  const redirect = process.env.NEXT_PUBLIC_REDIRECT_URI!;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

  const authUrl = useMemo(() => {
    const isCalendar = variant === "calendar";

    const stateObj = {
      mode: isCalendar ? "calendar" : "login",
      returnTo: returnTo || "/dashboard",
      t: Date.now(),
    };

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirect,
      response_type: "code",
      // State allows callback to decide where to redirect and which flow was used.
      state: safeBase64UrlEncode(JSON.stringify(stateObj)),
      scope: (
        isCalendar
          ? [
              "openid",
              "email",
              "profile",
              "https://www.googleapis.com/auth/calendar",
              "https://www.googleapis.com/auth/calendar.events",
            ]
          : ["openid", "email", "profile"]
      ).join(" "),
    });

    // Only request offline refresh token + explicit consent when user consciously connects calendar.
    if (isCalendar) {
      params.set("access_type", "offline");
      params.set("prompt", "consent");
      // Helps incremental consent when user already granted basic scopes.
      params.set("include_granted_scopes", "true");
    }

    return "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
  }, [clientId, redirect, returnTo, variant]);

  const handleLogin = () => {
    window.location.href = authUrl;
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={variant === "calendar" ? "Connect Google Calendar" : "Continue with Google"}
      className={[
        "relative",
        compact ? "w-full" : "w-full",
        compact ? "px-3 py-2 rounded-xl" : "px-5 py-4 rounded-2xl",
        "flex flex-nowrap items-center justify-center gap-3",
        "text-white font-semibold",
        compact ? "text-sm" : "text-base sm:text-lg",
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
        className={[
          "pointer-events-none absolute inset-0 border-[2px] border-transparent",
          compact ? "rounded-xl" : "rounded-2xl",
        ].join(" ")}
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
      <span
        className={[
          "flex items-center justify-center rounded-full bg-white shadow-sm shrink-0",
          compact ? "w-8 h-8" : "w-10 h-10",
        ].join(" ")}
      >
        <FcGoogle className={compact ? "text-xl" : "text-2xl"} />
      </span>

      {/* Text – FORCED SINGLE LINE */}
      <span className="leading-none whitespace-nowrap">
        {label || (variant === "calendar" ? "Connect Google Calendar" : "Continue with Google")}
      </span>
    </button>
  );
}
