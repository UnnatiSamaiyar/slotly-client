"use client";

import React from "react";
import { Menu } from "lucide-react";

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
      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
    >
      <Menu className="h-[18px] w-[18px]" />
    </button>
  );
}
