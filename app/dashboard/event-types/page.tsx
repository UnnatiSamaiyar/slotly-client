// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { EventType, listEventTypes, deleteEventType, updateEventType, createEventType } from "@/lib/eventApi";
// import { useToast } from "@/hooks/use-toast";
// import { MapPin, Video, CalendarDays, Users, ExternalLink, Clock, Search } from "lucide-react";
// import { useCalendarEvents } from "@/app/dashboard/hooks/useCalendarEvents";
// import { safeDate } from "@/app/dashboard/components/Calendar/CalendarHelpers";
// import Sidebar from "@/app/dashboard/components/Sidebar/Sidebar";
// import Topbar from "@/app/dashboard/components/Topbar/Topbar";
// import AvailabilityEditorModal from "@/app/dashboard/components/Schedule/AvailabilityEditorModal";
// import CreateEventTypeModal from "@/app/dashboard/components/EventTypes/CreateEventTypeModal";
// // import CreateEventTypeModal from "@/app/dashboard/components/EventTypes/CreateEventTypeModal";

// function safeGetUserSubFromStorage(): string | null {
//   const keysToTry = ["user_sub", "slotly_user", "user", "auth_user", "slotlyUser"];
//   for (const key of keysToTry) {
//     try {
//       const saved = localStorage.getItem(key);
//       if (!saved) continue;
//       if (key === "user_sub") return saved;

//       if (saved === "null" || saved === "undefined") continue;

//       const parsed = JSON.parse(saved);
//       if (!parsed || typeof parsed !== "object") continue;

//       const sub = (parsed as any).sub || (parsed as any).user_sub || (parsed as any).id;
//       if (typeof sub === "string" && sub.trim()) return sub.trim();
//       const nested = (parsed as any).user?.sub || (parsed as any).profile?.sub;
//       if (typeof nested === "string" && nested.trim()) return nested.trim();
//     } catch {
//       // ignore and try next
//     }
//   }
//   return null;
// }

// function fmtDateTime(iso?: string) {
//   const d = safeDate(iso);
//   if (!d) return "—";
//   return d.toLocaleString(undefined, {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// function fmtTime(iso?: string) {
//   const d = safeDate(iso);
//   if (!d) return "—";
//   return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
// }

// function meetingBadge(mode?: string) {
//   const m = (mode || "").toLowerCase();
//   if (m === "google_meet") return { label: "Google Meet", Icon: Video };
//   if (m === "in_person") return { label: "In-person", Icon: MapPin };
//   return { label: "Meeting", Icon: CalendarDays };
// }

// function parseAvailabilitySummary(raw?: any): { weeklyEnabledDays: number; overrides: number; blocks: number; ranges: number } {
//   try {
//     const obj = typeof raw === "string" ? JSON.parse(raw || "{}") : raw || {};
//     const week = obj?.week || {};
//     const overrides = obj?.overrides || {};
//     const blocks = obj?.blocks || obj?.timeBlocks || {};
//     const ranges = obj?.ranges || obj?.dateRanges || [];

//     const weeklyEnabledDays = Object.keys(week || {}).reduce((acc, k) => {
//       const arr = week?.[k];
//       if (Array.isArray(arr) && arr.length > 0) return acc + 1;
//       return acc;
//     }, 0);

//     const overrideCount = overrides && typeof overrides === "object" ? Object.keys(overrides).length : 0;
//     const blockCount = blocks && typeof blocks === "object" ? Object.keys(blocks).length : 0;
//     const rangeCount = Array.isArray(ranges) ? ranges.length : 0;

//     return { weeklyEnabledDays, overrides: overrideCount, blocks: blockCount, ranges: rangeCount };
//   } catch {
//     return { weeklyEnabledDays: 0, overrides: 0, blocks: 0, ranges: 0 };
//   }
// }

// export default function DashboardEventTypes() {
//   const { toast } = useToast();

//   const confirmToast = (title: string, description?: string) =>
//     new Promise<boolean>((resolve) => {
//       let resolved = false;
//       toast({
//         title,
//         description,
//         variant: "info",
//         durationMs: 0,
//         action: {
//           label: "Delete",
//           onClick: () => {
//             resolved = true;
//             resolve(true);
//           },
//         },
//         onDismiss: () => {
//           if (!resolved) resolve(false);
//         },
//       });
//     });

//   const [tab, setTab] = useState<"event_types" | "meetings">("event_types");

//   // Dashboard shell
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [items, setItems] = useState<EventType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);
//   const [deletingId, setDeletingId] = useState<number | null>(null);

//   // Create modal (must match dashboard create popout)
//   const [createOpen, setCreateOpen] = useState(false);

//   // Meetings
//   const [userSub, setUserSub] = useState<string | null>(null);
//   const [role, setRole] = useState<"all" | "hosted" | "invited">("all");
//   const [meetingQ, setMeetingQ] = useState("");
//   const [selected, setSelected] = useState<any | null>(null);

//   // Event Type editor (inline modal)
//   const [editOpen, setEditOpen] = useState(false);
//   const [editItem, setEditItem] = useState<any | null>(null);

//   useEffect(() => {
//     setUserSub(safeGetUserSubFromStorage());
//   }, []);

//   // Open sidebar by default only on large screens (consistent with other dashboard pages)
//   useEffect(() => {
//     const setByWidth = () => {
//       if (typeof window === "undefined") return;
//       setSidebarOpen(window.innerWidth >= 1024);
//     };
//     setByWidth();
//     window.addEventListener("resize", setByWidth);
//     return () => window.removeEventListener("resize", setByWidth);
//   }, []);

//   const { events: meetings, loading: meetingsLoading, error: meetingsError, refresh } = useCalendarEvents(userSub, "all");

