"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SidebarToggle from "./SidebarToggle";
import NavItem from "./NavItem";


import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Link2,
  Bell,
  Settings,
  Plus
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.slotly.io"
).replace(/\/$/, "");

export default function Sidebar({ open, onToggle, user }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const userSub = useMemo(
    () => user?.sub || user?.user_sub || user?.id || "",
    [user]
  );

  const [calLoading, setCalLoading] = useState(false);
  const [calConnected, setCalConnected] = useState<boolean | null>(null);
 

  // ✅ REF TO GOOGLE LOGIN CONTAINER
  const googleLoginRef = useRef<HTMLDivElement | null>(null);

  const safeReturnTo = useMemo(() => {
    const raw = String(pathname || "/dashboard");
    if (!raw.startsWith("/") || raw.includes("://")) return "/dashboard";
    return raw;
  }, [pathname]);

  async function fetchCalendarStatus() {
    if (!userSub) return setCalConnected(false);
    try {
      setCalLoading(true);
      const res = await fetch(
        `${API_BASE}/auth/calendar-status?user_sub=${encodeURIComponent(userSub)}`
      );
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

  // ✅ SAFE CLICK HANDLER
  const openGoogleLogin = () => {
    const btn = googleLoginRef.current?.querySelector("button");
    btn?.click();
  };

  const nav = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      label: "Schedule",
      icon: <CalendarDays className="w-5 h-5" />,
      href: "/dashboard/your-schedule",
    },
    {
      label: "People",
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/contacts",
    },
    {
      label: "Event Types",
      icon: <Link2 className="w-5 h-5" />,
      href: "/dashboard/event-types",
    },
    {
      label: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      href: "/dashboard/notifications",
      disabled: true,
    },
    {
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/dashboard/settings",
      disabled: true,
    },
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
      {/* TOP */}
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

      {/* NAV */}
      <nav className={["mt-3 flex-1 space-y-1 overflow-y-auto", open ? "px-3" : "px-1"].join(" ")}>
        {nav.map((n) => (
          <NavItem
            key={n.label}
            icon={n.icon}
            label={n.label}
            active={
              pathname === n.href ||
              (n.href !== "/dashboard" && pathname?.startsWith(n.href))  }
              onClick={() => !n.disabled && router.push(n.href)}
            disabled={n.disabled}
            compact={!open}
          />
        ))}
      </nav>

      {/* INTEGRATION */}
      <div className={open ? "px-3 mt-3" : "px-1 mt-3 flex justify-center"}>
        {!open && (
          <button
            onClick={openGoogleLogin}
            className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          >
            <img src="/assets/Home/google-calendar.png" className="w-5 h-5" />
          </button>
        )}

        {open && (
          <div className="pb-3">
            <div className="text-[11px] font-semibold text-slate-500 mb-2">
              INTEGRATIONS
            </div>

            <div className="flex items-center justify-between h-10">
              <div className="flex items-center gap-3 h-full">
                <img
                  src="/assets/Home/google-calendar.png"
                  className="w-5 h-5 shrink-0"
                  alt="Google Calendar"
                />

                <span className="text-sm font-medium text-slate-800 leading-none">
                  Google Calendar
                </span>
              </div>

              <button
                disabled={calLoading}
                onClick={() =>
                  calConnected ? disconnectCalendar() : openGoogleLogin()
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${calConnected ? "bg-indigo-600" : "bg-slate-300"
                  }`}
              >
                <span
                  className={`inline-block h-5 w-5 bg-white rounded-full transition ${calConnected ? "translate-x-5" : "translate-x-1"
                    }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* 🔐 HIDDEN GOOGLE LOGIN — ALWAYS MOUNTED */}
      {!calConnected && (
        <div ref={googleLoginRef} className="hidden">
          <GoogleLoginButton
            variant="calendar"
            compact
            label="Connect"
            returnTo={safeReturnTo}
          />
        </div>
      )}

      {/* CTA */}
      <div className={["pb-3", open ? "px-3" : "px-2 flex justify-center"].join(" ")}>
        <button
          onClick={() => router.push(`/book?user_sub=${encodeURIComponent(userSub)}`)}
          className={[
            "h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition",
            open ? "px-4 flex items-center gap-3 w-full" : "w-11 flex items-center justify-center",
          ].join(" ")}
        >
          <Plus className="w-4 h-4" />
          {open && <span>New Event</span>}
        </button>
      </div>
      {/* FOOTER */}
      {/* <div className="border-t px-4 py-4">
        {user?.picture ? (
          <img src={user.picture} className="w-9 h-9 rounded-full" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center">
            {initials}
          </div>
        )}
      </div> */}
      {/* FOOTER */}
      <div className="border-t border-slate-200 px-4 py-4">
        <div className="flex items-center gap-3 min-w-0">

          {/* Avatar */}
          {user?.picture ? (
            <img
              src={user.picture}
              className="w-9 h-9 rounded-full object-cover shrink-0"
              alt="User"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shrink-0">
              {initials}
            </div>
          )}

          {/* Name */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.name || "User"}
            </p>
          </div>

        </div>
      </div>
    </aside>
  );
}
