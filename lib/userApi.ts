"use client";

export type MeProfile = {
  sub: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  picture?: string | null;
  brand_logo_url?: string | null;
};

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://api.slotly.io";

/**
 * Keep consistent with lib/eventApi.ts (do not change auth behavior).
 */
function getUserSub(): string {
  if (typeof window === "undefined") return "";

  const direct =
    localStorage.getItem("user_sub") ||
    localStorage.getItem("slotly_user_sub") ||
    localStorage.getItem("google_sub");
  if (direct && direct.trim()) return direct.trim();

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

async function parseErr(res: Response): Promise<Error> {
  const txt = await res.text().catch(() => "");
  try {
    const j = JSON.parse(txt);
    return new Error(j?.detail || txt || `HTTP ${res.status}`);
  } catch {
    return new Error(txt || `HTTP ${res.status}`);
  }
}

export async function getMe(): Promise<MeProfile> {
  const user_sub = getUserSub();
  if (!user_sub) throw new Error("Missing user_sub in browser storage");

  const res = await fetch(`${BASE}/user/me?user_sub=${encodeURIComponent(user_sub)}`);
  if (!res.ok) throw await parseErr(res);
  return (await res.json()) as MeProfile;
}

export async function uploadBrandLogo(file: File): Promise<string> {
  const user_sub = getUserSub();
  if (!user_sub) throw new Error("Missing user_sub in browser storage");

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE}/user/logo?user_sub=${encodeURIComponent(user_sub)}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw await parseErr(res);
  const json = await res.json();
  return String(json?.brand_logo_url || "");
}
