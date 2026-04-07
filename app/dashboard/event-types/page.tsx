"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDashboardUser } from "../layout";
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
  Linkedin,
  MessageCircle,
  Share2,
} from "lucide-react";
import { useCalendarEvents } from "@/app/dashboard/hooks/useCalendarEvents";
import { safeDate } from "@/app/dashboard/components/Calendar/CalendarHelpers";
import AvailabilityEditorModal from "@/app/dashboard/components/Schedule/AvailabilityEditorModal";
import CreateEventTypeModal from "@/app/dashboard/components/EventTypes/CreateEventTypeModal";

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

    let blockCount = 0;
    if (overrides && typeof overrides === "object") {
      for (const k of Object.keys(overrides)) {
        const v = (overrides as any)[k];
        if (
          v &&
          typeof v === "object" &&
          !Array.isArray(v) &&
          Array.isArray((v as any).blocks)
        ) {
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

    return {
      weeklyEnabledDays,
      overrides: overrideCount,
      blocks: blockCount,
      ranges: rangeCount,
    };
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
function buildShareMessage(title: string, url: string, meetingMode?: string) {
  const cleanTitle = title?.trim() || "Meeting";

  return `${cleanTitle}

Let’s connect at a time that works best for you.

Book here:
${url}

— Powered by Slotly`;
}
function openSharePopup(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=700,height=650");
}

function shareToWhatsApp(url: string, title?: string, meetingMode?: string) {
  const text = buildShareMessage(title || "Meeting", url, meetingMode);
  openSharePopup(`https://wa.me/?text=${encodeURIComponent(text)}`);
}

function shareToLinkedIn(url: string) {
  openSharePopup(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  );
}

export default function DashboardEventTypes() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const getTabFromUrl = (): "event_types" | "meetings" => {
    const tabParam = (searchParams.get("tab") || "").toLowerCase();
    return tabParam === "meetings" ? "meetings" : "event_types";
  };

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

  const [tab, setTab] = useState<"event_types" | "meetings">(getTabFromUrl);
  const [items, setItems] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { user, userSub } = useDashboardUser();
  const [createOpen, setCreateOpen] = useState(false);

  const [role, setRole] = useState<"all" | "hosted" | "invited">("all");
  const [meetingQ, setMeetingQ] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const [eventQ, setEventQ] = useState("");
  const [shareModal, setShareModal] = useState<{
    open: boolean;
    url: string;
    title: string;
    meetingMode?: string;
  }>({
    open: false,
    url: "",
    title: "",
    meetingMode: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);

  const {
    events: meetings,
    loading: meetingsLoading,
    error: meetingsError,
    refresh,
  } = useCalendarEvents(userSub, "all");

  useEffect(() => {
    const nextTab = getTabFromUrl();
    setTab(nextTab);
  }, [searchParams]);

  const updateTabInUrl = (nextTab: "event_types" | "meetings") => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextTab === "meetings") {
      params.set("tab", "meetings");
    } else {
      params.delete("tab");
    }

    const qs = params.toString();
    router.replace(qs ? `/dashboard/event-types?${qs}` : "/dashboard/event-types");
    setTab(nextTab);
  };

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
  }, []);



  const eventTypeBySlug = useMemo(() => {
    const map: Record<string, EventType> = {};
    for (const it of items) map[String(it.slug || "")] = it;
    return map;
  }, [items]);

  const handleDelete = async (id: number) => {
    const confirmed = await confirmToast(
      "Delete event type?",
      "This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(id);
    try {
      await deleteEventType(id);
      setItems((s) => s.filter((x) => x.id !== id));
      toast({
        title: "Deleted",
        description: "Event type removed.",
        variant: "success",
      });
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
    const base = Array.isArray(items) ? [...items] : [];

    const filtered = !q
      ? base
      : base.filter((it: any) => {
        const t = String(it?.title || "").toLowerCase();
        const s = String(it?.slug || "").toLowerCase();
        const loc = String(it?.location || "").toLowerCase();
        const mode = String(it?.meeting_mode || "").toLowerCase();
        return t.includes(q) || s.includes(q) || loc.includes(q) || mode.includes(q);
      });

    return filtered.sort((a: any, b: any) => {
      const aCreated = a?.created_at ? new Date(a.created_at).getTime() : 0;
      const bCreated = b?.created_at ? new Date(b.created_at).getTime() : 0;

      if (bCreated !== aCreated) return bCreated - aCreated;

      const aId = Number(a?.id || 0);
      const bId = Number(b?.id || 0);
      return bId - aId;
    });
  }, [items, eventQ]);

  const pageTitle = tab === "event_types" ? "Event Types" : "Meetings";
  const pageSub =
    tab === "event_types"
      ? "Create and manage your booking links. Keep it simple for your team."
      : "See hosted & invited meetings with full details.";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">{pageSub}</p>

          <div className="mt-4 inline-flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              className={classNames(
                "px-4 py-2 rounded-xl text-sm font-semibold transition",
                tab === "event_types"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              )}
              onClick={() => updateTabInUrl("event_types")}
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
              onClick={() => updateTabInUrl("meetings")}
              type="button"
            >
              Meetings
              <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-white/20">
                {meetingStats.total}
              </span>
            </button>
          </div>
        </div>

        <div className="shrink-0 flex w-full lg:w-auto flex-col sm:flex-row sm:items-center gap-2">          {tab === "event_types" ? (
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
                    <div className="text-base font-semibold text-gray-900">No event types yet</div>
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
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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

                  const base =
                    process.env.NEXT_PUBLIC_APP_URL ||
                    (typeof window !== "undefined" ? window.location.origin : "");

                  const publicPath = `${base}/publicbook/${String(it.slug || "").trim()}`; return (
                    <div
                      key={it.id}
                      className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
                    >
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

                              <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-[11px] text-gray-700 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm whitespace-nowrap">
                                  <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                  <span>{Number((it as any).duration_minutes || 15)}m</span>
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-[11px] text-gray-700 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm whitespace-nowrap">
                                  <Users className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                  <span>{stats.total} meetings</span>
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-[11px] text-gray-700 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm whitespace-nowrap">
                                  <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                  <span>{av.weeklyEnabledDays} weekly days</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={publicPath}
                              target="_blank"
                              rel="noreferrer"
                              className="h-10 w-10 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition"
                              title="Open public page"
                            >
                              <ExternalLink className="w-4 h-4 text-gray-700" />
                            </a>

                            <button
                              type="button"
                              onClick={() => {
                                setShareModal({
                                  open: true,
                                  url: publicPath,
                                  title: it.title,
                                  meetingMode: String(it.meeting_mode || ""),
                                });
                              }}
                              className="h-10 w-10 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition"
                              title="Share"
                            >
                              <Share2 className="w-4 h-4 text-gray-700" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(it.id)}
                              disabled={deletingId === it.id}
                              className="h-10 w-10 rounded-2xl border border-red-200 bg-white hover:bg-red-50 flex items-center justify-center transition disabled:opacity-60"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>

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
                  <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-12 gap-0 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600">
                      <div className="col-span-3">When</div>
                      <div className="col-span-3">Event Type</div>
                      <div className="col-span-4">People</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {meetingFiltered.map((m: any) => {
                    const etSlug = String(m?.profile_slug || "").trim();
                    const et = etSlug ? eventTypeBySlug[etSlug] : null;
                    const { label, Icon } = meetingBadge(et?.meeting_mode || m?.meeting_mode);

                    const people = Array.isArray(m?.attendees) ? m.attendees : [];
                    const primaryPerson = people[0] || "—";
                    const moreCount = Math.max(0, people.length - 1);

                    return (
                      <div
                        key={m?.id}
                        className="grid grid-cols-12 gap-0 px-4 py-3 hover:bg-gray-50 transition"
                      >
                        <div className="col-span-3">{fmtDateTime(m?.start)}</div>
                        <div className="col-span-3">{et?.title || m?.summary || "Meeting"}</div>
                        <div className="col-span-4">{primaryPerson}</div>
                        <div className="col-span-2 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelected(m)}
                            className="h-9 px-3 rounded-lg text-xs font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                </>
              )}
            </div>

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
                      <div className="mt-1 text-sm font-semibold text-gray-900">
                        {selected?.role || "—"}
                      </div>

                      <div className="mt-4 text-xs text-gray-500">Booking ID</div>
                      <div className="mt-1 font-mono text-sm text-gray-900 break-all">
                        {selected?.id || "—"}
                      </div>
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
                        {(Array.isArray(selected?.attendees) ? selected.attendees : []).map(
                          (a: string) => (
                            <span
                              key={a}
                              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                            >
                              {a}
                            </span>
                          )
                        )}
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
  
      <CreateEventTypeModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        userSub={userSub}
        onCreate={async (payload) => {
          await createEventType(payload as any);
          toast({
            title: "Created",
            description: "Event type created successfully.",
            variant: "success",
          });
          await reloadEventTypes();
        }}
      />
      {shareModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share</h3>
              <button
                type="button"
                onClick={() => setShareModal((s) => ({ ...s, open: false }))}
                className="h-9 w-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
              >
                ✕
              </button>
            </div>

            {(() => {
              const text = buildShareMessage(
                shareModal.title,
                shareModal.url,
                shareModal.meetingMode
              );

              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(text)}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    className="p-3 border rounded-xl hover:bg-gray-50 text-sm font-medium"
                  >
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      const text = buildShareMessage(
                        shareModal.title,
                        shareModal.url,
                        shareModal.meetingMode
                      );

                      // Copy professional message
                      await copyToClipboard(text);

                      // Open LinkedIn share
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareModal.url)}`,
                        "_blank"
                      );

                      toast({
                        title: "Copied for LinkedIn",
                        description: "Paste the message on LinkedIn post.",
                        variant: "success",
                      });
                    }}
                    className="p-3 border rounded-xl hover:bg-gray-50 text-sm font-medium"
                  >
                    LinkedIn
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    className="p-3 border rounded-xl hover:bg-gray-50 text-sm font-medium"
                  >
                    Twitter
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `mailto:?subject=${encodeURIComponent("Book Meeting")}&body=${encodeURIComponent(text)}`,
                        "_blank"
                      )
                    }
                    className="p-3 border rounded-xl hover:bg-gray-50 text-sm font-medium"
                  >
                    Email
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await copyToClipboard(text);
                      toast({
                        title: ok ? "Copied" : "Copy failed",
                        description: ok
                          ? "Share message copied successfully."
                          : "Could not copy share message.",
                        variant: ok ? "success" : "error",
                      });
                    }}
                    className="p-3 border rounded-xl hover:bg-gray-50 text-sm font-medium"
                  >
                    Copy
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await copyToClipboard(shareModal.url);
                      toast({
                        title: ok ? "Link copied" : "Copy failed",
                        description: ok
                          ? "Public link copied successfully."
                          : "Could not copy public link.",
                        variant: ok ? "success" : "error",
                      });
                    }}
                    className="p-3 border rounded-xl hover:bg-gray-50 text-sm font-medium"
                  >
                    Copy Link
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

     




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
  const [meetingMode, setMeetingMode] = useState<String>(
    String(item?.meeting_mode || "google_meet")
  );
  const [location, setLocation] = useState(String(item?.location || ""));
  const [durationMinutes, setDurationMinutes] = useState<number>(
    Number(item?.duration_minutes || 15)
  );
  const [availabilityJson, setAvailabilityJson] = useState<string>(
    String(item?.availability_json || "{}")
  );
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  const needsLocation = String(meetingMode).toLowerCase() === "in_person";
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const publicLink = `${base}/publicbook/${String(item?.slug || "").trim()}`;
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
      toast({
        title: "Title required",
        description: "Please enter a title.",
        variant: "error",
      });
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

      if (updated?.slug) {
        try {
          const API_BASE = (
            process.env.NEXT_PUBLIC_API_URL || "  https://slotly.io"
          ).replace(/\/+$/, "");
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
              } catch { }
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
                  duration_minutes: Math.max(
                    5,
                    Math.min(24 * 60, Number(durationMinutes || 15))
                  ),
                }),
              }
            );
          }
        } catch { }
      }

      onSaved(updated);
      toast({
        title: "Saved",
        description: "Event type updated successfully.",
        variant: "success",
      });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative flex w-full max-w-2xl max-h-[92vh] flex-col overflow-hidden rounded-[20px] sm:rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="shrink-0 border-b border-gray-100 p-4 sm:p-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-900">Edit Event Type</div>
            <div className="text-sm text-gray-500 mt-1">
              Update title, duration, availability, and meeting settings.
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition shrink-0"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
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

        <div className="shrink-0 border-t border-gray-100 bg-white px-4 sm:px-6 py-4 sm:py-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
      
        </div>

        <AvailabilityEditorModal
          open={availabilityOpen}
          initialAvailabilityJson={
            availabilityJson && availabilityJson !== "{}" ? availabilityJson : null
          }
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

