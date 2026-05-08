"use client";

import Link from "next/link";
import React from "react";

type Props = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  compact?: boolean;
  badge?: string;
  showDot?: boolean;
};

export default function NavItem({
  icon,
  label,
  href,
  active,
  onClick,
  disabled,
  compact,
  badge,
  showDot,
}: Props) {
  const base =
    "group relative w-full flex items-center rounded-xl transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-200";
  const padding = compact
    ? "h-10 justify-center px-0"
    : "h-10 gap-2.5 px-2.5";
  const state = active
    ? "bg-[#eef2ff] text-indigo-700 shadow-[inset_0_0_0_1px_rgba(79,70,229,0.08)]"
    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900";
  const disabledStyle = disabled
    ? "opacity-45 cursor-not-allowed hover:bg-transparent hover:text-slate-500"
    : "cursor-pointer";

  const className = [base, padding, state, disabledStyle].join(" ");

  const content = (
    <>
      {active && !compact && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600" />
      )}

      <div
        className={[
          "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
          active
            ? "text-indigo-700"
            : "text-slate-600 group-hover:text-slate-700",
        ].join(" ")}
      >
        {icon}

        {showDot && (
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />
        )}
      </div>

      {!compact && (
        <>
          <span
            className={[
              "min-w-0 flex-1 truncate text-[13px] font-medium tracking-[-0.01em]",
              active ? "text-indigo-800" : "text-slate-600 group-hover:text-slate-900",
            ].join(" ")}
          >
            {label}
          </span>

          {badge && (
            <span className="min-w-[18px] rounded-full bg-indigo-600 px-1.5 py-0.5 text-center text-[10px] font-semibold leading-4 text-white shadow-sm">
              {badge}
            </span>
          )}
        </>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={className} onClick={onClick} title={compact ? label : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <div
      className={className}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onClick?.()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) onClick?.();
      }}
      aria-disabled={disabled}
      title={compact ? label : undefined}
    >
      {content}
    </div>
  );
}
