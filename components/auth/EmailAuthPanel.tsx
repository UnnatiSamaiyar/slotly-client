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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
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
      const body =
        mode === "register"
          ? { name: name || "User", email, password }
          : { email, password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const d = (data?.detail && (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail))) || "Auth failed";
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

  return (
    <div className="w-full max-w-xs mx-auto mt-6">
      <div className="flex items-center gap-2 justify-center text-sm">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErr(null);
            setMsg(null);
          }}
          className={
            mode === "login"
              ? "px-3 py-1.5 rounded-full bg-gray-900 text-white"
              : "px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
        >
          Email Sign in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setErr(null);
            setMsg(null);
          }}
          className={
            mode === "register"
              ? "px-3 py-1.5 rounded-full bg-gray-900 text-white"
              : "px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
        >
          Create account
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        {mode === "register" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email"
          type="email"
          required
          className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {mode !== "forgot" && (
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 chars)"
            type="password"
            required
            minLength={8}
            className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {err && <div className="text-xs text-red-600">{err}</div>}
        {msg && <div className="text-xs text-green-700">{msg}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:opacity-95 disabled:opacity-60"
        >
          {loading ? "Please wait…" : btnLabel}
        </button>

        {mode !== "forgot" && (
          <button
            type="button"
            onClick={() => {
              setMode("forgot");
              setErr(null);
              setMsg(null);
            }}
            className="w-full text-xs text-gray-600 hover:text-gray-900"
          >
            Forgot password?
          </button>
        )}

        {mode === "forgot" && (
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErr(null);
              setMsg(null);
            }}
            className="w-full text-xs text-gray-600 hover:text-gray-900"
          >
            Back to login
          </button>
        )}
      </form>
    </div>
  );
}
