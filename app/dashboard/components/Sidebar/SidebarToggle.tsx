"use client";

import React from "react";
import { Menu } from "lucide-react";
import { Calendar } from "lucide-react";

export default function SidebarToggle({
  onToggle,
}: {
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle sidebar"
      title="Toggle sidebar"
      className="
        flex items-center justify-center
        h-10 w-10
        rounded-lg
        text-slate-700
        hover:bg-slate-100
        transition
        active:scale-95
      "
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
