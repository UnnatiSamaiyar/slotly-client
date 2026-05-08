"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckCheck, LogOut, PlusCircle, Search, UserPlus, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserProfile } from "../../types";
import DashboardTourButton from "../Tour/DashboardTourButton";

const TOPBAR_ROUTES = [
  { href: "/dashboard/your-schedule", title: "Schedule" },
  { href: "/dashboard/contacts", title: "People" },
  { href: "/dashboard/event-types", title: "Event Types" },
  { href: "/dashboard/notification", title: "Notifications" },
  { href: "/dashboard/settings", title: "Settings" },
] as const;

type TopbarSearchConfig = {
  key: string;
  eventName: string;
  placeholder: string;
};

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

function getRouteTitle(pathname: string | null, fallbackTitle: string) {
  const path = pathname || "/dashboard";

  const matchedRoute = [...TOPBAR_ROUTES]
    .sort((a, b) => b.href.length - a.href.length)
    .find((route) => path === route.href || path.startsWith(`${route.href}/`));

  return matchedRoute?.title || fallbackTitle;
}

function getTopbarSearchConfig(
  pathname: string | null,
  tabParam: string | null
): TopbarSearchConfig | null {
  const path = pathname || "";

  if (path === "/dashboard/contacts" || path.startsWith("/dashboard/contacts/")) {
    return {
      key: "contacts",
      eventName: "slotly-contacts-search",
      placeholder: "Search by name, email, or company…",
    };
  }

  if (path === "/dashboard/event-types" || path.startsWith("/dashboard/event-types/")) {
    const activeTab = (tabParam || "").toLowerCase() === "meetings" ? "meetings" : "event-types";

    if (activeTab === "meetings") {
      return {
        key: "meetings",
        eventName: "slotly-meetings-search",
        placeholder: "Search meetings…",
      };
    }

    return {
      key: "event-types",
      eventName: "slotly-event-types-search",
      placeholder: "Search event types…",
    };
  }

  return null;
}

