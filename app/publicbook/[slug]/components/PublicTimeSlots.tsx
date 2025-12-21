"use client";

import React, { useEffect, useState } from "react";

/**
 * props:
 *  - slug
 *  - date (YYYY-MM-DD)
 *  - onSelectSlot(ISO)
 *  - selectedSlotISO
 */
export default function PublicTimeSlots({ slug, date, onSelectSlot, selectedSlotISO }: any) {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8000/bookings/availability/${encodeURIComponent(slug)}?date=${date}`)
      .then((r) => r.json())
      .then((payload) => {
        // Expecting payload.slots array like [{time: "09:00", available: true}]
        const data = payload?.slots ?? payload;
        if (Array.isArray(data)) {
          // convert to ISO using date + time
          const mapped = data.map((s: any) => {
            // s.time might be "09:00"
            const iso = (s.iso) ? s.iso : `${date}T${(s.time || "00:00")}:00`;
            return { ...s, iso };
          });
          setSlots(mapped);
        } else {
          setSlots([]);
        }
      })
      .catch((e) => setError("Failed to load slots"))
      .finally(() => setLoading(false));
  }, [slug, date]);

  if (!date) return <div className="bg-white rounded-lg p-4 border shadow-sm">Select a date to view times</div>;

  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      <div className="font-medium mb-2">Available Times</div>
      {loading && <div className="text-sm text-gray-500">Loading times…</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {!loading && slots.length === 0 && <div className="text-sm text-gray-500 mt-2">No available times on this date.</div>}

      <div className="mt-2 grid grid-cols-3 gap-2">
        {slots.map((s: any, i: number) => {
          const isAvailable = !!s.available;
          const selected = selectedSlotISO === s.iso;
          return (
            <button
              key={i}
              onClick={() => isAvailable && onSelectSlot(s.iso)}
              disabled={!isAvailable}
              className={[
                "py-2 px-3 rounded-lg text-sm transition",
                !isAvailable ? "bg-gray-100 text-gray-400 cursor-not-allowed" : (selected ? "bg-indigo-600 text-white" : "bg-white hover:bg-indigo-50")
              ].join(" ")}
            >
              {new Date(s.iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </button>
          );
        })}
      </div>
    </div>
  );
}
