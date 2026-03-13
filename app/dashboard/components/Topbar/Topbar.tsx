// // // // "use client";

// // // // import React, { useEffect, useRef, useState } from "react";
// // // // import { Search, LogOut, ChevronDown } from "lucide-react";
// // // // import { UserProfile } from "../../types";
// // // // import TimezonePicker from "../TimezonePicker";

// // // // export default function Topbar({
// // // //   user,
// // // //   searchQuery,
// // // //   onSearchQueryChange,
// // // // }: {
// // // //   user: UserProfile | null;
// // // //   searchQuery: string;
// // // //   onSearchQueryChange: (v: string) => void;
// // // // }) {
// // // //   const [profileOpen, setProfileOpen] = useState(false);
// // // //   const profileWrapRef = useRef<HTMLDivElement | null>(null);

// // // //   useEffect(() => {
// // // //     const onDocMouseDown = (e: MouseEvent) => {
// // // //       if (!profileWrapRef.current) return;
// // // //       if (!profileWrapRef.current.contains(e.target as Node)) setProfileOpen(false);
// // // //     };
// // // //     const onKeyDown = (e: KeyboardEvent) => {
// // // //       if (e.key === "Escape") setProfileOpen(false);
// // // //     };
// // // //     document.addEventListener("mousedown", onDocMouseDown);
// // // //     document.addEventListener("keydown", onKeyDown);
// // // //     return () => {
// // // //       document.removeEventListener("mousedown", onDocMouseDown);
// // // //       document.removeEventListener("keydown", onKeyDown);
// // // //     };
// // // //   }, []);
// // // //   const handleLogout = async () => {
// // // //     try {
// // // //       setProfileOpen(false);

// // // //       // storage
// // // //       localStorage.removeItem("access_token");
// // // //       localStorage.removeItem("refresh_token");
// // // //       localStorage.removeItem("token");
// // // //       localStorage.removeItem("user");
// // // //       localStorage.removeItem("slotly_user"); // ✅ IMPORTANT

// // // //       sessionStorage.removeItem("access_token");
// // // //       sessionStorage.removeItem("refresh_token");
// // // //       sessionStorage.removeItem("token");
// // // //       sessionStorage.removeItem("user");
// // // //       sessionStorage.removeItem("slotly_user"); // ✅ IMPORTANT

// // // //       // cookies
// // // //       const clearCookie = (name: string) => {
// // // //         document.cookie = `${name}=; Max-Age=0; path=/`;
// // // //         document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
// // // //         document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}`;
// // // //       };

// // // //       clearCookie("access_token");
// // // //       clearCookie("refresh_token");
// // // //       clearCookie("token");

// // // //       window.location.replace("/");
// // // //     } catch (e) {
// // // //       console.error("Logout failed:", e);
// // // //       window.location.replace("/");
// // // //     }
// // // //   };

// // // //   const avatarSrc =
// // // //     (user as any)?.avatarUrl ||
// // // //     (user as any)?.avatar_url ||
// // // //     (user as any)?.picture ||
// // // //     "/menwithtab.png";

// // // //   return (
// // // //     <header className="mb-6">
// // // //       {/* Desktop header (sm+) */}
// // // //       <div className="hidden sm:flex items-center justify-between gap-6">
// // // //         {/* Left */}
// // // //         <div className="min-w-0">
// // // //           <h2 className="text-xl font-semibold text-slate-900">
// // // //             Your Schedule
// // // //           </h2>
// // // //           <p className="mt-1 text-sm text-slate-500">
// // // //             Search and manage your meetings quickly.
// // // //           </p>
// // // //         </div>

// // // //         {/* Right */}
// // // //         <div className="flex items-center gap-4 shrink-0">

// // // //           {/* Search (responsive width) */}
// // // //           <div className="relative w-64 md:w-72 lg:w-80">
// // // //             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
// // // //             <input
// // // //               type="text"
// // // //               placeholder="Search events…"
// // // //               value={searchQuery}
// // // //               onChange={(e) => onSearchQueryChange(e.target.value)}
// // // //               className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white
// // // //                    shadow-sm focus:outline-none focus:ring-2 
// // // //                    focus:ring-indigo-500/20 focus:border-indigo-300 transition"
// // // //             />
// // // //           </div>

        
// // // //           <TimezonePicker compact />

// // // //           {/* Profile */}
// // // //           <div className="relative" ref={profileWrapRef}>
// // // //             <button
// // // //               onClick={() => setProfileOpen((v) => !v)}
// // // //               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
// // // //                    hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
// // // //             >
// // // //               <img
// // // //                 src={avatarSrc}
// // // //                 alt="me"
// // // //                 className="h-9 w-9 rounded-full object-cover"
// // // //               />
// // // //               <ChevronDown className="h-4 w-4 text-slate-400" />
// // // //             </button>

// // // //             {profileOpen && (
// // // //               <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-50">
// // // //                 <div className="px-4 py-3 border-b border-slate-100">
// // // //                   <div className="text-sm font-semibold truncate">
// // // //                     {(user as any)?.name || "User"}
// // // //                   </div>
// // // //                   <div className="text-xs text-slate-500 truncate">
// // // //                     {(user as any)?.email || ""}
// // // //                   </div>
// // // //                 </div>

// // // //                 <button
// // // //                   onClick={handleLogout}
// // // //                   className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
// // // //                 >
// // // //                   <LogOut className="w-4 h-4" />
// // // //                   Logout
// // // //                 </button>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Mobile header (below sm) */}
// // // //       <div className="flex flex-col gap-4 sm:hidden">
// // // //         {/* Title */}
// // // //         <div>
// // // //           <h2 className="text-lg font-semibold text-slate-900">
// // // //             Your Schedule
// // // //           </h2>
// // // //         </div>

// // // //         {/* Search full width */}
// // // //         <div className="relative">
// // // //           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
// // // //           <input
// // // //             type="text"
// // // //             placeholder="Search events…"
// // // //             value={searchQuery}
// // // //             onChange={(e) => onSearchQueryChange(e.target.value)}
// // // //             className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white
// // // //                  shadow-sm focus:outline-none focus:ring-2 
// // // //                  focus:ring-indigo-500/20 focus:border-indigo-300 transition"
// // // //           />
// // // //         </div>

// // // //         {/* Timezone + Profile */}
// // // //         <div className="flex items-center justify-between">
// // // //           <TimezonePicker compact />

// // // //           <div className="relative" ref={profileWrapRef}>
// // // //             <button
// // // //               onClick={() => setProfileOpen((v) => !v)}
// // // //               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
// // // //                    hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
// // // //             >
// // // //               <img
// // // //                 src={avatarSrc}
// // // //                 alt="me"
// // // //                 className="h-9 w-9 rounded-full object-cover"
// // // //               />
// // // //               <ChevronDown className="h-4 w-4 text-slate-400" />
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Search row */}
// // // //       {/* <div className="mt-4">
// // // //         <div className="relative">
// // // //           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
// // // //           <input
// // // //             type="text"
// // // //             placeholder="Search events…"
// // // //             value={searchQuery}
// // // //             onChange={(e) => onSearchQueryChange(e.target.value)}
// // // //             className={[
// // // //               "w-full h-11 pl-9 pr-3 rounded-2xl border border-slate-200 bg-white",
// // // //               "shadow-[0_1px_0_rgba(15,23,42,0.04)]",
// // // //               "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition",
// // // //             ].join(" ")}
// // // //           />
// // // //         </div>
// // // //       </div> */}
// // // //     </header>
// // // //   );
// // // // }








