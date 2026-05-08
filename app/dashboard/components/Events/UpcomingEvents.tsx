// // // // // "use client";

// // // // // import React, { useEffect, useMemo, useState } from "react";
// // // // // import { CalendarEvent } from "../../types";
// // // // // import { CalendarDays, Clock, ExternalLink } from "lucide-react";
// // // // // import { safeDate } from "../Calendar/CalendarHelpers";
// // // // // import { getPreferredTimezone, subscribeTimezoneChange } from "@/lib/timezone";

// // // // // function fmtStart(iso?: string, tz?: string) {
// // // // //   const d = safeDate(iso);
// // // // //   if (!d) return "";

// // // // //   // If tz not provided, fallback to browser default behavior
// // // // //   if (!tz) {
// // // // //     return d.toLocaleString([], {
// // // // //       day: "2-digit",
// // // // //       month: "short",
// // // // //       hour: "2-digit",
// // // // //       minute: "2-digit",
// // // // //     });
// // // // //   }

// // // // //   return new Intl.DateTimeFormat(undefined, {
// // // // //     timeZone: tz,
// // // // //     day: "2-digit",
// // // // //     month: "short",
// // // // //     hour: "2-digit",
// // // // //     minute: "2-digit",
// // // // //     hour12: false,
// // // // //   }).format(d);
// // // // // }

// // // // // export default function UpcomingEvents({
// // // // //   events,
// // // // //   selectedDate,
// // // // // }: {
// // // // //   events: CalendarEvent[];
// // // // //   selectedDate?: string;
// // // // // }) {
// // // // //   // ✅ Reactively track timezone preference (localStorage + event)
// // // // //   const [tz, setTz] = useState<string>(() => getPreferredTimezone());

// // // // //   useEffect(() => {
// // // // //     return subscribeTimezoneChange(() => setTz(getPreferredTimezone()));
// // // // //   }, []);

// // // // //   const next = useMemo(() => {
// // // // //     const selectedDayStart = selectedDate
// // // // //       ? new Date(`${selectedDate}T00:00:00`)
// // // // //       : null;

// // // // //     return events
// // // // //       .filter((ev: any) => {
// // // // //         if (!ev?.start) return false;

// // // // //         const start = safeDate(ev.start);
// // // // //         if (!start) return false;

// // // // //         // If user clicked a date, upcoming starts from that date (not “now”)
// // // // //         if (selectedDayStart) {
// // // // //           return start.getTime() >= selectedDayStart.getTime();
// // // // //         }

// // // // //         // Otherwise upcoming from now
// // // // //         return new Date(ev.end || ev.start).getTime() >= Date.now();
// // // // //       })
// // // // //       .sort((a: any, b: any) => {
// // // // //         const ta = a?.start ? new Date(a.start).getTime() : 0;
// // // // //         const tb = b?.start ? new Date(b.start).getTime() : 0;
// // // // //         return ta - tb;
// // // // //       })
// // // // //       .slice(0, 6);
// // // // //   }, [events, selectedDate]);

// // // // //   const headerLabel = selectedDate ? `Upcoming from ${selectedDate}` : "Upcoming";

// // // // //   return (
// // // // //     <section
// // // // //       aria-label="Upcoming events"
// // // // //       className="bg-white rounded-2xl border border-gray-100 shadow-sm"
// // // // //     >
// // // // //       <div className="p-4 sm:p-6">
// // // // //         <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
// // // // //           <div className="flex items-center gap-2 min-w-0">
// // // // //             <CalendarDays className="w-4 h-4 text-slate-700 shrink-0" />
// // // // //             <h4 className="font-semibold truncate">{headerLabel}</h4>
// // // // //           </div>
// // // // //           <div className="text-xs text-gray-500 shrink-0">{next.length} shown</div>
// // // // //         </div>

// // // // //         {next.length === 0 ? (
// // // // //           <div className="rounded-xl border border-dashed border-gray-200 p-4 bg-white">
// // // // //             <div className="text-sm font-semibold text-slate-900">
// // // // //               No upcoming events
// // // // //             </div>
// // // // //             <div className="text-sm text-gray-500 mt-1">
// // // // //               Share your booking link to start getting meetings.
// // // // //             </div>
// // // // //           </div>
// // // // //         ) : (
// // // // //           <ul className="space-y-3">
// // // // //             {next.map((ev: any, idx: number) => {
// // // // //               const summary = ev?.summary || "Untitled";
// // // // //               const startLabel = fmtStart(ev?.start, tz); // ✅ timezone-aware
// // // // //               const organizer = ev?.organizer || "";
// // // // //               const htmlLink = ev?.htmlLink || "";

