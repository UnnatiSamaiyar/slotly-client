// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   getAllTimezones,
//   getBrowserTimezone,
//   getPreferredTimezone,
//   isValidTimezone,
//   setPreferredTimezone,
//   subscribeTimezoneChange,
// } from "../../../lib/timezone";

// /**
//  * Dynamic, browser-driven timezone selector.
//  * - Default: browser timezone
//  * - Override: localStorage (no DB persistence)
//  * - Uses Intl.supportedValuesOf("timeZone") when available (dynamic list)
//  */
// export default function TimezonePicker() {
//   const zones = useMemo(() => getAllTimezones(), []);

//   const [tz, setTz] = useState<string>(() => getPreferredTimezone() || getBrowserTimezone());
//   const [draft, setDraft] = useState<string>(tz);

//   // Keep in sync if timezone is changed elsewhere
//   useEffect(() => {
//     return subscribeTimezoneChange(() => {
//       const next = getPreferredTimezone() || getBrowserTimezone();
//       setTz(next);
//       setDraft(next);
//     });
//   }, []);

//   const apply = (next: string) => {
//     const cleaned = String(next || "").trim();
//     if (!cleaned) return;
//     if (!isValidTimezone(cleaned)) return;
//     setPreferredTimezone(cleaned);
//     setTz(cleaned);
//     setDraft(cleaned);
//   };

//   const resetToBrowser = () => {
//     const b = getBrowserTimezone();
//     setPreferredTimezone(b);
//     setTz(b);
//     setDraft(b);
//   };

//   const invalid = draft.trim().length > 0 && !isValidTimezone(draft.trim());

//   return (
//     <div className="flex flex-col items-end">
//       <label className="text-[11px] text-gray-500 mb-1">Timezone</label>

//       <div className="flex items-center gap-2">
//         {/* Searchable input via datalist */}
//         <div className="relative">
//           <input
//             value={draft}
//             onChange={(e) => setDraft(e.target.value)}
//             onBlur={() => apply(draft)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 e.preventDefault();
//                 apply(draft);
//               }
//               if (e.key === "Escape") {
//                 setDraft(tz);
//               }
//             }}
//             list="slotly-timezones"
//             spellCheck={false}
//             className={
//               "w-[220px] px-3 py-2 rounded-xl border bg-white text-sm outline-none " +
//               (invalid ? "border-red-300" : "border-gray-200")
//             }
//             title="Display timezone (not stored in DB)"
//             aria-label="Timezone"
//           />

//           <datalist id="slotly-timezones">
//             {/* Ensure current tz is always present */}
//             {!zones.includes(tz) && <option value={tz} />}
//             {zones.map((z) => (
//               <option key={z} value={z} />
//             ))}
//           </datalist>
//         </div>

//         <button
//           type="button"
//           onClick={resetToBrowser}
//           className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm hover:bg-gray-50"
//           title="Reset to browser timezone"
//         >
//           Auto
//         </button>
//       </div>

//       {invalid && (
//         <div className="mt-1 text-[11px] text-red-500">Invalid timezone. Pick from the list.</div>
//       )}

//       {!invalid && tz !== getBrowserTimezone() && (
//         <div className="mt-1 text-[11px] text-gray-500">Showing times in {tz}</div>
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

const QUICK: {
  key: QuickKey;
  label: string;
  value: string; // applied timezone
  prefixes: string[]; // "related" filter scope
}[] = [
  { key: "IST", label: "IST", value: "Asia/Kolkata", prefixes: ["Asia/"] },
  { key: "UTC", label: "UTC", value: "Etc/UTC", prefixes: ["Etc/"] },
  { key: "ET", label: "US ET", value: "America/New_York", prefixes: ["America/"] },
  { key: "PT", label: "US PT", value: "America/Los_Angeles", prefixes: ["America/"] },
  { key: "AUS", label: "AUS", value: "Australia/Sydney", prefixes: ["Australia/", "Pacific/"] },
];

function norm(s: string) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\//g, " ");
}

function inferQuickFromTz(tz: string): QuickKey {
  const cleaned = String(tz || "").trim();
  if (cleaned.startsWith("Etc/")) return "UTC";
  if (cleaned.startsWith("Australia/") || cleaned.startsWith("Pacific/")) return "AUS";
  if (cleaned.startsWith("Asia/")) return "IST";
  if (cleaned.startsWith("America/")) {
    // If user is already in America/*, default to ET tab (common)
    return "ET";
  }
  // fallback
  return "IST";
}

