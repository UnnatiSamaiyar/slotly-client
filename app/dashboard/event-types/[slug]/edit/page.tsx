"use client";

import React, { useEffect, useMemo, useState } from "react";
import { listEventTypes, updateEventType } from "@/lib/eventApi";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import AvailabilityEditorModal from "../../../components/Schedule/AvailabilityEditorModal";

type MeetingMode = "google_meet" | "in_person";

type ScheduleProfile = {
  profile_slug: string;
  timezone: string;
  duration_minutes: number;
  availability_json: string | null;
  buffer_before_minutes: number;
  buffer_after_minutes: number;
  min_notice_minutes: number;
  max_days_ahead: number;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.slotly.io").replace(/\/+$/, "");

function getUserSub(): string | null {
  if (typeof window === "undefined") return null;
  const keysToTry = ["user_sub", "slotly_user", "user", "auth_user", "slotlyUser"];
  for (const key of keysToTry) {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) continue;
      if (key === "user_sub") return saved;
      if (saved === "null" || saved === "undefined") continue;
      const parsed = JSON.parse(saved);
      const sub =
        (parsed as any)?.sub || (parsed as any)?.user_sub || (parsed as any)?.google_sub;
      if (typeof sub === "string" && sub.trim()) return sub.trim();
      const nested = (parsed as any)?.user?.sub || (parsed as any)?.profile?.sub;
      if (typeof nested === "string" && nested.trim()) return nested.trim();
    } catch {
      // ignore
    }
  }
  return null;
}

async function fetchScheduleBySlug(profileSlug: string): Promise<ScheduleProfile> {
  const userSub = getUserSub();
  if (!userSub) throw new Error("Missing user_sub in browser storage");
  const res = await fetch(
    `${API_BASE}/schedule/profile/${encodeURIComponent(profileSlug)}?user_sub=${encodeURIComponent(userSub)}`
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function updateScheduleBySlug(
  profileSlug: string,
  patch: Partial<ScheduleProfile>
): Promise<ScheduleProfile> {
  const userSub = getUserSub();
  if (!userSub) throw new Error("Missing user_sub in browser storage");
  const res = await fetch(
    `${API_BASE}/schedule/profile/${encodeURIComponent(profileSlug)}?user_sub=${encodeURIComponent(userSub)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function EditEventType({ params }: { params: { slug: string } }) {
  const slug = String(params?.slug || "").trim();

  const [item, setItem] = useState<any | null>(null);
  const [schedule, setSchedule] = useState<ScheduleProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [meetingMode, setMeetingMode] = useState<MeetingMode>("google_meet");
  const [location, setLocation] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [availabilityJson, setAvailabilityJson] = useState<string>("{}");
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const needsLocation = meetingMode === "in_person";

  const publicLink = useMemo(() => {
    const s = item?.slug || slug;
    return `/publicbook/${s}`;
  }, [item?.slug, slug]);

  useEffect(() => {
    let mounted = true;

    if (!slug) {
      toast({ title: "Invalid event", description: "Event slug is missing.", variant: "error" });
      router.push("/dashboard/event-types");
      return;
    }

    setLoading(true);

    (async () => {
      try {
        const userSub = getUserSub();
        if (!userSub) throw new Error("Missing user session. Please login again.");

        // ✅ Correct API: list + find by slug (no numeric id mismatch)
        const all = await listEventTypes();
        const found = all.find((x: any) => String(x.slug || "") === slug);
        if (!found) throw new Error("Not found");

        const prof = await fetchScheduleBySlug(slug);

        if (!mounted) return;
        setItem(found);
        setTitle(found.title || "");
        setMeetingMode((found.meeting_mode as MeetingMode) || "google_meet");
        setLocation(found.location || "");
        setAvailabilityJson(found.availability_json || "{}");

        setSchedule(prof);
        setDurationMinutes(Number(prof?.duration_minutes || 15));
      } catch (e: any) {
        if (!mounted) return;
        toast({
          title: "Event not found",
          description: e?.message || "The requested event type does not exist or was removed.",
          variant: "error",
        });
        router.push("/dashboard/event-types");
      } finally {
        mounted && setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleSave = async () => {
    const cleanTitle = title.trim();
    const cleanLocation = location.trim();

    if (!cleanTitle) {
      toast({ title: "Title required", description: "Please enter a title.", variant: "error" });
      return;
    }
    if (needsLocation && !cleanLocation) {
      toast({
        title: "Location required",
        description: "Please enter a location for in-person meeting.",
        variant: "error",
      });
      return;
    }
    if (!item?.id) {
      toast({ title: "Save failed", description: "Missing event type id.", variant: "error" });
      return;
    }

    setSaving(true);
    try {
      const updated = await updateEventType(Number(item.id), {
        title: cleanTitle,
        meeting_mode: meetingMode,
        location: needsLocation ? cleanLocation : "",
        availability_json: availabilityJson || "{}",
      });

      const safeDur = Math.max(5, Math.min(24 * 60, Number(durationMinutes || 15)));
      const updatedSchedule = await updateScheduleBySlug(updated.slug, {
        duration_minutes: safeDur,
      } as any);

      setItem(updated);
      setSchedule(updatedSchedule);

      if (String(updated.slug) !== slug) {
        router.replace(`/dashboard/event-types/${updated.slug}/edit`);
      }

      toast({ title: "Saved", description: "Event type updated successfully.", variant: "success" });
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

  if (loading) return <div className="p-10 text-center text-gray-500">Loading event type…</div>;

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Event Type</h1>
          <p className="text-sm text-gray-500 mt-1">Update title, duration, availability, and meeting settings.</p>
        </div>

        <div className="mt-4 md:mt-0 text-sm">
          <span className="text-gray-500">Public Link:</span>{" "}
          <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">{publicLink}</code>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              min={5}
              max={24 * 60}
              step={5}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 15)}
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">Default is 15 minutes. Use 5-minute steps.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <button
              type="button"
              onClick={() => setAvailabilityOpen(true)}
              className="w-full p-3 border rounded-lg bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-left"
            >
              Set availability
              <span className="text-xs text-gray-500 block mt-0.5">Weekly hours, date overrides, and time blocks</span>
            </button>
          </div>
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
            <button
              onClick={() => router.push("/dashboard/event-types")}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Back
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <AvailabilityEditorModal
        open={availabilityOpen}
        initialAvailabilityJson={availabilityJson && availabilityJson !== "{}" ? availabilityJson : null}
        onClose={() => setAvailabilityOpen(false)}
        onSave={(json) => {
          setAvailabilityJson(json || "{}");
          setAvailabilityOpen(false);
        }}
      />
    </div>
  );
}