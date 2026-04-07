"use client";

import { useMemo, useState } from "react";
import { FcGoogle } from "react-icons/fc";

type Props = {
  variant?: "login" | "calendar";
  label?: string;
  compact?: boolean;
  returnTo?: string;
  fromCreateEventModal?: boolean; 
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
  fromCreateEventModal = false,
}: Props) {
  const [hover, setHover] = useState(false);

  const redirect = process.env.NEXT_PUBLIC_REDIRECT_URI!;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

  const authUrl = useMemo(() => {
    const isCalendar = variant === "calendar";
    const stateObj = {
      mode: isCalendar ? "calendar" : "login",
      returnTo: returnTo || "/dashboard",
      fromCreateEventModal,
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
      aria-label={
        variant === "calendar"
          ? "Connect Google Calendar"
          : "Continue with Google"
      }
      className="
      w-full
      flex items-center justify-center gap-3
      h-10
      rounded-lg
      border border-gray-200
      bg-white
      text-gray-700
      text-sm font-medium
      transition
      hover:bg-gray-50
      hover:shadow-sm
      active:scale-[0.99]
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500/20
    "
    >
      <FcGoogle className="text-lg" />
      <span>
        {label ||
          (variant === "calendar"
            ? "Connect Google Calendar"
            : "Continue with Google")}
      </span>
    </button>
  );
}
