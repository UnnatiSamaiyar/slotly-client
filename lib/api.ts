// lib/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.slotly.io";

export type CalendarEvent = {
  id: string;
  summary: string;
  start: string; // ISO
  end: string;   // ISO
  location?: string | null;
  htmlLink?: string;
  organizer?: string;
};

export async function fetchCalendarEvents(userSub: string, days = 30) {
  const url = `${API_BASE}/auth/calendar/events?user_sub=${encodeURIComponent(userSub)}&days=${days}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Calendar fetch failed: ${res.status} ${res.statusText} ${body}`);
  }
  return res.json() as Promise<{ calendar_connected: boolean; events: CalendarEvent[] }>;
}
