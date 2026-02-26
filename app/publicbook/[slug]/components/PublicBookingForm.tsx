"use client";

import React, { useEffect, useMemo, useState } from "react";
function formatTimezoneForUI(tz: string) {
  try {
    const now = new Date();

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(now);

    const shortName =
      parts.find((p) => p.type === "timeZoneName")?.value || "";

    const offsetMin = -now.getTimezoneOffset();
    const sign = offsetMin >= 0 ? "+" : "-";
    const h = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(2, "0");
    const m = String(Math.abs(offsetMin) % 60).padStart(2, "0");

    return `GMT${sign}${h}:${m}${shortName ? ` (${shortName})` : ""}`;
  } catch {
    return tz;
  }
}

function normalizeSpaces(s: string) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

function SelectedSummary({ iso }: any) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const day = d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="mb-3 rounded-lg border bg-gray-50 px-3 py-2 text-sm">
        <div className="text-gray-500">Selected slot</div>
        <div className="font-semibold text-gray-900">
          {day} • {time}
        </div>
      </div>
    );
  } catch {
    return null;
  }
}

export default function PublicBookingForm({
  slug,
  profile,
  selectedSlotISO,
  viewerTz,
  onBooked,

  heightClass = "h-[65vh] sm:h-[520px]",

}: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const resolvedViewerTz = useMemo(
    () => viewerTz || Intl.DateTimeFormat().resolvedOptions().timeZone,
    [viewerTz]
  );

  useEffect(() => {
    const savedName = localStorage.getItem("slotly_name");
    const savedEmail = localStorage.getItem("slotly_email");
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  async function submit() {
    setMessage(null);
    if (!selectedSlotISO) return setMessage("Please select a time slot.");
    if (!name || !email) return setMessage("Name & email required.");

    const meetingMode = String(profile?.meeting_mode || "google_meet");
    const resolvedLocation = profile?.location ? String(profile.location) : null;

    setLoading(true);
    try {
      const payload = {
        profile_slug: slug,
        guest_name: name,
        attendees: [email],
        start_iso: selectedSlotISO,
        title: profile?.title,
        timezone: resolvedViewerTz,
        meeting_mode: meetingMode,
        location: meetingMode === "in_person" ? resolvedLocation : null,
      };

      const res = await fetch("https://api.slotly.io/public/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.detail ?? "Server error");

      localStorage.setItem("slotly_name", name);
      localStorage.setItem("slotly_email", email);

      setMessage("Booking confirmed! Check your email for details.");
      onBooked?.();
    } catch (e: any) {
      setMessage("Booking failed: " + (e.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !!selectedSlotISO && !loading;

  return (
    <>
        <div
          className={`bg-white rounded-xl border shadow-sm ${heightClass} flex flex-col w-full`}
        >
        <div className="p-3 sm:p-4 border-b flex justify-between items-center">

       
          <div className="font-semibold">Your Details</div>
          <div className="text-xs text-gray-500">
            {formatTimezoneForUI(resolvedViewerTz)}
          </div>

        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-24">

    
          <SelectedSummary iso={selectedSlotISO} />

          <input
            className="w-full p-3 border rounded-lg mb-3"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded-lg mb-3"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {message && (
            <div className="mt-3 text-sm text-center border rounded-lg px-3 py-2">
              {message}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold disabled:bg-gray-300"
          >
            {loading ? "Booking…" : "Confirm Booking"}
          </button>
        </div>
      </div>
    </>
  );
}
