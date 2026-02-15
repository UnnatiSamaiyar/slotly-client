"use client";

import React, { useMemo, useState } from "react";
import { EventType } from "../../types";
import { Edit3, Link as LinkIcon, Copy, Check, MapPin, Video } from "lucide-react";

export default function EventTypeCard({
  item,
  onEdit,
}: {
  item: EventType;
  onEdit: (item: EventType) => void;
}) {
  const bookingUrl = useMemo(() => {
    return `http://localhost:3000/publicbook/${item.slug}`;
  }, [item.slug]);

  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  const isMeet = item.meeting_mode === "google_meet";

  return (
    <div className="flex flex-col p-4 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
            {isMeet ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">
              {item.title}
            </div>

            <div className="text-xs text-slate-500 mt-1">
              {isMeet ? "Google Meet" : "In-person meeting"}
              {!isMeet && item.location ? (
                <span className="ml-2 text-[11px] text-slate-400">• {item.location}</span>
              ) : null}
            </div>
          </div>
        </div>

        <button
          onClick={() => onEdit(item)}
          className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 rounded-lg flex items-center gap-2 hover:bg-indigo-50 transition"
        >
          <Edit3 className="w-4 h-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 text-sm border border-gray-100">
        <a
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-slate-600 overflow-hidden hover:text-indigo-700 transition min-w-0"
          title={bookingUrl}
        >
          <LinkIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">{bookingUrl}</span>
        </a>

        <button onClick={copyToClipboard} className="p-2 hover:bg-slate-200 rounded-lg transition" title={copied ? "Copied" : "Copy link"}>
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </div>
  );
}
