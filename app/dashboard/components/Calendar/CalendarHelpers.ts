// src/app/dashboard/components/Calendar/CalendarHelpers.ts
export function formatEventDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
}

export function localYMD(isoOrDate?: string | null) {
  if (!isoOrDate) return null;
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isSameISODate(iso?: string | null, ymd?: string | null) {
  if (!iso || !ymd) return false;
  const isoDate = localYMD(iso);
  return isoDate === ymd;
}
