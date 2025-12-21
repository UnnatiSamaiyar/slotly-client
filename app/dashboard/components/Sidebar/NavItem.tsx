<<<<<<< HEAD
// src/app/dashboard/components/Sidebar/NavItem.tsx
import Link from "next/link";
import React from "react";

export default function NavItem({ icon, label, href, active }: { icon: React.ReactNode; label: string; href?: string; active?: boolean }) {
  const className = `flex items-center gap-3 p-3 rounded-lg cursor-pointer ${active ? 'bg-gray-100' : 'hover:bg-gray-50'}`;
  return href ? (
    <Link href={href} className={className}>
      <div className="text-slate-700">{icon}</div>
      <div className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-gray-700'}`}>{label}</div>
    </Link>
  ) : (
    <div className={className}>
      <div className="text-slate-700">{icon}</div>
      <div className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-gray-700'}`}>{label}</div>
    </div>
  );
}
=======
"use client";

import Link from "next/link";
import React from "react";

type Props = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;

  // New (for Sidebar UX)
  onClick?: () => void;
  disabled?: boolean;
  compact?: boolean; // collapsed sidebar
};

export default function NavItem({
  icon,
  label,
  href,
  active,
  onClick,
  disabled,
  compact,
}: Props) {
  const className = [
    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition select-none",
    active ? "bg-indigo-50 text-slate-900" : "hover:bg-gray-50 text-slate-800",
    disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : "cursor-pointer",
    compact ? "justify-center" : "",
  ].join(" ");

  const content = (
    <>
      <div className={active ? "text-indigo-600" : "text-slate-700"}>{icon}</div>
      {!compact && (
        <div className={["text-sm font-medium", active ? "text-slate-900" : "text-slate-700"].join(" ")}>
          {label}
        </div>
      )}
    </>
  );

  // If href provided, use Link (unless disabled)
  if (href && !disabled) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  // Otherwise a button-like div
  return (
    <div
      className={className}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (disabled) return;
        onClick?.();
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      aria-disabled={disabled ? "true" : "false"}
    >
      {content}
    </div>
  );
}

>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
