"use client";

import React, { useMemo } from "react";

export default function PublicEventInfo({ profile }: { profile: any }) {
  const hostName = profile.host_name || profile.host || "Host";
  const title = profile.title || "Meeting";
  const duration = profile.duration_minutes ?? profile.duration ?? 30;

  const subtitle = useMemo(() => {
    return `${duration}-minute meeting`;
  }, [duration]);

  return (
    <div className="h-full p-8 sm:p-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex flex-col">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide text-white/75">
          Booking with
        </div>
        <h1 className="text-3xl font-bold mt-2 leading-tight">{hostName}</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="text-sm text-white/80 mt-2">{subtitle}</div>
      </div>

      <div className="mt-auto">
        <div className="rounded-xl bg-white/10 border border-white/15 p-4 text-sm text-white/90">
          Select a date & time, then confirm your details to book instantly.
        </div>
      </div>
    </div>
  );
}
