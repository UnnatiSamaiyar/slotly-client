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
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
}

function sectionForHour(h: number) {
  if (h >= 0 && h < 6) return "Night";
  if (h >= 6 && h < 12) return "Morning";
  if (h >= 12 && h < 18) return "Afternoon";
  return "Evening";
}

export default function PublicTimeSlots({
  slug,
  date,
  onSelectSlot,
  selectedSlotISO,
  viewerTz,
  heightClass = "h-[520px]",
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
      try {
        const hr = hourInTimeZone(String(s.iso || ""), resolvedViewerTz);
        g[sectionForHour(hr)].push(s);
      } catch {
        g.Morning.push(s);
      }
    }
    return g;
  }, [slots, resolvedViewerTz]);

  function scrollToSection(section: string) {
    const el = document.getElementById(`slot-sec-${section}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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

        if (selectedSlotISO) {
          const sel = mapped.find((x: any) => x.iso === selectedSlotISO);
          if (!sel || !sel.available) onSelectSlot(null);
        }

        setTimeout(() => {
          if (listRef.current) listRef.current.scrollTop = 0;
        }, 0);
      })
      .catch(() => setError("Failed to load slots"))
      .finally(() => setLoading(false));
  }, [slug, date, resolvedViewerTz, selectedSlotISO, onSelectSlot]);

  if (!date) {
    return (
      <div className={`bg-white rounded-xl p-4 border shadow-sm ${heightClass}`}>
        Select a date to view times
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border shadow-sm ${heightClass} flex flex-col`}>
      {/* Header stays fixed */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="font-semibold">Available Times</div>
        <div className="text-xs text-gray-500">{resolvedViewerTz}</div>
      </div>

      {/* Chips stays fixed */}
      <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2">
        {["Night", "Morning", "Afternoon", "Evening"].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => scrollToSection(k)}
            className="px-3 py-1.5 rounded-full border text-xs hover:bg-gray-50 transition"
          >
            {k}
          </button>
        ))}
      </div>

      {/* Scroll area */}
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        {loading && <div className="text-sm text-gray-500">Loading…</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}

        {!loading && slots.length === 0 && (
          <div className="text-sm text-gray-500">No slots for this day</div>
        )}

        {!loading && slots.length > 0 && (
          <div className="space-y-4">
            {["Night", "Morning", "Afternoon", "Evening"].map((section) => (
              <div key={section} id={`slot-sec-${section}`}>
                <div className="text-xs font-semibold text-gray-500 mb-2">{section}</div>

                <div className="grid grid-cols-3 gap-2">
                  {(grouped?.[section] || []).map((s: any) => {
                    const selected = selectedSlotISO === s.iso;
                    const disabled = !s.available;

                    return (
                      <button
                        key={s.iso}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && onSelectSlot(s.iso)}
                        className={[
                          "py-2 px-3 rounded-lg text-sm transition border",
                          selected && !disabled
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : disabled
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-80"
                            : "bg-white hover:bg-indigo-50 border-gray-200",
                        ].join(" ")}
                        title={disabled ? "Already booked" : "Select this time"}
                      >
                        {timeLabelInTimeZone(String(s.iso), resolvedViewerTz)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
