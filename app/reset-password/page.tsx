"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://api.slotly.io").replace(
  /\/$/,
  ""
);

function ResetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const canSubmit = useMemo(
    () => Boolean(token) && pw1.length >= 8 && pw1 === pw2,
    [token, pw1, pw2]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: pw1 }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(
          (data?.detail &&
            (typeof data.detail === "string"
              ? data.detail
              : JSON.stringify(data.detail))) ||
            "Reset failed"
        );
        return;
      }

      setOk(true);
      window.setTimeout(() => router.push("/login"), 800);
    } catch (e: any) {
      setErr(e?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef3ff] to-white px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Reset password
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter a new password for your account.
        </p>

        {!token && (
          <div className="mt-6 text-sm text-red-600">
            Missing reset token. Please use the link from your email.
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            type="password"
            minLength={8}
            placeholder="New password (min 8 chars)"
            className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            type="password"
            minLength={8}
            placeholder="Confirm new password"
            className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {err && <div className="text-xs text-red-600 break-words">{err}</div>}
          {ok && (
            <div className="text-xs text-green-700">
              Password updated. Redirecting…
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full rounded-2xl py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Please wait…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef3ff] to-white px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-center">
          <div
            className="h-10 w-10 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"
            aria-hidden="true"
          />
        </div>
        <div className="text-center mt-5">
          <div className="text-sm font-semibold text-slate-900">Loading…</div>
          <div className="text-xs text-slate-500 mt-1">
            Preparing reset form.
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-11 w-full bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-11 w-full bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-11 w-full bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ResetPasswordInner />
    </Suspense>
  );
}
