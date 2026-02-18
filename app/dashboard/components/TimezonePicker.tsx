// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   getAllTimezones,
//   getBrowserTimezone,
//   getPreferredTimezone,
//   isValidTimezone,
//   setPreferredTimezone,
//   subscribeTimezoneChange,
// } from "../../../lib/timezone";

// type QuickKey = "IST" | "UTC" | "ET" | "PT" | "AUS";

// const QUICK: {
//   key: QuickKey;
//   label: string;
//   value: string;
//   prefixes: string[];
// }[] = [
//   { key: "IST", label: "IST", value: "Asia/Kolkata", prefixes: ["Asia/"] },
//   { key: "UTC", label: "UTC", value: "Etc/UTC", prefixes: ["Etc/"] },
//   { key: "ET", label: "US ET", value: "America/New_York", prefixes: ["America/"] },
//   { key: "PT", label: "US PT", value: "America/Los_Angeles", prefixes: ["America/"] },
//   { key: "AUS", label: "AUS", value: "Australia/Sydney", prefixes: ["Australia/", "Pacific/"] },
// ];

// function norm(s: string) {
//   return String(s || "")
//     .trim()
//     .toLowerCase()
//     .replace(/_/g, " ")
//     .replace(/\//g, " ");
// }

// function inferQuickFromTz(tz: string): QuickKey {
//   const cleaned = String(tz || "").trim();
//   if (cleaned.startsWith("Etc/")) return "UTC";
//   if (cleaned.startsWith("Australia/") || cleaned.startsWith("Pacific/")) return "AUS";
//   if (cleaned.startsWith("Asia/")) return "IST";
//   if (cleaned.startsWith("America/")) return "ET";
//   return "IST";
// }

// function pad2(n: number) {
//   return String(n).padStart(2, "0");
// }

// /**
//  * Returns an offset label in UTC format, e.g. "UTC+05:30".
//  * Uses Intl timeZoneName: 'shortOffset' when available.
//  */
// function utcOffsetLabel(timeZone: string): string {
//   const tz = String(timeZone || "").trim();
//   if (!tz) return "UTC+00:00";

//   try {
//     const parts = new Intl.DateTimeFormat("en-US", {
//       timeZone: tz,
//       timeZoneName: "shortOffset" as any,
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     }).formatToParts(new Date());

//     const raw = parts.find((p) => p.type === "timeZoneName")?.value || "";

//     // Examples: "GMT", "GMT+5", "GMT+05:30", "UTC" (rare)
//     if (raw === "GMT" || raw === "UTC") return "UTC+00:00";

//     const m = raw.match(/(GMT|UTC)([+-])(\d{1,2})(?::?(\d{2}))?/i);
//     if (m) {
//       const sign = m[2] === "-" ? "-" : "+";
//       const hh = pad2(Number(m[3] || 0));
//       const mm = pad2(Number(m[4] || 0));
//       return `UTC${sign}${hh}:${mm}`;
//     }
//   } catch {
//     // ignore
//   }

//   // Fallback: just show UTC
//   return "UTC";
// }

// export default function TimezonePicker({
//   compact = false,
//   value,
//   onChange,
//   label = "Timezone",
//   title,
//   allowAuto = true,
//   helperText,
// }: {
//   compact?: boolean;
//   /** Controlled timezone (field mode). If omitted, picker uses localStorage preference (display mode). */
//   value?: string;
//   /** Controlled change handler (field mode). If omitted, picker persists to localStorage (display mode). */
//   onChange?: (tz: string) => void;
//   label?: string;
//   title?: string;
//   allowAuto?: boolean;
//   helperText?: React.ReactNode;
// }) {
//   const zones = useMemo(() => getAllTimezones(), []);

//   const controlled = typeof value === "string" && typeof onChange === "function";
//   const browserTz = getBrowserTimezone();

//   const [internalTz, setInternalTz] = useState<string>(() => getPreferredTimezone() || browserTz);
//   const tz = controlled ? (value || "") : internalTz;

//   const [open, setOpen] = useState(false);
//   const [activeQuick, setActiveQuick] = useState<QuickKey>(() => inferQuickFromTz(tz));
//   const [q, setQ] = useState("");

//   const wrapRef = useRef<HTMLDivElement | null>(null);
//   const triggerRef = useRef<HTMLButtonElement | null>(null);
//   const searchRef = useRef<HTMLInputElement | null>(null);

//   // ✅ for fixed-position panel (compact mode)
//   const [panelPos, setPanelPos] = useState<{ top: number; left: number; width: number }>({
//     top: 0,
//     left: 0,
//     width: 320,
//   });

//   // Keep in sync if timezone is changed elsewhere (display mode only)
//   useEffect(() => {
//     if (controlled) return;
//     return subscribeTimezoneChange(() => {
//       const next = getPreferredTimezone() || getBrowserTimezone();
//       setInternalTz(next);
//       setActiveQuick(inferQuickFromTz(next));
//     });
//   }, [controlled]);