// // // // // "use client";

// // // // // import { Search } from "lucide-react";
// // // // // import { DButton } from "../../../../components/ui/DButton.tsx";

// // // // // export default function Topbar() {
// // // // //   return (
// // // // //     <div className="sticky top-0 z-30 bg-white border-b border-slate-200">
// // // // //       <div className="h-16 px-8 flex items-center justify-between gap-6">
// // // // //         {/* Left */}
// // // // //         <div className="flex items-center gap-3 text-slate-800 font-semibold">
// // // // //           Dashboard
// // // // //         </div>

// // // // //         {/* Center Search */}
// // // // //         <div className="flex-1 max-w-xl">
// // // // //           <div className="relative">
// // // // //             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
// // // // //             <input
// // // // //               placeholder="Search events, people…"
// // // // //               className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
// // // // //             />
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Right actions */}
// // // // //         <div className="flex items-center gap-3">
// // // // //           <DButton variant="ghost">Help</DButton>
// // // // //           <DButton variant="primary">Create event</DButton>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }




// // // "use client";

// // // import React, { useEffect, useRef, useState } from "react";
// // // import { Search, LogOut, ChevronDown } from "lucide-react";
// // // import { useRouter } from "next/navigation";
// // // import { UserProfile } from "../../types";
// // // import TimezonePicker from "../TimezonePicker";

// // // export default function Topbar({
// // //   user,
// // //   searchQuery,
// // //   onSearchQueryChange,
// // // }: {
// // //   user: UserProfile | null;
// // //   searchQuery: string;
// // //   onSearchQueryChange: (v: string) => void;
// // // }) {
// // //   const router = useRouter();

// // //   const [profileOpen, setProfileOpen] = useState(false);
// // //   const profileWrapRefDesktop = useRef<HTMLDivElement | null>(null);
// // //   const profileWrapRefMobile = useRef<HTMLDivElement | null>(null);

// // //   useEffect(() => {
// // //     const onDocMouseDown = (e: MouseEvent) => {
// // //       const t = e.target as Node;

// // //       const insideDesktop =
// // //         profileWrapRefDesktop.current?.contains(t) ?? false;
// // //       const insideMobile =
// // //         profileWrapRefMobile.current?.contains(t) ?? false;

// // //       if (!insideDesktop && !insideMobile) setProfileOpen(false);
// // //     };

// // //     const onKeyDown = (e: KeyboardEvent) => {
// // //       if (e.key === "Escape") setProfileOpen(false);
// // //     };

// // //     document.addEventListener("mousedown", onDocMouseDown);
// // //     document.addEventListener("keydown", onKeyDown);

// // //     return () => {
// // //       document.removeEventListener("mousedown", onDocMouseDown);
// // //       document.removeEventListener("keydown", onKeyDown);
// // //     };
// // //   }, []);

// // //   const handleLogout = async () => {
// // //     try {
// // //       setProfileOpen(false);

// // //       // Clear auth/session storage (DashboardLayout uses slotly_user)
// // //       localStorage.removeItem("access_token");
// // //       localStorage.removeItem("refresh_token");
// // //       localStorage.removeItem("token");
// // //       localStorage.removeItem("user");
// // //       localStorage.removeItem("slotly_user");

// // //       sessionStorage.removeItem("access_token");
// // //       sessionStorage.removeItem("refresh_token");
// // //       sessionStorage.removeItem("token");
// // //       sessionStorage.removeItem("user");
// // //       sessionStorage.removeItem("slotly_user");

// // //       // Clear cookies (best-effort)
// // //       const clearCookie = (name: string) => {
// // //         document.cookie = `${name}=; Max-Age=0; path=/`;
// // //         document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
// // //         document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}`;
// // //       };
// // //       clearCookie("access_token");
// // //       clearCookie("refresh_token");
// // //       clearCookie("token");

// // //       // Next.js App Router navigation
// // //       router.replace("/login");
// // //       router.refresh();
// // //     } catch (e) {
// // //       console.error("Logout failed:", e);
// // //       router.replace("/login");
// // //       router.refresh();
// // //     }
// // //   };

// // //   const avatarSrc =
// // //     (user as any)?.avatarUrl ||
// // //     (user as any)?.avatar_url ||
// // //     (user as any)?.picture ||
// // //     "/menwithtab.png";

// // //   return (
// // //     <header className="mb-6">
// // //       {/* Desktop header (sm+) */}
// // //       <div className="relative">
// // //         {/* Left */}
// // //         <div className="min-w-0">
// // //           <h2 className="text-xl font-semibold text-slate-900">Your Schedule</h2>
// // //           <p className="mt-1 text-sm text-slate-500">
// // //             Search and manage your meetings quickly.
// // //           </p>
// // //         </div>

// // //         {/* Right */}
// // //         <div className="flex items-center gap-4 shrink-0">
// // //           {/* Search */}
// // //           <div className="relative w-64 md:w-72 lg:w-80">
// // //             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
// // //             <input
// // //               type="text"
// // //               placeholder="Search events…"
// // //               value={searchQuery}
// // //               onChange={(e) => onSearchQueryChange(e.target.value)}
// // //               className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white
// // //                    shadow-sm focus:outline-none focus:ring-2 
// // //                    focus:ring-indigo-500/20 focus:border-indigo-300 transition"
// // //             />
// // //           </div>

// // //           <TimezonePicker compact />

// // //           {/* Profile */}
// // //           <div className="relative" ref={profileWrapRef}>
// // //             <button
// // //               type="button"
// // //               onClick={() => setProfileOpen((v) => !v)}
// // //               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
// // //                    hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
// // //             >
// // //               <img
// // //                 src={avatarSrc}
// // //                 alt="me"
// // //                 className="h-9 w-9 rounded-full object-cover"
// // //                 referrerPolicy="no-referrer"
// // //                 onError={(e) => {
// // //                   e.currentTarget.src = "/menwithtab.png";
// // //                 }}
// // //               />
// // //               <ChevronDown className="h-4 w-4 text-slate-400" />
// // //             </button>

// // //             {profileOpen && (
// // //               <div
// // //                 className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-[9999]"
// // //                 onMouseDown={(e) => e.stopPropagation()}
// // //                 onClick={(e) => e.stopPropagation()}
// // //               >
// // //                 <div className="px-4 py-3 border-b border-slate-100">
// // //                   <div className="text-sm font-semibold truncate">
// // //                     {(user as any)?.name || "User"}
// // //                   </div>
// // //                   <div className="text-xs text-slate-500 truncate">
// // //                     {(user as any)?.email || ""}
// // //                   </div>
// // //                 </div>

