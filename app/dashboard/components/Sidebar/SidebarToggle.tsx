"use client";

import React from "react";
import { Menu } from "lucide-react";

export default function SidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
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
      <Menu className="w-5 h-5 text-slate-700" />
    </button>
  );
}