export default function TimezonePicker() {
  const zones = useMemo(() => getAllTimezones(), []);

  const [tz, setTz] = useState<string>(() => getPreferredTimezone() || getBrowserTimezone());
  const [open, setOpen] = useState(false);

  const [activeQuick, setActiveQuick] = useState<QuickKey>(() => inferQuickFromTz(tz));
  const [q, setQ] = useState("");

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Keep in sync if timezone is changed elsewhere
  useEffect(() => {
    return subscribeTimezoneChange(() => {
      const next = getPreferredTimezone() || getBrowserTimezone();
      setTz(next);
      setActiveQuick(inferQuickFromTz(next));
    });
  }, []);

  // Click outside close
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Esc close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (open) {
      setQ("");
      // small delay so panel renders
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  const apply = (next: string) => {
    const cleaned = String(next || "").trim();
    if (!cleaned) return;
    if (!isValidTimezone(cleaned)) return;

    setPreferredTimezone(cleaned);
    setTz(cleaned);
    setActiveQuick(inferQuickFromTz(cleaned));
    setOpen(false);
  };

  const resetToBrowser = () => {
    const b = getBrowserTimezone();
    setPreferredTimezone(b);
    setTz(b);
    setActiveQuick(inferQuickFromTz(b));
    setOpen(false);
  };

  const active = useMemo(() => QUICK.find((x) => x.key === activeQuick) || QUICK[0], [activeQuick]);

  const scopedZones = useMemo(() => {
    const pfx = active.prefixes;
    const list = zones.filter((z) => pfx.some((p) => z.startsWith(p)));

    // Ensure the active quick value appears at top if present in global list
    const head: string[] = [];
    if (zones.includes(active.value)) head.push(active.value);

    // Ensure current tz is always selectable even if outside scope
    if (tz && !head.includes(tz)) head.push(tz);

    // Merge unique
    const seen = new Set<string>();
    const out: string[] = [];
    for (const z of [...head, ...list]) {
      if (seen.has(z)) continue;
      seen.add(z);
      out.push(z);
    }

    // Sort after first 2 items (keep head at top)
    const keep = out.slice(0, head.length);
    const rest = out.slice(head.length).sort((a, b) => a.localeCompare(b));
    return [...keep, ...rest];
  }, [zones, active, tz]);

  const filtered = useMemo(() => {
    const nq = norm(q);
    if (!nq) return scopedZones;
    return scopedZones.filter((z) => norm(z).includes(nq));
  }, [scopedZones, q]);

  const browserTz = getBrowserTimezone();
  const showingCustom = tz !== browserTz;

  return (
    <div ref={wrapRef} className="relative inline-block w-full max-w-[360px]">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-medium text-gray-600">Timezone</label>
        <span className="text-[11px] text-gray-500">{showingCustom ? "Custom" : "Auto"}</span>
      </div>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "w-full h-11 rounded-2xl border bg-white shadow-sm px-3",
          "flex items-center justify-between gap-3",
          "hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30",
        ].join(" ")}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Display timezone (not stored in DB)"
      >
        <div className="min-w-0 text-left">
          <div className="text-[12px] text-gray-500">Display timezone</div>
          <div className="text-sm font-medium text-gray-900 truncate">{tz}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] text-gray-700">
            {active.label}
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-400" fill="none" aria-hidden="true">
            <path
              d="M7 10l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          {/* Quick picks */}
          <div className="p-2">
            <div className="grid grid-cols-5 gap-1">
              {QUICK.map((x) => {
                const on = x.key === activeQuick;
                return (
                  <button
                    key={x.key}
                    type="button"
                    onClick={() => {
                      setActiveQuick(x.key);
                      // when user switches tab, keep search focused
                      setTimeout(() => searchRef.current?.focus(), 0);
                    }}
                    className={[
                      "h-9 rounded-xl text-[12px] font-semibold transition",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/30",
                      on ? "bg-gray-900 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
                    ].join(" ")}
                    aria-pressed={on}
                    title={`Filter: ${x.label}`}
                  >
                    {x.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search + actions */}
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M21 21l-4.3-4.3m1.3-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  ref={searchRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Search timezone (e.g., Kolkata, New York, UTC)"
                  spellCheck={false}
                />
              </div>

              <button
                type="button"
                onClick={resetToBrowser}
                className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                title="Reset to browser timezone"
              >
                Auto
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[280px] overflow-auto border-t border-gray-100">
            {filtered.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No results.</div>
            ) : (
              <ul className="py-1">
                {filtered.slice(0, 300).map((z) => {
                  const selected = z === tz;
                  return (
                    <li key={z}>
                      <button
                        type="button"
                        onClick={() => apply(z)}
                        className={[
                          "w-full px-3 py-2 text-left text-sm flex items-center justify-between gap-3",
                          "hover:bg-gray-50",
                          selected ? "bg-blue-50/60" : "",
                        ].join(" ")}
                      >
                        <span className="truncate text-gray-900">{z}</span>
                        {selected && (
                          <span className="shrink-0 text-[11px] font-semibold text-blue-700">Selected</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer helper */}
          <div className="px-3 py-2 border-t border-gray-100 text-[11px] text-gray-500">
            {showingCustom ? (
              <>
                Showing times in <span className="font-medium text-gray-700">{tz}</span>
              </>
            ) : (
              <>
                Using browser timezone <span className="font-medium text-gray-700">{browserTz}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
