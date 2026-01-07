// lib/timezone.ts
// Centralized helpers for Calendly-style *display* timezone preference.
// Principle: do NOT persist invitee/viewer timezone in DB.
// - Default = browser timezone
// - Override = localStorage (user-selected)

export const TZ_STORAGE_KEY = "slotly_tz";

// Small, safe fallback list (used only when Intl.supportedValuesOf is unavailable)
const FALLBACK_TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Australia/Sydney",
];

export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
}

export function getAllTimezones(): string[] {
  // Modern runtimes: returns IANA tz names.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/supportedValuesOf
  const anyIntl: any = Intl as any;
  const values: unknown = anyIntl?.supportedValuesOf?.("timeZone");

  if (Array.isArray(values) && values.length) {
    // Ensure stable order
    return [...new Set(values.map(String))].sort();
  }

  return FALLBACK_TIMEZONES;
}

export function isValidTimezone(tz: string): boolean {
  if (!tz) return false;
  try {
    // Will throw for invalid IANA name
    new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export function getPreferredTimezone(): string {
  if (typeof window === "undefined") return "Asia/Kolkata";
  return localStorage.getItem(TZ_STORAGE_KEY) || getBrowserTimezone();
}

export function setPreferredTimezone(tz: string) {
  if (typeof window === "undefined") return;
  if (!isValidTimezone(tz)) return;
  localStorage.setItem(TZ_STORAGE_KEY, tz);
  window.dispatchEvent(new Event("slotly:tz-change"));
}

export function subscribeTimezoneChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("slotly:tz-change", handler);
  return () => window.removeEventListener("slotly:tz-change", handler);
}
