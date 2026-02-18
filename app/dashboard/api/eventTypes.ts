// // src/app/dashboard/api/eventTypes.ts
// import { EventType } from "../types";

// const ET_BASE = process.env.NEXT_PUBLIC_EVENT_TYPES_API || "https://api.slotly.io";

// export async function fetchEventTypes(userSub: string): Promise<EventType[]> {
//   const res = await fetch(`${ET_BASE}/event-types?user_sub=${encodeURIComponent(userSub)}`);
//   if (!res.ok) throw new Error(await res.text());
//   const list = await res.json();
//   return (list || []).map((it: any) => ({
//     id: it.id || String(Math.random()),
//     title: it.title || it.name || "Untitled",
//     duration_minutes: it.duration_minutes || it.duration || 30,
//     color: it.color || undefined,
//   }));
// }








// // src/app/dashboard/api/eventTypes.ts
// import { EventType } from "../types";

// const BASE = process.env.NEXT_PUBLIC_EVENT_TYPES_API || "https://api.slotly.io";

// export async function fetchEventTypes(userSub: string): Promise<EventType[]> {
//   const res = await fetch(
//     `${BASE}/event-types/list?user_sub=${encodeURIComponent(userSub)}`
//   );

//   if (!res.ok) {
//     throw new Error(await res.text());
//   }

//   const json = await res.json();

//   // backend returns: { event_types: [...] }
//   return json.event_types || [];
// }






// src/app/dashboard/api/eventTypes.ts
import { EventType } from "../types";

const BASE = process.env.NEXT_PUBLIC_EVENT_TYPES_API || "https://api.slotly.io";

async function handleRes(res: Response) {
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchEventTypes(userSub: string): Promise<EventType[]> {
  const res = await fetch(`${BASE}/event-types/list?user_sub=${encodeURIComponent(userSub)}`, {
    method: "GET",
    credentials: "include",
  });
  const json = await handleRes(res);
  return json.event_types || [];
}

export async function createEventType(
  userSub: string,
  payload: {
    title: string;
    meeting_mode: "google_meet" | "in_person";
    location?: string;
    availability_json?: string;
    duration_minutes?: number;
    timezone?: string | null;
  }
) {
  const res = await fetch(`${BASE}/event-types/create?user_sub=${encodeURIComponent(userSub)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return handleRes(res);
}

export async function updateEventType(
  userSub: string,
  id: number,
  payload: Partial<{
    title: string;
    meeting_mode: "google_meet" | "in_person";
    location: string;
    availability_json: string;
    duration_minutes: number;
    timezone: string | null;
  }>
) {
  const res = await fetch(`${BASE}/event-types/${id}?user_sub=${encodeURIComponent(userSub)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return handleRes(res);
}

export async function deleteEventType(userSub: string, id: number) {
  const res = await fetch(`${BASE}/event-types/${id}?user_sub=${encodeURIComponent(userSub)}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleRes(res);
}
