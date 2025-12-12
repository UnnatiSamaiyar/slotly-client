// // slotly-client/lib/eventApi.ts
// "use client";

// export type EventType = {
//   id: number | string;
//   title: string;
//   slug: string;
//   duration_minutes: number;
//   description?: string | null;
//   active?: boolean;
//   created_at?: string | null;
//   user_id?: number | null;
// };

// const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// /**
//  * Dev helper: supply X-User-Id header for owner routes.
//  * Replace this behaviour with real auth when available.
//  */
// const DEV_USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID || "1";

// async function request(path: string, opts: RequestInit = {}) {
//   const headers = new Headers(opts.headers || {});
//   if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
//   // Dev auth
//   headers.set("X-User-Id", DEV_USER_ID);
//   const res = await fetch(`${BASE}${path}`, { ...opts, headers });
//   if (!res.ok) {
//     const txt = await res.text().catch(() => "");
//     throw new Error(txt || `HTTP ${res.status}`);
//   }
//   return res.json().catch(() => ({}));
// }

// export async function listEventTypes(): Promise<EventType[]> {
//   return request("/booking/profiles/me");
// }

// export async function getEventType(slug: string): Promise<EventType> {
//   return request(`/booking/profile/${encodeURIComponent(slug)}`);
// }

// export async function createEventType(payload: { title: string; duration_minutes: number; description?: string }) {
//   return request("/booking/profiles", {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// }

// export async function updateEventType(slug: string, patch: Partial<EventType>) {
//   return request(`/booking/profiles/${encodeURIComponent(slug)}`, {
//     method: "PUT",
//     body: JSON.stringify(patch),
//   });
// }

// export async function deleteEventType(slug: string) {
//   return request(`/booking/profiles/${encodeURIComponent(slug)}`, {
//     method: "DELETE",
//   });
// }







"use client";

export type EventType = {
  id: number;
  title: string;
  slug: string;
  duration_minutes: number;
  description?: string | null;
  active: boolean;
  created_at?: string | null;
  user_id?: number | null;
};

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
const DEV_USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID || "1";

async function request(path: string, opts: RequestInit = {}) {
  const headers = new Headers(opts.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("X-User-Id", DEV_USER_ID);

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }
  const json = await res.json().catch(() => ({}));

  return json;
}

export async function listEventTypes(): Promise<EventType[]> {
  const items = await request("/booking/profiles/me");

  // Fix missing active field
  return items.map((i: any) => ({
    ...i,
    active: i.active ?? true,
  }));
}

export async function getEventType(slug: string): Promise<EventType> {
  const item = await request(`/booking/profile/${encodeURIComponent(slug)}`);

  return {
    ...item,
    active: item.active ?? true,
  };
}

export async function createEventType(payload: {
  title: string;
  duration_minutes: number;
  description?: string;
}) {
  const body = {
    ...payload,
    slug: payload.title.toLowerCase().replace(/ /g, "-"),
  };

  const item = await request("/booking/profiles", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return {
    ...item,
    active: item.active ?? true,
  };
}

export async function updateEventType(
  slug: string,
  patch: Partial<EventType>
) {
  const item = await request(`/booking/profiles/${encodeURIComponent(slug)}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });

  return {
    ...item,
    active: item.active ?? true,
  };
}

export async function deleteEventType(slug: string) {
  return request(`/booking/profiles/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
}