// // //                 <button
// // //                   type="button"
// // //                   onClick={(e) => {
// // //                     e.stopPropagation();
// // //                     handleLogout();
// // //                   }}
// // //                   className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
// // //                 >
// // //                   <LogOut className="w-4 h-4" />
// // //                   Logout
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Mobile header (below sm) */}
// // //       <div className="relative">
// // //         {/* Title */}
// // //         <div>
// // //           <h2 className="text-lg font-semibold text-slate-900">Your Schedule</h2>
// // //         </div>

// // //         {/* Search full width */}
// // //         <div className="relative">
// // //           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
// // //           <input
// // //             type="text"
// // //             placeholder="Search events…"
// // //             value={searchQuery}
// // //             onChange={(e) => onSearchQueryChange(e.target.value)}
// // //             className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white
// // //                  shadow-sm focus:outline-none focus:ring-2 
// // //                  focus:ring-indigo-500/20 focus:border-indigo-300 transition"
// // //           />
// // //         </div>

// // //         {/* Timezone + Profile */}
// // //         <div className="flex items-center justify-between">
// // //           <TimezonePicker compact />

// // //           <div className="relative" ref={profileWrapRef}>
// // //             <button
// // //               type="button"
// // //               onClick={() => setProfileOpen((v) => !v)}
// // //               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
// // //                    hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
// // //             >
// // //               <img
// // //                 src={avatarSrc}
// // //                 alt="me"
// // //                 className="h-9 w-9 rounded-full object-cover"
// // //                 referrerPolicy="no-referrer"
// // //                 onError={(e) => {
// // //                   e.currentTarget.src = "/menwithtab.png";
// // //                 }}
// // //               />
// // //               <ChevronDown className="h-4 w-4 text-slate-400" />
// // //             </button>

// // //             {profileOpen && (
// // //               <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-50">
// // //                 <div className="px-4 py-3 border-b border-slate-100">
// // //                   <div className="text-sm font-semibold truncate">
// // //                     {(user as any)?.name || "User"}
// // //                   </div>
// // //                   <div className="text-xs text-slate-500 truncate">
// // //                     {(user as any)?.email || ""}
// // //                   </div>
// // //                 </div>

// // //                 <button
// // //                   type="button"
// // //                   onClick={handleLogout}
// // //                   className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
// // //                 >
// // //                   <LogOut className="w-4 h-4" />
// // //                   Logout
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Search row (optional; keep commented if not used) */}
// // //       {/* <div className="mt-4">
// // //         <div className="relative">
// // //           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
// // //           <input
// // //             type="text"
// // //             placeholder="Search events…"
// // //             value={searchQuery}
// // //             onChange={(e) => onSearchQueryChange(e.target.value)}
// // //             className={[
// // //               "w-full h-11 pl-9 pr-3 rounded-2xl border border-slate-200 bg-white",
// // //               "shadow-[0_1px_0_rgba(15,23,42,0.04)]",
// // //               "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition",
// // //             ].join(" ")}
// // //           />
// // //         </div>
// // //       </div> */}
// // //     </header>
// // //   );
// // // }


// // // "use client";

// // // import React, { useEffect, useRef, useState } from "react";
// // // import { Search, LogOut, ChevronDown } from "lucide-react";
// // // import { useRouter } from "next/navigation";
// // // import { UserProfile } from "../../types";
// // // import TimezonePicker from "../TimezonePicker";

// // // export default function Topbar({
// // //   user,
// // //   searchQuery,
// // //   onSearchQueryChange,
// // // }: {
// // //   user: UserProfile | null;
// // //   searchQuery: string;
// // //   onSearchQueryChange: (v: string) => void;
// // // }) {
// // //   const router = useRouter();

// // //   const [profileOpen, setProfileOpen] = useState(false);

// // //   // ✅ Two refs (desktop + mobile). Never reuse one ref twice.
// // //   const profileWrapRefDesktop = useRef<HTMLDivElement | null>(null);
// // //   const profileWrapRefMobile = useRef<HTMLDivElement | null>(null);

// // //   useEffect(() => {
// // //     const onDocClick = (e: MouseEvent) => {
// // //       const t = e.target as Node;

// // //       const insideDesktop = profileWrapRefDesktop.current?.contains(t) ?? false;
// // //       const insideMobile = profileWrapRefMobile.current?.contains(t) ?? false;

// // //       if (!insideDesktop && !insideMobile) setProfileOpen(false);
// // //     };

// // //     const onKeyDown = (e: KeyboardEvent) => {
// // //       if (e.key === "Escape") setProfileOpen(false);
// // //     };

// // //     // ✅ Use "click" (not mousedown) so dropdown doesn't unmount before button click fires
// // //     document.addEventListener("click", onDocClick);
// // //     document.addEventListener("keydown", onKeyDown);

// // //     return () => {
// // //       document.removeEventListener("click", onDocClick);
// // //       document.removeEventListener("keydown", onKeyDown);
// // //     };
// // //   }, []);

// // //   const handleLogout = () => {
// // //     try {
// // //       setProfileOpen(false);

// // //       // ✅ Clear session keys (DashboardLayout uses slotly_user)
// // //       localStorage.removeItem("access_token");
// // //       localStorage.removeItem("refresh_token");
// // //       localStorage.removeItem("token");
// // //       localStorage.removeItem("user");
// // //       localStorage.removeItem("slotly_user");

// // //       sessionStorage.removeItem("access_token");
// // //       sessionStorage.removeItem("refresh_token");
// // //       sessionStorage.removeItem("token");
// // //       sessionStorage.removeItem("user");
// // //       sessionStorage.removeItem("slotly_user");

// // //       // Best-effort cookie cleanup (if you ever set any)
// // //       document.cookie = "access_token=; Max-Age=0; path=/";
// // //       document.cookie = "refresh_token=; Max-Age=0; path=/";
// // //       document.cookie = "token=; Max-Age=0; path=/";

// // //       // ✅ Next.js navigation
// // //       router.replace("/login");
// // //       router.refresh();
// // //     } catch (e) {
// // //       console.error("Logout failed:", e);
// // //       router.replace("/login");
// // //       router.refresh();
// // //     }
// // //   };

// // //   const avatarSrc =
// // //     (user as any)?.avatarUrl ||
// // //     (user as any)?.avatar_url ||
// // //     (user as any)?.picture ||
// // //     "/menwithtab.png";

// // //   const displayName = (user as any)?.name || "User";
// // //   const displayEmail = (user as any)?.email || "";

// // //   return (
// // //     <header className="mb-6">
// // //       {/* Desktop header (sm+) */}
// // //       <div
// // //         className="hidden sm:flex items-center justify-between gap-6"
// // //         ref={profileWrapRefDesktop}
// // //       >
// // //         {/* Left */}
// // //         <div className="min-w-0">
// // //           <h2 className="text-xl font-semibold text-slate-900">Your Schedule</h2>
// // //           <p className="mt-1 text-sm text-slate-500">
// // //             Search and manage your meetings quickly.
// // //           </p>
// // //         </div>

