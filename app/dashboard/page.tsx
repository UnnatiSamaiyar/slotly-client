// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import Sidebar from "./components/Sidebar/Sidebar";
// import Topbar from "./components/Topbar/Topbar";
// import CalendarGrid from "./components/Calendar/CalendarGrid";
// import EventList from "./components/Events/EventList";
// import UpcomingEvents from "./components/Events/UpcomingEvents";
// import EventTypesPanel from "./components/EventTypes/EventTypes";

// import { useCalendarEvents } from "./hooks/useCalendarEvents";
// import { useUserProfile } from "./hooks/useUserProfile";
// import { isSameISODate } from "./components/Calendar/CalendarHelpers";

// export default function DashboardPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const [selectedDate, setSelectedDate] = useState<string>(() =>
//     new Date().toISOString().slice(0, 10)
//   );

//   const [userSub, setUserSub] = useState<string | null>(null);

//   // Search (Topbar controls)
//   const [searchQuery, setSearchQuery] = useState("");

//   // Load userSub from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("slotly_user");
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         setUserSub(parsed.sub);
//       } catch (err) {
//         console.error("Invalid session:", err);
//       }
//     }
//   }, []);

//   // Hooks must always run
//   const { data: user } = useUserProfile(userSub);
//   const { events, eventsByDate, loading: loadingEvents, error: eventsError } =
//     useCalendarEvents(userSub);

//   // Filter events by search (summary / organizer / location)
//   const filteredEvents = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();
//     if (!q) return events;

//     return events.filter((e: any) => {
//       const summary = (e.summary || "").toLowerCase();
//       const organizer = (e.organizer || "").toLowerCase();
//       const location = (e.location || "").toLowerCase();
//       return summary.includes(q) || organizer.includes(q) || location.includes(q);
//     });
//   }, [events, searchQuery]);

//   // Calendar dots should respect search filter
//   const filteredEventsByDate = useMemo(() => {
//     const map: Record<string, any[]> = {};
//     for (const ev of filteredEvents as any[]) {
//       const iso = (ev.start || "").slice(0, 10);
//       if (!iso) continue;
//       map[iso] = map[iso] || [];
//       map[iso].push(ev);
//     }
//     return map;
//   }, [filteredEvents]);

//   const dayCount = useMemo(() => {
//     return filteredEvents.filter((e: any) => isSameISODate(e.start, selectedDate)).length;
//   }, [filteredEvents, selectedDate]);

//   const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
//   const isToday = selectedDate === todayISO;

//   if (!userSub || !user) {
//     return (
//       <div className="flex items-center justify-center h-screen text-xl">
//         Loading your dashboard…
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex text-slate-900">
//       <Sidebar
//         open={sidebarOpen}
//         onToggle={() => setSidebarOpen((s: boolean) => !s)}
//         user={user}
//       />

//       <main className="flex-1 p-8">
//         <Topbar
//           user={user}
//           searchQuery={searchQuery}
//           onSearchQueryChange={setSearchQuery}
//         />

//         <div className="grid grid-cols-12 gap-6">
//           {/* PRIMARY: Today / Selected Day */}
//           <section className="col-span-12 lg:col-span-8 space-y-6">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-start justify-between gap-4 mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold">
//                     {isToday ? "Today" : "Schedule"}
//                   </h3>
//                   <div className="text-xs text-gray-500 mt-1">
//                     Showing{" "}
//                     <span className="font-medium text-slate-700">{selectedDate}</span>
//                     {searchQuery.trim() ? (
//                       <>
//                         {" "}
//                         • filtered by{" "}
//                         <span className="font-medium text-slate-700">
//                           “{searchQuery.trim()}”
//                         </span>
//                       </>
//                     ) : null}
//                   </div>
//                 </div>

//                 <div className="text-sm text-gray-500 whitespace-nowrap">
//                   {dayCount} events
//                 </div>
//               </div>

//               <EventList
//   events={events}
//   selectedDate={selectedDate}
//   loading={loading}
//   error={error}
//   userSub={user.sub}
//   onChanged={refresh}
// />

//             </div>

//             {/* Calendar becomes “filter + overview” */}
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h4 className="font-semibold">Calendar Overview</h4>
//                   <div className="text-xs text-gray-500 mt-1">
//                     Pick a date to filter the timeline.
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
//                   className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
//                 >
//                   Today
//                 </button>
//               </div>

