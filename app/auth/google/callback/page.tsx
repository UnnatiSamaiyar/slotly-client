"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"working" | "error">("working");
  const [message, setMessage] = useState("Logging you in…");
  const [detail, setDetail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function handle() {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
        setStatus("error");
        setMessage("Missing authorization code.");
        setDetail("Please retry Google sign-in from the login page.");
        return;
      }

      try {
        setStatus("working");
        setMessage("Signing you in…");
        setDetail(null);

        const res = await fetch("https://api.slotly.io/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          if (cancelled) return;
          console.error("Backend error:", data);
          setStatus("error");
          setMessage("Sign-in failed.");
          setDetail(
            (data && (data.detail || data.message)) ||
              "Your session could not be created. Please try again."
          );
          return;
        }

        if (cancelled) return;

        // THIS IS WHERE LOGIN GETS STORED
        localStorage.setItem("slotly_user", JSON.stringify(data));

        setMessage("Redirecting to your dashboard…");
        router.push("/dashboard");
      } catch (err) {
        if (cancelled) return;
        console.error("Callback failed:", err);
        setStatus("error");
        setMessage("Something went wrong.");
        setDetail("Please check your connection and try again.");
      }
    }

    handle();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f6f8ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-center">
          <div
            className={[
              "h-12 w-12 rounded-full border-2",
              status === "working"
                ? "border-indigo-200 border-t-indigo-600 animate-spin"
                : "border-red-200",
            ].join(" ")}
            aria-hidden="true"
          />
        </div>

        <div className="text-center mt-5">
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            {message}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {status === "working"
              ? "Please wait. Do not close this tab."
              : detail || "Please try again."}
          </p>

          {status === "error" ? (
            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold"
              >
                Back to Home
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
              >
                Retry
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Secure Google sign-in</span>
            <span>Slotly</span>
          </div>
        </div>
      </div>
    </div>
  );
}
