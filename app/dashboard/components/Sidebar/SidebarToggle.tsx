// src/app/dashboard/components/Sidebar/SidebarToggle.tsx
"use client";
import React from "react";
import { Menu } from "lucide-react";

export default function SidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="p-1 rounded-md hover:bg-gray-100">
      <Menu className="w-5 h-5 text-slate-700" />
    </button>
  );
}
