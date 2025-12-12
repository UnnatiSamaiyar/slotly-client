// slotly-client/components/dashboard/EventTypeCard.tsx
"use client";

import React from "react";
import Link from "next/link";

type Props = {
  title: string;
  duration: number;
  slug: string;
  description?: string | null;
  active?: boolean;
  onDelete?: () => void;
};

export default function EventTypeCard({ title, duration, slug, description, active = true, onDelete }: Props) {
  const publicUrl = `/bookings/${slug}`;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold bg-gradient-to-br from-indigo-500 to-blue-500">
          {title.slice(0, 1).toUpperCase()}
        </div>

        <div>
          <div className="text-lg font-semibold">{title} { !active && (<span className="text-xs text-red-500 ml-2">inactive</span>)}</div>
          <div className="text-sm text-gray-500">{duration} minutes</div>
          {description && <div className="text-sm text-gray-400 mt-1">{description}</div>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href={publicUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">Public</Link>
        <Link href={`/dashboard/event-types/${slug}/edit`} className="text-sm text-indigo-600">Edit</Link>
        <button onClick={onDelete} className="text-sm text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  );
}
