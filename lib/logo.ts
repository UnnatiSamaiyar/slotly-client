export function toAbsoluteLogoUrl(url?: string | null) {
  if (!url) return null;

  // already absolute
  if (/^https?:\/\//i.test(url)) return url;

  const api =
    (import.meta as any).env?.VITE_API_URL ||
    (import.meta as any).env?.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";

  // url may start with /uploads...
  if (url.startsWith("/")) return `${api}${url}`;
  return `${api}/${url}`;
}
