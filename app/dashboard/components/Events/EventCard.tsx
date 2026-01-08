// //@ts-nocheck

// "use client";

// import React from "react";
// import { CalendarEvent } from "../../types";
// import { Clock, MapPin, ExternalLink, Users } from "lucide-react";

// function safeDate(iso?: string) {
//   if (!iso) return null;
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return null;
//   return d;
// }

// function fmtTime(iso?: string) {
//   const d = safeDate(iso);
//   if (!d) return "";
//   return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// type Props = {
//   event: CalendarEvent;
//   onClick?: () => void;
//   variant?: "timeline" | "card";
// };

// export default function EventCard({
//   event,
//   onClick,
//   variant = "timeline",
// }: Props) {

//   const startISO = event.start || undefined;
//   const endISO = event.end || undefined;

//   const summary = event.summary || "Untitled";
//   const organizer = event.organizer || "";
//   const location = event.location || "";
//   const htmlLink = event.htmlLink || "";
//   const meetLink = event.meetLink || null;
//   const attendees = event.attendees || [];

//   const startT = fmtTime(startISO);
//   const endT = fmtTime(endISO);

//   const visibleAttendees = attendees.slice(0, 2);
//   const remaining = attendees.length - visibleAttendees.length;

//   return (
//     <div
//       onClick={onClick}
//       className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow transition p-4 cursor-pointer"
//     >
//       <div className="flex items-start gap-4">
//         {/* Time */}
//         <div className="w-24 shrink-0">
//           <div className="text-sm font-semibold text-slate-900">
//             {startT || "—"}
//           </div>
//           <div className="text-xs text-gray-500">
//             {endT ? `to ${endT}` : ""}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-3">
//             <div className="min-w-0">
//               <div className="text-sm font-semibold truncate">{summary}</div>
//               <div className="text-xs text-gray-500 mt-1 truncate">
//                 {organizer}
//               </div>
//             </div>

//             {location ? (
//               <span className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-600 inline-flex items-center gap-1">
//                 <MapPin className="w-3.5 h-3.5" />
//                 {location}
//               </span>
//             ) : null}
//           </div>

//           {/* ACTION ROW */}
//           {/* <div className="mt-3 flex flex-wrap items-center gap-3">
//             {meetLink && (
//               <a
//                 href={meetLink}
//                 target="_blank"
//                 rel="noreferrer"
//                 onClick={(e) => e.stopPropagation()}
//                 className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-1"
//               >
//                 Join Meet <ExternalLink className="w-3.5 h-3.5" />
//               </a>
//             )}

//             {htmlLink && (
//               <a
//                 href={htmlLink}
//                 target="_blank"
//                 rel="noreferrer"
//                 onClick={(e) => e.stopPropagation()}
//                 className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1"
//               >
//                 Open Calendar <ExternalLink className="w-3.5 h-3.5" />
//               </a>
//             )}
//           </div> */}

//           <div className="flex gap-2 mt-3">
//   <button
//     onClick={(e) => {
//       e.stopPropagation();
//       onEdit(event);
//     }}
//     className="text-xs px-3 py-1 border rounded"
//   >
//     Edit
//   </button>

//   <button
//     onClick={(e) => {
//       e.stopPropagation();
//       onDelete(event.id);
//     }}
//     className="text-xs px-3 py-1 border text-red-600 rounded"
//   >
//     Delete
//   </button>
// </div>


