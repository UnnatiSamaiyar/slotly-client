"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function PublicCalendar({
  onSelectDate,
  selectedDate,
  bookingWindow,
}: any) {
  const [cursor, setCursor] = useState(new Date());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const monthLabel = useMemo(
    () =>
      cursor.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      }),
    [cursor]
  );

  /* ---------- MONDAY-FIRST GRID ---------- */
  const firstOfMonth = new Date(year, month, 1);
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
  const startDate = new Date(firstOfMonth);
  startDate.setDate(firstOfMonth.getDate() - mondayOffset);

  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const windowEnabled =
    bookingWindow?.enabled &&
    bookingWindow?.start_date &&
    bookingWindow?.end_date;

  const windowStart = windowEnabled
    ? new Date(`${bookingWindow.start_date}T00:00:00`)
    : null;

  const windowEnd = windowEnabled
    ? new Date(`${bookingWindow.end_date}T23:59:59`)
    : null;

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-5 sm:p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-base font-semibold text-gray-900 tracking-tight">
          {monthLabel}
        </h2>

        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* WEEKDAYS */}
      <div className="grid grid-cols-7 mb-3">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-400"
          >
            {d}
          </div>
        ))}
      </div>

      {/* DAYS GRID */}
      <div className="grid grid-cols-7 gap-y-2">
        {days.map((d, i) => {
          const iso = toISO(d);
          const isCurrentMonth = d.getMonth() === month;
          const isPast = d < today;

          const outOfWindow =
            windowEnabled &&
            ((windowStart && d < windowStart) ||
              (windowEnd && d > windowEnd));

          const disabled = !isCurrentMonth || isPast || outOfWindow;
          const selected = selectedDate === iso;
          const isToday = d.getTime() === today.getTime();

          return (
            <div key={i} className="h-11 flex items-center justify-center">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(iso)}
                className={`
                w-10 h-10
                rounded-full
                flex items-center justify-center
                text-sm font-medium
                transition-all duration-200
                ${disabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-800 hover:bg-indigo-50 hover:scale-105"
                  }
                ${selected
                    ? "bg-indigo-600 text-white shadow-md scale-105"
                    : ""
                  }
                ${!selected && isToday
                    ? "border border-indigo-500 text-indigo-600"
                    : ""
                  }
              `}
              >
                {d.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}