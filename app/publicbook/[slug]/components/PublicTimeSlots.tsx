"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

function hourInTimeZone(iso: string, timeZone: string): number {
  try {
    const d = new Date(iso);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      hour12: false,
    }).formatToParts(d);
    const hh = parts.find((p) => p.type === "hour")?.value;
    const n = Number(hh);
    return Number.isFinite(n) ? n : d.getHours();
  } catch {
    return new Date(iso).getHours();
  }
}

function timeLabelInTimeZone(iso: string, timeZone: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    });
  } catch {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

function sectionForHour(h: number) {
  if (h < 6) return "Night";
  if (h < 12) return "Morning";
  if (h < 18) return "Afternoon";
  return "Evening";
}

export default function PublicTimeSlots({
  slug,
  date,
  onSelectSlot,
  selectedSlotISO,
  viewerTz,
  heightClass = "max-h-none sm:h-[520px]"


}: any) {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedViewerTz = useMemo(
    () => viewerTz || Intl.DateTimeFormat().resolvedOptions().timeZone,
    [viewerTz]
  );

  const listRef = useRef<HTMLDivElement | null>(null);

  const grouped = useMemo(() => {
    const g: any = { Night: [], Morning: [], Afternoon: [], Evening: [] };
    for (const s of slots) {
      const hr = hourInTimeZone(String(s.iso || ""), resolvedViewerTz);
      g[sectionForHour(hr)].push(s);
    }
    return g;
  }, [slots, resolvedViewerTz]);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      onSelectSlot(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(
      `https://api.slotly.io/bookings/availability/${encodeURIComponent(
        slug
      )}?date=${date}&tz=${encodeURIComponent(resolvedViewerTz)}`
    )
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((payload) => {
        const data = payload?.slots ?? [];
        const mapped = data.map((s: any) => ({
          ...s,
          iso: s.iso || `${date}T${s.time}:00`,
        }));
        setSlots(mapped);
        setTimeout(() => {
          if (listRef.current) listRef.current.scrollTop = 0;
        }, 0);
      })
      .catch(() => setError("Failed to load slots"))
      .finally(() => setLoading(false));
  }, [slug, date, resolvedViewerTz, onSelectSlot]);

  if (!date) {
    return (
      <div className={`bg-white rounded-xl p-4 sm:p-6 border shadow-sm ${heightClass}`}>

     
        <p className="text-sm text-gray-500">
          Select a date to see available times
        </p>
      </div>
    );
  }

  return (
   
      <div
        className={`bg-white rounded-xl border shadow-sm ${heightClass} flex flex-col w-full`}
      >

      {/* HEADER */}
     
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">

        <h3 className="font-semibold text-gray-900">Select a time</h3>
        <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
          {resolvedViewerTz}
        </p>

      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto sm:overflow-y-auto px-4 sm:px-6 py-3 sm:py-4"
      >

        {loading && (
          <div className="text-sm text-gray-500">
            Loading times…</div>
        )}

        {error && <div className="text-sm text-red-500">{error}</div>}

        {!loading && slots.length === 0 && (
          <div className="text-sm text-gray-500">
            No available times for this date
          </div>
        )}

        {!loading &&
          ["Morning", "Afternoon", "Evening", "Night"].map((section) => {
            const sectionSlots = grouped[section];
            if (!sectionSlots?.length) return null;

            return (
              <div key={section} className="mb-4 sm:mb-6">

                <div className="text-[11px] sm:text-xs font-semibold text-gray-500 mb-2 sm:mb-3">

                  {section}
                </div>

                <div className="space-y-2 sm:space-y-3">

                  {sectionSlots.map((s: any) => {
                    const selected = selectedSlotISO === s.iso;
                    const disabled = !s.available;

                    return (
                      <button
                        key={s.iso}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && onSelectSlot(s.iso)}
                        className={[
                         
                          "w-full py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition border",

                          selected && !disabled
                            ? "bg-blue-600 text-white border-blue-600"
                            : disabled
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50",
                        ].join(" ")}
                      >
                        {timeLabelInTimeZone(
                          String(s.iso),
                          resolvedViewerTz
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
