"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function toLocalISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function PublicCalendar({ onSelectDate, selectedDate, bookingWindow }: any) {
  const [cursor, setCursor] = useState<Date>(new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const monthName = useMemo(
    () => cursor.toLocaleString(undefined, { month: "long", year: "numeric" }),
    [cursor]
  );

  const weeks: Date[] = [];
  const first = new Date(year, month, 1);
  const firstDay = first.getDay();

  const startDate = new Date(year, month, 1 - firstDay);
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    weeks.push(d);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const windowEnabled = Boolean(bookingWindow?.enabled && bookingWindow?.start_date && bookingWindow?.end_date);
  const windowStart = windowEnabled ? new Date(`${bookingWindow.start_date}T00:00:00`) : null;
  const windowEnd = windowEnabled ? new Date(`${bookingWindow.end_date}T23:59:59`) : null;

  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold">{monthName}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const n = new Date(cursor);
              n.setMonth(cursor.getMonth() - 1);
              setCursor(n);
            }}
            className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              const n = new Date(cursor);
              n.setMonth(cursor.getMonth() + 1);
              setCursor(n);
            }}
            className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {windowEnabled && (
        <div className="mb-3 text-xs text-gray-500">
          Available dates: <span className="font-medium">{bookingWindow.start_date}</span> to{" "}
          <span className="font-medium">{bookingWindow.end_date}</span>
        </div>
      )}

      <div className="grid grid-cols-7 gap-2 text-sm text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-xs text-gray-500">
            {d}
          </div>
        ))}

        {weeks.map((d, idx) => {
          // ✅ FIX: local YYYY-MM-DD (no UTC shift)
          const iso = toLocalISODate(d);

          const isCurrentMonth = d.getMonth() === month;
          const isPast = d < today;
          const outOfWindow = windowEnabled && ((windowStart && d < windowStart) || (windowEnd && d > windowEnd)) ? true : false;
          const selected = selectedDate === iso;

          return (
            <button
              key={idx}
              type="button"
              disabled={!isCurrentMonth || isPast || outOfWindow}
              onClick={() => onSelectDate(iso)}
              className={[
                "px-2 py-3 rounded-lg text-sm transition border",
                !isCurrentMonth || isPast || outOfWindow
                  ? "text-gray-300 border-transparent cursor-not-allowed"
                  : "hover:bg-indigo-50 border-transparent",
                selected ? "bg-indigo-600 text-white border-indigo-600" : "bg-white",
              ].join(" ")}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
