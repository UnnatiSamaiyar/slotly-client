// "use client";

// import React, { useMemo } from "react";
// import { CalendarEvent } from "../../types";
// import { isSameISODate } from "../Calendar/CalendarHelpers";
// import EventCard from "./EventCard";

// export default function EventList({
//   events,
//   selectedDate,
//   loading,
//   error,
// }: {
//   events: CalendarEvent[];
//   selectedDate: string;
//   loading: boolean;
//   error: string | null;
// }) {
//   const dayEvents = useMemo(() => {
//     return events
//       .filter((ev: any) => isSameISODate(ev.start, selectedDate))
//       .sort((a: any, b: any) => {
//         const ta = a.start ? new Date(a.start).getTime() : 0;
//         const tb = b.start ? new Date(b.start).getTime() : 0;
//         return ta - tb;
//       });
//   }, [events, selectedDate]);

//   if (loading) return <div className="text-sm text-gray-500">Loading events…</div>;
//   if (error) return <div className="text-sm text-red-600">{error}</div>;

//   if (dayEvents.length === 0) {
//     return (
//       <div className="rounded-2xl border border-dashed border-gray-200 p-6 bg-white">
//         <div className="text-sm font-semibold text-slate-900">No meetings on this day</div>
//         <div className="text-sm text-gray-500 mt-1">
//           Try another date, or share your booking link to get scheduled.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {dayEvents.map((ev: any) => (
//         <EventCard
//           key={ev.id}
//           event={ev}
//           variant="timeline"
//           onClick={() => {
//             // later: open event details modal
//             console.log("Clicked event", ev.id);
//           }}
//         />
//       ))}
//     </div>
//   );
// }











"use client";

import React, { useMemo } from "react";
import { CalendarEvent } from "../../types";
import { isSameISODate } from "../Calendar/CalendarHelpers";
import EventCard from "./EventCard";

export default function EventList({
  events,
  selectedDate,
  loading,
  error,

  // ✅ NEW: required for edit/delete
  userSub,
  onChanged,
}: {
  events: CalendarEvent[];
  selectedDate: string;
  loading: boolean;
  error: string | null;

  // ✅ NEW
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

  if (loading) return <div className="text-sm text-gray-500">Loading events…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  if (dayEvents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 p-6 bg-white">
        <div className="text-sm font-semibold text-slate-900">No meetings on this day</div>
        <div className="text-sm text-gray-500 mt-1">
          Try another date, or share your booking link to get scheduled.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {dayEvents.map((ev: any) => (
        <EventCard
          key={ev.id}
          event={ev}
          variant="timeline"
          userSub={userSub}          // ✅ NEW
          onChanged={onChanged}      // ✅ NEW
          onClick={() => {
            // later: open event details modal
            console.log("Clicked event", ev.id);
          }}
        />
      ))}
    </div>
  );
}