//   // Keep quick tab in sync when controlled value changes
//   useEffect(() => {
//     setActiveQuick(inferQuickFromTz(tz));
//   }, [tz]);

//   // Click outside close
//   useEffect(() => {
//     const onDown = (e: MouseEvent) => {
//       if (!wrapRef.current) return;
//       if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", onDown);
//     return () => document.removeEventListener("mousedown", onDown);
//   }, []);

//   // Esc close
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setOpen(false);
//     };
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, []);

//   // Focus search + compute panel position on open
//   useEffect(() => {
//     if (!open) return;
//     setQ("");

//     if (compact && triggerRef.current) {
//       const rect = triggerRef.current.getBoundingClientRect();
//       const w = Math.min(window.innerWidth * 0.92, 420);
//       const margin = 10;

//       let left = rect.right - w;
//       left = Math.max(margin, Math.min(left, window.innerWidth - w - margin));
//       let top = rect.bottom + 10;
//       const maxTop = window.innerHeight - 180;
//       top = Math.min(top, maxTop);
//       setPanelPos({ top, left, width: w });
//     }

//     setTimeout(() => searchRef.current?.focus(), 0);
//   }, [open, compact]);

//   // Reposition on resize/scroll when open (compact)
//   useEffect(() => {
//     if (!open || !compact) return;

//     const recompute = () => {
//       if (!triggerRef.current) return;
//       const rect = triggerRef.current.getBoundingClientRect();
//       const w = Math.min(window.innerWidth * 0.92, 420);
//       const margin = 10;

//       let left = rect.right - w;
//       left = Math.max(margin, Math.min(left, window.innerWidth - w - margin));

//       let top = rect.bottom + 10;
//       const maxTop = window.innerHeight - 180;
//       top = Math.min(top, maxTop);

//       setPanelPos({ top, left, width: w });
//     };

//     window.addEventListener("resize", recompute);
//     window.addEventListener("scroll", recompute, true);
//     return () => {
//       window.removeEventListener("resize", recompute);
//       window.removeEventListener("scroll", recompute, true);
//     };
//   }, [open, compact]);

//   const apply = (next: string) => {
//     const cleaned = String(next || "").trim();
//     if (!cleaned) return;
//     if (!isValidTimezone(cleaned)) return;

//     if (controlled) {
//       onChange(cleaned);
//     } else {
//       setPreferredTimezone(cleaned);
//       setInternalTz(cleaned);
//     }

//     setActiveQuick(inferQuickFromTz(cleaned));
//     setOpen(false);
//   };

//   const resetToBrowser = () => {
//     const b = getBrowserTimezone();
//     if (controlled) {
//       onChange(b);
//     } else {
//       setPreferredTimezone(b);
//       setInternalTz(b);
//     }
//     setActiveQuick(inferQuickFromTz(b));
//     setOpen(false);
//   };

//   const active = useMemo(() => QUICK.find((x) => x.key === activeQuick) || QUICK[0], [activeQuick]);

//   const scopedZones = useMemo(() => {
//     const pfx = active.prefixes;
//     const list = zones.filter((z) => pfx.some((p) => z.startsWith(p)));

//     const head: string[] = [];
//     if (zones.includes(active.value)) head.push(active.value);
//     if (tz && !head.includes(tz)) head.push(tz);

//     const seen = new Set<string>();
//     const out: string[] = [];
//     for (const z of [...head, ...list]) {
//       if (seen.has(z)) continue;
//       seen.add(z);
//       out.push(z);
//     }

//     const keep = out.slice(0, head.length);
//     const rest = out.slice(head.length).sort((a, b) => a.localeCompare(b));
//     return [...keep, ...rest];
//   }, [zones, active, tz]);

//   const filtered = useMemo(() => {
//     const nq = norm(q);
//     if (!nq) return scopedZones;
//     return scopedZones.filter((z) => {
//       const label = `${utcOffsetLabel(z)} ${z}`;
//       return norm(label).includes(nq);
//     });
//   }, [scopedZones, q]);

//   const showingCustom = tz !== browserTz;
//   const tzOffset = tz ? utcOffsetLabel(tz) : "UTC";

//   return (
//     <div ref={wrapRef} className={compact ? "relative inline-block" : "relative inline-block w-full max-w-[360px]"}>
//       {!compact && (
//         <div className="flex items-center justify-between mb-1">
//           <label className="text-[11px] font-medium text-gray-600">{label}</label>
//           <span className="text-[11px] text-gray-500">{showingCustom ? "Custom" : "Auto"}</span>
//         </div>
//       )}

