// // "use client";

// // import React, { useMemo, useState, useEffect } from "react";
// // import Sidebar from "./components/Sidebar/Sidebar";
// // import Topbar from "./components/Topbar/Topbar";
// // import CalendarGrid from "./components/Calendar/CalendarGrid";
// // import EventList from "./components/Events/EventList";
// // import UpcomingEvents from "./components/Events/UpcomingEvents";
// // import EventTypesPanel from "./components/EventTypes/EventTypes";

// // import { useCalendarEvents } from "./hooks/useCalendarEvents";
// // import { useUserProfile } from "./hooks/useUserProfile";
// // import { isSameISODate } from "./components/Calendar/CalendarHelpers";
// // import { safeDate, toISODateLocal } from "./components/Calendar/CalendarHelpers";

// // function safeGetUserSubFromStorage(): string | null {
// //   const keysToTry = ["slotly_user", "user", "auth_user", "slotlyUser"];

// //   for (const key of keysToTry) {
// //     try {
// //       const saved = localStorage.getItem(key);
// //       if (!saved) continue;

// //       if (saved === "null" || saved === "undefined") continue;

// //       const parsed = JSON.parse(saved);
// //       if (!parsed || typeof parsed !== "object") continue;

// //       // direct
// //       const sub = (parsed as any).sub;
// //       if (typeof sub === "string" && sub.trim()) return sub.trim();

// //       // nested common shapes
// //       const nested1 = (parsed as any).user?.sub;
// //       if (typeof nested1 === "string" && nested1.trim()) return nested1.trim();

// //       const nested2 = (parsed as any).profile?.sub;
// //       if (typeof nested2 === "string" && nested2.trim()) return nested2.trim();
// //     } catch {
// //       // keep trying next key
// //     }
// //   }

// //   return null;
// // }

