"use client";

import { useEffect, useState } from "react";

export default function TimeSlots({
  date,
  duration,
  timezone,
  onSelectTime,
}: {
  date: string | null;
  duration: number;
  timezone: string;
  onSelectTime: (t: string) => void;
}) {
  const [slots, setSlots] = useState<string[]>([]);

  useEffect(() => {
    if (!date) return;

    const loadSlots = async () => {
      const res = await fetch(
        `http://api.slotly.io/booking/slots?date=${date}&duration=${duration}&timezone=${timezone}`
      );
      const data = await res.json();
      setSlots(data.slots || []);
    };

    loadSlots();
  }, [date]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Available Times</h2>

      {!date && <p className="text-gray-500">Select a date first</p>}

      {date && slots.length === 0 && (
        <p className="text-gray-500">No available time slots</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {slots.map((time) => (
          <button
            key={time}
            onClick={() => onSelectTime(time)}
            className="p-2 rounded-lg border hover:bg-blue-50"
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
