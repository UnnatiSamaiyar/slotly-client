// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { LogOut, User, Clock, ChevronDown } from "lucide-react";

// const TIMEZONES = [
//     { label: "UTC−12:00 — Baker Island", value: "Etc/GMT+12" },
//     { label: "UTC−11:00 — Samoa", value: "Pacific/Pago_Pago" },
//     { label: "UTC−10:00 — Hawaii", value: "Pacific/Honolulu" },
//     { label: "UTC−09:00 — Alaska", value: "America/Anchorage" },
//     { label: "UTC−08:00 — Pacific Time (US)", value: "America/Los_Angeles" },
//     { label: "UTC−07:00 — Mountain Time (US)", value: "America/Denver" },
//     { label: "UTC−06:00 — Central Time (US)", value: "America/Chicago" },
//     { label: "UTC−05:00 — Eastern Time (US)", value: "America/New_York" },
//     { label: "UTC−04:00 — Atlantic Time", value: "America/Halifax" },
//     { label: "UTC−03:00 — Buenos Aires", value: "America/Argentina/Buenos_Aires" },
//     { label: "UTC+00:00 — London (GMT)", value: "Europe/London" },
//     { label: "UTC+01:00 — Paris, Berlin", value: "Europe/Paris" },
//     { label: "UTC+02:00 — Cairo, Athens", value: "Africa/Cairo" },
//     { label: "UTC+03:00 — Moscow, Nairobi", value: "Europe/Moscow" },
//     { label: "UTC+03:30 — Tehran", value: "Asia/Tehran" },
//     { label: "UTC+04:00 — Dubai, Baku", value: "Asia/Dubai" },
//     { label: "UTC+05:00 — Karachi", value: "Asia/Karachi" },
//     { label: "UTC+05:30 — India (IST)", value: "Asia/Kolkata" },
//     { label: "UTC+05:45 — Kathmandu", value: "Asia/Kathmandu" },
//     { label: "UTC+06:00 — Dhaka", value: "Asia/Dhaka" },
//     { label: "UTC+07:00 — Bangkok, Jakarta", value: "Asia/Bangkok" },
//     { label: "UTC+08:00 — Singapore, Beijing", value: "Asia/Singapore" },
//     { label: "UTC+09:00 — Tokyo, Seoul", value: "Asia/Tokyo" },
//     { label: "UTC+09:30 — Adelaide", value: "Australia/Adelaide" },
//     { label: "UTC+10:00 — Sydney", value: "Australia/Sydney" },
//     { label: "UTC+12:00 — Auckland", value: "Pacific/Auckland" },
// ];

// function getStoredTimezone(userTz?: string) {
//     if (typeof window === "undefined") return userTz || "UTC";
//     return (
//         localStorage.getItem("slotly_timezone") ||
//         userTz ||
//         Intl.DateTimeFormat().resolvedOptions().timeZone ||
//         "UTC"
//     );
// }

// export default function SettingsPage() {
//     const router = useRouter();

//     // ── get user the same way your dashboard does ──
//     const [user, setUser] = useState<any>(null);

//     useEffect(() => {
//         try {
//             const raw =
//                 localStorage.getItem("slotly_user") ||
//                 localStorage.getItem("user") ||
//                 sessionStorage.getItem("slotly_user") ||
//                 sessionStorage.getItem("user");
//             if (raw) setUser(JSON.parse(raw));
//         } catch {
//             // ignore
//         }
//     }, []);

//     const [selectedTz, setSelectedTz] = useState("Asia/Kolkata");
//     const [saved, setSaved] = useState(false);
//     const [currentTime, setCurrentTime] = useState("");

//     // set timezone once user/storage loads
//     useEffect(() => {
//         setSelectedTz(getStoredTimezone(user?.timezone));
//     }, [user]);

//     // live clock
//     useEffect(() => {
//         const tick = () => {
//             try {
//                 setCurrentTime(
//                     new Intl.DateTimeFormat("en-US", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         second: "2-digit",
//                         hour12: true,
//                         timeZone: selectedTz,
//                     }).format(new Date())
//                 );
//             } catch {
//                 setCurrentTime("");
//             }
//         };
//         tick();
//         const t = setInterval(tick, 1000);
//         return () => clearInterval(t);
//     }, [selectedTz]);

//     const handleSaveTimezone = () => {
//         localStorage.setItem("slotly_timezone", selectedTz);
//         window.dispatchEvent(new Event("slotly-timezone-change"));
//         setSaved(true);
//         setTimeout(() => setSaved(false), 2500);
//     };

//     const handleLogout = () => {
//         try {
//             ["access_token", "refresh_token", "token", "user", "slotly_user"].forEach((k) => {
//                 localStorage.removeItem(k);
//                 sessionStorage.removeItem(k);
//             });
//             document.cookie = "access_token=; Max-Age=0; path=/";
//             document.cookie = "refresh_token=; Max-Age=0; path=/";
//             document.cookie = "token=; Max-Age=0; path=/";
//             router.replace("/login");
//             router.refresh();
//         } catch {
//             router.replace("/login");
//         }
//     };

