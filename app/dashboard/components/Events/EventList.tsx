<<<<<<< HEAD
// // src/app/dashboard/components/Events/EventList.tsx
// "use client";
// import React from "react";
// import EventCard from "./EventCard";
// import { CalendarEvent } from "../../types";
// import { isSameISODate } from "../Calendar/CalendarHelpers";

// export default function EventList({ events, selectedDate, loading, error }: { events: CalendarEvent[]; selectedDate: string; loading: boolean; error: string | null }) {
//   const todays = events.filter(e => isSameISODate(e.start, selectedDate));
//   return (
//     <div className="space-y-4">
//       {loading && <div className="text-gray-500">Loading events…</div>}
//       {error && <div className="text-red-600">{error}</div>}
//       {!loading && !error && events.length === 0 && <div className="text-gray-500">No events found. Connect your calendar or create events.</div>}
//       {todays.map(ev => <EventCard key={ev.id} event={ev} />)}
//     </div>
//   );
// }











// src/app/dashboard/components/Events/EventList.tsx
"use client";
import React from "react";
import { CalendarEvent } from "../../types";
import { isSameISODate } from "../Calendar/CalendarHelpers";
=======
"use client";

import React, { useMemo } from "react";
import { CalendarEvent } from "../../types";
import { isSameISODate } from "../Calendar/CalendarHelpers";
import EventCard from "./EventCard";
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)

export default function EventList({
  events,
  selectedDate,
  loading,
<<<<<<< HEAD
  error
=======
  error,
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
}: {
  events: CalendarEvent[];
  selectedDate: string;
  loading: boolean;
  error: string | null;
}) {
<<<<<<< HEAD
  
  if (loading) return <div className="text-gray-500">Loading events...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const todaysEvents = events.filter(ev =>
    isSameISODate(ev.start, selectedDate)
  );

  if (todaysEvents.length === 0) {
    return <div className="text-gray-500 text-sm">No events today.</div>;
  }

  return (
    <ul className="space-y-3">
      {todaysEvents.map(ev => (
        <li key={ev.id} className="p-3 border rounded-lg shadow-sm bg-gray-50">
          <div className="font-semibold">{ev.summary}</div>
          <div className="text-xs text-gray-500">
            {ev.start ? new Date(ev.start).toLocaleString() : ""} • {ev.organizer}
          </div>
        </li>
      ))}
    </ul>
=======
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
          onClick={() => {
            // later: open event details modal
            console.log("Clicked event", ev.id);
          }}
        />
      ))}
    </div>
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
  );
}
