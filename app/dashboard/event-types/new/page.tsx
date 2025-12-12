// slotly-client/app/dashboard/event-types/new/page.tsx
"use client";

import React, { useState } from "react";
import { createEventType } from "@/lib/eventApi";
import { useRouter } from "next/navigation";

export default function NewEventTypePage() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Title required");
      return;
    }
    setSubmitting(true);
    try {
      const item = await createEventType({ title: title.trim(), duration_minutes: duration, description });
      // redirect to edit page for final editing
      router.push(`/dashboard/event-types/${item.slug}/edit`);
    } catch (e: any) {
      alert("Create failed: " + (e.message || e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create Event Type</h2>

      <div className="space-y-4 bg-white p-6 rounded-xl border">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded w-full" placeholder="Intro Call" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="border p-2 rounded">
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={45}>45</option>
            <option value={60}>60</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (optional)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="border p-2 rounded w-full" placeholder="Short instructions for guests" />
        </div>

        <div className="flex justify-end">
          <button onClick={handleCreate} disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">
            {submitting ? "Creating…" : "Create & Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}
