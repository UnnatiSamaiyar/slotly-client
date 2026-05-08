//@ts-nocheck
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { resolveEventIcon } from "../../event-types/utils/iconMap";
import { EventType } from "../../types";
import {
  Link as LinkIcon,
  Check,
  MoreHorizontal,
  Edit3,
  Clock3,
  Users,
  UserRound,
} from "lucide-react";

const ICON_STYLES: Record<string, string> = {
  video: "bg-purple-50 text-purple-500 ring-purple-100",
  google_meet: "bg-purple-50 text-purple-500 ring-purple-100",
  pin: "bg-blue-50 text-blue-500 ring-blue-100",
  in_person: "bg-blue-50 text-blue-500 ring-blue-100",
  map: "bg-blue-50 text-blue-500 ring-blue-100",
  location: "bg-blue-50 text-blue-500 ring-blue-100",
  phone: "bg-green-50 text-green-500 ring-green-100",
  briefcase: "bg-orange-50 text-orange-500 ring-orange-100",
  handshake: "bg-yellow-50 text-yellow-600 ring-yellow-100",
  brain: "bg-pink-50 text-pink-500 ring-pink-100",
  target: "bg-red-50 text-red-500 ring-red-100",
  calendar: "bg-indigo-50 text-indigo-500 ring-indigo-100",
  chart: "bg-cyan-50 text-cyan-500 ring-cyan-100",
  analytics: "bg-cyan-50 text-cyan-500 ring-cyan-100",
  file: "bg-gray-50 text-gray-500 ring-gray-100",
  document: "bg-gray-50 text-gray-500 ring-gray-100",
  home: "bg-amber-50 text-amber-600 ring-amber-100",
  house: "bg-amber-50 text-amber-600 ring-amber-100",
  users: "bg-emerald-50 text-emerald-500 ring-emerald-100",
  team: "bg-emerald-50 text-emerald-500 ring-emerald-100",
  group: "bg-emerald-50 text-emerald-500 ring-emerald-100",
  zap: "bg-yellow-50 text-yellow-600 ring-yellow-100",
  search: "bg-slate-50 text-slate-500 ring-slate-100",
  discover: "bg-slate-50 text-slate-500 ring-slate-100",
  message: "bg-teal-50 text-teal-500 ring-teal-100",
  chat: "bg-teal-50 text-teal-500 ring-teal-100",
  user: "bg-violet-50 text-violet-500 ring-violet-100",
  person: "bg-violet-50 text-violet-500 ring-violet-100",
  link: "bg-sky-50 text-sky-500 ring-sky-100",
  globe: "bg-lime-50 text-lime-600 ring-lime-100",
};

export default function EventTypeCard({
  item,
  onEdit,
}: {
  item: EventType;
  onEdit?: (item: EventType) => void;
}) {
  const bookingUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/publicbook/${item.slug}`;
  }, [item.slug]);

  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const Icon = resolveEventIcon({
    userIcon: item.icon,
    locationType: item.meeting_mode,
  });

  const iconKey = (item.icon ?? "").toLowerCase().trim();
  const locationKey = (item.meeting_mode ?? "").toLowerCase().trim();
  const iconStyle =
    ICON_STYLES[iconKey] ??
    ICON_STYLES[locationKey] ??
    "bg-indigo-50 text-indigo-600 ring-indigo-100";

  const isGroupMeeting = item.meeting_mode === "group";

  return (
    <article className="group relative flex h-full min-h-[132px] flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white p-3.5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_18px_45px_rgba(79,70,229,0.10)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 ${iconStyle}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-100"
            aria-label="Open event type actions"
            aria-expanded={menuOpen}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-9 z-50 min-w-[144px] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.14)]"
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.(item);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Edit3 className="h-4 w-4 text-indigo-600" />
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 min-w-0">
        <h5 className="truncate text-[15px] font-semibold leading-5 text-slate-950">
          {item.title || "Untitled event type"}
        </h5>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2 py-0.5 ring-1 ring-slate-100">
            <Clock3 className="h-3.5 w-3.5" />
            {item.duration_minutes ?? 15} mins
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2 py-0.5 ring-1 ring-slate-100">
            {isGroupMeeting ? (
              <Users className="h-3.5 w-3.5" />
            ) : (
              <UserRound className="h-3.5 w-3.5" />
            )}
            {isGroupMeeting ? "Group" : "One-on-One"}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-3">
        <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold leading-none text-emerald-700">
          Public
        </span>

        <button
          type="button"
          onClick={copyToClipboard}
          title={copied ? "Copied!" : "Copy link"}
          className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 text-xs font-semibold text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              Copied
            </>
          ) : (
            <>
              <LinkIcon className="h-3.5 w-3.5" />
              Copy link
            </>
          )}
        </button>
      </div>
    </article>
  );
}
