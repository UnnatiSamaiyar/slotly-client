"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, MapPin, Video } from "lucide-react";

type MeetingMode = "google_meet" | "in_person";

export default function CreateEventTypeModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: {
    title: string;
    meeting_mode: MeetingMode;
    location?: string;
    availability_json?: string;
  }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [meetingMode, setMeetingMode] = useState<MeetingMode>("google_meet");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsLocation = meetingMode === "in_person";

  useEffect(() => {
    if (!open) return;
    setError(null);
    setTitle("");
    setMeetingMode("google_meet");
    setLocation("");
    setSaving(false);
  }, [open]);

  const icon = useMemo(
    () => (meetingMode === "google_meet" ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />),
    [meetingMode]
  );

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
      await onCreate({
        title: cleanTitle,
        meeting_mode: meetingMode,
        location: needsLocation ? cleanLocation : "",
        availability_json: "{}",
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl"
      >
        <form onSubmit={submit}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-semibold">Create Event Type</div>
              <div className="text-sm text-slate-500">Quick booking template for visitors.</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-600">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="e.g. Intro Call"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Meeting type</label>
              <div className="mt-1 flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg border flex items-center justify-center text-slate-700">
                  {icon}
                </div>
                <select
                  value={meetingMode}
                  onChange={(e) => setMeetingMode(e.target.value as MeetingMode)}
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="google_meet">Google Meet</option>
                  <option value="in_person">In-person meeting</option>
                </select>
              </div>
            </div>

            {needsLocation && (
              <div>
                <label className="text-xs text-slate-600">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g. Office address + Google Maps link"
                />
              </div>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-slate-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-60"
            >
              {saving ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
