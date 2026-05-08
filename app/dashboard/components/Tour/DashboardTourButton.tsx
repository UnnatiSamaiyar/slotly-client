"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { DASHBOARD_TOUR_START_EVENT } from "./dashboardTourConfig";

export default function DashboardTourButton() {
  const startTour = () => {
    window.dispatchEvent(new CustomEvent(DASHBOARD_TOUR_START_EVENT, { detail: { source: "manual" } }));
  };

  return (
    <button
      type="button"
      onClick={startTour}
      data-tour="topbar-tour-trigger"
      className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50/70 px-2.5 text-[12px] font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-100 active:scale-[0.97] sm:px-3"
      aria-label="Start dashboard tour"
    >
      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
      <span className="hidden lg:inline">Tour</span>
    </button>
  );
}
