//@ts-nocheck
"use client";

import React, { useMemo, useState } from "react";
import { CalendarEvent } from "../../types";
import { MapPin, ExternalLink, Users, Pencil, Trash2, Clock } from "lucide-react";
import { deleteBookingByGoogleEvent, updateBookingByGoogleEvent } from "../../api/calendar";
import { useToast } from "@/hooks/use-toast";

function safeDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function fmtTime(iso?: string) {
  const d = safeDate(iso);
  if (!d) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtDateShort(iso?: string) {
  const d = safeDate(iso);
  if (!d) return "";
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
}

function parseLocation(raw?: string) {
  const s = String(raw || "").trim();
  if (!s) return { text: "", url: "" };

  // any http(s) URL (maps.app.goo.gl, google.com/maps, etc.)
  const urlMatch = s.match(/https?:\/\/[^\s)]+/i);
  const url = urlMatch?.[0] || "";

  let text = s;
  if (url) text = text.replace(`(${url})`, "").replace(url, "").trim();
  text = text.replace(/\s+\)$/g, "").trim();

  return { text, url };
}

function extractMeetLink(ev: any): string {
  // 1) normalized fields
  const direct =
    ev?.meetLink ||
    ev?.meet_link ||
    ev?.meetURL ||
    ev?.meet_url ||
    ev?.meet ||
    ev?.conferenceUrl ||
    ev?.conference_url;
  if (direct) return String(direct);

  // 2) Google Calendar
  if (ev?.hangoutLink) return String(ev.hangoutLink);

  const entryPoints = ev?.conferenceData?.entryPoints;
  if (Array.isArray(entryPoints)) {
    const video = entryPoints.find((x: any) => x?.entryPointType === "video" && x?.uri);
    if (video?.uri) return String(video.uri);
    const any = entryPoints.find((x: any) => x?.uri);
    if (any?.uri) return String(any.uri);
  }

  // 3) fallback: description
  const maybe = String(ev?.description || "");
  const m = maybe.match(/https?:\/\/[^\s)]+/i);
  if (m?.[0]) return String(m[0]);

  return "";
}

type Props = {
  event: CalendarEvent;
  onClick?: () => void;
  variant?: "timeline" | "card";
  userSub?: string;
  onChanged?: () => void;
};

