


"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SidebarToggle from "./SidebarToggle";
import NavItem from "./NavItem";

import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { LayoutDashboard, CalendarDays, Users, Layers, Bell } from "lucide-react";

type NavLink = {
  label: string;
  icon: React.ReactElement;
  href: string;
  disabled?: boolean;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.slotly.io0"
).replace(/\/$/, "");

export default function Sidebar({ open, onToggle, user }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const userSub = useMemo(() => user?.sub || "", [user]);

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

      const res = await fetch(
        `${API_BASE}/auth/calendar-disconnect?user_sub=${encodeURIComponent(userSub)}`,
        {
          method: "POST",
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.detail || "Disconnect failed");
      }

      setCalConnected(false);
      await fetchCalendarStatus();
    }  catch (err) {
      console.error("Calendar disconnect failed:", err);
      await fetchCalendarStatus();
    } finally {
    setCalLoading(false);
  }
  }

  useEffect(() => {
    fetchCalendarStatus();
  }, [userSub, pathname]);
  useEffect(() => {
    console.log("Sidebar user:", user);
    console.log("Resolved userSub:", userSub);
  }, [user, userSub]);


  // ✅ SAFE CLICK HANDLER
  const openGoogleLogin = () => {
    const btn = googleLoginRef.current?.querySelector("button");
    btn?.click();
  };

  const nav: NavLink[] = [
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
      icon: <Layers className="w-5 h-5" />,
      href: "/dashboard/event-types",
    },
    {
       label: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      href: "/dashboard/notification",
      // disabled: true,
     },
  ];

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      {!open && (
        <button
          onClick={onToggle}
          aria-label="Open sidebar"
          className="fixed top-3 left-3 z-[60] md:hidden flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-[0_4px_14px_rgba(15,23,42,0.08)] transition hover:bg-slate-50 active:scale-95"
        >
          ☰
        </button>
      )}

      {/* ✅ Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={[
          "fixed md:relative top-0 left-0 h-screen z-50",
          "bg-white border-r border-slate-200 flex flex-col overflow-hidden",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          open ? "md:w-[220px]" : "md:w-[64px]",
          "w-[220px]",
        ].join(" ")}
      >
        {/* TOP */}
        <div
          className={[
            "h-16 flex items-center border-b border-slate-100 px-4 gap-3",
            open ? "px-4 gap-3" : "justify-center",
          ].join(" ")}
        >
          {/* Desktop toggle (unchanged) */}
          <div className="hidden md:block">
            <SidebarToggle onToggle={onToggle} />
          </div>

          {/* Mobile close button when sidebar is open */}
          {open && (
            <button
              onClick={onToggle}
              aria-label="Close sidebar"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
            >
              ✕
            </button>
          )}

          {open && (
            <img
              src="/assets/Slotlyio-logo.webp"
              alt="Slotly"
              className="h-8 w-auto "
              draggable={false}
            />
          )}
        </div>

        {/* NAV */}
        <nav
          className={[
            "mt-3 flex-1 space-y-1 overflow-y-auto",
            open ? "px-3" : "px-1",
          ].join(" ")}
        >
          {nav.map((n) => (
            <NavItem
              key={n.label}
              icon={n.icon}
              label={n.label}
              href={n.href}
              active={
                pathname === n.href ||
                (n.href !== "/dashboard" && pathname?.startsWith(n.href))
              }
              onClick={() => {
                // ✅ close only on mobile (do NOT collapse desktop)
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  onToggle();
                }
              }}
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
              <img
                src="/assets/Home/google-calendar.png"
                className="w-5 h-5"
                alt="Google Calendar"
              />
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
                  type="button"
                  disabled={calLoading}
                  onClick={() =>
                    calConnected ? disconnectCalendar() : openGoogleLogin()
                  }
                  className={`relative w-12 h-6 rounded-full transition ${calConnected ? "bg-indigo-600" : "bg-gray-300"
                    } ${calLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${calConnected ? "translate-x-6" : ""
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
    </>
  );
}