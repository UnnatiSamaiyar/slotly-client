<<<<<<< HEAD
// src/app/dashboard/components/Sidebar/SidebarToggle.tsx
"use client";
=======
"use client";

>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
import React from "react";
import { Menu } from "lucide-react";

export default function SidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
<<<<<<< HEAD
    <button onClick={onToggle} className="p-1 rounded-md hover:bg-gray-100">
=======
    <button
      onClick={onToggle}
      aria-label="Toggle sidebar"
      className="
        p-2 rounded-xl
        border border-gray-200
        bg-white
        hover:bg-gray-50
        active:scale-95
        transition
      "
    >
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
      <Menu className="w-5 h-5 text-slate-700" />
    </button>
  );
}
<<<<<<< HEAD
=======

>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
