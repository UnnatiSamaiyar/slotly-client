"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Calendar, ArrowLeft, Copy } from "lucide-react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function RsvpThanksPage() {
  const params = useSearchParams();
  const router = useRouter();

  const status = (params.get("status") || "").toLowerCase();
  const isAccepted = status === "accepted";
  const isDeclined = status === "declined";

  const title = isAccepted
    ? "You're confirmed"
    : isDeclined
    ? "Response recorded"
    : "RSVP received";

  const subtitle = isAccepted
    ? "Your attendance is confirmed. See you soon."
    : isDeclined
    ? "You declined this meeting. The host has been notified."
    : "Your response has been saved.";

  const pillText = isAccepted ? "Accepted" : isDeclined ? "Declined" : "Updated";
  const pillClass = isAccepted
    ? "bg-emerald-500/15 text-emerald-700 border-emerald-200"
    : isDeclined
    ? "bg-rose-500/15 text-rose-700 border-rose-200"
    : "bg-slate-500/10 text-slate-700 border-slate-200";

  const icon = isAccepted ? (
    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
  ) : isDeclined ? (
    <XCircle className="w-8 h-8 text-rose-600" />
  ) : (
    <Calendar className="w-8 h-8 text-indigo-600" />
  );

  const actionHint = isAccepted
    ? "Add it to your calendar so you don’t miss it."
    : isDeclined
    ? "If this was a mistake, contact the host to reschedule."
    : "You can now close this tab safely.";

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      alert("Copy failed");
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-24 right-12 w-[260px] h-[260px] rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-5 py-10 md:py-16">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-sm font-semibold tracking-tight">
            <span className="text-indigo-700">Slotly</span>
          </div>
        </div>

        {/* Main card */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
          <div className="p-7 md:p-10">
            <div className="flex items-start gap-4">
              <div
                className={cx(
                  "w-14 h-14 rounded-2xl grid place-items-center border",
                  isAccepted
                    ? "bg-emerald-50 border-emerald-100"
                    : isDeclined
                    ? "bg-rose-50 border-rose-100"
                    : "bg-indigo-50 border-indigo-100"
                )}
              >
                {icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                    {title}
                  </h1>

                  <span
                    className={cx(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
                      pillClass
                    )}
                  >
                    {pillText}
                  </span>
                </div>

                <p className="mt-2 text-slate-600 text-sm md:text-base leading-relaxed">
                  {subtitle}
                </p>

                <div className="mt-4 text-sm text-slate-500">{actionHint}</div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Info / Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: What happened */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  {isAccepted && (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Confirmed — you’re going.
                    </div>
                  )}
                  {isDeclined && (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      Declined — you’re not attending.
                    </div>
                  )}
                  {!isAccepted && !isDeclined && (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      Recorded — response saved.
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xs text-slate-500">
                  Tip: If the email shows “unknown sender”, tap “I know the sender” to avoid future warnings.
                </div>
              </div>

              {/* Right: Buttons */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Quick actions
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <button
                    onClick={() => router.push("/")}
                    className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
                  >
                    Go to Slotly
                  </button>

                  <button
                    onClick={() => copyText(window.location.href)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition inline-flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy this confirmation page
                  </button>

                  <div className="text-xs text-slate-500">
                    If you need changes, contact the host directly.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div className="px-7 md:px-10 py-5 border-t border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white rounded-b-3xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-xs text-slate-500">
                Powered by <span className="font-semibold text-slate-700">Slotly</span>
              </div>
              <div className="text-xs text-slate-500">
                You can safely close this tab.
              </div>
            </div>
          </div>
        </div>

        {/* Tiny bottom note */}
        <div className="mt-6 text-center text-xs text-slate-400">
          This page confirms your RSVP. Meeting details remain in your calendar invite.
        </div>
      </div>
    </div>
  );
}
