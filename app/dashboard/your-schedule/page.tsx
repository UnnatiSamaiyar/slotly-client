// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import Sidebar from "../components/Sidebar/Sidebar";
// import Topbar from "../components/Topbar/Topbar";
// import { useToast } from "@/hooks/use-toast";
// import { useUserProfile } from "../hooks/useUserProfile";
// import { fetchSchedule, updateSchedule, type Schedule } from "../api/schedule";

// type WeekRule = {
//   start: string;
//   end: string;
//   enabled: boolean;
// };

// type DateOverride = {
//   date: string; // YYYY-MM-DD
//   mode: "available" | "unavailable";
//   start: string;
//   end: string;
// };

// type DateBlock = {
//   date: string; // YYYY-MM-DD
//   start: string;
//   end: string;
// };

// type DateRangeRule = {
//   id: string;
//   start_date: string; // YYYY-MM-DD
//   end_date: string; // YYYY-MM-DD
//   days: number[]; // 0=Mon ... 6=Sun
//   start: string;
//   end: string;
// };

// const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// function defaultWeek(): Record<string, WeekRule> {
//   return {
//     "0": { enabled: true, start: "09:00", end: "17:00" },
//     "1": { enabled: true, start: "09:00", end: "17:00" },
//     "2": { enabled: true, start: "09:00", end: "17:00" },
//     "3": { enabled: true, start: "09:00", end: "17:00" },
//     "4": { enabled: true, start: "09:00", end: "17:00" },
//     "5": { enabled: false, start: "09:00", end: "17:00" },
//     "6": { enabled: false, start: "09:00", end: "17:00" },
//   };
// }

// function fromAvailabilityJson(raw?: string | null): Record<string, WeekRule> {
//   const base = defaultWeek();
//   if (!raw) return base;
//   try {
//     const data = JSON.parse(raw);
//     const week = data?.week || data?.weekly || data?.rules;
//     if (typeof week !== "object" || !week) return base;
//     for (const k of Object.keys(base)) {
//       const intervals = week[k];
//       if (!Array.isArray(intervals) || !intervals.length) {
//         base[k].enabled = false;
//         continue;
//       }
//       const first = intervals[0] || {};
//       base[k].enabled = true;
//       base[k].start = String(first.start || base[k].start);
//       base[k].end = String(first.end || base[k].end);
//     }
//   } catch {
//     return base;
//   }
//   return base;
// }

// function detectBrowserTimeZone(): string {
//   try {
//     return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
//   } catch {
//     return "UTC";
//   }
// }

// function parseOverrides(raw?: string | null): DateOverride[] {
//   if (!raw) return [];
//   try {
//     const data = JSON.parse(raw);
//     const overrides = data?.overrides;
//     if (!overrides || typeof overrides !== "object") return [];
//     const out: DateOverride[] = [];
//     for (const date of Object.keys(overrides)) {
//       const v = overrides[date];

//       // legacy list: intervals override (or [] unavailable)
//       if (Array.isArray(v)) {
//         if (v.length > 0) {
//           const first = v[0] || {};
//           out.push({
//             date,
//             mode: "available",
//             start: String(first.start || "09:00"),
//             end: String(first.end || "17:00"),
//           });
//         } else {
//           out.push({ date, mode: "unavailable", start: "09:00", end: "17:00" });
//         }
//         continue;
//       }

//       // new shape: { intervals?:[], blocks?:[] }
//       if (v && typeof v === "object") {
//         const intervals = (v as any).intervals;
//         if (intervals === undefined || intervals === null) {
//           // inherit base; don't create an override row unless explicitly unavailable
//           continue;
//         }
//         if (Array.isArray(intervals) && intervals.length > 0) {
//           const first = intervals[0] || {};
//           out.push({
//             date,
//             mode: "available",
//             start: String(first.start || "09:00"),
//             end: String(first.end || "17:00"),
//           });
//         } else {
//           out.push({ date, mode: "unavailable", start: "09:00", end: "17:00" });
//         }
//       }
//     }
//     return out.sort((a, b) => a.date.localeCompare(b.date));
//   } catch {
//     return [];
//   }
// }

// function parseBlocks(raw?: string | null): DateBlock[] {
//   if (!raw) return [];
//   try {
//     const data = JSON.parse(raw);
//     const overrides = data?.overrides;
//     if (!overrides || typeof overrides !== "object") return [];
//     const out: DateBlock[] = [];
//     for (const date of Object.keys(overrides)) {
//       const v = overrides[date];
//       if (v && typeof v === "object" && !Array.isArray(v)) {
//         const blocks = (v as any).blocks;
//         if (Array.isArray(blocks)) {
//           for (const b of blocks) {
//             if (!b) continue;
//             out.push({
//               date,
//               start: String((b as any).start || ""),
//               end: String((b as any).end || ""),
//             });
//           }
//         }
//       }
//     }
//     return out
//       .filter((x) => x.date && x.start && x.end)
//       .sort((a, b) => (a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)));
//   } catch {
//     return [];
//   }
// }

// function parseRanges(raw?: string | null): DateRangeRule[] {
//   if (!raw) return [];
//   try {
//     const data = JSON.parse(raw);
//     const ranges = data?.ranges;
//     if (!Array.isArray(ranges)) return [];
//     return ranges
//       .filter((r: any) => r && r.start_date && r.end_date)
//       .map((r: any, idx: number) => ({
//         id: String(r.id || `${r.start_date}_${r.end_date}_${idx}`),
//         start_date: String(r.start_date),
//         end_date: String(r.end_date),
//         days: Array.isArray(r.days) ? r.days.map((d: any) => Number(d)) : [0, 1, 2, 3, 4],
//         start: String((r.intervals?.[0]?.start) || r.start || "09:00"),
//         end: String((r.intervals?.[0]?.end) || r.end || "17:00"),
//       }))
//       .sort((a, b) => a.start_date.localeCompare(b.start_date));
//   } catch {
//     return [];
//   }
// }

// function buildAvailabilityJson(
//   week: Record<string, WeekRule>,
//   overrides: DateOverride[],
//   blocks: DateBlock[],
//   ranges: DateRangeRule[]
// ): string {
//   const out: any = { week: {}, overrides: {}, ranges: [] };
//   for (const k of Object.keys(week)) {
//     const r = week[k];
//     out.week[k] = r.enabled ? [{ start: r.start, end: r.end }] : [];
//   }

//   // Start overrides with explicit intervals (or [] for unavailable)
//   for (const o of overrides) {
//     if (!o?.date) continue;
//     if (o.mode === "unavailable") {
//       out.overrides[o.date] = [];
//     } else {
//       // store as object so we can attach blocks too
//       out.overrides[o.date] = { intervals: [{ start: o.start, end: o.end }], blocks: [] };
//     }
//   }

//   // Attach blocks per date (inherit base intervals if not overriding)
//   for (const b of blocks) {
//     if (!b?.date) continue;
//     if (!b.start || !b.end || b.end <= b.start) continue;

//     const existing = out.overrides[b.date];

//     // If unavailable all day (legacy []), keep it unavailable; blocks don't matter.
//     if (Array.isArray(existing)) continue;

//     if (!existing) {
//       out.overrides[b.date] = { intervals: null, blocks: [{ start: b.start, end: b.end }] };
//       continue;
//     }

//     // existing object
//     if (typeof existing === "object") {
//       existing.blocks = Array.isArray(existing.blocks) ? existing.blocks : [];
//       existing.blocks.push({ start: b.start, end: b.end });
//     }
//   }

//   // Date range rules
//   out.ranges = (ranges || [])
//     .filter((r) => r.start_date && r.end_date && r.end > r.start)
//     .map((r) => ({
//       id: r.id,
//       start_date: r.start_date,
//       end_date: r.end_date,
//       days: Array.isArray(r.days) && r.days.length ? r.days : [0, 1, 2, 3, 4],
//       intervals: [{ start: r.start, end: r.end }],
//     }));

//   return JSON.stringify(out);
// }

// export default function YourSchedulePage() {
//   const { toast } = useToast();

//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [userSub, setUserSub] = useState<string | null>(null);

//   useEffect(() => {
//     const saved = localStorage.getItem("slotly_user");
//     if (!saved) return;
//     try {
//       const parsed = JSON.parse(saved);
//       setUserSub(parsed.sub);
//     } catch {}
//   }, []);

//   const { data: user } = useUserProfile(userSub);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [schedule, setSchedule] = useState<Schedule | null>(null);
//   const [week, setWeek] = useState<Record<string, WeekRule>>(defaultWeek());
//   const [rawJsonMode, setRawJsonMode] = useState(false);
//   const [rawJson, setRawJson] = useState<string>("");

//   // Date overrides (non-JSON mode)
//   const [overrides, setOverrides] = useState<DateOverride[]>([]);
//   const [overrideDate, setOverrideDate] = useState<string>("");
//   const [overrideMode, setOverrideMode] = useState<DateOverride["mode"]>("available");
//   const [overrideStart, setOverrideStart] = useState<string>("09:00");
//   const [overrideEnd, setOverrideEnd] = useState<string>("17:00");

//   // Time blocks inside a specific date (e.g. 14:00-16:00 unavailable)
//   const [blocks, setBlocks] = useState<DateBlock[]>([]);
//   const [blockDate, setBlockDate] = useState<string>("");
//   const [blockStart, setBlockStart] = useState<string>("14:00");
//   const [blockEnd, setBlockEnd] = useState<string>("16:00");

//   // Date range availability rules
//   const [ranges, setRanges] = useState<DateRangeRule[]>([]);
//   const [rangeStartDate, setRangeStartDate] = useState<string>("");
//   const [rangeEndDate, setRangeEndDate] = useState<string>("");
//   const [rangeStartTime, setRangeStartTime] = useState<string>("09:00");
//   const [rangeEndTime, setRangeEndTime] = useState<string>("17:00");
//   const [rangeDays, setRangeDays] = useState<number[]>([0, 1, 2, 3, 4]);

//   const tzOptions = useMemo(() => {
//     try {
//       // @ts-ignore
//       const list = (Intl as any).supportedValuesOf?.("timeZone") as string[] | undefined;
//       if (Array.isArray(list) && list.length) return list;
//     } catch {}
//     return [
//       "Asia/Kolkata",
//       "Asia/Dubai",
//       "Asia/Singapore",
//       "Europe/London",
//       "Europe/Paris",
//       "America/New_York",
//       "America/Los_Angeles",
//       "UTC",
//     ];
//   }, []);

//   useEffect(() => {
//     if (!userSub) return;
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       try {
//         const data = await fetchSchedule(userSub);
//         if (!mounted) return;

//         const detectedTz = detectBrowserTimeZone();
//         const normalized = {
//           ...data,
//           timezone: (data?.timezone || "").trim() || detectedTz,
//         };

//         setSchedule(normalized);
//         setWeek(fromAvailabilityJson(normalized.availability_json));
//         setOverrides(parseOverrides(normalized.availability_json));
//         setBlocks(parseBlocks(normalized.availability_json));
//         setRanges(parseRanges(normalized.availability_json));
//         setRawJson(
//           normalized.availability_json || buildAvailabilityJson(fromAvailabilityJson(null), [], [], [])
//         );

//         // Save detected timezone once if blank
//         if (!data?.timezone || !String(data.timezone).trim()) {
//           try {
//             await updateSchedule(userSub, { timezone: detectedTz });
//           } catch {}
//         }
//       } catch (e: any) {
//         toast({
//           title: "Failed to load schedule",
//           description: e?.message || "Please try again.",
//           variant: "destructive",
//         });
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, [userSub, toast]);

//   async function save() {
//     if (!userSub || !schedule) return;
//     setSaving(true);
//     try {
//       const availability_json = rawJsonMode
//         ? rawJson
//         : buildAvailabilityJson(week, overrides, blocks, ranges);

//       const updated = await updateSchedule(userSub, {
//         timezone: schedule.timezone,
//         duration_minutes: schedule.duration_minutes,
//         availability_json,
//         buffer_before_minutes: schedule.buffer_before_minutes,
//         buffer_after_minutes: schedule.buffer_after_minutes,
//         min_notice_minutes: schedule.min_notice_minutes,
//         max_days_ahead: schedule.max_days_ahead,
//       });

//       setSchedule(updated);
//       setWeek(fromAvailabilityJson(updated.availability_json));
//       setOverrides(parseOverrides(updated.availability_json));
//       setBlocks(parseBlocks(updated.availability_json));
//       setRanges(parseRanges(updated.availability_json));
//       setRawJson(updated.availability_json || "");

//       toast({
//         title: "Schedule saved",
//         description: "Your availability rules have been updated.",
//         variant: "success",
//       });
//     } catch (e: any) {
//       toast({
//         title: "Failed to save",
//         description: e?.message || "Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setSaving(false);
//     }
//   }

//   function addOrUpdateOverride() {
//     if (!overrideDate) return;