// // //         {/* Right */}
// // //         <div className="flex items-center gap-4 shrink-0">
// // //           {/* Search (responsive width) */}
// // //           <div className="relative w-64 md:w-72 lg:w-80">
// // //             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
// // //             <input
// // //               type="text"
// // //               placeholder="Search events…"
// // //               value={searchQuery}
// // //               onChange={(e) => onSearchQueryChange(e.target.value)}
// // //               className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white
// // //                          shadow-sm focus:outline-none focus:ring-2
// // //                          focus:ring-indigo-500/20 focus:border-indigo-300 transition"
// // //             />
// // //           </div>

// // //           <TimezonePicker compact />

// // //           {/* Profile */}
// // //           <div className="relative">
// // //             <button
// // //               type="button"
// // //               onClick={(e) => {
// // //                 e.stopPropagation();
// // //                 setProfileOpen((v) => !v);
// // //               }}
// // //               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
// // //                          hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
// // //             >
// // //               <img
// // //                 src={avatarSrc}
// // //                 alt="me"
// // //                 className="h-9 w-9 rounded-full object-cover"
// // //                 referrerPolicy="no-referrer"
// // //                 onError={(e) => {
// // //                   e.currentTarget.src = "/menwithtab.png";
// // //                 }}
// // //               />
// // //               <ChevronDown className="h-4 w-4 text-slate-400" />
// // //             </button>

// // //             {profileOpen && (
// // //               <div
// // //                 className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-[9999]"
// // //                 onClick={(e) => e.stopPropagation()}
// // //               >
// // //                 <div className="px-4 py-3 border-b border-slate-100">
// // //                   <div className="text-sm font-semibold truncate">{displayName}</div>
// // //                   <div className="text-xs text-slate-500 truncate">{displayEmail}</div>
// // //                 </div>

// // //                 <button
// // //                   type="button"
// // //                   onClick={(e) => {
// // //                     e.stopPropagation();
// // //                     handleLogout();
// // //                   }}
// // //                   className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
// // //                 >
// // //                   <LogOut className="w-4 h-4" />
// // //                   Logout
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Mobile header (below sm) */}
// // //       <div className="flex flex-col gap-4 sm:hidden" ref={profileWrapRefMobile}>
// // //         {/* Title */}
// // //         <div>
// // //           <h2 className="text-lg font-semibold text-slate-900">Your Schedule</h2>
// // //         </div>

// // //         {/* Search full width */}
// // //         <div className="relative">
// // //           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
// // //           <input
// // //             type="text"
// // //             placeholder="Search events…"
// // //             value={searchQuery}
// // //             onChange={(e) => onSearchQueryChange(e.target.value)}
// // //             className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white
// // //                        shadow-sm focus:outline-none focus:ring-2
// // //                        focus:ring-indigo-500/20 focus:border-indigo-300 transition"
// // //           />
// // //         </div>

// // //         {/* Timezone + Profile */}
// // //         <div className="flex items-center justify-between">
// // //           <TimezonePicker compact />

// // //           <div className="relative">
// // //             <button
// // //               type="button"
// // //               onClick={(e) => {
// // //                 e.stopPropagation();
// // //                 setProfileOpen((v) => !v);
// // //               }}
// // //               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
// // //                          hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
// // //             >
// // //               <img
// // //                 src={avatarSrc}
// // //                 alt="me"
// // //                 className="h-9 w-9 rounded-full object-cover"
// // //                 referrerPolicy="no-referrer"
// // //                 onError={(e) => {
// // //                   e.currentTarget.src = "/menwithtab.png";
// // //                 }}
// // //               />
// // //               <ChevronDown className="h-4 w-4 text-slate-400" />
// // //             </button>

// // //             {profileOpen && (
// // //               <div
// // //                 className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-[9999]"
// // //                 onClick={(e) => e.stopPropagation()}
// // //               >
// // //                 <div className="px-4 py-3 border-b border-slate-100">
// // //                   <div className="text-sm font-semibold truncate">{displayName}</div>
// // //                   <div className="text-xs text-slate-500 truncate">{displayEmail}</div>
// // //                 </div>

// // //                 <button
// // //                   type="button"
// // //                   onClick={(e) => {
// // //                     e.stopPropagation();
// // //                     handleLogout();
// // //                   }}
// // //                   className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
// // //                 >
// // //                   <LogOut className="w-4 h-4" />
// // //                   Logout
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </header>
// // //   );
// // // }

// // // "use client";

// // // import React, { useEffect, useRef, useState } from "react";
// // // import { Search, LogOut, ChevronDown } from "lucide-react";
// // // import { useRouter } from "next/navigation";
// // // import { UserProfile } from "../../types";
// // // import TimezonePicker from "../TimezonePicker";

// // // export default function Topbar({
// // //   user,
// // //   searchQuery,
// // //   onSearchQueryChange,
// // // }: {
// // //   user: UserProfile | null;
// // //   searchQuery: string;
// // //   onSearchQueryChange: (v: string) => void;
// // // }) {
// // //   const router = useRouter();

// // //   const [profileOpen, setProfileOpen] = useState(false);

// // //   // ✅ Two refs (desktop + mobile). Never reuse one ref twice.
// // //   const profileWrapRefDesktop = useRef<HTMLDivElement | null>(null);
// // //   const profileWrapRefMobile = useRef<HTMLDivElement | null>(null);

// // //   useEffect(() => {
// // //     const onDocClick = (e: MouseEvent) => {
// // //       const t = e.target as Node;

// // //       const insideDesktop = profileWrapRefDesktop.current?.contains(t) ?? false;
// // //       const insideMobile = profileWrapRefMobile.current?.contains(t) ?? false;

// // //       if (!insideDesktop && !insideMobile) setProfileOpen(false);
// // //     };

// // //     const onKeyDown = (e: KeyboardEvent) => {
// // //       if (e.key === "Escape") setProfileOpen(false);
// // //     };

// // //     // ✅ Use "click" (not mousedown) so dropdown doesn't unmount before button click fires
// // //     document.addEventListener("click", onDocClick);
// // //     document.addEventListener("keydown", onKeyDown);

// // //     return () => {
// // //       document.removeEventListener("click", onDocClick);
// // //       document.removeEventListener("keydown", onKeyDown);
// // //     };
// // //   }, []);

// // //   const handleLogout = () => {
// // //     try {
// // //       setProfileOpen(false);

// // //       // ✅ Clear session keys (DashboardLayout uses slotly_user)
// // //       localStorage.removeItem("access_token");
// // //       localStorage.removeItem("refresh_token");
// // //       localStorage.removeItem("token");
// // //       localStorage.removeItem("user");
// // //       localStorage.removeItem("slotly_user");

// // //       sessionStorage.removeItem("access_token");
// // //       sessionStorage.removeItem("refresh_token");
// // //       sessionStorage.removeItem("token");
// // //       sessionStorage.removeItem("user");
// // //       sessionStorage.removeItem("slotly_user");

