// src/app/dashboard/api/calendar.ts
import { CalendarEvent } from "../types";

<<<<<<< HEAD
const CAL_BASE = process.env.NEXT_PUBLIC_CALENDAR_API || "https://api.slotly.io";

export type CalendarPayload = { calendar_connected: boolean; events: any[] };

export async function fetchCalendarEvents(userSub: string): Promise<CalendarEvent[]> {
  const res = await fetch(`${CAL_BASE}/auth/calendar/events?user_sub=${encodeURIComponent(userSub)}`);
=======
const CAL_BASE =
  process.env.NEXT_PUBLIC_CALENDAR_API || "http://localhost:8000";

export type CalendarPayload = { calendar_connected: boolean; events: any[] };

export async function fetchCalendarEvents(
  userSub: string
): Promise<CalendarEvent[]> {
  const res = await fetch(
    `${CAL_BASE}/auth/calendar/events?user_sub=${encodeURIComponent(userSub)}`
  );
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
  if (!res.ok) throw new Error(await res.text());
  const payload: CalendarPayload = await res.json();
  if (!payload.calendar_connected) return [];
  return (payload.events || []).map((ev: any) => ({
<<<<<<< HEAD
    id: ev.id || ev.eventId || String(Math.random()),
    summary: ev.summary || ev.title || "Untitled",
    start: ev.start?.dateTime || ev.start?.date || ev.start || null,
    end: ev.end?.dateTime || ev.end?.date || ev.end || null,
    location: ev.location || null,
    htmlLink: ev.htmlLink || null,
    organizer: ev.organizer?.email || ev.organizer || null,
=======
    id: ev.id,
    summary: ev.summary || "Untitled",
    start: ev.start || null,
    end: ev.end || null,
    location: ev.location || null,
    htmlLink: ev.htmlLink || null,
    organizer: ev.organizer || null,

    // 🔥 ADD THESE
    meetLink: ev.meetLink || null,
    attendees: Array.isArray(ev.attendees) ? ev.attendees : [],
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
  }));
}
