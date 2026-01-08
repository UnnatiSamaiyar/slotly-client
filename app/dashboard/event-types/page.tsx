"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EventType, listEventTypes, deleteEventType } from "@/lib/eventApi";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Video } from "lucide-react";

export default function DashboardEventTypes() {
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

  const [items, setItems] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    listEventTypes()
      .then((data) => {
        if (mounted) setItems(data);
      })
      .catch((e: any) => {
        if (mounted) setErr(e.message || String(e));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    const ok = await confirmToast("Delete this event type?", "This cannot be undone.");
    if (!ok) {
      toast({ title: "Cancelled", description: "Event type was not deleted.", variant: "default" });
      return;
    }

    setDeletingId(id);
    try {
      await deleteEventType(id);
      setItems((s) => s.filter((x) => x.id !== id));
      toast({ title: "Deleted", description: "Event type removed.", variant: "success" });
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: e?.message || String(e) || "Unable to delete. Please try again.",
        variant: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Event Types</h1>
          <p className="text-gray-500">Create and manage your meeting types (Google Meet, In-person).</p>
        </div>

        <Link
          href="/dashboard/event-types/new"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow"
        >
          Create Event Type
        </Link>
      </div>

      {loading && <div className="p-6 bg-white rounded">Loading…</div>}
      {err && <div className="p-4 bg-red-50 text-red-700 rounded">{err}</div>}

      {!loading && items.length === 0 && (
        <div className="p-6 bg-white rounded">No event types yet. Create one to get started.</div>
      )}

      <div className="space-y-4 mt-6">
        {items.map((it) => {
          const isMeet = it.meeting_mode === "google_meet";
          return (
            <div
              key={it.id}
              className="bg-white border rounded-xl p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    {isMeet ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{it.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {isMeet ? "Google Meet" : "In-person meeting"}
                      {!isMeet && it.location ? (
                        <span className="ml-2 text-gray-400">• {it.location}</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  <span className="text-gray-500">Public Link:</span>{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">
                    /publicbook/{it.slug}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/dashboard/event-types/${it.id}/edit`}
                  className="px-3 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(it.id)}
                  disabled={deletingId === it.id}
                  className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deletingId === it.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
