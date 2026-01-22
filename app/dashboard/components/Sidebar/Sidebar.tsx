"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SidebarToggle from "./SidebarToggle";
import NavItem from "./NavItem";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { Calendar, PlusCircle, User, BellRing, Settings, Link2, Unlink, ShieldAlert } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.slotly.io").replace(/\/$/, "");

export default function Sidebar({ open, onToggle, user }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const userSub = useMemo(() => user?.sub || user?.user_sub || user?.id || "", [user]);
  const [calLoading, setCalLoading] = useState(false);
  const [calConnected, setCalConnected] = useState<boolean | null>(null);

  // ✅ SAFETY: returnTo will always be a relative path (never https://slotly.io/...)
  const safeReturnTo = useMemo(() => {
    const raw = String(pathname || "/dashboard");
    if (!raw.startsWith("/")) return "/dashboard";
    if (raw.includes("://")) return "/dashboard"; // just in case
    return raw;
  }, [pathname]);

  async function fetchCalendarStatus() {
    if (!userSub) {
      setCalConnected(false);
      return;
    }
    try {
      setCalLoading(true);
      const res = await fetch(`${API_BASE}/auth/calendar-status?user_sub=${encodeURIComponent(userSub)}`);
      const data = await res.json().catch(() => null);
      setCalConnected(Boolean(data?.calendar_connected));
    } catch {
      // non-blocking; keep UI usable
      setCalConnected(false);
    } finally {
      setCalLoading(false);
    }
  }

  async function disconnectCalendar() {
    if (!userSub) return;
    try {
      setCalLoading(true);
      const res = await fetch(`${API_BASE}/auth/calendar-disconnect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_sub: userSub }),
      });
      await res.json().catch(() => null);
      await fetchCalendarStatus();
    } catch {
      setCalLoading(false);
    }
  }

  useEffect(() => {
    fetchCalendarStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSub]);

  const nav = [
    {
      label: "Calendar",
      icon: <Calendar className="w-5 h-5" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Contacts",
      icon: <User className="w-5 h-5" />,
      href: "/dashboard/contacts",
      active: pathname?.startsWith("/dashboard/contacts"),
      disabled: false,
    },
    {
      label: "Event Types",
      icon: <PlusCircle className="w-5 h-5" />,
      href: "/dashboard/event-types",
      active: pathname?.startsWith("/dashboard/event-types"),
      disabled: true,
    },
    {
      label: "Notifications",
      icon: <BellRing className="w-5 h-5" />,
      href: "/dashboard/notifications",
      active: pathname?.startsWith("/dashboard/notifications"),
      disabled: true,
    },
    {
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/dashboard/settings",
      active: pathname?.startsWith("/dashboard/settings"),
      disabled: true,
    },
  ];

  const initials =
    (user?.name || user?.email || "U")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s: string) => s[0]?.toUpperCase())
      .join("") || "U";

  return (
    <aside
      className={[
        open ? "w-72" : "w-16",
        "transition-all duration-300 bg-white border-r border-gray-100 flex flex-col",
      ].join(" ")}
    >
      {/* Top Brand + Toggle */}
      <div className="flex items-center gap-3 px-4 py-5">
        <SidebarToggle onToggle={onToggle} />

        {open && (
          <div className="flex flex-col leading-tight">
            <img
              src="/assets/Slotlyio-logo.png"
              alt="Slotly"
              className="h-7 w-auto object-contain"
              draggable={false}
            />
            <div className="text-xs text-gray-400 mt-0.5">Dashboard</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-2 px-2 flex-1 space-y-1">
        {nav.map((n) => (
          <div key={n.label} title={!open ? n.label : undefined}>
            <NavItem
              icon={n.icon}
              label={n.label}
              active={!!n.active}
              onClick={() => {
                if (n.disabled) return;
                router.push(n.href);
              }}
              disabled={n.disabled}
              compact={!open}
            />
          </div>
        ))}
      </nav>

      {/* Calendar Permission (post-login, user initiated) */}
      <div
        className={["px-2", open ? "pb-2" : "pb-3"].join(" ")}
        title={!open ? "Google Calendar Sync" : undefined}
      >
        {open ? (
          <div className="mx-2 rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-[#f7f9ff] p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-indigo-600" />
                  <div className="text-sm font-semibold text-slate-900">Google Calendar Sync</div>
                </div>
                <div className="mt-1 text-xs text-slate-500 leading-snug">
                  Optional. Connect only if you want Slotly to create/update meetings in your calendar.
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-end gap-2">
                <div
                  className={[
                    "text-[11px] font-semibold px-2 py-1 rounded-full",
                    calConnected ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600",
                  ].join(" ")}
                >
                  {calLoading ? "Checking…" : calConnected ? "Connected" : "Not connected"}
                </div>

                {/* Toggle */}
                <button
                  type="button"
                  disabled={calLoading}
                  onClick={() => {
                    if (calConnected) {
                      disconnectCalendar();
                    }
                  }}
                  className={[
                    "relative inline-flex h-6 w-11 items-center rounded-full transition",
                    calConnected ? "bg-indigo-600" : "bg-gray-200",
                    calLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                  ].join(" ")}
                  aria-label="Toggle Google Calendar Sync"
                  aria-checked={!!calConnected}
                  role="switch"
                >
                  <span
                    className={[
                      "inline-block h-5 w-5 transform rounded-full bg-white transition",
                      calConnected ? "translate-x-5" : "translate-x-1",
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>

            {/* Connect / Disconnect actions */}
            <div className="mt-3 flex flex-col gap-2">
              {!calConnected ? (
                <GoogleLoginButton
                  variant="calendar"
                  compact
                  label="Connect"
                  returnTo={safeReturnTo}
                />
              ) : (
                <button
                  type="button"
                  disabled={calLoading}
                  onClick={disconnectCalendar}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold text-slate-800"
                >
                  <Unlink className="w-4 h-4" />
                  Disconnect
                </button>
              )}

              {!calConnected ? (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div className="text-[11px] text-amber-800 leading-snug">
                    You may see a Google warning because verification is in progress. Connect only if you need calendar sync.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                // In compact mode we avoid forcing connect; user can expand sidebar if needed.
                onToggle?.();
              }}
              className={[
                "w-11 h-11 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center justify-center",
                "hover:bg-gray-50 transition",
              ].join(" ")}
            >
              {calConnected ? (
                <Link2 className="w-5 h-5 text-indigo-600" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Primary CTA */}
      <div className="px-4 py-4">
        <button
          onClick={() => {
            const userSub = user?.sub || user?.user_sub || user?.id || "";
            router.push(`/book?user_sub=${encodeURIComponent(userSub)}`);
          }}
          className={[
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
            "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition",
            !open ? "justify-center" : "",
          ].join(" ")}
          title={!open ? "New Event" : undefined}
        >
          <PlusCircle className="w-4 h-4" />
          {open && <span>New Event</span>}
        </button>
      </div>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className={["flex items-center gap-3", !open ? "justify-center" : ""].join(" ")}>
          {user?.avatarUrl || user?.picture ? (
            <img
              src={user?.avatarUrl || user?.avatar_url || user?.picture || "/menwithtab.png"}
              alt="me"
              className="w-9 h-9 rounded-full shadow-sm object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/menwithtab.png";
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              {initials}
            </div>
          )}

          {open && (
            <div className="min-w-0">
              <div className="font-semibold truncate">{user?.name || "User"}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