// // export default function DashboardPage() {
// //   // ✅ Responsive default: closed on small screens, open on lg+
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   const [selectedDate, setSelectedDate] = useState<string>(() =>
// //     new Date().toISOString().slice(0, 10)
// //   );

// //   const [userSub, setUserSub] = useState<string | null>(null);

// //   // Search (Topbar controls)
// //   const [searchQuery, setSearchQuery] = useState("");

// //   // Role filter (single dashboard): all | hosted | invited
// //   const [roleFilter, setRoleFilter] = useState<"all" | "hosted" | "invited">(
// //     "all"
// //   );

// //   // ✅ Safe session load (NO aggressive delete)
// //   useEffect(() => {
// //     const sub = safeGetUserSubFromStorage();
// //     setUserSub(sub);
// //   }, []);

// //   // ✅ Open sidebar by default only on large screens (no layout break)
// //   useEffect(() => {
// //     const setByWidth = () => {
// //       if (typeof window === "undefined") return;
// //       setSidebarOpen(window.innerWidth >= 1024);
// //     };
// //     setByWidth();
// //     window.addEventListener("resize", setByWidth);
// //     return () => window.removeEventListener("resize", setByWidth);
// //   }, []);

// //   // Hooks must always run
// //   const { data: user } = useUserProfile(userSub);
// //   const {
// //     events,
// //     loading: loadingEvents,
// //     error: eventsError,
// //     refresh,
// //   } = useCalendarEvents(userSub, "all");

// //   // 1) Filter by role (host/invitee)
// //   const roleFilteredEvents = useMemo(() => {
// //     if (roleFilter === "all") return events;
// //     if (roleFilter === "hosted") {
// //       return (events || []).filter(
// //         (e: any) => e?.role === "host" || e?.role === "both"
// //       );
// //     }
// //     return (events || []).filter(
// //       (e: any) => e?.role === "invitee" || e?.role === "both"
// //     );
// //   }, [events, roleFilter]);

// //   // 2) Filter events by search (summary / organizer / location)
// //   const filteredEvents = useMemo(() => {
// //     const q = searchQuery.trim().toLowerCase();
// //     if (!q) return roleFilteredEvents;

// //     return (roleFilteredEvents || []).filter((e: any) => {
// //       const summary = (e.summary || "").toLowerCase();
// //       const organizer = (e.organizer || "").toLowerCase();
// //       const location = (e.location || "").toLowerCase();
// //       return summary.includes(q) || organizer.includes(q) || location.includes(q);
// //     });
// //   }, [roleFilteredEvents, searchQuery]);

// //   // Calendar dots should respect search filter
// //   const filteredEventsByDate = useMemo(() => {
// //     const map: Record<string, any[]> = {};
// //     for (const ev of (filteredEvents as any[]) || []) {
// //       const d = safeDate(ev?.start);
// //       if (!d) continue;
// //       const isoLocal = toISODateLocal(d);
// //       map[isoLocal] = map[isoLocal] || [];
// //       map[isoLocal].push(ev);
// //     }
// //     return map;
// //   }, [filteredEvents]);

// //   const dayCount = useMemo(() => {
// //     return (filteredEvents || []).filter((e: any) =>
// //       isSameISODate(e.start, selectedDate)
// //     ).length;
// //   }, [filteredEvents, selectedDate]);

// //   const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
// //   const isToday = selectedDate === todayISO;

// //   // ✅ If session missing, show clean state (no crash)
// //   if (!userSub) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen text-xl">
// //         Session not found. Please login again.
// //       </div>
// //     );
// //   }

// //   if (!user) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen text-xl">
// //         Loading your dashboard…
// //       </div>
// //     );
// //   }

// //   return (
// //     // Make dashboard a full-height app shell with independent scroll regions
// //     <div className="h-screen bg-gray-50 flex text-slate-900 overflow-hidden">
// //       <Sidebar
// //         open={sidebarOpen}
// //         onToggle={() => setSidebarOpen((s: boolean) => !s)}
// //         user={user}
// //       />

// //       <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
// //         <div className="shrink-0 p-4 sm:p-6 lg:p-8">
// //           <Topbar
// //             user={user}
// //             searchQuery={searchQuery}
// //             onSearchQueryChange={setSearchQuery}
// //           />
// //         </div>

// //         <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8">
// //           <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
// //           <section className="lg:col-span-8 space-y-4 sm:space-y-6">
// //             <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
// //               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
// //                 <div className="min-w-0">
// //                   <h3 className="text-lg font-semibold">
// //                     {isToday ? "Today" : "Schedule"}
// //                   </h3>

// //                   <div className="text-xs text-gray-500 mt-1 break-words">
// //                     Showing{" "}
// //                     <span className="font-medium text-slate-700">{selectedDate}</span>
// //                     {roleFilter !== "all" ? (
// //                       <>
// //                         {" "}
// //                         •{" "}
// //                         <span className="font-medium text-slate-700">
// //                           {roleFilter === "hosted" ? "Hosted" : "Invited"}
// //                         </span>
// //                       </>
// //                     ) : null}
// //                     {searchQuery.trim() ? (
// //                       <>
// //                         {" "}
// //                         • filtered by{" "}
// //                         <span className="font-medium text-slate-700">
// //                           “{searchQuery.trim()}”
// //                         </span>
// //                       </>
// //                     ) : null}
// //                   </div>
// //                 </div>

// //                 <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
// //                   <div className="flex rounded-xl border border-gray-200 bg-white p-1 w-full sm:w-auto">
// //                     <button
// //                       onClick={() => setRoleFilter("all")}
// //                       className={`flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg ${
// //                         roleFilter === "all"
// //                           ? "bg-gray-900 text-white"
// //                           : "text-gray-700 hover:bg-gray-50"
// //                       }`}
// //                     >
// //                       All
// //                     </button>
// //                     <button
// //                       onClick={() => setRoleFilter("hosted")}
// //                       className={`flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg ${
// //                         roleFilter === "hosted"
// //                           ? "bg-gray-900 text-white"
// //                           : "text-gray-700 hover:bg-gray-50"
// //                       }`}
// //                     >
// //                       Hosted
// //                     </button>
// //                     <button
// //                       onClick={() => setRoleFilter("invited")}
// //                       className={`flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg ${
// //                         roleFilter === "invited"
// //                           ? "bg-gray-900 text-white"
// //                           : "text-gray-700 hover:bg-gray-50"
// //                       }`}
// //                     >
// //                       Invited
// //                     </button>
// //                   </div>

// //                   <div className="text-sm text-gray-500 whitespace-nowrap">
// //                     {dayCount} events
// //                   </div>
// //                 </div>
// //               </div>

// //               <EventList
// //                 events={filteredEvents}
// //                 selectedDate={selectedDate}
// //                 loading={loadingEvents}
// //                 error={eventsError}
// //                 userSub={userSub}
// //                 onChanged={refresh}
// //               />
// //             </div>

// //             <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
// //               <div className="flex items-center justify-between mb-4 gap-3">
// //                 <div className="min-w-0">
// //                   <h4 className="font-semibold">Calendar Overview</h4>
// //                   <div className="text-xs text-gray-500 mt-1">
// //                     Pick a date to filter the timeline.
// //                   </div>
// //                 </div>

// //                 <button
// //                   onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
// //                   className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 whitespace-nowrap"
// //                 >
// //                   Today
// //                 </button>
// //               </div>

// //               <CalendarGrid
// //                 selectedDate={selectedDate}
// //                 setSelectedDate={setSelectedDate}
// //                 eventsByDate={filteredEventsByDate}
// //               />
// //             </div>
// //           </section>

// //           <aside className="lg:col-span-4 space-y-4 sm:space-y-6">
// //             <EventTypesPanel userSub={userSub} />
// //             <UpcomingEvents events={filteredEvents} selectedDate={selectedDate} />
// //           </aside>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }







// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import Sidebar from "./components/Sidebar/Sidebar";
// import Topbar from "./components/Topbar/Topbar";
// import CalendarGrid from "./components/Calendar/CalendarGrid";
// import EventList from "./components/Events/EventList";
// import UpcomingEvents from "./components/Events/UpcomingEvents";
// import EventTypesPanel from "./components/EventTypes/EventTypes";

// import NewEventModal from "./components/Calendar/NewEventModal";


// import { useCalendarEvents } from "./hooks/useCalendarEvents";
// import { useUserProfile } from "./hooks/useUserProfile";
// import { isSameISODate } from "./components/Calendar/CalendarHelpers";
// import { safeDate, toISODateLocal } from "./components/Calendar/CalendarHelpers";
// import { Menu } from "lucide-react";

// function safeGetUserSubFromStorage(): string | null {
//   const keysToTry = ["slotly_user", "user", "auth_user", "slotlyUser"];

//   for (const key of keysToTry) {
//     try {
//       const saved = localStorage.getItem(key);
//       if (!saved) continue;

//       if (saved === "null" || saved === "undefined") continue;

//       const parsed = JSON.parse(saved);
//       if (!parsed || typeof parsed !== "object") continue;

//       const sub = (parsed as any).sub;
//       if (typeof sub === "string" && sub.trim()) return sub.trim();

//       const nested1 = (parsed as any).user?.sub;
//       if (typeof nested1 === "string" && nested1.trim()) return nested1.trim();

//       const nested2 = (parsed as any).profile?.sub;
//       if (typeof nested2 === "string" && nested2.trim()) return nested2.trim();
//     } catch {
//       // keep trying next key
//     }
//   }

//   return null;
// }

// export default function DashboardPage() {
//   // ✅ Responsive: Desktop => sidebar docked, Mobile => sidebar as drawer
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isDesktop, setIsDesktop] = useState(false);
// const [openNewEvent, setOpenNewEvent] = useState(false);

