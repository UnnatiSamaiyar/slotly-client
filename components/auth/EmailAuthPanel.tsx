// @ts-nocheck

"use client";

import { useMemo, useState, type MouseEvent } from "react";
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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

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
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setErr(data?.detail || "Failed to send reset link");
          return;
        }

        setMsg(data?.message || "If this email exists, a reset link has been sent.");
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
  function handleEyeMove(e: MouseEvent<HTMLDivElement>) {
    if (passwordVisible) return;

    const eyeButton = e.currentTarget.querySelector("button");
    if (!eyeButton) return;

    const rect = eyeButton.getBoundingClientRect();

    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - eyeCenterX;
    const dy = e.clientY - eyeCenterY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // eye moves only when mouse is close to eye area
    if (distance > 50) {
      setEyeOffset({ x: 0, y: 0 });
      return;
    }

    const angle = Math.atan2(dy, dx);

    setEyeOffset({
      x: Math.cos(angle) * 3.5,
      y: Math.sin(angle) * 2.4,
    });
  }

  function resetEye() {
    if (passwordVisible) return;
    setEyeOffset({ x: 0, y: 0 });
  }
  function resetEye() {
    if (passwordVisible) return;
    setEyeOffset({ x: 0, y: 0 });
  }

  function resetEye() {
    if (passwordVisible) return;
    setEyeOffset({ x: 0, y: 0 });
  }
  return (
    <div className="w-full mt-4">

      {/* Segmented Control */}
      <div className="flex w-full rounded-lg bg-gray-100 p-1 text-xs font-medium">
        {["login", "register"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setMode(type as Mode);
              resetBanners();
            }}
            className={`flex-1 rounded-md px-3 py-2 transition-all duration-200 ${mode === type
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
          <div
            className="relative"
            onMouseMove={handleEyeMove}
            onMouseLeave={resetEye}
          >
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type={passwordVisible ? "text" : "password"}
              required
              minLength={8}
              autoComplete={isRegister ? "new-password" : "current-password"}
              className="
        h-9 w-full rounded-lg border border-gray-200 bg-gray-50
        px-3 pr-12 text-sm outline-none transition
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
      "
            />

            <button
              type="button"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              onClick={() => {
                setPasswordVisible((prev) => !prev);
                setEyeOffset({ x: 0, y: 0 });
              }}
              className="
        absolute right-2 top-1/2 z-10 flex h-7 w-8
        -translate-y-1/2 items-center justify-center rounded-md
        text-slate-700 transition hover:bg-white hover:text-blue-600
      "
            >
              {/* HIDDEN STATE: proper full eye with moving eyeball */}
              <svg
                viewBox="0 0 32 22"
                fill="none"
                className={`
          absolute h-[22px] w-[32px] transition-all duration-300
          ${passwordVisible ? "scale-75 opacity-0" : "scale-100 opacity-100"}
        `}
              >
                <path
                  d="M2.5 11C5.4 5.8 10 3.4 16 3.4C22 3.4 26.6 5.8 29.5 11C26.6 16.2 22 18.6 16 18.6C10 18.6 5.4 16.2 2.5 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <g
                  style={{
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    transformOrigin: "16px 11px",
                    transition: "transform 150ms ease",
                  }}
                >
                  <circle cx="16" cy="11" r="4.4" fill="currentColor" />
                  <circle cx="17.4" cy="9.7" r="1.25" fill="#f9fafb" />
                </g>
              </svg>

              {/* VISIBLE STATE: half eye with lashes */}
              <svg
                viewBox="0 0 64 32"
                fill="none"
                className={`
    absolute h-[16px] w-[30px] overflow-visible transition-all duration-300
    ${passwordVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"}
  `}
              >
                <path
                  d="M10 19C15 24 22 27 32 27C42 27 49 24 54 19"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
        {/* Error / Success */}
        {(err || msg) && (
          <div
            className={`text-xs rounded-lg px-3 py-2 ${err
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
              onClick={() => { setMode("forgot"); resetBanners(); }}
              className="text-[11px] text-gray-700 hover:text-gray-800 transition"
            >
              Forgot password?
            </button>
          )}
          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => { setMode("login"); resetBanners(); }}
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