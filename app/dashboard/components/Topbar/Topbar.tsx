"use client";

import React from "react";
import { BellRing, Search } from "lucide-react";
import { UserProfile } from "../../types";

export default function Topbar({
  user,
  searchQuery,
  onSearchQueryChange,
}: {
  user: UserProfile | null;
  searchQuery: string;
  onSearchQueryChange: (v: string) => void;
}) {
  return (
    <header className="flex items-start justify-between mb-6 gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Your Schedule</h2>
        <p className="text-sm text-gray-500">
          Search and manage your meetings quickly.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events…"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white w-72"
          />
        </div>

        <button className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
          <BellRing className="w-5 h-5 text-slate-700" />
        </button>

        <div className="flex items-center gap-3 pl-2">
          <img
  src={
    (user as any)?.avatarUrl ||
    (user as any)?.avatar_url ||
    (user as any)?.picture ||
    "/menwithtab.png"
  }
  alt="me"
  className="w-9 h-9 rounded-full shadow-sm object-cover"
  referrerPolicy="no-referrer"
  onError={(e) => {
    (e.currentTarget as HTMLImageElement).src = "/menwithtab.png";
  }}
/>

          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{(user as any)?.name}</div>
            <div className="text-xs text-gray-500 truncate">{(user as any)?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