// // // // //               return (
// // // // //                 <li
// // // // //                   key={ev?.id ?? `${ev?.start ?? "no-start"}-${idx}`}
// // // // //                   className="p-3 sm:p-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition"
// // // // //                 >
// // // // //                   <div className="flex items-start justify-between gap-3">
// // // // //                     <div className="min-w-0">
// // // // //                       <div className="text-sm font-semibold truncate">{summary}</div>

// // // // //                       <div className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
// // // // //                         {startLabel ? (
// // // // //                           <span className="inline-flex items-center gap-1">
// // // // //                             <Clock className="w-3.5 h-3.5 shrink-0" />
// // // // //                             <span className="whitespace-nowrap">{startLabel}</span>
// // // // //                           </span>
// // // // //                         ) : null}

// // // // //                         {organizer ? (
// // // // //                           <span className="truncate">• {organizer}</span>
// // // // //                         ) : null}
// // // // //                       </div>
// // // // //                     </div>

// // // // //                     {htmlLink ? (
// // // // //                       <a
// // // // //                         className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1 shrink-0"
// // // // //                         href={htmlLink}
// // // // //                         target="_blank"
// // // // //                         rel="noreferrer"
// // // // //                         aria-label={`Open event: ${summary}`}
// // // // //                         title="Open in calendar"
// // // // //                       >
// // // // //                         <span className="hidden sm:inline">Open</span>
// // // // //                         <ExternalLink className="w-3.5 h-3.5" />
// // // // //                       </a>
// // // // //                     ) : null}
// // // // //                   </div>
// // // // //                 </li>
// // // // //               );
// // // // //             })}
// // // // //           </ul>
// // // // //         )}
// // // // //       </div>
// // // // //     </section>
// // // // //   );
// // // // // }

// // // // "use client";

// // // // import React, { useMemo } from "react";
// // // // import { useRouter } from "next/navigation";
// // // // import { CalendarDays, Clock, ArrowRight } from "lucide-react";

// // // // type Props = {
// // // //   events: any[];
// // // //   selectedDate?: string;
// // // // };

// // // // function formatDateTime(value?: string) {
// // // //   if (!value) return { date: "-", time: "-" };

// // // //   const d = new Date(value);
// // // //   if (Number.isNaN(d.getTime())) return { date: "-", time: "-" };

// // // //   return {
// // // //     date: d.toLocaleDateString("en-GB", {
// // // //       weekday: "short",
// // // //       day: "2-digit",
// // // //       month: "short",
// // // //     }),
// // // //     time: d.toLocaleTimeString([], {
// // // //       hour: "2-digit",
// // // //       minute: "2-digit",
// // // //     }),
// // // //   };
// // // // }

// // // // export default function UpcomingEvents({ events = [] }: Props) {
// // // //   const router = useRouter();

// // // //   const latestEvents = useMemo(() => {
// // // //     const now = Date.now();

// // // //     return [...(events || [])]
// // // //       .filter((e: any) => {
// // // //         const t = new Date(e?.start).getTime();
// // // //         return Number.isFinite(t) && t >= now;
// // // //       })
// // // //       .sort((a: any, b: any) => {
// // // //         const aTime = new Date(a?.start).getTime();
// // // //         const bTime = new Date(b?.start).getTime();
// // // //         return aTime - bTime;
// // // //       })
// // // //       .slice(0, 3);
// // // //   }, [events]);

