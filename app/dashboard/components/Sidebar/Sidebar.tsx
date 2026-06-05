// @ts-nocheck

"use client";

  import React, { useEffect, useMemo, useRef, useState } from "react";
  import { usePathname, useRouter } from "next/navigation";
  import SidebarToggle from "./SidebarToggle";
  import NavItem from "./NavItem";
  import { useNotifications } from "../../hooks/useNotification";
  import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
  import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Layers,
    Bell,
    Settings,
  } from "lucide-react";

  type NavLink = {
    label: string;
    icon: React.ReactElement;
    href: string;
    disabled?: boolean;
  };

  const API_BASE = (
    process.env.NEXT_PUBLIC_API_URL || "https://api.slotly.io"
  ).replace(/\/$/, "");

  export default function Sidebar({ open, onToggle, user }: any) {
    const router = useRouter();
    const pathname = usePathname();
    const userSub = useMemo(() => user?.sub || "", [user]);
    const { unreadCount } = useNotifications(userSub);
    const [calLoading, setCalLoading] = useState(false);
    const [calConnected, setCalConnected] = useState<boolean | null>(null);

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
          { method: "POST" }
        );

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.detail || "Disconnect failed");
        }

        setCalConnected(false);
        await fetchCalendarStatus();
      } catch (err) {
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
      const refresh = () => {
        fetchCalendarStatus();
      };

      window.addEventListener("slotly-calendar-changed", refresh);
      window.addEventListener("focus", refresh);

      return () => {
        window.removeEventListener("slotly-calendar-changed", refresh);
        window.removeEventListener("focus", refresh);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userSub]);
    useEffect(() => {
      console.log("Sidebar user:", user);
      console.log("Resolved userSub:", userSub);
    }, [user, userSub]);

    const openGoogleLogin = () => {
      const btn = googleLoginRef.current?.querySelector("button");
      btn?.click();
    };

    const navTourTargets: Record<string, string> = {
      Dashboard: "sidebar-dashboard",
      Schedule: "sidebar-schedule",
      People: "sidebar-contacts",
      "Event Types": "sidebar-event-types",
      Notifications: "topbar-notifications",
      Settings: "sidebar-settings",
    };

    const nav: NavLink[] = [
      {
        label: "Dashboard",
        icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
        href: "/dashboard",
      },
      {
        label: "Schedule",
        icon: <CalendarDays className="h-[18px] w-[18px]" />,
        href: "/dashboard/your-schedule",
      },
      {
        label: "People",
        icon: <Users className="h-[18px] w-[18px]" />,
        href: "/dashboard/contacts",
      },
      {
        label: "Event Types",
        icon: <Layers className="h-[18px] w-[18px]" />,
        href: "/dashboard/event-types",
      },
      {
        label: "Notifications",
        icon: <Bell className="h-[18px] w-[18px]" />,
        href: "/dashboard/notification",
      },
      {
        label: "Settings",
        icon: <Settings className="h-[18px] w-[18px]" />,
        href: "/dashboard/settings",
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
            className="fixed left-3 top-3 z-[60] flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/95 text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.10)] backdrop-blur transition hover:bg-slate-50 active:scale-95 md:hidden"
          >
            ☰
          </button>
        )}

        {open && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-sm md:hidden"
            onClick={onToggle}
          />
        )}

        <aside
          data-tour="sidebar-navigation"
          className={[
            "fixed left-0 top-0 z-50 flex h-screen shrink-0 flex-col overflow-hidden md:relative",
            "border-r border-slate-200/80 bg-white/95 shadow-[16px_0_50px_rgba(15,23,42,0.04)] backdrop-blur-xl",
            "transition-[width,transform] duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            open ? "md:w-[216px] xl:w-[224px] 2xl:w-[232px]" : "md:w-[68px]",
            "w-[224px] sm:w-[232px]",
          ].join(" ")}
        >
          <div
            className={[
              "relative flex h-14 items-center border-b border-slate-100/90 px-3",
              open ? "justify-between gap-2" : "justify-center",
            ].join(" ")}
          >
            <div className="relative z-10 hidden md:block">
              <SidebarToggle onToggle={onToggle} />
            </div>

            {open && (
              <>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-14">
                  <img
                    src="/assets/Slotlyio-logo.webp"
                    alt="Slotly"
                    className="h-7 w-auto max-w-[128px] object-contain"
                    draggable={false}
                  />
                </div>

                <button
                  onClick={onToggle}
                  aria-label="Close sidebar"
                  className="relative z-10 ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95 md:hidden"
                >
                  ✕
                </button>
              </>
            )}
          </div>

          <nav
            className={[
              "flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent",
              open ? "space-y-1 px-2.5" : "space-y-1 px-2",
            ].join(" ")}
          >
            {open && (
              <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Workspace
              </div>
            )}

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
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    onToggle();
                  }
                }}
                disabled={n.disabled}
                compact={!open}
                badge={
                  n.label === "Notifications" && unreadCount > 0
                    ? unreadCount > 9
                      ? "9+"
                      : String(unreadCount)
                    : undefined
                }
                showDot={n.label === "Notifications" && unreadCount > 0 && !open}
                dataTour={navTourTargets[n.label]}
              />
            ))}
          </nav>

          <div className={open ? "px-2.5 pb-3" : "flex justify-center px-2 pb-3"}>
            {!open && (
              <button
                onClick={openGoogleLogin}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                title="Google Calendar"
              >
                <img
                  src="/assets/Home/google-calendar.png"
                  className="h-[18px] w-[18px]"
                  alt="Google Calendar"
                />
              </button>
            )}

            {open && (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-2.5 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
                <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Integration
                </div>

                <div className="flex h-9 items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/80">
                      <img
                        src="/assets/Home/google-calendar.png"
                        className="h-4 w-4"
                        alt="Google Calendar"
                      />
                    </span>

                    <span className="truncate text-[13px] font-medium text-slate-700">
                      Google Calendar
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={calLoading}
                    onClick={() =>
                      calConnected ? disconnectCalendar() : openGoogleLogin()
                    }
                    className={[
                      "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
                      calConnected ? "bg-indigo-600" : "bg-slate-300",
                      calLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                    ].join(" ")}
                    aria-label={calConnected ? "Disconnect Google Calendar" : "Connect Google Calendar"}
                  >
                    <span
                      className={[
                        "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                        calConnected ? "translate-x-4" : "translate-x-0",
                      ].join(" ")}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {!calConnected && (
            <div ref={googleLoginRef} className="hidden">
              <GoogleLoginButton
                variant="calendar"
                compact
                label="Connect"
                returnTo={safeReturnTo}
                userSub={userSub}
              />
            </div>
          )}

          <div
            className={[
              "border-t border-slate-100/90",
              open ? "px-3 py-3" : "px-2 py-3",
            ].join(" ")}
          >
            <div
              data-tour="settings-profile"
              className={[
                "flex min-w-0 items-center rounded-2xl transition-colors",
                open ? "gap-2.5" : "justify-center",
              ].join(" ")}
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                  alt="User"
                />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-[12px] font-semibold text-white shadow-sm">
                  {initials}
                </div>
              )}

              {open && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold leading-5 text-slate-800">
                    {user?.name || "User"}
                  </p>
                  {user?.email && (
                    <p className="truncate text-[11px] leading-4 text-slate-400">
                      {user.email}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      </>
    );
  }
