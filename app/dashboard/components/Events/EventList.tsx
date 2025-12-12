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

export default function EventList({
  events,
  selectedDate,
  loading,
  error
}: {
  events: CalendarEvent[];
  selectedDate: string;
  loading: boolean;
  error: string | null;
}) {
  
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
  );
}
