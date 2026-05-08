"use client";

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

export default function CalendarGrid({
  selectedDate,
  setSelectedDate,
  eventsByDate,
}: Props) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date(selectedDate);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  });

  useEffect(() => {
    const d = new Date(selectedDate);
    if (!Number.isNaN(d.getTime())) setCursor(d);
  }, [selectedDate]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const weeks = useMemo(() => {
    const first = new Date(year, month, 1);
    const startDate = new Date(year, month, 1 - first.getDay());
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
    <div
      className="
        flex h-full w-full max-w-full flex-col
        lg:max-w-[940px] xl:max-w-[1020px] 2xl:max-w-[1080px]
        rounded-[24px] border border-slate-200/80
        bg-white
        shadow-[0_18px_50px_rgba(15,23,42,0.06)]
        p-4 sm:p-5
      "
    >
      {/* ── Header ── */}
      <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
        <span className="truncate text-base font-semibold leading-none text-slate-950">
          {monthLabel(cursor)}
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <div className="inline-flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => {
                const d = new Date(cursor);
                d.setMonth(d.getMonth() - 1);
                setCursor(d);
              }}
              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="h-5 w-px bg-slate-200" />

            <button
              type="button"
              aria-label="Next month"
              onClick={() => {
                const d = new Date(cursor);
                d.setMonth(d.getMonth() + 1);
                setCursor(d);
              }}
              className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedDate(todayISO as ISODate);
              setCursor(new Date());
            }}
            className="
              h-9 whitespace-nowrap rounded-2xl
              border border-slate-200 bg-white
              px-4 text-xs font-semibold text-slate-700 shadow-sm
              transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100
            "
          >
            Today
          </button>
        </div>
      </div>

      {/* ── Day-of-week labels ── */}
      <div className="mb-2 grid shrink-0 grid-cols-7 rounded-2xl bg-slate-50/70 px-2 py-1 ring-1 ring-slate-100">
        {["S", "M", "T", "W", "T", "F", "S"].map((label, i) => (
          <div
            key={i}
            className="py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700"
          >
            {label}
          </div>
        ))}
      </div>

      {/* ── Date cells ── */}
      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-y-1">
        {weeks.map((d, idx) => {
          const iso = toISODateLocal(d);
          const inMonth = d.getMonth() === month;
          const isSelected = toISODateLocal(selected) === iso;
          const isToday = iso === todayISO;
          const dayEvents = eventsByDate?.[iso] || [];
          const hasEvents = dayEvents.length > 0;
          const tooltip = hasEvents ? buildDayTooltip(dayEvents, 3) : "";

          return (
            <div
              key={`${iso}-${idx}`}
              className="flex min-h-[38px] items-center justify-center p-[2px] sm:p-[3px]"
            >
              <button
                type="button"
                onClick={() => setSelectedDate(iso as ISODate)}
                title={tooltip}
                aria-label={`Select ${iso}`}
                className={[
                  "relative flex items-center justify-center rounded-full",
                  "aspect-square w-full max-w-[2rem] sm:max-w-[2.25rem] lg:max-w-[2.35rem] 2xl:max-w-[2.75rem]",
                  "text-[11px] font-semibold sm:text-[12px]",
                  "transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-100",
                  inMonth ? "text-slate-800" : "text-slate-300",
                  isSelected
                    ? "border border-indigo-600 bg-indigo-600 text-white shadow-[0_10px_24px_rgba(79,70,229,0.28)]"
                    : [
                        "border border-transparent",
                        inMonth
                          ? "hover:border-indigo-100 hover:bg-indigo-50/80 hover:text-indigo-700"
                          : "hover:bg-slate-50/80",
                      ].join(" "),
                ].join(" ")}
              >
                {d.getDate()}

                {isToday && !isSelected && (
                  <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-indigo-400/40" />
                )}

                {hasEvents && (
                  <span
                    className={[
                      "absolute bottom-[4px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                      isSelected ? "bg-white" : "bg-indigo-500",
                    ].join(" ")}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}