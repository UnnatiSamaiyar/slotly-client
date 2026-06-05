// @ts-nocheck


"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resolveEventIcon } from "./utils/iconMap";
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
  MoreVertical,
  Copy,
  Pencil,
  Trash2,
  RefreshCcw,
  Link2,
  Linkedin,
  X,
  MessageCircle,
  Share2,
  MailIcon,
  SendHorizontal,
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
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
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
      overrides && typeof overrides === "object"
        ? Object.keys(overrides).length
        : 0;
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
  const mode = String(meetingMode || "").toLowerCase();
  const modeLabel =
    mode === "google_meet"
      ? "Google Meet"
      : mode === "in_person"
        ? "In-person"
        : "Meeting";

  return `Schedule time with me on Slotly

Event: ${title || "Meeting"}
Format: ${modeLabel}

Pick a convenient time using the booking link below:
${url}

Powered by Slotly`;
}

async function handleNativeShare(
  title: string,
  url: string,
  meetingMode?: string,
) {
  const text = buildShareMessage(title, url, meetingMode);

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        text,
      });
      return { ok: true, mode: "shared" as const };
    } catch (error: any) {
      if (error?.name === "AbortError") {
        return { ok: false, mode: "cancelled" as const };
      }
    }
  }

  const copied = await copyToClipboard(text);
  return { ok: copied, mode: "copied" as const };
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
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
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
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
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
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const { user, userSub } = useDashboardUser();
  const [createOpen, setCreateOpen] = useState(false);
  useEffect(() => {
    const openCreateFromTopbar = () => {
      setOpenMenuId(null);
      setEditOpen(false);
      setEditItem(null);
      setCreateOpen(true);
    };

    window.addEventListener("slotly-open-create-event", openCreateFromTopbar);

    return () => {
      window.removeEventListener("slotly-open-create-event", openCreateFromTopbar);
    };
  }, []);
  const [role, setRole] = useState<"all" | "hosted" | "invited">("all");
  const [meetingQ, setMeetingQ] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const [eventQ, setEventQ] = useState("");

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

  useEffect(() => {
    const handleEventTypeSearch = (event: Event) => {
      setEventQ(String((event as CustomEvent<string>).detail || ""));
    };

    const handleMeetingSearch = (event: Event) => {
      setMeetingQ(String((event as CustomEvent<string>).detail || ""));
    };

    window.addEventListener(
      "slotly-event-types-search",
      handleEventTypeSearch as EventListener,
    );
    window.addEventListener(
      "slotly-meetings-search",
      handleMeetingSearch as EventListener,
    );

    return () => {
      window.removeEventListener(
        "slotly-event-types-search",
        handleEventTypeSearch as EventListener,
      );
      window.removeEventListener(
        "slotly-meetings-search",
        handleMeetingSearch as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    setEventQ("");
    setMeetingQ("");
  }, [tab]);

  const updateTabInUrl = (nextTab: "event_types" | "meetings") => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextTab === "meetings") {
      params.set("tab", "meetings");
    } else {
      params.delete("tab");
    }

    const qs = params.toString();
    router.replace(
      qs ? `/dashboard/event-types?${qs}` : "/dashboard/event-types",
    );
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
    const handleGlobalEventTypeCreated = () => {
      reloadEventTypes();
    };

    window.addEventListener(
      "slotly-event-type-created",
      handleGlobalEventTypeCreated as EventListener,
    );

    return () => {
      window.removeEventListener(
        "slotly-event-type-created",
        handleGlobalEventTypeCreated as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    reloadEventTypes();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const eventTypeBySlug = useMemo(() => {
    const map: Record<string, EventType> = {};
    for (const it of items) map[String(it.slug || "")] = it;
    return map;
  }, [items]);

  const handleDelete = async (id: number) => {
    const confirmed = await confirmToast(
      "Delete event type?",
      "This action cannot be undone.",
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
        description:
          e?.message || String(e) || "Unable to delete. Please try again.",
        variant: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleEventStatus = async (
    e: React.MouseEvent,
    item: EventType,
  ) => {
    e.stopPropagation();

    if (togglingId === item.id) return;

    const nextValue = !item.is_active;
    try {
      setTogglingId(item.id);

      const updated = await updateEventType(Number(item.id), {
        is_active: nextValue,
      });

      setItems((prev) =>
        prev.map((x) =>
          x.id === item.id ? { ...x, is_active: nextValue } : x,
        ),
      );

      toast({
        title: nextValue ? "Event activated" : "Event deactivated",
        description: nextValue
          ? "This event is now accepting new bookings."
          : "New bookings are disabled for this event.",
        variant: "success",
      });
    } catch (e: any) {
      toast({
        title: "Status update failed",
        description:
          e?.message || String(e) || "Unable to update event status.",
        variant: "error",
      });
    } finally {
      setTogglingId(null);
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
          return (
            s.includes(q) ||
            loc.includes(q) ||
            guest.includes(q) ||
            pslug.includes(q)
          );
        });

    return bySearch.sort((a: any, b: any) => {
      const ta = a?.start ? new Date(a.start).getTime() : 0;
      const tb = b?.start ? new Date(b.start).getTime() : 0;
      return tb - ta;
    });
  }, [meetings, role, meetingQ]);

  const meetingStats = useMemo(() => {
    const base = Array.isArray(meetings) ? meetings : [];
    const hosted = base.filter(
      (m: any) => m?.role === "host" || m?.role === "both",
    ).length;
    const invited = base.filter(
      (m: any) => m?.role === "invitee" || m?.role === "both",
    ).length;
    return { total: base.length, hosted, invited };
  }, [meetings]);

  const eventTypeStats = useMemo(() => {
    const base = Array.isArray(meetings) ? meetings : [];
    const map: Record<
      string,
      { total: number; hosted: number; invited: number }
    > = {};
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
          return (
            t.includes(q) ||
            s.includes(q) ||
            loc.includes(q) ||
            mode.includes(q)
          );
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
    <div className="min-w-0 space-y-4 sm:space-y-5 lg:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mt-1 flex w-full max-w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1 shadow-sm sm:inline-flex sm:w-auto">
            <button
              className={classNames(
                "min-w-max flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition sm:flex-none",
                tab === "event_types"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50",
              )}
              onClick={() => updateTabInUrl("event_types")}
              type="button"
            >
              Event Types
            </button>
            <button
              className={classNames(
                "inline-flex min-w-max flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition sm:flex-none",
                tab === "meetings"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50",
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

        <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
          {tab === "meetings" ? (
            <button
              type="button"
              onClick={() => refresh()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm transition"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
          ) : null}

          {/* <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
          >
            Create Event Type
          </button> */}
        </div>
      </div>

      {/* {editOpen && editItem ? (
        <EventTypeEditModal
          open={editOpen}
          item={editItem}
          onClose={() => {
            setEditOpen(false);
            setEditItem(null);
          }}
          onSaved={(updated) => {
            setItems((prev) =>
              prev.map((x) => (x.id === updated.id ? updated : x)),
            );
          }}
        />
      ) : null} */}
      {editOpen && editItem ? (
        <CreateEventTypeModal
          open={editOpen}
          mode="edit"
          item={editItem}
          userSub={userSub}
          onClose={() => {
            setEditOpen(false);
            setEditItem(null);
          }}
          onUpdate={async (id, payload) => {
            const updated = await updateEventType(id, payload as any);
            setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));

            toast({
              title: "Saved",
              description: "Event type updated successfully.",
              variant: "success",
            });
          }}
        />
      ) : null}
      <div className="mt-4 sm:mt-6">
        {tab === "event_types" ? (
          <>
            {loading ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="text-sm text-gray-600">Loading…</div>
              </div>
            ) : err ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
                {err}
              </div>
            ) : filteredEventTypes.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-gray-900">
                      No event types yet
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Create your first booking link. Keep the title clear and
                      the duration simple.
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                            onClick={() => {
                              setEditOpen(false);
                              setEditItem(null);
                              setCreateOpen(true);
                            }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
                      >
                        Create Event Type
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3 min-[1800px]:grid-cols-4 min-[2400px]:grid-cols-5">
                  {" "}
                  {filteredEventTypes.map((it, index) => {
                    const publicBase =
                      process.env.NEXT_PUBLIC_PUBLIC_BASE_URL ||
                      (typeof window !== "undefined"
                        ? window.location.origin
                        : "");

                    const bookingUrl = `${publicBase}/publicbook/${it.slug}`;
                    const meetingMode = String(
                      it.meeting_mode || "",
                    ).toLowerCase();
                    const CardIcon = resolveEventIcon({
                      userIcon: (it as any).icon,
                      locationType: (it as any).meeting_mode,
                    });

                    const ICON_STYLES: Record<string, string> = {
                      video: "bg-purple-50 text-purple-600 ring-purple-100",
                      pin: "bg-sky-50 text-sky-600 ring-sky-100",
                      phone: "bg-emerald-50 text-emerald-600 ring-emerald-100",
                      briefcase: "bg-orange-50 text-orange-600 ring-orange-100",
                      handshake: "bg-amber-50 text-amber-700 ring-amber-100",
                      brain: "bg-pink-50 text-pink-600 ring-pink-100",
                      target: "bg-rose-50 text-rose-600 ring-rose-100",
                      calendar: "bg-indigo-50 text-indigo-600 ring-indigo-100",
                      chart: "bg-cyan-50 text-cyan-600 ring-cyan-100",
                      file: "bg-slate-50 text-slate-600 ring-slate-100",
                      users: "bg-teal-50 text-teal-600 ring-teal-100",
                      zap: "bg-yellow-50 text-yellow-700 ring-yellow-100",
                      search: "bg-blue-50 text-blue-700 ring-blue-100",
                      message: "bg-violet-50 text-violet-600 ring-violet-100",
                      user: "bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-100",
                    };

                    const ICON_FALLBACK_STYLES = [
                      "bg-sky-50 text-sky-600 ring-sky-100",
                      "bg-violet-50 text-violet-600 ring-violet-100",
                      "bg-emerald-50 text-emerald-600 ring-emerald-100",
                      "bg-amber-50 text-amber-700 ring-amber-100",
                      "bg-rose-50 text-rose-600 ring-rose-100",
                      "bg-cyan-50 text-cyan-600 ring-cyan-100",
                    ];

                    const iconStyle =
                      ICON_STYLES[String((it as any).icon || "")] ||
                      (meetingMode === "google_meet"
                        ? "bg-purple-50 text-purple-600 ring-purple-100"
                        : ICON_FALLBACK_STYLES[
                            index % ICON_FALLBACK_STYLES.length
                          ]);

                    const cleanLocation = String((it as any).location || "").trim();
                    const locationLabel = cleanLocation || "Location";
                    const bookingCount =
                      eventTypeStats[String(it.slug || "")]?.total ??
                      (it.bookings_count ?? 0);

                    return (
                      <div
                        key={it.id}
                        className="group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl border border-[#D0D5DD] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.04)] transition-all duration-300 hover:shadow-[0_6px_16px_rgba(16,24,40,0.06)] sm:min-h-[230px]"
                      >
                        <div className="flex flex-1 flex-col px-4 py-4 sm:px-5">
                          <div className="flex items-center justify-between gap-3 sm:gap-4">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${iconStyle}`}
                              >
                                <CardIcon className="h-5 w-5" />
                              </div>

                              <div className="flex min-w-0 flex-1 items-center">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                  <div className="max-w-[150px] truncate text-[15px] font-semibold leading-none text-gray-900 sm:max-w-none">
                                    {it.title}
                                  </div>

                                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold leading-none text-emerald-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    {bookingCount} {bookingCount === 1 ? "booking" : "bookings"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => handleToggleEventStatus(e, it)}
                                disabled={togglingId === it.id}
                                aria-pressed={!!it.is_active}
                                className={classNames(
                                  "relative inline-flex h-6 w-11 items-center rounded-full transition",
                                  it.is_active !== false
                                    ? "bg-indigo-600"
                                    : "bg-gray-300",
                                  togglingId === it.id
                                    ? "cursor-not-allowed opacity-60"
                                    : "cursor-pointer",
                                )}
                              >
                                <span
                                  className={classNames(
                                    "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                                    it.is_active !== false
                                      ? "translate-x-5"
                                      : "translate-x-1",
                                  )}
                                />
                              </button>

                              <div
                                className="relative z-20"
                                ref={openMenuId === it.id ? menuRef : null}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId((prev) =>
                                      prev === it.id ? null : it.id,
                                    );
                                  }}
                                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D0D5DD] bg-[#F8FAFC] transition hover:bg-white"
                                >
                                  <MoreVertical className="w-4 h-4 text-gray-700" />
                                </button>

                                {openMenuId === it.id && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-11 z-[9999] w-44 overflow-hidden rounded-2xl border border-[#D0D5DD] bg-[#F8FAFC] shadow-[0_12px_24px_rgba(16,24,40,0.10)]"
                                  >
                                    <button
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        setEditItem(it);
                                        setEditOpen(true);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-gray-50"
                                    >
                                      <Pencil className="w-4 h-4" />
                                      Edit
                                    </button>

                                    <button
                                      onClick={async () => {
                                        setOpenMenuId(null);
                                        const yes = await confirmToast(
                                          "Delete event type?",
                                          `This will permanently delete "${it.title}".`,
                                        );
                                        if (!yes) return;
                                        handleDelete(it.id);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <p className="mt-3 min-h-[20px] line-clamp-2 text-[13px] leading-5 px-2 text-gray-700">
                            {String((it as any).description || "").trim() ||
                              "No description"}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <div
                              className={classNames(
                                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                                it.is_active !== false
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-slate-100 text-slate-600",
                              )}
                            >
                              <span
                                className={classNames(
                                  "h-1.5 w-1.5 rounded-full",
                                  it.is_active !== false
                                    ? "bg-emerald-500"
                                    : "bg-slate-400",
                                )}
                              />
                              {it.is_active !== false ? "Public" : "Paused"}
                            </div>

                            <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-700">
                              <Clock className="h-3.5 w-3.5 text-slate-500" />
                              <span>{it.duration_minutes || 15} mins</span>
                            </div>

                            <div
                              title={cleanLocation || undefined}
                              className="inline-flex max-w-[140px] items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-700 sm:w-[104px]"
                            >
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                              <span className="truncate">{locationLabel}</span>
                            </div>
                          </div>

                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                const ok = await copyToClipboard(bookingUrl);
                                toast({
                                  title: ok ? "Link copied" : "Copy failed",
                                  description: ok
                                    ? "Public link copied successfully."
                                    : "Could not copy public link.",
                                  variant: ok ? "success" : "error",
                                });
                              }}
                              className="flex items-center gap-1.5 rounded-xl border border-[#D0D5DD] bg-[#F8FAFC] px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-white"
                            >
                              <Copy className="w-4 h-4" />
                              Copy
                            </button>
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();

                                const result = await handleNativeShare(
                                  it.title || "Meeting",
                                  bookingUrl,
                                  String(it.meeting_mode || ""),
                                );

                                if (result.mode === "shared") {
                                  
                                  return;
                                }

                                if (result.mode === "copied") {
                                  toast({
                                    title: "Message copied",
                                    description:
                                      "Native share not available, so full message was copied.",
                                    variant: "success",
                                  });
                                  return;
                                }

                                toast({
                                  title: "Share cancelled",
                                  description: "Share was cancelled.",
                                  variant: "info",
                                });
                              }}
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D0D5DD] bg-[#F8FAFC] transition hover:bg-white"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>

                            <a
                              href={bookingUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D0D5DD] bg-[#F8FAFC] transition hover:bg-white"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                          onClick={() => {
                            setEditOpen(false);
                            setEditItem(null);
                            setCreateOpen(true);
                          }}
                    className="group flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-lg sm:min-h-[230px]"
                    aria-label="Create event type"
                  >
                    <div className="flex flex-col items-center justify-center px-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-200 transition">
                        <span className="text-3xl leading-none text-gray-500 group-hover:text-indigo-600">
                          +
                        </span>
                      </div>

                      <div className="mt-4 text-base font-semibold text-gray-900">
                        Create Event Type
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Add a new booking page for your schedule
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.045)] transition-all duration-300 sm:rounded-[28px] sm:p-5 lg:p-6">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    <CalendarDays className="h-4 w-4 text-indigo-500" />
                    Meeting Inbox
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                    Review hosted and invited bookings with schedule, people, location, and meeting links.
                  </p>
                </div>

                <div className="grid w-full grid-cols-3 gap-2 sm:gap-3 xl:w-[430px] 2xl:w-[520px]">
                  <button
                    type="button"
                    onClick={() => setRole("all")}
                    className={classNames(
                      "rounded-2xl border px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 sm:px-4 2xl:px-5 2xl:py-4",
                      role === "all"
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-[0_16px_35px_rgba(79,70,229,0.24)]"
                        : "border-slate-200 bg-slate-50/70 text-slate-700 hover:border-indigo-200 hover:bg-white hover:shadow-sm",
                    )}
                  >
                    <div
                      className={classNames(
                        "text-[10px] font-bold uppercase tracking-[0.2em]",
                        role === "all" ? "text-white/75" : "text-slate-400",
                      )}
                    >
                      All
                    </div>
                    <div className="mt-1 text-xl font-bold leading-none sm:text-2xl">
                      {meetingStats.total}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("hosted")}
                    className={classNames(
                      "rounded-2xl border px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 sm:px-4 2xl:px-5 2xl:py-4",
                      role === "hosted"
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-[0_16px_35px_rgba(79,70,229,0.24)]"
                        : "border-slate-200 bg-slate-50/70 text-slate-700 hover:border-indigo-200 hover:bg-white hover:shadow-sm",
                    )}
                  >
                    <div
                      className={classNames(
                        "text-[10px] font-bold uppercase tracking-[0.2em]",
                        role === "hosted" ? "text-white/75" : "text-slate-400",
                      )}
                    >
                      Hosted
                    </div>
                    <div className="mt-1 text-xl font-bold leading-none sm:text-2xl">
                      {meetingStats.hosted}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("invited")}
                    className={classNames(
                      "rounded-2xl border px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 sm:px-4 2xl:px-5 2xl:py-4",
                      role === "invited"
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-[0_16px_35px_rgba(79,70,229,0.24)]"
                        : "border-slate-200 bg-slate-50/70 text-slate-700 hover:border-indigo-200 hover:bg-white hover:shadow-sm",
                    )}
                  >
                    <div
                      className={classNames(
                        "text-[10px] font-bold uppercase tracking-[0.2em]",
                        role === "invited" ? "text-white/75" : "text-slate-400",
                      )}
                    >
                      Invited
                    </div>
                    <div className="mt-1 text-xl font-bold leading-none sm:text-2xl">
                      {meetingStats.invited}
                    </div>
                  </button>
                </div>
              </div>
            </section>

            <div className="mt-5">
              {meetingsLoading && (
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm font-medium text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.045)] sm:rounded-[28px] sm:p-8">
                  Loading meetings…
                </div>
              )}

              {meetingsError && (
                <div className="rounded-[24px] border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700 shadow-sm">
                  {meetingsError}
                </div>
              )}

              {!meetingsLoading && !meetingsError && meetingFiltered.length === 0 && (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-6 text-center shadow-[0_18px_50px_rgba(15,23,42,0.045)] sm:rounded-[28px] sm:p-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                    <CalendarDays className="h-7 w-7" />
                  </div>
                  <div className="mt-4 text-base font-semibold text-slate-950">
                    No meetings found
                  </div>
                  <div className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                    Try changing the role filter or search keywords from the top bar.
                  </div>
                </div>
              )}

              {!meetingsLoading && !meetingsError && meetingFiltered.length > 0 && (
                <>
                  {/* Mobile + tablet cards */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:hidden">
                    {meetingFiltered.map((m: any) => {
                      const etSlug = String(m?.profile_slug || "").trim();
                      const et = etSlug ? eventTypeBySlug[etSlug] : null;
                      const { label, Icon } = meetingBadge(
                        et?.meeting_mode || m?.meeting_mode,
                      );
                      const people = Array.isArray(m?.attendees) ? m.attendees : [];
                      const primaryPerson = people[0] || "—";
                      const moreCount = Math.max(0, people.length - 1);
                      const locationText = String(m?.location || "").trim();
                      const meetingLink = String(
                        m?.meetLink || m?.meet_link || m?.hangoutLink || "",
                      ).trim();
                      const roleLabel =
                        m?.role === "host" || m?.role === "both"
                          ? "Hosted"
                          : m?.role === "invitee"
                            ? "Invited"
                            : "Meeting";

                      return (
                        <article
                          key={m?.id}
                          className="rounded-[26px] border border-slate-200/90 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.08)]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-base font-semibold text-slate-950">
                                  {et?.title || m?.summary || "Meeting"}
                                </div>
                                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                  <Icon className="h-3.5 w-3.5" />
                                  {label}
                                </div>
                              </div>
                            </div>

                            <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                              {roleLabel}
                            </span>
                          </div>

                          <div className="mt-4 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-sm">
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                Schedule
                              </div>
                              <div className="mt-1 font-semibold text-slate-900">
                                {fmtDateTime(m?.start)}
                              </div>
                              <div className="mt-0.5 text-xs text-slate-500">
                                {fmtTime(m?.start)} – {fmtTime(m?.end)}
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                People
                              </div>
                              <div className="mt-1 truncate font-semibold text-slate-900">
                                {primaryPerson}
                              </div>
                              <div className="mt-0.5 text-xs text-slate-500">
                                {people.length || 0} attendee{people.length === 1 ? "" : "s"}
                                {moreCount > 0 ? ` • +${moreCount} more` : ""}
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                Location / Link
                              </div>
                              <div className="mt-1 truncate font-semibold text-slate-900">
                                {locationText || "No location"}
                              </div>
                              {meetingLink ? (
                                <a
                                  href={meetingLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-0.5 block truncate text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                  Open meeting link
                                </a>
                              ) : (
                                <div className="mt-0.5 text-xs text-slate-400">
                                  No meeting link
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelected(m)}
                            className="mt-4 h-11 w-full rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-950"
                          >
                            View details
                          </button>
                        </article>
                      );
                    })}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.055)] xl:block">
                    <div className="grid min-w-[1120px] grid-cols-12 border-b border-slate-100 bg-slate-50/80 px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 2xl:px-7">
                      <div className="col-span-3">Meeting</div>
                      <div className="col-span-2">Schedule</div>
                      <div className="col-span-3">People</div>
                      <div className="col-span-2">Location / Link</div>
                      <div className="col-span-1">Role</div>
                      <div className="col-span-1 text-right">Action</div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {meetingFiltered.map((m: any) => {
                        const etSlug = String(m?.profile_slug || "").trim();
                        const et = etSlug ? eventTypeBySlug[etSlug] : null;
                        const { label, Icon } = meetingBadge(
                          et?.meeting_mode || m?.meeting_mode,
                        );
                        const people = Array.isArray(m?.attendees) ? m.attendees : [];
                        const primaryPerson = people[0] || "—";
                        const locationText = String(m?.location || "").trim();
                        const meetingLink = String(
                          m?.meetLink || m?.meet_link || m?.hangoutLink || "",
                        ).trim();
                        const roleLabel =
                          m?.role === "host" || m?.role === "both"
                            ? "Hosted"
                            : m?.role === "invitee"
                              ? "Invited"
                              : "Meeting";

                        return (
                          <div
                            key={m?.id}
                            className="grid min-w-[1120px] grid-cols-12 items-center px-5 py-4 transition duration-200 hover:bg-slate-50/70 2xl:px-7 2xl:py-5"
                          >
                            <div className="col-span-3 flex min-w-0 items-center gap-3 pr-5">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-slate-950">
                                  {et?.title || m?.summary || "Meeting"}
                                </div>
                                <div className="mt-1 inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                  <Icon className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{label}</span>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-2 min-w-0 pr-5">
                              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                                <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                                <span className="truncate">{fmtDateTime(m?.start)}</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                                <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                                <span>
                                  {fmtTime(m?.start)} – {fmtTime(m?.end)}
                                </span>
                              </div>
                            </div>

                            <div className="col-span-3 flex min-w-0 items-center gap-3 pr-5">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                                {String(primaryPerson || "U").trim().charAt(0).toUpperCase() || "U"}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-slate-950">
                                  {primaryPerson}
                                </div>
                                <div className="mt-0.5 text-xs text-slate-500">
                                  {people.length || 0} attendee{people.length === 1 ? "" : "s"}
                                </div>
                              </div>
                            </div>

                            <div className="col-span-2 min-w-0 pr-5">
                              <div className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-slate-700">
                                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                                <span className="truncate">{locationText || "No location"}</span>
                              </div>
                              {meetingLink ? (
                                <a
                                  href={meetingLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-1 block truncate text-xs font-medium text-indigo-600 transition hover:text-indigo-700"
                                >
                                  Open meeting link
                                </a>
                              ) : (
                                <div className="mt-1 truncate text-xs text-slate-400">
                                  No meeting link
                                </div>
                              )}
                            </div>

                            <div className="col-span-1">
                              <span
                                className={classNames(
                                  "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                                  roleLabel === "Hosted"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : roleLabel === "Invited"
                                      ? "border-sky-200 bg-sky-50 text-sky-700"
                                      : "border-slate-200 bg-slate-50 text-slate-600",
                                )}
                              >
                                {roleLabel}
                              </span>
                            </div>

                            <div className="col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setSelected(m)}
                                className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-950"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {selected ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
                <div
                  className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity"
                  onClick={() => setSelected(null)}
                />
                <div className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)] transition-all duration-200 sm:rounded-[28px]">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:gap-4 sm:p-5">
                    <div className="min-w-0">
                      <div className="text-lg font-semibold text-slate-950 truncate">
                        {selected?.summary || "Meeting"}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {fmtDateTime(selected?.start)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                      aria-label="Close meeting details"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Time
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-950">
                        {fmtTime(selected?.start)} – {fmtTime(selected?.end)}
                      </div>

                      <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Role
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-950">
                        {selected?.role || "—"}
                      </div>

                      <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Booking ID
                      </div>
                      <div className="mt-1 break-all font-mono text-sm text-slate-800">
                        {selected?.id || "—"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Event Type
                      </div>
                      <div className="mt-1 break-all text-sm font-semibold text-slate-950">
                        {selected?.profile_slug || "—"}
                      </div>

                      <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Location
                      </div>
                      <div className="mt-1 break-all text-sm font-semibold text-slate-950">
                        {selected?.location || "—"}
                      </div>

                      <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Meeting link
                      </div>
                      <div className="mt-1 text-sm">
                        {selected?.meetLink || selected?.meet_link || selected?.hangoutLink ? (
                          <a
                            className="break-all font-semibold text-indigo-700 transition hover:text-indigo-800"
                            href={selected?.meetLink || selected?.meet_link || selected?.hangoutLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {selected?.meetLink || selected?.meet_link || selected?.hangoutLink}
                          </a>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
                      <div className="text-sm font-semibold text-slate-950">
                        Attendees
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(Array.isArray(selected?.attendees) ? selected.attendees : []).map(
                          (a: string) => (
                            <span
                              key={a}
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                            >
                              {a}
                            </span>
                          ),
                        )}
                        {!selected?.attendees || selected.attendees.length === 0 ? (
                          <div className="text-sm text-slate-500">
                            No attendees stored.
                          </div>
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
    String(item?.meeting_mode || "google_meet"),
  );
  const [location, setLocation] = useState(String(item?.location || ""));
  const [durationMinutes, setDurationMinutes] = useState<number>(
    Number(item?.duration_minutes || 15),
  );
  const [availabilityJson, setAvailabilityJson] = useState<string>(
    String(item?.availability_json || "{}"),
  );
  const [isActive, setIsActive] = useState<boolean>(item?.is_active !== false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState(
    String(item?.description || ""),
  );

  const needsLocation = String(meetingMode).toLowerCase() === "in_person";
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const publicLink = `${base}/publicbook/${String(item?.slug || "").trim()}`;

  useEffect(() => {
    if (!open) return;
    setTitle(String(item?.title || ""));
    setMeetingMode(String(item?.meeting_mode || "google_meet"));
    setLocation(String(item?.location || ""));
    setDurationMinutes(Number(item?.duration_minutes || 15));
    setAvailabilityJson(String(item?.availability_json || "{}"));
    setIsActive(item?.is_active !== false);
    setDescription(String(item?.description || ""));
  }, [open, item]);

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
          description: description.trim(),
          meeting_mode: String(meetingMode),
          location: needsLocation ? cleanLoc : "",
          availability_json: availabilityJson || "{}",
          duration_minutes: Math.max(
            5,
            Math.min(24 * 60, Number(durationMinutes || 15)),
          ),
          is_active: isActive,
        };
        return updateEventType(Number(item.id), payload);
      })();

      if (updated?.slug) {
        try {
          const API_BASE = (
            process.env.NEXT_PUBLIC_API_URL || "https://slotly.io"
          ).replace(/\/+$/, "");

          const sub = (function safeGetUserSubFromStorage2(): string | null {
            const keysToTry = [
              "user_sub",
              "slotly_user",
              "user",
              "auth_user",
              "slotlyUser",
            ];
            for (const key of keysToTry) {
              try {
                const saved = localStorage.getItem(key);
                if (!saved) continue;
                if (key === "user_sub") return saved;
                if (saved === "null" || saved === "undefined") continue;

                const parsed = JSON.parse(saved);
                if (!parsed || typeof parsed !== "object") continue;

                const sub =
                  (parsed as any).sub ||
                  (parsed as any).user_sub ||
                  (parsed as any).id;

                if (typeof sub === "string" && sub.trim()) return sub.trim();

                const nested =
                  (parsed as any).user?.sub || (parsed as any).profile?.sub;

                if (typeof nested === "string" && nested.trim()) {
                  return nested.trim();
                }
              } catch {}
            }
            return null;
          })();

          if (sub) {
            await fetch(
              `${API_BASE}/schedule/profile/${encodeURIComponent(
                updated.slug,
              )}?user_sub=${encodeURIComponent(sub)}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  duration_minutes: Math.max(
                    5,
                    Math.min(24 * 60, Number(durationMinutes || 15)),
                  ),
                }),
              },
            );
          }
        } catch {}
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

      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 p-4 sm:gap-4 sm:p-6">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-900">
              Edit Event Type
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Update title, duration, availability, meeting settings, and
              status.
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

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 sm:p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none transition"
              placeholder="e.g., 15-min Intro Call"
            />
          </div>

          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 100) setDescription(value);
              }}
              rows={3}
              className="w-full px-2 py-2.5 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none resize-none text-sm transition"
              placeholder="Brief description of this event…"
            />

            <span className="absolute bottom-2 right-3 text-[11px] text-slate-400">
              {description.length}/100 characters
            </span>
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
                onChange={(e) =>
                  setDurationMinutes(parseInt(e.target.value, 10) || 15)
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none transition"
              />
              <div className="text-[11px] text-gray-500 mt-1">
                Use 5-minute steps.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <button
                type="button"
                onClick={() => setAvailabilityOpen(true)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 text-left transition"
              >
                Set availability
                <span className="text-[11px] text-gray-500 block mt-1">
                  Weekly hours, date overrides, and time blocks
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting type
            </label>
            <select
              value={String(meetingMode)}
              onChange={(e) => setMeetingMode(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none transition"
            >
              <option value="google_meet">Google Meet</option>
              <option value="in_person">In-person</option>
            </select>
          </div>

          {needsLocation ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none transition"
                placeholder="Enter full meeting location"
              />
            </div>
          ) : null}

          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="min-w-0 pr-4">
              <div className="text-sm font-medium text-gray-900">
                Event status
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                {isActive
                  ? "Accepting new bookings"
                  : "New bookings are disabled. Existing meetings stay unaffected."}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                isActive ? "bg-indigo-600" : "bg-gray-300"
              }`}
              aria-pressed={isActive}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${
                  isActive ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Public link
            </div>
            <div className="mt-2 text-sm text-indigo-700 break-all">
              {publicLink}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-end sm:p-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60 sm:w-auto"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

        <AvailabilityEditorModal
          open={availabilityOpen}
          initialValue={availabilityJson || "{}"}
          onClose={() => setAvailabilityOpen(false)}
          onSave={(nextValue: string) => {
            setAvailabilityJson(nextValue || "{}");
            setAvailabilityOpen(false);
          }}
        />
      </div>
    </div>
  );
}
