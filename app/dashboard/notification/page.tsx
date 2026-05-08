"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/app/dashboard/hooks/useNotification";
import NotificationItem from "../components/Notification/NotificationItem";

type FilterTab = "all" | "meetings" | "cancellations" | "system";

function matchesFilter(notif: any, tab: FilterTab): boolean {
  if (tab === "all") return true;

  const raw =
    `${notif.type || ""} ${notif.title || ""} ${notif.description || ""} ${notif.message || ""}`.toLowerCase();

  if (tab === "meetings") {
    return (
      raw.includes("booking") ||
      raw.includes("meeting") ||
      raw.includes("call") ||
      raw.includes("scheduled") ||
      raw.includes("reschedule")
    );
  }
  if (tab === "cancellations") {
    return (
      raw.includes("cancel") ||
      raw.includes("declined") ||
      raw.includes("removed")
    );
  }
  if (tab === "system") {
    return (
      raw.includes("integration") ||
      raw.includes("connected") ||
      raw.includes("disconnected") ||
      raw.includes("contact") ||
      raw.includes("analytics") ||
      raw.includes("report") ||
      raw.includes("summary") ||
      raw.includes("system") ||
      raw.includes("calendar")
    );
  }
  return true;
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All Activity" },
  { key: "meetings", label: "Meetings" },
  { key: "cancellations", label: "Cancellations" },
  { key: "system", label: "System" },
];

export default function NotificationPage() {
  const { notifications, markAllAsRead, markAsRead, unreadCount, loading } =
    useNotifications();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("slotly-notification-unread-count", {
        detail: unreadCount,
      }),
    );
  }, [unreadCount]);

  useEffect(() => {
    const handleMarkAllAsRead = () => {
      if (unreadCount <= 0) return;
      void markAllAsRead();
    };

    window.addEventListener(
      "slotly-notification-mark-all-as-read",
      handleMarkAllAsRead,
    );

    return () => {
      window.removeEventListener(
        "slotly-notification-mark-all-as-read",
        handleMarkAllAsRead,
      );
    };
  }, [markAllAsRead, unreadCount]);

  const filtered = notifications.filter((n: any) =>
    matchesFilter(n, activeTab),
  );

  const today = filtered.filter((n: any) => n.day === "today");
  const yesterday = filtered.filter((n: any) => n.day === "yesterday");
  const earlier = filtered.filter((n: any) => !n.day || n.day === "earlier");

  return (
    <div className="w-full px-3 pt-0 pb-6 sm:px-5 lg:px-6">
      {/* FILTER TABS */}
      <div className="mb-5 grid w-full grid-cols-4 gap-1.5 sm:gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
  min-w-0 truncate rounded-full border px-1.5 py-2 text-center text-[10px] font-medium transition
  xs:text-[11px] sm:px-3 sm:text-[13px]
  ${
    activeTab === tab.key
      ? "border-[#0A66C2] bg-[#E8F3FF] text-[#0A66C2]"
      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
  }
`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* CONTENT */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
          Loading notifications...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
          No notifications found.
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {today.length > 0 && (
            <section>
              <h2 className="mb-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Today
              </h2>
              <div className="space-y-3">
                {today.map((notif: any) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    markAsRead={markAsRead}
                  />
                ))}
              </div>
            </section>
          )}

          {yesterday.length > 0 && (
            <section>
              <h2 className="mb-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Yesterday
              </h2>
              <div className="space-y-3">
                {yesterday.map((notif: any) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    markAsRead={markAsRead}
                  />
                ))}
              </div>
            </section>
          )}

          {earlier.length > 0 && (
            <section>
              <h2 className="mb-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Earlier
              </h2>
              <div className="space-y-3">
                {earlier.map((notif: any) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    markAsRead={markAsRead}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
