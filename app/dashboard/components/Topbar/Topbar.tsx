// src/app/dashboard/components/Topbar/Topbar.tsx
"use client";
import React from "react";
import { BellRing } from "lucide-react";
import { UserProfile } from "../../types";

export default function Topbar({ user }: { user: UserProfile | null }) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-semibold">Your Schedule</h2>
        <p className="text-sm text-gray-500">
          Overview of upcoming meetings and availability
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events"
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
          />
        </div>
        <button className="p-2 rounded-md hover:bg-gray-100">
          <BellRing className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <img
            src={user?.avatarUrl || "/menwithtab.png"}
            alt="me"
            className="w-9 h-9 rounded-full shadow-sm object-cover"
          />
          <div className="text-sm font-semibold">{user?.name}</div>

          <div className="text-xs text-gray-500">
            {user?.username} • {user?.email}
          </div>

          {user?.profile_title && (
            <div className="text-xs text-gray-500">
              {user.profile_title} {user.host_name ? `• ${user.host_name}` : ""}
            </div>
          )}

          {user?.timezone && (
            <div className="text-xs text-gray-400">{user.timezone}</div>
          )}
        </div>
      </div>
    </header>
  );
}
