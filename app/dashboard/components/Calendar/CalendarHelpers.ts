// src/app/dashboard/components/Calendar/CalendarHelpers.ts

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Convert a Date -> YYYY-MM-DD in *local time* (NOT UTC).
 */
export function toISODateLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * Parse an ISO-like string into Date safely.
 */
export function safeDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

/**
 * Compare an event datetime ISO with a YYYY-MM-DD date string (local day match).
 */
export function isSameISODate(eventISO?: string, isoDate?: string) {
  const d = safeDate(eventISO);
  if (!d || !isoDate) return false;
  return toISODateLocal(d) === isoDate;
}

export function fmtTime(iso?: string) {
  const d = safeDate(iso);
  if (!d) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function fmtTimeRange(startISO?: string, endISO?: string) {
  const s = fmtTime(startISO);
  const e = fmtTime(endISO);
  if (s && e) return `${s}–${e}`;
  return s || "";
}

/**
 * Build tooltip text for a date cell from events.
 * Keeps it short and useful.
 */
export function buildDayTooltip(events: any[], maxLines = 3) {
  if (!events?.length) return "";
  const lines: string[] = [];

  for (let i = 0; i < Math.min(events.length, maxLines); i++) {
    const ev = events[i];
    const summary = ev?.summary || "Untitled";
    const tr = fmtTimeRange(ev?.start, ev?.end);
    lines.push(tr ? `${tr} • ${summary}` : summary);
  }

  if (events.length > maxLines) lines.push(`+${events.length - maxLines} more`);
  return lines.join("\n");
}
