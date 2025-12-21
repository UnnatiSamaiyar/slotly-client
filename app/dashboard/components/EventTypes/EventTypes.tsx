// // src/app/dashboard/components/EventTypes/EventTypes.tsx
// "use client";
// import React from "react";
// import EventTypeCard from "./EventTypeCard";
// import { EventType } from "../../types";

// export default function EventTypes({ items }: { items: EventType[] }) {
//   return (
//     <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
//       <h4 className="font-semibold mb-3">Event Types</h4>
//       <p className="text-sm text-gray-500 mb-4">Quick links to create and edit your event types.</p>
//       <div className="space-y-3">
//         {items.map(it => <EventTypeCard key={it.id} item={it} />)}
//       </div>
//       <button className="mt-6 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">Create Event Type</button>
//     </div>
//   );
// }











// src/app/dashboard/components/EventTypes/EventTypes.tsx
"use client";
<<<<<<< HEAD
=======

>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
import React, { useMemo, useState } from "react";
import EventTypeCard from "./EventTypeCard";
import CreateEventTypeModal from "./CreateEventTypeModal";
import EditEventTypeModal from "./EditEventTypeModal";
import { useEventTypes } from "../../hooks/useEventTypes";
import { EventType } from "../../types";
import { PlusCircle } from "lucide-react";

<<<<<<< HEAD
/**
 * Props:
 * - userSub should be passed from parent (dashboard top-level)
 */
=======
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
export default function EventTypesPanel({ userSub }: { userSub: string | null }) {
  const { items, loading, error, create, update, remove } = useEventTypes(userSub);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<EventType | null>(null);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (a.title || "").localeCompare(b.title));
  }, [items]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
<<<<<<< HEAD
          <h4 className="font-semibold text-lg">Event Types</h4>
          <div className="text-sm text-slate-500">Quick links to create and edit your event types.</div>
        </div>

        <div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow"
          >
            <PlusCircle className="w-4 h-4" />
            Create Event Type
          </button>
        </div>
=======
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">Event Types</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {items.length}
            </span>
          </div>
          <div className="text-sm text-slate-500">
            Quick links to create and edit your event types.
          </div>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          Create Event Type
        </button>
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
      </div>

      <div className="space-y-3">
        {loading && <div className="text-sm text-slate-500">Loading…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

<<<<<<< HEAD
        {(!loading && sorted.length === 0) && (
          <div className="text-sm text-slate-500 p-4 rounded-md bg-slate-50">No event types yet — create one to start accepting bookings.</div>
=======
        {!loading && sorted.length === 0 && (
          <div className="text-sm text-slate-600 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50">
            No event types yet. Create one to start accepting bookings.
          </div>
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
        )}

        {sorted.map((it) => (
          <EventTypeCard key={it.id} item={it} onEdit={(i) => setEditing(i)} />
        ))}
      </div>

      <CreateEventTypeModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={async (payload) => {
          await create(payload);
        }}
      />

      <EditEventTypeModal
        open={!!editing}
        item={editing}
        onClose={() => setEditing(null)}
<<<<<<< HEAD
        onUpdate={async (id, payload) => { await update(id, payload); }}
        onDelete={async (id) => { await remove(id); }}
=======
        onUpdate={async (id, payload) => {
          await update(id, payload);
        }}
        onDelete={async (id) => {
          await remove(id);
        }}
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
      />
    </div>
  );
}