//     if (overrideMode === "available") {
//       if (!overrideStart || !overrideEnd || overrideEnd <= overrideStart) {
//         toast({
//           title: "Invalid override time",
//           description: "End time must be after start time.",
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     setOverrides((curr) => {
//       const next = curr.filter((o) => o.date !== overrideDate);
//       next.push({
//         date: overrideDate,
//         mode: overrideMode,
//         start: overrideStart,
//         end: overrideEnd,
//       });
//       return next.sort((a, b) => a.date.localeCompare(b.date));
//     });
//   }

//   function removeOverride(date: string) {
//     setOverrides((curr) => curr.filter((o) => o.date !== date));
//   }

//   function addBlock() {
//     if (!blockDate) return;
//     if (!blockStart || !blockEnd || blockEnd <= blockStart) {
//       toast({
//         title: "Invalid block time",
//         description: "Block end time must be after start time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setBlocks((curr) => {
//       const next = [...curr, { date: blockDate, start: blockStart, end: blockEnd }];
//       return next.sort((a, b) =>
//         a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)
//       );
//     });
//   }

//   function removeBlock(idx: number) {
//     setBlocks((curr) => curr.filter((_, i) => i !== idx));
//   }

//   function toggleRangeDay(dayIdx: number) {
//     setRangeDays((curr) => {
//       if (curr.includes(dayIdx)) return curr.filter((d) => d !== dayIdx);
//       return [...curr, dayIdx].sort((a, b) => a - b);
//     });
//   }

//   function addRange() {
//     if (!rangeStartDate || !rangeEndDate) return;
//     if (rangeEndDate < rangeStartDate) {
//       toast({
//         title: "Invalid date range",
//         description: "End date must be on or after start date.",
//         variant: "destructive",
//       });
//       return;
//     }
//     if (!rangeStartTime || !rangeEndTime || rangeEndTime <= rangeStartTime) {
//       toast({
//         title: "Invalid range time",
//         description: "End time must be after start time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     const id = `${rangeStartDate}_${rangeEndDate}_${Date.now()}`;
//     setRanges((curr) => {
//       const next = [
//         ...curr,
//         {
//           id,
//           start_date: rangeStartDate,
//           end_date: rangeEndDate,
//           days: rangeDays.length ? rangeDays : [0, 1, 2, 3, 4],
//           start: rangeStartTime,
//           end: rangeEndTime,
//         },
//       ];
//       return next.sort((a, b) => a.start_date.localeCompare(b.start_date));
//     });
//   }

//   function removeRange(id: string) {
//     setRanges((curr) => curr.filter((r) => r.id !== id));
//   }

//   return (
//     <div className="h-screen bg-gray-50 flex overflow-hidden">
//       <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((s) => !s)} user={user} />

//       <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
//         <div className="shrink-0 p-4 sm:p-6 lg:p-8">
//           <Topbar user={user} searchQuery="" onSearchQueryChange={() => {}} />
//         </div>

//         <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8">
//           <div className="max-w-5xl">
//             <div className="flex items-start justify-between gap-4 flex-wrap">
//               <div>
//                 <h1 className="text-2xl font-semibold text-slate-900">Your Schedule</h1>
//                 <p className="text-sm text-slate-500 mt-1">
//                   Set your weekly availability. Slotly will only show bookable time slots inside these windows,
//                   in your host timezone.
//                 </p>
//               </div>

//               <button
//                 onClick={save}
//                 disabled={saving || loading || !schedule}
//                 className={[
//                   "px-4 py-2 rounded-xl text-sm font-semibold",
//                   saving || loading || !schedule
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     : "bg-indigo-600 hover:bg-indigo-700 text-white",
//                 ].join(" ")}
//               >
//                 {saving ? "Saving…" : "Save"}
//               </button>
//             </div>

//             <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
//               <div className="lg:col-span-4">
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//                   <div className="text-sm font-semibold text-slate-900">Basics</div>

//                   <div className="mt-4 space-y-4">
//                     <div>
//                       <label className="text-xs text-gray-500 font-medium">Host timezone</label>
//                       <input
//                         list="slotly-tz-list"
//                         value={schedule?.timezone || ""}
//                         onChange={(e) =>
//                           setSchedule((s) => (s ? { ...s, timezone: e.target.value } : s))
//                         }
//                         placeholder={detectBrowserTimeZone()}
//                         className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
//                       />
//                       <datalist id="slotly-tz-list">
//                         {tzOptions.map((tz) => (
//                           <option key={tz} value={tz} />
//                         ))}
//                       </datalist>
//                       <div className="mt-1 text-[11px] text-slate-500">
//                         Auto-detected: <span className="font-medium">{detectBrowserTimeZone()}</span>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="text-xs text-gray-500 font-medium">Slot duration (minutes)</label>
//                       <select
//                         value={schedule?.duration_minutes || 30}
//                         onChange={(e) =>
//                           setSchedule((s) =>
//                             s ? { ...s, duration_minutes: parseInt(e.target.value, 10) || 30 } : s
//                           )
//                         }
//                         className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
//                       >
//                         {[15, 20, 30, 45, 60, 90, 120].map((m) => (
//                           <option key={m} value={m}>
//                             {m}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="text-xs text-gray-500 font-medium">Buffer before</label>
//                         <input
//                           type="number"
//                           min={0}
//                           value={schedule?.buffer_before_minutes || 0}
//                           onChange={(e) =>
//                             setSchedule((s) =>
//                               s
//                                 ? { ...s, buffer_before_minutes: parseInt(e.target.value, 10) || 0 }
//                                 : s
//                             )
//                           }
//                           className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                         />
//                       </div>
//                       <div>
//                         <label className="text-xs text-gray-500 font-medium">Buffer after</label>
//                         <input
//                           type="number"
//                           min={0}
//                           value={schedule?.buffer_after_minutes || 0}
//                           onChange={(e) =>
//                             setSchedule((s) =>
//                               s
//                                 ? { ...s, buffer_after_minutes: parseInt(e.target.value, 10) || 0 }
//                                 : s
//                             )
//                           }
//                           className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="text-xs text-gray-500 font-medium">Min notice (minutes)</label>
//                         <input
//                           type="number"
//                           min={0}
//                           value={schedule?.min_notice_minutes || 0}
//                           onChange={(e) =>
//                             setSchedule((s) =>
//                               s ? { ...s, min_notice_minutes: parseInt(e.target.value, 10) || 0 } : s
//                             )
//                           }
//                           className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                         />
//                       </div>
//                       <div>
//                         <label className="text-xs text-gray-500 font-medium">Max days ahead</label>
//                         <input
//                           type="number"
//                           min={0}
//                           value={schedule?.max_days_ahead || 60}
//                           onChange={(e) =>
//                             setSchedule((s) =>
//                               s ? { ...s, max_days_ahead: parseInt(e.target.value, 10) || 60 } : s
//                             )
//                           }
//                           className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between gap-3 pt-2">
//                       <div>
//                         <div className="text-sm font-semibold text-slate-900">Advanced</div>
//                         <div className="text-xs text-slate-500">Edit raw JSON (optional)</div>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => setRawJsonMode((s) => !s)}
//                         className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
//                       >
//                         {rawJsonMode ? "Hide" : "Edit JSON"}
//                       </button>
//                     </div>

//                     {rawJsonMode ? (
//                       <textarea
//                         value={rawJson}
//                         onChange={(e) => setRawJson(e.target.value)}
//                         rows={10}
//                         className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono"
//                       />
//                     ) : null}
//                   </div>
//                 </div>
//               </div>

//               <div className="lg:col-span-8">
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//                   <div className="text-sm font-semibold text-slate-900">Weekly hours</div>
//                   <div className="mt-1 text-xs text-slate-500">
//                     One interval per day (start/end). You can add date overrides below, or use JSON editor for multiple
//                     intervals per day.
//                   </div>

//                   {loading ? (
//                     <div className="mt-6 text-sm text-gray-500">Loading…</div>
//                   ) : (
//                     <div className="mt-4 space-y-3">
//                       {Object.keys(week)
//                         .sort((a, b) => Number(a) - Number(b))
//                         .map((k) => (
//                           <div
//                             key={k}
//                             className="flex items-center justify-between gap-4 p-3 rounded-xl border border-gray-100"
//                           >
//                             <div className="flex items-center gap-3">
//                               <input
//                                 type="checkbox"
//                                 checked={!!week[k].enabled}
//                                 onChange={(e) =>
//                                   setWeek((w) => ({
//                                     ...w,
//                                     [k]: { ...w[k], enabled: e.target.checked },
//                                   }))
//                                 }
//                               />
//                               <div className="font-semibold text-slate-900 w-12">{DAY_LABELS[Number(k)]}</div>
//                             </div>

//                             <div className="flex items-center gap-2">
//                               <input
//                                 type="time"
//                                 value={week[k].start}
//                                 disabled={!week[k].enabled}
//                                 onChange={(e) =>
//                                   setWeek((w) => ({
//                                     ...w,
//                                     [k]: { ...w[k], start: e.target.value },
//                                   }))
//                                 }
//                                 className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
//                               />
//                               <span className="text-sm text-gray-400">to</span>
//                               <input
//                                 type="time"
//                                 value={week[k].end}
//                                 disabled={!week[k].enabled}
//                                 onChange={(e) =>
//                                   setWeek((w) => ({
//                                     ...w,
//                                     [k]: { ...w[k], end: e.target.value },
//                                   }))
//                                 }
//                                 className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
//                               />
//                             </div>
//                           </div>
//                         ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Date overrides */}
//                 <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//                   <div className="text-sm font-semibold text-slate-900">Date overrides</div>
//                   <div className="mt-1 text-xs text-slate-500">
//                     Use this for one-off availability changes (holidays, special working day, etc.). Overrides always win
//                     over weekly rules.
//                   </div>

//                   {rawJsonMode ? (
//                     <div className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
//                       Date overrides UI is disabled while JSON mode is enabled. Turn off JSON mode to use this editor.
//                     </div>
//                   ) : (
//                     <div className="mt-4 space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
//                         <div className="md:col-span-4">
//                           <label className="text-xs text-gray-500 font-medium">Date</label>
//                           <input
//                             type="date"
//                             value={overrideDate}
//                             onChange={(e) => setOverrideDate(e.target.value)}
//                             className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                           />
//                         </div>

//                         <div className="md:col-span-3">
//                           <label className="text-xs text-gray-500 font-medium">Mode</label>
//                           <select
//                             value={overrideMode}
//                             onChange={(e) => setOverrideMode(e.target.value as any)}
//                             className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
//                           >
//                             <option value="available">Available</option>
//                             <option value="unavailable">Unavailable (all day)</option>
//                           </select>
//                         </div>

//                         <div className="md:col-span-3">
//                           <label className="text-xs text-gray-500 font-medium">Time window</label>
//                           <div className="mt-1 flex items-center gap-2">
//                             <input
//                               type="time"
//                               value={overrideStart}
//                               disabled={overrideMode === "unavailable"}
//                               onChange={(e) => setOverrideStart(e.target.value)}
//                               className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                             />
//                             <span className="text-xs text-gray-400">to</span>
//                             <input
//                               type="time"
//                               value={overrideEnd}
//                               disabled={overrideMode === "unavailable"}
//                               onChange={(e) => setOverrideEnd(e.target.value)}
//                               className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                             />
//                           </div>
//                         </div>

//                         <div className="md:col-span-2">
//                           <button
//                             type="button"
//                             onClick={addOrUpdateOverride}
//                             className="w-full px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
//                           >
//                             Add/Update
//                           </button>
//                         </div>
//                       </div>

//                       {overrides.length === 0 ? (
//                         <div className="text-sm text-slate-500">No overrides set.</div>
//                       ) : (
//                         <div className="border border-gray-100 rounded-2xl overflow-hidden">
//                           <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-xs font-semibold text-slate-600">
//                             <div className="col-span-4">Date</div>
//                             <div className="col-span-4">Override</div>
//                             <div className="col-span-3">Time</div>
//                             <div className="col-span-1" />
//                           </div>

//                           {overrides.map((o) => (
//                             <div
//                               key={o.date}
//                               className="grid grid-cols-12 px-3 py-2 text-sm border-t border-gray-100 items-center"
//                             >
//                               <div className="col-span-4 font-medium text-slate-900">{o.date}</div>
//                               <div className="col-span-4">
//                                 {o.mode === "unavailable" ? (
//                                   <span className="text-red-600 font-semibold">Unavailable</span>
//                                 ) : (
//                                   <span className="text-emerald-700 font-semibold">Available</span>
//                                 )}
//                               </div>
//                               <div className="col-span-3 text-slate-700">
//                                 {o.mode === "unavailable" ? "—" : `${o.start} – ${o.end}`}
//                               </div>
//                               <div className="col-span-1 text-right">
//                                 <button
//                                   type="button"
//                                   onClick={() => removeOverride(o.date)}
//                                   className="text-xs font-semibold text-slate-600 hover:text-red-600"
//                                 >
//                                   Remove
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Time blocks */}
//                 <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//                   <div className="text-sm font-semibold text-slate-900">Time blocks (unavailable windows)</div>
//                   <div className="mt-1 text-xs text-slate-500">
//                     Block a time range on a specific date, e.g. lunch break or personal appointment. These blocks remove
//                     slots even if you are generally available.
//                   </div>

//                   {rawJsonMode ? (
//                     <div className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
//                       Time blocks UI is disabled while JSON mode is enabled. Turn off JSON mode to use this editor.
//                     </div>
//                   ) : (
//                     <div className="mt-4 space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
//                         <div className="md:col-span-4">
//                           <label className="text-xs text-gray-500 font-medium">Date</label>
//                           <input
//                             type="date"
//                             value={blockDate}
//                             onChange={(e) => setBlockDate(e.target.value)}
//                             className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                           />
//                         </div>

//                         <div className="md:col-span-6">
//                           <label className="text-xs text-gray-500 font-medium">Block time</label>
//                           <div className="mt-1 flex items-center gap-2">
//                             <input
//                               type="time"
//                               value={blockStart}
//                               onChange={(e) => setBlockStart(e.target.value)}
//                               className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                             />
//                             <span className="text-xs text-gray-400">to</span>
//                             <input
//                               type="time"
//                               value={blockEnd}
//                               onChange={(e) => setBlockEnd(e.target.value)}
//                               className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                             />
//                           </div>
//                         </div>

//                         <div className="md:col-span-2">
//                           <button
//                             type="button"
//                             onClick={addBlock}
//                             className="w-full px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
//                           >
//                             Add block
//                           </button>
//                         </div>
//                       </div>

//                       {blocks.length === 0 ? (
//                         <div className="text-sm text-slate-500">No blocks set.</div>
//                       ) : (
//                         <div className="border border-gray-100 rounded-2xl overflow-hidden">
//                           <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-xs font-semibold text-slate-600">
//                             <div className="col-span-4">Date</div>
//                             <div className="col-span-7">Blocked</div>
//                             <div className="col-span-1" />
//                           </div>

//                           {blocks.map((b, idx) => (
//                             <div
//                               key={`${b.date}_${b.start}_${idx}`}
//                               className="grid grid-cols-12 px-3 py-2 text-sm border-t border-gray-100 items-center"
//                             >
//                               <div className="col-span-4 font-medium text-slate-900">{b.date}</div>
//                               <div className="col-span-7 text-slate-700">{b.start} – {b.end}</div>
//                               <div className="col-span-1 text-right">
//                                 <button
//                                   type="button"
//                                   onClick={() => removeBlock(idx)}
//                                   className="text-xs font-semibold text-slate-600 hover:text-red-600"
//                                 >
//                                   Remove
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Date range availability */}
//                 <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//                   <div className="text-sm font-semibold text-slate-900">Date range availability</div>
//                   <div className="mt-1 text-xs text-slate-500">
//                     Set availability for a specific date range (for example: next 2 weeks only mornings). Range rules apply
//                     when there is no explicit override for that date.
//                   </div>