//           {/* PARTICIPANTS */}
//           {attendees.length > 0 && (
//             <div className="mt-3 text-xs text-gray-600">
//               <div className="flex items-center gap-1 mb-1">
//                 <Users className="w-3.5 h-3.5" />
//                 Participants
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 {visibleAttendees.map((email) => (
//                   <span
//                     key={email}
//                     className="px-2 py-0.5 rounded-full bg-gray-100 border text-gray-700"
//                   >
//                     {email}
//                   </span>
//                 ))}
//                 {remaining > 0 && (
//                   <span className="text-gray-500">
//                     +{remaining} more
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }












//@ts-nocheck

"use client";

import React, { useMemo, useState } from "react";
import { CalendarEvent } from "../../types";
import { Clock, MapPin, ExternalLink, Users, Pencil, Trash2 } from "lucide-react";
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

type Props = {
  event: CalendarEvent;
  onClick?: () => void;
  variant?: "timeline" | "card";

  // ✅ NEW (optional): required for edit/delete to work
  userSub?: string;
  onChanged?: () => void; // call after update/delete to refresh list
};

export default function EventCard({
  event,
  onClick,
  variant = "timeline",
  userSub,
  onChanged,
}: Props) {
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

  const startISO = event.start || undefined;
  const endISO = event.end || undefined;

  const summary = event.summary || "Untitled";
  const organizer = event.organizer || "";
  const location = event.location || "";
  const htmlLink = event.htmlLink || "";
  const meetLink = event.meetLink || null;
  const attendees = event.attendees || [];

  const startT = fmtTime(startISO);
  const endT = fmtTime(endISO);

  const visibleAttendees = attendees.slice(0, 2);
  const remaining = attendees.length - visibleAttendees.length;

  // ✅ NEW: local modal state for reschedule/edit
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

  // keep form in sync when event changes
  React.useEffect(() => {
    setEditForm({
      title: summary,
      date: startDateLocal,
      time: startTimeLocal,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id, startDateLocal, startTimeLocal, summary]);

  async function handleUpdate(e: any) {
    e?.stopPropagation?.();
    if (!userSub) {
      toast({ title: "Action not available", description: "Missing user context (userSub). Please refresh and try again.", variant: "error" });
      return;
    }
    if (!event?.id) {
      toast({ title: "Action not available", description: "Missing event id. Please refresh and try again.", variant: "error" });
      return;
    }

    const nextStartISO = new Date(`${editForm.date}T${editForm.time}`).toISOString();

    try {
      setBusy(true);
      await updateBookingByGoogleEvent({
        userSub,
        googleEventId: String(event.id),
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
      toast({ title: "Action not available", description: "Missing user context (userSub). Please refresh and try again.", variant: "error" });
      return;
    }
    if (!event?.id) {
      toast({ title: "Action not available", description: "Missing event id. Please refresh and try again.", variant: "error" });
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
        googleEventId: String(event.id),
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
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow transition p-4 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Time */}
        <div className="w-24 shrink-0">
          <div className="text-sm font-semibold text-slate-900">
            {startT || "—"}
          </div>
          <div className="text-xs text-gray-500">
            {endT ? `to ${endT}` : ""}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{summary}</div>
              <div className="text-xs text-gray-500 mt-1 truncate">
                {organizer}
              </div>
            </div>

            {location ? (
              <span className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-600 inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
            ) : null}
          </div>

          {/* ACTION ROW */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {meetLink && (
              <a
                href={meetLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-1"
              >
                Join Meet <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {htmlLink && (
              <a
                href={htmlLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1"
              >
                Open Calendar <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* ✅ NEW: Admin actions (only if userSub is provided) */}
            {userSub ? (
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditOpen(true);
                  }}
                  disabled={busy}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  disabled={busy}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            ) : null}
          </div>

          {/* PARTICIPANTS */}
          {attendees.length > 0 && (
            <div className="mt-3 text-xs text-gray-600">
              <div className="flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5" />
                Participants
              </div>

              <div className="flex flex-wrap gap-2">
                {visibleAttendees.map((email) => (
                  <span
                    key={email}
                    className="px-2 py-0.5 rounded-full bg-gray-100 border text-gray-700"
                  >
                    {email}
                  </span>
                ))}
                {remaining > 0 && (
                  <span className="text-gray-500">
                    +{remaining} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ NEW: Simple Edit/Reschedule Modal */}
      {editOpen ? (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setEditOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-[520px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Edit / Reschedule</h2>

            <div className="space-y-3">
              <input
                name="title"
                value={editForm.title}
                placeholder="Event title"
                className="w-full border p-2 rounded"
                onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  name="date"
                  value={editForm.date}
                  className="w-full border p-2 rounded"
                  onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))}
                />

                <input
                  type="time"
                  name="time"
                  value={editForm.time}
                  className="w-full border p-2 rounded"
                  onChange={(e) => setEditForm((p) => ({ ...p, time: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditOpen(false)}
                className="px-3 py-2 border rounded"
                disabled={busy}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-3 py-2 bg-blue-600 text-white rounded"
                disabled={busy}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

