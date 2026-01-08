// // src/app/dashboard/api/calendar.ts
// import { CalendarEvent } from "../types";

// const CAL_BASE =
//   process.env.NEXT_PUBLIC_CALENDAR_API || "https://api.slotly.io";

// export type CalendarPayload = { calendar_connected: boolean; events: any[] };

// export async function fetchCalendarEvents(
//   userSub: string
// ): Promise<CalendarEvent[]> {
//   const res = await fetch(
//     `${CAL_BASE}/auth/calendar/events?user_sub=${encodeURIComponent(userSub)}`
//   );
//   if (!res.ok) throw new Error(await res.text());
//   const payload: CalendarPayload = await res.json();
//   if (!payload.calendar_connected) return [];
//   return (payload.events || []).map((ev: any) => ({
//     id: ev.id,
//     summary: ev.summary || "Untitled",
//     start: ev.start || null,
//     end: ev.end || null,
//     location: ev.location || null,
//     htmlLink: ev.htmlLink || null,
//     organizer: ev.organizer || null,

//     // 🔥 ADD THESE
//     meetLink: ev.meetLink || null,
//     attendees: Array.isArray(ev.attendees) ? ev.attendees : [],
//   }));
// }



// export async function updateBooking(id: number, payload: any) {
//   return fetch(`${CAL_BASE}/bookings/${id}?user_sub=${payload.userSub}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
// }

// export async function deleteBooking(id: number, userSub: string) {
//   return fetch(
//     `${CAL_BASE}/bookings/${id}?user_sub=${encodeURIComponent(userSub)}`,
//     { method: "DELETE" }
//   );
// }











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