//                   {rawJsonMode ? (
//                     <div className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
//                       Date range UI is disabled while JSON mode is enabled. Turn off JSON mode to use this editor.
//                     </div>
//                   ) : (
//                     <div className="mt-4 space-y-4">
//                       <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
//                         <div className="lg:col-span-3">
//                           <label className="text-xs text-gray-500 font-medium">Start date</label>
//                           <input
//                             type="date"
//                             value={rangeStartDate}
//                             onChange={(e) => setRangeStartDate(e.target.value)}
//                             className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                           />
//                         </div>
//                         <div className="lg:col-span-3">
//                           <label className="text-xs text-gray-500 font-medium">End date</label>
//                           <input
//                             type="date"
//                             value={rangeEndDate}
//                             onChange={(e) => setRangeEndDate(e.target.value)}
//                             className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                           />
//                         </div>

//                         <div className="lg:col-span-4">
//                           <label className="text-xs text-gray-500 font-medium">Time window</label>
//                           <div className="mt-1 flex items-center gap-2">
//                             <input
//                               type="time"
//                               value={rangeStartTime}
//                               onChange={(e) => setRangeStartTime(e.target.value)}
//                               className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                             />
//                             <span className="text-xs text-gray-400">to</span>
//                             <input
//                               type="time"
//                               value={rangeEndTime}
//                               onChange={(e) => setRangeEndTime(e.target.value)}
//                               className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                             />
//                           </div>
//                         </div>

//                         <div className="lg:col-span-2">
//                           <button
//                             type="button"
//                             onClick={addRange}
//                             className="w-full px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
//                           >
//                             Add range
//                           </button>
//                         </div>
//                       </div>

//                       <div>
//                         <label className="text-xs text-gray-500 font-medium">Days in range</label>
//                         <div className="mt-2 flex flex-wrap gap-2">
//                           {DAY_LABELS.map((d, i) => (
//                             <button
//                               key={d}
//                               type="button"
//                               onClick={() => toggleRangeDay(i)}
//                               className={[
//                                 "px-3 py-1.5 rounded-xl text-xs font-semibold border",
//                                 rangeDays.includes(i)
//                                   ? "bg-indigo-600 border-indigo-600 text-white"
//                                   : "bg-white border-gray-200 text-slate-700 hover:bg-gray-50",
//                               ].join(" ")}
//                             >
//                               {d}
//                             </button>
//                           ))}
//                         </div>
//                       </div>

//                       {ranges.length === 0 ? (
//                         <div className="text-sm text-slate-500">No date ranges set.</div>
//                       ) : (
//                         <div className="border border-gray-100 rounded-2xl overflow-hidden">
//                           <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-xs font-semibold text-slate-600">
//                             <div className="col-span-5">Range</div>
//                             <div className="col-span-4">Days</div>
//                             <div className="col-span-2">Time</div>
//                             <div className="col-span-1" />
//                           </div>

//                           {ranges.map((r) => (
//                             <div
//                               key={r.id}
//                               className="grid grid-cols-12 px-3 py-2 text-sm border-t border-gray-100 items-center"
//                             >
//                               <div className="col-span-5 font-medium text-slate-900">
//                                 {r.start_date} → {r.end_date}
//                               </div>
//                               <div className="col-span-4 text-slate-700">
//                                 {(r.days || []).sort((a,b)=>a-b).map((d) => DAY_LABELS[d]).join(", ")}
//                               </div>
//                               <div className="col-span-2 text-slate-700">{r.start} – {r.end}</div>
//                               <div className="col-span-1 text-right">
//                                 <button
//                                   type="button"
//                                   onClick={() => removeRange(r.id)}
//                                   className="text-xs font-semibold text-slate-600 hover:text-red-600"
//                                 >
//                                   Remove
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
//                   <div className="text-sm font-semibold text-indigo-900">How this affects bookings</div>
//                   <div className="mt-1 text-xs text-indigo-800 leading-relaxed">
//                     Public booking pages (invitees) can select their own timezone for display, but your availability rules are
//                     always evaluated in your host timezone. Buffers, min notice, and max days ahead are enforced server-side.
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }























// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import Sidebar from "../components/Sidebar/Sidebar";
// import Topbar from "../components/Topbar/Topbar";
// import { useToast } from "@/hooks/use-toast";
// import { useUserProfile } from "../hooks/useUserProfile";
// import { fetchSchedule, updateSchedule, type Schedule } from "../api/schedule";

// type WeekRule = {
//   start: string;
//   end: string;
//   enabled: boolean;
// };

// type DateOverride = {
//   date: string; // YYYY-MM-DD
//   mode: "available" | "unavailable";
//   start: string;
//   end: string;
// };

// type DateBlock = {
//   date: string; // YYYY-MM-DD
//   start: string;
//   end: string;
// };

// type DateRangeRule = {
//   id: string;
//   start_date: string; // YYYY-MM-DD
//   end_date: string; // YYYY-MM-DD
//   days: number[]; // 0=Mon ... 6=Sun
//   start: string;
//   end: string;
// };

// const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// function defaultWeek(): Record<string, WeekRule> {
//   return {
//     "0": { enabled: true, start: "09:00", end: "17:00" },
//     "1": { enabled: true, start: "09:00", end: "17:00" },
//     "2": { enabled: true, start: "09:00", end: "17:00" },
//     "3": { enabled: true, start: "09:00", end: "17:00" },
//     "4": { enabled: true, start: "09:00", end: "17:00" },
//     "5": { enabled: false, start: "09:00", end: "17:00" },
//     "6": { enabled: false, start: "09:00", end: "17:00" },
//   };
// }

// function fromAvailabilityJson(raw?: string | null): Record<string, WeekRule> {
//   const base = defaultWeek();
//   if (!raw) return base;
//   try {
//     const data = JSON.parse(raw);
//     const week = data?.week || data?.weekly || data?.rules;
//     if (typeof week !== "object" || !week) return base;
//     for (const k of Object.keys(base)) {
//       const intervals = week[k];
//       if (!Array.isArray(intervals) || !intervals.length) {
//         base[k].enabled = false;
//         continue;
//       }
//       const first = intervals[0] || {};
//       base[k].enabled = true;
//       base[k].start = String(first.start || base[k].start);
//       base[k].end = String(first.end || base[k].end);
//     }
//   } catch {
//     return base;
//   }
//   return base;
// }

// function detectBrowserTimeZone(): string {
//   try {
//     return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
//   } catch {
//     return "UTC";
//   }
// }

// function parseOverrides(raw?: string | null): DateOverride[] {
//   if (!raw) return [];
//   try {
//     const data = JSON.parse(raw);
//     const overrides = data?.overrides;
//     if (!overrides || typeof overrides !== "object") return [];
//     const out: DateOverride[] = [];
//     for (const date of Object.keys(overrides)) {
//       const v = overrides[date];

//       // legacy list: intervals override (or [] unavailable)
//       if (Array.isArray(v)) {
//         if (v.length > 0) {
//           const first = v[0] || {};
//           out.push({
//             date,
//             mode: "available",
//             start: String(first.start || "09:00"),
//             end: String(first.end || "17:00"),
//           });
//         } else {
//           out.push({ date, mode: "unavailable", start: "09:00", end: "17:00" });
//         }
//         continue;
//       }

//       // new shape: { intervals?:[], blocks?:[] }
//       if (v && typeof v === "object") {
//         const intervals = (v as any).intervals;
//         if (intervals === undefined || intervals === null) {
//           continue;
//         }
//         if (Array.isArray(intervals) && intervals.length > 0) {
//           const first = intervals[0] || {};
//           out.push({
//             date,
//             mode: "available",
//             start: String(first.start || "09:00"),
//             end: String(first.end || "17:00"),
//           });
//         } else {
//           out.push({ date, mode: "unavailable", start: "09:00", end: "17:00" });
//         }
//       }
//     }
//     return out.sort((a, b) => a.date.localeCompare(b.date));
//   } catch {
//     return [];
//   }
// }

// function parseBlocks(raw?: string | null): DateBlock[] {
//   if (!raw) return [];
//   try {
//     const data = JSON.parse(raw);
//     const overrides = data?.overrides;
//     if (!overrides || typeof overrides !== "object") return [];
//     const out: DateBlock[] = [];
//     for (const date of Object.keys(overrides)) {
//       const v = overrides[date];
//       if (v && typeof v === "object" && !Array.isArray(v)) {
//         const blocks = (v as any).blocks;
//         if (Array.isArray(blocks)) {
//           for (const b of blocks) {
//             if (!b) continue;
//             out.push({
//               date,
//               start: String((b as any).start || ""),
//               end: String((b as any).end || ""),
//             });
//           }
//         }
//       }
//     }
//     return out
//       .filter((x) => x.date && x.start && x.end)
//       .sort((a, b) => (a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)));
//   } catch {
//     return [];
//   }
// }

// function parseRanges(raw?: string | null): DateRangeRule[] {
//   if (!raw) return [];
//   try {
//     const data = JSON.parse(raw);
//     const ranges = data?.ranges;
//     if (!Array.isArray(ranges)) return [];
//     return ranges
//       .filter((r: any) => r && r.start_date && r.end_date)
//       .map((r: any, idx: number) => ({
//         id: String(r.id || `${r.start_date}_${r.end_date}_${idx}`),
//         start_date: String(r.start_date),
//         end_date: String(r.end_date),
//         days: Array.isArray(r.days) ? r.days.map((d: any) => Number(d)) : [0, 1, 2, 3, 4],
//         start: String((r.intervals?.[0]?.start) || r.start || "09:00"),
//         end: String((r.intervals?.[0]?.end) || r.end || "17:00"),
//       }))
//       .sort((a, b) => a.start_date.localeCompare(b.start_date));
//   } catch {
//     return [];
//   }
// }

// function buildAvailabilityJson(
//   week: Record<string, WeekRule>,
//   overrides: DateOverride[],
//   blocks: DateBlock[],
//   ranges: DateRangeRule[]
// ): string {
//   const out: any = { week: {}, overrides: {}, ranges: [] };
//   for (const k of Object.keys(week)) {
//     const r = week[k];
//     out.week[k] = r.enabled ? [{ start: r.start, end: r.end }] : [];
//   }

//   for (const o of overrides) {
//     if (!o?.date) continue;
//     if (o.mode === "unavailable") {
//       out.overrides[o.date] = [];
//     } else {
//       out.overrides[o.date] = { intervals: [{ start: o.start, end: o.end }], blocks: [] };
//     }
//   }

//   for (const b of blocks) {
//     if (!b?.date) continue;
//     if (!b.start || !b.end || b.end <= b.start) continue;

