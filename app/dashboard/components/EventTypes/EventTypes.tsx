// // // src/app/dashboard/components/EventTypes/EventTypes.tsx
// // "use client";

// // import React, { useMemo, useState } from "react";
// // import EventTypeCard from "./EventTypeCard";
// // import CreateEventTypeModal from "./CreateEventTypeModal";
// // import EditEventTypeModal from "./EditEventTypeModal";
// // import { useEventTypes } from "../../hooks/useEventTypes";
// // import { EventType } from "../../types";
// // import { PlusCircle } from "lucide-react";

// // export default function EventTypesPanel({ userSub }: { userSub: string | null }) {
// //   const { items, loading, error, create, update, remove } = useEventTypes(userSub);
// //   const [createOpen, setCreateOpen] = useState(false);
// //   const [editing, setEditing] = useState<EventType | null>(null);

// //   const sorted = useMemo(() => {
// //     return [...items].sort((a, b) => (a.title || "").localeCompare(b.title));
// //   }, [items]);

// //   return (
// //     <section className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
// //       <div className="p-4 sm:p-6">
// //         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
// //           <div className="min-w-0">
// //             <div className="flex items-center gap-2 min-w-0">
// //               <h4 className="font-semibold text-base sm:text-lg truncate">
// //                 Event Types
// //               </h4>
// //               <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
// //                 {items.length}
// //               </span>
// //             </div>
// //             <div className="text-sm text-slate-500 mt-0.5">
// //               Quick links to create and edit your event types.
// //             </div>
// //           </div>

// //           <button
// //             type="button"
// //             onClick={() => setCreateOpen(true)}
// //             className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition w-full sm:w-auto"
// //           >
// //             <PlusCircle className="w-4 h-4 shrink-0" />
// //             <span className="truncate">Create Event Type</span>
// //           </button>
// //         </div>

// //         <div className="space-y-3">
// //           {loading && <div className="text-sm text-slate-500">Loading…</div>}
// //           {error && <div className="text-sm text-red-600 break-words">{error}</div>}

// //           {!loading && sorted.length === 0 && (
// //             <div className="text-sm text-slate-600 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50">
// //               No event types yet. Create one to start accepting bookings.
// //             </div>
// //           )}

// //           {sorted.map((it) => (
// //             <EventTypeCard key={it.id} item={it} onEdit={(i) => setEditing(i)} />
// //           ))}
// //         </div>

// //         <CreateEventTypeModal
// //           open={createOpen}
// //           onClose={() => setCreateOpen(false)}
// //           userSub={userSub}
// //           onCreate={async (payload) => {
// //             await create(payload);
// //           }}
// //         />

// //         <EditEventTypeModal
// //           open={!!editing}
// //           item={editing}
// //           onClose={() => setEditing(null)}
// //           onUpdate={async (id, payload) => {
// //             await update(id, payload);
// //           }}
// //           onDelete={async (id) => {
// //             await remove(id);
// //           }}
// //         />
// //       </div>
// //     </section>
// //   );
// // }


// // "use client";

// // import React, { useMemo, useState } from "react";
// // import EventTypeCard from "./EventTypeCard";
// // import CreateEventTypeModal from "./CreateEventTypeModal";
// // import EditEventTypeModal from "./EditEventTypeModal";
// // import { useEventTypes } from "../../hooks/useEventTypes";
// // import { EventType } from "../../types";
// // import { PlusCircle } from "lucide-react";

// // export default function EventTypesPanel({ userSub }: { userSub: string | null }) {
// //   const { items, loading, error, create, update, remove } = useEventTypes(userSub);
// //   const [createOpen, setCreateOpen] = useState(false);
// //   const [editing, setEditing] = useState<EventType | null>(null);

// //   const sorted = useMemo(() => {
// //     return [...items].sort((a, b) => (a.title || "").localeCompare(b.title));
// //   }, [items]);

// //   return (
// //     <section className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 max-h-[680px] overflow-y-auto">
// //       <div className="p-4 sm:p-6">
// //         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
// //           <div className="min-w-0">
// //             <div className="flex items-center gap-2 min-w-0">
// //               <h4 className="font-semibold text-base sm:text-lg truncate">
// //                 Event Types
// //               </h4>
// //               <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
// //                 {items.length}
// //               </span>
// //             </div>
// //             <div className="text-sm text-slate-500 mt-0.5">
// //               Quick links to create and edit your event types.
// //             </div>
// //           </div>

// //           <button
// //             type="button"
// //             onClick={() => setCreateOpen(true)}
// //             className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition w-full sm:w-auto"
// //           >
// //             <PlusCircle className="w-4 h-4 shrink-0" />
// //             <span className="truncate">Create Event Type</span>
// //           </button>
// //         </div>

// //         <div className="space-y-3">
// //           {loading && <div className="text-sm text-slate-500">Loading…</div>}

// //           {error && (
// //             <div className="text-sm text-red-600 break-words">{error}</div>
// //           )}

// //           {!loading && sorted.length === 0 && (
// //             <div className="text-sm text-slate-600 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50">
// //               No event types yet. Create one to start accepting bookings.
// //             </div>
// //           )}

// //           {sorted.map((it) => (
// //             <EventTypeCard
// //               key={it.id}
// //               item={it}
// //               onEdit={(i) => setEditing(i)}
// //             />
// //           ))}
// //         </div>

// //         <CreateEventTypeModal
// //           open={createOpen}
// //           onClose={() => setCreateOpen(false)}
// //           userSub={userSub}
// //           onCreate={async (payload) => {
// //             await create(payload);
// //           }}
// //         />