// // // //   return (
// // // //     <section className="rounded-[28px] border border-[#D0D5DD] bg-[#F2F4F7] shadow-[0_2px_8px_rgba(16,24,40,0.04)]">  
// // // //         <div className="p-5 sm:p-6">
// // // //         <div className="mb-4 flex items-center justify-between gap-3">
// // // //           <div className="min-w-0">
// // // //             <div className="flex items-center gap-2">
// // // //               <h4 className="truncate text-[17px] font-semibold text-slate-900">
// // // //                 Upcoming Events
// // // //               </h4>
// // // //               <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 text-[11px] font-medium text-slate-600">
// // // //                 {latestEvents.length}
// // // //               </span>
// // // //             </div>
// // // //             <div className="mt-0.5 text-sm text-slate-500">
// // // //               Your next scheduled meetings.
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         <div className="space-y-3">
// // // //           {latestEvents.length === 0 ? (
// // // //             <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
// // // //               <div className="text-sm font-semibold text-slate-900">
// // // //                 No upcoming events
// // // //               </div>
// // // //               <div className="mt-1 text-sm text-slate-600">
// // // //                 Share your booking link to start getting meetings.
// // // //               </div>
// // // //             </div>
// // // //           ) : (
// // // //             latestEvents.map((event: any, idx: number) => {
// // // //               const title = event?.title || event?.summary || "Untitled meeting";
// // // //               const location = event?.location || event?.meeting_platform || "";
// // // //               const { date, time } = formatDateTime(event?.start);

// // // //               return (
// // // //                 <div
// // // //                   key={event?.id || `${title}-${idx}`}
// // // //                   className="rounded-xl border border-slate-200 bg-white p-3"
// // // //                 >
// // // //                   <div className="truncate text-sm font-semibold text-slate-900">
// // // //                     {title}
// // // //                   </div>

// // // //                   <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
// // // //                     <CalendarDays className="h-3.5 w-3.5 shrink-0" />
// // // //                     <span>{date}</span>
// // // //                   </div>

// // // //                   <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
// // // //                     <Clock className="h-3.5 w-3.5 shrink-0" />
// // // //                     <span>{time}</span>
// // // //                   </div>

// // // //                   {location ? (
// // // //                     <div className="mt-1 truncate text-xs text-slate-500">
// // // //                       {location}
// // // //                     </div>
// // // //                   ) : null}
// // // //                 </div>
// // // //               );
// // // //             })
// // // //           )}
// // // //         </div>

// // // //         <div className="mt-4">
// // // //           <button
// // // //             type="button"
// // // //             onClick={() => router.push("/dashboard/event-types?tab=meetings")}
// // // //             className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
// // // //           >
// // // //             View all
// // // //             <ArrowRight className="h-4 w-4 shrink-0" />
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </section>
// // // //   );
// // // // }

// // // "use client";

// // // import React, { useMemo } from "react";
// // // import { useRouter } from "next/navigation";
// // // import { CalendarDays, Clock, ArrowRight } from "lucide-react";

// // // type Props = {
// // //   events: any[];
// // //   selectedDate?: string;
// // // };

// // // function formatDateTime(value?: string) {
// // //   if (!value) return { date: "-", time: "-" };

// // //   const d = new Date(value);
// // //   if (Number.isNaN(d.getTime())) return { date: "-", time: "-" };

// // //   return {
// // //     date: d.toLocaleDateString("en-GB", {
// // //       weekday: "short",
// // //       day: "2-digit",
// // //       month: "short",
// // //     }),
// // //     time: d.toLocaleTimeString([], {
// // //       hour: "2-digit",
// // //       minute: "2-digit",
// // //     }),
// // //   };
// // // }

// // // export default function UpcomingEvents({ events = [] }: Props) {
// // //   const router = useRouter();

// // //   const latestEvents = useMemo(() => {
// // //     const now = Date.now();

// // //     return [...(events || [])]
// // //       .filter((e: any) => {
// // //         const t = new Date(e?.start).getTime();
// // //         return Number.isFinite(t) && t >= now;
// // //       })
// // //       .sort((a: any, b: any) => {
// // //         const aTime = new Date(a?.start).getTime();
// // //         const bTime = new Date(b?.start).getTime();
// // //         return aTime - bTime;
// // //       })
// // //       .slice(0, 3);
// // //   }, [events]);

