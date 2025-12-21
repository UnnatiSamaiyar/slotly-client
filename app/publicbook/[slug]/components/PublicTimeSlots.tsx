"use client";

import React, { useEffect, useState } from "react";

export default function PublicTimeSlots({
  slug,
  date,
  onSelectSlot,
  selectedSlotISO,
}: any) {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      )}?date=${date}`
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
      })
      .catch(() => setError("Failed to load slots"))
      .finally(() => setLoading(false));
  }, [slug, date]);

  if (!date) {
    return (
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        Select a date to view times
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      <div className="font-medium mb-2">Available Times</div>

      {loading && <div className="text-sm text-gray-500">Loading…</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {!loading && slots.filter((s) => s.available).length === 0 && (
        <div className="text-sm text-gray-500">No available slots</div>
      )}

      <div className="mt-2 grid grid-cols-3 gap-2">
        {slots
          .filter((s) => s.available) // 🔥 HIDE BOOKED SLOTS
          .map((s: any) => {
            const selected = selectedSlotISO === s.iso;
            return (
              <button
                key={s.iso}
                onClick={() => onSelectSlot(s.iso)}
                className={[
                  "py-2 px-3 rounded-lg text-sm transition",
                  selected
                    ? "bg-indigo-600 text-white"
                    : "bg-white hover:bg-indigo-50 border",
                ].join(" ")}
              >
                {new Date(s.iso).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </button>
            );
          })}
      </div>
    </div>
  );
}
