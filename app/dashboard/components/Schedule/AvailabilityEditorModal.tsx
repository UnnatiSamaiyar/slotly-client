"use client";

import React, { useMemo, useState } from "react";

type WeekRule = {
  start: string;
  end: string;
  enabled: boolean;
};

type DateOverride = {
  date: string;
  mode: "available" | "unavailable";
  start: string;
  end: string;
};

type DateBlock = {
  date: string;
  start: string;
  end: string;
};

type DateRangeRule = {
  id: string;
  start_date: string;
  end_date: string;
  days: number[]; // 0=Mon ... 6=Sun
  start: string;
  end: string;
};

type BookingWindow = {
  enabled: boolean;
  start_date: string;
  end_date: string;
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function defaultWeek(): Record<string, WeekRule> {
  return {
    "0": { enabled: true, start: "09:00", end: "17:00" },
    "1": { enabled: true, start: "09:00", end: "17:00" },
    "2": { enabled: true, start: "09:00", end: "17:00" },
    "3": { enabled: true, start: "09:00", end: "17:00" },
    "4": { enabled: true, start: "09:00", end: "17:00" },
    "5": { enabled: false, start: "09:00", end: "17:00" },
    "6": { enabled: false, start: "09:00", end: "17:00" },
  };
}

function fromAvailabilityJson(raw?: string | null): Record<string, WeekRule> {
  const base = defaultWeek();
  if (!raw) return base;
  try {
    const data = JSON.parse(raw);
    const week = data?.week || data?.weekly || data?.rules;
    if (typeof week !== "object" || !week) return base;
    for (const k of Object.keys(base)) {
      const intervals = week[k];
      if (!Array.isArray(intervals) || !intervals.length) {
        base[k].enabled = false;
        continue;
      }
      const first = intervals[0] || {};
      base[k].enabled = true;
      base[k].start = String(first.start || base[k].start);
      base[k].end = String(first.end || base[k].end);
    }
  } catch {
    return base;
  }
  return base;
}

function parseOverrides(raw?: string | null): DateOverride[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    const overrides = data?.overrides;
    if (!overrides || typeof overrides !== "object") return [];
    const out: DateOverride[] = [];
    for (const date of Object.keys(overrides)) {
      const v = overrides[date];
      if (Array.isArray(v)) {
        if (v.length > 0) {
          const first = v[0] || {};
          out.push({ date, mode: "available", start: String(first.start || "09:00"), end: String(first.end || "17:00") });
        } else {
          out.push({ date, mode: "unavailable", start: "09:00", end: "17:00" });
        }
        continue;
      }
      if (v && typeof v === "object") {
        const intervals = (v as any).intervals;
        if (intervals === undefined || intervals === null) continue;
        if (Array.isArray(intervals) && intervals.length > 0) {
          const first = intervals[0] || {};
          out.push({ date, mode: "available", start: String(first.start || "09:00"), end: String(first.end || "17:00") });
        } else {
          out.push({ date, mode: "unavailable", start: "09:00", end: "17:00" });
        }
      }
    }
    return out.sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

function parseBlocks(raw?: string | null): DateBlock[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    const overrides = data?.overrides;
    if (!overrides || typeof overrides !== "object") return [];
    const out: DateBlock[] = [];
    for (const date of Object.keys(overrides)) {
      const v = overrides[date];
      if (v && typeof v === "object" && !Array.isArray(v)) {
        const blocks = (v as any).blocks;
        if (Array.isArray(blocks)) {
          for (const b of blocks) {
            if (!b) continue;
            out.push({ date, start: String((b as any).start || ""), end: String((b as any).end || "") });
          }
        }
      }
    }
    return out
      .filter((x) => x.date && x.start && x.end)
      .sort((a, b) => (a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)));
  } catch {
    return [];
  }
}

