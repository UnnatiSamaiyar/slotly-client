"use client";

//@ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Google OAuth callback handler (Client)
 *
 * Expects query params:
 * - code
 * - state (optional) -> may contain returnTo etc.
 *
 * Calls backend: POST {API_BASE}/auth/google
 * Persists: localStorage.setItem("slotly_user", JSON.stringify({sub, email, name, picture, ...}))
 * Redirects to returnTo or /dashboard
 */

function safeParseState(stateStr?: string | null) {
  if (!stateStr) return null;
  try {
    // sometimes state is URI encoded json
    const decoded = decodeURIComponent(stateStr);
    return JSON.parse(decoded);
  } catch {
    try {
      return JSON.parse(stateStr);
    } catch {
      return null;
    }
  }
}

function pickApiBase() {
  // Prefer env if you have it
  const envBase =
    (process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_BACKEND_URL || "").trim();

  if (envBase) return envBase.replace(/\/+$/, "");
  // fallback: your local server
  return "http://api.slotly.io";
}

export default function GoogleCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [message, setMessage] = useState<string>("Completing login…");

  const code = sp.get("code");
  const stateStr = sp.get("state");

  const stateObj = useMemo(() => safeParseState(stateStr), [stateStr]);
  const returnTo = useMemo(() => {
    const rt = stateObj?.returnTo;
    if (typeof rt === "string" && rt.startsWith("/")) return rt;
    return "/dashboard";
  }, [stateObj]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setStatus("loading");
        setMessage("Completing login…");

        if (!code) {
          setStatus("error");
          setMessage("Missing OAuth code. Please try logging in again.");
          return;
        }

        const API_BASE = pickApiBase();

        // Backend expects code+state OR full callback URL depending on your implementation.
        // We'll send both so it works either way.
        const res = await fetch(`${API_BASE}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            code,
            state: stateStr || null,
            mode: stateObj?.mode || "login",
            returnTo,
          }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Login failed");
        }

        const payload = await res.json();

        // Flexible extraction (different backends send different shapes)
        const user =
          payload?.user ||
          payload?.data?.user ||
          payload?.profile ||
          payload?.data?.profile ||
          payload;

        const sub = user?.sub || user?.google_sub || user?.id || null;

        if (!sub) {
          // If backend didn't send sub, we still can't open dashboard
          throw new Error("Login succeeded but user id (sub) was not returned by server.");
        }

        // Persist in the SAME key dashboard reads
        const session = {
          sub: String(sub),
          email: user?.email || "",
          name: user?.name || "",
          picture: user?.picture || "",
          raw: user, // keep raw for debugging (safe)
        };

        try {
          localStorage.setItem("slotly_user", JSON.stringify(session));
        } catch {}

        if (cancelled) return;

        setStatus("done");
        setMessage("Login successful. Redirecting…");

        // small delay to ensure storage flush
        setTimeout(() => {
          router.replace(returnTo);
        }, 150);
      } catch (e: any) {
        if (cancelled) return;
        setStatus("error");
        setMessage(e?.message || "Login failed. Please try again.");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [code, stateStr, returnTo, router, stateObj]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="text-xl font-semibold text-gray-900">
          {status === "error" ? "Login Failed" : status === "done" ? "Welcome back" : "Signing you in"}
        </div>
        <div className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-gray-600"}`}>
          {message}
        </div>

        {status === "error" ? (
          <button
            onClick={() => router.replace("/login")}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Go to Login
          </button>
        ) : null}
      </div>
    </div>
  );
}
