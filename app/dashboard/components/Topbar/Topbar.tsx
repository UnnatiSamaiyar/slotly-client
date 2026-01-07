// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { BellRing, Search } from "lucide-react";
// import { UserProfile } from "../../types";
// import * as userApi from "../../api/user";
// import { getBrowserTimezone, setPreferredTimezone, getPreferredTimezone } from "../../../../lib/timezone";

// export default function Topbar({
//   user,
//   searchQuery,
//   onSearchQueryChange,
// }: {
//   user: UserProfile | null;
//   searchQuery: string;
//   onSearchQueryChange: (v: string) => void;
// }) {
//   const commonTimezones = useMemo(
//     () => [
//       "Asia/Kolkata",
//       "America/New_York",
//       "Europe/London",
//       "Europe/Berlin",
//       "Asia/Dubai",
//       "Asia/Singapore",
//       "Australia/Sydney",
//     ],
//     []
//   );

//   const initialTz = (user as any)?.timezone || getPreferredTimezone() || getBrowserTimezone();
//   const [tz, setTz] = useState<string>(initialTz);
//   const [savingTz, setSavingTz] = useState(false);

//   // Keep local selector in sync if user profile loads later
//   useEffect(() => {
//     const next = (user as any)?.timezone;
//     if (next && next !== tz) {
//       setTz(next);
//       setPreferredTimezone(next);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [(user as any)?.timezone]);

//   const onTimezoneChange = async (nextTz: string) => {
//     setTz(nextTz);
//     setPreferredTimezone(nextTz);

//     if (!(user as any)?.sub) return;
//     try {
//       setSavingTz(true);
//       await userApi.updateUserTimezone((user as any).sub, nextTz);
//     } catch (e) {
//       // If save fails, keep UI functional with localStorage fallback.
//       // You can wire toast here if desired.
//       console.error(e);
//     } finally {
//       setSavingTz(false);
//     }
//   };

//   return (
//     <header className="flex items-start justify-between mb-6 gap-6">
//       <div>
//         <h2 className="text-2xl font-semibold">Your Schedule</h2>
//         <p className="text-sm text-gray-500">
//           Search and manage your meetings quickly.
//         </p>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="relative">
//           <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//           <input
//             type="text"
//             placeholder="Search events…"
//             value={searchQuery}
//             onChange={(e) => onSearchQueryChange(e.target.value)}
//             className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white w-72"
//           />
//         </div>

//         {/* Timezone selector (Calendly-style display preference) */}
//         <div className="flex flex-col items-end">
//           <label className="text-[11px] text-gray-500 mb-1">Timezone</label>
//           <div className="flex items-center gap-2">
//             <select
//               value={tz}
//               onChange={(e) => onTimezoneChange(e.target.value)}
//               className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm"
//               title="Display timezone"
//             >
//               {/* Always show current value even if not in the common list */}
//               {!commonTimezones.includes(tz) && <option value={tz}>{tz}</option>}
//               {commonTimezones.map((z) => (
//                 <option key={z} value={z}>
//                   {z}
//                 </option>
//               ))}
//             </select>
//             {savingTz && <span className="text-xs text-gray-500">Saving…</span>}
//           </div>
//         </div>

//         <button className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
//           <BellRing className="w-5 h-5 text-slate-700" />
//         </button>

//         <div className="flex items-center gap-3 pl-2">
//           <img
//   src={
//     (user as any)?.avatarUrl ||
//     (user as any)?.avatar_url ||
//     (user as any)?.picture ||
//     "/menwithtab.png"
//   }
//   alt="me"
//   className="w-9 h-9 rounded-full shadow-sm object-cover"
//   referrerPolicy="no-referrer"
//   onError={(e) => {
//     (e.currentTarget as HTMLImageElement).src = "/menwithtab.png";
//   }}
// />

//           <div className="min-w-0">
//             <div className="text-sm font-semibold truncate">{(user as any)?.name}</div>
//             <div className="text-xs text-gray-500 truncate">{(user as any)?.email}</div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
















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
  // ✅ Profile dropdown state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileWrapRef = useRef<HTMLDivElement | null>(null);

  // ✅ Close dropdown on outside click / ESC
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!profileWrapRef.current) return;
      if (!profileWrapRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
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

  // ✅ Logout handler (edit token keys as per your app)
  const handleLogout = async () => {
    try {
      setProfileOpen(false);

      // 1) Clear your local storage tokens (replace keys with yours)
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // (timezone preference keep karna ho to remove mat karo)
      // localStorage.removeItem("preferred_timezone");

      // 2) Clear cookies (basic client-side attempt)
      // If your auth uses HttpOnly cookies, server logout endpoint is required.
      document.cookie = "access_token=; Max-Age=0; path=/";
      document.cookie = "refresh_token=; Max-Age=0; path=/";
      document.cookie = "token=; Max-Age=0; path=/";

      // 3) Redirect
      window.location.href = "/login";
    } catch (e) {
      console.error("Logout failed:", e);
      // fallback redirect
      window.location.href = "/login";
    }
  };

  return (
    <header className="flex items-start justify-between mb-6 gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Your Schedule</h2>
        <p className="text-sm text-gray-500">Search and manage your meetings quickly.</p>
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

        {/* Timezone selector (browser + localStorage; not stored in DB) */}
        <TimezonePicker />

        <button className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
          <BellRing className="w-5 h-5 text-slate-700" />
        </button>

        {/* ✅ Profile block + dropdown */}
        <div className="relative pl-2" ref={profileWrapRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-3 rounded-xl hover:bg-gray-50 px-2 py-1 transition"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            title="Profile menu"
          >
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

            <div className="min-w-0 text-left">
              <div className="text-sm font-semibold truncate">{(user as any)?.name}</div>
              <div className="text-xs text-gray-500 truncate">{(user as any)?.email}</div>
            </div>

            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="text-sm font-semibold truncate">{(user as any)?.name || "User"}</div>
                <div className="text-xs text-gray-500 truncate">{(user as any)?.email || ""}</div>
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
    </header>
  );
}