export default function Topbar({
  user,
  searchQuery,
  onSearchQueryChange,
  title = "Dashboard",
  onCreateEventTypeClick,
}: {
  user: UserProfile | null;
  searchQuery: string;
  onSearchQueryChange: (v: string) => void;
  title?: string;
  onCreateEventTypeClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const searchConfig = useMemo(
    () => getTopbarSearchConfig(pathname, tabParam),
    [pathname, tabParam]
  );

  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [now, setNow] = useState(() => Date.now());
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const isDashboardPage = pathname === "/dashboard";
  const isNotificationPage =
    pathname === "/dashboard/notification" ||
    pathname?.startsWith("/dashboard/notification/");
  const fullName = (user as any)?.name || "User";
  const firstName = fullName.split(" ")[0];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleUnreadCount = (event: Event) => {
      const count = Number((event as CustomEvent<number>).detail || 0);
      setNotificationUnreadCount(Number.isFinite(count) ? count : 0);
    };

    window.addEventListener(
      "slotly-notification-unread-count",
      handleUnreadCount
    );

    return () => {
      window.removeEventListener(
        "slotly-notification-unread-count",
        handleUnreadCount
      );
    };
  }, []);

  useEffect(() => {
    if (!isNotificationPage) {
      setNotificationUnreadCount(0);
    }
  }, [isNotificationPage]);

  useEffect(() => {
    setLocalSearch(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    setLocalSearch("");
    setMobileSearchOpen(false);

    if (searchConfig) {
      window.dispatchEvent(new CustomEvent(searchConfig.eventName, { detail: "" }));
    }
  }, [searchConfig?.key, searchConfig?.eventName]);

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 50);
    }
  }, [mobileSearchOpen]);

  const greeting = useMemo(() => {
    try {
      const tz =
        (typeof window !== "undefined"
          ? localStorage.getItem("slotly_timezone")
          : null) ||
        (user as any)?.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        "UTC";

      const parts = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: tz,
      }).formatToParts(now);

      const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 12);
      return getGreeting(hour);
    } catch {
      return getGreeting(new Date(now).getHours());
    }
  }, [now, user]);

  const topbarTitle = useMemo(() => {
    if (isDashboardPage) return `${greeting}, ${firstName}`;
    return getRouteTitle(pathname, title);
  }, [firstName, greeting, isDashboardPage, pathname, title]);

  const topbarAction = useMemo(() => {
    const path = pathname || "";

    if (path === "/dashboard/contacts" || path.startsWith("/dashboard/contacts/")) {
      return {
        key: "add-contact",
        label: "Add Contact",
        mobileLabel: "Add",
        Icon: UserPlus,
        className:
          "bg-indigo-600 text-white shadow-[0_8px_18px_rgba(79,70,229,0.22)] hover:bg-indigo-700",
      };
    }

    if (path === "/dashboard/settings" || path.startsWith("/dashboard/settings/")) {
      return {
        key: "logout",
        label: "Logout",
        mobileLabel: "Logout",
        Icon: LogOut,
        className:
          "border border-red-200 bg-white text-red-600 shadow-sm hover:border-red-300 hover:bg-red-50",
      };
    }

    return {
      key: "create-event-type",
      label: "Create Event Type",
      mobileLabel: "New",
      Icon: PlusCircle,
      className:
        "bg-indigo-600 text-white shadow-[0_8px_18px_rgba(79,70,229,0.22)] hover:bg-indigo-700",
    };
  }, [pathname]);

  const handleMarkAllNotificationsRead = () => {
    if (notificationUnreadCount <= 0) return;

    window.dispatchEvent(new CustomEvent("slotly-notification-mark-all-as-read"));
    setNotificationUnreadCount(0);
  };

  const handleTopbarAction = () => {
    if (topbarAction.key === "add-contact") {
      window.dispatchEvent(new CustomEvent("slotly-open-create-contact"));
      return;
    }

    if (topbarAction.key === "logout") {
      try {
        [
          "slotly_user",
          "slotlyUser",
          "user",
          "auth_user",
          "slotly_token",
          "slotlyToken",
          "auth_token",
          "token",
        ].forEach((key) => localStorage.removeItem(key));
      } catch {
        // Keep logout redirect working even if storage access fails.
      }

      router.replace("/login");
      return;
    }

    if (onCreateEventTypeClick) {
      onCreateEventTypeClick();
      return;
    }

    window.dispatchEvent(new CustomEvent("slotly-open-create-event"));
  };

  const handleSearchChange = (value: string) => {
    if (!searchConfig) return;

    setLocalSearch(value);
    onSearchQueryChange(value);
    window.dispatchEvent(
      new CustomEvent(searchConfig.eventName, { detail: value })
    );
  };

  const clearSearch = () => handleSearchChange("");
  const TopbarActionIcon = topbarAction.Icon;

  return (
    <header data-tour="topbar-area" className="w-full border-b border-slate-200/70 bg-white/80 px-3 py-1.5 backdrop-blur-xl sm:px-4 lg:px-5">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="mt-0.5 truncate text-[15px] font-semibold leading-5 tracking-[-0.01em] text-slate-900 sm:text-[17px]">
            {topbarTitle}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <DashboardTourButton />
          {searchConfig ? (
            <button
              type="button"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 active:scale-95 sm:hidden"
            >
              {mobileSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>
          ) : null}

          {searchConfig ? (
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchConfig.placeholder}
                className="h-8 w-[190px] rounded-xl border border-slate-200/80 bg-white pl-8 pr-8 text-[13px] font-medium text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10 md:w-[240px] lg:w-[320px] xl:w-[360px]"
              />

              {localSearch.length > 0 ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          ) : null}

          {isNotificationPage ? (
            <button
              type="button"
              onClick={handleMarkAllNotificationsRead}
              disabled={notificationUnreadCount <= 0}
              className={`inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-xl border px-2.5 text-[12px] font-semibold shadow-sm transition active:scale-[0.97] sm:px-3 ${
                notificationUnreadCount > 0
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100"
                  : "cursor-not-allowed border-slate-200 bg-white text-slate-400"
              }`}
            >
              <CheckCheck className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">
                {notificationUnreadCount > 0 ? "Mark all as read" : "All read"}
              </span>
              <span className="md:hidden">
                {notificationUnreadCount > 0 ? "Read all" : "Read"}
              </span>
              {notificationUnreadCount > 0 ? (
                <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold leading-none text-white">
                  {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
                </span>
              ) : null}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleTopbarAction}
              data-tour={topbarAction.key === "create-event-type" ? "topbar-create-event-type" : undefined}
              className={`inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 text-[12px] font-semibold transition active:scale-[0.97] sm:px-3 ${topbarAction.className}`}
            >
              <TopbarActionIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">{topbarAction.label}</span>
              <span className="md:hidden">{topbarAction.mobileLabel}</span>
            </button>
          )}
        </div>
      </div>

      {searchConfig && mobileSearchOpen ? (
        <div className="mt-2 sm:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={mobileInputRef}
              type="search"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchConfig.placeholder}
              className="h-9 w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-9 text-[13px] font-medium text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10"
            />
            {localSearch.length > 0 ? (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
