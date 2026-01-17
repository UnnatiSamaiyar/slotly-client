"use client";

import React, { useEffect, useRef, useState } from "react";
import { BellRing, Search, LogOut, ChevronDown } from "lucide-react";
import { UserProfile } from "../../types";
import TimezonePicker from "../TimezonePicker";

export default function Topbar({
  user,
  searchQuery,
  onSearchQueryChange,
}: {
  user: UserProfile | null;
  searchQuery: string;
  onSearchQueryChange: (v: string) => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!profileWrapRef.current) return;
      if (!profileWrapRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setProfileOpen(false);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      document.cookie = "access_token=; Max-Age=0; path=/";
      document.cookie = "refresh_token=; Max-Age=0; path=/";
      document.cookie = "token=; Max-Age=0; path=/";

      window.location.href = "/login";
    } catch (e) {
      console.error("Logout failed:", e);
      window.location.href = "/login";
    }
  };

  const avatarSrc =
    (user as any)?.avatarUrl ||
    (user as any)?.avatar_url ||
    (user as any)?.picture ||
    "/menwithtab.png";

  return (
    <header className="mb-5">
      {/* ✅ Desktop header (sm+) */}
      <div className="hidden sm:flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 leading-tight">
            Your Schedule
          </h2>
          <p className="mt-1 text-sm text-gray-500 leading-snug">
            Search and manage your meetings quickly.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <TimezonePicker />

          {/* <button
            className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition"
            type="button"
            aria-label="Notifications"
          >
            <BellRing className="h-5 w-5 text-slate-700" />
          </button> */}

          {/* Profile */}
          <div className="relative" ref={profileWrapRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-2 py-1.5 transition"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              title="Profile menu"
            >
              <img
                src={avatarSrc}
                alt="me"
                className="h-9 w-9 rounded-full object-cover shadow-sm"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/menwithtab.png";
                }}
              />

              <div className="hidden lg:block min-w-0 text-left">
                <div className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">
                  {(user as any)?.name || "User"}
                </div>
                <div className="text-xs text-gray-500 truncate max-w-[160px]">
                  {(user as any)?.email || ""}
                </div>
              </div>

              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-60 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-semibold truncate">
                    {(user as any)?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {(user as any)?.email || ""}
                  </div>
                </div>

                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Mobile header (below sm): compact actions row only */}
      <div className="flex sm:hidden items-center justify-between gap-2">
        {/* <div className="text-sm font-semibold text-gray-900 truncate">
          Dashboard
        </div> */}

        <div className="flex items-center gap-2 shrink-0">
          <TimezonePicker compact />

          {/* <button
            className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition"
            type="button"
            aria-label="Notifications"
          >
            <BellRing className="h-5 w-5 text-slate-700" />
          </button> */}

          <div className="relative" ref={profileWrapRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-2 py-1.5 transition"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              title="Profile menu"
            >
              <img
                src={avatarSrc}
                alt="me"
                className="h-9 w-9 rounded-full object-cover shadow-sm"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/menwithtab.png";
                }}
              />
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-60 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-semibold truncate">
                    {(user as any)?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {(user as any)?.email || ""}
                  </div>
                </div>

                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Search row (same for all, but spacing tuned) */}
      <div className="mt-3 sm:mt-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events…"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 bg-white
                       focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
          />
        </div>
      </div>
    </header>
  );
}
