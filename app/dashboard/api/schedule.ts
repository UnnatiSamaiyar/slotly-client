export type Schedule = {
  profile_slug: string;
  timezone: string;
  duration_minutes: number;
  availability_json: string | null;
  buffer_before_minutes: number;
  buffer_after_minutes: number;
  min_notice_minutes: number;
  max_days_ahead: number;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

export async function fetchSchedule(userSub: string): Promise<Schedule> {
  const res = await fetch(`${API_BASE}/schedule/me?user_sub=${encodeURIComponent(userSub)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSchedule(userSub: string, patch: Partial<Schedule>): Promise<Schedule> {
  const res = await fetch(`${API_BASE}/schedule/me?user_sub=${encodeURIComponent(userSub)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