//   async function reloadEventTypes() {
//     setErr(null);
//     setLoading(true);
//     try {
//       const data = await listEventTypes();
//       setItems(data);
//     } catch (e: any) {
//       setErr(e?.message || String(e));
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     reloadEventTypes();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const eventTypeBySlug = useMemo(() => {
//     const map: Record<string, EventType> = {};
//     for (const it of items) map[String(it.slug || "")] = it;
//     return map;
//   }, [items]);

//   const handleDelete = async (id: number) => {
//     const ok = await confirmToast("Delete this event type?", "This cannot be undone.");
//     if (!ok) {
//       toast({ title: "Cancelled", description: "Event type was not deleted.", variant: "default" });
//       return;
//     }

//     setDeletingId(id);
//     try {
//       await deleteEventType(id);
//       setItems((s) => s.filter((x) => x.id !== id));
//       toast({ title: "Deleted", description: "Event type removed.", variant: "success" });
//     } catch (e: any) {
//       toast({
//         title: "Delete failed",
//         description: e?.message || String(e) || "Unable to delete. Please try again.",
//         variant: "error",
//       });
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const meetingFiltered = useMemo(() => {
//     const q = meetingQ.trim().toLowerCase();
//     const base = Array.isArray(meetings) ? meetings : [];

//     const byRole = base.filter((m: any) => {
//       if (role === "all") return true;
//       if (role === "hosted") return m?.role === "host" || m?.role === "both";
//       return m?.role === "invitee" || m?.role === "both";
//     });

//     const bySearch = !q
//       ? byRole
//       : byRole.filter((m: any) => {
//           const s = (m?.summary || "").toLowerCase();
//           const loc = (m?.location || "").toLowerCase();
//           const guest = (m?.attendees || []).join(" ").toLowerCase();
//           const pslug = (m?.profile_slug || "").toLowerCase();
//           return s.includes(q) || loc.includes(q) || guest.includes(q) || pslug.includes(q);
//         });

//     return bySearch.sort((a: any, b: any) => {
//       const ta = a?.start ? new Date(a.start).getTime() : 0;
//       const tb = b?.start ? new Date(b.start).getTime() : 0;
//       return tb - ta;
//     });
//   }, [meetings, role, meetingQ]);

//   const meetingStats = useMemo(() => {
//     const base = Array.isArray(meetings) ? meetings : [];
//     const hosted = base.filter((m: any) => m?.role === "host" || m?.role === "both").length;
//     const invited = base.filter((m: any) => m?.role === "invitee" || m?.role === "both").length;
//     return { total: base.length, hosted, invited };
//   }, [meetings]);

//   const eventTypeStats = useMemo(() => {
//     // group by profile_slug (which matches EventType slug when created via Event Types)
//     const base = Array.isArray(meetings) ? meetings : [];
//     const map: Record<string, { total: number; hosted: number; invited: number }> = {};
//     for (const m of base) {
//       const slug = String(m?.profile_slug || "").trim();
//       if (!slug) continue;
//       if (!map[slug]) map[slug] = { total: 0, hosted: 0, invited: 0 };
//       map[slug].total += 1;
//       if (m?.role === "host" || m?.role === "both") map[slug].hosted += 1;
//       if (m?.role === "invitee" || m?.role === "both") map[slug].invited += 1;
//     }
//     return map;
//   }, [meetings]);



//   const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://api.slotly.io").replace(/\/+$/, "");

//   async function fetchScheduleBySlug(profileSlug: string) {
//     const sub = safeGetUserSubFromStorage();
//     if (!sub) throw new Error("Missing user_sub in browser storage");
//     const res = await fetch(
//       `${API_BASE}/schedule/profile/${encodeURIComponent(profileSlug)}?user_sub=${encodeURIComponent(sub)}`
//     );
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();
//   }

//   async function updateScheduleBySlug(profileSlug: string, patch: any) {
//     const sub = safeGetUserSubFromStorage();
//     if (!sub) throw new Error("Missing user_sub in browser storage");
//     const res = await fetch(
//       `${API_BASE}/schedule/profile/${encodeURIComponent(profileSlug)}?user_sub=${encodeURIComponent(sub)}`,
//       {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(patch),
//       }
//     );
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();
//   }

//   const mapUrlForLocation = (location?: string | null) => {
//     const q = (location || "").trim();
//     if (!q) return "";
//     return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
//   };

//   return (
//     <div className="h-screen flex bg-white overflow-hidden">
//       <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((s: boolean) => !s)} user={null} />

//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <div className="shrink-0">
//           <Topbar
//           userSub={userSub}
//           onMenuClick={() => setSidebarOpen(true)}
//           searchQuery={""}
//           onSearchChange={() => {}}
//           roleFilter={"all"}
//           onRoleChange={() => {}}
//           showRoleFilter={false}
//           showSearch={false}
//           />
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//       <div className="flex items-start justify-between gap-4 mb-6">
//         <div className="min-w-0">
//           <h1 className="text-2xl font-semibold text-gray-900">Event Types</h1>
//           <p className="text-gray-500 mt-1">
//             Manage event types, and track hosted/invited meetings with full details.
//           </p>

//           <div className="mt-4 inline-flex rounded-xl border bg-white p-1 shadow-sm">
//             <button
//               className={[
//                 "px-4 py-2 rounded-lg text-sm font-semibold transition",
//                 tab === "event_types" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50",
//               ].join(" ")}
//               onClick={() => setTab("event_types")}
//               type="button"
//             >
//               Event Types
//             </button>
//             <button
//               className={[
//                 "px-4 py-2 rounded-lg text-sm font-semibold transition",
//                 tab === "meetings" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50",
//               ].join(" ")}
//               onClick={() => setTab("meetings")}
//               type="button"
//             >
//               Meetings
//               <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/20">
//                 {meetingStats.total}
//               </span>
//             </button>
//           </div>
//         </div>

//         <div className="shrink-0 flex items-center gap-3">
    

//       {/* Inline Event Type editor (avoids slug-routing edge cases) */}
//       {editOpen && editItem ? (
//         <EventTypeEditModal
//           open={editOpen}
//           item={editItem}
//           onClose={() => {
//             setEditOpen(false);
//             setEditItem(null);
//           }}
//           onSaved={(updated) => {
//             setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
//           }}
//         />
//       ) : null}

//       {tab === "meetings" && (
//             <button
//               type="button"
//               onClick={() => refresh()}
//               className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-700 shadow-sm"
//             >
//               Refresh
//             </button>
//           )}

//           <button
//             type="button"
//             onClick={() => setCreateOpen(true)}
//             className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
//           >
//             Create Event Type
//           </button>
//         </div>
//       </div>

//       {tab === "event_types" && (
//         <>
//           {loading && <div className="p-6 bg-white rounded-xl border">Loading…</div>}
//           {err && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">{err}</div>}

//           {!loading && items.length === 0 && (
//             <div className="p-6 bg-white rounded-xl border">No event types yet. Create one to get started.</div>
//           )}

//           <div className="space-y-4 mt-6">
//             {items.map((it) => {
//               const isMeet = it.meeting_mode === "google_meet";
//               const BadgeIcon = isMeet ? Video : MapPin;

//               const av = parseAvailabilitySummary((it as any).availability_json);
//               const stats = eventTypeStats[String(it.slug || "")] || { total: 0, hosted: 0, invited: 0 };

//               return (
//                 <div
//                   key={it.id}
//                   className="bg-white border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5"
//                 >
//                   <div className="min-w-0">
//                     <div className="flex items-center gap-3">
//                       <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
//                         <BadgeIcon className="w-5 h-5" />
//                       </div>

//                       <div className="min-w-0">
//                         <div className="font-semibold text-gray-900 truncate">{it.title}</div>
//                         <div className="text-xs text-gray-500 mt-0.5">
//                           {isMeet ? "Google Meet" : "In-person meeting"}
//                           {!isMeet && it.location ? <span className="ml-2 text-gray-400">• {it.location}</span> : null}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                       <div className="rounded-xl border bg-gray-50 p-3">
//                         <div className="text-xs text-gray-500">Public link</div>
//                         <div className="mt-1 font-mono text-sm text-blue-700 break-all">/publicbook/{it.slug}</div>
//                       </div>

//                       <div className="rounded-xl border bg-gray-50 p-3">
//                         <div className="text-xs text-gray-500">Duration</div>
//                         <div className="mt-1 text-sm font-semibold text-gray-900">
//                           {Number((it as any).duration_minutes || 15)} minutes
//                         </div>
//                       </div>

//                       <div className="rounded-xl border bg-gray-50 p-3">
//                         <div className="text-xs text-gray-500">Availability</div>
//                         <div className="mt-1 text-sm text-gray-800">
//                           <span className="font-semibold">{av.weeklyEnabledDays}</span> weekly days
//                           <span className="text-gray-400"> • </span>
//                           <span className="font-semibold">{av.overrides}</span> overrides
//                           <span className="text-gray-400"> • </span>
//                           <span className="font-semibold">{av.blocks}</span> block-days
//                           <span className="text-gray-400"> • </span>
//                           <span className="font-semibold">{av.ranges}</span> ranges
//                         </div>
//                       </div>

//                       <div className="rounded-xl border bg-gray-50 p-3 sm:col-span-2 lg:col-span-3">
//                         <div className="text-xs text-gray-500">Meetings linked to this event type</div>
//                         <div className="mt-1 text-sm text-gray-800">
//                           Total: <span className="font-semibold">{stats.total}</span>
//                           <span className="text-gray-400"> • </span>
//                           Hosted: <span className="font-semibold">{stats.hosted}</span>
//                           <span className="text-gray-400"> • </span>
//                           Invited: <span className="font-semibold">{stats.invited}</span>
//                         </div>
//                         <div className="mt-2 text-xs text-gray-500">
//                           Note: meetings are linked using the booking profile slug (same as event type slug).
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 shrink-0">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         if (!it?.slug) {
//                           toast({ title: "Invalid event", description: "Event slug is missing.", variant: "error" });
//                           return;
//                         }
//                         setEditItem(it as any);
//                         setEditOpen(true);
//                       }}
//                       className="px-4 py-2 border rounded-xl text-gray-700 hover:bg-gray-50 transition shadow-sm"
//                     >
//                       Edit details
//                     </button>

//                     <button
//                       onClick={() => handleDelete(it.id)}
//                       disabled={deletingId === it.id}
//                       className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 shadow-sm"
//                     >
//                       {deletingId === it.id ? "Deleting…" : "Delete"}
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}

//       {tab === "meetings" && (
//         <>
//           <div className="bg-white border rounded-2xl p-5">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//               <div className="flex flex-wrap items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setRole("all")}
//                   className={[
//                     "px-3 py-2 rounded-xl text-sm font-semibold border transition",
//                     role === "all" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white hover:bg-gray-50 text-gray-700",
//                   ].join(" ")}
//                 >
//                   All <span className="ml-1 text-xs opacity-90">({meetingStats.total})</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setRole("hosted")}
//                   className={[
//                     "px-3 py-2 rounded-xl text-sm font-semibold border transition",
//                     role === "hosted" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white hover:bg-gray-50 text-gray-700",
//                   ].join(" ")}
//                 >
//                   Hosted <span className="ml-1 text-xs opacity-90">({meetingStats.hosted})</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setRole("invited")}
//                   className={[
//                     "px-3 py-2 rounded-xl text-sm font-semibold border transition",
//                     role === "invited" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white hover:bg-gray-50 text-gray-700",
//                   ].join(" ")}
//                 >
//                   Invited <span className="ml-1 text-xs opacity-90">({meetingStats.invited})</span>
//                 </button>
//               </div>

//               <div className="relative w-full lg:w-[420px]">
//                 <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   value={meetingQ}
//                   onChange={(e) => setMeetingQ(e.target.value)}
//                   placeholder="Search by title, attendee, location, or event type slug…"
//                   className="w-full pl-10 pr-3 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mt-4">
//             {meetingsLoading && <div className="p-6 bg-white rounded-xl border">Loading meetings…</div>}
//             {meetingsError && (
//               <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
//                 {meetingsError}
//               </div>
//             )}

//             {!meetingsLoading && !meetingsError && meetingFiltered.length === 0 && (
//               <div className="p-6 bg-white rounded-xl border">No meetings found for the selected filter.</div>
//             )}

//             {!meetingsLoading && !meetingsError && meetingFiltered.length > 0 && (
//               <div className="bg-white border rounded-2xl overflow-hidden">
//                 <div className="grid grid-cols-12 gap-0 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600">
//                   <div className="col-span-3">When</div>
//                   <div className="col-span-3">Event Type</div>
//                   <div className="col-span-4">People</div>
//                   <div className="col-span-2 text-right">Actions</div>
//                 </div>

//                 <div className="divide-y">
//                   {meetingFiltered.map((m: any) => {
//                     const etSlug = String(m?.profile_slug || "").trim();
//                     const et = etSlug ? eventTypeBySlug[etSlug] : null;
//                     const { label, Icon } = meetingBadge(et?.meeting_mode || m?.meeting_mode);

//                     const people = Array.isArray(m?.attendees) ? m.attendees : [];
//                     const primaryPerson = people[0] || "—";
//                     const moreCount = Math.max(0, people.length - 1);

//                     return (
//                       <div key={m.id} className="grid grid-cols-12 px-4 py-4 gap-3 items-center">
//                         <div className="col-span-12 sm:col-span-3">
//                           <div className="text-sm font-semibold text-gray-900">{fmtDateTime(m.start)}</div>
//                           <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
//                             <Clock className="w-3.5 h-3.5" />
//                             {fmtTime(m.start)} – {fmtTime(m.end)}
//                           </div>
//                         </div>

//                         <div className="col-span-12 sm:col-span-3">
//                           <div className="flex items-center gap-2">
//                             <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
//                               <Icon className="w-4 h-4" />
//                             </div>
//                             <div className="min-w-0">
//                               <div className="text-sm font-semibold text-gray-900 truncate">
//                                 {et?.title || m?.summary || "Meeting"}
//                               </div>
//                               <div className="text-xs text-gray-500 mt-0.5 truncate">
//                                 {label}
//                                 {etSlug ? <span className="text-gray-400"> • {etSlug}</span> : null}
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="col-span-12 sm:col-span-4">
//                           <div className="text-sm text-gray-900 flex items-center gap-2">
//                             <Users className="w-4 h-4 text-gray-400" />
//                             <span className="truncate">{primaryPerson}</span>
//                             {moreCount > 0 ? (
//                               <span className="text-xs text-gray-500 shrink-0">+{moreCount} more</span>
//                             ) : null}
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             Role: <span className="font-semibold text-gray-700">{m?.role || "—"}</span>
//                             {m?.location ? <span className="text-gray-400"> • {m.location}</span> : null}
//                           </div>
//                         </div>

//                         <div className="col-span-12 sm:col-span-2 flex sm:justify-end gap-2">
//                           <button
//                             type="button"
//                             onClick={() => setSelected(m)}
//                             className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700"
//                           >
//                             View
//                           </button>

//                           {/* In-person: show Open Map (do not remove Join for online meetings) */}
//                           {String(et?.meeting_mode || m?.meeting_mode || "").toLowerCase() === "in_person" &&
//                           (m?.location || et?.location) ? (
//                             <a
//                               href={mapUrlForLocation(m?.location || et?.location)}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 inline-flex items-center gap-2"
//                             >
//                               Open map <ExternalLink className="w-4 h-4" />
//                             </a>
//                           ) : null}

//                           {m?.meetLink ? (
//                             <a
//                               href={m.meetLink}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center gap-2"
//                             >
//                               Join <ExternalLink className="w-4 h-4" />
//                             </a>
//                           ) : null}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Details Modal */}
//           {selected ? (
//             <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//               <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
//               <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border">
//                 <div className="p-5 border-b flex items-start justify-between gap-4">
//                   <div className="min-w-0">
//                     <div className="text-lg font-semibold text-gray-900 truncate">{selected?.summary || "Meeting"}</div>
//                     <div className="text-sm text-gray-500 mt-1">{fmtDateTime(selected?.start)}</div>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => setSelected(null)}
//                     className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700"
//                   >
//                     Close
//                   </button>
//                 </div>

//                 <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="rounded-xl border bg-gray-50 p-4">
//                     <div className="text-xs text-gray-500">Time</div>
//                     <div className="mt-1 text-sm font-semibold text-gray-900">
//                       {fmtTime(selected?.start)} – {fmtTime(selected?.end)}
//                     </div>
//                     <div className="mt-3 text-xs text-gray-500">Role</div>
//                     <div className="mt-1 text-sm font-semibold text-gray-900">{selected?.role || "—"}</div>
//                     <div className="mt-3 text-xs text-gray-500">Booking ID</div>
//                     <div className="mt-1 font-mono text-sm text-gray-900 break-all">{selected?.id || "—"}</div>
//                   </div>

//                   <div className="rounded-xl border bg-gray-50 p-4">
//                     <div className="text-xs text-gray-500">Event Type (profile slug)</div>
//                     <div className="mt-1 text-sm font-semibold text-gray-900 break-all">
//                       {selected?.profile_slug || "—"}
//                     </div>

//                     <div className="mt-3 text-xs text-gray-500">Location</div>
//                     <div className="mt-1 text-sm font-semibold text-gray-900 break-all">
//                       {selected?.location || "—"}
//                     </div>

//                     <div className="mt-3 text-xs text-gray-500">Meeting link</div>
//                     <div className="mt-1 text-sm">
//                       {selected?.meetLink ? (
//                         <a className="text-indigo-700 font-semibold break-all" href={selected.meetLink} target="_blank" rel="noreferrer">
//                           {selected.meetLink}
//                         </a>
//                       ) : (
//                         <span className="text-gray-700">—</span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="md:col-span-2 rounded-xl border bg-white p-4">
//                     <div className="text-sm font-semibold text-gray-900">Attendees</div>
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {(Array.isArray(selected?.attendees) ? selected.attendees : []).map((a: string) => (
//                         <span key={a} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
//                           {a}
//                         </span>
//                       ))}
//                       {(!selected?.attendees || selected.attendees.length === 0) ? (
//                         <div className="text-sm text-gray-500">No attendees stored.</div>
//                       ) : null}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : null}
//         </>
//       )}

//       {/* Use the same create popout as Dashboard (production-consistent UX) */}
//       <CreateEventTypeModal
//         open={createOpen}
//         onClose={() => setCreateOpen(false)}
//         onCreate={async (payload) => {
//           await createEventType(payload as any);
//           toast({ title: "Created", description: "Event type created successfully.", variant: "success" });
//           await reloadEventTypes();
//         }}
//       />
//         </div>
//       </div>
//     </div>
//   );
// }


// function EventTypeEditModal({
//   open,
//   item,
//   onClose,
//   onSaved,
// }: {
//   open: boolean;
//   item: any;
//   onClose: () => void;
//   onSaved: (updated: any) => void;
// }) {
//   const { toast } = useToast();

//   const [title, setTitle] = useState(String(item?.title || ""));
//   const [meetingMode, setMeetingMode] = useState<String>(String(item?.meeting_mode || "google_meet"));
//   const [location, setLocation] = useState(String(item?.location || ""));
//   const [durationMinutes, setDurationMinutes] = useState<number>(Number(item?.duration_minutes || 15));
//   const [availabilityJson, setAvailabilityJson] = useState<string>(String(item?.availability_json || "{}"));
//   const [availabilityOpen, setAvailabilityOpen] = useState(false);

//   const [saving, setSaving] = useState(false);

//   const needsLocation = String(meetingMode).toLowerCase() === "in_person";

//   const publicLink = `/publicbook/${String(item?.slug || "").trim()}`;

//   // Close on Escape
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   const handleSave = async () => {
//     const cleanTitle = title.trim();
//     const cleanLoc = location.trim();

//     if (!cleanTitle) {
//       toast({ title: "Title required", description: "Please enter a title.", variant: "error" });
//       return;
//     }
//     if (needsLocation && !cleanLoc) {
//       toast({ title: "Location required", description: "Please enter a location for in-person meeting.", variant: "error" });
//       return;
//     }

//     setSaving(true);
//     try {
//       // Update EventType (server supports duration_minutes + availability_json)
//       const updated = await (async () => {
//         const payload: any = {
//           title: cleanTitle,
//           meeting_mode: String(meetingMode),
//           location: needsLocation ? cleanLoc : "",
//           availability_json: availabilityJson || "{}",
//           duration_minutes: Math.max(5, Math.min(24 * 60, Number(durationMinutes || 15))),
//         };
//         return updateEventType(Number(item.id), payload);
//       })();

//       // Also keep BookingProfile duration in sync (used by slot generator)
//       if (updated?.slug) {
//         try {
//           const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://api.slotly.io").replace(/\/+$/, "");
//           const sub = (function safeGetUserSubFromStorage2(): string | null {
//             const keysToTry = ["user_sub", "slotly_user", "user", "auth_user", "slotlyUser"]; 
//             for (const key of keysToTry) {
//               try {
//                 const saved = localStorage.getItem(key);
//                 if (!saved) continue;
//                 if (key === "user_sub") return saved;
//                 if (saved === "null" || saved === "undefined") continue;
//                 const parsed = JSON.parse(saved);
//                 if (!parsed || typeof parsed !== "object") continue;
//                 const sub = (parsed as any).sub || (parsed as any).user_sub || (parsed as any).id;
//                 if (typeof sub === "string" && sub.trim()) return sub.trim();
//                 const nested = (parsed as any).user?.sub || (parsed as any).profile?.sub;
//                 if (typeof nested === "string" && nested.trim()) return nested.trim();
//               } catch {}
//             }
//             return null;
//           })();

//           if (sub) {
//             await fetch(`${API_BASE}/schedule/profile/${encodeURIComponent(updated.slug)}?user_sub=${encodeURIComponent(sub)}`,
//               {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ duration_minutes: Math.max(5, Math.min(24 * 60, Number(durationMinutes || 15))) }),
//               }
//             );
//           }
//         } catch {
//           // non-blocking; EventType duration is still saved
//         }
//       }

//       onSaved(updated);
//       toast({ title: "Saved", description: "Event type updated successfully.", variant: "success" });
//       onClose();
//     } catch (e: any) {
//       toast({ title: "Save failed", description: e?.message || String(e) || "Unable to save changes.", variant: "error" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />

//       <div className="relative w-[92vw] max-w-2xl bg-white rounded-2xl shadow-xl border p-6">
//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <div className="text-lg font-semibold text-gray-900">Edit Event Type</div>
//             <div className="text-sm text-gray-500 mt-1">Update title, duration, availability, and meeting settings.</div>
//           </div>
//           <button onClick={onClose} className="px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-700">✕</button>
//         </div>

//         <div className="mt-5 grid grid-cols-1 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
//               placeholder="e.g., 15-min Intro Call"
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
//               <input
//                 type="number"
//                 min={5}
//                 max={24 * 60}
//                 step={5}
//                 value={durationMinutes}
//                 onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 15)}
//                 className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
//               />
//               <div className="text-xs text-gray-500 mt-1">Default is 15 minutes. Use 5-minute steps.</div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
//               <button
//                 type="button"
//                 onClick={() => setAvailabilityOpen(true)}
//                 className="w-full p-3 border rounded-xl bg-gray-50 hover:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-left"
//               >
//                 Set availability
//                 <span className="text-xs text-gray-500 block mt-0.5">Weekly hours, overrides, date ranges & time blocks</span>
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Meeting type</label>
//             <select
//               value={String(meetingMode)}
//               onChange={(e) => setMeetingMode(e.target.value)}
//               className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition"
//             >
//               <option value="google_meet">Google Meet</option>
//               <option value="in_person">In-person meeting</option>
//             </select>
//           </div>

//           {needsLocation ? (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//               <input
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
//                 placeholder="Office address / landmark"
//               />
//             </div>
//           ) : null}

//           <div className="rounded-xl border bg-gray-50 p-3 text-sm">
//             <div className="text-xs text-gray-500">Public link</div>
//             <div className="mt-1 font-mono text-indigo-700 break-all">{publicLink}</div>
//           </div>
//         </div>

//         <div className="mt-6 flex items-center justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-gray-700 font-semibold"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm disabled:opacity-50"
//           >
//             {saving ? "Saving…" : "Save changes"}
//           </button>
//         </div>

//         <AvailabilityEditorModal
//           open={availabilityOpen}
//           initialAvailabilityJson={availabilityJson && availabilityJson !== "{}" ? availabilityJson : null}
//           onClose={() => setAvailabilityOpen(false)}
//           onSave={(json) => {
//             setAvailabilityJson(json || "{}");
//             setAvailabilityOpen(false);
//           }}
//         />
//       </div>
//     </div>
//   );
// }












"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  EventType,
  listEventTypes,
  deleteEventType,
  updateEventType,
  createEventType,
} from "@/lib/eventApi";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Video,
  CalendarDays,
  Users,
  ExternalLink,
  Clock,
  Search,
  MoreVertical,
  Copy,
  Pencil,
  Trash2,
  RefreshCcw,
  Link2,
} from "lucide-react";
import { useCalendarEvents } from "@/app/dashboard/hooks/useCalendarEvents";
import { safeDate } from "@/app/dashboard/components/Calendar/CalendarHelpers";
import Sidebar from "@/app/dashboard/components/Sidebar/Sidebar";
import Topbar from "@/app/dashboard/components/Topbar/Topbar";
import AvailabilityEditorModal from "@/app/dashboard/components/Schedule/AvailabilityEditorModal";
import CreateEventTypeModal from "@/app/dashboard/components/EventTypes/CreateEventTypeModal";

function safeGetUserSubFromStorage(): string | null {
  const keysToTry = ["user_sub", "slotly_user", "user", "auth_user", "slotlyUser"];
  for (const key of keysToTry) {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) continue;
      if (key === "user_sub") return saved;

      if (saved === "null" || saved === "undefined") continue;

      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object") continue;

      const sub = (parsed as any).sub || (parsed as any).user_sub || (parsed as any).id;
      if (typeof sub === "string" && sub.trim()) return sub.trim();
      const nested = (parsed as any).user?.sub || (parsed as any).profile?.sub;
      if (typeof nested === "string" && nested.trim()) return nested.trim();
    } catch {
      // ignore and try next
    }
  }
  return null;
}

function fmtDateTime(iso?: string) {
  const d = safeDate(iso);
  if (!d) return "—";
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtTime(iso?: string) {
  const d = safeDate(iso);
  if (!d) return "—";
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function meetingBadge(mode?: string) {
  const m = (mode || "").toLowerCase();
  if (m === "google_meet") return { label: "Google Meet", Icon: Video };
  if (m === "in_person") return { label: "In-person", Icon: MapPin };
  return { label: "Meeting", Icon: CalendarDays };
}

function parseAvailabilitySummary(raw?: any): {
  weeklyEnabledDays: number;
  overrides: number;
  blocks: number;
  ranges: number;
} {
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw || "{}") : raw || {};
    const week = obj?.week || {};
    const overrides = obj?.overrides || {};
    const ranges = obj?.ranges || obj?.dateRanges || [];

    // NOTE: blocks are stored under overrides[date].blocks in your newer format,
    // but old code had blocks map too. We'll count both.
    let blockCount = 0;
    if (overrides && typeof overrides === "object") {
      for (const k of Object.keys(overrides)) {
        const v = (overrides as any)[k];
        if (v && typeof v === "object" && !Array.isArray(v) && Array.isArray((v as any).blocks)) {
          blockCount += (v as any).blocks.length;
        }
      }
    }

    const weeklyEnabledDays = Object.keys(week || {}).reduce((acc, k) => {
      const arr = week?.[k];
      if (Array.isArray(arr) && arr.length > 0) return acc + 1;
      return acc;
    }, 0);

    const overrideCount =
      overrides && typeof overrides === "object" ? Object.keys(overrides).length : 0;
    const rangeCount = Array.isArray(ranges) ? ranges.length : 0;

    return { weeklyEnabledDays, overrides: overrideCount, blocks: blockCount, ranges: rangeCount };
  } catch {
    return { weeklyEnabledDays: 0, overrides: 0, blocks: 0, ranges: 0 };
  }
}

function classNames(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ");
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

export default function DashboardEventTypes() {
  const { toast } = useToast();

  const confirmToast = (title: string, description?: string) =>
    new Promise<boolean>((resolve) => {
      let resolved = false;
      toast({
        title,
        description,
        variant: "info",
        durationMs: 0,
        action: {
          label: "Delete",
          onClick: () => {
            resolved = true;
            resolve(true);
          },
        },
        onDismiss: () => {
          if (!resolved) resolve(false);
        },
      });
    });

  const [tab, setTab] = useState<"event_types" | "meetings">("event_types");

  // Dashboard shell
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [items, setItems] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);

  // Meetings
  const [userSub, setUserSub] = useState<string | null>(null);
  const [role, setRole] = useState<"all" | "hosted" | "invited">("all");
  const [meetingQ, setMeetingQ] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  // Event Types UI
  const [eventQ, setEventQ] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  // Event Type editor (inline modal)
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);

  useEffect(() => {
    setUserSub(safeGetUserSubFromStorage());
  }, []);

  // Open sidebar by default only on large screens
  useEffect(() => {
    const setByWidth = () => {
      if (typeof window === "undefined") return;
      setSidebarOpen(window.innerWidth >= 1024);
    };
    setByWidth();
    window.addEventListener("resize", setByWidth);
    return () => window.removeEventListener("resize", setByWidth);
  }, []);

  const {
    events: meetings,
    loading: meetingsLoading,
    error: meetingsError,
    refresh,
  } = useCalendarEvents(userSub, "all");

  async function reloadEventTypes() {
    setErr(null);
    setLoading(true);
    try {
      const data = await listEventTypes();
      setItems(data);
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reloadEventTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      // Close menus on outside click (simple)
      if (!t.closest?.("[data-et-menu]")) setMenuOpenId(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const eventTypeBySlug = useMemo(() => {
    const map: Record<string, EventType> = {};
    for (const it of items) map[String(it.slug || "")] = it;
    return map;
  }, [items]);

  const handleDelete = async (id: number) => {
    const ok = await confirmToast("Delete this event type?", "This cannot be undone.");
    if (!ok) {
      toast({ title: "Cancelled", description: "Event type was not deleted.", variant: "default" });
      return;
    }

    setDeletingId(id);
    try {
      await deleteEventType(id);
      setItems((s) => s.filter((x) => x.id !== id));
      toast({ title: "Deleted", description: "Event type removed.", variant: "success" });
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: e?.message || String(e) || "Unable to delete. Please try again.",
        variant: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const meetingFiltered = useMemo(() => {
    const q = meetingQ.trim().toLowerCase();
    const base = Array.isArray(meetings) ? meetings : [];

    const byRole = base.filter((m: any) => {
      if (role === "all") return true;
      if (role === "hosted") return m?.role === "host" || m?.role === "both";
      return m?.role === "invitee" || m?.role === "both";
    });

    const bySearch = !q
      ? byRole
      : byRole.filter((m: any) => {
          const s = (m?.summary || "").toLowerCase();
          const loc = (m?.location || "").toLowerCase();
          const guest = (m?.attendees || []).join(" ").toLowerCase();
          const pslug = (m?.profile_slug || "").toLowerCase();
          return s.includes(q) || loc.includes(q) || guest.includes(q) || pslug.includes(q);
        });

    return bySearch.sort((a: any, b: any) => {
      const ta = a?.start ? new Date(a.start).getTime() : 0;
      const tb = b?.start ? new Date(b.start).getTime() : 0;
      return tb - ta;
    });
  }, [meetings, role, meetingQ]);

  const meetingStats = useMemo(() => {
    const base = Array.isArray(meetings) ? meetings : [];
    const hosted = base.filter((m: any) => m?.role === "host" || m?.role === "both").length;
    const invited = base.filter((m: any) => m?.role === "invitee" || m?.role === "both").length;
    return { total: base.length, hosted, invited };
  }, [meetings]);

  const eventTypeStats = useMemo(() => {
    const base = Array.isArray(meetings) ? meetings : [];
    const map: Record<string, { total: number; hosted: number; invited: number }> = {};
    for (const m of base) {
      const slug = String(m?.profile_slug || "").trim();
      if (!slug) continue;
      if (!map[slug]) map[slug] = { total: 0, hosted: 0, invited: 0 };
      map[slug].total += 1;
      if (m?.role === "host" || m?.role === "both") map[slug].hosted += 1;
      if (m?.role === "invitee" || m?.role === "both") map[slug].invited += 1;
    }
    return map;
  }, [meetings]);

  const mapUrlForLocation = (location?: string | null) => {
    const q = (location || "").trim();
    if (!q) return "";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  };

  const filteredEventTypes = useMemo(() => {
    const q = eventQ.trim().toLowerCase();
    const base = Array.isArray(items) ? items : [];
    if (!q) return base;
    return base.filter((it: any) => {
      const t = String(it?.title || "").toLowerCase();
      const s = String(it?.slug || "").toLowerCase();
      const loc = String(it?.location || "").toLowerCase();
      const mode = String(it?.meeting_mode || "").toLowerCase();
      return t.includes(q) || s.includes(q) || loc.includes(q) || mode.includes(q);
    });
  }, [items, eventQ]);

  const pageTitle = tab === "event_types" ? "Event Types" : "Meetings";
  const pageSub =
    tab === "event_types"
      ? "Create and manage your booking links. Keep it simple for your team."
      : "See hosted & invited meetings with full details.";

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((s: boolean) => !s)} user={null} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="shrink-0">
          <Topbar
            userSub={userSub}
            onMenuClick={() => setSidebarOpen(true)}
            searchQuery={""}
            onSearchChange={() => {}}
            roleFilter={"all"}
            onRoleChange={() => {}}
            showRoleFilter={false}
            showSearch={false}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
              <p className="text-sm text-gray-500 mt-1">{pageSub}</p>

              {/* Tabs */}
              <div className="mt-4 inline-flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
                <button
                  className={classNames(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition",
                    tab === "event_types"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={() => setTab("event_types")}
                  type="button"
                >
                  Event Types
                </button>
                <button
                  className={classNames(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition inline-flex items-center",
                    tab === "meetings"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={() => setTab("meetings")}
                  type="button"
                >
                  Meetings
                  <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-white/20">
                    {meetingStats.total}
                  </span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center gap-2">
              {tab === "event_types" ? (
                <div className="relative w-full sm:w-[340px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={eventQ}
                    onChange={(e) => setEventQ(e.target.value)}
                    placeholder="Search event types…"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => refresh()}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm transition"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Refresh
                </button>
              )}

              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
              >
                Create Event Type
              </button>
            </div>
          </div>

          {/* Inline editor modal */}
          {editOpen && editItem ? (
            <EventTypeEditModal
              open={editOpen}
              item={editItem}
              onClose={() => {
                setEditOpen(false);
                setEditItem(null);
              }}
              onSaved={(updated) => {
                setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
              }}
            />
          ) : null}

          {/* Body */}
          <div className="mt-6">
            {tab === "event_types" ? (
              <>
                {loading ? (
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="text-sm text-gray-600">Loading…</div>
                  </div>
                ) : err ? (
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
                    {err}
                  </div>
                ) : filteredEventTypes.length === 0 ? (
                  <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                        <CalendarDays className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-base font-semibold text-gray-900">
                          No event types yet
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Create your first booking link. Keep the title clear and the duration simple.
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
                          >
                            Create Event Type
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredEventTypes.map((it) => {
                      const mode = String(it.meeting_mode || "").toLowerCase();
                      const isMeet = mode === "google_meet";
                      const Icon = isMeet ? Video : mode === "in_person" ? MapPin : CalendarDays;

                      const av = parseAvailabilitySummary((it as any).availability_json);
                      const stats = eventTypeStats[String(it.slug || "")] || {
                        total: 0,
                        hosted: 0,
                        invited: 0,
                      };

                      const publicPath = `/publicbook/${String(it.slug || "").trim()}`;

                      return (
                        <div
                          key={it.id}
                          className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
                        >
                          {/* Card header */}
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                  <Icon className="w-5 h-5" />
                                </div>

                                <div className="min-w-0">
                                  <div className="text-base font-semibold text-gray-900 truncate">
                                    {it.title}
                                  </div>
                                  <div className="mt-1 text-xs text-gray-500 truncate">
                                    {isMeet ? "Google Meet" : "In-person meeting"}
                                    {!isMeet && (it as any).location ? (
                                      <span className="text-gray-400"> • {(it as any).location}</span>
                                    ) : null}
                                  </div>

                                  {/* quick meta */}
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-700">
                                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                                      {Number((it as any).duration_minutes || 15)}m
                                    </span>
                                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-700">
                                      <Users className="w-3.5 h-3.5 text-gray-400" />
                                      {stats.total} meetings
                                    </span>
                                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-700">
                                      <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                                      {av.weeklyEnabledDays} weekly days
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const ok = await copyToClipboard(publicPath);
                                    toast({
                                      title: ok ? "Copied" : "Copy failed",
                                      description: ok
                                        ? "Public link copied to clipboard."
                                        : "Could not copy. Please try again.",
                                      variant: ok ? "success" : "error",
                                    });
                                  }}
                                  className="h-10 w-10 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition"
                                  title="Copy public link"
                                >
                                  <Copy className="w-4 h-4 text-gray-700" />
                                </button>

                                <a
                                  href={publicPath}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="h-10 w-10 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition"
                                  title="Open public page"
                                >
                                  <ExternalLink className="w-4 h-4 text-gray-700" />
                                </a>

                                <div className="relative" data-et-menu>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setMenuOpenId((cur) => (cur === it.id ? null : it.id))
                                    }
                                    className="h-10 w-10 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition"
                                    title="More"
                                  >
                                    <MoreVertical className="w-4 h-4 text-gray-700" />
                                  </button>

                                  {menuOpenId === it.id ? (
                                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden z-20">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setMenuOpenId(null);
                                          if (!it?.slug) {
                                            toast({
                                              title: "Invalid event",
                                              description: "Event slug is missing.",
                                              variant: "error",
                                            });
                                            return;
                                          }
                                          setEditItem(it as any);
                                          setEditOpen(true);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                                      >
                                        <Pencil className="w-4 h-4 text-gray-500" />
                                        Edit details
                                      </button>

                                      <button
                                        type="button"
                                        onClick={async () => {
                                          setMenuOpenId(null);
                                          const ok = await copyToClipboard(publicPath);
                                          toast({
                                            title: ok ? "Copied" : "Copy failed",
                                            description: ok
                                              ? "Public link copied to clipboard."
                                              : "Could not copy. Please try again.",
                                            variant: ok ? "success" : "error",
                                          });
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                                      >
                                        <Link2 className="w-4 h-4 text-gray-500" />
                                        Copy public link
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setMenuOpenId(null);
                                          handleDelete(it.id);
                                        }}
                                        disabled={deletingId === it.id}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        {deletingId === it.id ? "Deleting…" : "Delete"}
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            {/* Details grid (clean + compact) */}
                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <div className="text-xs text-gray-500">Public link</div>
                                <div className="mt-1 font-mono text-sm text-indigo-700 break-all">
                                  {publicPath}
                                </div>
                              </div>

                              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <div className="text-xs text-gray-500">Availability snapshot</div>
                                <div className="mt-1 text-sm text-gray-800">
                                  <span className="font-semibold">{av.weeklyEnabledDays}</span> weekly
                                  <span className="text-gray-400"> • </span>
                                  <span className="font-semibold">{av.overrides}</span> overrides
                                  <span className="text-gray-400"> • </span>
                                  <span className="font-semibold">{av.blocks}</span> blocks
                                  <span className="text-gray-400"> • </span>
                                  <span className="font-semibold">{av.ranges}</span> ranges
                                </div>
                              </div>

                              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:col-span-2">
                                <div className="text-xs text-gray-500">
                                  Meetings linked to this event type (by slug)
                                </div>
                                <div className="mt-1 text-sm text-gray-800">
                                  Total: <span className="font-semibold">{stats.total}</span>
                                  <span className="text-gray-400"> • </span>
                                  Hosted: <span className="font-semibold">{stats.hosted}</span>
                                  <span className="text-gray-400"> • </span>
                                  Invited: <span className="font-semibold">{stats.invited}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card footer */}
                          <div className="px-5 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
                            <div className="text-xs text-gray-500">
                              Tip: keep durations consistent across your team.
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (!it?.slug) {
                                  toast({
                                    title: "Invalid event",
                                    description: "Event slug is missing.",
                                    variant: "error",
                                  });
                                  return;
                                }
                                setEditItem(it as any);
                                setEditOpen(true);
                              }}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm transition"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Meetings toolbar */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRole("all")}
                        className={classNames(
                          "px-3 py-2 rounded-2xl text-sm font-semibold border transition",
                          role === "all"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                        )}
                      >
                        All <span className="ml-1 text-xs opacity-90">({meetingStats.total})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("hosted")}
                        className={classNames(
                          "px-3 py-2 rounded-2xl text-sm font-semibold border transition",
                          role === "hosted"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                        )}
                      >
                        Hosted{" "}
                        <span className="ml-1 text-xs opacity-90">({meetingStats.hosted})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("invited")}
                        className={classNames(
                          "px-3 py-2 rounded-2xl text-sm font-semibold border transition",
                          role === "invited"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                        )}
                      >
                        Invited{" "}
                        <span className="ml-1 text-xs opacity-90">({meetingStats.invited})</span>
                      </button>
                    </div>

                    <div className="relative w-full lg:w-[420px]">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={meetingQ}
                        onChange={(e) => setMeetingQ(e.target.value)}
                        placeholder="Search by title, attendee, location, or event type slug…"
                        className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  {meetingsLoading && (
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      Loading meetings…
                    </div>
                  )}
                  {meetingsError && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                      {meetingsError}
                    </div>
                  )}

                  {!meetingsLoading && !meetingsError && meetingFiltered.length === 0 && (
                    <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="text-base font-semibold text-gray-900">No meetings found</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Try changing the role filter or search keywords.
                      </div>
                    </div>
                  )}

                  {!meetingsLoading && !meetingsError && meetingFiltered.length > 0 && (
                    <>
                      {/* Desktop table */}
                      <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="grid grid-cols-12 gap-0 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600">
                          <div className="col-span-3">When</div>
                          <div className="col-span-3">Event Type</div>
                          <div className="col-span-4">People</div>
                          <div className="col-span-2 text-right">Actions</div>
                        </div>

                        <div className="divide-y">
                          {meetingFiltered.map((m: any) => {
                            const etSlug = String(m?.profile_slug || "").trim();
                            const et = etSlug ? eventTypeBySlug[etSlug] : null;
                            const { label, Icon } = meetingBadge(et?.meeting_mode || m?.meeting_mode);

                            const people = Array.isArray(m?.attendees) ? m.attendees : [];
                            const primaryPerson = people[0] || "—";
                            const moreCount = Math.max(0, people.length - 1);

                            return (
                              <div key={m.id} className="grid grid-cols-12 px-4 py-4 gap-3 items-center">
                                <div className="col-span-3">
                                  <div className="text-sm font-semibold text-gray-900">{fmtDateTime(m.start)}</div>
                                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    {fmtTime(m.start)} – {fmtTime(m.end)}
                                  </div>
                                </div>

                                <div className="col-span-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-sm font-semibold text-gray-900 truncate">
                                        {et?.title || m?.summary || "Meeting"}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-0.5 truncate">
                                        {label}
                                        {etSlug ? <span className="text-gray-400"> • {etSlug}</span> : null}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-span-4">
                                  <div className="text-sm text-gray-900 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="truncate">{primaryPerson}</span>
                                    {moreCount > 0 ? (
                                      <span className="text-xs text-gray-500 shrink-0">+{moreCount} more</span>
                                    ) : null}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 truncate">
                                    Role:{" "}
                                    <span className="font-semibold text-gray-700">{m?.role || "—"}</span>
                                    {m?.location ? <span className="text-gray-400"> • {m.location}</span> : null}
                                  </div>
                                </div>

                                <div className="col-span-2 flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelected(m)}
                                    className="px-3 py-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 shadow-sm"
                                  >
                                    View
                                  </button>

                                  {String(et?.meeting_mode || m?.meeting_mode || "").toLowerCase() === "in_person" &&
                                  (m?.location || et?.location) ? (
                                    <a
                                      href={mapUrlForLocation(m?.location || et?.location)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-3 py-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 inline-flex items-center gap-2 shadow-sm"
                                    >
                                      Map <ExternalLink className="w-4 h-4" />
                                    </a>
                                  ) : null}

                                  {m?.meetLink ? (
                                    <a
                                      href={m.meetLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-3 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-sm"
                                    >
                                      Join <ExternalLink className="w-4 h-4" />
                                    </a>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Mobile cards */}
                      <div className="md:hidden space-y-3">
                        {meetingFiltered.map((m: any) => {
                          const etSlug = String(m?.profile_slug || "").trim();
                          const et = etSlug ? eventTypeBySlug[etSlug] : null;
                          const { label, Icon } = meetingBadge(et?.meeting_mode || m?.meeting_mode);

                          const people = Array.isArray(m?.attendees) ? m.attendees : [];
                          const primaryPerson = people[0] || "—";
                          const moreCount = Math.max(0, people.length - 1);

                          return (
                            <div
                              key={m.id}
                              className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-gray-900">{fmtDateTime(m.start)}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {fmtTime(m.start)} – {fmtTime(m.end)}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setSelected(m)}
                                  className="px-3 py-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 shadow-sm"
                                >
                                  View
                                </button>
                              </div>

                              <div className="mt-3 flex items-center gap-2">
                                <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-gray-900 truncate">
                                    {et?.title || m?.summary || "Meeting"}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                                    {label}
                                    {etSlug ? <span className="text-gray-400"> • {etSlug}</span> : null}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 text-sm text-gray-900 flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="truncate">{primaryPerson}</span>
                                {moreCount > 0 ? (
                                  <span className="text-xs text-gray-500 shrink-0">+{moreCount} more</span>
                                ) : null}
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2">
                                {String(et?.meeting_mode || m?.meeting_mode || "").toLowerCase() === "in_person" &&
                                (m?.location || et?.location) ? (
                                  <a
                                    href={mapUrlForLocation(m?.location || et?.location)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 inline-flex items-center gap-2 shadow-sm"
                                  >
                                    Map <ExternalLink className="w-4 h-4" />
                                  </a>
                                ) : null}

                                {m?.meetLink ? (
                                  <a
                                    href={m.meetLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-sm"
                                  >
                                    Join <ExternalLink className="w-4 h-4" />
                                  </a>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Details Modal */}
                {selected ? (
                  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
                    <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                      <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-lg font-semibold text-gray-900 truncate">
                            {selected?.summary || "Meeting"}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{fmtDateTime(selected?.start)}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelected(null)}
                          className="px-3 py-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 shadow-sm"
                        >
                          Close
                        </button>
                      </div>

                      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <div className="text-xs text-gray-500">Time</div>
                          <div className="mt-1 text-sm font-semibold text-gray-900">
                            {fmtTime(selected?.start)} – {fmtTime(selected?.end)}
                          </div>

                          <div className="mt-4 text-xs text-gray-500">Role</div>
                          <div className="mt-1 text-sm font-semibold text-gray-900">{selected?.role || "—"}</div>

                          <div className="mt-4 text-xs text-gray-500">Booking ID</div>
                          <div className="mt-1 font-mono text-sm text-gray-900 break-all">{selected?.id || "—"}</div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <div className="text-xs text-gray-500">Event Type (profile slug)</div>
                          <div className="mt-1 text-sm font-semibold text-gray-900 break-all">
                            {selected?.profile_slug || "—"}
                          </div>

                          <div className="mt-4 text-xs text-gray-500">Location</div>
                          <div className="mt-1 text-sm font-semibold text-gray-900 break-all">
                            {selected?.location || "—"}
                          </div>

                          <div className="mt-4 text-xs text-gray-500">Meeting link</div>
                          <div className="mt-1 text-sm">
                            {selected?.meetLink ? (
                              <a
                                className="text-indigo-700 font-semibold break-all"
                                href={selected.meetLink}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {selected.meetLink}
                              </a>
                            ) : (
                              <span className="text-gray-700">—</span>
                            )}
                          </div>
                        </div>

                        <div className="md:col-span-2 rounded-2xl border border-gray-100 bg-white p-4">
                          <div className="text-sm font-semibold text-gray-900">Attendees</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(Array.isArray(selected?.attendees) ? selected.attendees : []).map((a: string) => (
                              <span key={a} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                {a}
                              </span>
                            ))}
                            {!selected?.attendees || selected.attendees.length === 0 ? (
                              <div className="text-sm text-gray-500">No attendees stored.</div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>

          {/* Create modal (same) */}
          <CreateEventTypeModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            userSub={userSub}
            onCreate={async (payload) => {
              await createEventType(payload as any);
              toast({ title: "Created", description: "Event type created successfully.", variant: "success" });
              await reloadEventTypes();
            }}
          />
        </div>
      </div>
    </div>
  );
}

function EventTypeEditModal({
  open,
  item,
  onClose,
  onSaved,
}: {
  open: boolean;
  item: any;
  onClose: () => void;
  onSaved: (updated: any) => void;
}) {
  const { toast } = useToast();

  const [title, setTitle] = useState(String(item?.title || ""));
  const [meetingMode, setMeetingMode] = useState<String>(String(item?.meeting_mode || "google_meet"));
  const [location, setLocation] = useState(String(item?.location || ""));
  const [durationMinutes, setDurationMinutes] = useState<number>(Number(item?.duration_minutes || 15));
  const [availabilityJson, setAvailabilityJson] = useState<string>(String(item?.availability_json || "{}"));
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  const needsLocation = String(meetingMode).toLowerCase() === "in_person";
  const publicLink = `/publicbook/${String(item?.slug || "").trim()}`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSave = async () => {
    const cleanTitle = title.trim();
    const cleanLoc = location.trim();

    if (!cleanTitle) {
      toast({ title: "Title required", description: "Please enter a title.", variant: "error" });
      return;
    }
    if (needsLocation && !cleanLoc) {
      toast({
        title: "Location required",
        description: "Please enter a location for in-person meeting.",
        variant: "error",
      });
      return;
    }

    setSaving(true);
    try {
      const updated = await (async () => {
        const payload: any = {
          title: cleanTitle,
          meeting_mode: String(meetingMode),
          location: needsLocation ? cleanLoc : "",
          availability_json: availabilityJson || "{}",
          duration_minutes: Math.max(5, Math.min(24 * 60, Number(durationMinutes || 15))),
        };
        return updateEventType(Number(item.id), payload);
      })();

      // keep BookingProfile duration in sync (non-blocking)
      if (updated?.slug) {
        try {
          const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://api.slotly.io").replace(/\/+$/, "");
          const sub = (function safeGetUserSubFromStorage2(): string | null {
            const keysToTry = ["user_sub", "slotly_user", "user", "auth_user", "slotlyUser"];
            for (const key of keysToTry) {
              try {
                const saved = localStorage.getItem(key);
                if (!saved) continue;
                if (key === "user_sub") return saved;
                if (saved === "null" || saved === "undefined") continue;
                const parsed = JSON.parse(saved);
                if (!parsed || typeof parsed !== "object") continue;
                const sub = (parsed as any).sub || (parsed as any).user_sub || (parsed as any).id;
                if (typeof sub === "string" && sub.trim()) return sub.trim();
                const nested = (parsed as any).user?.sub || (parsed as any).profile?.sub;
                if (typeof nested === "string" && nested.trim()) return nested.trim();
              } catch {}
            }
            return null;
          })();

          if (sub) {
            await fetch(
              `${API_BASE}/schedule/profile/${encodeURIComponent(updated.slug)}?user_sub=${encodeURIComponent(sub)}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  duration_minutes: Math.max(5, Math.min(24 * 60, Number(durationMinutes || 15))),
                }),
              }
            );
          }
        } catch {
          // non-blocking
        }
      }

      onSaved(updated);
      toast({ title: "Saved", description: "Event type updated successfully.", variant: "success" });
      onClose();
    } catch (e: any) {
      toast({
        title: "Save failed",
        description: e?.message || String(e) || "Unable to save changes.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-[92vw] max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-900">Edit Event Type</div>
            <div className="text-sm text-gray-500 mt-1">
              Update title, duration, availability, and meeting settings.
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none transition"
              placeholder="e.g., 15-min Intro Call"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                min={5}
                max={24 * 60}
                step={5}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 15)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none transition"
              />
              <div className="text-xs text-gray-500 mt-1">Use 5-minute steps.</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <button
                type="button"
                onClick={() => setAvailabilityOpen(true)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-200 outline-none transition text-left"
              >
                <div className="font-semibold text-gray-900">Set availability</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Weekly hours, overrides, date ranges & time blocks
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting type</label>
            <select
              value={String(meetingMode)}
              onChange={(e) => setMeetingMode(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-indigo-200 outline-none transition"
            >
              <option value="google_meet">Google Meet</option>
              <option value="in_person">In-person meeting</option>
            </select>
          </div>

          {needsLocation ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none transition"
                placeholder="Office address / landmark"
              />
            </div>
          ) : null}

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm">
            <div className="text-xs text-gray-500">Public link</div>
            <div className="mt-1 font-mono text-indigo-700 break-all">{publicLink}</div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>

        <AvailabilityEditorModal
          open={availabilityOpen}
          initialAvailabilityJson={availabilityJson && availabilityJson !== "{}" ? availabilityJson : null}
          onClose={() => setAvailabilityOpen(false)}
          onSave={(json) => {
            setAvailabilityJson(json || "{}");
            setAvailabilityOpen(false);
          }}
        />
      </div>
    </div>
  );
}
