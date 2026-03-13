"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || " https://api.slotly.io").replace(/\/$/, "");

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
    return "Continue";
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
  <div className="w-full mt-4">

    {/* Segmented Control (Cleaner Style) */}
    <div className="flex w-full rounded-lg bg-gray-100 p-1 text-xs font-medium">
      {["login", "register"].map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => {
            setMode(type as Mode);
            resetBanners();
          }}
          className={`flex-1 rounded-md px-3 py-2 transition-all duration-200 ${
            mode === type
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {type === "login" ? "Use email" : "Create account"}
        </button>
      ))}
    </div>

    {/* Form */}
    <form onSubmit={onSubmit} className="mt-4 space-y-3">

      {isRegister && (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          autoComplete="name"
          className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      )}

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Work email"
        type="email"
        required
        autoComplete="email"
        className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />

      {!isForgot && (
        <div className="relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            minLength={8}
            autoComplete={isRegister ? "new-password" : "current-password"}
            className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      )}

      {/* Error / Success */}
      {(err || msg) && (
        <div
          className={`text-xs rounded-lg px-3 py-2 ${
            err
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-emerald-50 text-emerald-600 border border-emerald-200"
          }`}
        >
          {err || msg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-9 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-sm transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
      >
        {loading ? "Please wait…" : btnLabel}
      </button>

      {/* Forgot / Back */}
        <div className="text-center pt-1">
          {mode === "login" && (
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                resetBanners();
              }}
              className="text-[11px] text-gray-700 hover:text-gray-800 transition"
            >
              Forgot password?
            </button>
          )}

          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                resetBanners();
              }}
              className="text-[11px] text-gray-500 hover:text-gray-800 transition"
            >
              Back to login
            </button>
          )}
        </div>
    </form>
  </div>
);
}
