// src/app/dashboard/hooks/useCalendarEvents.ts
//@ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { toISODateLocal, safeDate } from "../components/Calendar/CalendarHelpers";

export function useCalendarEvents(userSub: string | null) {
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
          `https://api.slotly.io/auth/calendar/events?user_sub=${encodeURIComponent(userSub)}`
        );

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || "Failed to load calendar events");
        }

        const payload = await res.json().catch(() => ({}));
        const items = payload?.events ?? payload ?? [];

        if (!cancelled) {
          setEvents(Array.isArray(items) ? items : []);
        }
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
  }, [userSub]);

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
  };
}
