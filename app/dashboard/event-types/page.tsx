// slotly-client/app/dashboard/event-types/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import EventTypeCard from "@/components/dashboard/EventTypeCard";
import { EventType, listEventTypes, deleteEventType } from "@/lib/eventApi";

export default function DashboardEventTypes() {
  const [items, setItems] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listEventTypes()
      .then((data) => { if (mounted) setItems(data); })
      .catch((e: any) => { if (mounted) setErr(e.message || String(e)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this event type? This cannot be undone.")) return;
    setDeleting(slug);
    try {
      await deleteEventType(slug);
      setItems((s) => s.filter((x) => x.slug !== slug));
    } catch (e: any) {
      alert("Delete failed: " + (e.message || e));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Event Types</h1>
          <p className="text-gray-500">Create and manage your meeting types (Intro call, Demo, etc.).</p>
        </div>

        <Link href="/dashboard/event-types/new" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow">
          Create Event Type
        </Link>
      </div>

      {loading && <div className="p-6 bg-white rounded">Loading…</div>}
      {err && <div className="p-4 bg-red-50 text-red-700 rounded">{err}</div>}

      {!loading && items.length === 0 && (
        <div className="p-6 bg-white rounded">No event types yet. Create one to get started.</div>
      )}

      <div className="space-y-4 mt-6">
        {items.map((it) => (
          <EventTypeCard
            key={it.slug}
            title={it.title}
            duration={it.duration_minutes}
            slug={it.slug}
            description={it.description || ""}
            active={it.active ?? true}
            onDelete={() => handleDelete(it.slug)}
          />
        ))}
      </div>
    </div>
  );
}