function parseRanges(raw?: string | null): DateRangeRule[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    const ranges = data?.ranges;
    if (!Array.isArray(ranges)) return [];
    return ranges
      .filter((r: any) => r && r.start_date && r.end_date)
      .map((r: any, idx: number) => ({
        id: String(r.id || `${r.start_date}_${r.end_date}_${idx}`),
        start_date: String(r.start_date),
        end_date: String(r.end_date),
        days: Array.isArray(r.days) ? r.days.map((d: any) => Number(d)) : [0, 1, 2, 3, 4],
        start: String((r.intervals?.[0]?.start) || r.start || "09:00"),
        end: String((r.intervals?.[0]?.end) || r.end || "17:00"),
      }))
      .sort((a, b) => a.start_date.localeCompare(b.start_date));
  } catch {
    return [];
  }
}

function parseBookingWindow(raw?: string | null): BookingWindow {
  const base: BookingWindow = { enabled: false, start_date: "", end_date: "" };
  if (!raw) return base;
  try {
    const data = JSON.parse(raw);
    const w = data?.booking_window;
    if (!w || typeof w !== "object") return base;
    const enabled = Boolean((w as any).enabled);
    const start_date = String((w as any).start_date || "");
    const end_date = String((w as any).end_date || "");
    if (!enabled || !start_date || !end_date) return base;
    return { enabled: true, start_date, end_date };
  } catch {
    return base;
  }
}

function buildAvailabilityJson(
  week: Record<string, WeekRule>,
  overrides: DateOverride[],
  blocks: DateBlock[],
  ranges: DateRangeRule[],
  bookingWindow: BookingWindow
): string {
  const out: any = { week: {}, overrides: {}, ranges: [], booking_window: null };

  for (const k of Object.keys(week)) {
    const r = week[k];
    out.week[k] = r.enabled ? [{ start: r.start, end: r.end }] : [];
  }

  for (const o of overrides) {
    if (!o?.date) continue;
    if (o.mode === "unavailable") out.overrides[o.date] = [];
    else out.overrides[o.date] = { intervals: [{ start: o.start, end: o.end }], blocks: [] };
  }

  for (const b of blocks) {
    if (!b?.date) continue;
    if (!b.start || !b.end || b.end <= b.start) continue;
    const existing = out.overrides[b.date];
    if (Array.isArray(existing)) continue;
    if (!existing) {
      out.overrides[b.date] = { intervals: null, blocks: [{ start: b.start, end: b.end }] };
      continue;
    }
    if (typeof existing === "object") {
      existing.blocks = Array.isArray(existing.blocks) ? existing.blocks : [];
      existing.blocks.push({ start: b.start, end: b.end });
    }
  }

  out.ranges = (ranges || [])
    .filter((r) => r.start_date && r.end_date && r.end > r.start)
    .map((r) => ({
      id: r.id,
      start_date: r.start_date,
      end_date: r.end_date,
      days: Array.isArray(r.days) && r.days.length ? r.days : [0, 1, 2, 3, 4],
      intervals: [{ start: r.start, end: r.end }],
    }));

  // Optional: limit booking to a specific date window (Calendly-like)
  if (bookingWindow?.enabled && bookingWindow.start_date && bookingWindow.end_date) {
    out.booking_window = {
      enabled: true,
      start_date: bookingWindow.start_date,
      end_date: bookingWindow.end_date,
    };
  } else {
    out.booking_window = null;
  }

  return JSON.stringify(out);
}