//     const existing = out.overrides[b.date];
//     if (Array.isArray(existing)) continue;

//     if (!existing) {
//       out.overrides[b.date] = { intervals: null, blocks: [{ start: b.start, end: b.end }] };
//       continue;
//     }

//     if (typeof existing === "object") {
//       existing.blocks = Array.isArray(existing.blocks) ? existing.blocks : [];
//       existing.blocks.push({ start: b.start, end: b.end });
//     }
//   }

//   out.ranges = (ranges || [])
//     .filter((r) => r.start_date && r.end_date && r.end > r.start)
//     .map((r) => ({
//       id: r.id,
//       start_date: r.start_date,
//       end_date: r.end_date,
//       days: Array.isArray(r.days) && r.days.length ? r.days : [0, 1, 2, 3, 4],
//       intervals: [{ start: r.start, end: r.end }],
//     }));

//   return JSON.stringify(out);
// }

// type TabKey = "weekly" | "overrides" | "blocks" | "ranges" | "advanced";

// export default function YourSchedulePage() {
//   const { toast } = useToast();

//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [userSub, setUserSub] = useState<string | null>(null);

//   useEffect(() => {
//     const saved = localStorage.getItem("slotly_user");
//     if (!saved) return;
//     try {
//       const parsed = JSON.parse(saved);
//       setUserSub(parsed.sub);
//     } catch {}
//   }, []);

//   const { data: user } = useUserProfile(userSub);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [schedule, setSchedule] = useState<Schedule | null>(null);
//   const [week, setWeek] = useState<Record<string, WeekRule>>(defaultWeek());
//   const [rawJsonMode, setRawJsonMode] = useState(false);
//   const [rawJson, setRawJson] = useState<string>("");

//   // UI-only
//   const [activeTab, setActiveTab] = useState<TabKey>("weekly");

//   // Date overrides (non-JSON mode)
//   const [overrides, setOverrides] = useState<DateOverride[]>([]);
//   const [overrideDate, setOverrideDate] = useState<string>("");
//   const [overrideMode, setOverrideMode] = useState<DateOverride["mode"]>("available");
//   const [overrideStart, setOverrideStart] = useState<string>("09:00");
//   const [overrideEnd, setOverrideEnd] = useState<string>("17:00");

//   // Time blocks inside a specific date (e.g. 14:00-16:00 unavailable)
//   const [blocks, setBlocks] = useState<DateBlock[]>([]);
//   const [blockDate, setBlockDate] = useState<string>("");
//   const [blockStart, setBlockStart] = useState<string>("14:00");
//   const [blockEnd, setBlockEnd] = useState<string>("16:00");

//   // Date range availability rules
//   const [ranges, setRanges] = useState<DateRangeRule[]>([]);
//   const [rangeStartDate, setRangeStartDate] = useState<string>("");
//   const [rangeEndDate, setRangeEndDate] = useState<string>("");
//   const [rangeStartTime, setRangeStartTime] = useState<string>("09:00");
//   const [rangeEndTime, setRangeEndTime] = useState<string>("17:00");
//   const [rangeDays, setRangeDays] = useState<number[]>([0, 1, 2, 3, 4]);

//   const tzOptions = useMemo(() => {
//     try {
//       // @ts-ignore
//       const list = (Intl as any).supportedValuesOf?.("timeZone") as string[] | undefined;
//       if (Array.isArray(list) && list.length) return list;
//     } catch {}
//     return [
//       "Asia/Kolkata",
//       "Asia/Dubai",
//       "Asia/Singapore",
//       "Europe/London",
//       "Europe/Paris",
//       "America/New_York",
//       "America/Los_Angeles",
//       "UTC",
//     ];
//   }, []);

//   useEffect(() => {
//     if (!userSub) return;
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       try {
//         const data = await fetchSchedule(userSub);
//         if (!mounted) return;

//         const detectedTz = detectBrowserTimeZone();
//         const normalized = {
//           ...data,
//           timezone: (data?.timezone || "").trim() || detectedTz,
//         };

//         setSchedule(normalized);
//         setWeek(fromAvailabilityJson(normalized.availability_json));
//         setOverrides(parseOverrides(normalized.availability_json));
//         setBlocks(parseBlocks(normalized.availability_json));
//         setRanges(parseRanges(normalized.availability_json));
//         setRawJson(normalized.availability_json || buildAvailabilityJson(fromAvailabilityJson(null), [], [], []));

//         if (!data?.timezone || !String(data.timezone).trim()) {
//           try {
//             await updateSchedule(userSub, { timezone: detectedTz });
//           } catch {}
//         }
//       } catch (e: any) {
//         toast({
//           title: "Failed to load schedule",
//           description: e?.message || "Please try again.",
//           variant: "destructive",
//         });
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, [userSub, toast]);

//   async function save() {
//     if (!userSub || !schedule) return;
//     setSaving(true);
//     try {
//       const availability_json = rawJsonMode ? rawJson : buildAvailabilityJson(week, overrides, blocks, ranges);

//       const updated = await updateSchedule(userSub, {
//         timezone: schedule.timezone,
//         duration_minutes: schedule.duration_minutes,
//         availability_json,
//         buffer_before_minutes: schedule.buffer_before_minutes,
//         buffer_after_minutes: schedule.buffer_after_minutes,
//         min_notice_minutes: schedule.min_notice_minutes,
//         max_days_ahead: schedule.max_days_ahead,
//       });

//       setSchedule(updated);
//       setWeek(fromAvailabilityJson(updated.availability_json));
//       setOverrides(parseOverrides(updated.availability_json));
//       setBlocks(parseBlocks(updated.availability_json));
//       setRanges(parseRanges(updated.availability_json));
//       setRawJson(updated.availability_json || "");

//       toast({
//         title: "Schedule saved",
//         description: "Your availability rules have been updated.",
//         variant: "success",
//       });
//     } catch (e: any) {
//       toast({
//         title: "Failed to save",
//         description: e?.message || "Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setSaving(false);
//     }
//   }

//   function addOrUpdateOverride() {
//     if (!overrideDate) return;

