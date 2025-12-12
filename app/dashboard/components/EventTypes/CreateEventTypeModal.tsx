// src/app/dashboard/components/EventTypes/CreateEventTypeModal.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function CreateEventTypeModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: { title: string; duration: number; location?: string; availability_json?: string }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    try {
      await onCreate({ title: title.trim(), duration, location: location.trim(), availability_json: "{}" });
      setTitle("");
      setDuration(30);
      setLocation("");
      onClose();
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" placeholder="e.g. 30-min Meeting" />
            </div>

            <div>
              <label className="text-xs text-slate-600">Duration (minutes)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="mt-1 w-full px-3 py-2 border rounded-lg" min={5} />
            </div>

            <div>
              <label className="text-xs text-slate-600">Location (optional)</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" placeholder="e.g. Google Meet" />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
              {saving ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