//               <CalendarGrid
//                 selectedDate={selectedDate}
//                 setSelectedDate={setSelectedDate}
//                 eventsByDate={filteredEventsByDate}
//               />
//             </div>
//           </section>

//           {/* RIGHT COLUMN: consistent spacing */}
//           <aside className="col-span-12 lg:col-span-4 space-y-6">
//             <EventTypesPanel userSub={userSub} />
//             <UpcomingEvents events={filteredEvents} selectedDate={selectedDate} />

//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// }













"use client";

import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import CalendarGrid from "./components/Calendar/CalendarGrid";
import EventList from "./components/Events/EventList";
import UpcomingEvents from "./components/Events/UpcomingEvents";
import EventTypesPanel from "./components/EventTypes/EventTypes";

import { useCalendarEvents } from "./hooks/useCalendarEvents";
import { useUserProfile } from "./hooks/useUserProfile";
import { isSameISODate } from "./components/Calendar/CalendarHelpers";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  const [userSub, setUserSub] = useState<string | null>(null);

  // Search (Topbar controls)
  const [searchQuery, setSearchQuery] = useState("");

  // Load userSub from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("slotly_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserSub(parsed.sub);
      } catch (err) {
        console.error("Invalid session:", err);
      }
    }
  }, []);

  // Hooks must always run
  const { data: user } = useUserProfile(userSub);
  const {
    events,
    eventsByDate,
    loading: loadingEvents,
    error: eventsError,
    refresh, // ✅ NEW (from updated hook)
  } = useCalendarEvents(userSub);

  // Filter events by search (summary / organizer / location)
  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return events;

    return events.filter((e: any) => {
      const summary = (e.summary || "").toLowerCase();
      const organizer = (e.organizer || "").toLowerCase();
      const location = (e.location || "").toLowerCase();
      return summary.includes(q) || organizer.includes(q) || location.includes(q);
    });
  }, [events, searchQuery]);

  // Calendar dots should respect search filter
  const filteredEventsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const ev of filteredEvents as any[]) {
      // NOTE: in your hook you already group by local date,
      // but here you keep slice(0,10) - leaving as-is to avoid breaking UI.
      const iso = (ev.start || "").slice(0, 10);
      if (!iso) continue;
      map[iso] = map[iso] || [];
      map[iso].push(ev);
    }
    return map;
  }, [filteredEvents]);

  const dayCount = useMemo(() => {
    return filteredEvents.filter((e: any) => isSameISODate(e.start, selectedDate)).length;
  }, [filteredEvents, selectedDate]);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const isToday = selectedDate === todayISO;

  if (!userSub || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading your dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex text-slate-900">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((s: boolean) => !s)}
        user={user}
      />

      <main className="flex-1 p-8">
        <Topbar
          user={user}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        <div className="grid grid-cols-12 gap-6">
          {/* PRIMARY: Today / Selected Day */}
          <section className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {isToday ? "Today" : "Schedule"}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    Showing{" "}
                    <span className="font-medium text-slate-700">{selectedDate}</span>
                    {searchQuery.trim() ? (
                      <>
                        {" "}
                        • filtered by{" "}
                        <span className="font-medium text-slate-700">
                          “{searchQuery.trim()}”
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {dayCount} events
                </div>
              </div>

              {/* ✅ IMPORTANT: pass filteredEvents + correct loading/error + userSub + refresh */}
              <EventList
                events={filteredEvents}
                selectedDate={selectedDate}
                loading={loadingEvents}
                error={eventsError}
                userSub={userSub}
                onChanged={refresh}
              />
            </div>

            {/* Calendar becomes “filter + overview” */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">Calendar Overview</h4>
                  <div className="text-xs text-gray-500 mt-1">
                    Pick a date to filter the timeline.
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  Today
                </button>
              </div>

              <CalendarGrid
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                eventsByDate={filteredEventsByDate}
              />
            </div>
          </section>

          {/* RIGHT COLUMN: consistent spacing */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <EventTypesPanel userSub={userSub} />
            <UpcomingEvents events={filteredEvents} selectedDate={selectedDate} />
          </aside>
        </div>
      </main>
    </div>
  );
}
