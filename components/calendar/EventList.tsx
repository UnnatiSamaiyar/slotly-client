// components/calendar/EventList.tsx
"use client";

import React from "react";
import type { CalendarEvent } from "@/lib/api";

function fmtDateTime(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return iso;
  }
}

export function EventList({ events }: { events: CalendarEvent[] }) {
  if (!events.length) {
    return <div className="text-gray-500">No events found in this range.</div>;
  }

  return (
    <ul className="space-y-3">
      {events.map(ev => (
        <li key={ev.id} className="border rounded-lg p-3 bg-white shadow-sm flex items-start justify-between">
          <div>
            <div className="font-semibold text-sm">{ev.summary || "(no title)"}</div>
            <div className="text-xs text-gray-500">{fmtDateTime(ev.start)} — {fmtDateTime(ev.end)}</div>
            {ev.location && <div className="text-xs text-gray-500 mt-1">📍 {ev.location}</div>}
            {ev.organizer && <div className="text-xs text-gray-400 mt-1">Organizer: {ev.organizer}</div>}
          </div>

          <div className="flex flex-col items-end gap-2">
            {ev.htmlLink && (
              <a href={ev.htmlLink} target="_blank" rel="noreferrer" className="text-xs px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">
                Open in Google
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