// // //       // Best-effort cookie cleanup (if you ever set any)
// // //       document.cookie = "access_token=; Max-Age=0; path=/";
// // //       document.cookie = "refresh_token=; Max-Age=0; path=/";
// // //       document.cookie = "token=; Max-Age=0; path=/";

// // //       // ✅ Next.js navigation
// // //       router.replace("/login");
// // //       router.refresh();
// // //     } catch (e) {
// // //       console.error("Logout failed:", e);
// // //       router.replace("/login");
// // //       router.refresh();
// // //     }
// // //   };

// // //   const avatarSrc =
// // //     (user as any)?.avatarUrl ||
// // //     (user as any)?.avatar_url ||
// // //     (user as any)?.picture ||
// // //     "/menwithtab.png";

// // //   const displayName = (user as any)?.name || "User";
// // //   const displayEmail = (user as any)?.email || "";

// // //   return (
// // //     <header className="mb-6">
// // //       {/* ✅ Responsive topbar: search stays in top row and short */}
// // //       <div
// // //         className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
// // //         ref={profileWrapRefMobile}
// // //       >
// // //         {/* Left: Title */}
// // //         <div className="min-w-0">
// // //           <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
// // //             Your Schedule
// // //           </h2>
// // //           <p className="hidden sm:block mt-1 text-sm text-slate-500">
// // //             Search and manage your meetings quickly.
// // //           </p>
// // //         </div>

// // //         {/* Right: Search + TZ + Profile */}
// // //         <div
// // //           className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4"
// // //           ref={profileWrapRefDesktop}
// // //         >
// // //           {/* Search (short width) */}
// // //           <div className="relative w-full sm:w-56 md:w-64 lg:w-72">
// // //             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
// // //             <input
// // //               type="text"
// // //               placeholder="Search events…"
// // //               value={searchQuery}
// // //               onChange={(e) => onSearchQueryChange(e.target.value)}
// // //               className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white
// // //                          shadow-sm focus:outline-none focus:ring-2
// // //                          focus:ring-indigo-500/20 focus:border-indigo-300 transition text-sm"
// // //             />
// // //           </div>

// // //           <TimezonePicker compact />

// // //           {/* Profile (UNCHANGED dropdown) */}
// // //           <div className="relative shrink-0">
// // //             <button
// // //               type="button"
// // //               onClick={(e) => {
// // //                 e.stopPropagation();
// // //                 setProfileOpen((v) => !v);
// // //               }}
// // //               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
// // //                          hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
// // //             >
// // //               <img
// // //                 src={avatarSrc}
// // //                 alt="me"
// // //                 className="h-9 w-9 rounded-full object-cover"
// // //                 referrerPolicy="no-referrer"
// // //                 onError={(e) => {
// // //                   e.currentTarget.src = "/menwithtab.png";
// // //                 }}
// // //               />
// // //               <ChevronDown className="h-4 w-4 text-slate-400" />
// // //             </button>

// // //             {profileOpen && (
// // //               <div
// // //                 className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-[9999]"
// // //                 onClick={(e) => e.stopPropagation()}
// // //               >
// // //                 <div className="px-4 py-3 border-b border-slate-100">
// // //                   <div className="text-sm font-semibold truncate">
// // //                     {displayName}
// // //                   </div>
// // //                   <div className="text-xs text-slate-500 truncate">
// // //                     {displayEmail}
// // //                   </div>
// // //                 </div>

// // //                 <button
// // //                   type="button"
// // //                   onClick={(e) => {
// // //                     e.stopPropagation();
// // //                     handleLogout();
// // //                   }}
// // //                   className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
// // //                 >
// // //                   <LogOut className="w-4 h-4" />
// // //                   Logout
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </header>
// // //   );
// // // } 



// // // "use client";

// // // import React, { useEffect, useRef, useState } from "react";
// // // import { Search, LogOut, ChevronDown, Globe } from "lucide-react";
// // // import { useRouter } from "next/navigation";
// // // import { UserProfile } from "../../types";
// // // import TimezonePicker from "../TimezonePicker";

// // // function cx(...classes: Array<string | false | null | undefined>) {
// // //   return classes.filter(Boolean).join(" ");
// // // }

// // // export default function Topbar({
// // //   user,
// // //   searchQuery,
// // //   onSearchQueryChange,
// // //   title = "Your Schedule",
// // // }: {
// // //   user: UserProfile | null;
// // //   searchQuery: string;
// // //   onSearchQueryChange: (v: string) => void;
// // //   title?: string;
// // // }) {
// // //   const router = useRouter();
// // //   const [profileOpen, setProfileOpen] = useState(false);
// // //   const wrapRef = useRef<HTMLDivElement | null>(null);

// // //   useEffect(() => {
// // //     const onDocClick = (e: MouseEvent) => {
// // //       const t = e.target as Node;
// // //       if (!wrapRef.current?.contains(t)) setProfileOpen(false);
// // //     };
// // //     const onKeyDown = (e: KeyboardEvent) => {
// // //       if (e.key === "Escape") setProfileOpen(false);
// // //     };
// // //     document.addEventListener("click", onDocClick);
// // //     document.addEventListener("keydown", onKeyDown);
// // //     return () => {
// // //       document.removeEventListener("click", onDocClick);
// // //       document.removeEventListener("keydown", onKeyDown);
// // //     };
// // //   }, []);

// // //   const handleLogout = () => {
// // //     try {
// // //       setProfileOpen(false);

// // //       localStorage.removeItem("access_token");
// // //       localStorage.removeItem("refresh_token");
// // //       localStorage.removeItem("token");
// // //       localStorage.removeItem("user");
// // //       localStorage.removeItem("slotly_user");

// // //       sessionStorage.removeItem("access_token");
// // //       sessionStorage.removeItem("refresh_token");
// // //       sessionStorage.removeItem("token");
// // //       sessionStorage.removeItem("user");
// // //       sessionStorage.removeItem("slotly_user");

// // //       document.cookie = "access_token=; Max-Age=0; path=/";
// // //       document.cookie = "refresh_token=; Max-Age=0; path=/";
// // //       document.cookie = "token=; Max-Age=0; path=/";

// // //       router.replace("/login");
// // //       router.refresh();
// // //     } catch (e) {
// // //       console.error("Logout failed:", e);
// // //       router.replace("/login");
// // //       router.refresh();
// // //     }
// // //   };

// // //   const avatarSrc =
// // //     (user as any)?.avatarUrl ||
// // //     (user as any)?.avatar_url ||
// // //     (user as any)?.picture ||
// // //     "/menwithtab.png";

// // //   const displayName = (user as any)?.name || "User";
// // //   const displayEmail = (user as any)?.email || "";

// // //   return (
// // //     <header ref={wrapRef} className="w-full">
// // //       {/* ✅ Always one row, never wrap, never overflow */}
// // //       <div className="w-full flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
// // //         {/* Left: Title (truncate always) */}
// // //         <div className="min-w-0">
// // //           <div className="text-[14px] sm:text-[16px] font-semibold text-slate-900 truncate">
// // //             {title}
// // //           </div>
// // //           <div className="hidden sm:block text-[12px] text-slate-500 truncate">
// // //             Manage your meetings quickly.
// // //           </div>
// // //         </div>

