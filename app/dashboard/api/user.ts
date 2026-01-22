// src/app/dashboard/api/user.ts
import { UserProfile } from "../types";

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_API || "https://api.slotly.io";

export async function fetchUserProfile(userSub: string): Promise<UserProfile> {
  const res = await fetch(`${AUTH_BASE}/user/me?user_sub=${encodeURIComponent(userSub)}`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  // normalize
  return {
  sub: data.sub,
  name: data.name,
  email: data.email,
  avatarUrl: data.avatar_url,
  username: data.username,

  profile_title: data.profile_title,
  host_name: data.host_name,
  timezone: data.timezone,
  slug: data.slug,
  has_booking_profile: data.has_booking_profile
};

}

export async function updateUserTimezone(userSub: string, timezone: string): Promise<{ ok: boolean; timezone: string }> {
  const res = await fetch(
    `${AUTH_BASE}/user/timezone?user_sub=${encodeURIComponent(userSub)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timezone }),
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
