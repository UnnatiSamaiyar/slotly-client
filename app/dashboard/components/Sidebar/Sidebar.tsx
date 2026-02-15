"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SidebarToggle from "./SidebarToggle";
import NavItem from "./NavItem";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import {
  Calendar,
  Clock,
  PlusCircle,
  User,
  BellRing,
  Settings,
  Link2,
  Unlink,
  ShieldAlert,
} from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export default function Sidebar({ open, onToggle, user }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const userSub = useMemo(() => user?.sub || user?.user_sub || user?.id || "", [user]);
  const [calLoading, setCalLoading] = useState(false);
  const [calConnected, setCalConnected] = useState<boolean | null>(null);
  const [calInfoOpen, setCalInfoOpen] = useState(false);

  const safeReturnTo = useMemo(() => {
    const raw = String(pathname || "/dashboard");
    if (!raw.startsWith("/") || raw.includes("://")) return "/dashboard";
    return raw;
  }, [pathname]);

  async function fetchCalendarStatus() {
    if (!userSub) return setCalConnected(false);
    try {
      setCalLoading(true);
      const res = await fetch(`${API_BASE}/auth/calendar-status?user_sub=${encodeURIComponent(userSub)}`);
      const data = await res.json().catch(() => null);
      setCalConnected(Boolean(data?.calendar_connected));
    } catch {
      setCalConnected(false);
    } finally {
      setCalLoading(false);
    }
  }

  async function disconnectCalendar() {
    if (!userSub) return;
    try {
      setCalLoading(true);
      await fetch(`${API_BASE}/auth/calendar-disconnect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_sub: userSub }),
      });
      await fetchCalendarStatus();
    } catch {
      setCalLoading(false);
    }
  }

  useEffect(() => {
    fetchCalendarStatus();
  }, [userSub]);

  const nav = [
    { label: "Calendar", icon: <Calendar className="w-5 h-5" />, href: "/dashboard" },
    { label: "Your Schedule", icon: <Clock className="w-5 h-5" />, href: "/dashboard/your-schedule" },
    { label: "Contacts", icon: <User className="w-5 h-5" />, href: "/dashboard/contacts" },
    { label: "Event Types", icon: <PlusCircle className="w-5 h-5" />, href: "/dashboard/event-types" },
    { label: "Notifications", icon: <BellRing className="w-5 h-5" />, href: "/dashboard/notifications", disabled: true },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/dashboard/settings", disabled: true },
  ];

  const initials =
    (user?.name || user?.email || "U")
      .split(" ")
      .map((s: string) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <aside
      className={[
        open ? "w-[220px]" : "w-[64px]",
        "transition-[width] duration-300",
        "bg-white border-r border-slate-200",
        "flex flex-col h-screen overflow-hidden",
      ].join(" ")}
    >
      {/* Top */}
      <div
        className={[
          "h-16 flex items-center border-b border-slate-100",
          open ? "px-4 gap-3" : "justify-center",
        ].join(" ")}
      >
        <SidebarToggle onToggle={onToggle} />
        {open && (
          <img
            src="/assets/Slotlyio-logo.png"
            alt="Slotly"
            className="h-7 w-auto object-contain"
            draggable={false}
          />
        )}
      </div>

      {/* Navigation */}
      <nav className={["mt-3 flex-1 space-y-1 overflow-y-auto", open ? "px-3" : "px-1"].join(" ")}>
        {nav.map((n) => (
          <NavItem
            key={n.label}
            icon={n.icon}
            label={n.label}
            active={pathname === n.href || pathname?.startsWith(n.href)}
            onClick={() => !n.disabled && router.push(n.href)}
            disabled={n.disabled}
            compact={!open}
          />
        ))}
      </nav>

      {/* Calendar block (ONLY when expanded) */}
      {/* {open && (
        <div className="mx-3 mb-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-slate-900">Google Calendar Sync</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Connect only if you want Slotly to manage meetings.
              </div>
            </div>

            <button
              disabled={calLoading}
              onClick={() => calConnected && disconnectCalendar()}
              className={[
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                calConnected ? "bg-indigo-600" : "bg-slate-200",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition",
                  calConnected ? "translate-x-5" : "translate-x-1",
                ].join(" ")}
              />
            </button>
          </div>

          <div className="mt-3">
            {!calConnected ? (
              <GoogleLoginButton variant="calendar" compact label="Connect" returnTo={safeReturnTo} />
            ) : (
              <button
                onClick={disconnectCalendar}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      )} */}

      {/* CTA */}
      <div className={["pb-3", open ? "px-3" : "px-2 flex justify-center"].join(" ")}>
        <button
          onClick={() => router.push(`/book?user_sub=${encodeURIComponent(userSub)}`)}
          className={[
            "h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition",
            open ? "px-4 flex items-center gap-3 w-full" : "w-11 flex items-center justify-center",
          ].join(" ")}
        >
          <PlusCircle className="w-4 h-4" />
          {open && <span>New Event</span>}
        </button>
      </div>

      {/* Footer */}
      <div className={["border-t border-slate-200", open ? "px-4 py-4" : "py-4 flex justify-center"].join(" ")}>
        {user?.picture ? (
          <img src={user.picture} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            {initials}
          </div>
        )}
      </div>
    </aside>
  );
}
