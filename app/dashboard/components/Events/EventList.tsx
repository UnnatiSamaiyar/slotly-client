"use client";

import React, { useMemo } from "react";
import { CalendarEvent } from "../../types";
import { isSameISODate } from "../Calendar/CalendarHelpers";
import EventCard from "./EventCard";

function prettyDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EventList({
  events,
  selectedDate,
  loading,
  error,
  userSub,
  onChanged,
}: {
  events: CalendarEvent[];
  selectedDate: string;
  loading: boolean;
  error: string | null;
  userSub?: string;
  onChanged?: () => void;
}) {
  const dayEvents = useMemo(() => {
    return events
      .filter((ev: any) => isSameISODate(ev.start, selectedDate))
      .sort((a: any, b: any) => {
        const ta = a.start ? new Date(a.start).getTime() : 0;
        const tb = b.start ? new Date(b.start).getTime() : 0;
        return ta - tb;
      });
  }, [events, selectedDate]);

  const count = dayEvents.length;

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
          <div className="h-7 w-16 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">
        <div className="text-sm font-semibold text-red-700">Couldn’t load events</div>
        <div className="mt-1 text-sm text-red-600 break-words">{error}</div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">No meetings scheduled</div>
            <div className="text-xs text-gray-500 mt-0.5 truncate">{prettyDate(selectedDate)}</div>
          </div>
          <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            0
          </span>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
          <div className="text-sm font-semibold text-slate-900">Nothing for this day</div>
          <div className="text-sm text-gray-600 mt-1 leading-relaxed">
            Try another date, or share your booking link to get scheduled.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">Meetings</div>
          <div className="text-xs text-gray-500 mt-0.5 truncate">{prettyDate(selectedDate)}</div>
        </div>

        <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {count} {count === 1 ? "event" : "events"}
        </span>
      </div>

      {/* List (timeline feel) */}
      <div className="relative">
        {/* subtle rail (desktop only) */}
        <div className="hidden sm:block absolute left-[18px] top-1 bottom-1 w-px bg-gray-100" />

        <div className="space-y-2 sm:space-y-3">
          {dayEvents.map((ev: any) => (
            <div key={ev.id} className="relative min-w-0">
              {/* dot (desktop only) */}
              <div className="hidden sm:block absolute left-[12px] top-6 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-white" />
              <div className="sm:pl-10">
                <EventCard
                  event={ev}
                  variant="timeline"
                  userSub={userSub}
                  onChanged={onChanged}
                  onClick={() => {
                    console.log("Clicked event", ev.id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer helper */}
      <div className="mt-4 text-[12px] text-gray-500">
        Tip: use the search bar to filter by title, organizer, or location.
      </div>
    </div>
  );
}
