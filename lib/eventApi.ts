"use client";

export type MeetingMode = "google_meet" | "in_person";

export type EventType = {
  id: number;
  title: string;
  slug: string;

  meeting_mode: MeetingMode;
  location?: string | null;

  availability_json?: string | null;
  timezone?: string | null;

  created_at?: string | null;
  user_id?: number | null;
};

const BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.slotly.io";

/**
 * IMPORTANT:
 * Your backend routes for event-types require `user_sub` query param.
 * We read it from localStorage by default (no refactor to auth system).
 * Store it wherever you already store user sub (example: "user_sub").
 */
function getUserSub(): string {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("user_sub") ||
    localStorage.getItem("slotly_user_sub") ||
    ""
  );
}

async function request(path: string, opts: RequestInit = {}) {
  const headers = new Headers(opts.headers || {});
  headers.set("Content-Type", "application/json");

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    // FastAPI often returns {"detail": "..."} as JSON; try parsing
    try {
      const j = JSON.parse(txt);
      throw new Error(j?.detail || txt || `HTTP ${res.status}`);
    } catch {
      throw new Error(txt || `HTTP ${res.status}`);
    }
  }

  const json = await res.json().catch(() => ({}));
  return json;
}

/**
 * GET /event-types/list?user_sub=...
 */
export async function listEventTypes(): Promise<EventType[]> {
  const user_sub = getUserSub();
  if (!user_sub) throw new Error("Missing user_sub in browser storage");

  const data = await request(`/event-types/list?user_sub=${encodeURIComponent(user_sub)}`);
  return data.event_types || [];
}

/**
 * GET /event-types/{id}
 */
export async function getEventType(id: number): Promise<EventType | null> {
  const data = await request(`/event-types/${id}`);
  return data.event_type || null;
}

/**
 * POST /event-types/create?user_sub=...
 */
export async function createEventType(payload: {
  title: string;
  meeting_mode: MeetingMode;
  location?: string;
  availability_json?: string;
  timezone?: string | null;
}): Promise<EventType> {
  const user_sub = getUserSub();
  if (!user_sub) throw new Error("Missing user_sub in browser storage");

  const data = await request(`/event-types/create?user_sub=${encodeURIComponent(user_sub)}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data.event_type;
}

/**
 * PUT /event-types/{id}?user_sub=...
 */
export async function updateEventType(
  id: number,
  patch: Partial<{
    title: string;
    meeting_mode: MeetingMode;
    location: string;
    availability_json: string;
    timezone: string | null;
  }>
): Promise<EventType> {
  const user_sub = getUserSub();
  if (!user_sub) throw new Error("Missing user_sub in browser storage");

  const data = await request(`/event-types/${id}?user_sub=${encodeURIComponent(user_sub)}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });

  return data.event_type;
}

/**
 * DELETE /event-types/{id}?user_sub=...
 */
export async function deleteEventType(id: number) {
  const user_sub = getUserSub();
  if (!user_sub) throw new Error("Missing user_sub in browser storage");

  return request(`/event-types/${id}?user_sub=${encodeURIComponent(user_sub)}`, {
    method: "DELETE",
  });
}
