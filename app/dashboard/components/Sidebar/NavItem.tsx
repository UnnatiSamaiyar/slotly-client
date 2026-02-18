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
  const base =
    "w-full flex items-center rounded-lg transition select-none";
  const padding = compact ? "justify-center py-3" : "gap-3 px-3 py-2.5";
  const state = active
    ? "bg-indigo-50 text-indigo-600"
    : "text-slate-700 hover:bg-slate-100";
  const disabledStyle = disabled
    ? "opacity-50 cursor-not-allowed hover:bg-transparent"
    : "cursor-pointer";

  const className = [base, padding, state, disabledStyle].join(" ");

  const content = (
    <>
      {icon}
      {!compact && (
        <span className="text-sm font-medium text-slate-800">
          {label}
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={className}>
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
        if (!disabled && (e.key === "Enter" || e.key === " "))
          onClick?.();
      }}
      aria-disabled={disabled}
    >
      {content}
    </div>
  );
}
