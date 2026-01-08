"use client";

import React, { useEffect, useState } from "react";
import { getEventType, updateEventType } from "@/lib/eventApi";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type MeetingMode = "google_meet" | "in_person";

export default function EditEventType({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [meetingMode, setMeetingMode] = useState<MeetingMode>("google_meet");
  const [location, setLocation] = useState("");

  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const needsLocation = meetingMode === "in_person";

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    if (!id || Number.isNaN(id)) {
      toast({ title: "Invalid event", description: "Event ID is invalid.", variant: "error" });
      router.push("/dashboard/event-types");
      return;
    }

    getEventType(id)
      .then((x) => {
        if (!x) throw new Error("Not found");
        if (!mounted) return;

        setItem(x);
        setTitle(x.title || "");
        setMeetingMode((x.meeting_mode as MeetingMode) || "google_meet");
        setLocation(x.location || "");
      })
      .catch(() => {
        toast({ title: "Event not found", description: "The requested event type does not exist or was removed.", variant: "error" });
        router.push("/dashboard/event-types");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSave = async () => {
    const cleanTitle = title.trim();
    const cleanLocation = location.trim();

    if (!cleanTitle) {
      toast({ title: "Title required", description: "Please enter a title.", variant: "error" });
      return;
    }
    if (needsLocation && !cleanLocation) {
      toast({ title: "Location required", description: "Please enter a location for in-person meeting.", variant: "error" });
      return;
    }

    setSaving(true);
    try {
      const updated = await updateEventType(id, {
        title: cleanTitle,
        meeting_mode: meetingMode,
        location: needsLocation ? cleanLocation : "",
      });

      setItem(updated);
      toast({ title: "Saved", description: "Event type updated successfully.", variant: "success" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message || String(e) || "Unable to save changes. Please try again.", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading event type…</div>;

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Event Type</h1>
          <p className="text-sm text-gray-500 mt-1">Update title and meeting settings.</p>
        </div>

        <div className="mt-4 md:mt-0 text-sm">
          <span className="text-gray-500">Public Link:</span>{" "}
          <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">
            /publicbook/{item?.slug}
          </code>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter a name for this event"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting type</label>
          <select
            value={meetingMode}
            onChange={(e) => setMeetingMode(e.target.value as MeetingMode)}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="google_meet">Google Meet</option>
            <option value="in_person">In-person meeting</option>
          </select>
        </div>

        {needsLocation && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Office address + Maps link"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-gray-500">ID: {item?.id ?? "—"}</div>

          <div className="flex gap-3">
            <button onClick={() => router.push("/dashboard/event-types")} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition">
              Back
            </button>

            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition disabled:opacity-50">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