// // //   return (
// // //     <section className="rounded-[28px] border border-[#D0D5DD] bg-[#F2F4F7] shadow-[0_2px_8px_rgba(16,24,40,0.04)]">
// // //       <div className="p-5 sm:p-6">
// // //         <div className="mb-4 flex items-center justify-between gap-3">
// // //           <div className="min-w-0">
// // //             <div className="flex items-center gap-2">
// // //               <h4 className="truncate text-[17px] font-semibold text-slate-900">
// // //                 Upcoming Events
// // //               </h4>
// // //               <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-[11px] font-medium text-[#667085]">
// // //                 {latestEvents.length}
// // //               </span>
// // //             </div>
// // //             <div className="mt-0.5 text-sm text-slate-500">
// // //               Your next scheduled meetings.
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="space-y-3">
// // //           {latestEvents.length === 0 ? (
// // //             <div className="rounded-[20px] border border-dashed border-[#D0D5DD] bg-[#F8FAFC] p-4">
// // //               <div className="text-sm font-semibold text-slate-900">
// // //                 No upcoming events
// // //               </div>
// // //               <div className="mt-1 text-sm text-slate-600">
// // //                 Share your booking link to start getting meetings.
// // //               </div>
// // //             </div>
// // //           ) : (
// // //             latestEvents.map((event: any, idx: number) => {
// // //               const title = event?.title || event?.summary || "Untitled meeting";
// // //               const location = event?.location || event?.meeting_platform || "";
// // //               const { date, time } = formatDateTime(event?.start);

// // //               return (
// // //                 <div
// // //                   key={event?.id || `${title}-${idx}`}
// // //                   className="rounded-[20px] border border-[#D0D5DD] bg-[#F8FAFC] p-4"
// // //                 >
// // //                   <div className="truncate text-sm font-semibold text-slate-900">
// // //                     {title}
// // //                   </div>

// // //                   <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
// // //                     <CalendarDays className="h-3.5 w-3.5 shrink-0" />
// // //                     <span>{date}</span>
// // //                   </div>

// // //                   <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
// // //                     <Clock className="h-3.5 w-3.5 shrink-0" />
// // //                     <span>{time}</span>
// // //                   </div>

// // //                   {location ? (
// // //                     <div className="mt-1 truncate text-xs text-slate-500">
// // //                       {location}
// // //                     </div>
// // //                   ) : null}
// // //                 </div>
// // //               );
// // //             })
// // //           )}
// // //         </div>

// // //         <div className="mt-4">
// // //           <button
// // //             type="button"
// // //             onClick={() => router.push("/dashboard/event-types?tab=meetings")}
// // //             className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-[#D0D5DD] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white"
// // //           >
// // //             View all
// // //             <ArrowRight className="h-4 w-4 shrink-0" />
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // }




// // "use client";

// // import React, { useMemo } from "react";
// // import { useRouter } from "next/navigation";
// // import { CalendarDays, ArrowRight } from "lucide-react";

// // type EventItem = {
// //   id?: string | number;
// //   title?: string;
// //   name?: string;
// //   attendee_name?: string;
// //   guest_name?: string;
// //   event_type_title?: string;
// //   start_time?: string;
// //   starts_at?: string;
// //   start?: string;
// // };

// // type Props = {
// //   events?: EventItem[];
// //   selectedDate?: string;
// // };

// // function getEventStart(item: EventItem): string | undefined {
// //   return item.start_time || item.starts_at || item.start;
// // }

// // function getPersonName(item: EventItem): string {
// //   return (
// //     item.name ||
// //     item.attendee_name ||
// //     item.guest_name ||
// //     item.title ||
// //     "Guest"
// //   );
// // }

// // function getMeetingTitle(item: EventItem): string {
// //   return item.event_type_title || item.title || "Meeting";
// // }

// // function getInitials(name: string): string {
// //   const parts = name.trim().split(/\s+/).filter(Boolean);
// //   if (parts.length === 0) return "NA";
// //   if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
// //   return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
// // }

// // function formatPrimaryTime(date: Date): string {
// //   const now = new Date();

// //   const isToday =
// //     now.getFullYear() === date.getFullYear() &&
// //     now.getMonth() === date.getMonth() &&
// //     now.getDate() === date.getDate();

// //   const tomorrow = new Date(now);
// //   tomorrow.setDate(now.getDate() + 1);

// //   const isTomorrow =
// //     tomorrow.getFullYear() === date.getFullYear() &&
// //     tomorrow.getMonth() === date.getMonth() &&
// //     tomorrow.getDate() === date.getDate();

// //   if (isTomorrow) return "Tomorrow";

// //   if (isToday) {
// //     return date.toLocaleTimeString([], {
// //       hour: "numeric",
// //       minute: "2-digit",
// //     });
// //   }

// //   return date.toLocaleDateString([], {
// //     day: "numeric",
// //     month: "short",
// //   });
// // }

