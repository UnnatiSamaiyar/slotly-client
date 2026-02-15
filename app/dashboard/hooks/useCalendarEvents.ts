

//@ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { toISODateLocal, safeDate } from "../components/Calendar/CalendarHelpers";

const API_BASE =
  process.env.NEXT_PUBLIC_CALENDAR_API || "http://api.slotly.io";

export function useCalendarEvents(userSub: string | null, view: "host" | "invitee" | "all" = "host") {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userSub) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_BASE}/bookings/list?user_sub=${encodeURIComponent(userSub)}&view=${encodeURIComponent(view)}`
        );

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || "Failed to load calendar events");
        }

        const payload = await res.json().catch(() => ({}));
        const bookings = payload?.bookings || [];

        const items = (Array.isArray(bookings) ? bookings : []).map((b: any) => ({
          id: b.id,
          summary: b.title || "Untitled",
          start: b.start_time || null,
          end: b.end_time || null,
          location: b.location || null,
          htmlLink: null,
          organizer: null,
          meetLink: b.meet_link || null,
          attendees: Array.isArray(b.attendees) ? b.attendees : [],
          role: b.role || "unknown",
        }));

        if (!cancelled) setEvents(items);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load events");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userSub, view]);

  // IMPORTANT: group by LOCAL date (not UTC slice(0,10))
  const eventsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};

    for (const ev of events) {
      const startISO = ev?.start;
      const d = safeDate(startISO);
      if (!d) continue;

      const isoLocal = toISODateLocal(d);
      map[isoLocal] = map[isoLocal] || [];
      map[isoLocal].push(ev);
    }

    // Sort each day by time
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => {
        const ta = a?.start ? new Date(a.start).getTime() : 0;
        const tb = b?.start ? new Date(b.start).getTime() : 0;
        return ta - tb;
      });
    }

    return map;
  }, [events]);

  return {
    events,
    eventsByDate,
    loading,
    error,
    // ✅ NEW: helper to refresh without reloading whole page
    refresh: async () => {
      if (!userSub) return;
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/bookings/list?user_sub=${encodeURIComponent(userSub)}&view=${encodeURIComponent(view)}`
        );
        const payload = await res.json().catch(() => ({}));
        const bookings = payload?.bookings || [];
        const items = (Array.isArray(bookings) ? bookings : []).map((b: any) => ({
          id: b.id,
          summary: b.title || "Untitled",
          start: b.start_time || null,
          end: b.end_time || null,
          location: b.location || null,
          htmlLink: null,
          organizer: null,
          meetLink: b.meet_link || null,
          attendees: Array.isArray(b.attendees) ? b.attendees : [],
          role: b.role || "unknown",
        }));
        setEvents(items);
      } finally {
        setLoading(false);
      }
    },
  };
}
