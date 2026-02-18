import { CalendarEvent } from "../types";

const CAL_BASE =
  process.env.NEXT_PUBLIC_CALENDAR_API || "https://api.slotly.io";

export type CalendarPayload = { calendar_connected: boolean; events: any[] };

export async function fetchCalendarEvents(
  userSub: string
): Promise<CalendarEvent[]> {
  // Source of truth for the dashboard is Postgres bookings.
  const res = await fetch(
    `${CAL_BASE}/bookings/list?user_sub=${encodeURIComponent(userSub)}&view=me`
  );

  if (!res.ok) throw new Error(await res.text());
  const payload: any = await res.json().catch(() => ({}));
  const bookings = payload?.bookings || [];

  return (Array.isArray(bookings) ? bookings : []).map((b: any) => ({
    id: b.id,
    summary: b.title || "Untitled",
    start: b.start_time || null,
    end: b.end_time || null,
    location: b.location || null,
    htmlLink: null,
    organizer: null,

    meetLink: b.meet_link || null,
    attendees: Array.isArray(b.attendees) ? b.attendees : [],

    // for single-dashboard filters
    role: b.role || "unknown",
  }));
}

// ✅ NEW: Update/reschedule booking by Google Event ID
export async function updateBookingByGoogleEvent(params: {
  userSub: string;
  googleEventId: string;
  startISO?: string;
  title?: string;
  attendees?: string[];
  meeting_mode?: "google_meet" | "in_person";
  location?: string | null;
  timezone?: string | null;
}) {
  const res = await fetch(
    `${CAL_BASE}/bookings/by-google/${encodeURIComponent(params.googleEventId)}?user_sub=${encodeURIComponent(params.userSub)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_iso: params.startISO,
        title: params.title,
        attendees: params.attendees,
        meeting_mode: params.meeting_mode,
        location: params.location,
        timezone: params.timezone,
      }),
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.detail || data?.error || "Failed to update booking");
  }
  return data;
}

// ✅ NEW: Delete booking by Google Event ID
export async function deleteBookingByGoogleEvent(params: {
  userSub: string;
  googleEventId: string;
}) {
  const res = await fetch(
    `${CAL_BASE}/bookings/by-google/${encodeURIComponent(params.googleEventId)}?user_sub=${encodeURIComponent(params.userSub)}`,
    { method: "DELETE" }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.detail || data?.error || "Failed to delete booking");
  }
  return data;
}
