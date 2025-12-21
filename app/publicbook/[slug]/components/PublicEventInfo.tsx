"use client";

import React from "react";

export default function PublicEventInfo({ profile }: { profile: any }) {
  const hostName = profile.host_name || profile.host || "Host";
  const title = profile.title || "Meeting";
  const duration = profile.duration_minutes ?? profile.duration ?? 30;

  return (
    <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
      <div className="mb-6">
        <div className="text-xs uppercase opacity-80">Booking with</div>
        <h1 className="text-3xl font-bold mt-2">{hostName}</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="text-sm opacity-80 mt-2">{duration}-minute meeting</div>
      </div>

      <div className="mt-auto text-sm opacity-80">
        <p>Select a date & time on the right and confirm to book instantly.</p>
      </div>
    </div>
  );
}
