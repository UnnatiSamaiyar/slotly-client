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
import { useRouter } from "next/navigation";
import SidebarToggle from "./SidebarToggle";
import NavItem from "./NavItem";
import { Calendar, PlusCircle, User, BellRing, Settings } from "lucide-react";

export default function Sidebar({ open, onToggle, user }: any) {
  const router = useRouter();

  return (
    <aside
      className={`${
        open ? "w-64" : "w-16"
      } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}
    >
      {/* Top Logo + Toggle */}
      <div className="flex items-center gap-3 px-4 py-5">
        <SidebarToggle onToggle={onToggle} />
        {open && (
          <div className="text-2xl font-bold text-blue-600">Slotly</div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2 flex-1">
        <NavItem
          icon={<Calendar className="w-5 h-5" />}
          label="Calendar"
          active
        />
        <NavItem
          icon={<PlusCircle className="w-5 h-5" />}
          label="Event Types"
        />
        <NavItem icon={<User className="w-5 h-5" />} label="Contacts" />
        <NavItem icon={<BellRing className="w-5 h-5" />} label="Notifications" />
        <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
      </nav>

      {/* NEW EVENT BUTTON → redirects to /book */}
      <div className="px-4 py-4">
        <button
          onClick={() => router.push("/book")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          {open && <span>New Event</span>}
        </button>
      </div>

      {/* User Profile Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">
            JD
          </div>
          {open && (
            <div>
              <div className="font-semibold">John Doe</div>
              <div className="text-xs text-gray-500">Founder</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