// // function formatRelative(date: Date): string {
// //   const diffMs = date.getTime() - Date.now();
// //   const diffMin = Math.max(0, Math.round(diffMs / 60000));

// //   if (diffMin < 60) return `In ${diffMin}m`;

// //   const diffHr = Math.round(diffMin / 60);
// //   if (diffHr < 24) return `In ${diffHr}h`;

// //   const diffDay = Math.round(diffHr / 24);
// //   return `In ${diffDay}d`;
// // }

// // export default function UpcomingEvents({ events = [] }: Props) {
// //   const router = useRouter();

// //   const upcomingEvents = useMemo(() => {
// //     const now = Date.now();

// //     return [...events]
// //       .map((item) => {
// //         const raw = getEventStart(item);
// //         const date = raw ? new Date(raw) : null;
// //         return { item, date };
// //       })
// //       .filter(
// //         (x) =>
// //           x.date &&
// //           !Number.isNaN(x.date.getTime()) &&
// //           x.date.getTime() >= now
// //       )
// //       .sort((a, b) => a.date!.getTime() - b.date!.getTime())
// //       .slice(0, 4);
// //   }, [events]);

// //   // Replace just the outer wrapper + inner scroll area in UpcomingEvents

// //   return (
// //     <div className="flex h-full flex-col rounded-[20px] border border-[#E6EAF2] bg-white p-4 shadow-[0_4px_20px_rgba(16,24,40,0.05)]">

// //       {/* Header — fixed */}
// //       <div className="mb-4 flex shrink-0 items-start justify-between gap-3">
// //         <h3 className="text-[15px] font-semibold text-[#111827]">Upcoming</h3>
// //         <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[#98A2B3]">
// //           <CalendarDays className="h-4 w-4" />
// //         </div>
// //       </div>

// //       {/* Events list — scrolls internally */}
// //       <div className="min-h-0 flex-1 overflow-y-auto">
// //         <div className="space-y-2.5">
// //           {upcomingEvents.length > 0 ? (
// //             upcomingEvents.map(({ item, date }, index) => {
// //               const personName = getPersonName(item);
// //               const meetingTitle = getMeetingTitle(item);
// //               return (
// //                 <div
// //                   key={item.id ?? `${personName}-${index}`}
// //                   className="rounded-[14px] border border-[#EAECF0] bg-white px-3 py-2.5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]"
// //                 >
// //                   <div className="flex items-center gap-3">
// //                     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] text-[12px] font-semibold text-[#344054]">
// //                       {getInitials(personName)}
// //                     </div>
// //                     <div className="min-w-0 flex-1">
// //                       <div className="truncate text-[13px] font-semibold leading-[18px] text-[#111827]">
// //                         {personName}
// //                       </div>
// //                       <div className="truncate text-[11px] font-medium leading-[16px] text-[#98A2B3]">
// //                         {meetingTitle}
// //                       </div>
// //                     </div>
// //                     <div className="shrink-0 text-right">
// //                       <div className="text-[14px] font-semibold text-[#111827]">
// //                         {formatPrimaryTime(date!)}
// //                       </div>
// //                       <div className="mt-0.5 text-[12px] font-semibold text-[#5B4DFF]">
// //                         {formatRelative(date!)}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })
// //           ) : (
// //             <div className="rounded-[18px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD] px-6 py-6">
// //               <div className="text-[15px] font-semibold text-[#182230]">No upcoming events</div>
// //               <div className="mt-2 text-[13px] leading-6 text-[#667085]">
// //                 Share your booking link to start getting meetings.
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Footer button — fixed */}
// //       <div className="mt-4 shrink-0">
// //         <button
// //           type="button"
// //           onClick={() => router.push("/dashboard/event-types?tab=meetings")}
// //           className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
// //         >
// //           View all
// //           <ArrowRight className="h-4 w-4 shrink-0" />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import React, { useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { CalendarDays, ArrowRight } from "lucide-react";

// type EventItem = {
//   id?: string | number;
//   title?: string;
//   name?: string;
//   attendee_name?: string;
//   guest_name?: string;
//   event_type_title?: string;
//   start_time?: string;
//   starts_at?: string;
//   start?: string;
// };

// type Props = {
//   events?: EventItem[];
//   selectedDate?: string;
// };

// function getEventStart(item: EventItem): string | undefined {
//   return item.start_time || item.starts_at || item.start;
// }