export default function EventCard({ event, onClick, variant = "timeline", userSub, onChanged }: Props) {
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
          label: "Confirm",
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

  const startISO = (event as any).start || undefined;
  const endISO = (event as any).end || undefined;

  const summary = (event as any).summary || (event as any).title || "Untitled";
  const organizer = (event as any).organizer || "";
  const rawLocation = (event as any).location || "";
  const htmlLink = (event as any).htmlLink || (event as any).html_link || "";
  const attendees = (event as any).attendees || [];

  const startT = fmtTime(startISO);
  const endT = fmtTime(endISO);
  const dateShort = fmtDateShort(startISO);

  const { text: locationText, url: mapsUrl } = useMemo(() => parseLocation(rawLocation), [rawLocation]);
  const meetUrl = useMemo(() => extractMeetLink(event), [event]);

  const hasMap = !!mapsUrl;
  const hasMeet = !!meetUrl;

  const visibleAttendees = attendees.slice(0, 2);
  const remaining = attendees.length - visibleAttendees.length;

  const [editOpen, setEditOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const startDateLocal = useMemo(() => {
    const d = safeDate(startISO);
    if (!d) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, [startISO]);

  const startTimeLocal = useMemo(() => {
    const d = safeDate(startISO);
    if (!d) return "";
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mi}`;
  }, [startISO]);

  const [editForm, setEditForm] = useState({
    title: summary,
    date: startDateLocal,
    time: startTimeLocal,
  });

  React.useEffect(() => {
    setEditForm({ title: summary, date: startDateLocal, time: startTimeLocal });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id, startDateLocal, startTimeLocal, summary]);

  async function handleUpdate(e: any) {
    e?.stopPropagation?.();
    if (!userSub) {
      toast({
        title: "Action not available",
        description: "Missing user context (userSub). Please refresh and try again.",
        variant: "error",
      });
      return;
    }
    if (!event?.id) {
      toast({
        title: "Action not available",
        description: "Missing event id. Please refresh and try again.",
        variant: "error",
      });
      return;
    }

    const nextStartISO = new Date(`${editForm.date}T${editForm.time}`).toISOString();

    try {
      setBusy(true);
      await updateBookingByGoogleEvent({
        userSub,
        googleEventId: String((event as any).id),
        startISO: nextStartISO,
        title: editForm.title,
      });
      setEditOpen(false);
      toast({ title: "Meeting updated", description: "Your changes were saved.", variant: "success" });
      onChanged?.();
    } catch (err: any) {
      toast({ title: "Update failed", description: err?.message || "Please try again.", variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(e: any) {
    e?.stopPropagation?.();
    if (!userSub) {
      toast({
        title: "Action not available",
        description: "Missing user context (userSub). Please refresh and try again.",
        variant: "error",
      });
      return;
    }
    if (!event?.id) {
      toast({
        title: "Action not available",
        description: "Missing event id. Please refresh and try again.",
        variant: "error",
      });
      return;
    }

    const ok = await confirmToast("Delete this meeting?", "This action cannot be undone.");
    if (!ok) {
      toast({ title: "Cancelled", description: "Meeting was not deleted.", variant: "default" });
      return;
    }

    try {
      setBusy(true);
      await deleteBookingByGoogleEvent({
        userSub,
        googleEventId: String((event as any).id),
      });
      toast({ title: "Meeting deleted", description: "The meeting has been removed.", variant: "success" });
      onChanged?.();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err?.message || "Please try again.", variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div
        onClick={onClick}
        className={[
          "bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer",
          "p-4 sm:p-5",
        ].join(" ")}
      >
        {/* Layout: mobile stacks; desktop uses time column */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Time column */}
          <div className="sm:w-[120px] sm:shrink-0">
            <div className="rounded-2xl bg-gray-50 border border-gray-100 px-3 py-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div className="text-sm font-semibold text-slate-900">
                  {startT || "—"}
                  {endT ? <span className="text-gray-500 font-medium"> – {endT}</span> : null}
                </div>
              </div>
              {dateShort ? <div className="text-xs text-gray-500 pl-6 mt-0.5">{dateShort}</div> : null}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm sm:text-[15px] font-semibold text-slate-900 truncate">
                  {summary}
                </div>
                {organizer ? (
                  <div className="text-xs text-gray-500 mt-1 truncate">{organizer}</div>
                ) : null}
              </div>

              {/* Location chip on desktop */}
              {locationText ? (
                <span
                  className="hidden sm:inline-flex max-w-[260px] truncate text-[11px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 items-center gap-1"
                  title={locationText}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {locationText}
                </span>
              ) : null}
            </div>

            {/* Mobile location chip */}
            {locationText ? (
              <div className="mt-2 sm:hidden">
                <span
                  className="inline-flex max-w-full truncate text-[11px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 items-center gap-1"
                  title={locationText}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {locationText}
                </span>
              </div>
            ) : null}

            {/* Actions: responsive grid so buttons never look clumsy */}
            {(hasMap || hasMeet || htmlLink || userSub) && (
              <div className="mt-3">
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                  {hasMeet ? (
                    <a
                      href={meetUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={[
                        "col-span-2 sm:col-auto",
                        "text-xs px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700",
                        "inline-flex items-center justify-center gap-1",
                      ].join(" ")}
                      title="Join meeting"
                    >
                      Join Meet <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}

                  {hasMap ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={[
                        "text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50",
                        "inline-flex items-center justify-center gap-1",
                      ].join(" ")}
                      title="Open location in Maps"
                    >
                      Open Map <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}

                  {htmlLink ? (
                    <a
                      href={htmlLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={[
                        "text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50",
                        "inline-flex items-center justify-center gap-1 text-gray-700",
                      ].join(" ")}
                    >
                      Open Calendar <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}

                  {userSub ? (
                    <div className="col-span-2 sm:ml-auto flex items-center gap-2 justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditOpen(true);
                        }}
                        disabled={busy}
                        className="text-xs px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-1 disabled:opacity-60"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={handleDelete}
                        disabled={busy}
                        className="text-xs px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-1 disabled:opacity-60"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* Participants */}
            {attendees.length > 0 ? (
              <div className="mt-4">
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                  <Users className="w-3.5 h-3.5" />
                  Participants
                </div>

                <div className="flex flex-wrap gap-2">
                  {visibleAttendees.map((email: string) => (
                    <span
                      key={email}
                      className="max-w-[240px] truncate px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-700"
                      title={email}
                    >
                      {email}
                    </span>
                  ))}
                  {remaining > 0 ? <span className="text-xs text-gray-500">+{remaining} more</span> : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Responsive edit modal */}
      {editOpen ? (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditOpen(false)}>
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">Edit / Reschedule</h2>
              <p className="text-xs text-gray-500 mt-0.5">Update the title or change date & time.</p>
            </div>

            <div className="p-5 space-y-3 max-h-[70vh] overflow-auto">
              <div>
                <label className="text-xs font-medium text-gray-600">Title</label>
                <input
                  name="title"
                  value={editForm.title}
                  placeholder="Event title"
                  className="mt-1 w-full border border-gray-200 bg-white px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                  onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    className="mt-1 w-full border border-gray-200 bg-white px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                    onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={editForm.time}
                    className="mt-1 w-full border border-gray-200 bg-white px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                    onChange={(e) => setEditForm((p) => ({ ...p, time: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setEditOpen(false)}
                className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm disabled:opacity-60"
                disabled={busy}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm disabled:opacity-60"
                disabled={busy}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
