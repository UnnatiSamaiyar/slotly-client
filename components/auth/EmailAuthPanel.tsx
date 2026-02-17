"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.slotly.io").replace(/\/$/, "");

type Mode = "login" | "register" | "forgot";

export default function EmailAuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const btnLabel = useMemo(() => {
    if (mode === "register") return "Create account";
    if (mode === "forgot") return "Send reset link";
    return "Sign in";
  }, [mode]);

  function resetBanners() {
    setErr(null);
    setMsg(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetBanners();
    setLoading(true);

    try {
      if (mode === "forgot") {
        const res = await fetch(`${API_BASE}/auth/password/forgot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        await res.json().catch(() => ({}));
        setMsg("If this email exists, a reset link has been sent.");
        setMode("login");
        return;
      }

      const endpoint = mode === "register" ? "/auth/email/register" : "/auth/email/login";
      const body = mode === "register" ? { name: name || "User", email, password } : { email, password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const d =
          (data?.detail &&
            (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail))) ||
          "Auth failed";
        setErr(d);
        return;
      }

      localStorage.setItem("slotly_user", JSON.stringify(data));
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const isForgot = mode === "forgot";
  const isRegister = mode === "register";

  return (
    <div className="w-full mt-6">
      {/* segmented control */}
      <div className="flex items-center justify-center">
        <div className="w-full rounded-2xl bg-gray-100 p-1 flex gap-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              resetBanners();
            }}
            className={[
              "flex-1 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
              mode === "login"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-700 hover:bg-white/70",
            ].join(" ")}
            aria-pressed={mode === "login"}
          >
            Email sign in
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              resetBanners();
            }}
            className={[
              "flex-1 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
              mode === "register"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-700 hover:bg-white/70",
            ].join(" ")}
            aria-pressed={mode === "register"}
          >
            Create account
          </button>
        </div>
      </div>

      {/* form */}
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        {isRegister && (
          <div className="space-y-1.5">
            <label className="sr-only" htmlFor="slotly_name">
              Full name
            </label>
            <input
              id="slotly_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoComplete="name"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="sr-only" htmlFor="slotly_email">
            Work email
          </label>
          <input
            id="slotly_email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
          />
        </div>

        {!isForgot && (
          <div className="space-y-1.5">
            <label className="sr-only" htmlFor="slotly_password">
              Password
            </label>
            <input
              id="slotly_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 chars)"
              type="password"
              required
              minLength={8}
              autoComplete={isRegister ? "new-password" : "current-password"}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
            />
          </div>
        )}

        {/* banners */}
        {(err || msg) && (
          <div
            className={[
              "rounded-2xl px-3 py-2 text-xs leading-relaxed border",
              err
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-800",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            {err || msg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={[
            "w-full rounded-2xl py-3.5 text-sm font-semibold text-white",
            "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md",
            "transition hover:opacity-95 active:scale-[0.99]",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-4 focus:ring-blue-500/20",
          ].join(" ")}
        >
          {loading ? "Please wait…" : btnLabel}
        </button>

        {!isForgot ? (
          <button
            type="button"
            onClick={() => {
              setMode("forgot");
              resetBanners();
            }}
            className="w-full text-xs text-gray-600 hover:text-gray-900 transition py-1"
          >
            Forgot password?
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMode("login");
              resetBanners();
            }}
            className="w-full text-xs text-gray-600 hover:text-gray-900 transition py-1"
          >
            Back to login
          </button>
        )}
      </form>
    </div>
  );
}
