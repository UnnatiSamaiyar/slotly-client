<<<<<<< HEAD
// // src/app/dashboard/components/Events/EventCard.tsx
// "use client";
// import React from "react";
// import { motion } from "framer-motion";
// import { CalendarEvent } from "../../types";
// import { formatEventDate } from "../Calendar/CalendarHelpers";
// import { CheckCircle } from "lucide-react";

// export default function EventCard({ event }: { event: CalendarEvent }) {
//   return (
//     <motion.div layout initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white">
//       <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center"><CheckCircle className="w-5 h-5" /></div>
//       <div className="flex-1">
//         <div className="flex items-center justify-between">
//           <div className="font-semibold">{event.summary}</div>
//           {/* <div className="text-sm text-gray-400">{formatEventDate(event.start)}</div> */}

//           <div className="text-sm text-gray-400">
//   {event.start ? new Date(event.start).toLocaleString() : ""}
// </div>

//         </div>
//         <div className="text-sm text-gray-500">{event.location}</div>
//         {event.htmlLink && <a href={event.htmlLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600">Open in Google Calendar</a>}
//       </div>
//     </motion.div>
//   );
// }










//@ts-nocheck
// src/app/dashboard/components/Events/EventCard.tsx
=======
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
"use client";

import React from "react";
import { CalendarEvent } from "../../types";
<<<<<<< HEAD

export default function EventCard({ event }: { event: CalendarEvent }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white hover:bg-gray-50 cursor-pointer">
      <div className="font-semibold text-sm">{event.summary}</div>
      <div className="text-sm text-gray-500">
  {events.filter(e => isSameISODate(e.start, selectedDate)).length} events
</div>
      <div className="text-xs text-blue-500 underline mt-2">
        <a href={event.htmlLink} target="_blank">Open in Google Calendar</a>
=======
import { Clock, MapPin, ExternalLink, Users } from "lucide-react";

function safeDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function fmtTime(iso?: string) {
  const d = safeDate(iso);
  if (!d) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type Props = {
  event: CalendarEvent;
  onClick?: () => void;
  variant?: "timeline" | "card";
};

export default function EventCard({
  event,
  onClick,
  variant = "timeline",
}: Props) {
  const startISO = event.start || undefined;
  const endISO = event.end || undefined;

  const summary = event.summary || "Untitled";
  const organizer = event.organizer || "";
  const location = event.location || "";
  const htmlLink = event.htmlLink || "";
  const meetLink = event.meetLink || null;
  const attendees = event.attendees || [];

  const startT = fmtTime(startISO);
  const endT = fmtTime(endISO);

  const visibleAttendees = attendees.slice(0, 2);
  const remaining = attendees.length - visibleAttendees.length;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow transition p-4 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Time */}
        <div className="w-24 shrink-0">
          <div className="text-sm font-semibold text-slate-900">
            {startT || "—"}
          </div>
          <div className="text-xs text-gray-500">
            {endT ? `to ${endT}` : ""}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{summary}</div>
              <div className="text-xs text-gray-500 mt-1 truncate">
                {organizer}
              </div>
            </div>

            {location ? (
              <span className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-600 inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
            ) : null}
          </div>

          {/* ACTION ROW */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {meetLink && (
              <a
                href={meetLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-1"
              >
                Join Meet <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {htmlLink && (
              <a
                href={htmlLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1"
              >
                Open Calendar <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* PARTICIPANTS */}
          {attendees.length > 0 && (
            <div className="mt-3 text-xs text-gray-600">
              <div className="flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5" />
                Participants
              </div>

              <div className="flex flex-wrap gap-2">
                {visibleAttendees.map((email) => (
                  <span
                    key={email}
                    className="px-2 py-0.5 rounded-full bg-gray-100 border text-gray-700"
                  >
                    {email}
                  </span>
                ))}
                {remaining > 0 && (
                  <span className="text-gray-500">
                    +{remaining} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
      </div>
    </div>
  );
}