//       {/* Trigger */}
//       <button
//         ref={triggerRef}
//         type="button"
//         onClick={() => setOpen((v) => !v)}
//         className={
//           compact
//             ? [
//                 "h-10 px-3 rounded-xl border bg-white shadow-sm",
//                 "flex items-center justify-between gap-2",
//                 "hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30",
//               ].join(" ")
//             : [
//                 "w-full h-11 rounded-2xl border bg-white shadow-sm px-3",
//                 "flex items-center justify-between gap-3",
//                 "hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30",
//               ].join(" ")
//         }
//         aria-haspopup="dialog"
//         aria-expanded={open}
//         title={title || "Timezone"}
//       >
//         {!compact ? (
//           <div className="min-w-0 text-left">
//             <div className="text-sm font-semibold text-gray-900 truncate">{tzOffset}</div>
//             <div className="text-[11px] text-gray-600 truncate">{tz}</div>
//           </div>
//         ) : (
//           <div className="text-xs font-semibold text-gray-700">{tzOffset}</div>
//         )}

//         <div className="flex items-center gap-2 shrink-0">
//           {!compact && (
//             <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] text-gray-700">
//               {active.label}
//             </span>
//           )}
//           <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-400" fill="none" aria-hidden="true">
//             <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//         </div>
//       </button>

//       {/* ✅ Overlay for compact mode (mobile): closes on tap */}
//       {open && compact && (
//         <button type="button" aria-label="Close timezone" onClick={() => setOpen(false)} className="fixed inset-0 z-[48] bg-black/5" />
//       )}

//       {/* Panel */}
//       {open && (
//         <div
//           className={[
//             compact
//               ? "fixed z-[50] rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
//               : "absolute z-50 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden",
//           ].join(" ")}
//           style={compact ? { top: panelPos.top, left: panelPos.left, width: panelPos.width } : undefined}
//         >
//           {/* Quick picks */}
//           <div className="p-2">
//             <div className="grid grid-cols-5 gap-1">
//               {QUICK.map((x) => {
//                 const on = x.key === activeQuick;
//                 return (
//                   <button
//                     key={x.key}
//                     type="button"
//                     onClick={() => {
//                       setActiveQuick(x.key);
//                       setTimeout(() => searchRef.current?.focus(), 0);
//                     }}
//                     className={[
//                       "h-9 rounded-xl text-[12px] font-semibold transition",
//                       "focus:outline-none focus:ring-2 focus:ring-blue-500/30",
//                       on ? "bg-gray-900 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
//                     ].join(" ")}
//                     aria-pressed={on}
//                     title={`Filter: ${x.label}`}
//                   >
//                     {x.label}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Search + actions */}
//           <div className="px-3 pb-3">
//             <div className="flex items-center gap-2">
//               <div className="relative flex-1">
//                 <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//                     <path
//                       d="M21 21l-4.3-4.3m1.3-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//                 <input
//                   ref={searchRef}
//                   value={q}
//                   onChange={(e) => setQ(e.target.value)}
//                   className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
//                   placeholder="Search timezone (e.g., UTC+04:00, Dubai, Kolkata)"
//                   spellCheck={false}
//                 />
//               </div>

//               {allowAuto && (
//                 <button
//                   type="button"
//                   onClick={resetToBrowser}
//                   className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
//                   title="Reset to browser timezone"
//                 >
//                   Auto
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* List */}
//           <div className="overflow-auto border-t border-gray-100 max-h-[52vh] sm:max-h-[280px]">
//             {filtered.length === 0 ? (
//               <div className="p-4 text-sm text-gray-500">No results.</div>
//             ) : (
//               <ul className="py-1">
//                 {filtered.slice(0, 300).map((z) => {
//                   const selected = z === tz;
//                   const off = utcOffsetLabel(z);
//                   return (
//                     <li key={z}>
//                       <button
//                         type="button"
//                         onClick={() => apply(z)}
//                         className={[
//                           "w-full px-3 py-2 text-left text-sm flex items-center justify-between gap-3",
//                           "hover:bg-gray-50",
//                           selected ? "bg-blue-50/60" : "",
//                         ].join(" ")}
//                       >
//                         <div className="min-w-0">
//                           <div className="text-[12px] font-semibold text-gray-900 truncate">{off}</div>
//                           <div className="text-[12px] text-gray-600 truncate">{z}</div>
//                         </div>
//                         {selected && <span className="shrink-0 text-[11px] font-semibold text-blue-700">Selected</span>}
//                       </button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </div>

//           {/* Footer helper */}
//           <div className="px-3 py-2 border-t border-gray-100 text-[11px] text-gray-500">
//             {helperText ? (
//               helperText
//             ) : showingCustom ? (
//               <>
//                 Showing times in <span className="font-medium text-gray-700">{tz}</span>
//               </>
//             ) : (
//               <>
//                 Using browser timezone <span className="font-medium text-gray-700">{browserTz}</span>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getAllTimezones,
  getBrowserTimezone,
  getPreferredTimezone,
  isValidTimezone,
  setPreferredTimezone,
  subscribeTimezoneChange,
} from "../../../lib/timezone";