// function getPersonName(item: EventItem): string {
//   return item.name || item.attendee_name || item.guest_name || item.title || "Guest";
// }

// function getMeetingTitle(item: EventItem): string {
//   return item.event_type_title || item.title || "Meeting";
// }

// function getInitials(name: string): string {
//   const parts = name.trim().split(/\s+/).filter(Boolean);
//   if (parts.length === 0) return "NA";
//   if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
//   return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
// }

// function formatPrimaryTime(date: Date): string {
//   const now = new Date();
//   const isToday =
//     now.getFullYear() === date.getFullYear() &&
//     now.getMonth() === date.getMonth() &&
//     now.getDate() === date.getDate();
//   const tomorrow = new Date(now);
//   tomorrow.setDate(now.getDate() + 1);
//   const isTomorrow =
//     tomorrow.getFullYear() === date.getFullYear() &&
//     tomorrow.getMonth() === date.getMonth() &&
//     tomorrow.getDate() === date.getDate();
//   if (isTomorrow) return "Tomorrow";
//   if (isToday) return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
//   return date.toLocaleDateString([], { day: "numeric", month: "short" });
// }

// function formatRelative(date: Date): string {
//   const diffMs = date.getTime() - Date.now();
//   const diffMin = Math.max(0, Math.round(diffMs / 60000));
//   if (diffMin < 60) return `In ${diffMin}m`;
//   const diffHr = Math.round(diffMin / 60);
//   if (diffHr < 24) return `In ${diffHr}h`;
//   return `In ${Math.round(diffHr / 24)}d`;
// }

// export default function UpcomingEvents({ events = [] }: Props) {
//   const router = useRouter();

//   const upcomingEvents = useMemo(() => {
//     const now = Date.now();
//     return [...events]
//       .map((item) => {
//         const raw = getEventStart(item);
//         const date = raw ? new Date(raw) : null;
//         return { item, date };
//       })
//       .filter(
//         (x) => x.date && !Number.isNaN(x.date.getTime()) && x.date.getTime() >= now
//       )
//       .sort((a, b) => a.date!.getTime() - b.date!.getTime())
//       .slice(0, 6);
//   }, [events]);

//   return (
//     <div className="flex h-full w-full flex-col rounded-[20px] border border-[#E6EAF2] bg-white p-4 shadow-[0_4px_20px_rgba(16,24,40,0.05)]">

//       {/* Header — shrink-0 so it never compresses */}
//       <div className="mb-3 flex shrink-0 items-center justify-between">
//         <h3 className="text-[15px] font-semibold text-[#111827]">Upcoming</h3>
//         <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[#98A2B3]">
//           <CalendarDays className="h-4 w-4" />
//         </div>
//       </div>

//       {/* Events — flex-1 fills all remaining space, scrolls if overflow */}
//       <div className="min-h-0 flex-1 overflow-y-auto">
//         <div className="space-y-2">
//           {upcomingEvents.length > 0 ? (
//             upcomingEvents.map(({ item, date }, index) => {
//               const personName = getPersonName(item);
//               const meetingTitle = getMeetingTitle(item);
//               return (
//                 <div
//                   key={item.id ?? `${personName}-${index}`}
//                   className="rounded-[14px] border border-[#EAECF0] bg-white px-3 py-2.5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] text-[11px] font-semibold text-[#344054]">
//                       {getInitials(personName)}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <div className="truncate text-[13px] font-semibold leading-[18px] text-[#111827]">
//                         {personName}
//                       </div>
//                       <div className="truncate text-[11px] font-medium leading-[16px] text-[#98A2B3]">
//                         {meetingTitle}
//                       </div>
//                     </div>
//                     <div className="shrink-0 text-right">
//                       <div className="text-[13px] font-semibold text-[#111827]">
//                         {formatPrimaryTime(date!)}
//                       </div>
//                       <div className="mt-0.5 text-[11px] font-semibold text-[#5B4DFF]">
//                         {formatRelative(date!)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="rounded-[18px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD] px-5 py-8 text-center">
//               <div className="text-[14px] font-semibold text-[#182230]">
//                 No upcoming events
//               </div>
//               <div className="mt-1.5 text-[12px] leading-5 text-[#667085]">
//                 Share your booking link to start getting meetings.
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer — shrink-0 so it always stays at bottom */}
//       <div className="mt-3 shrink-0">
//         <button
//           type="button"
//           onClick={() => router.push("/dashboard/event-types?tab=meetings")}
//           className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E6EAF2] bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50"
//         >
//           View all
//           <ArrowRight className="h-3.5 w-3.5 shrink-0" />
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ArrowRight } from "lucide-react";

