

"use client";

import React, { useMemo, useState, useEffect } from "react";
import CalendarGrid from "./components/Calendar/CalendarGrid";
import UpcomingEvents from "./components/Events/UpcomingEvents";
import EventTypesPanel from "./components/EventTypes/EventTypes";

import { useCalendarEvents } from "./hooks/useCalendarEvents";
import { useUserProfile } from "./hooks/useUserProfile";
import { safeDate, toISODateLocal } from "./components/Calendar/CalendarHelpers";

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
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [userSub, setUserSub] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setUserSub(safeGetUserSubFromStorage());
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<string>;
      setSearchQuery(String(custom.detail || ""));
    };
    window.addEventListener("slotly-dashboard-search", handler as EventListener);
    return () => window.removeEventListener("slotly-dashboard-search", handler as EventListener);
  }, []);

  const { data: user } = useUserProfile(userSub);
  const { events } = useCalendarEvents(userSub, "all");

  const eventsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    (events || []).forEach((ev: any) => {
      const d = safeDate(ev?.start);
      if (!d) return;
      const iso = toISODateLocal(d);
      map[iso] = map[iso] || [];
      map[iso].push(ev);
    });
    return map;
  }, [events]);

  const selectedDayEvents = useMemo(() => {
    const base = [...(eventsByDate[selectedDate] || [])].sort((a: any, b: any) => {
      const ta = a?.start ? new Date(a.start).getTime() : 0;
      const tb = b?.start ? new Date(b.start).getTime() : 0;
      return ta - tb;
    });
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter((e: any) => {
      const title = String(e?.summary || e?.title || "").toLowerCase();
      const organizer = String(e?.organizer || e?.organizer_name || "").toLowerCase();
      const organizerEmail = String(e?.organizer_email || e?.email || "").toLowerCase();
      const location = String(e?.location || "").toLowerCase();
      const attendeeText = Array.isArray(e?.attendees)
        ? e.attendees.map((a: any) =>
          typeof a === "string"
            ? a.toLowerCase()
            : `${a?.name || ""} ${a?.email || ""}`.toLowerCase()
        ).join(" ")
        : "";
      return (
        title.includes(q) ||
        organizer.includes(q) ||
        organizerEmail.includes(q) ||
        location.includes(q) ||
        attendeeText.includes(q)
      );
    });
  }, [eventsByDate, selectedDate, searchQuery]);

  const fallbackUpcomingEvents = useMemo(() => {
    const now = Date.now();
    return [...(events || [])]
      .filter((ev: any) => {
        const t = ev?.start ? new Date(ev.start).getTime() : 0;
        return t >= now;
      })
      .sort((a: any, b: any) => {
        const ta = a?.start ? new Date(a.start).getTime() : 0;
        const tb = b?.start ? new Date(b.start).getTime() : 0;
        return ta - tb;
      })
      .slice(0, 6);
  }, [events]);

  const rightPanelEvents =
    selectedDayEvents.length > 0 ? selectedDayEvents : fallbackUpcomingEvents;

  if (!userSub) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Session not found
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading…
      </div>
    );
  }

 

  return (
    <div className="flex w-full flex-col gap-3 pb-6">

      <div className="shrink-0">
        <EventTypesPanel userSub={userSub} />
      </div>

      {/* Desktop lg+ */}
      <div className="hidden lg:flex lg:min-h-0 lg:flex-1 lg:gap-4">
        <div className="min-h-0 flex-1">
          <CalendarGrid
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            eventsByDate={eventsByDate}
          />
        </div>
        <div className="min-h-0 w-[320px] shrink-0 xl:w-[340px]">
          <UpcomingEvents
            events={rightPanelEvents}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {/* Tablet md-lg */}
      <div className="hidden gap-3 md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(240px,1fr)] lg:hidden">
        <CalendarGrid
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          eventsByDate={eventsByDate}
        />
        <UpcomingEvents
          events={rightPanelEvents}
          selectedDate={selectedDate}
        />
      </div>

      {/* Mobile <md : stacked */}
      <div className="flex flex-col gap-3 md:hidden">
        <UpcomingEvents
          events={rightPanelEvents}
          selectedDate={selectedDate}
        />
        <CalendarGrid
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          eventsByDate={eventsByDate}
        />
      </div>

    </div>
  );

}