// // src/app/dashboard/components/Sidebar/Sidebar.tsx
// "use client";
// import React from "react";
// import SidebarToggle from "./SidebarToggle";
// import NavItem from "./NavItem";
// import { Calendar, PlusCircle, User, BellRing, Settings } from "lucide-react";
// import NewEventModal from "./components/NewEvent/NewEventModal";

// type Props = { open: boolean; onToggle: () => void };

// export default function Sidebar({ open, onToggle }: Props) {
//   return (
//     <aside className={`${open ? "w-64" : "w-16"} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
//       <div className="flex items-center gap-3 px-4 py-5">
//         <SidebarToggle onToggle={onToggle} />
//         {open && <div className="text-2xl font-bold text-blue-600">Slotly</div>}
//       </div>

//       <nav className="mt-6 px-2 flex-1">
//         <NavItem icon={<Calendar className="w-5 h-5" />} label="Calendar" active />
//         <NavItem icon={<PlusCircle className="w-5 h-5" />} label="Event Types" />
//         <NavItem icon={<User className="w-5 h-5" />} label="Contacts" />
//         <NavItem icon={<BellRing className="w-5 h-5" />} label="Notifications" />
//         <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
//       </nav>

//       <div className="px-4 py-4">
//         <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm">
//           <PlusCircle className="w-4 h-4" />
//           {open && <span>New Event</span>}
//         </button>
//       </div>

//       <div className="px-4 py-4 border-t border-gray-100">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">JD</div>
//           {open && (
//             <div>
//               <div className="font-semibold">John Doe</div>
//               <div className="text-xs text-gray-500">Founder</div>
//             </div>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// }

// "use client";

// import React, { useState } from "react";
// import SidebarToggle from "./SidebarToggle";
// import NavItem from "./NavItem";
// import { Calendar, PlusCircle, User, BellRing, Settings } from "lucide-react";

// // ✅ Correct import path for modal
// import NewEventModal from "../NewEvent/NewEventModal";

// export default function Sidebar({ open, onToggle, user }: any) {
//   // Modal state
//   const [openNewEvent, setOpenNewEvent] = useState(false);

//   return (
//     <>
//       {/* SIDEBAR UI */}
//       <aside
//         className={`${
//           open ? "w-64" : "w-16"
//         } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}
//       >
//         {/* Top Logo + Toggle */}
//         <div className="flex items-center gap-3 px-4 py-5">
//           <SidebarToggle onToggle={onToggle} />
//           {open && (
//             <div className="text-2xl font-bold text-blue-600">Slotly</div>
//           )}
//         </div>

//         {/* Navigation */}
//         <nav className="mt-6 px-2 flex-1">
//           <NavItem icon={<Calendar className="w-5 h-5" />} label="Calendar" active />
//           <NavItem icon={<PlusCircle className="w-5 h-5" />} label="Event Types" />
//           <NavItem icon={<User className="w-5 h-5" />} label="Contacts" />
//           <NavItem icon={<BellRing className="w-5 h-5" />} label="Notifications" />
//           <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
//         </nav>

//         {/* NEW EVENT BUTTON */}
//         <div className="px-4 py-4">
//           <button
//             onClick={() => setOpenNewEvent(true)}
//             className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm"
//           >
//             <PlusCircle className="w-4 h-4" />
//             {open && <span>New Event</span>}
//           </button>
//         </div>

//         {/* User Profile Footer */}
//         <div className="px-4 py-4 border-t border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">
//               JD
//             </div>
//             {open && (
//               <div>
//                 <div className="font-semibold">John Doe</div>
//                 <div className="text-xs text-gray-500">Founder</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* NEW EVENT MODAL */}
//       <NewEventModal
//         open={openNewEvent}
//         onClose={() => setOpenNewEvent(false)}
//         user={user}
//       />
//     </>
//   );
// }

"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import SidebarToggle from "./SidebarToggle";
import NavItem from "./NavItem";
import { Calendar, PlusCircle, User, BellRing, Settings } from "lucide-react";

export default function Sidebar({ open, onToggle, user }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const nav = [
    {
      label: "Calendar",
      icon: <Calendar className="w-5 h-5" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Event Types",
      icon: <PlusCircle className="w-5 h-5" />,
      href: "/dashboard/event-types",
      active: pathname?.startsWith("/dashboard/event-types"),
    },
    {
      label: "Contacts",
      icon: <User className="w-5 h-5" />,
      href: "/dashboard/contacts",
      active: pathname?.startsWith("/dashboard/contacts"),
      disabled: true, // until built
    },
    {
      label: "Notifications",
      icon: <BellRing className="w-5 h-5" />,
      href: "/dashboard/notifications",
      active: pathname?.startsWith("/dashboard/notifications"),
      disabled: true,
    },
    {
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/dashboard/settings",
      active: pathname?.startsWith("/dashboard/settings"),
      disabled: true,
    },
  ];

  const initials =
    (user?.name || user?.email || "U")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s: string) => s[0]?.toUpperCase())
      .join("") || "U";

  return (
    <aside
      className={[
        open ? "w-72" : "w-16",
        "transition-all duration-300 bg-white border-r border-gray-100 flex flex-col",
      ].join(" ")}
    >
      {/* Top Brand + Toggle */}
      <div className="flex items-center gap-3 px-4 py-5">
        <SidebarToggle onToggle={onToggle} />
        {open && (
          <div className="flex flex-col leading-tight">
            <div className="text-2xl font-bold text-indigo-600">Slotly</div>
            <div className="text-xs text-gray-400">Dashboard</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-2 px-2 flex-1 space-y-1">
        {nav.map((n) => (
          <div key={n.label} title={!open ? n.label : undefined}>
            <NavItem
              icon={n.icon}
              label={n.label}
              active={!!n.active}
              onClick={() => {
                if (n.disabled) return;
                router.push(n.href);
              }}
              disabled={n.disabled}
              compact={!open}
            />
          </div>
        ))}
      </nav>

      {/* Primary CTA */}
      <div className="px-4 py-4">
        <button
          onClick={() => router.push("/book")}
          className={[
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
            "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition",
            !open ? "justify-center" : "",
          ].join(" ")}
          title={!open ? "New Event" : undefined}
        >
          <PlusCircle className="w-4 h-4" />
          {open && <span>New Event</span>}
        </button>
      </div>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div
          className={[
            "flex items-center gap-3",
            !open ? "justify-center" : "",
          ].join(" ")}
        >
          {user?.avatarUrl || user?.picture ? (
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
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              {initials}
            </div>
          )}

          {open && (
            <div className="min-w-0">
              <div className="font-semibold truncate">
                {user?.name || "User"}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.email}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
