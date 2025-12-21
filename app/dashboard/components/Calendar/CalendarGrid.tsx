// src/app/dashboard/components/Calendar/CalendarGrid.tsx
"use client";
<<<<<<< HEAD
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
=======

import React, { useEffect, useMemo, useState } from "react";
import { ISODate } from "../../types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildDayTooltip, toISODateLocal } from "./CalendarHelpers";

type Props = {
  selectedDate: ISODate;
  setSelectedDate: (d: ISODate) => void;
  eventsByDate: Record<string, any[]>;
};

function monthLabel(d: Date) {
  return d.toLocaleString([], { month: "long", year: "numeric" });
}

export default function CalendarGrid({ selectedDate, setSelectedDate, eventsByDate }: Props) {
  // Cursor controls which month we’re viewing
  const [cursor, setCursor] = useState(() => {
    const d = new Date(selectedDate);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  });

  // When selectedDate changes externally, keep cursor aligned to that month
  useEffect(() => {
    const d = new Date(selectedDate);
    if (!Number.isNaN(d.getTime())) setCursor(d);
  }, [selectedDate]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const weeks = useMemo(() => {
    const first = new Date(year, month, 1);
    const firstDay = first.getDay(); // 0..6 Sun..Sat
    const startDate = new Date(year, month, 1 - firstDay);

    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      cells.push(d);
    }
    return cells;
  }, [year, month]);

  const selected = useMemo(() => new Date(selectedDate), [selectedDate]);

  const todayISO = useMemo(() => toISODateLocal(new Date()), []);

  return (
    <div>
      {/* Month header + controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-slate-900">{monthLabel(cursor)}</div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const d = new Date(cursor);
              d.setMonth(d.getMonth() - 1);
              setCursor(d);
            }}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
            aria-label="Previous month"
            type="button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const d = new Date(cursor);
              d.setMonth(d.getMonth() + 1);
              setCursor(d);
            }}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
            aria-label="Next month"
            type="button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setSelectedDate(todayISO as ISODate);
              setCursor(new Date());
            }}
            className="ml-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm"
            type="button"
          >
            Today
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-xs font-medium text-gray-500 text-center py-2"
          >
            {d}
          </div>
        ))}

        {/* Cells */}
        {weeks.map((d, idx) => {
          const iso = toISODateLocal(d);
          const inMonth = d.getMonth() === month;
          const isSelected = toISODateLocal(selected) === iso;
          const isToday = iso === todayISO;

          const dayEvents = eventsByDate?.[iso] || [];
          const hasEvents = dayEvents.length > 0;

          const tooltip = hasEvents ? buildDayTooltip(dayEvents, 3) : "";

          return (
            <button
              key={`${iso}-${idx}`}
              onClick={() => setSelectedDate(iso as ISODate)}
              title={tooltip}
              type="button"
              className={[
                "relative p-2 rounded-xl text-center transition border",
                inMonth ? "bg-white" : "bg-gray-50",
                inMonth ? "border-gray-100" : "border-gray-100",
                isSelected ? "ring-2 ring-indigo-500 border-indigo-200" : "hover:bg-indigo-50",
                !inMonth ? "text-gray-400" : "text-slate-800",
              ].join(" ")}
              aria-label={`Select ${iso}`}
            >
              {/* Day number */}
              <div className={["text-sm", isSelected ? "font-semibold" : ""].join(" ")}>
                {d.getDate()}
              </div>

              {/* Today small indicator */}
              {isToday ? (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600" />
              ) : null}

              {/* Event indicator */}
              {hasEvents ? (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-1">
                  <span className="block w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  {dayEvents.length > 1 ? (
                    <span className="text-[10px] text-gray-500">{dayEvents.length}</span>
                  ) : null}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
    </div>
  );
}
