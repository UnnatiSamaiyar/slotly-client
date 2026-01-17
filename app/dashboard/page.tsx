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

export default function DashboardPage() {
  // ✅ Responsive default: closed on small screens, open on lg+
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  const [userSub, setUserSub] = useState<string | null>(null);

  // Search (Topbar controls)
  const [searchQuery, setSearchQuery] = useState("");

  // Role filter (single dashboard): all | hosted | invited
  const [roleFilter, setRoleFilter] = useState<"all" | "hosted" | "invited">(
    "all"
  );

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

  // ✅ Open sidebar by default only on large screens (no layout break)
  useEffect(() => {
    const setByWidth = () => {
      if (typeof window === "undefined") return;
      setSidebarOpen(window.innerWidth >= 1024);
    };
    setByWidth();
    window.addEventListener("resize", setByWidth);
    return () => window.removeEventListener("resize", setByWidth);
  }, []);

  // Hooks must always run
  const { data: user } = useUserProfile(userSub);
  const {
    events,
    eventsByDate,
    loading: loadingEvents,
    error: eventsError,
    refresh, // ✅ NEW (from updated hook)
  } = useCalendarEvents(userSub, "all");

  // 1) Filter by role (host/invitee) without changing existing flows
  const roleFilteredEvents = useMemo(() => {
    if (roleFilter === "all") return events;
    if (roleFilter === "hosted") {
      return events.filter((e: any) => e?.role === "host" || e?.role === "both");
    }
    return events.filter(
      (e: any) => e?.role === "invitee" || e?.role === "both"
    );
  }, [events, roleFilter]);

  // 2) Filter events by search (summary / organizer / location)
  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return roleFilteredEvents;

    return roleFilteredEvents.filter((e: any) => {
      const summary = (e.summary || "").toLowerCase();
      const organizer = (e.organizer || "").toLowerCase();
      const location = (e.location || "").toLowerCase();
      return summary.includes(q) || organizer.includes(q) || location.includes(q);
    });
  }, [roleFilteredEvents, searchQuery]);

  // Calendar dots should respect search filter
  const filteredEventsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const ev of filteredEvents as any[]) {
      const d = safeDate(ev?.start);
      if (!d) continue;
      const isoLocal = toISODateLocal(d);
      map[isoLocal] = map[isoLocal] || [];
      map[isoLocal].push(ev);
    }
    return map;
  }, [filteredEvents]);

  const dayCount = useMemo(() => {
    return filteredEvents.filter((e: any) => isSameISODate(e.start, selectedDate))
      .length;
  }, [filteredEvents, selectedDate]);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const isToday = selectedDate === todayISO;

  if (!userSub || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
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

      {/* ✅ Main: responsive padding + prevent overflow */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
        <Topbar
          user={user}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        {/* ✅ Grid: 1 col on small screens, 12 col on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* PRIMARY */}
          <section className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
              {/* ✅ Header row stacks on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">
                    {isToday ? "Today" : "Schedule"}
                  </h3>

                  {/* ✅ Make long text wrap nicely on mobile */}
                  <div className="text-xs text-gray-500 mt-1 break-words">
                    Showing{" "}
                    <span className="font-medium text-slate-700">{selectedDate}</span>
                    {roleFilter !== "all" ? (
                      <>
                        {" "}
                        •{" "}
                        <span className="font-medium text-slate-700">
                          {roleFilter === "hosted" ? "Hosted" : "Invited"}
                        </span>
                      </>
                    ) : null}
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

                {/* ✅ Controls wrap on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex rounded-xl border border-gray-200 bg-white p-1 w-full sm:w-auto">
                    <button
                      onClick={() => setRoleFilter("all")}
                      className={`flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg ${
                        roleFilter === "all"
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setRoleFilter("hosted")}
                      className={`flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg ${
                        roleFilter === "hosted"
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Hosted
                    </button>
                    <button
                      onClick={() => setRoleFilter("invited")}
                      className={`flex-1 sm:flex-none px-3 py-1.5 text-xs rounded-lg ${
                        roleFilter === "invited"
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Invited
                    </button>
                  </div>

                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {dayCount} events
                  </div>
                </div>
              </div>

              {/* unchanged logic */}
              <EventList
                events={filteredEvents}
                selectedDate={selectedDate}
                loading={loadingEvents}
                error={eventsError}
                userSub={userSub}
                onChanged={refresh}
              />
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="min-w-0">
                  <h4 className="font-semibold">Calendar Overview</h4>
                  <div className="text-xs text-gray-500 mt-1">
                    Pick a date to filter the timeline.
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedDate(new Date().toISOString().slice(0, 10))
                  }
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 whitespace-nowrap"
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

          {/* RIGHT COLUMN */}
          <aside className="lg:col-span-4 space-y-4 sm:space-y-6">
            <EventTypesPanel userSub={userSub} />
            <UpcomingEvents events={filteredEvents} selectedDate={selectedDate} />
          </aside>
        </div>
      </main>
    </div>
  );
}
