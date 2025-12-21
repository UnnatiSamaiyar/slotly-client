<<<<<<< HEAD
// // src/app/dashboard/hooks/useCalendarEvents.ts
// import { useEffect, useMemo, useState } from "react";
// import { CalendarEvent, ISODate } from "../types";
// import * as api from "../api/calendar";

// function localYMD(isoOrDate?: string | null) {
//   if (!isoOrDate) return null;
//   const d = new Date(isoOrDate);
//   if (Number.isNaN(d.getTime())) return null;
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

// export function useCalendarEvents(userSub: string | null) {
//   const [events, setEvents] = useState<CalendarEvent[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!userSub) return;
//     let mounted = true;
//     const fetch = async () => {
//       setLoading(true); setError(null);
//       try {
//         const r = await api.fetchCalendarEvents(userSub);
//         if (!mounted) return;
//         setEvents(r);
//       } catch (err: any) {
//         if (!mounted) return;
//         setError(err.message || String(err));
//         setEvents([]);
//       } finally { if (!mounted) return; setLoading(false); }
//     };
//     fetch();
//     const id = setInterval(fetch, 60000);
//     return () => { mounted = false; clearInterval(id); };
//   }, [userSub]);

//   const eventsByDate = useMemo(() => {
//     const map: Record<ISODate, CalendarEvent[]> = {};
//     for (const ev of events) {
//       const ymd = localYMD(ev.start) || localYMD(ev.end);
//       if (!ymd) continue;
//       if (!map[ymd]) map[ymd] = [];
//       map[ymd].push(ev);
//     }
//     return map;
//   }, [events]);

//   return { events, eventsByDate, loading, error } as const;
// }











// src/app/dashboard/hooks/useCalendarEvents.ts
import { useEffect, useMemo, useState } from "react";
import { CalendarEvent, ISODate } from "../types";
import * as api from "../api/calendar";

// Convert ISO timestamp into YYYY-MM-DD for grouping
function localYMD(isoOrDate?: string | null) {
  if (!isoOrDate) return null;
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function useCalendarEvents(userSub: string | null) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- FETCH EVENTS FROM BACKEND ---
  useEffect(() => {
    if (!userSub) return;
    let mounted = true;

    const fetchEvents = async () => {
=======
// src/app/dashboard/hooks/useCalendarEvents.ts
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
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
      setLoading(true);
      setError(null);

      try {
<<<<<<< HEAD
        const r = await api.fetchCalendarEvents(userSub);
        if (!mounted) return;

        // SORT events by start time
        const sorted = [...r].sort((a, b) => {
          const ta = a.start ? new Date(a.start).getTime() : 0;
          const tb = b.start ? new Date(b.start).getTime() : 0;
          return ta - tb;
        });

        setEvents(sorted);

      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || String(err));
        setEvents([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchEvents();

    // Poll every 60 seconds
    const id = setInterval(fetchEvents, 60000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [userSub]);

  // --- GROUP EVENTS BY DATE ---
  const eventsByDate = useMemo(() => {
    const map: Record<ISODate, CalendarEvent[]> = {};

    for (const ev of events) {
      const ymd = localYMD(ev.start) || localYMD(ev.end);
      if (!ymd) continue;

      if (!map[ymd]) map[ymd] = [];
      map[ymd].push(ev);
=======
        const res = await fetch(
          `http://localhost:8000/auth/calendar/events?user_sub=${encodeURIComponent(userSub)}`
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
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
    }

    return map;
  }, [events]);

<<<<<<< HEAD
  return { events, eventsByDate, loading, error } as const;
=======
  return {
    events,
    eventsByDate,
    loading,
    error,
  };
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
}
