// components/calendar/useCalendarEvents.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { fetchCalendarEvents, CalendarEvent } from "@/lib/api";

type Result = {
  loading: boolean;
  error: string | null;
  connected: boolean;
  events: CalendarEvent[];
  refresh: () => void;
};

const memCache: Record<string, { ts: number; data: CalendarEvent[]; connected: boolean }> = {};
const STALE_MS = 1000 * 20; // stale after 20s
const MAX_RETRIES = 3;

export function useCalendarEvents(userSub: string | null, days = 30): Result {
  const [loading, setLoading] = useState<boolean>(!!userSub);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);
  const retryRef = useRef(0);
  const key = userSub ? `${userSub}:${days}` : "no-user";

  async function load(force = false) {
    if (!userSub) {
      setLoading(false);
      setEvents([]);
      setConnected(false);
      return;
    }

    // serve from cache if not stale
    const cached = memCache[key];
    if (!force && cached && Date.now() - cached.ts < STALE_MS) {
      setEvents(cached.data);
      setConnected(cached.connected);
      setLoading(false);
      // still revalidate in background
      revalidate();
      return;
    }

    setLoading(true);
    setError(null);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const payload = await fetchCalendarEvents(userSub, days);
      memCache[key] = { ts: Date.now(), data: payload.events || [], connected: !!payload.calendar_connected };
      setEvents(payload.events || []);
      setConnected(!!payload.calendar_connected);
      setLoading(false);
      retryRef.current = 0;
    } catch (err: any) {
      if (ac.signal.aborted) return;
      // retry exponential backoff
      retryRef.current++;
      if (retryRef.current <= MAX_RETRIES) {
        const delay = 500 * 2 ** (retryRef.current - 1);
        setTimeout(() => load(force), delay);
      } else {
        setError(err?.message ?? "Unknown error");
        setLoading(false);
      }
    }
  }

  // revalidate in background without blocking UI
  async function revalidate() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const payload = await fetchCalendarEvents(userSub!, days);
      memCache[key] = { ts: Date.now(), data: payload.events || [], connected: !!payload.calendar_connected };
      setEvents(payload.events || []);
      setConnected(!!payload.calendar_connected);
      retryRef.current = 0;
    } catch (err: any) {
      // ignore background revalidation errors (already handled by load)
    }
  }

  useEffect(() => {
    if (!userSub) return;
    load(false);

    // periodic refresh while page is open (every 5 minutes)
    const interval = setInterval(() => load(false), 1000 * 60 * 5);

    return () => {
      abortRef.current?.abort();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSub, days]);

  return {
    loading,
    error,
    connected,
    events,
    refresh: () => load(true),
  };
}
