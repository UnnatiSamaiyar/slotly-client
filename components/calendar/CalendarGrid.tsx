
"use client";

import React, { useEffect, useState } from "react";

type Props = {
  year: number;
  month: number; // 0-based
  eventsByDate: Record<string, number>; // iso_date -> count
  onSelectDate: (iso: string) => void;
  selectedIso?: string;
};

export function CalendarGrid({
  year,
  month,
  eventsByDate,
  onSelectDate,
  selectedIso,
}: Props) {
  const first = new Date(year, month, 1);
  const startWeek = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // instant selection (no delay even if parent updates late)
  const [localSelected, setLocalSelected] = useState<string | undefined>(selectedIso);
  useEffect(() => setLocalSelected(selectedIso), [selectedIso]);

  const cells: React.ReactNode[] = [];

  // pad cells
  for (let i = 0; i < startWeek; i++) {
    cells.push(<div key={"pad-" + i} className="h-14" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = new Date(year, month, d).toISOString().slice(0, 10);
    const count = eventsByDate?.[iso] || 0;
    const isBooked = count > 0;
    const isSelected = localSelected === iso;

    cells.push(
      <button
        key={iso}
        onClick={() => {
          setLocalSelected(iso);
          onSelectDate(iso);
        }}
        aria-pressed={isSelected}
        className={[
          "relative h-14 rounded-xl border text-left px-3",
          "transition-all duration-150",
          "flex items-center justify-between",
          isSelected
            ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg border-transparent"
            : "bg-white hover:bg-gray-50 border-gray-200",
        ].join(" ")}
      >
        <span className={["text-sm font-semibold", isSelected ? "text-white" : "text-gray-900"].join(" ")}>
          {d}
        </span>

        {/* booked indicator */}
        {isBooked ? (
          <span className="flex items-center gap-2">
            <span
              className={[
                "h-2.5 w-2.5 rounded-full",
                isSelected ? "bg-white/90" : "bg-indigo-600",
              ].join(" ")}
            />
            <span
              className={[
                "text-[11px] px-2 py-0.5 rounded-full font-semibold",
                isSelected ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-800",
              ].join(" ")}
            >
              {count}
            </span>
          </span>
        ) : (
          <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
        )}
      </button>
    );
  }

  return (
    <div className="w-full">
      {/* same grid for header + cells -> alignment perfect */}
      <div className="grid grid-cols-7 gap-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((h) => (
          <div
            key={h}
            className="text-center text-sm font-bold text-gray-900 tracking-widest py-3 uppercase"
          >
            {h}
          </div>
        ))}

        {cells}
      </div>
    </div>
  );
}