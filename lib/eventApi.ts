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

  // Optional logo shown on public page.
  brand_logo_url?: string | null;

  // Per-event duration (minutes). Stored server-side on BookingProfile keyed by slug.
  duration_minutes?: number | null;

  created_at?: string | null;
  user_id?: number | null;
};

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

/**
 * IMPORTANT:
 * Backend routes for event-types require `user_sub` query param.
 * The app stores session in localStorage under different keys depending on auth flow.
 * This helper reads sub from the most common keys WITHOUT changing auth behavior.
 */
function getUserSub(): string {
  if (typeof window === "undefined") return "";

  // direct keys
  const direct =
    localStorage.getItem("user_sub") ||
    localStorage.getItem("slotly_user_sub") ||
    localStorage.getItem("google_sub");
  if (direct && direct.trim()) return direct.trim();

  // session objects
  const keysToTry = ["slotly_user", "user", "auth_user", "slotlyUser"];
  for (const k of keysToTry) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw || raw === "null" || raw === "undefined") continue;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") continue;

      const sub = (parsed as any).sub || (parsed as any).user_sub || (parsed as any).google_sub || (parsed as any).id;
      if (typeof sub === "string" && sub.trim()) return sub.trim();

      const nested = (parsed as any).user?.sub || (parsed as any).profile?.sub;
      if (typeof nested === "string" && nested.trim()) return nested.trim();
    } catch {
      // ignore
    }
  }

  return "";
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
  duration_minutes?: number;
  timezone?: string | null;
  brand_logo_url?: string | null;
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
    duration_minutes: number;
    timezone: string | null;
    brand_logo_url: string | null;
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