// // //         {/* Right group */}
// // //         <div className="flex items-center gap-2 sm:gap-3 flex-nowrap shrink-0">
// // //           {/* ✅ Search always small width */}
// // //           <div
// // //             className={cx(
// // //               "relative",
// // //               // fixed widths so it NEVER eats space
// // //               "w-[150px] xs:w-[170px] sm:w-[220px] md:w-[260px]"
// // //             )}
// // //           >
// // //             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
// // //             <input
// // //               type="text"
// // //               placeholder="Search…"
// // //               value={searchQuery}
// // //               onChange={(e) => onSearchQueryChange(e.target.value)}
// // //               className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white
// // //                          shadow-sm focus:outline-none focus:ring-2
// // //                          focus:ring-indigo-500/20 focus:border-indigo-300 transition text-sm"
// // //             />
// // //           </div>

// // //           {/* ✅ Timezone: full on desktop, icon-only on mobile */}
// // //           <div className="hidden sm:block">
// // //             <TimezonePicker compact />
// // //           </div>
// // //           <button
// // //             type="button"
// // //             className="sm:hidden h-9 w-9 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 flex items-center justify-center"
// // //             aria-label="Timezone"
// // //             onClick={() => {
// // //               // If your TimezonePicker supports opening programmatically, do it here.
// // //               // Otherwise keep icon-only for mobile to avoid layout break.
// // //             }}
// // //           >
// // //             <Globe className="h-4 w-4 text-slate-600" />
// // //           </button>

// // //           {/* Profile */}
// // //           <div className="relative">
// // //             <button
// // //               type="button"
// // //               onClick={(e) => {
// // //                 e.stopPropagation();
// // //                 setProfileOpen((v) => !v);
// // //               }}
// // //               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
// // //                          hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
// // //             >
// // //               <img
// // //                 src={avatarSrc}
// // //                 alt="me"
// // //                 className="h-9 w-9 rounded-full object-cover"
// // //                 referrerPolicy="no-referrer"
// // //                 onError={(e) => {
// // //                   e.currentTarget.src = "/menwithtab.png";
// // //                 }}
// // //               />
// // //               <ChevronDown className="hidden sm:block h-4 w-4 text-slate-400" />
// // //             </button>

// // //             {profileOpen && (
// // //               <div
// // //                 className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-[9999]"
// // //                 onClick={(e) => e.stopPropagation()}
// // //               >
// // //                 <div className="px-4 py-3 border-b border-slate-100">
// // //                   <div className="text-sm font-semibold truncate">{displayName}</div>
// // //                   <div className="text-xs text-slate-500 truncate">{displayEmail}</div>
// // //                 </div>

// // //                 <button
// // //                   type="button"
// // //                   onClick={(e) => {
// // //                     e.stopPropagation();
// // //                     handleLogout();
// // //                   }}
// // //                   className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
// // //                 >
// // //                   <LogOut className="w-4 h-4" />
// // //                   Logout
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </header>
// // //   );
// // // }


// // "use client";

// // import React, { useEffect, useRef, useState } from "react";
// // import { Search, LogOut, ChevronDown } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import { UserProfile } from "../../types";
// // import TimezonePicker from "../TimezonePicker";

// // function cx(...classes: Array<string | false | null | undefined>) {
// //   return classes.filter(Boolean).join(" ");
// // }

// // export default function Topbar({
// //   user,
// //   searchQuery,
// //   onSearchQueryChange,
// //   title = "Your Schedule",
// // }: {
// //   user: UserProfile | null;
// //   searchQuery: string;
// //   onSearchQueryChange: (v: string) => void;
// //   title?: string;
// // }) {
// //   const router = useRouter();
// //   const [profileOpen, setProfileOpen] = useState(false);
// //   const wrapRef = useRef<HTMLDivElement | null>(null);

// //   useEffect(() => {
// //     const onDocClick = (e: MouseEvent) => {
// //       const t = e.target as Node;
// //       if (!wrapRef.current?.contains(t)) setProfileOpen(false);
// //     };
// //     const onKeyDown = (e: KeyboardEvent) => {
// //       if (e.key === "Escape") setProfileOpen(false);
// //     };
// //     document.addEventListener("click", onDocClick);
// //     document.addEventListener("keydown", onKeyDown);
// //     return () => {
// //       document.removeEventListener("click", onDocClick);
// //       document.removeEventListener("keydown", onKeyDown);
// //     };
// //   }, []);

// //   const handleLogout = () => {
// //     try {
// //       setProfileOpen(false);

// //       localStorage.removeItem("access_token");
// //       localStorage.removeItem("refresh_token");
// //       localStorage.removeItem("token");
// //       localStorage.removeItem("user");
// //       localStorage.removeItem("slotly_user");

// //       sessionStorage.removeItem("access_token");
// //       sessionStorage.removeItem("refresh_token");
// //       sessionStorage.removeItem("token");
// //       sessionStorage.removeItem("user");
// //       sessionStorage.removeItem("slotly_user");

// //       document.cookie = "access_token=; Max-Age=0; path=/";
// //       document.cookie = "refresh_token=; Max-Age=0; path=/";
// //       document.cookie = "token=; Max-Age=0; path=/";

// //       router.replace("/login");
// //       router.refresh();
// //     } catch (e) {
// //       console.error("Logout failed:", e);
// //       router.replace("/login");
// //       router.refresh();
// //     }
// //   };

// //   const avatarSrc =
// //     (user as any)?.avatarUrl ||
// //     (user as any)?.avatar_url ||
// //     (user as any)?.picture ||
// //     "/menwithtab.png";

// //   const displayName = (user as any)?.name || "User";
// //   const displayEmail = (user as any)?.email || "";

// //   return (
// //     <header ref={wrapRef} className="w-full">
// //       <div className="w-full flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
// //         {/* Left: Title */}
// //         <div className="min-w-0">
// //           <h1 className="text-[24px] sm:text-[28px] font-bold text-slate-800 truncate">
// //             {title}
// //           </h1>
// //           <div className="hidden sm:block text-[15px] text-slate-600 truncate">
// //             Manage your meetings quickly.
// //           </div>
// //         </div>

// //         {/* Right group */}
// //         <div className="flex items-center gap-2 sm:gap-3 flex-nowrap shrink-0">
// //           {/* Search */}
// //           <div
// //             className={cx("relative", "w-[150px] xs:w-[170px] sm:w-[220px] md:w-[260px]")}
// //             onMouseDown={(e) => e.stopPropagation()}
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
// //             <input
// //               type="text"
// //               inputMode="search"
// //               autoComplete="off"
// //               spellCheck={false}
// //               placeholder="Search…"
// //               value={searchQuery}
// //               onChange={(e) => onSearchQueryChange(e.target.value)}
// //               className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition text-sm"
// //             />
// //           </div>