//     if (overrideMode === "available") {
//       if (!overrideStart || !overrideEnd || overrideEnd <= overrideStart) {
//         toast({
//           title: "Invalid override time",
//           description: "End time must be after start time.",
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     setOverrides((curr) => {
//       const next = curr.filter((o) => o.date !== overrideDate);
//       next.push({
//         date: overrideDate,
//         mode: overrideMode,
//         start: overrideStart,
//         end: overrideEnd,
//       });
//       return next.sort((a, b) => a.date.localeCompare(b.date));
//     });
//   }

//   function removeOverride(date: string) {
//     setOverrides((curr) => curr.filter((o) => o.date !== date));
//   }

//   function addBlock() {
//     if (!blockDate) return;
//     if (!blockStart || !blockEnd || blockEnd <= blockStart) {
//       toast({
//         title: "Invalid block time",
//         description: "Block end time must be after start time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setBlocks((curr) => {
//       const next = [...curr, { date: blockDate, start: blockStart, end: blockEnd }];
//       return next.sort((a, b) => (a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)));
//     });
//   }

//   function removeBlock(idx: number) {
//     setBlocks((curr) => curr.filter((_, i) => i !== idx));
//   }

//   function toggleRangeDay(dayIdx: number) {
//     setRangeDays((curr) => {
//       if (curr.includes(dayIdx)) return curr.filter((d) => d !== dayIdx);
//       return [...curr, dayIdx].sort((a, b) => a - b);
//     });
//   }

//   function addRange() {
//     if (!rangeStartDate || !rangeEndDate) return;
//     if (rangeEndDate < rangeStartDate) {
//       toast({
//         title: "Invalid date range",
//         description: "End date must be on or after start date.",
//         variant: "destructive",
//       });
//       return;
//     }
//     if (!rangeStartTime || !rangeEndTime || rangeEndTime <= rangeStartTime) {
//       toast({
//         title: "Invalid range time",
//         description: "End time must be after start time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     const id = `${rangeStartDate}_${rangeEndDate}_${Date.now()}`;
//     setRanges((curr) => {
//       const next = [
//         ...curr,
//         {
//           id,
//           start_date: rangeStartDate,
//           end_date: rangeEndDate,
//           days: rangeDays.length ? rangeDays : [0, 1, 2, 3, 4],
//           start: rangeStartTime,
//           end: rangeEndTime,
//         },
//       ];
//       return next.sort((a, b) => a.start_date.localeCompare(b.start_date));
//     });
//   }

//   function removeRange(id: string) {
//     setRanges((curr) => curr.filter((r) => r.id !== id));
//   }

//   // ---------- UI Helpers (display only, no logic changes) ----------
//   const summary = useMemo(() => {
//     const tz = schedule?.timezone || detectBrowserTimeZone();
//     const enabledDays = Object.keys(week)
//       .map((k) => Number(k))
//       .filter((k) => week[String(k)]?.enabled);

//     const dayText =
//       enabledDays.length === 0
//         ? "No weekly hours"
//         : enabledDays.length === 7
//         ? "Mon–Sun"
//         : enabledDays.join(","); // fallback; below we also show nicer mapping

//     // Try produce "Mon–Fri" if contiguous
//     const labels = enabledDays.map((d) => DAY_LABELS[d]).filter(Boolean);
//     let prettyDays = labels.join(", ");
//     if (enabledDays.length === 5 && enabledDays[0] === 0 && enabledDays[4] === 4) prettyDays = "Mon–Fri";
//     if (enabledDays.length === 7) prettyDays = "Mon–Sun";

//     // pick first enabled interval for summary
//     const firstEnabled = enabledDays[0];
//     const timeText =
//       typeof firstEnabled === "number"
//         ? `${week[String(firstEnabled)]?.start || "09:00"}–${week[String(firstEnabled)]?.end || "17:00"}`
//         : "—";

//     return { tz, prettyDays: prettyDays || dayText, timeText };
//   }, [schedule?.timezone, week]);

//   function TabButton({ id, label, disabled }: { id: TabKey; label: string; disabled?: boolean }) {
//     const active = activeTab === id;
//     return (
//       <button
//         type="button"
//         disabled={disabled}
//         onClick={() => setActiveTab(id)}
//         className={[
//           "px-3 py-2 rounded-xl text-sm font-semibold transition border",
//           disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50",
//           active ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-700",
//         ].join(" ")}
//       >
//         {label}
//       </button>
//     );
//   }

//   const uiDisabledByJson = rawJsonMode;

//   return (
//     <div className="h-screen bg-slate-50 flex overflow-hidden">
//       <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((s) => !s)} user={user} />

//       <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
//         <div className="shrink-0 p-4 sm:p-6 lg:p-8">
//           <Topbar user={user} searchQuery="" onSearchQueryChange={() => {}} />
//         </div>

//         <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-10">
//           <div className="max-w-6xl">
//             {/* Header: title + save */}
//             <div className="flex items-start justify-between gap-4 flex-wrap">
//               <div className="min-w-0">
//                 <h1 className="text-2xl font-semibold text-slate-900">Your Schedule</h1>
//                 <p className="text-sm text-slate-500 mt-1">
//                   Define availability once. Slotly will only show bookable time slots inside these windows (host timezone).
//                 </p>
//               </div>

//               <button
//                 onClick={save}
//                 disabled={saving || loading || !schedule}
//                 className={[
//                   "h-11 px-5 rounded-xl text-sm font-semibold transition shadow-sm",
//                   saving || loading || !schedule
//                     ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
//                     : "bg-indigo-600 hover:bg-indigo-700 text-white",
//                 ].join(" ")}
//               >
//                 {saving ? "Saving…" : "Save changes"}
//               </button>
//             </div>

//             {/* Summary bar (UI only) */}
//             <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
//               <div className="flex items-start justify-between gap-4 flex-wrap">
//                 <div className="min-w-0">
//                   <div className="text-sm font-semibold text-slate-900">Current availability</div>
//                   <div className="mt-1 text-sm text-slate-600">
//                     <span className="font-semibold text-slate-900">{summary.prettyDays}</span>{" "}
//                     <span className="text-slate-400">·</span>{" "}
//                     <span className="font-semibold text-slate-900">{summary.timeText}</span>{" "}
//                     <span className="text-slate-400">·</span>{" "}
//                     <span className="text-slate-600">{summary.tz}</span>
//                   </div>
//                   <div className="mt-1 text-xs text-slate-500">
//                     Overrides and blocks always take priority over weekly hours.
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <TabButton id="weekly" label="Weekly hours" />
//                   <TabButton id="overrides" label="Overrides" disabled={uiDisabledByJson} />
//                   <TabButton id="blocks" label="Blocks" disabled={uiDisabledByJson} />
//                   <TabButton id="ranges" label="Date ranges" disabled={uiDisabledByJson} />
//                   <TabButton id="advanced" label="Advanced" />
//                 </div>
//               </div>

//               {rawJsonMode ? (
//                 <div className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
//                   JSON mode is enabled. UI editors (Overrides/Blocks/Date ranges) are disabled to avoid conflicts.
//                 </div>
//               ) : null}
//             </div>

//             {/* Main grid */}
//             <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
//               {/* Left: Basics */}
//               <div className="lg:col-span-4">
//                 <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
//                   <div className="flex items-center justify-between gap-3">
//                     <div className="text-sm font-semibold text-slate-900">Basics</div>
//                     <button
//                       type="button"
//                       onClick={() => setRawJsonMode((s) => !s)}
//                       className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
//                     >
//                       {rawJsonMode ? "Hide JSON" : "Edit JSON"}
//                     </button>
//                   </div>

//                   <div className="mt-4 space-y-4">
//                     <div>
//                       <label className="text-xs text-slate-500 font-medium">Host timezone</label>
//                       <input
//                         list="slotly-tz-list"
//                         value={schedule?.timezone || ""}
//                         onChange={(e) => setSchedule((s) => (s ? { ...s, timezone: e.target.value } : s))}
//                         placeholder={detectBrowserTimeZone()}
//                         className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
//                       />
//                       <datalist id="slotly-tz-list">
//                         {tzOptions.map((tz) => (
//                           <option key={tz} value={tz} />
//                         ))}
//                       </datalist>
//                       <div className="mt-1 text-[11px] text-slate-500">
//                         Auto-detected: <span className="font-medium">{detectBrowserTimeZone()}</span>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="text-xs text-slate-500 font-medium">Slot duration (minutes)</label>
//                       <select
//                         value={schedule?.duration_minutes || 30}
//                         onChange={(e) =>
//                           setSchedule((s) => (s ? { ...s, duration_minutes: parseInt(e.target.value, 10) || 30 } : s))
//                         }
//                         className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
//                       >
//                         {[15, 20, 30, 45, 60, 90, 120].map((m) => (
//                           <option key={m} value={m}>
//                             {m}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="text-xs text-slate-500 font-medium">Buffer before</label>
//                         <input
//                           type="number"
//                           min={0}
//                           value={schedule?.buffer_before_minutes || 0}
//                           onChange={(e) =>
//                             setSchedule((s) =>
//                               s ? { ...s, buffer_before_minutes: parseInt(e.target.value, 10) || 0 } : s
//                             )
//                           }
//                           className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                         />
//                       </div>
//                       <div>
//                         <label className="text-xs text-slate-500 font-medium">Buffer after</label>
//                         <input
//                           type="number"
//                           min={0}
//                           value={schedule?.buffer_after_minutes || 0}
//                           onChange={(e) =>
//                             setSchedule((s) =>
//                               s ? { ...s, buffer_after_minutes: parseInt(e.target.value, 10) || 0 } : s
//                             )
//                           }
//                           className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="text-xs text-slate-500 font-medium">Min notice (minutes)</label>
//                         <input
//                           type="number"
//                           min={0}
//                           value={schedule?.min_notice_minutes || 0}
//                           onChange={(e) =>
//                             setSchedule((s) =>
//                               s ? { ...s, min_notice_minutes: parseInt(e.target.value, 10) || 0 } : s
//                             )
//                           }
//                           className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                         />
//                       </div>
//                       <div>
//                         <label className="text-xs text-slate-500 font-medium">Max days ahead</label>
//                         <input
//                           type="number"
//                           min={0}
//                           value={schedule?.max_days_ahead || 60}
//                           onChange={(e) =>
//                             setSchedule((s) => (s ? { ...s, max_days_ahead: parseInt(e.target.value, 10) || 60 } : s))
//                           }
//                           className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                         />
//                       </div>
//                     </div>

//                     {rawJsonMode ? (
//                       <div className="pt-1">
//                         <div className="text-xs font-semibold text-slate-700">Availability JSON</div>
//                         <textarea
//                           value={rawJson}
//                           onChange={(e) => setRawJson(e.target.value)}
//                           rows={12}
//                           className="mt-2 w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono bg-white"
//                         />
//                         <div className="mt-2 text-[11px] text-slate-500">
//                           Use carefully. UI editors are disabled while JSON mode is enabled.
//                         </div>
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>

//                 <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
//                   <div className="text-sm font-semibold text-indigo-900">How this affects bookings</div>
//                   <div className="mt-1 text-xs text-indigo-800 leading-relaxed">
//                     Invitees can pick their timezone for display, but availability is always evaluated in your host timezone.
//                     Buffers, min notice, and max days ahead are enforced server-side.
//                   </div>
//                 </div>
//               </div>

//               {/* Right: Tab content */}
//               <div className="lg:col-span-8">
//                 {/* Weekly hours */}
//                 {activeTab === "weekly" && (
//                   <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
//                     <div className="text-sm font-semibold text-slate-900">Weekly hours</div>
//                     <div className="mt-1 text-xs text-slate-500">
//                       One interval per day (start/end). For multiple intervals, use JSON editor.
//                     </div>

//                     {loading ? (
//                       <div className="mt-6 text-sm text-slate-500">Loading…</div>
//                     ) : (
//                       <div className="mt-4 space-y-3">
//                         {Object.keys(week)
//                           .sort((a, b) => Number(a) - Number(b))
//                           .map((k) => (
//                             <div
//                               key={k}
//                               className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-200 bg-slate-50/40"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <input
//                                   type="checkbox"
//                                   checked={!!week[k].enabled}
//                                   onChange={(e) =>
//                                     setWeek((w) => ({
//                                       ...w,
//                                       [k]: { ...w[k], enabled: e.target.checked },
//                                     }))
//                                   }
//                                 />
//                                 <div className="font-semibold text-slate-900 w-12">{DAY_LABELS[Number(k)]}</div>
//                               </div>

//                               <div className="flex items-center gap-2">
//                                 <input
//                                   type="time"
//                                   value={week[k].start}
//                                   disabled={!week[k].enabled}
//                                   onChange={(e) =>
//                                     setWeek((w) => ({
//                                       ...w,
//                                       [k]: { ...w[k], start: e.target.value },
//                                     }))
//                                   }
//                                   className="border border-slate-200 rounded-xl px-2.5 py-1.5 text-sm bg-white"
//                                 />
//                                 <span className="text-sm text-slate-400">to</span>
//                                 <input
//                                   type="time"
//                                   value={week[k].end}
//                                   disabled={!week[k].enabled}
//                                   onChange={(e) =>
//                                     setWeek((w) => ({
//                                       ...w,
//                                       [k]: { ...w[k], end: e.target.value },
//                                     }))
//                                   }
//                                   className="border border-slate-200 rounded-xl px-2.5 py-1.5 text-sm bg-white"
//                                 />
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Overrides */}
//                 {activeTab === "overrides" && (
//                   <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
//                     <div className="text-sm font-semibold text-slate-900">Date overrides</div>
//                     <div className="mt-1 text-xs text-slate-500">
//                       One-off availability changes. Overrides always win over weekly rules.
//                     </div>

//                     {rawJsonMode ? (
//                       <div className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
//                         Date overrides UI is disabled while JSON mode is enabled. Turn off JSON mode to use this editor.
//                       </div>
//                     ) : (
//                       <div className="mt-4 space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
//                           <div className="md:col-span-4">
//                             <label className="text-xs text-slate-500 font-medium">Date</label>
//                             <input
//                               type="date"
//                               value={overrideDate}
//                               onChange={(e) => setOverrideDate(e.target.value)}
//                               className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                             />
//                           </div>

//                           <div className="md:col-span-3">
//                             <label className="text-xs text-slate-500 font-medium">Mode</label>
//                             <select
//                               value={overrideMode}
//                               onChange={(e) => setOverrideMode(e.target.value as any)}
//                               className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
//                             >
//                               <option value="available">Available</option>
//                               <option value="unavailable">Unavailable (all day)</option>
//                             </select>
//                           </div>

//                           <div className="md:col-span-3">
//                             <label className="text-xs text-slate-500 font-medium">Time window</label>
//                             <div className="mt-1 flex items-center gap-2">
//                               <input
//                                 type="time"
//                                 value={overrideStart}
//                                 disabled={overrideMode === "unavailable"}
//                                 onChange={(e) => setOverrideStart(e.target.value)}
//                                 className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                               />
//                               <span className="text-xs text-slate-400">to</span>
//                               <input
//                                 type="time"
//                                 value={overrideEnd}
//                                 disabled={overrideMode === "unavailable"}
//                                 onChange={(e) => setOverrideEnd(e.target.value)}
//                                 className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                               />
//                             </div>
//                           </div>

//                           <div className="md:col-span-2">
//                             <button
//                               type="button"
//                               onClick={addOrUpdateOverride}
//                               className="w-full h-11 px-4 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
//                             >
//                               Add/Update
//                             </button>
//                           </div>
//                         </div>

//                         {overrides.length === 0 ? (
//                           <div className="text-sm text-slate-500">No overrides set.</div>
//                         ) : (
//                           <div className="border border-slate-200 rounded-2xl overflow-hidden">
//                             <div className="grid grid-cols-12 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
//                               <div className="col-span-4">Date</div>
//                               <div className="col-span-4">Override</div>
//                               <div className="col-span-3">Time</div>
//                               <div className="col-span-1" />
//                             </div>

//                             {overrides.map((o) => (
//                               <div
//                                 key={o.date}
//                                 className="grid grid-cols-12 px-3 py-2 text-sm border-t border-slate-200 items-center"
//                               >
//                                 <div className="col-span-4 font-medium text-slate-900">{o.date}</div>
//                                 <div className="col-span-4">
//                                   {o.mode === "unavailable" ? (
//                                     <span className="text-red-600 font-semibold">Unavailable</span>
//                                   ) : (
//                                     <span className="text-emerald-700 font-semibold">Available</span>
//                                   )}
//                                 </div>
//                                 <div className="col-span-3 text-slate-700">
//                                   {o.mode === "unavailable" ? "—" : `${o.start} – ${o.end}`}
//                                 </div>
//                                 <div className="col-span-1 text-right">
//                                   <button
//                                     type="button"
//                                     onClick={() => removeOverride(o.date)}
//                                     className="text-xs font-semibold text-slate-600 hover:text-red-600 transition"
//                                   >
//                                     Remove
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Blocks */}
//                 {activeTab === "blocks" && (
//                   <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
//                     <div className="text-sm font-semibold text-slate-900">Time blocks (unavailable windows)</div>
//                     <div className="mt-1 text-xs text-slate-500">
//                       Block a time range on a specific date (e.g. lunch). Blocks remove slots even if you are generally available.
//                     </div>

//                     {rawJsonMode ? (
//                       <div className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
//                         Time blocks UI is disabled while JSON mode is enabled. Turn off JSON mode to use this editor.
//                       </div>
//                     ) : (
//                       <div className="mt-4 space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
//                           <div className="md:col-span-4">
//                             <label className="text-xs text-slate-500 font-medium">Date</label>
//                             <input
//                               type="date"
//                               value={blockDate}
//                               onChange={(e) => setBlockDate(e.target.value)}
//                               className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                             />
//                           </div>

//                           <div className="md:col-span-6">
//                             <label className="text-xs text-slate-500 font-medium">Block time</label>
//                             <div className="mt-1 flex items-center gap-2">
//                               <input
//                                 type="time"
//                                 value={blockStart}
//                                 onChange={(e) => setBlockStart(e.target.value)}
//                                 className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                               />
//                               <span className="text-xs text-slate-400">to</span>
//                               <input
//                                 type="time"
//                                 value={blockEnd}
//                                 onChange={(e) => setBlockEnd(e.target.value)}
//                                 className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                               />
//                             </div>
//                           </div>

//                           <div className="md:col-span-2">
//                             <button
//                               type="button"
//                               onClick={addBlock}
//                               className="w-full h-11 px-4 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
//                             >
//                               Add block
//                             </button>
//                           </div>
//                         </div>

//                         {blocks.length === 0 ? (
//                           <div className="text-sm text-slate-500">No blocks set.</div>
//                         ) : (
//                           <div className="border border-slate-200 rounded-2xl overflow-hidden">
//                             <div className="grid grid-cols-12 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
//                               <div className="col-span-4">Date</div>
//                               <div className="col-span-7">Blocked</div>
//                               <div className="col-span-1" />
//                             </div>

//                             {blocks.map((b, idx) => (
//                               <div
//                                 key={`${b.date}_${b.start}_${idx}`}
//                                 className="grid grid-cols-12 px-3 py-2 text-sm border-t border-slate-200 items-center"
//                               >
//                                 <div className="col-span-4 font-medium text-slate-900">{b.date}</div>
//                                 <div className="col-span-7 text-slate-700">
//                                   {b.start} – {b.end}
//                                 </div>
//                                 <div className="col-span-1 text-right">
//                                   <button
//                                     type="button"
//                                     onClick={() => removeBlock(idx)}
//                                     className="text-xs font-semibold text-slate-600 hover:text-red-600 transition"
//                                   >
//                                     Remove
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Ranges */}
//                 {activeTab === "ranges" && (
//                   <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
//                     <div className="text-sm font-semibold text-slate-900">Date range availability</div>
//                     <div className="mt-1 text-xs text-slate-500">
//                       Set availability for a specific date range (e.g. next 2 weeks mornings). Applies when there is no explicit override for that date.
//                     </div>

