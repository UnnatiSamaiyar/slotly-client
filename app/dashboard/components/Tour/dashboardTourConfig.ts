export const DASHBOARD_TOUR_ID = "dashboard-intro";
export const DASHBOARD_TOUR_VERSION = "2026.05.phase1";
export const DASHBOARD_TOUR_START_EVENT = "slotly:start-dashboard-tour";

export type DashboardTourStep = {
  selectors: string[];
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

export const DASHBOARD_INTRO_TOUR_STEPS: DashboardTourStep[] = [
  {
    selectors: ['[data-tour="sidebar-navigation"]', '[data-tour="mobile-sidebar-toggle"]'],
    title: "Workspace navigation",
    description:
      "Use this sidebar to move between your dashboard, schedule, people, event types, notifications, and settings.",
    side: "right",
    align: "center",
  },
  {
    selectors: ['[data-tour="dashboard-overview"]'],
    title: "Dashboard overview",
    description:
      "This is your main workspace overview with event types, calendar activity, and upcoming meetings in one place.",
    side: "top",
    align: "start",
  },
  {
    selectors: ['[data-tour="topbar-area"]'],
    title: "Topbar controls",
    description:
      "The topbar gives you quick page actions, search on supported pages, and access to this guided tour anytime.",
    side: "bottom",
    align: "end",
  },
  {
    selectors: ['[data-tour="topbar-create-event-type"]'],
    title: "Create event types quickly",
    description:
      "Start a new booking page from here without leaving your current dashboard flow.",
    side: "bottom",
    align: "end",
  },
  {
    selectors: ['[data-tour="sidebar-event-types"]', '[data-tour="dashboard-event-types"]'],
    title: "Event Types",
    description:
      "Event types are the booking pages your guests use to schedule meetings with you.",
    side: "right",
    align: "center",
  },
  {
    selectors: ['[data-tour="sidebar-schedule"]'],
    title: "Schedule and availability",
    description:
      "Control your working hours and availability rules from the Schedule section.",
    side: "right",
    align: "center",
  },
  {
    selectors: ['[data-tour="sidebar-contacts"]'],
    title: "People and contacts",
    description:
      "Manage contacts and people records that are part of your scheduling workflow.",
    side: "right",
    align: "center",
  },
  {
    selectors: ['[data-tour="topbar-notifications"]'],
    title: "Notifications",
    description:
      "Check booking activity, updates, cancellations, and system notifications from here.",
    side: "right",
    align: "center",
  },
  {
    selectors: ['[data-tour="settings-profile"]', '[data-tour="sidebar-settings"]'],
    title: "Profile and settings",
    description:
      "Review your profile, timezone, account settings, and workspace preferences from this area.",
    side: "top",
    align: "start",
  },
];