// //           {/* ✅ Timezone: same component, NO extra button, NO extra space */}
        
// //           <div className="hidden sm:block">
// //             <TimezonePicker compact />
// //           </div>

// //           {/* mobile: EXACT 36px box, cannot grow */}
// //           <div className="sm:hidden w-9 h-9 shrink-0 overflow-hidden">
// //             <TimezonePicker compact compactTrigger="icon" />
// //           </div>

// //           {/* Profile */}
// //           <div className="relative">
// //             <button
// //               type="button"
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 setProfileOpen((v) => !v);
// //               }}
// //               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
// //                          hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
// //             >
// //               <img
// //                 src={avatarSrc}
// //                 alt="me"
// //                 className="h-9 w-9 rounded-full object-cover"
// //                 referrerPolicy="no-referrer"
// //                 onError={(e) => {
// //                   e.currentTarget.src = "/menwithtab.png";
// //                 }}
// //               />
// //               <ChevronDown className="hidden sm:block h-4 w-4 text-slate-400" />
// //             </button>

// //             {profileOpen && (
// //               <div
// //                 className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-[9999]"
// //                 onClick={(e) => e.stopPropagation()}
// //               >
// //                 <div className="px-4 py-3 border-b border-slate-100">
// //                   <div className="text-sm font-semibold truncate">{displayName}</div>
// //                   <div className="text-xs text-slate-500 truncate">{displayEmail}</div>
// //                 </div>

// //                 <button
// //                   type="button"
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     handleLogout();
// //                   }}
// //                   className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
// //                 >
// //                   <LogOut className="w-4 h-4" />
// //                   Logout
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }


// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Search, LogOut, ChevronDown } from "lucide-react";
// import { usePathname, useRouter } from "next/navigation";
// import { UserProfile } from "../../types";
// import TimezonePicker from "../TimezonePicker";

// function cx(...classes: Array<string | false | null | undefined>) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function Topbar({
//   user,
//   searchQuery,
//   onSearchQueryChange,
//   title = "Your Schedule",
//   // searchEnabled = false,
// }: {
//   user: UserProfile | null;
//   searchQuery: string;
//   onSearchQueryChange: (v: string) => void;
//   title?: string;
//   // searchEnabled?: boolean;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const isDashboardSearchPage = pathname === "/dashboard";
//   const [profileOpen, setProfileOpen] = useState(false);
//   const wrapRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const onDocClick = (e: MouseEvent) => {
//       const t = e.target as Node;
//       if (!wrapRef.current?.contains(t)) setProfileOpen(false);
//     };
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setProfileOpen(false);
//     };
//     document.addEventListener("click", onDocClick);
//     document.addEventListener("keydown", onKeyDown);
//     return () => {
//       document.removeEventListener("click", onDocClick);
//       document.removeEventListener("keydown", onKeyDown);
//     };
//   }, []);

//   const handleLogout = () => {
//     try {
//       setProfileOpen(false);

//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       localStorage.removeItem("slotly_user");

//       sessionStorage.removeItem("access_token");
//       sessionStorage.removeItem("refresh_token");
//       sessionStorage.removeItem("token");
//       sessionStorage.removeItem("user");
//       sessionStorage.removeItem("slotly_user");

//       document.cookie = "access_token=; Max-Age=0; path=/";
//       document.cookie = "refresh_token=; Max-Age=0; path=/";
//       document.cookie = "token=; Max-Age=0; path=/";

//       router.replace("/login");
//       router.refresh();
//     } catch (e) {
//       console.error("Logout failed:", e);
//       router.replace("/login");
//       router.refresh();
//     }
//   };

//   const avatarSrc =
//     (user as any)?.avatarUrl ||
//     (user as any)?.avatar_url ||
//     (user as any)?.picture ||
//     "/menwithtab.png";

//   const displayName = (user as any)?.name || "User";
//   const displayEmail = (user as any)?.email || "";

//   return (
//     <header ref={wrapRef} className="w-full">
//       <div className="w-full flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
//         {/* Left: Title */}
//         <div className="min-w-0">
//           <h1 className="text-[24px] sm:text-[28px] font-bold text-slate-800 truncate">
//             {title}
//           </h1>
//           <div className="hidden sm:block text-[15px] text-slate-600 truncate">
//             Manage your meetings quickly.
//           </div>
//         </div>

//         {/* Right group */}
//         <div className="flex items-center gap-2 sm:gap-3 flex-nowrap shrink-0">
//           {/* Search */}
//           <div
//             className={cx("relative", "w-[150px] xs:w-[170px] sm:w-[220px] md:w-[260px]")}
//             onMouseDown={(e) => e.stopPropagation()}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               inputMode="search"
//               autoComplete="off"
//               spellCheck={false}
//               placeholder={isDashboardSearchPage ? "Search…" : "Search unavailable"}
//               value={searchQuery}
//               onChange={(e) => {
//                 if (!isDashboardSearchPage) return;
//                 onSearchQueryChange(e.target.value);
//               }}
//               disabled={!isDashboardSearchPage}
//               className={cx(
//                 "w-full h-9 pl-9 pr-3 rounded-xl border shadow-sm transition text-sm",
//                 isDashboardSearchPage
//                   ? "border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
//                   : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
//               )}
//             />
//           </div>

//           <div className="hidden sm:block">
//             <TimezonePicker compact />
//           </div>

//           <div className="sm:hidden w-9 h-9 shrink-0 overflow-hidden">
//             <TimezonePicker compact compactTrigger="icon" />
//           </div>

//           {/* Profile */}
//           <div className="relative">
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setProfileOpen((v) => !v);
//               }}
//               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
//                          hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
//             >
//               <img
//                 src={avatarSrc}
//                 alt="me"
//                 className="h-9 w-9 rounded-full object-cover"
//                 referrerPolicy="no-referrer"
//                 onError={(e) => {
//                   e.currentTarget.src = "/menwithtab.png";
//                 }}
//               />
//               <ChevronDown className="hidden sm:block h-4 w-4 text-slate-400" />
//             </button>

//             {profileOpen && (
//               <div
//                 className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-[9999]"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="px-4 py-3 border-b border-slate-100">
//                   <div className="text-sm font-semibold truncate">{displayName}</div>
//                   <div className="text-xs text-slate-500 truncate">{displayEmail}</div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleLogout();
//                   }}
//                   className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }



// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Search, LogOut, ChevronDown } from "lucide-react";
// import { usePathname, useRouter } from "next/navigation";
// import { UserProfile } from "../../types";
// import TimezonePicker from "../TimezonePicker";

// function cx(...classes: Array<string | false | null | undefined>) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function Topbar({
//   user,
//   searchQuery,
//   onSearchQueryChange,
//   title = "Your Schedule",
// }: {
//   user: UserProfile | null;
//   searchQuery: string;
//   onSearchQueryChange: (v: string) => void;
//   title?: string;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [profileOpen, setProfileOpen] = useState(false);
//   const wrapRef = useRef<HTMLDivElement | null>(null);

//   const isDashboardSearchPage = pathname === "/dashboard";