//   const [selectedDate, setSelectedDate] = useState<string>(() =>
//     new Date().toISOString().slice(0, 10)
//   );

//   const [userSub, setUserSub] = useState<string | null>(null);

//   // Search (Topbar controls)
//   const [searchQuery, setSearchQuery] = useState("");

//   // Role filter (single dashboard): all | hosted | invited
//   const [roleFilter, setRoleFilter] = useState<"all" | "hosted" | "invited">("all");

//   // ✅ Safe session load (NO aggressive delete)
//   useEffect(() => {
//     const sub = safeGetUserSubFromStorage();
//     setUserSub(sub);
//   }, []);

//   // ✅ Track breakpoint (lg: 1024px)
//   useEffect(() => {
//     const apply = () => {
//       if (typeof window === "undefined") return;
//       const desktop = window.innerWidth >= 1024;
//       setIsDesktop(desktop);
//       setSidebarOpen(desktop); // desktop: open by default; mobile: closed by default
//     };
//     apply();
//     window.addEventListener("resize", apply);
//     return () => window.removeEventListener("resize", apply);
//   }, []);

//   // Hooks must always run
//   const { data: user } = useUserProfile(userSub);
//   const { events, loading: loadingEvents, error: eventsError, refresh } = useCalendarEvents(
//     userSub,
//     "all"
//   );

//   // 1) Filter by role (host/invitee)
//   const roleFilteredEvents = useMemo(() => {
//     if (roleFilter === "all") return events;
//     if (roleFilter === "hosted") {
//       return (events || []).filter((e: any) => e?.role === "host" || e?.role === "both");
//     }
//     return (events || []).filter((e: any) => e?.role === "invitee" || e?.role === "both");
//   }, [events, roleFilter]);

//   // 2) Filter events by search (summary / organizer / location)
//   const filteredEvents = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();
//     if (!q) return roleFilteredEvents;