//     const avatarSrc = user?.picture || user?.avatarUrl || user?.avatar_url || "/menwithtab.png";
//     const displayName = user?.name || "User";
//     const displayEmail = user?.email || "";
//     const initials = (user?.name || user?.email || "U")
//         .split(" ")
//         .map((s: string) => s[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase();

//     return (
//         <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
//             {/* Page title */}
//             <div>
//                 <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">
//                     Settings
//                 </h1>
//                 <p className="mt-1 text-sm text-slate-500">
//                     Manage your profile, timezone, and account.
//                 </p>
//             </div>

//             {/* ── Profile card ── */}
//             <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//                 <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
//                     <User className="h-4 w-4 text-slate-400" />
//                     <h2 className="text-sm font-semibold text-slate-700">Profile</h2>
//                 </div>

//                 <div className="px-5 py-5">
//                     {/* Avatar + name */}
//                     <div className="flex items-center gap-4">
//                         {user?.picture ? (
//                             <img
//                                 src={avatarSrc}
//                                 alt="avatar"
//                                 referrerPolicy="no-referrer"
//                                 onError={(e) => { e.currentTarget.src = "/menwithtab.png"; }}
//                                 className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100"
//                             />
//                         ) : (
//                             <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
//                                 {initials}
//                             </div>
//                         )}
//                         <div className="min-w-0 flex-1">
//                             <p className="truncate text-base font-semibold text-slate-900">{displayName}</p>
//                             <p className="truncate text-sm text-slate-500">{displayEmail}</p>
//                         </div>
//                     </div>

//                     {/* Read-only fields */}
//                     <div className="mt-5 space-y-4">
//                         <div>
//                             <label className="mb-1.5 block text-xs font-medium text-slate-500">
//                                 Display name
//                             </label>
//                             <input
//                                 type="text"
//                                 defaultValue={displayName}
//                                 readOnly
//                                 className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 outline-none"
//                             />
//                         </div>
//                         <div>
//                             <label className="mb-1.5 block text-xs font-medium text-slate-500">
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 defaultValue={displayEmail}
//                                 readOnly
//                                 className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 outline-none"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* ── Timezone card ── */}
//             <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//                 <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
//                     <Clock className="h-4 w-4 text-slate-400" />
//                     <h2 className="text-sm font-semibold text-slate-700">Timezone</h2>
//                 </div>

//                 <div className="space-y-4 px-5 py-5">
//                     {/* Live clock */}
//                     <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
//                         <span className="text-xs text-slate-500">Current time in selected zone</span>
//                         <span className="font-mono text-sm font-semibold text-slate-800">
//                             {currentTime || "—"}
//                         </span>
//                     </div>

//                     {/* Select */}
//                     <div>
//                         <label className="mb-1.5 block text-xs font-medium text-slate-500">
//                             Select timezone
//                         </label>
//                         <div className="relative">
//                             <select
//                                 value={selectedTz}
//                                 onChange={(e) => {
//                                     setSelectedTz(e.target.value);
//                                     setSaved(false);
//                                 }}
//                                 className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-800 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/15"
//                             >
//                                 {TIMEZONES.map((tz) => (
//                                     <option key={tz.value} value={tz.value}>
//                                         {tz.label}
//                                     </option>
//                                 ))}
//                             </select>
//                             <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                         </div>
//                     </div>

//                     {/* Save */}
//                     <div className="flex items-center justify-between">
//                         <p className="text-xs text-slate-400">
//                             Updates your greeting and calendar display instantly.
//                         </p>
//                         <button
//                             type="button"
//                             onClick={handleSaveTimezone}
//                             className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
//                         >
//                             {saved ? "Saved ✓" : "Save"}
//                         </button>
//                     </div>
//                 </div>
//             </section>

//             {/* ── Logout card ── */}
//             <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//                 <div className="px-5 py-4">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-sm font-semibold text-slate-800">Sign out</p>
//                             <p className="mt-0.5 text-xs text-slate-400">
//                                 You will be redirected to the login page.
//                             </p>
//                         </div>
//                         <button
//                             type="button"
//                             onClick={handleLogout}
//                             className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 active:scale-95"
//                         >
//                             <LogOut className="h-4 w-4" />
//                             Logout
//                         </button>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Clock, ChevronDown } from "lucide-react";
import { useDashboardUser } from "@/app/dashboard/layout";

