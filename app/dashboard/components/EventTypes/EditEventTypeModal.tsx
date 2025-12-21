<<<<<<< HEAD
//@ts-nocheck
=======
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
// src/app/dashboard/components/EventTypes/EditEventTypeModal.tsx
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { EventType } from "../../types";

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
  onUpdate: (id: number, payload: Partial<{ title: string; duration: number; location: string; availability_json: string }>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDuration(item.duration || 30);
      setLocation(item.location || "");
    }
  }, [item]);

  if (!open || !item) return null;

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onUpdate(item.id, { title: title.trim(), duration: Number(duration), location: location.trim() });
      onClose();
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    if (!confirm("Delete this event type? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await onDelete(item.id);
      onClose();
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl"
      >
        <form onSubmit={submit}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v5l3 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
              </svg>
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
              <label className="text-xs text-slate-600">Duration (minutes)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="mt-1 w-full px-3 py-2 border rounded-lg" min={5} />
            </div>

            <div>
              <label className="text-xs text-slate-600">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>

          <div className="flex items-center justify-between gap-3 mt-4">
            <div>
              <button type="button" onClick={doDelete} disabled={deleting} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold">
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