type QuickKey = "IST" | "UTC" | "ET" | "PT" | "AUS";

const QUICK = [
  { key: "IST", label: "IST", value: "Asia/Kolkata", prefixes: ["Asia/"] },
  { key: "UTC", label: "UTC", value: "Etc/UTC", prefixes: ["Etc/"] },
  { key: "ET", label: "US ET", value: "America/New_York", prefixes: ["America/"] },
  { key: "PT", label: "US PT", value: "America/Los_Angeles", prefixes: ["America/"] },
  { key: "AUS", label: "AUS", value: "Australia/Sydney", prefixes: ["Australia/", "Pacific/"] },
];

function inferQuickFromTz(tz: string): QuickKey {
  if (tz.startsWith("Etc/")) return "UTC";
  if (tz.startsWith("Australia/") || tz.startsWith("Pacific/")) return "AUS";
  if (tz.startsWith("Asia/")) return "IST";
  if (tz.startsWith("America/")) return "ET";
  return "IST";
}

function utcOffsetLabel(timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset" as any,
    }).formatToParts(new Date());

    const raw = parts.find((p) => p.type === "timeZoneName")?.value || "";
    if (!raw || raw === "GMT" || raw === "UTC") return "UTC+00:00";
    return raw.replace("GMT", "UTC");
  } catch {
    return "UTC";
  }
}

export default function TimezonePicker({
  compact = false,
  value,
  onChange,
  label = "Timezone",
  allowAuto = true,
}: {
  compact?: boolean;
  value?: string;
  onChange?: (tz: string) => void;
  label?: string;
  allowAuto?: boolean;
}) {
  const zones = useMemo(() => getAllTimezones(), []);

  /* ✅ HYDRATION FIX */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const controlled = typeof value === "string" && typeof onChange === "function";
  const browserTz = getBrowserTimezone();

  const [internalTz, setInternalTz] = useState(
    () => getPreferredTimezone() || browserTz
  );

  const tz = controlled ? value || "" : internalTz;
  const [open, setOpen] = useState(false);
  const [activeQuick, setActiveQuick] = useState<QuickKey>(() =>
    inferQuickFromTz(tz)
  );

  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (controlled) return;
    return subscribeTimezoneChange(() => {
      const next = getPreferredTimezone() || getBrowserTimezone();
      setInternalTz(next);
      setActiveQuick(inferQuickFromTz(next));
    });
  }, [controlled]);

  const apply = (next: string) => {
    if (!isValidTimezone(next)) return;

    if (controlled) onChange?.(next);
    else {
      setPreferredTimezone(next);
      setInternalTz(next);
    }

    setActiveQuick(inferQuickFromTz(next));
    setOpen(false);
  };

  const showingCustom = tz !== browserTz;
  const tzOffset = tz ? utcOffsetLabel(tz) : "UTC";

  return (
    <div
      ref={wrapRef}
      className={
        compact
          ? "relative inline-block w-auto"
          : "relative inline-block w-full max-w-[360px]"
      }
    >
      {!compact && (
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-medium text-gray-600">
            {label}
          </label>

          {/* ✅ HYDRATION SAFE */}
          <span className="text-[11px] text-gray-500">
            {mounted ? (showingCustom ? "Custom" : "Auto") : ""}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          compact
            ? "h-9 px-3 rounded-xl border bg-white shadow-sm flex items-center gap-2 whitespace-nowrap hover:bg-gray-50 transition"
            : "w-full h-11 rounded-2xl border bg-white shadow-sm px-3 flex items-center justify-between gap-3"
        }
      >
        {compact ? (
          <span className="text-xs font-semibold text-gray-700">
            {mounted ? tzOffset : ""}
          </span>
        ) : (
          <div className="text-left min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {mounted ? tzOffset : ""}
            </div>
            <div className="text-[11px] text-gray-600 truncate">
              {mounted ? tz : ""}
            </div>
          </div>
        )}

        <span className="text-xs border px-2 py-0.5 rounded-full">
          {activeQuick}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border bg-white shadow-xl overflow-hidden">
          <ul className="max-h-[280px] overflow-auto">
            {zones.map((z) => (
              <li key={z}>
                <button
                  onClick={() => apply(z)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50"
                >
                  <div className="text-xs font-semibold">
                    {utcOffsetLabel(z)}
                  </div>
                  <div className="text-xs text-gray-500">{z}</div>
                </button>
              </li>
            ))}
          </ul>

          {allowAuto && (
            <button
              onClick={() => apply(browserTz)}
              className="w-full border-t py-2 text-sm text-blue-600"
            >
              Auto (Browser)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
