"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CalendarEvent } from "../../types";
import { CalendarDays, Clock, ExternalLink } from "lucide-react";
import { safeDate } from "../Calendar/CalendarHelpers";
import { getPreferredTimezone, subscribeTimezoneChange } from "@/lib/timezone";

function fmtStart(iso?: string, tz?: string) {
  const d = safeDate(iso);
  if (!d) return "";

  // If tz not provided, fallback to browser default behavior
  if (!tz) {
    return d.toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return new Intl.DateTimeFormat(undefined, {
    timeZone: tz,
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export default function UpcomingEvents({
  events,
  selectedDate,
}: {
  events: CalendarEvent[];
  selectedDate?: string;
}) {
  // ✅ Reactively track timezone preference (localStorage + event)
  const [tz, setTz] = useState<string>(() => getPreferredTimezone());

  useEffect(() => {
    return subscribeTimezoneChange(() => setTz(getPreferredTimezone()));
  }, []);

  const next = useMemo(() => {
    const selectedDayStart = selectedDate
      ? new Date(`${selectedDate}T00:00:00`)
      : null;

    return events
      .filter((ev: any) => {
        if (!ev?.start) return false;

        const start = safeDate(ev.start);
        if (!start) return false;

        // If user clicked a date, upcoming starts from that date (not “now”)
        if (selectedDayStart) {
          return start.getTime() >= selectedDayStart.getTime();
        }

        // Otherwise upcoming from now
        return new Date(ev.end || ev.start).getTime() >= Date.now();
      })
      .sort((a: any, b: any) => {
        const ta = a?.start ? new Date(a.start).getTime() : 0;
        const tb = b?.start ? new Date(b.start).getTime() : 0;
        return ta - tb;
      })
      .slice(0, 6);
  }, [events, selectedDate]);

  const headerLabel = selectedDate ? `Upcoming from ${selectedDate}` : "Upcoming";

  return (
    <section
      aria-label="Upcoming events"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <CalendarDays className="w-4 h-4 text-slate-700 shrink-0" />
            <h4 className="font-semibold truncate">{headerLabel}</h4>
          </div>
          <div className="text-xs text-gray-500 shrink-0">{next.length} shown</div>
        </div>

        {next.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-4 bg-white">
            <div className="text-sm font-semibold text-slate-900">
              No upcoming events
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Share your booking link to start getting meetings.
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {next.map((ev: any, idx: number) => {
              const summary = ev?.summary || "Untitled";
              const startLabel = fmtStart(ev?.start, tz); // ✅ timezone-aware
              const organizer = ev?.organizer || "";
              const htmlLink = ev?.htmlLink || "";

              return (
                <li
                  key={ev?.id ?? `${ev?.start ?? "no-start"}-${idx}`}
                  className="p-3 sm:p-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{summary}</div>

                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                        {startLabel ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span className="whitespace-nowrap">{startLabel}</span>
                          </span>
                        ) : null}

                        {organizer ? (
                          <span className="truncate">• {organizer}</span>
                        ) : null}
                      </div>
                    </div>

                    {htmlLink ? (
                      <a
                        className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1 shrink-0"
                        href={htmlLink}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open event: ${summary}`}
                        title="Open in calendar"
                      >
                        <span className="hidden sm:inline">Open</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