//   useEffect(() => {
//     const onDocClick = (e: MouseEvent) => {
//       const t = e.target as Node;
//       if (!wrapRef.current?.contains(t)) setProfileOpen(false);
//     };
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setProfileOpen(false);
//     };
//     document.addEventListener("click", onDocClick);
//     document.addEventListener("keydown", onKeyDown);
//     return () => {
//       document.removeEventListener("click", onDocClick);
//       document.removeEventListener("keydown", onKeyDown);
//     };
//   }, []);

//   const handleLogout = () => {
//     try {
//       setProfileOpen(false);

//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       localStorage.removeItem("slotly_user");

//       sessionStorage.removeItem("access_token");
//       sessionStorage.removeItem("refresh_token");
//       sessionStorage.removeItem("token");
//       sessionStorage.removeItem("user");
//       sessionStorage.removeItem("slotly_user");

//       document.cookie = "access_token=; Max-Age=0; path=/";
//       document.cookie = "refresh_token=; Max-Age=0; path=/";
//       document.cookie = "token=; Max-Age=0; path=/";

//       router.replace("/login");
//       router.refresh();
//     } catch (e) {
//       console.error("Logout failed:", e);
//       router.replace("/login");
//       router.refresh();
//     }
//   };

//   const avatarSrc =
//     (user as any)?.avatarUrl ||
//     (user as any)?.avatar_url ||
//     (user as any)?.picture ||
//     "/menwithtab.png";

//   const displayName = (user as any)?.name || "User";
//   const displayEmail = (user as any)?.email || "";

//   return (
//     <header ref={wrapRef} className="w-full">
//       <div className="w-full flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
//         <div className="min-w-0">
//           <h1 className="text-[24px] sm:text-[28px] font-bold text-slate-800 truncate">
//             {title}
//           </h1>
//           <div className="hidden sm:block text-[15px] text-slate-600 truncate">
//             Manage your meetings quickly.
//           </div>
//         </div>

//         <div className="flex items-center gap-2 sm:gap-3 flex-nowrap shrink-0">
//           <div
//             className={cx("relative", "w-[150px] xs:w-[170px] sm:w-[220px] md:w-[260px]")}
//             onMouseDown={(e) => e.stopPropagation()}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               inputMode="search"
//               autoComplete="off"
//               spellCheck={false}
//               placeholder={isDashboardSearchPage ? "Search…" : "Search unavailable"}
//               value={searchQuery}
//               onChange={(e) => {
//                 if (!isDashboardSearchPage) return;
//                 onSearchQueryChange(e.target.value);
//               }}
//               disabled={!isDashboardSearchPage}
//               className={cx(
//                 "w-full h-9 pl-9 pr-3 rounded-xl border shadow-sm transition text-sm",
//                 isDashboardSearchPage
//                   ? "border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
//                   : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
//               )}
//             />
//           </div>

//           <div className="hidden sm:block">
//             <TimezonePicker compact />
//           </div>

//           <div className="sm:hidden w-9 h-9 shrink-0 overflow-hidden">
//             <TimezonePicker compact compactTrigger="icon" />
//           </div>

//           <div className="relative">
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setProfileOpen((v) => !v);
//               }}
//               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
//                          hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
//             >
//               <img
//                 src={avatarSrc}
//                 alt="me"
//                 className="h-9 w-9 rounded-full object-cover"
//                 referrerPolicy="no-referrer"
//                 onError={(e) => {
//                   e.currentTarget.src = "/menwithtab.png";
//                 }}
//               />
//               <ChevronDown className="hidden sm:block h-4 w-4 text-slate-400" />
//             </button>

//             {profileOpen && (
//               <div
//                 className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-[9999]"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="px-4 py-3 border-b border-slate-100">
//                   <div className="text-sm font-semibold truncate">{displayName}</div>
//                   <div className="text-xs text-slate-500 truncate">{displayEmail}</div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleLogout();
//                   }}
//                   className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, LogOut, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { UserProfile } from "../../types";
import TimezonePicker from "../TimezonePicker";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Topbar({
  user,
  searchQuery,
  onSearchQueryChange,
  title = "Your Schedule",
}: {
  user: UserProfile | null;
  searchQuery: string;
  onSearchQueryChange: (v: string) => void;
  title?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const isDashboardSearchPage = pathname === "/dashboard";

  useEffect(() => {
    setLocalSearch(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    if (!isDashboardSearchPage) {
      setLocalSearch("");
    }
  }, [isDashboardSearchPage]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapRef.current?.contains(t)) setProfileOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleLogout = () => {
    try {
      setProfileOpen(false);

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("slotly_user");

      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("slotly_user");

      document.cookie = "access_token=; Max-Age=0; path=/";
      document.cookie = "refresh_token=; Max-Age=0; path=/";
      document.cookie = "token=; Max-Age=0; path=/";

      router.replace("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
      router.replace("/login");
      router.refresh();
    }
  };

  const handleSearchChange = (value: string) => {
    if (!isDashboardSearchPage) return;

    setLocalSearch(value);
    onSearchQueryChange(value);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("slotly-dashboard-search", {
          detail: value,
        })
      );
    }
  };

  const avatarSrc =
    (user as any)?.avatarUrl ||
    (user as any)?.avatar_url ||
    (user as any)?.picture ||
    "/menwithtab.png";

  const displayName = (user as any)?.name || "User";
  const displayEmail = (user as any)?.email || "";

  return (
    <header ref={wrapRef} className="w-full">
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
        <div className="min-w-0">
          <h1 className="text-[24px] sm:text-[28px] font-bold text-slate-800 truncate">
            {title}
          </h1>
          <div className="hidden sm:block text-[15px] text-slate-600 truncate">
            Manage your meetings quickly.
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-nowrap shrink-0">
          <div
            className={cx("relative", "w-[150px] xs:w-[170px] sm:w-[220px] md:w-[260px]")}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              inputMode="search"
              autoComplete="off"
              spellCheck={false}
              placeholder={isDashboardSearchPage ? "Search..." : "Search unavailable"}
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={!isDashboardSearchPage}
              className={cx(
                "w-full h-9 pl-9 pr-3 rounded-xl border shadow-sm transition text-sm",
                isDashboardSearchPage
                  ? "border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                  : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              )}
            />
          </div>

          <div className="hidden sm:block">
            <TimezonePicker compact />
          </div>

          <div className="sm:hidden w-9 h-9 shrink-0 overflow-hidden">
            <TimezonePicker compact compactTrigger="icon" />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((v) => !v);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white
                         hover:bg-slate-50 px-2 py-1.5 transition shadow-sm"
            >
              <img
                src={avatarSrc}
                alt="me"
                className="h-9 w-9 rounded-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "/menwithtab.png";
                }}
              />
              <ChevronDown className="hidden sm:block h-4 w-4 text-slate-400" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-[9999]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="text-sm font-semibold truncate">{displayName}</div>
                  <div className="text-xs text-slate-500 truncate">{displayEmail}</div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
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
    </header>
  );
}