// //         <EditEventTypeModal
// //           open={!!editing}
// //           item={editing}
// //           onClose={() => setEditing(null)}
// //           onUpdate={async (id, payload) => {
// //             await update(id, payload);
// //           }}
// //           onDelete={async (id) => {
// //             await remove(id);
// //           }}
// //         />
// //       </div>
// //     </section>
// //   );
// // }



// "use client";

// import React, { useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import EventTypeCard from "./EventTypeCard";
// import CreateEventTypeModal from "./CreateEventTypeModal";
// import EditEventTypeModal from "./EditEventTypeModal";
// import { useEventTypes } from "../../hooks/useEventTypes";
// import { EventType } from "../../types";
// import { PlusCircle, ArrowRight } from "lucide-react";

// export default function EventTypesPanel({ userSub }: { userSub: string | null }) {
//   const router = useRouter();
//   const { items, loading, error, create, update, remove } = useEventTypes(userSub);
//   const [createOpen, setCreateOpen] = useState(false);
//   const [editing, setEditing] = useState<EventType | null>(null);

//   const sorted = useMemo(() => {
//     return [...items].sort((a, b) => (a.title || "").localeCompare(b.title));
//   }, [items]);

//   const visibleItems = useMemo(() => {
//     return sorted.slice(0, 3);
//   }, [sorted]);

//   return (
//     <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
//       <div className="p-4 sm:p-5">
//         <div className="mb-4">
//           <div className="flex items-center justify-between gap-3">
//             <div className="min-w-0 flex items-center gap-2">
//               <h4 className="text-[17px] font-semibold leading-none text-slate-900">
//                 Event Types
//               </h4>
//               <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 text-[11px] font-medium text-slate-600">
//                 {items.length}
//               </span>
//               <button
//                 type="button"
//                 onClick={() => setCreateOpen(true)}
//                 className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:shrink-0"
//               >
//                 <PlusCircle className="h-4 w-4 shrink-0" />
//                 <span>Create Event Type</span>
//               </button>
//             </div>
//           </div>

//           <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <p className="max-w-[220px] text-sm leading-5 text-slate-500">
//               Quick links to create and edit your event types.
//             </p>

//           </div>
//         </div>

//         <div className="space-y-3">
//           {loading && <div className="text-sm text-slate-500">Loading…</div>}

//           {error && (
//             <div className="break-words text-sm text-red-600">{error}</div>
//           )}

//           {!loading && sorted.length === 0 && (
//             <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
//               No event types yet. Create one to start accepting bookings.
//             </div>
//           )}

//           {visibleItems.map((it) => (
//             <EventTypeCard
//               key={it.id}
//               item={it}
//               onEdit={(i) => setEditing(i)}
//             />
//           ))}
//         </div>

//         {!loading && sorted.length > 3 && (
//           <div className="mt-4">
//             <button
//               type="button"
//               onClick={() => router.push("/dashboard/event-types")}
//               className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
//             >
//               View all
//               <ArrowRight className="h-4 w-4 shrink-0" />
//             </button>
//           </div>
//         )}

//         <CreateEventTypeModal
//           open={createOpen}
//           onClose={() => setCreateOpen(false)}
//           userSub={userSub}
//           onCreate={async (payload) => {
//             await create(payload);
//           }}
//         />

//         <EditEventTypeModal
//           open={!!editing}
//           item={editing}
//           onClose={() => setEditing(null)}
//           onUpdate={async (id, payload) => {
//             await update(id, payload);
//           }}
//           onDelete={async (id) => {
//             await remove(id);
//           }}
//         />
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import EventTypeCard from "./EventTypeCard";
import CreateEventTypeModal from "./CreateEventTypeModal";
import EditEventTypeModal from "./EditEventTypeModal";
import { useEventTypes } from "../../hooks/useEventTypes";
import { EventType } from "../../types";
import { PlusCircle, ArrowRight } from "lucide-react";

export default function EventTypesPanel({ userSub }: { userSub: string | null }) {
  const router = useRouter();
  const { items, loading, error, create, update, remove } = useEventTypes(userSub);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<EventType | null>(null);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (a.title || "").localeCompare(b.title));
  }, [items]);

  const visibleItems = useMemo(() => {
    return sorted.slice(0, 3);
  }, [sorted]);

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <h4 className="text-[18px] font-semibold leading-none text-slate-900 whitespace-nowrap">
                Event Types
              </h4>
              <span className="inline-flex h-6 min-w-8 items-center justify-center rounded-full bg-slate-100 px-2 text-[11px] font-medium text-slate-600">
                {items.length}
              </span>
            </div>

           
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-2 shrink-0" />
            <span>Create Event Type</span>
          </button>
        </div>
        <p className="mt-2 max-w-[250px] text-sm leading-5 text-slate-500">
          Quick links to create and edit your event types.
        </p>
        <div className="space-y-3">
          {loading && <div className="text-sm text-slate-500">Loading…</div>}

          {error && (
            <div className="break-words text-sm text-red-600">{error}</div>
          )}

          {!loading && sorted.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              No event types yet. Create one to start accepting bookings.
            </div>
          )}

          {visibleItems.map((it) => (
            <EventTypeCard
              key={it.id}
              item={it}
              onEdit={(i) => setEditing(i)}
            />
          ))}
        </div>

        {!loading && sorted.length > 3 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/event-types")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              View all
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        )}

        <CreateEventTypeModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          userSub={userSub}
          onCreate={async (payload) => {
            await create(payload);
          }}
        />

        <EditEventTypeModal
          open={!!editing}
          item={editing}
          onClose={() => setEditing(null)}
          onUpdate={async (id, payload) => {
            await update(id, payload);
          }}
          onDelete={async (id) => {
            await remove(id);
          }}
        />
      </div>
    </section>
  );
}