export default function AvailabilityEditorModal({
  open,
  initialAvailabilityJson,
  onClose,
  onSave,
}: {
  open: boolean;
  initialAvailabilityJson?: string | null;
  onClose: () => void;
  onSave: (availabilityJson: string) => void;
}) {
  const [week, setWeek] = useState<Record<string, WeekRule>>(() => fromAvailabilityJson(initialAvailabilityJson));
  const [overrides, setOverrides] = useState<DateOverride[]>(() => parseOverrides(initialAvailabilityJson));
  const [blocks, setBlocks] = useState<DateBlock[]>(() => parseBlocks(initialAvailabilityJson));
  const [ranges, setRanges] = useState<DateRangeRule[]>(() => parseRanges(initialAvailabilityJson));
  const [bookingWindow, setBookingWindow] = useState<BookingWindow>(() => parseBookingWindow(initialAvailabilityJson));

  const [overrideDate, setOverrideDate] = useState("");
  const [overrideMode, setOverrideMode] = useState<DateOverride["mode"]>("available");
  const [overrideStart, setOverrideStart] = useState("09:00");
  const [overrideEnd, setOverrideEnd] = useState("17:00");

  const [blockDate, setBlockDate] = useState("");
  const [blockStart, setBlockStart] = useState("14:00");
  const [blockEnd, setBlockEnd] = useState("16:00");

  const [rangeStartDate, setRangeStartDate] = useState("");
  const [rangeEndDate, setRangeEndDate] = useState("");
  const [rangeStartTime, setRangeStartTime] = useState("09:00");
  const [rangeEndTime, setRangeEndTime] = useState("17:00");
  const [rangeDays, setRangeDays] = useState<number[]>([0, 1, 2, 3, 4]);

  const hasChangesPreview = useMemo(() => {
    try {
      return buildAvailabilityJson(week, overrides, blocks, ranges, bookingWindow);
    } catch {
      return "";
    }
  }, [week, overrides, blocks, ranges, bookingWindow]);

  function addOrUpdateOverride() {
    if (!overrideDate) return;
    if (overrideMode === "available" && (!overrideStart || !overrideEnd || overrideEnd <= overrideStart)) return;
    setOverrides((curr) => {
      const next = curr.filter((o) => o.date !== overrideDate);
      next.push({ date: overrideDate, mode: overrideMode, start: overrideStart, end: overrideEnd });
      return next.sort((a, b) => a.date.localeCompare(b.date));
    });
  }

  function removeOverride(date: string) {
    setOverrides((curr) => curr.filter((o) => o.date !== date));
  }

  function addBlock() {
    if (!blockDate) return;
    if (!blockStart || !blockEnd || blockEnd <= blockStart) return;
    setBlocks((curr) => {
      const next = [...curr, { date: blockDate, start: blockStart, end: blockEnd }];
      return next.sort((a, b) => (a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)));
    });
  }

  function removeBlock(idx: number) {
    setBlocks((curr) => curr.filter((_, i) => i !== idx));
  }

  function toggleRangeDay(dayIdx: number) {
    setRangeDays((curr) => {
      if (curr.includes(dayIdx)) return curr.filter((d) => d !== dayIdx);
      return [...curr, dayIdx].sort((a, b) => a - b);
    });
  }

  function addRange() {
    if (!rangeStartDate || !rangeEndDate) return;
    if (rangeEndDate < rangeStartDate) return;
    if (!rangeStartTime || !rangeEndTime || rangeEndTime <= rangeStartTime) return;
    const id = `${rangeStartDate}_${rangeEndDate}_${Date.now()}`;
    setRanges((curr) =>
      [...curr, { id, start_date: rangeStartDate, end_date: rangeEndDate, days: rangeDays, start: rangeStartTime, end: rangeEndTime }].sort((a, b) =>
        a.start_date.localeCompare(b.start_date)
      )
    );
  }

  function removeRange(id: string) {
    setRanges((curr) => curr.filter((r) => r.id !== id));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <div className="text-sm font-semibold text-slate-900">Set availability</div>
            <div className="text-xs text-slate-500 mt-0.5">Used to generate bookable time slots.</div>
          </div>
          <button onClick={onClose} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            Close
          </button>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {/* Weekly */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <div className="text-sm font-semibold text-slate-900">Weekly availability</div>
            <div className="mt-3 space-y-2">
              {Object.keys(week)
                .sort((a, b) => Number(a) - Number(b))
                .map((k) => {
                  const idx = Number(k);
                  const r = week[k];
                  return (
                    <div key={k} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-3 text-sm font-medium text-slate-800">{DAY_LABELS[idx]}</div>
                      <div className="col-span-2">
                        <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                          <input
                            type="checkbox"
                            checked={r.enabled}
                            onChange={(e) => setWeek((w) => ({ ...w, [k]: { ...w[k], enabled: e.target.checked } }))}
                          />
                          Enabled
                        </label>
                      </div>
                      <div className="col-span-7 flex items-center gap-2">
                        <input
                          type="time"
                          value={r.start}
                          disabled={!r.enabled}
                          onChange={(e) => setWeek((w) => ({ ...w, [k]: { ...w[k], start: e.target.value } }))}
                          className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-full"
                        />
                        <span className="text-xs text-gray-400">to</span>
                        <input
                          type="time"
                          value={r.end}
                          disabled={!r.enabled}
                          onChange={(e) => setWeek((w) => ({ ...w, [k]: { ...w[k], end: e.target.value } }))}
                          className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-full"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Overrides */}
          <div className="mt-5 bg-white border border-gray-100 rounded-2xl p-4">
            <div className="text-sm font-semibold text-slate-900">Date overrides</div>
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
              <div className="lg:col-span-4">
                <label className="text-xs text-gray-500 font-medium">Date</label>
                <input type="date" value={overrideDate} onChange={(e) => setOverrideDate(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              </div>
              <div className="lg:col-span-3">
                <label className="text-xs text-gray-500 font-medium">Mode</label>
                <select value={overrideMode} onChange={(e) => setOverrideMode(e.target.value as any)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable (all day)</option>
                </select>
              </div>
              <div className="lg:col-span-3">
                <label className="text-xs text-gray-500 font-medium">Time window</label>
                <div className="mt-1 flex items-center gap-2">
                  <input type="time" value={overrideStart} disabled={overrideMode === "unavailable"} onChange={(e) => setOverrideStart(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                  <span className="text-xs text-gray-400">to</span>
                  <input type="time" value={overrideEnd} disabled={overrideMode === "unavailable"} onChange={(e) => setOverrideEnd(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="lg:col-span-2">
                <button type="button" onClick={addOrUpdateOverride} className="w-full px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800">Add/Update</button>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {overrides.length === 0 ? (
                <div className="text-sm text-slate-500">No overrides set.</div>
              ) : (
                overrides.map((o) => (
                  <div key={o.date} className="flex items-center justify-between gap-3 border border-gray-100 rounded-xl px-3 py-2">
                    <div className="text-sm">
                      <div className="font-medium text-slate-900">{o.date}</div>
                      <div className="text-xs text-slate-600">{o.mode === "unavailable" ? "Unavailable" : `Available ${o.start}–${o.end}`}</div>
                    </div>
                    <button type="button" onClick={() => removeOverride(o.date)} className="text-xs font-semibold text-slate-600 hover:text-red-600">Remove</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Blocks */}
          <div className="mt-5 bg-white border border-gray-100 rounded-2xl p-4">
            <div className="text-sm font-semibold text-slate-900">Time blocks (per date)</div>
            <div className="mt-1 text-xs text-slate-500">Example: 14:00–16:00 blocked on a specific date.</div>

            <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
              <div className="lg:col-span-4">
                <label className="text-xs text-gray-500 font-medium">Date</label>
                <input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              </div>
              <div className="lg:col-span-6">
                <label className="text-xs text-gray-500 font-medium">Block time</label>
                <div className="mt-1 flex items-center gap-2">
                  <input type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                  <span className="text-xs text-gray-400">to</span>
                  <input type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="lg:col-span-2">
                <button type="button" onClick={addBlock} className="w-full px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800">Add block</button>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {blocks.length === 0 ? (
                <div className="text-sm text-slate-500">No blocks set.</div>
              ) : (
                blocks.map((b, idx) => (
                  <div key={`${b.date}_${b.start}_${idx}`} className="flex items-center justify-between gap-3 border border-gray-100 rounded-xl px-3 py-2">
                    <div className="text-sm">
                      <div className="font-medium text-slate-900">{b.date}</div>
                      <div className="text-xs text-slate-600">Blocked {b.start}–{b.end}</div>
                    </div>
                    <button type="button" onClick={() => removeBlock(idx)} className="text-xs font-semibold text-slate-600 hover:text-red-600">Remove</button>
                  </div>
                ))
              )}
            </div>
          </div>

                    {/* Booking window */}
          <div className="mt-5 bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">Limit booking to a date window</div>
                <div className="mt-1 text-xs text-slate-500">
                  When enabled, only dates inside this range are selectable on the public booking page. Other dates show as disabled/grey.
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={bookingWindow.enabled}
                  onChange={(e) =>
                    setBookingWindow((w) => ({ ...w, enabled: e.target.checked }))
                  }
                />
                Enable
              </label>
            </div>

            <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
              <div className="lg:col-span-5">
                <label className="text-xs text-gray-500 font-medium">Start date</label>
                <input
                  type="date"
                  value={bookingWindow.start_date}
                  disabled={!bookingWindow.enabled}
                  onChange={(e) =>
                    setBookingWindow((w) => ({ ...w, start_date: e.target.value }))
                  }
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm disabled:bg-gray-50"
                />
              </div>
              <div className="lg:col-span-5">
                <label className="text-xs text-gray-500 font-medium">End date</label>
                <input
                  type="date"
                  value={bookingWindow.end_date}
                  disabled={!bookingWindow.enabled}
                  onChange={(e) =>
                    setBookingWindow((w) => ({ ...w, end_date: e.target.value }))
                  }
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm disabled:bg-gray-50"
                />
              </div>
              <div className="lg:col-span-2">
                <button
                  type="button"
                  disabled={!bookingWindow.enabled}
                  onClick={() =>
                    setBookingWindow((w) => ({
                      ...w,
                      start_date: w.start_date || new Date().toISOString().slice(0, 10),
                      end_date: w.end_date || new Date().toISOString().slice(0, 10),
                    }))
                  }
                  className="w-full px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Auto-fill
                </button>
              </div>
            </div>

            {bookingWindow.enabled && bookingWindow.start_date && bookingWindow.end_date && bookingWindow.end_date < bookingWindow.start_date && (
              <div className="mt-2 text-xs font-semibold text-red-600">End date must be on/after start date.</div>
            )}
          </div>

{/* Ranges */}
          <div className="mt-5 bg-white border border-gray-100 rounded-2xl p-4">
            <div className="text-sm font-semibold text-slate-900">Date range availability</div>
            <div className="mt-1 text-xs text-slate-500">Applies when there is no explicit override for the date.</div>

            <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
              <div className="lg:col-span-3">
                <label className="text-xs text-gray-500 font-medium">Start date</label>
                <input type="date" value={rangeStartDate} onChange={(e) => setRangeStartDate(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              </div>
              <div className="lg:col-span-3">
                <label className="text-xs text-gray-500 font-medium">End date</label>
                <input type="date" value={rangeEndDate} onChange={(e) => setRangeEndDate(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              </div>
              <div className="lg:col-span-4">
                <label className="text-xs text-gray-500 font-medium">Time window</label>
                <div className="mt-1 flex items-center gap-2">
                  <input type="time" value={rangeStartTime} onChange={(e) => setRangeStartTime(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                  <span className="text-xs text-gray-400">to</span>
                  <input type="time" value={rangeEndTime} onChange={(e) => setRangeEndTime(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="lg:col-span-2">
                <button type="button" onClick={addRange} className="w-full px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800">Add range</button>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-gray-500 font-medium">Days in range</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {DAY_LABELS.map((d, i) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleRangeDay(i)}
                    className={[
                      "px-3 py-1.5 rounded-xl text-xs font-semibold border",
                      rangeDays.includes(i) ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-200 text-slate-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {ranges.length === 0 ? (
                <div className="text-sm text-slate-500">No ranges set.</div>
              ) : (
                ranges.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 border border-gray-100 rounded-xl px-3 py-2">
                    <div className="text-sm">
                      <div className="font-medium text-slate-900">{r.start_date} → {r.end_date}</div>
                      <div className="text-xs text-slate-600">{r.start}–{r.end} • {r.days.map((d) => DAY_LABELS[d]).join(", ")}</div>
                    </div>
                    <button type="button" onClick={() => removeRange(r.id)} className="text-xs font-semibold text-slate-600 hover:text-red-600">Remove</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-white">
          <div className="text-xs text-slate-500">Saved as availability_json (advanced).</div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50">Cancel</button>
            <button
              onClick={() => onSave(hasChangesPreview)}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Use this availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
