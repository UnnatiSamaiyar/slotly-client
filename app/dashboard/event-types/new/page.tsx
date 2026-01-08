"use client";

import React, { useState } from "react";
import { createEventType } from "@/lib/eventApi";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type MeetingMode = "google_meet" | "in_person";

export default function NewEventTypePage() {
  const [title, setTitle] = useState("");
  const [meetingMode, setMeetingMode] = useState<MeetingMode>("google_meet");
  const [location, setLocation] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const needsLocation = meetingMode === "in_person";

  const handleCreate = async () => {
    const cleanTitle = title.trim();
    const cleanLocation = location.trim();

    if (!cleanTitle) {
      toast({ title: "Title required", description: "Please enter a title to continue.", variant: "error" });
      return;
    }
    if (needsLocation && !cleanLocation) {
      toast({ title: "Location required", description: "Please enter a location for in-person meeting.", variant: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const item = await createEventType({
        title: cleanTitle,
        meeting_mode: meetingMode,
        location: needsLocation ? cleanLocation : "",
        availability_json: "{}",
      });

      toast({ title: "Created", description: "Event type created successfully.", variant: "success" });
      router.push(`/dashboard/event-types/${item.id}/edit`);
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message || String(e) || "Unable to create. Please try again.", variant: "error" });
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
          <label className="block text-sm font-medium mb-1">Meeting type</label>
          <select value={meetingMode} onChange={(e) => setMeetingMode(e.target.value as MeetingMode)} className="border p-2 rounded w-full">
            <option value="google_meet">Google Meet</option>
            <option value="in_person">In-person meeting</option>
          </select>
        </div>

        {needsLocation && (
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="border p-2 rounded w-full" placeholder="Office address + Maps link" />
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={handleCreate} disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
            {submitting ? "Creating…" : "Create & Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}