//                     {rawJsonMode ? (
//                       <div className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
//                         Date range UI is disabled while JSON mode is enabled. Turn off JSON mode to use this editor.
//                       </div>
//                     ) : (
//                       <div className="mt-4 space-y-4">
//                         <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
//                           <div className="lg:col-span-3">
//                             <label className="text-xs text-slate-500 font-medium">Start date</label>
//                             <input
//                               type="date"
//                               value={rangeStartDate}
//                               onChange={(e) => setRangeStartDate(e.target.value)}
//                               className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                             />
//                           </div>
//                           <div className="lg:col-span-3">
//                             <label className="text-xs text-slate-500 font-medium">End date</label>
//                             <input
//                               type="date"
//                               value={rangeEndDate}
//                               onChange={(e) => setRangeEndDate(e.target.value)}
//                               className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                             />
//                           </div>

//                           <div className="lg:col-span-4">
//                             <label className="text-xs text-slate-500 font-medium">Time window</label>
//                             <div className="mt-1 flex items-center gap-2">
//                               <input
//                                 type="time"
//                                 value={rangeStartTime}
//                                 onChange={(e) => setRangeStartTime(e.target.value)}
//                                 className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                               />
//                               <span className="text-xs text-slate-400">to</span>
//                               <input
//                                 type="time"
//                                 value={rangeEndTime}
//                                 onChange={(e) => setRangeEndTime(e.target.value)}
//                                 className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
//                               />
//                             </div>
//                           </div>

//                           <div className="lg:col-span-2">
//                             <button
//                               type="button"
//                               onClick={addRange}
//                               className="w-full h-11 px-4 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
//                             >
//                               Add range
//                             </button>
//                           </div>
//                         </div>

//                         <div>
//                           <label className="text-xs text-slate-500 font-medium">Days in range</label>
//                           <div className="mt-2 flex flex-wrap gap-2">
//                             {DAY_LABELS.map((d, i) => (
//                               <button
//                                 key={d}
//                                 type="button"
//                                 onClick={() => toggleRangeDay(i)}
//                                 className={[
//                                   "px-3 py-1.5 rounded-xl text-xs font-semibold border transition",
//                                   rangeDays.includes(i)
//                                     ? "bg-indigo-600 border-indigo-600 text-white"
//                                     : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
//                                 ].join(" ")}
//                               >
//                                 {d}
//                               </button>
//                             ))}
//                           </div>
//                         </div>

//                         {ranges.length === 0 ? (
//                           <div className="text-sm text-slate-500">No date ranges set.</div>
//                         ) : (
//                           <div className="border border-slate-200 rounded-2xl overflow-hidden">
//                             <div className="grid grid-cols-12 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
//                               <div className="col-span-5">Range</div>
//                               <div className="col-span-4">Days</div>
//                               <div className="col-span-2">Time</div>
//                               <div className="col-span-1" />
//                             </div>

//                             {ranges.map((r) => (
//                               <div
//                                 key={r.id}
//                                 className="grid grid-cols-12 px-3 py-2 text-sm border-t border-slate-200 items-center"
//                               >
//                                 <div className="col-span-5 font-medium text-slate-900">
//                                   {r.start_date} → {r.end_date}
//                                 </div>
//                                 <div className="col-span-4 text-slate-700">
//                                   {(r.days || [])
//                                     .sort((a, b) => a - b)
//                                     .map((d) => DAY_LABELS[d])
//                                     .join(", ")}
//                                 </div>
//                                 <div className="col-span-2 text-slate-700">
//                                   {r.start} – {r.end}
//                                 </div>
//                                 <div className="col-span-1 text-right">
//                                   <button
//                                     type="button"
//                                     onClick={() => removeRange(r.id)}
//                                     className="text-xs font-semibold text-slate-600 hover:text-red-600 transition"
//                                   >
//                                     Remove
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Advanced */}
//                 {activeTab === "advanced" && (
//                   <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
//                     <div className="text-sm font-semibold text-slate-900">Advanced</div>
//                     <div className="mt-1 text-xs text-slate-500">
//                       Use JSON editor for complex setups (multiple intervals/day). UI editors are safe for common cases.
//                     </div>

//                     <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
//                         <div className="text-sm font-semibold text-slate-900">JSON mode</div>
//                         <div className="mt-1 text-xs text-slate-500">
//                           When enabled, Overrides/Blocks/Ranges UI will be disabled to avoid conflicts.
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => setRawJsonMode((s) => !s)}
//                           className={[
//                             "mt-3 h-10 px-4 rounded-xl text-sm font-semibold border transition",
//                             rawJsonMode
//                               ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
//                               : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
//                           ].join(" ")}
//                         >
//                           {rawJsonMode ? "Disable JSON mode" : "Enable JSON mode"}
//                         </button>
//                       </div>

//                       <div className="rounded-2xl border border-slate-200 p-4 bg-white">
//                         <div className="text-sm font-semibold text-slate-900">Tips</div>
//                         <ul className="mt-2 text-xs text-slate-600 space-y-1 list-disc pl-4">
//                           <li>Overrides always beat weekly hours.</li>
//                           <li>Blocks remove slots inside available windows.</li>
//                           <li>Date ranges apply only when no override exists for that date.</li>
//                         </ul>
//                       </div>
//                     </div>

//                     {rawJsonMode ? (
//                       <div className="mt-4">
//                         <div className="text-xs font-semibold text-slate-700">Availability JSON</div>
//                         <textarea
//                           value={rawJson}
//                           onChange={(e) => setRawJson(e.target.value)}
//                           rows={14}
//                           className="mt-2 w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono bg-white"
//                         />
//                       </div>
//                     ) : (
//                       <div className="mt-4 text-sm text-slate-600">
//                         JSON editor is currently disabled. Enable JSON mode from here or from the Basics card.
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Note: No other logic changed */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







//mobile responsive fix


"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import TimezonePicker from "../components/TimezonePicker";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "../hooks/useUserProfile";
import { fetchSchedule, updateSchedule, type Schedule } from "../api/schedule";
import { Menu } from "lucide-react";

type WeekRule = {
  start: string;
  end: string;
  enabled: boolean;
};

type DateOverride = {
  date: string; // YYYY-MM-DD
  mode: "available" | "unavailable";
  start: string;
  end: string;
};

type DateBlock = {
  date: string; // YYYY-MM-DD
  start: string;
  end: string;
};

type DateRangeRule = {
  id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  days: number[]; // 0=Mon ... 6=Sun
  start: string;
  end: string;
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// UI-only helper (no dependency required)
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function defaultWeek(): Record<string, WeekRule> {
  return {
    "0": { enabled: true, start: "09:00", end: "17:00" },
    "1": { enabled: true, start: "09:00", end: "17:00" },
    "2": { enabled: true, start: "09:00", end: "17:00" },
    "3": { enabled: true, start: "09:00", end: "17:00" },
    "4": { enabled: true, start: "09:00", end: "17:00" },
    "5": { enabled: false, start: "09:00", end: "17:00" },
    "6": { enabled: false, start: "09:00", end: "17:00" },
  };
}

function fromAvailabilityJson(raw?: string | null): Record<string, WeekRule> {
  const base = defaultWeek();
  if (!raw) return base;
  try {
    const data = JSON.parse(raw);
    const week = data?.week || data?.weekly || data?.rules;
    if (typeof week !== "object" || !week) return base;
    for (const k of Object.keys(base)) {
      const intervals = week[k];
      if (!Array.isArray(intervals) || !intervals.length) {
        base[k].enabled = false;
        continue;
      }
      const first = intervals[0] || {};
      base[k].enabled = true;
      base[k].start = String(first.start || base[k].start);
      base[k].end = String(first.end || base[k].end);
    }
  } catch {
    return base;
  }
  return base;
}

function detectBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function parseOverrides(raw?: string | null): DateOverride[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    const overrides = data?.overrides;
    if (!overrides || typeof overrides !== "object") return [];
    const out: DateOverride[] = [];
    for (const date of Object.keys(overrides)) {
      const v = overrides[date];

      if (Array.isArray(v)) {
        if (v.length > 0) {
          const first = v[0] || {};
          out.push({
            date,
            mode: "available",
            start: String(first.start || "09:00"),
            end: String(first.end || "17:00"),
          });
        } else {
          out.push({ date, mode: "unavailable", start: "09:00", end: "17:00" });
        }
        continue;
      }

      if (v && typeof v === "object") {
        const intervals = (v as any).intervals;
        if (intervals === undefined || intervals === null) {
          continue;
        }
        if (Array.isArray(intervals) && intervals.length > 0) {
          const first = intervals[0] || {};
          out.push({
            date,
            mode: "available",
            start: String(first.start || "09:00"),
            end: String(first.end || "17:00"),
          });
        } else {
          out.push({ date, mode: "unavailable", start: "09:00", end: "17:00" });
        }
      }
    }
    return out.sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

function parseBlocks(raw?: string | null): DateBlock[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    const overrides = data?.overrides;
    if (!overrides || typeof overrides !== "object") return [];
    const out: DateBlock[] = [];
    for (const date of Object.keys(overrides)) {
      const v = overrides[date];
      if (v && typeof v === "object" && !Array.isArray(v)) {
        const blocks = (v as any).blocks;
        if (Array.isArray(blocks)) {
          for (const b of blocks) {
            if (!b) continue;
            out.push({
              date,
              start: String((b as any).start || ""),
              end: String((b as any).end || ""),
            });
          }
        }
      }
    }
    return out
      .filter((x) => x.date && x.start && x.end)
      .sort((a, b) => (a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)));
  } catch {
    return [];
  }
}

function parseRanges(raw?: string | null): DateRangeRule[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    const ranges = data?.ranges;
    if (!Array.isArray(ranges)) return [];
    return ranges
      .filter((r: any) => r && r.start_date && r.end_date)
      .map((r: any, idx: number) => ({
        id: String(r.id || `${r.start_date}_${r.end_date}_${idx}`),
        start_date: String(r.start_date),
        end_date: String(r.end_date),
        days: Array.isArray(r.days) ? r.days.map((d: any) => Number(d)) : [0, 1, 2, 3, 4],
        start: String((r.intervals?.[0]?.start) || r.start || "09:00"),
        end: String((r.intervals?.[0]?.end) || r.end || "17:00"),
      }))
      .sort((a, b) => a.start_date.localeCompare(b.start_date));
  } catch {
    return [];
  }
}

function buildAvailabilityJson(
  week: Record<string, WeekRule>,
  overrides: DateOverride[],
  blocks: DateBlock[],
  ranges: DateRangeRule[]
): string {
  const out: any = { week: {}, overrides: {}, ranges: [] };
  for (const k of Object.keys(week)) {
    const r = week[k];
    out.week[k] = r.enabled ? [{ start: r.start, end: r.end }] : [];
  }

  for (const o of overrides) {
    if (!o?.date) continue;
    if (o.mode === "unavailable") {
      out.overrides[o.date] = [];
    } else {
      out.overrides[o.date] = { intervals: [{ start: o.start, end: o.end }], blocks: [] };
    }
  }

  for (const b of blocks) {
    if (!b?.date) continue;
    if (!b.start || !b.end || b.end <= b.start) continue;

    const existing = out.overrides[b.date];
    if (Array.isArray(existing)) continue;

    if (!existing) {
      out.overrides[b.date] = { intervals: null, blocks: [{ start: b.start, end: b.end }] };
      continue;
    }

    if (typeof existing === "object") {
      existing.blocks = Array.isArray(existing.blocks) ? existing.blocks : [];
      existing.blocks.push({ start: b.start, end: b.end });
    }
  }

  out.ranges = (ranges || [])
    .filter((r) => r.start_date && r.end_date && r.end > r.start)
    .map((r) => ({
      id: r.id,
      start_date: r.start_date,
      end_date: r.end_date,
      days: Array.isArray(r.days) && r.days.length ? r.days : [0, 1, 2, 3, 4],
      intervals: [{ start: r.start, end: r.end }],
    }));

  return JSON.stringify(out);
}

type TabKey = "weekly" | "overrides" | "blocks" | "ranges" | "advanced";

