// src/app/dashboard/api/calendar.ts
import { CalendarEvent } from "../types";

const CAL_BASE =
  process.env.NEXT_PUBLIC_CALENDAR_API || "https://api.slotly.io";

export type CalendarPayload = { calendar_connected: boolean; events: any[] };

export async function fetchCalendarEvents(
  userSub: string
): Promise<CalendarEvent[]> {
  const res = await fetch(
    `${CAL_BASE}/auth/calendar/events?user_sub=${encodeURIComponent(userSub)}`
  );
  if (!res.ok) throw new Error(await res.text());
  const payload: CalendarPayload = await res.json();
  if (!payload.calendar_connected) return [];
  return (payload.events || []).map((ev: any) => ({
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
  }));
}
