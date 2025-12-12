// src/app/dashboard/components/Calendar/CalendarGrid.tsx
"use client";
import React from "react";
import { ISODate } from "../../types";

export default function CalendarGrid({ selectedDate, setSelectedDate, eventsByDate }: { selectedDate: ISODate; setSelectedDate: (d: ISODate) => void; eventsByDate: Record<string, any[]> }) {
  const date = new Date(selectedDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const startWeek = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: React.ReactNode[] = [];

  for (let i = 0; i < startWeek; i++) cells.push(<div key={`pad-${i}`} className="p-2" />);

  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(year, month, d);
    const iso = `${thisDate.getFullYear()}-${String(thisDate.getMonth() + 1).padStart(2, "0")}-${String(thisDate.getDate()).padStart(2, "0")}`;
    const hasEvents = !!eventsByDate[iso] && eventsByDate[iso].length > 0;
    const isSelected = iso === selectedDate;
    cells.push(
      <button key={iso} onClick={() => setSelectedDate(iso)} className={`p-2 rounded-lg text-center relative ${isSelected ? "bg-blue-50" : "hover:bg-blue-50"}`} aria-label={`Select ${iso}`}>
        <div className={`text-sm ${isSelected ? "font-semibold text-slate-900" : "text-slate-700"}`}>{d}</div>
        {hasEvents && (<div className="absolute left-1/2 -translate-x-1/2 bottom-2"><span className="block w-2.5 h-2.5 rounded-full bg-blue-600" /></div>)}
      </button>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-2 text-sm">
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
        <div key={d} className="text-xs font-medium text-gray-500 text-center py-2">{d}</div>
      ))}
      {cells}
    </div>
  );
}
