"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import SidebarToggle from "./SidebarToggle";
import NavItem from "./NavItem";
import { Calendar, PlusCircle, User, BellRing, Settings } from "lucide-react";

export default function Sidebar({ open, onToggle, user }: any) {
  const router = useRouter();
  const pathname = usePathname();

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
              src={
                user?.avatarUrl ||
                user?.avatar_url ||
                user?.picture ||
                "/menwithtab.png"
              }
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
