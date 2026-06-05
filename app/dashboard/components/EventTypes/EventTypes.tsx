"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import EventTypeCard from "./EventTypeCard";
import CreateEventTypeModal from "./CreateEventTypeModal";
// import EditEventTypeModal from "./EditEventTypeModal";
import { useEventTypes } from "../../hooks/useEventTypes";

import { EventType } from "../../types";

function CreateEventTypeCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[132px] h-full w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white px-4 py-4 text-center shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-[0_18px_45px_rgba(79,70,229,0.12)] focus:outline-none focus:ring-4 focus:ring-indigo-100"
      aria-label="Create event type"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-inner transition-all duration-200 group-hover:border-indigo-200 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm">
        <Plus className="h-5 w-5" strokeWidth={2.4} />
      </span>

      <span className="mt-3 block text-[15px] font-semibold leading-5 text-slate-950">
        Create Event Type
      </span>
      <span className="mt-1.5 block max-w-[260px] text-sm leading-5 text-slate-500">
        Add a new booking page for your schedule
      </span>
    </button>
  );
}

export default function EventTypesPanel({ userSub }: { userSub: string | null }) {
  const router = useRouter();
  const { items, loading, error, create, update, remove } = useEventTypes(userSub);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<EventType | null>(null);

  useEffect(() => {
    const openCreateFromTopbar = () => {
      setEditing(null);
      setCreateOpen(true);
    };

    window.addEventListener("slotly-open-create-event", openCreateFromTopbar);

    return () => {
      window.removeEventListener("slotly-open-create-event", openCreateFromTopbar);
    };
  }, []);


  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }, [items]);

  const visibleItems = useMemo(() => {
    return sorted.slice(0, 3);
  }, [sorted]);

  const shouldShowCreateCard = !loading && !error && sorted.length < 3;

  // useEffect(() => {
  //   const handler = () => setCreateOpen(true);
  //   window.addEventListener("slotly-open-create-event", handler);
  //   return () => window.removeEventListener("slotly-open-create-event", handler);
  // }, []);

  return (
    <section data-tour="dashboard-event-types" className="mb-0 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="border-b border-slate-100 bg-gradient-to-r from-white via-white to-indigo-50/40 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h4 className="truncate text-base font-semibold leading-none text-slate-950">
                Event Types
              </h4>
              <span className="inline-flex h-5 min-w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 px-2 text-[11px] font-semibold text-indigo-600">
                {items.length}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Manage booking pages, durations, and public scheduling links.
            </p>
          </div>

          {!loading && (
            <button
              type="button"
              onClick={() => router.push("/dashboard/event-types")}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              View all
            </button>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4">
        {loading && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="min-h-[132px] animate-pulse rounded-[22px] border border-slate-100 bg-slate-50"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((it) => (
              <EventTypeCard
                key={it.id}
                item={it}
                onEdit={(i) => {
                  setCreateOpen(false);
                  setEditing(i);
                }}
              />
            ))}

            {shouldShowCreateCard && (
              <CreateEventTypeCard
  onClick={() => {
    setEditing(null);
    setCreateOpen(true);
  }}
/>
            )}
          </div>
        )}

        <CreateEventTypeModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          userSub={userSub}
          onCreate={async (payload) => {
            await create(payload);
            setCreateOpen(false);
          }}
        />

        <CreateEventTypeModal
          open={!!editing}
          mode="edit"
          item={editing}
          userSub={userSub}
          onClose={() => setEditing(null)}
          onUpdate={async (id, payload) => {
            await update(id, payload);
            setEditing(null);
          }}
        />
      </div>
    </section>
  );
}
