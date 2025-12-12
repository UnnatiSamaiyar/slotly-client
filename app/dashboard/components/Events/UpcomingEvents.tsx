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
    </div>
  );
}