//     return (roleFilteredEvents || []).filter((e: any) => {
//       const summary = (e.summary || "").toLowerCase();
//       const organizer = (e.organizer || "").toLowerCase();
//       const location = (e.location || "").toLowerCase();
//       return summary.includes(q) || organizer.includes(q) || location.includes(q);
//     });
//   }, [roleFilteredEvents, searchQuery]);

//   // Calendar dots should respect search filter
//   const filteredEventsByDate = useMemo(() => {
//     const map: Record<string, any[]> = {};
//     for (const ev of (filteredEvents as any[]) || []) {
//       const d = safeDate(ev?.start);
//       if (!d) continue;
//       const isoLocal = toISODateLocal(d);
//       map[isoLocal] = map[isoLocal] || [];
//       map[isoLocal].push(ev);
//     }
//     return map;
//   }, [filteredEvents]);

//   const dayCount = useMemo(() => {
//     return (filteredEvents || []).filter((e: any) => isSameISODate(e.start, selectedDate)).length;
//   }, [filteredEvents, selectedDate]);

//   const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
//   const isToday = selectedDate === todayISO;

//   // ✅ If session missing, show clean state (no crash)
//   if (!userSub) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-base sm:text-xl bg-gray-50 text-slate-700">
//         Session not found. Please login again.
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-base sm:text-xl bg-gray-50 text-slate-700">
//         Loading your dashboard…
//       </div>
//     );
//   }

//   const closeMobileSidebar = () => {
//     if (!isDesktop) setSidebarOpen(false);
//   };

//   return (
//     <div className="h-screen bg-gray-50 flex text-slate-900 overflow-hidden">
//       {/* ✅ Desktop sidebar (docked) */}
//       {isDesktop ? (
//         <Sidebar
//           open={sidebarOpen}
//           onToggle={() => setSidebarOpen((s: boolean) => !s)}
//           user={user}
//           onNewEvent={() => setOpenNewEvent(true)}
//         />

//       ) : null}

//       {/* ✅ Mobile sidebar (drawer overlay) */}
//       {!isDesktop && sidebarOpen ? (
//         <div className="fixed inset-0 z-50 flex">
//           <div
//             className="absolute inset-0 bg-black/35"
//             onClick={closeMobileSidebar}
//             aria-hidden="true"
//           />
//           <div className="relative h-full">
//             <Sidebar open={true} onToggle={closeMobileSidebar} user={user} />
//           </div>
//         </div>
//       ) : null}

//       <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
//         {/* Topbar area */}
//         <div className="shrink-0">
//           <div className="relative px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
//             {/* Mobile menu button (Calendly-style) */}
//             {!isDesktop ? (
//               <button
//                 type="button"
//                 onClick={() => setSidebarOpen(true)}
//                 className="absolute left-3 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:scale-[0.98] transition sm:hidden"
//                 aria-label="Open menu"
//               >
//                 <Menu className="h-5 w-5 text-slate-700" />
//               </button>
//             ) : null}

//             {/* Give Topbar breathing room on mobile (because menu button sits left) */}
//             <div className={!isDesktop ? "pl-12 sm:pl-0" : ""}>
//               <Topbar user={user} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 pb-8">
//           <div className="mx-auto max-w-7xl">
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
//               {/* Left column */}
//               <section className="lg:col-span-8 space-y-4 sm:space-y-6">
//                 <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
//                   <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
//                     <div className="min-w-0">
//                       <h3 className="text-lg font-semibold text-slate-900">
//                         {isToday ? "Today" : "Schedule"}
//                       </h3>

//                       <div className="text-xs text-gray-500 mt-1 break-words">
//                         Showing{" "}
//                         <span className="font-medium text-slate-700">{selectedDate}</span>
//                         {roleFilter !== "all" ? (
//                           <>
//                             {" "}
//                             •{" "}
//                             <span className="font-medium text-slate-700">
//                               {roleFilter === "hosted" ? "Hosted" : "Invited"}
//                             </span>
//                           </>
//                         ) : null}
//                         {searchQuery.trim() ? (
//                           <>
//                             {" "}
//                             • filtered by{" "}
//                             <span className="font-medium text-slate-700">
//                               “{searchQuery.trim()}”
//                             </span>
//                           </>
//                         ) : null}
//                       </div>
//                     </div>