const TIMEZONES = [
  { label: "UTC−12:00 — Baker Island", value: "Etc/GMT+12" },
  { label: "UTC−11:00 — Samoa", value: "Pacific/Pago_Pago" },
  { label: "UTC−10:00 — Hawaii", value: "Pacific/Honolulu" },
  { label: "UTC−09:00 — Alaska", value: "America/Anchorage" },
  { label: "UTC−08:00 — Pacific Time (US)", value: "America/Los_Angeles" },
  { label: "UTC−07:00 — Mountain Time (US)", value: "America/Denver" },
  { label: "UTC−06:00 — Central Time (US)", value: "America/Chicago" },
  { label: "UTC−05:00 — Eastern Time (US)", value: "America/New_York" },
  { label: "UTC−04:00 — Atlantic Time", value: "America/Halifax" },
  {
    label: "UTC−03:00 — Buenos Aires",
    value: "America/Argentina/Buenos_Aires",
  },
  { label: "UTC+00:00 — London (GMT)", value: "Europe/London" },
  { label: "UTC+01:00 — Paris, Berlin", value: "Europe/Paris" },
  { label: "UTC+02:00 — Cairo, Athens", value: "Africa/Cairo" },
  { label: "UTC+03:00 — Moscow, Nairobi", value: "Europe/Moscow" },
  { label: "UTC+03:30 — Tehran", value: "Asia/Tehran" },
  { label: "UTC+04:00 — Dubai, Baku", value: "Asia/Dubai" },
  { label: "UTC+05:00 — Karachi", value: "Asia/Karachi" },
  { label: "UTC+05:30 — India (IST)", value: "Asia/Kolkata" },
  { label: "UTC+05:45 — Kathmandu", value: "Asia/Kathmandu" },
  { label: "UTC+06:00 — Dhaka", value: "Asia/Dhaka" },
  { label: "UTC+07:00 — Bangkok, Jakarta", value: "Asia/Bangkok" },
  { label: "UTC+08:00 — Singapore, Beijing", value: "Asia/Singapore" },
  { label: "UTC+09:00 — Tokyo, Seoul", value: "Asia/Tokyo" },
  { label: "UTC+09:30 — Adelaide", value: "Australia/Adelaide" },
  { label: "UTC+10:00 — Sydney", value: "Australia/Sydney" },
  { label: "UTC+12:00 — Auckland", value: "Pacific/Auckland" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useDashboardUser();

  const [selectedTz, setSelectedTz] = useState("Asia/Kolkata");
  const [saved, setSaved] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const stored =
      localStorage.getItem("slotly_timezone") ||
      user?.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      "UTC";
    setSelectedTz(stored);
  }, [user]);

  useEffect(() => {
    const tick = () => {
      try {
        setCurrentTime(
          new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: selectedTz,
          }).format(new Date()),
        );
      } catch {
        setCurrentTime("");
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [selectedTz]);

  const handleSaveTimezone = () => {
    localStorage.setItem("slotly_timezone", selectedTz);
    window.dispatchEvent(new Event("slotly-timezone-change"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    try {
      ["access_token", "refresh_token", "token", "user", "slotly_user"].forEach(
        (k) => {
          localStorage.removeItem(k);
          sessionStorage.removeItem(k);
        },
      );
      document.cookie = "access_token=; Max-Age=0; path=/";
      document.cookie = "refresh_token=; Max-Age=0; path=/";
      document.cookie = "token=; Max-Age=0; path=/";
      router.replace("/login");
      router.refresh();
    } catch {
      router.replace("/login");
    }
  };

  const avatarSrc =
    user?.picture || user?.avatarUrl || user?.avatar_url || "/menwithtab.png";
  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";
  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-full max-w-2xl space-y-6 py-6 px-6 lg:px-8">
      {/* Page title */}
     

      {/* ── Profile card ── */}
      <section data-tour="settings-profile" className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <User className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Profile</h2>
        </div>

        <div className="px-5 py-5">
          {/* Avatar + name row */}
          <div className="flex items-center gap-4">
            {user?.picture ? (
              <img
                src={avatarSrc}
                alt="avatar"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "/menwithtab.png";
                }}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="truncate text-sm text-slate-500">{displayEmail}</p>
            </div>
          </div>

          {/* Read-only fields */}
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Display name
              </label>
              <input
                type="text"
                defaultValue={displayName}
                readOnly
                className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Email
              </label>
              <input
                type="email"
                defaultValue={displayEmail}
                readOnly
                className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Timezone card ── */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Clock className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Timezone</h2>
        </div>

        <div className="space-y-4 px-5 py-5">
          {/* Live clock */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="text-xs text-slate-500">
              Current time in selected zone
            </span>
            <span className="font-mono text-sm font-semibold text-slate-800">
              {currentTime || "—"}
            </span>
          </div>

          {/* Dropdown */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Select timezone
            </label>
            <div className="relative">
              <select
                value={selectedTz}
                onChange={(e) => {
                  setSelectedTz(e.target.value);
                  setSaved(false);
                }}
                className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-800 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/15"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Save row */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Updates your greeting and calendar display instantly.
            </p>
            <button
              type="button"
              onClick={handleSaveTimezone}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
            >
              {saved ? "Saved ✓" : "Save"}
            </button>
          </div>
        </div>
      </section>

      {/* ── Logout card ── */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Sign out</p>
              <p className="mt-0.5 text-xs text-slate-400">
                You will be redirected to the login page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 active:scale-95"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