export default function YourSchedulePage() {
  const { toast } = useToast();

  // UI shell responsiveness (NO business logic)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  const [userSub, setUserSub] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("slotly_user");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setUserSub(parsed.sub);
    } catch {}
  }, []);

  // Sidebar: desktop open, mobile closed by default
  useEffect(() => {
    const apply = () => {
      if (typeof window === "undefined") return;
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const { data: user } = useUserProfile(userSub);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [week, setWeek] = useState<Record<string, WeekRule>>(defaultWeek());
  const [rawJsonMode, setRawJsonMode] = useState(false);
  const [rawJson, setRawJson] = useState<string>("");

  // UI-only
  const [activeTab, setActiveTab] = useState<TabKey>("weekly");

  // Date overrides (non-JSON mode)
  const [overrides, setOverrides] = useState<DateOverride[]>([]);
  const [overrideDate, setOverrideDate] = useState<string>("");
  const [overrideMode, setOverrideMode] = useState<DateOverride["mode"]>("available");
  const [overrideStart, setOverrideStart] = useState<string>("09:00");
  const [overrideEnd, setOverrideEnd] = useState<string>("17:00");

  // Time blocks inside a specific date (e.g. 14:00-16:00 unavailable)
  const [blocks, setBlocks] = useState<DateBlock[]>([]);
  const [blockDate, setBlockDate] = useState<string>("");
  const [blockStart, setBlockStart] = useState<string>("14:00");
  const [blockEnd, setBlockEnd] = useState<string>("16:00");

  // Date range availability rules
  const [ranges, setRanges] = useState<DateRangeRule[]>([]);
  const [rangeStartDate, setRangeStartDate] = useState<string>("");
  const [rangeEndDate, setRangeEndDate] = useState<string>("");
  const [rangeStartTime, setRangeStartTime] = useState<string>("09:00");
  const [rangeEndTime, setRangeEndTime] = useState<string>("17:00");
  const [rangeDays, setRangeDays] = useState<number[]>([0, 1, 2, 3, 4]);

  const tzOptions = useMemo(() => {
    try {
      // @ts-ignore
      const list = (Intl as any).supportedValuesOf?.("timeZone") as string[] | undefined;
      if (Array.isArray(list) && list.length) return list;
    } catch {}
    return [
      "Asia/Kolkata",
      "Asia/Dubai",
      "Asia/Singapore",
      "Europe/London",
      "Europe/Paris",
      "America/New_York",
      "America/Los_Angeles",
      "UTC",
    ];
  }, []);

  useEffect(() => {
    if (!userSub) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchSchedule(userSub);
        if (!mounted) return;

        const detectedTz = detectBrowserTimeZone();
        const normalized = {
          ...data,
          timezone: (data?.timezone || "").trim() || detectedTz,
        };

        setSchedule(normalized);
        setWeek(fromAvailabilityJson(normalized.availability_json));
        setOverrides(parseOverrides(normalized.availability_json));
        setBlocks(parseBlocks(normalized.availability_json));
        setRanges(parseRanges(normalized.availability_json));
        setRawJson(normalized.availability_json || buildAvailabilityJson(fromAvailabilityJson(null), [], [], []));

        if (!data?.timezone || !String(data.timezone).trim()) {
          try {
            await updateSchedule(userSub, { timezone: detectedTz });
          } catch {}
        }
      } catch (e: any) {
        toast({
          title: "Failed to load schedule",
          description: e?.message || "Please try again.",
          variant: "destructive",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userSub, toast]);

  async function save() {
    if (!userSub || !schedule) return;
    setSaving(true);
    try {
      const availability_json = rawJsonMode ? rawJson : buildAvailabilityJson(week, overrides, blocks, ranges);

      const updated = await updateSchedule(userSub, {
        timezone: schedule.timezone,
        duration_minutes: schedule.duration_minutes,
        availability_json,
        buffer_before_minutes: schedule.buffer_before_minutes,
        buffer_after_minutes: schedule.buffer_after_minutes,
        min_notice_minutes: schedule.min_notice_minutes,
        max_days_ahead: schedule.max_days_ahead,
      });

      setSchedule(updated);
      setWeek(fromAvailabilityJson(updated.availability_json));
      setOverrides(parseOverrides(updated.availability_json));
      setBlocks(parseBlocks(updated.availability_json));
      setRanges(parseRanges(updated.availability_json));
      setRawJson(updated.availability_json || "");

      toast({
        title: "Schedule saved",
        description: "Your availability rules have been updated.",
        variant: "success",
      });
    } catch (e: any) {
      toast({
        title: "Failed to save",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  function addOrUpdateOverride() {
    if (!overrideDate) return;

    if (overrideMode === "available") {
      if (!overrideStart || !overrideEnd || overrideEnd <= overrideStart) {
        toast({
          title: "Invalid override time",
          description: "End time must be after start time.",
          variant: "destructive",
        });
        return;
      }
    }

    setOverrides((curr) => {
      const next = curr.filter((o) => o.date !== overrideDate);
      next.push({
        date: overrideDate,
        mode: overrideMode,
        start: overrideStart,
        end: overrideEnd,
      });
      return next.sort((a, b) => a.date.localeCompare(b.date));
    });
  }

  function removeOverride(date: string) {
    setOverrides((curr) => curr.filter((o) => o.date !== date));
  }

  function addBlock() {
    if (!blockDate) return;
    if (!blockStart || !blockEnd || blockEnd <= blockStart) {
      toast({
        title: "Invalid block time",
        description: "Block end time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    setBlocks((curr) => {
      const next = [...curr, { date: blockDate, start: blockStart, end: blockEnd }];
      return next.sort((a, b) => (a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)));
    });
  }

  function removeBlock(idx: number) {
    setBlocks((curr) => curr.filter((_, i) => i !== idx));
  }

  function toggleRangeDay(dayIdx: number) {
    setRangeDays((curr) => {
      if (curr.includes(dayIdx)) return curr.filter((d) => d !== dayIdx);
      return [...curr, dayIdx].sort((a, b) => a - b);
    });
  }

  function addRange() {
    if (!rangeStartDate || !rangeEndDate) return;
    if (rangeEndDate < rangeStartDate) {
      toast({
        title: "Invalid date range",
        description: "End date must be on or after start date.",
        variant: "destructive",
      });
      return;
    }
    if (!rangeStartTime || !rangeEndTime || rangeEndTime <= rangeStartTime) {
      toast({
        title: "Invalid range time",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    const id = `${rangeStartDate}_${rangeEndDate}_${Date.now()}`;
    setRanges((curr) => {
      const next = [
        ...curr,
        {
          id,
          start_date: rangeStartDate,
          end_date: rangeEndDate,
          days: rangeDays.length ? rangeDays : [0, 1, 2, 3, 4],
          start: rangeStartTime,
          end: rangeEndTime,
        },
      ];
      return next.sort((a, b) => a.start_date.localeCompare(b.start_date));
    });
  }

  function removeRange(id: string) {
    setRanges((curr) => curr.filter((r) => r.id !== id));
  }

  // ---------- UI Helpers (display only, no logic changes) ----------
  const summary = useMemo(() => {
    const tz = schedule?.timezone || detectBrowserTimeZone();
    const enabledDays = Object.keys(week)
      .map((k) => Number(k))
      .filter((k) => week[String(k)]?.enabled);

    const dayText =
      enabledDays.length === 0
        ? "No weekly hours"
        : enabledDays.length === 7
        ? "Mon–Sun"
        : enabledDays.join(",");

    const labels = enabledDays.map((d) => DAY_LABELS[d]).filter(Boolean);
    let prettyDays = labels.join(", ");
    if (enabledDays.length === 5 && enabledDays[0] === 0 && enabledDays[4] === 4) prettyDays = "Mon–Fri";
    if (enabledDays.length === 7) prettyDays = "Mon–Sun";

    const firstEnabled = enabledDays[0];
    const timeText =
      typeof firstEnabled === "number"
        ? `${week[String(firstEnabled)]?.start || "09:00"}–${week[String(firstEnabled)]?.end || "17:00"}`
        : "—";

    return { tz, prettyDays: prettyDays || dayText, timeText };
  }, [schedule?.timezone, week]);

  function TabButton({ id, label, disabled }: { id: TabKey; label: string; disabled?: boolean }) {
    const active = activeTab === id;
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setActiveTab(id)}
        className={cx(
          "shrink-0 px-3 py-2 rounded-xl text-sm font-semibold transition border",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50",
          active ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-700"
        )}
      >
        {label}
      </button>
    );
  }

  const uiDisabledByJson = rawJsonMode;

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Desktop sidebar */}
      {isDesktop ? (
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((s) => !s)} user={user} />
      ) : null}

      {/* Mobile drawer sidebar */}
      {!isDesktop && sidebarOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/35" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full">
            <Sidebar open={true} onToggle={() => setSidebarOpen(false)} user={user} />
          </div>
        </div>
      ) : null}

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top bar area */}
        <div className="shrink-0 px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
          {/* Mobile menu button */}
          {!isDesktop ? (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="absolute left-3 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 active:scale-[0.98] transition lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
          ) : null}

          <div className={cx(!isDesktop && "pl-12 sm:pl-0")}>
            <Topbar user={user} searchQuery="" onSearchQueryChange={() => {}} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 pb-24 sm:pb-10">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-slate-900">Your Schedule</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Define availability once. Slotly will only show bookable time slots inside these windows (host timezone).
                </p>
              </div>

              {/* Desktop save */}
              <button
                onClick={save}
                disabled={saving || loading || !schedule}
                className={cx(
                  "hidden sm:inline-flex h-11 px-5 rounded-xl text-sm font-semibold transition shadow-sm",
                  saving || loading || !schedule
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                )}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>

            {/* Summary bar */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">Current availability</div>
                  <div className="mt-1 text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{summary.prettyDays}</span>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <span className="font-semibold text-slate-900">{summary.timeText}</span>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <span className="text-slate-600">{summary.tz}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Overrides and blocks always take priority over weekly hours.
                  </div>
                </div>

                {/* Tabs: scrollable on mobile */}
                <div className="w-full sm:w-auto">
                  <div className="mt-3 sm:mt-0 flex gap-2 overflow-x-auto pb-1">
                    <TabButton id="weekly" label="Weekly hours" />
                    <TabButton id="overrides" label="Overrides" disabled={uiDisabledByJson} />
                    <TabButton id="blocks" label="Blocks" disabled={uiDisabledByJson} />
                    <TabButton id="ranges" label="Date ranges" disabled={uiDisabledByJson} />
                    <TabButton id="advanced" label="Advanced" />
                  </div>
                </div>
              </div>

              {rawJsonMode ? (
                <div className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  JSON mode is enabled. UI editors (Overrides/Blocks/Date ranges) are disabled to avoid conflicts.
                </div>
              ) : null}
            </div>

            {/* Main grid */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Basics */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">Basics</div>
                    <button
                      type="button"
                      onClick={() => setRawJsonMode((s) => !s)}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      {rawJsonMode ? "Hide JSON" : "Edit JSON"}
                    </button>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <TimezonePicker
                        value={schedule?.timezone || ""}
                        onChange={(next) => setSchedule((s) => (s ? { ...s, timezone: next } : s))}
                        label="Host timezone"
                        title="Host timezone (used for availability rules + booking links)"
                        helperText={
                          <>
                            Auto-detected: <span className="font-medium text-gray-700">{detectBrowserTimeZone()}</span>
                          </>
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 font-medium">Slot duration (minutes)</label>
                      <select
                        value={schedule?.duration_minutes || 30}
                        onChange={(e) =>
                          setSchedule((s) => (s ? { ...s, duration_minutes: parseInt(e.target.value, 10) || 30 } : s))
                        }
                        className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
                      >
                        {[15, 20, 30, 45, 60, 90, 120].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 font-medium">Buffer before</label>
                        <input
                          type="number"
                          min={0}
                          value={schedule?.buffer_before_minutes || 0}
                          onChange={(e) =>
                            setSchedule((s) =>
                              s ? { ...s, buffer_before_minutes: parseInt(e.target.value, 10) || 0 } : s
                            )
                          }
                          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-medium">Buffer after</label>
                        <input
                          type="number"
                          min={0}
                          value={schedule?.buffer_after_minutes || 0}
                          onChange={(e) =>
                            setSchedule((s) =>
                              s ? { ...s, buffer_after_minutes: parseInt(e.target.value, 10) || 0 } : s
                            )
                          }
                          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 font-medium">Min notice (minutes)</label>
                        <input
                          type="number"
                          min={0}
                          value={schedule?.min_notice_minutes || 0}
                          onChange={(e) =>
                            setSchedule((s) =>
                              s ? { ...s, min_notice_minutes: parseInt(e.target.value, 10) || 0 } : s
                            )
                          }
                          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-medium">Max days ahead</label>
                        <input
                          type="number"
                          min={0}
                          value={schedule?.max_days_ahead || 60}
                          onChange={(e) =>
                            setSchedule((s) => (s ? { ...s, max_days_ahead: parseInt(e.target.value, 10) || 60 } : s))
                          }
                          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    {rawJsonMode ? (
                      <div className="pt-1">
                        <div className="text-xs font-semibold text-slate-700">Availability JSON</div>
                        <textarea
                          value={rawJson}
                          onChange={(e) => setRawJson(e.target.value)}
                          rows={12}
                          className="mt-2 w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono bg-white"
                        />
                        <div className="mt-2 text-[11px] text-slate-500">
                          Use carefully. UI editors are disabled while JSON mode is enabled.
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                  <div className="text-sm font-semibold text-indigo-900">How this affects bookings</div>
                  <div className="mt-1 text-xs text-indigo-800 leading-relaxed">
                    Invitees can pick their timezone for display, but availability is always evaluated in your host timezone.
                    Buffers, min notice, and max days ahead are enforced server-side.
                  </div>
                </div>
              </div>

              {/* Right: Tab content */}
              <div className="lg:col-span-8">
                {/* Weekly hours */}
                {activeTab === "weekly" && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
                    <div className="text-sm font-semibold text-slate-900">Weekly hours</div>
                    <div className="mt-1 text-xs text-slate-500">
                      One interval per day (start/end). For multiple intervals, use JSON editor.
                    </div>

                    {loading ? (
                      <div className="mt-6 text-sm text-slate-500">Loading…</div>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {Object.keys(week)
                          .sort((a, b) => Number(a) - Number(b))
                          .map((k) => (
                            <div
                              key={k}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/40"
                            >
                              <div className="flex items-center justify-between sm:justify-start gap-3">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={!!week[k].enabled}
                                    onChange={(e) =>
                                      setWeek((w) => ({
                                        ...w,
                                        [k]: { ...w[k], enabled: e.target.checked },
                                      }))
                                    }
                                  />
                                  <div className="font-semibold text-slate-900 w-12">{DAY_LABELS[Number(k)]}</div>
                                </div>

                                {/* small badge on mobile */}
                                <span
                                  className={cx(
                                    "sm:hidden text-[11px] px-2 py-1 rounded-full border",
                                    week[k].enabled ? "bg-white border-slate-200 text-slate-600" : "bg-slate-100 border-slate-200 text-slate-500"
                                  )}
                                >
                                  {week[k].enabled ? "Enabled" : "Off"}
                                </span>
                              </div>

                              {/* Mobile: 2-col grid, Desktop: inline */}
                              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                                <input
                                  type="time"
                                  value={week[k].start}
                                  disabled={!week[k].enabled}
                                  onChange={(e) =>
                                    setWeek((w) => ({
                                      ...w,
                                      [k]: { ...w[k], start: e.target.value },
                                    }))
                                  }
                                  className="border border-slate-200 rounded-xl px-2.5 py-2 sm:py-1.5 text-sm bg-white w-full sm:w-auto"
                                />
                                <span className="hidden sm:inline text-sm text-slate-400">to</span>
                                <input
                                  type="time"
                                  value={week[k].end}
                                  disabled={!week[k].enabled}
                                  onChange={(e) =>
                                    setWeek((w) => ({
                                      ...w,
                                      [k]: { ...w[k], end: e.target.value },
                                    }))
                                  }
                                  className="border border-slate-200 rounded-xl px-2.5 py-2 sm:py-1.5 text-sm bg-white w-full sm:w-auto"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Overrides */}
                {activeTab === "overrides" && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
                    <div className="text-sm font-semibold text-slate-900">Date overrides</div>
                    <div className="mt-1 text-xs text-slate-500">
                      One-off availability changes. Overrides always win over weekly rules.
                    </div>

                    {rawJsonMode ? (
                      <div className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                        Date overrides UI is disabled while JSON mode is enabled. Turn off JSON mode to use this editor.
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                          <div className="lg:col-span-4">
                            <label className="text-xs text-slate-500 font-medium">Date</label>
                            <input
                              type="date"
                              value={overrideDate}
                              onChange={(e) => setOverrideDate(e.target.value)}
                              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>

                          <div className="lg:col-span-3">
                            <label className="text-xs text-slate-500 font-medium">Mode</label>
                            <select
                              value={overrideMode}
                              onChange={(e) => setOverrideMode(e.target.value as any)}
                              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
                            >
                              <option value="available">Available</option>
                              <option value="unavailable">Unavailable (all day)</option>
                            </select>
                          </div>

                          <div className="lg:col-span-3">
                            <label className="text-xs text-slate-500 font-medium">Time window</label>
                            <div className="mt-1 grid grid-cols-2 sm:flex items-center gap-2">
                              <input
                                type="time"
                                value={overrideStart}
                                disabled={overrideMode === "unavailable"}
                                onChange={(e) => setOverrideStart(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                              />
                              <span className="hidden sm:inline text-xs text-slate-400">to</span>
                              <input
                                type="time"
                                value={overrideEnd}
                                disabled={overrideMode === "unavailable"}
                                onChange={(e) => setOverrideEnd(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                              />
                            </div>
                          </div>

                          <div className="lg:col-span-2">
                            <button
                              type="button"
                              onClick={addOrUpdateOverride}
                              className="w-full h-11 px-4 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
                            >
                              Add/Update
                            </button>
                          </div>
                        </div>

                        {overrides.length === 0 ? (
                          <div className="text-sm text-slate-500">No overrides set.</div>
                        ) : (
                          <div className="border border-slate-200 rounded-2xl overflow-hidden">
                            <div className="hidden sm:grid grid-cols-12 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                              <div className="col-span-4">Date</div>
                              <div className="col-span-4">Override</div>
                              <div className="col-span-3">Time</div>
                              <div className="col-span-1" />
                            </div>

                            {overrides.map((o) => (
                              <div
                                key={o.date}
                                className="grid grid-cols-1 sm:grid-cols-12 px-3 py-3 text-sm border-t border-slate-200 items-start sm:items-center gap-1 sm:gap-0"
                              >
                                <div className="sm:col-span-4 font-medium text-slate-900">{o.date}</div>
                                <div className="sm:col-span-4">
                                  {o.mode === "unavailable" ? (
                                    <span className="text-red-600 font-semibold">Unavailable</span>
                                  ) : (
                                    <span className="text-emerald-700 font-semibold">Available</span>
                                  )}
                                </div>
                                <div className="sm:col-span-3 text-slate-700">
                                  {o.mode === "unavailable" ? "—" : `${o.start} – ${o.end}`}
                                </div>
                                <div className="sm:col-span-1 sm:text-right">
                                  <button
                                    type="button"
                                    onClick={() => removeOverride(o.date)}
                                    className="text-xs font-semibold text-slate-600 hover:text-red-600 transition"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Blocks */}
                {activeTab === "blocks" && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
                    <div className="text-sm font-semibold text-slate-900">Time blocks (unavailable windows)</div>
                    <div className="mt-1 text-xs text-slate-500">
                      Block a time range on a specific date (e.g. lunch). Blocks remove slots even if you are generally available.
                    </div>

                    {rawJsonMode ? (
                      <div className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                        Time blocks UI is disabled while JSON mode is enabled. Turn off JSON mode to use this editor.
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                          <div className="lg:col-span-4">
                            <label className="text-xs text-slate-500 font-medium">Date</label>
                            <input
                              type="date"
                              value={blockDate}
                              onChange={(e) => setBlockDate(e.target.value)}
                              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>

                          <div className="lg:col-span-6">
                            <label className="text-xs text-slate-500 font-medium">Block time</label>
                            <div className="mt-1 grid grid-cols-2 sm:flex items-center gap-2">
                              <input
                                type="time"
                                value={blockStart}
                                onChange={(e) => setBlockStart(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                              />
                              <span className="hidden sm:inline text-xs text-slate-400">to</span>
                              <input
                                type="time"
                                value={blockEnd}
                                onChange={(e) => setBlockEnd(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                              />
                            </div>
                          </div>

                          <div className="lg:col-span-2">
                            <button
                              type="button"
                              onClick={addBlock}
                              className="w-full h-11 px-4 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
                            >
                              Add block
                            </button>
                          </div>
                        </div>

                        {blocks.length === 0 ? (
                          <div className="text-sm text-slate-500">No blocks set.</div>
                        ) : (
                          <div className="border border-slate-200 rounded-2xl overflow-hidden">
                            <div className="hidden sm:grid grid-cols-12 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                              <div className="col-span-4">Date</div>
                              <div className="col-span-7">Blocked</div>
                              <div className="col-span-1" />
                            </div>

                            {blocks.map((b, idx) => (
                              <div
                                key={`${b.date}_${b.start}_${idx}`}
                                className="grid grid-cols-1 sm:grid-cols-12 px-3 py-3 text-sm border-t border-slate-200 items-start sm:items-center gap-1 sm:gap-0"
                              >
                                <div className="sm:col-span-4 font-medium text-slate-900">{b.date}</div>
                                <div className="sm:col-span-7 text-slate-700">
                                  {b.start} – {b.end}
                                </div>
                                <div className="sm:col-span-1 sm:text-right">
                                  <button
                                    type="button"
                                    onClick={() => removeBlock(idx)}
                                    className="text-xs font-semibold text-slate-600 hover:text-red-600 transition"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Ranges */}
                {activeTab === "ranges" && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
                    <div className="text-sm font-semibold text-slate-900">Date range availability</div>
                    <div className="mt-1 text-xs text-slate-500">
                      Set availability for a specific date range (e.g. next 2 weeks mornings). Applies when there is no explicit override for that date.
                    </div>

                    {rawJsonMode ? (
                      <div className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                        Date range UI is disabled while JSON mode is enabled. Turn off JSON mode to use this editor.
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                          <div className="lg:col-span-3">
                            <label className="text-xs text-slate-500 font-medium">Start date</label>
                            <input
                              type="date"
                              value={rangeStartDate}
                              onChange={(e) => setRangeStartDate(e.target.value)}
                              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="lg:col-span-3">
                            <label className="text-xs text-slate-500 font-medium">End date</label>
                            <input
                              type="date"
                              value={rangeEndDate}
                              onChange={(e) => setRangeEndDate(e.target.value)}
                              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>

                          <div className="lg:col-span-4">
                            <label className="text-xs text-slate-500 font-medium">Time window</label>
                            <div className="mt-1 grid grid-cols-2 sm:flex items-center gap-2">
                              <input
                                type="time"
                                value={rangeStartTime}
                                onChange={(e) => setRangeStartTime(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                              />
                              <span className="hidden sm:inline text-xs text-slate-400">to</span>
                              <input
                                type="time"
                                value={rangeEndTime}
                                onChange={(e) => setRangeEndTime(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                              />
                            </div>
                          </div>

                          <div className="lg:col-span-2">
                            <button
                              type="button"
                              onClick={addRange}
                              className="w-full h-11 px-4 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
                            >
                              Add range
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-slate-500 font-medium">Days in range</label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {DAY_LABELS.map((d, i) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => toggleRangeDay(i)}
                                className={cx(
                                  "px-3 py-1.5 rounded-xl text-xs font-semibold border transition",
                                  rangeDays.includes(i)
                                    ? "bg-indigo-600 border-indigo-600 text-white"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                )}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        </div>

                        {ranges.length === 0 ? (
                          <div className="text-sm text-slate-500">No date ranges set.</div>
                        ) : (
                          <div className="border border-slate-200 rounded-2xl overflow-hidden">
                            <div className="hidden sm:grid grid-cols-12 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                              <div className="col-span-5">Range</div>
                              <div className="col-span-4">Days</div>
                              <div className="col-span-2">Time</div>
                              <div className="col-span-1" />
                            </div>

                            {ranges.map((r) => (
                              <div
                                key={r.id}
                                className="grid grid-cols-1 sm:grid-cols-12 px-3 py-3 text-sm border-t border-slate-200 items-start sm:items-center gap-1 sm:gap-0"
                              >
                                <div className="sm:col-span-5 font-medium text-slate-900">
                                  {r.start_date} → {r.end_date}
                                </div>
                                <div className="sm:col-span-4 text-slate-700">
                                  {(r.days || [])
                                    .sort((a, b) => a - b)
                                    .map((d) => DAY_LABELS[d])
                                    .join(", ")}
                                </div>
                                <div className="sm:col-span-2 text-slate-700">
                                  {r.start} – {r.end}
                                </div>
                                <div className="sm:col-span-1 sm:text-right">
                                  <button
                                    type="button"
                                    onClick={() => removeRange(r.id)}
                                    className="text-xs font-semibold text-slate-600 hover:text-red-600 transition"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Advanced */}
                {activeTab === "advanced" && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-5">
                    <div className="text-sm font-semibold text-slate-900">Advanced</div>
                    <div className="mt-1 text-xs text-slate-500">
                      Use JSON editor for complex setups (multiple intervals/day). UI editors are safe for common cases.
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
                        <div className="text-sm font-semibold text-slate-900">JSON mode</div>
                        <div className="mt-1 text-xs text-slate-500">
                          When enabled, Overrides/Blocks/Ranges UI will be disabled to avoid conflicts.
                        </div>
                        <button
                          type="button"
                          onClick={() => setRawJsonMode((s) => !s)}
                          className={cx(
                            "mt-3 h-10 px-4 rounded-xl text-sm font-semibold border transition",
                            rawJsonMode
                              ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          )}
                        >
                          {rawJsonMode ? "Disable JSON mode" : "Enable JSON mode"}
                        </button>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                        <div className="text-sm font-semibold text-slate-900">Tips</div>
                        <ul className="mt-2 text-xs text-slate-600 space-y-1 list-disc pl-4">
                          <li>Overrides always beat weekly hours.</li>
                          <li>Blocks remove slots inside available windows.</li>
                          <li>Date ranges apply only when no override exists for that date.</li>
                        </ul>
                      </div>
                    </div>

                    {rawJsonMode ? (
                      <div className="mt-4">
                        <div className="text-xs font-semibold text-slate-700">Availability JSON</div>
                        <textarea
                          value={rawJson}
                          onChange={(e) => setRawJson(e.target.value)}
                          rows={14}
                          className="mt-2 w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono bg-white"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 text-sm text-slate-600">
                        JSON editor is currently disabled. Enable JSON mode from here or from the Basics card.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Note: No other logic changed */}
          </div>
        </div>

        {/* Mobile sticky save CTA (Calendly-style) */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-3 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          <button
            onClick={save}
            disabled={saving || loading || !schedule}
            className={cx(
              "w-full h-12 rounded-2xl text-sm font-semibold shadow-sm",
              saving || loading || !schedule
                ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            )}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
