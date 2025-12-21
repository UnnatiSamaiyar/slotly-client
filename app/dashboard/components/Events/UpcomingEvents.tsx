<<<<<<< HEAD
// // src/app/dashboard/components/Events/UpcomingEvents.tsx
// "use client";
// import React from "react";
// import { CalendarEvent } from "../../types";
// import { formatEventDate } from "../Calendar/CalendarHelpers";

// export default function UpcomingEvents({ events }: { events: CalendarEvent[] }) {
//   return (
//     <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//       <h4 className="font-semibold mb-3">Upcoming</h4>
//       <ul className="space-y-3">
//         {events.slice(0, 4).map(ev => (
//           <li key={ev.id} className="flex items-start gap-3">
//             <div className="w-2 h-10 rounded bg-gradient-to-b from-blue-400 to-indigo-500" />
//             <div className="flex-1">
//               <div className="text-sm font-semibold">{ev.summary}</div>
//               <div className="text-xs text-gray-500">{formatEventDate(ev.start)} • {ev.organizer}</div>
//             </div>
//             <div className="text-sm text-gray-400">{ev.location}</div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }









// src/app/dashboard/components/Events/UpcomingEvents.tsx
"use client";
import React from "react";
import { CalendarEvent } from "../../types";

export default function UpcomingEvents({ events }: { events: CalendarEvent[] }) {
  
  // --- FILTER + SORT UPCOMING EVENTS ---
  const next = events
    .filter(ev => {
      if (!ev.start) return false;
      // keep events that are not already finished
      return new Date(ev.end || ev.start).getTime() >= Date.now();
    })
    .sort((a, b) => {
      const ta = a.start ? new Date(a.start).getTime() : 0;
      const tb = b.start ? new Date(b.start).getTime() : 0;
      return ta - tb;
    })
    .slice(0, 4); // only show first 4
  
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h4 className="font-semibold mb-3">Upcoming</h4>

      {next.length === 0 && (
        <div className="text-sm text-gray-500">No upcoming events</div>
      )}

      <ul className="space-y-3">
        {next.map(ev => (
          <li key={ev.id} className="flex items-start gap-3">
            <div className="w-2 h-10 rounded bg-gradient-to-b from-blue-400 to-indigo-500" />
            <div className="flex-1">
              <div className="text-sm font-semibold">{ev.summary}</div>
              <div className="text-xs text-gray-500">
                {ev.start ? new Date(ev.start).toLocaleString() : ""} • {ev.organizer}
              </div>
            </div>
            <div className="text-sm text-gray-400">{ev.location}</div>
          </li>
        ))}
      </ul>
=======
"use client";

import React, { useMemo } from "react";
import { CalendarEvent } from "../../types";
import { CalendarDays, Clock, ExternalLink } from "lucide-react";
import { safeDate, toISODateLocal } from "../Calendar/CalendarHelpers";

function fmtStart(iso?: string) {
  const d = safeDate(iso);
  if (!d) return "";
  return d.toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UpcomingEvents({
  events,
  selectedDate,
}: {
  events: CalendarEvent[];
  selectedDate?: string;
}) {
  const next = useMemo(() => {
    const selectedDayStart = selectedDate
      ? new Date(`${selectedDate}T00:00:00`)
      : null;

    return events
      .filter((ev: any) => {
        if (!ev.start) return false;

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
        const ta = a.start ? new Date(a.start).getTime() : 0;
        const tb = b.start ? new Date(b.start).getTime() : 0;
        return ta - tb;
      })
      .slice(0, 6);
  }, [events, selectedDate]);

  const headerLabel = selectedDate
    ? `Upcoming from ${selectedDate}`
    : "Upcoming";

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-slate-700" />
          <h4 className="font-semibold">{headerLabel}</h4>
        </div>
        <div className="text-xs text-gray-500">{next.length} shown</div>
      </div>

      {next.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-4 bg-white">
          <div className="text-sm font-semibold text-slate-900">No upcoming events</div>
          <div className="text-sm text-gray-500 mt-1">
            Share your booking link to start getting meetings.
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {next.map((ev: any) => {
            const summary = ev.summary || "Untitled";
            const startLabel = fmtStart(ev.start);
            const organizer = ev.organizer || "";
            const htmlLink = ev.htmlLink || "";

            return (
              <li
                key={ev.id}
                className="p-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{summary}</div>
                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-2">
                      {startLabel ? (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {startLabel}
                        </span>
                      ) : null}
                      {organizer ? <span className="truncate">• {organizer}</span> : null}
                    </div>
                  </div>

                  {htmlLink ? (
                    <a
                      className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                      href={htmlLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
    </div>
  );
}
