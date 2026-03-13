// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { CalendarEvent } from "../../types";
// import { CalendarDays, Clock, ExternalLink } from "lucide-react";
// import { safeDate } from "../Calendar/CalendarHelpers";
// import { getPreferredTimezone, subscribeTimezoneChange } from "@/lib/timezone";

// function fmtStart(iso?: string, tz?: string) {
//   const d = safeDate(iso);
//   if (!d) return "";

//   // If tz not provided, fallback to browser default behavior
//   if (!tz) {
//     return d.toLocaleString([], {
//       day: "2-digit",
//       month: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   }

//   return new Intl.DateTimeFormat(undefined, {
//     timeZone: tz,
//     day: "2-digit",
//     month: "short",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   }).format(d);
// }

// export default function UpcomingEvents({
//   events,
//   selectedDate,
// }: {
//   events: CalendarEvent[];
//   selectedDate?: string;
// }) {
//   // ✅ Reactively track timezone preference (localStorage + event)
//   const [tz, setTz] = useState<string>(() => getPreferredTimezone());

//   useEffect(() => {
//     return subscribeTimezoneChange(() => setTz(getPreferredTimezone()));
//   }, []);

//   const next = useMemo(() => {
//     const selectedDayStart = selectedDate
//       ? new Date(`${selectedDate}T00:00:00`)
//       : null;

//     return events
//       .filter((ev: any) => {
//         if (!ev?.start) return false;

//         const start = safeDate(ev.start);
//         if (!start) return false;

//         // If user clicked a date, upcoming starts from that date (not “now”)
//         if (selectedDayStart) {
//           return start.getTime() >= selectedDayStart.getTime();
//         }

//         // Otherwise upcoming from now
//         return new Date(ev.end || ev.start).getTime() >= Date.now();
//       })
//       .sort((a: any, b: any) => {
//         const ta = a?.start ? new Date(a.start).getTime() : 0;
//         const tb = b?.start ? new Date(b.start).getTime() : 0;
//         return ta - tb;
//       })
//       .slice(0, 6);
//   }, [events, selectedDate]);

//   const headerLabel = selectedDate ? `Upcoming from ${selectedDate}` : "Upcoming";

//   return (
//     <section
//       aria-label="Upcoming events"
//       className="bg-white rounded-2xl border border-gray-100 shadow-sm"
//     >
//       <div className="p-4 sm:p-6">
//         <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
//           <div className="flex items-center gap-2 min-w-0">
//             <CalendarDays className="w-4 h-4 text-slate-700 shrink-0" />
//             <h4 className="font-semibold truncate">{headerLabel}</h4>
//           </div>
//           <div className="text-xs text-gray-500 shrink-0">{next.length} shown</div>
//         </div>

//         {next.length === 0 ? (
//           <div className="rounded-xl border border-dashed border-gray-200 p-4 bg-white">
//             <div className="text-sm font-semibold text-slate-900">
//               No upcoming events
//             </div>
//             <div className="text-sm text-gray-500 mt-1">
//               Share your booking link to start getting meetings.
//             </div>
//           </div>
//         ) : (
//           <ul className="space-y-3">
//             {next.map((ev: any, idx: number) => {
//               const summary = ev?.summary || "Untitled";
//               const startLabel = fmtStart(ev?.start, tz); // ✅ timezone-aware
//               const organizer = ev?.organizer || "";
//               const htmlLink = ev?.htmlLink || "";

//               return (
//                 <li
//                   key={ev?.id ?? `${ev?.start ?? "no-start"}-${idx}`}
//                   className="p-3 sm:p-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                       <div className="text-sm font-semibold truncate">{summary}</div>

//                       <div className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
//                         {startLabel ? (
//                           <span className="inline-flex items-center gap-1">
//                             <Clock className="w-3.5 h-3.5 shrink-0" />
//                             <span className="whitespace-nowrap">{startLabel}</span>
//                           </span>
//                         ) : null}

//                         {organizer ? (
//                           <span className="truncate">• {organizer}</span>
//                         ) : null}
//                       </div>
//                     </div>

//                     {htmlLink ? (
//                       <a
//                         className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1 shrink-0"
//                         href={htmlLink}
//                         target="_blank"
//                         rel="noreferrer"
//                         aria-label={`Open event: ${summary}`}
//                         title="Open in calendar"
//                       >
//                         <span className="hidden sm:inline">Open</span>
//                         <ExternalLink className="w-3.5 h-3.5" />
//                       </a>
//                     ) : null}
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

type Props = {
  events: any[];
  selectedDate?: string;
};

function formatDateTime(value?: string) {
  if (!value) return { date: "-", time: "-" };

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { date: "-", time: "-" };

  return {
    date: d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }),
    time: d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default function UpcomingEvents({ events = [] }: Props) {
  const router = useRouter();

  const latestEvents = useMemo(() => {
    const now = Date.now();

    return [...(events || [])]
      .filter((e: any) => {
        const t = new Date(e?.start).getTime();
        return Number.isFinite(t) && t >= now;
      })
      .sort((a: any, b: any) => {
        const aTime = new Date(a?.start).getTime();
        const bTime = new Date(b?.start).getTime();
        return aTime - bTime;
      })
      .slice(0, 3);
  }, [events]);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="truncate text-[17px] font-semibold text-slate-900">
                Upcoming Events
              </h4>
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 text-[11px] font-medium text-slate-600">
                {latestEvents.length}
              </span>
            </div>
            <div className="mt-0.5 text-sm text-slate-500">
              Your next scheduled meetings.
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {latestEvents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                No upcoming events
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Share your booking link to start getting meetings.
              </div>
            </div>
          ) : (
            latestEvents.map((event: any, idx: number) => {
              const title = event?.title || event?.summary || "Untitled meeting";
              const location = event?.location || event?.meeting_platform || "";
              const { date, time } = formatDateTime(event?.start);

              return (
                <div
                  key={event?.id || `${title}-${idx}`}
                  className="rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {title}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                    <span>{date}</span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>{time}</span>
                  </div>

                  {location ? (
                    <div className="mt-1 truncate text-xs text-slate-500">
                      {location}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/event-types?tab=meetings")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            View all
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
}