//                     <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
//                       {/* Calm segmented control */}
//                       <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 w-full sm:w-auto">
//                         <button
//                           onClick={() => setRoleFilter("all")}
//                           className={[
//                             "flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg font-semibold transition",
//                             roleFilter === "all"
//                               ? "bg-slate-900 text-white"
//                               : "text-slate-700 hover:bg-gray-50",
//                           ].join(" ")}
//                         >
//                           All
//                         </button>
//                         <button
//                           onClick={() => setRoleFilter("hosted")}
//                           className={[
//                             "flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg font-semibold transition",
//                             roleFilter === "hosted"
//                               ? "bg-slate-900 text-white"
//                               : "text-slate-700 hover:bg-gray-50",
//                           ].join(" ")}
//                         >
//                           Hosted
//                         </button>
//                         <button
//                           onClick={() => setRoleFilter("invited")}
//                           className={[
//                             "flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg font-semibold transition",
//                             roleFilter === "invited"
//                               ? "bg-slate-900 text-white"
//                               : "text-slate-700 hover:bg-gray-50",
//                           ].join(" ")}
//                         >
//                           Invited
//                         </button>
//                       </div>

//                       <div className="text-sm text-gray-500 whitespace-nowrap">
//                         {dayCount} events
//                       </div>
//                     </div>
//                   </div>

//                   <EventList
//                     events={filteredEvents}
//                     selectedDate={selectedDate}
//                     loading={loadingEvents}
//                     error={eventsError}
//                     userSub={userSub}
//                     onChanged={refresh}
//                   />
//                 </div>

//                 <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
//                   <div className="flex items-center justify-between mb-4 gap-3">
//                     <div className="min-w-0">
//                       <h4 className="font-semibold text-slate-900">Calendar Overview</h4>
//                       <div className="text-xs text-gray-500 mt-1">
//                         Pick a date to filter the timeline.
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
//                       className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 whitespace-nowrap"
//                     >
//                       Today
//                     </button>
//                   </div>

//                   <CalendarGrid
//                     selectedDate={selectedDate}
//                     setSelectedDate={setSelectedDate}
//                     eventsByDate={filteredEventsByDate}
//                   />
//                 </div>
//               </section>

//               {/* Right column */}
//               <aside className="lg:col-span-4 space-y-4 sm:space-y-6">
//                 <EventTypesPanel userSub={userSub} />
//                 <UpcomingEvents events={filteredEvents} selectedDate={selectedDate} />
//               </aside>
//             </div>
//           </div>
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
import { safeDate, toISODateLocal } from "./components/Calendar/CalendarHelpers";
import { Menu } from "lucide-react";

function safeGetUserSubFromStorage(): string | null {
  try {
    const raw = localStorage.getItem("slotly_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.sub || null;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [userSub, setUserSub] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<"all" | "hosted" | "invited">("all");

  useEffect(() => {
    setUserSub(safeGetUserSubFromStorage());
  }, []);

  useEffect(() => {
    const apply = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const { data: user } = useUserProfile(userSub);
  const { events, loading, error, refresh } =
    useCalendarEvents(userSub, "all");

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    const q = searchQuery.trim().toLowerCase();

    // If searching → ignore date filter
    if (q) {
      return events.filter((e: any) => {
        const title = (e.title || e.summary || "").toLowerCase();
        const organizer = (e.organizer || "").toLowerCase();
        const location = (e.location || "").toLowerCase();

        return (
          title.includes(q) ||
          organizer.includes(q) ||
          location.includes(q)
        );
      });
    }

    // If NOT searching → normal behavior
    return events.filter((e: any) =>
      isSameISODate(e.start, selectedDate)
    );
  }, [events, searchQuery, selectedDate]);
  const filteredEventsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    filteredEvents.forEach((ev: any) => {
      const d = safeDate(ev.start);
      if (!d) return;
      const iso = toISODateLocal(d);
      map[iso] = map[iso] || [];
      map[iso].push(ev);
    });
    return map;
  }, [filteredEvents]);

  if (!userSub) {
    return <div className="flex items-center justify-center min-h-screen">Session not found</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {isDesktop && (
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          user={user}
        />
      )}

      {!isDesktop && sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/35"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar open user={user} onToggle={() => setSidebarOpen(false)} />
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="relative px-4 pt-4">
          {!isDesktop && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute left-3 top-4 h-10 w-10 rounded-xl border bg-white"
            >
              <Menu />
            </button>
          )}
          <Topbar
            user={user}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-8 space-y-6">
              <EventList
                events={filteredEvents}
                selectedDate={selectedDate}
                loading={loading}
                error={error}
                userSub={userSub}
                onChanged={refresh}
              />

              <CalendarGrid
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                eventsByDate={filteredEventsByDate}
              />
            </section>

            <aside className="lg:col-span-4 space-y-6">
              <EventTypesPanel userSub={userSub} />
              <UpcomingEvents
                events={filteredEvents}
                selectedDate={selectedDate}
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
