//@ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, MapPin, Video } from "lucide-react";
import { EventType } from "../../types";
import { useToast } from "@/hooks/use-toast";
import AvailabilityEditorModal from "../Schedule/AvailabilityEditorModal";

type MeetingMode = "google_meet" | "in_person";

export default function EditEventTypeModal({
  open,
  item,
  onClose,
  onUpdate,
  onDelete,
}: {
  open: boolean;
  item: EventType | null;
  onClose: () => void;
  onUpdate: (
    id: number,
    payload: Partial<{
      title: string;
      meeting_mode: MeetingMode;
      location: string;
      availability_json: string;
      duration_minutes: number;
    }>
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
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

  const [title, setTitle] = useState("");
  const [meetingMode, setMeetingMode] = useState<MeetingMode>("google_meet");
  const [location, setLocation] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [saving, setSaving] = useState(false);
  // Event-type scoped availability
  const [availabilityJson, setAvailabilityJson] = useState<string>("{}");
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsLocation = meetingMode === "in_person";

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setMeetingMode((item.meeting_mode as MeetingMode) || "google_meet");
      setLocation(item.location || "");
      setDurationMinutes(Number((item as any).duration_minutes || 15));
      setAvailabilityJson(String(item.availability_json || "{}"));
    }
  }, [item]);

  if (!open || !item) return null;

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    const cleanLocation = location.trim();

    if (!cleanTitle) {
      setError("Title is required");
      return;
    }
    if (needsLocation && !cleanLocation) {
      setError("Location is required for in-person meeting");
      return;
    }

    setSaving(true);
    try {
      await onUpdate(item.id, {
        title: cleanTitle,
        meeting_mode: meetingMode,
        location: needsLocation ? cleanLocation : "",
        duration_minutes: durationMinutes,
        availability_json: availabilityJson,
      });
      toast({ title: "Saved", description: "Event type updated successfully.", variant: "success" });
      onClose();
    } catch (err: any) {
      const msg = err?.message || String(err);
      setError(msg);
      toast({ title: "Save failed", description: msg, variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    const ok = await confirmToast("Delete this event type?", "This cannot be undone.");
    if (!ok) {
      toast({ title: "Cancelled", description: "Event type was not deleted.", variant: "default" });
      return;
    }
    setDeleting(true);
    try {
      await onDelete(item.id);
      toast({ title: "Deleted", description: "Event type deleted.", variant: "success" });
      onClose();
    } catch (err: any) {
      const msg = err?.message || String(err);
      setError(msg);
      toast({ title: "Delete failed", description: msg, variant: "error" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl"
      >
        <form onSubmit={submit}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center">
              {meetingMode === "google_meet" ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-lg font-semibold">Edit Event Type</div>
              <div className="text-sm text-slate-500">Modify or delete this booking template.</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-600">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="text-xs text-slate-600">Meeting type</label>
              <select
                value={meetingMode}
                onChange={(e) => setMeetingMode(e.target.value as MeetingMode)}
                className="mt-1 w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="google_meet">Google Meet</option>
                <option value="in_person">In-person meeting</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600">Duration</label>
              <select
                value={String(durationMinutes)}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border rounded-lg bg-white"
              >
                {[5, 10, 15, 20, 30, 45, 60, 90, 120].map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-slate-500">Controls the slot size shown to guests.</div>
            </div>

            <div>
              <label className="text-xs text-slate-600">Availability</label>
              <div className="mt-1 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500">Override weekly hours for this event type.</div>
                <button
                  type="button"
                  onClick={() => setAvailabilityOpen(true)}
                  className="px-3 py-2 text-sm rounded-lg border hover:bg-slate-50"
                >
                  Edit availability
                </button>
              </div>
            </div>

            {needsLocation && (
              <div>
                <label className="text-xs text-slate-600">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" />
              </div>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>

          <div className="flex items-center justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={doDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Deleting…" : "Delete"}
            </button>

            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold disabled:opacity-60">
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      <AvailabilityEditorModal
        open={availabilityOpen}
        initialAvailabilityJson={availabilityJson}
        onClose={() => setAvailabilityOpen(false)}
        onSave={(json) => {
          setAvailabilityJson(json);
          setAvailabilityOpen(false);
        }}
      />
    </div>
  );
}