type EventItem = {
  id?: string | number;
  title?: string;
  name?: string;
  guest_name?: string;
  attendee_name?: string;
  attendees?: any[];
  event_type_title?: string;
  start_time?: string;
  starts_at?: string;
  start?: string;
};

type Props = {
  events?: EventItem[];
  selectedDate?: string;
};

function getEventStart(item: EventItem): string | undefined {
  return item.start_time || item.starts_at || item.start;
}

function getPersonName(item: EventItem): string {
  if (item.guest_name) return item.guest_name;
  if (Array.isArray(item.attendees) && item.attendees.length > 0) {
    const first = item.attendees[0];
    if (typeof first === "string") return first.split("@")[0];
  }
  return item.name || item.attendee_name || item.title || "Guest";
}

function getMeetingTitle(item: EventItem): string {
  return item.event_type_title || item.title || "Meeting";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatPrimaryTime(date: Date): string {
  const now = new Date();
  const isToday =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    tomorrow.getFullYear() === date.getFullYear() &&
    tomorrow.getMonth() === date.getMonth() &&
    tomorrow.getDate() === date.getDate();
  if (isTomorrow) return "Tomorrow";
  if (isToday) return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}

function formatRelative(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const diffMin = Math.max(0, Math.round(diffMs / 60000));
  if (diffMin < 60) return `In ${diffMin}m`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `In ${diffHr}h`;
  return `In ${Math.round(diffHr / 24)}d`;
}

export default function UpcomingEvents({ events = [] }: Props) {
  const router = useRouter();

  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return [...events]
      .map((item) => {
        const raw = getEventStart(item);
        const date = raw ? new Date(raw) : null;
        return { item, date };
      })
      .filter(
        (x) => x.date && !Number.isNaN(x.date.getTime()) && x.date.getTime() >= now
      )
      .sort((a, b) => a.date!.getTime() - b.date!.getTime())
      .slice(0, 6);
  }, [events]);

  return (
    <div
      className="
      flex w-full flex-col rounded-[20px] border border-[#E6EAF2]
      bg-white p-4 shadow-[0_4px_20px_rgba(16,24,40,0.05)]
      min-h-[260px]
      sm:min-h-[280px]
      md:min-h-[320px]
      lg:h-full lg:min-h-0
    "
    >
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[#111827]">Upcoming</h3>

        <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[#535558]">
          <CalendarDays className="h-4 w-4" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-2">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(({ item, date }, index) => {
              const personName = getPersonName(item);
              const meetingTitle = getMeetingTitle(item);

              return (
                <div
                  key={item.id ?? `${personName}-${index}`}
                  className="rounded-[14px] border border-[#EAECF0] bg-white px-3 py-2.5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] text-[11px] font-semibold text-[#344054]">
                      {getInitials(personName)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold leading-[18px] text-[#111827]">
                        {personName}
                      </div>

                      <div className="mt-0.5 line-clamp-1 text-[11px] font-medium leading-[16px] text-[#98A2B3]">
                        {meetingTitle}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="whitespace-nowrap text-[13px] font-semibold text-[#111827]">
                        {formatPrimaryTime(date!)}
                      </div>

                      <div className="mt-0.5 whitespace-nowrap text-[11px] font-semibold text-[#5B4DFF]">
                        {formatRelative(date!)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className="
              flex min-h-[120px] flex-col items-center justify-center
              rounded-[18px] border border-dashed border-[#D0D5DD]
              bg-[#FCFCFD] px-4 py-6 text-center
              sm:min-h-[130px]
              lg:min-h-[150px]
            "
            >
              <div className="text-[14px] font-semibold text-[#182230]">
                No upcoming events
              </div>

              <div className="mt-1.5 max-w-[220px] text-[12px] leading-5 text-[#667085]">
                Share your booking link to start getting meetings.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 shrink-0">
        <button
          type="button"
          onClick={() => router.push("/dashboard/event-types?tab=meetings")}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-[#E6EAF2] bg-white px-4 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
}