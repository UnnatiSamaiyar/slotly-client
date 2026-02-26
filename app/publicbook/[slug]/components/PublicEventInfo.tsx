"use client";

import React, { useMemo, useState } from "react";
import { Clock, MapPin, Video } from "lucide-react";

function parseLocation(location: string) {
  const s = String(location || "").trim();
  if (!s) return { text: "", url: "" };
  // Common pattern we store: "Office: Blue Tokai (https://...)"
  const m = s.match(/\((https?:\/\/[^)]+)\)\s*$/i);
  const url = m?.[1] || "";
  const text = url ? s.replace(m![0], "").trim() : s;
  return { text, url };
}


export default function PublicEventInfo({ profile }: { profile: any }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.slotly.io";
  const hostName = profile.host_name || profile.host || "Host";
  const title = profile.title || "Meeting";
  const duration = profile.duration_minutes ?? profile.duration ?? 30;

  const subtitle = useMemo(() => {
    return `${duration}-minute meeting`;
  }, [duration]);

  const meetingMode = String(profile?.meeting_mode || "google_meet");
  const loc = useMemo(() => parseLocation(profile?.location || ""), [profile?.location]);

  const logoSrc = useMemo(() => {
    const u = profile?.brand_logo_url;
    if (!u || typeof u !== "string") return null;
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    if (u.startsWith("/")) return `${apiBase}${u}`;
    return `${apiBase}/${u}`;
  }, [profile, apiBase]);

  const [logoMode, setLogoMode] = useState<
    "unknown" | "wide" | "badge"
  >("unknown");

  return (
      <div className="h-full px-4 py-4 sm:px-6 sm:py-6 bg-white flex flex-col lg:border-r">

      {/* LOGO */}
      {logoSrc && (
        <div className="mb-4 sm:mb-5">

          {logoMode !== "badge" && (
            <div className="inline-flex items-center rounded-lg border px-4 py-2 max-w-[260px]">
              <img
                src={logoSrc}
                alt="Brand logo"
                className="block max-h-[44px] sm:max-h-[52px] w-auto max-w-[160px] sm:max-w-[200px] object-contain"

                loading="eager"
                decoding="async"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  const w = img.naturalWidth || 0;
                  const h = img.naturalHeight || 0;
                  if (!w || !h) return;
                  setLogoMode(w / h < 1.15 ? "badge" : "wide");
                }}
              />
            </div>
          )}

          {logoMode === "badge" && (
            <div className="inline-flex items-center justify-center rounded-lg border p-3">
              <img
                src={logoSrc}
                alt="Brand logo"
           
                className="block h-[52px] w-[52px] sm:h-[64px] sm:w-[64px] object-contain"

                loading="eager"
                decoding="async"
              />
            </div>
          )}
        </div>
      )}

      {/* HOST */}
      <div className="text-xs text-gray-800 uppercase tracking-wide">
        Booking with
      </div>
      <h1 className="text-base sm:text-lg font-semibold">
        {hostName}
      </h1>

      {/* EVENT */}
      <div className="mt-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">

          {title}
        </h2>
        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-800" />
          <span>{subtitle}</span>
        </div>

        {/* Meeting info (read-only) */}
        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-2 text-sm text-slate-700">
            {meetingMode === "in_person" ? (
              <MapPin className="w-4 h-4 mt-0.5 text-slate-700" />
            ) : (
              <Video className="w-4 h-4 mt-0.5 text-slate-700" />
            )}
            <div className="leading-snug">
              <div className="font-medium">
                {meetingMode === "in_person" ? "In-person" : "Google Meet"}
              </div>
              {meetingMode === "in_person" && (loc.text || loc.url) ? (
                <div className="text-slate-600 break-words">
                  {loc.text}
                  {loc.url ? (
                    <>
                      {loc.text ? " · " : ""}
                      <a
                        href={loc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Open in Maps
                      </a>
                    </>
                  ) : null}
                </div>
              ) : null}
              {meetingMode === "google_meet" ? (
                <div className="text-slate-600">Link will be shared after booking.</div>
              ) : null}
            </div>
          </div>
        </div>

      </div>

      {/* INFO BOX */}
      <div className="mt-auto pt-4 sm:pt-6">
        <div className="rounded-lg bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">

          Choose a date and time that works for you.
        </div>

      </div>

      {/* ✅ POWERED BY FOOTER (Calendly-style) */}
      {/* <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t flex justify-center">

        <a
          href="/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 transition"
        >
          <span>Powered by</span>
          <img
            src="/Slotlyio-logo.png"
            alt="Slotly"
            className="h-4 opacity-80"
          />
        </a>
      </div> */}
    </div>
  );
}
