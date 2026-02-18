"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, LogOut, ChevronDown } from "lucide-react";
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
    <header className="mb-6">
      {/* Desktop header (sm+) */}
      <div className="hidden sm:flex items-center justify-between gap-6">
        {/* Left */}
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-slate-900">
            Your Schedule
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Search and manage your meetings quickly.
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 shrink-0">

          {/* Search (responsive width) */}
          <div className="relative w-64 md:w-72 lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events…"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white
                   shadow-sm focus:outline-none focus:ring-2 
                   focus:ring-indigo-500/20 focus:border-indigo-300 transition"
            />
          </div>

        
          <TimezonePicker compact />

          {/* Profile */}
          <div className="relative" ref={profileWrapRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
                   hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
            >
              <img
                src={avatarSrc}
                alt="me"
                className="h-9 w-9 rounded-full object-cover"
              />
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="text-sm font-semibold truncate">
                    {(user as any)?.name || "User"}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {(user as any)?.email || ""}
                  </div>
                </div>

                <button
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

      {/* Mobile header (below sm) */}
      <div className="flex flex-col gap-4 sm:hidden">
        {/* Title */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Your Schedule
          </h2>
        </div>

        {/* Search full width */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events…"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white
                 shadow-sm focus:outline-none focus:ring-2 
                 focus:ring-indigo-500/20 focus:border-indigo-300 transition"
          />
        </div>

        {/* Timezone + Profile */}
        <div className="flex items-center justify-between">
          <TimezonePicker compact />

          <div className="relative" ref={profileWrapRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
                   hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
            >
              <img
                src={avatarSrc}
                alt="me"
                className="h-9 w-9 rounded-full object-cover"
              />
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Search row */}
      {/* <div className="mt-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events…"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className={[
              "w-full h-11 pl-9 pr-3 rounded-2xl border border-slate-200 bg-white",
              "shadow-[0_1px_0_rgba(15,23,42,0.04)]",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition",
            ].join(" ")}
          />
        </div>
      </div> */}
    </header>
  );
}








// "use client";

// import { Search } from "lucide-react";
// import { DButton } from "../../../../components/ui/DButton.tsx";

// export default function Topbar() {
//   return (
//     <div className="sticky top-0 z-30 bg-white border-b border-slate-200">
//       <div className="h-16 px-8 flex items-center justify-between gap-6">
//         {/* Left */}
//         <div className="flex items-center gap-3 text-slate-800 font-semibold">
//           Dashboard
//         </div>

//         {/* Center Search */}
//         <div className="flex-1 max-w-xl">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <input
//               placeholder="Search events, people…"
//               className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
//             />
//           </div>
//         </div>

//         {/* Right actions */}
//         <div className="flex items-center gap-3">
//           <DButton variant="ghost">Help</DButton>
//           <DButton variant="primary">Create event</DButton>
//         </div>
//       </div>
//     </div>
//   );
// }
