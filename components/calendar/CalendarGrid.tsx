// components/calendar/CalendarGrid.tsx
"use client";

import React from "react";

type Props = {
  year: number;
  month: number; // 0-based
  eventsByDate: Record<string, number>; // iso_date -> count
  onSelectDate: (iso: string) => void;
  selectedIso?: string;
};

function toIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function CalendarGrid({ year, month, eventsByDate, onSelectDate, selectedIso }: Props) {
  const first = new Date(year, month, 1);
  const startWeek = first.getDay(); // 0-6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < startWeek; i++) cells.push(<div key={"pad-" + i} className="p-2" />);

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = new Date(year, month, d).toISOString().slice(0, 10);
    const count = eventsByDate[iso] || 0;
    const isSelected = selectedIso === iso;
    cells.push(
      <button
        key={iso}
        onClick={() => onSelectDate(iso)}
        className={`p-2 rounded-lg text-center hover:bg-blue-50 transition-colors ${isSelected ? "ring-2 ring-blue-400 bg-blue-50" : ""}`}
        aria-pressed={isSelected}
      >
        <div className="text-sm">{d}</div>
        {count > 0 && <div className="mt-1 text-xs font-medium text-white inline-block px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">{count}</div>}
      </button>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-2 text-xs">
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(h => <div key={h} className="text-center text-xs font-medium text-gray-500 py-2">{h}</div>)}
      {cells}
    </div>
  );
}
