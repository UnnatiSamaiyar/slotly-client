"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, useAnimation, type Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Coffee,
  Globe2,
  MoreHorizontal,
  Info,
  Pencil,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Timer,
  X,
  Zap,
} from "lucide-react";
import TimezonePicker from "../components/TimezonePicker";
import { useToast } from "@/hooks/use-toast";
import { fetchSchedule, updateSchedule, type Schedule } from "../api/schedule";
import { fetchEventTypes, updateEventType } from "../api/eventTypes";

// ─── Types ────────────────────────────────────────────────────────────────────

type WeekRule = { start: string; end: string; enabled: boolean };
type DateOverride = { date: string; mode: "available" | "unavailable"; start: string; end: string };
type DateBlock = { date: string; start: string; end: string };
type DateRangeRule = { id: string; start_date: string; end_date: string; days: number[]; start: string; end: string };
type SetupStep = 1 | 2 | 3 | 4 | 5 | 6;
type AdvancedTabKey = "overrides" | "ranges";
type ScheduleScreenMode = "dashboard" | "setup";
type ApplyChangeScope = "upcoming" | "all";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DURATION_PRESETS = [15, 30, 45, 60] as const;
const EXTRA_DURATION_PRESETS = [90, 120] as const;

const SETUP_STEPS: Array<{ id: SetupStep; eyebrow: string; title: string; navLabel: string }> = [
  { id: 1, eyebrow: "Availability", title: "Active days", navLabel: "Step 1: Days" },
  { id: 2, eyebrow: "Availability", title: "Daily rhythm", navLabel: "Step 2: Hours" },
  { id: 3, eyebrow: "Bookings", title: "Duration", navLabel: "Step 3: Duration" },
  { id: 4, eyebrow: "Controls", title: "Breaks", navLabel: "Step 4: Breaks" },
  { id: 5, eyebrow: "Review", title: "Limits", navLabel: "Step 5: Limits" },
  { id: 6, eyebrow: "Advanced", title: "Advanced settings", navLabel: "Step 6: Advanced" },
];

const SETUP_COMPLETE_STORAGE_PREFIX = "slotly_schedule_setup_complete";
const SETUP_SEEN_STORAGE_PREFIX = "slotly_schedule_setup_seen";
const APPLY_SCOPE_STORAGE_PREFIX = "slotly_schedule_apply_scope";
const SCHEDULE_PROFILE_API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_EVENT_TYPES_API ||
  "https://api.slotly.io"
)
  .trim()
  .replace(/\/+$/, "");

async function updateEventScheduleProfile(
  userSub: string,
  profileSlug: string,
  patch: Partial<Schedule>
) {
  const res = await fetch(
    `${SCHEDULE_PROFILE_API_BASE}/schedule/profile/${encodeURIComponent(
      profileSlug
    )}?user_sub=${encodeURIComponent(userSub)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(patch),
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

async function syncScheduleToAllEventTypes(
  userSub: string,
  updatedSchedule: Schedule,
  availability_json: string
) {
  const eventTypes = await fetchEventTypes(userSub);

  const jobs = eventTypes.map(async (eventType: any) => {
    const id = Number(eventType?.id);
    const slug = String(eventType?.slug || "").trim();

    if (!id || !slug) return;

    await updateEventType(userSub, id, {
      availability_json,
      duration_minutes: updatedSchedule.duration_minutes,
      timezone: updatedSchedule.timezone,
    });

    await updateEventScheduleProfile(userSub, slug, {
      timezone: updatedSchedule.timezone,
      duration_minutes: updatedSchedule.duration_minutes,
      availability_json,
      buffer_before_minutes: updatedSchedule.buffer_before_minutes,
      buffer_after_minutes: updatedSchedule.buffer_after_minutes,
      min_notice_minutes: updatedSchedule.min_notice_minutes,
      max_days_ahead: updatedSchedule.max_days_ahead,
    });
  });

  const results = await Promise.allSettled(jobs);
  const failed = results.filter((result) => result.status === "rejected");

  if (failed.length) {
    throw new Error(`${failed.length} event type(s) failed to sync.`);
  }
}
// ─── Utilities ────────────────────────────────────────────────────────────────

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
function storageKey(prefix: string, userSub: string) { return `${prefix}:${userSub}`; }
function safeGetStorage(key: string) {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeSetStorage(key: string, value: string) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, value); } catch { }
}
function hasSavedAvailability(schedule: Schedule | null) {
  if (!schedule?.availability_json) return false;
  try {
    const parsed = JSON.parse(schedule.availability_json);
    const week = parsed?.week || parsed?.weekly || parsed?.rules;
    if (!week || typeof week !== "object") return false;
    return Object.keys(week).some((key) => Array.isArray(week[key]) && week[key].length > 0);
  } catch { return false; }
}
function shouldAutoStartSetup(userSub: string, schedule: Schedule | null) {
  const completed = safeGetStorage(
    storageKey(SETUP_COMPLETE_STORAGE_PREFIX, userSub)
  );

  return !completed && !hasSavedAvailability(schedule);
}
function markSetupSeen(userSub: string) { safeSetStorage(storageKey(SETUP_SEEN_STORAGE_PREFIX, userSub), "1"); }
function markSetupComplete(userSub: string) {
  safeSetStorage(storageKey(SETUP_SEEN_STORAGE_PREFIX, userSub), "1");
  safeSetStorage(storageKey(SETUP_COMPLETE_STORAGE_PREFIX, userSub), "1");
}
function getInitialApplyScope(userSub: string): ApplyChangeScope {
  const saved = safeGetStorage(storageKey(APPLY_SCOPE_STORAGE_PREFIX, userSub));
  return saved === "all" ? "all" : "upcoming";
}
function detectBrowserTimeZone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch { return "UTC"; }
}
function formatTimeLabel(value?: string) {
  if (!value) return "—";

  const [hourRaw, minuteRaw = "00"] = value.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return value;
  }

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}
function getEnabledDayIndexes(week: Record<string, WeekRule>) {
  return Object.keys(week).map((k) => Number(k)).filter((k) => week[String(k)]?.enabled).sort((a, b) => a - b);
}

// ─── Data helpers (unchanged logic) ──────────────────────────────────────────

function createScheduleSnapshot(schedule: Schedule | null, week: Record<string, WeekRule>, overrides: DateOverride[], blocks: DateBlock[], ranges: DateRangeRule[]) {
  if (!schedule) return "";
  return JSON.stringify({
    timezone: schedule.timezone || "",
    duration_minutes: schedule.duration_minutes || 30,
    availability_json: buildAvailabilityJson(week, overrides, blocks, ranges),
    buffer_before_minutes: schedule.buffer_before_minutes || 0,
    buffer_after_minutes: schedule.buffer_after_minutes || 0,
    min_notice_minutes: schedule.min_notice_minutes || 0,
    max_days_ahead: schedule.max_days_ahead || 60,
  });
}
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
      if (!Array.isArray(intervals) || !intervals.length) { base[k].enabled = false; continue; }
      const first = intervals[0] || {};
      base[k].enabled = true;
      base[k].start = String(first.start || base[k].start);
      base[k].end = String(first.end || base[k].end);
    }
  } catch { return base; }
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
        if (v.length > 0) { const f = v[0] || {}; out.push({ date, mode: "available", start: String(f.start || "09:00"), end: String(f.end || "17:00") }); }
        else out.push({ date, mode: "unavailable", start: "09:00", end: "17:00" });
        continue;
      }
      if (v && typeof v === "object") {
        const intervals = (v as any).intervals;
        if (intervals === undefined || intervals === null) continue;
        if (Array.isArray(intervals) && intervals.length > 0) { const f = intervals[0] || {}; out.push({ date, mode: "available", start: String(f.start || "09:00"), end: String(f.end || "17:00") }); }
        else out.push({ date, mode: "unavailable", start: "09:00", end: "17:00" });
      }
    }
    return out.sort((a, b) => a.date.localeCompare(b.date));
  } catch { return []; }
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
    return out.filter((x) => x.date && x.start && x.end).sort((a, b) => a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date));
  } catch { return []; }
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
        start: String(r.intervals?.[0]?.start || r.start || "09:00"),
        end: String(r.intervals?.[0]?.end || r.end || "17:00"),
      }))
      .sort((a, b) => a.start_date.localeCompare(b.start_date));
  } catch { return []; }
}
function buildAvailabilityJson(week: Record<string, WeekRule>, overrides: DateOverride[], blocks: DateBlock[], ranges: DateRangeRule[]): string {
  const out: any = { week: {}, overrides: {}, ranges: [] };
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
    if (!b?.date || !b.start || !b.end || b.end <= b.start) continue;
    const existing = out.overrides[b.date];
    if (Array.isArray(existing)) continue;
    if (!existing) { out.overrides[b.date] = { intervals: null, blocks: [{ start: b.start, end: b.end }] }; continue; }
    if (typeof existing === "object") { existing.blocks = Array.isArray(existing.blocks) ? existing.blocks : []; existing.blocks.push({ start: b.start, end: b.end }); }
  }
  out.ranges = (ranges || []).filter((r) => r.start_date && r.end_date && r.end > r.start).map((r) => ({
    id: r.id, start_date: r.start_date, end_date: r.end_date,
    days: Array.isArray(r.days) && r.days.length ? r.days : [0, 1, 2, 3, 4],
    intervals: [{ start: r.start, end: r.end }],
  }));
  return JSON.stringify(out);
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useScheduleSummary(schedule: Schedule | null, week: Record<string, WeekRule>) {
  return useMemo(() => {
    const tz = schedule?.timezone || detectBrowserTimeZone();
    const enabledDays = getEnabledDayIndexes(week);
    const labels = enabledDays.map((d) => DAY_LABELS[d]).filter(Boolean);
    let prettyDays = labels.join(", ");
    if (enabledDays.length === 5 && enabledDays.every((d, i) => d === i)) prettyDays = "Mon–Fri";
    if (enabledDays.length === 7) prettyDays = "Mon–Sun";
    if (enabledDays.length === 0) prettyDays = "No weekly hours";
    const firstEnabled = enabledDays[0];
    const timeText = typeof firstEnabled === "number"
      ? `${formatTimeLabel(week[String(firstEnabled)]?.start)} – ${formatTimeLabel(week[String(firstEnabled)]?.end)}`
      : "—";
    return { tz, prettyDays, timeText };
  }, [schedule?.timezone, week]);
}

// ─── Primitive UI components ──────────────────────────────────────────────────

function IconBubble({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "slate" | "violet" }) {
  return (
    <span className={cx(
      "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
      tone === "blue" && "bg-blue-50 text-[#0053dc]",
      tone === "slate" && "bg-slate-100 text-slate-600",
      tone === "violet" && "bg-violet-50 text-violet-600",
    )}>
      {children}
    </span>
  );
}

function PanelCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx(
      "rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/70 sm:p-6",
      className,
    )}>
      {children}
    </div>
  );
}

function SoftField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-slate-400">{hint}</span>}
    </label>
  );
}

// ─── Animated icons (kept exactly — only used internally) ─────────────────────

function ClockIconAuto({ size = 18, className }: { size?: number; className?: string }) {
  const hourControls = useAnimation();
  const minuteControls = useAnimation();
  useEffect(() => {
    hourControls.start({ rotate: 360, transition: { duration: 18, ease: "linear", repeat: Infinity, repeatType: "loop" } });
    minuteControls.start({ rotate: 360, transition: { duration: 3, ease: "linear", repeat: Infinity, repeatType: "loop" } });
  }, [hourControls, minuteControls]);
  return (
    <svg fill="none" height={size} width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="10" />
      <motion.line animate={hourControls} style={{ originX: "12px", originY: "12px" }} x1="12" y1="12" x2="12" y2="6" />
      <motion.line animate={minuteControls} style={{ originX: "12px", originY: "12px" }} x1="12" y1="12" x2="16" y2="12" />
    </svg>
  );
}

const steamVariants: Variants = {
  animate: (delaySeconds: number) => ({
    y: [-2, -8],
    opacity: [0, 1, 0],
    transition: {
      duration: 1.8,
      ease: "easeInOut" as const,
      repeat: Infinity,
      delay: delaySeconds,
    },
  }),
};
function CoffeeIconAuto({ size = 18, className }: { size?: number; className?: string }) {
  const c1 = useAnimation(); const c2 = useAnimation(); const c3 = useAnimation();
  useEffect(() => { c1.start("animate"); c2.start("animate"); c3.start("animate"); }, [c1, c2, c3]);
  return (
    <svg fill="none" height={size} width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" style={{ overflow: "visible" }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <motion.path animate={c1} custom={0} variants={steamVariants} d="M6 2v2" />
      <motion.path animate={c2} custom={0.3} variants={steamVariants} d="M10 2v2" />
      <motion.path animate={c3} custom={0.6} variants={steamVariants} d="M14 2v2" />
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
    </svg>
  );
}

const zapVariants: Variants = {
  animate: {
    opacity: [0, 1, 1, 0],
    pathLength: [0, 1, 1, 0],
    transition: {
      duration: 2.8,
      ease: "easeInOut" as const,
      repeat: Infinity,
      repeatDelay: 0.6,
      times: [0, 0.45, 0.75, 1],
    },
  },
};
function ZapIconAuto({ size = 18, className }: { size?: number; className?: string }) {
  const controls = useAnimation();
  useEffect(() => { controls.start("animate"); }, [controls]);
  return (
    <svg fill="none" height={size} width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} style={{ overflow: "visible" }}>
      <motion.path animate={controls} variants={zapVariants} d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

// ─── StepNav ──────────────────────────────────────────────────────────────────

function StepNav({
  activeStep,
  onStepClick,
  onClose,
}: {
  activeStep: SetupStep;
  onStepClick: (s: SetupStep) => void;
  onClose: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="grid h-[56px] grid-cols-[44px_minmax(0,1fr)_44px] items-center px-3 sm:grid-cols-[180px_minmax(0,1fr)_180px] sm:px-5">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-[#2c3437]">
          <CalendarDays className="h-4 w-4 text-[#0053dc]" />
          <span className="hidden sm:inline">Schedule</span>
        </div>

        <div className="mx-auto flex w-full max-w-[760px] items-center justify-start overflow-x-auto px-1 sm:justify-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SETUP_STEPS.map((step, i) => {
            const state =
              step.id < activeStep
                ? "done"
                : step.id === activeStep
                  ? "active"
                  : "pending";

            return (
              <React.Fragment key={step.id}>
                {i > 0 && (
                  <div
                    className={cx(
                      "h-px w-4 shrink-0 sm:w-5",
                      step.id <= activeStep ? "bg-blue-200" : "bg-slate-200",
                    )}
                  />
                )}

                <button
                  type="button"
                  onClick={() => onStepClick(step.id)}
                  className={cx(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors",
                    state === "active" && "bg-[#eef4ff]",
                    state !== "active" && "hover:bg-slate-50",
                  )}
                >
                  <span
                    className={cx(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      state === "done" && "bg-[#0053dc] text-white",
                      state === "active" &&
                      "bg-[#0053dc] text-white ring-[3px] ring-blue-100",
                      state === "pending" &&
                      "border border-slate-200 bg-slate-100 text-slate-400",
                    )}
                  >
                    {state === "done" ? (
                      <Check className="h-2.5 w-2.5" />
                    ) : (
                      step.id
                    )}
                  </span>

                  <span
                    className={cx(
                      "whitespace-nowrap text-[12px] font-medium",
                      state === "active" && "font-semibold text-[#0053dc]",
                      state === "done" && "text-[#2c3437]",
                      state === "pending" && "text-slate-400",
                    )}
                  >
                    {step.navLabel.split(": ")[1]}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close setup"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileSetupNav({
  activeStep,
  saving,
  disabled,
  onBack,
  onNext,
}: {
  activeStep: SetupStep;
  saving: boolean;
  disabled: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={activeStep === 1}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0053dc] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {saving ? "Saving…" : activeStep === 6 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
// ─── SideAngleButton ──────────────────────────────────────────────────────────

function SideAngleButton({ direction, disabled, saving, onClick }: { direction: "prev" | "next"; disabled: boolean; saving?: boolean; onClick: () => void }) {
  const isNext = direction === "next";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isNext ? "Next step" : "Previous step"}
      className={cx(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all active:scale-95",
        isNext && !disabled
          ? "border-[#0053dc] bg-[#0053dc] text-white shadow-[0_8px_24px_rgba(0,83,220,0.25)] hover:bg-[#0046c0]"
          : "",
        !isNext && !disabled
          ? "border-slate-200 bg-white text-[#2c3437] hover:border-[#0053dc]/30 hover:bg-[#eef4ff] hover:text-[#0053dc]"
          : "",
        disabled
          ? "cursor-not-allowed border-slate-100 bg-white text-slate-300 shadow-none"
          : "",
      )}
    >
      {saving && isNext
        ? <RefreshCw className="h-4 w-4 animate-spin" />
        : isNext
          ? <ArrowRight className="h-4 w-4" />
          : <ArrowLeft className="h-4 w-4" />
      }
    </button>
  );
}

// ─── Step 1: DaySelectionStep ────────────────────────────────────────────────

function DaySelectionStep({ week, onToggleDay, onApplyWorkweek, onApplyEveryday }: {
  week: Record<string, WeekRule>;
  onToggleDay: (dayKey: string) => void;
  onApplyWorkweek: () => void;
  onApplyEveryday: () => void;
}) {
  const activeCount = getEnabledDayIndexes(week).length;
  return (
    <div className="mx-auto w-full max-w-[1040px]">
      <PanelCard className="overflow-hidden p-0">
        {/* Header */}
        <div className="border-b border-slate-100 px-4 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#0053dc]">
                <CalendarDays className="h-3 w-3" />
                Availability setup
              </div>
              <h2 className="text-[24px] font-semibold leading-[1.12] tracking-tight text-[#1f2933] sm:text-[28px]">
                When are you usually active?
              </h2>
              <p className="mt-2 max-w-2xl text-[13px] font-medium leading-6 text-slate-700 sm:text-sm">
                Select the days people can book you. Fine-tune exact hours in the next step.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-left ring-1 ring-slate-200/60 lg:text-right shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Active days</p>
              <p className="mt-1 text-xl font-bold tracking-tight text-[#0053dc]">{activeCount} / 7</p>
            </div>
          </div>
        </div>

        {/* Day grid */}
        <div className="px-4 py-5 sm:px-7 sm:py-6">
          <div className="mx-auto mt-4 grid w-full max-w-[880px] grid-cols-2 gap-3 sm:mt-5 sm:grid-cols-4 lg:grid-cols-7">
            {DAY_LABELS.map((day, index) => {
              const key = String(index);
              const enabled = !!week[key]?.enabled;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => onToggleDay(key)}
                  className={cx(
                    "group flex min-h-[92px] w-full flex-col items-center justify-center rounded-2xl border px-3 py-4 text-center transition-all",
                    enabled
                      ? "border-[#0053dc] bg-[#eef4ff] text-[#0053dc] shadow-[0_4px_16px_rgba(0,83,220,0.12)]"
                      : "border-slate-200 bg-white text-slate-400 hover:border-blue-200 hover:bg-slate-50",
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {day}
                  </span>

                  <span
                    className={cx(
                      "mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full transition-all",
                      enabled
                        ? "bg-[#0053dc] text-white shadow-[0_4px_12px_rgba(0,83,220,0.25)]"
                        : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#0053dc]",
                    )}
                  >
                    {enabled ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <CalendarDays className="h-3.5 w-3.5" />
                    )}
                  </span>

                  <span
                    className={cx(
                      "mt-2.5 text-[10px] font-semibold",
                      enabled ? "text-[#0053dc]" : "text-slate-400",
                    )}
                  >
                    {enabled ? "Available" : "Off"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
            <button type="button" onClick={onApplyWorkweek}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#eef4ff] px-5 text-[13px] font-semibold text-[#0053dc] transition hover:bg-blue-100">
              Use standard work week
            </button>
            <button type="button" onClick={onApplyEveryday}
              className="inline-flex h-10 items-center justify-center rounded-full bg-slate-100 px-5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-200">
              Make every day available
            </button>
          </div>
        </div>

        {/* Info strip */}
        <div className="grid border-t border-slate-100 bg-slate-50/60 md:grid-cols-3">
          <InfoCard icon={<Globe2 className="h-4 w-4" />} title="Timezones" text="Invitees see slots in their local timezone." />
          <InfoCard icon={<RefreshCw className="h-4 w-4" />} title="Calendar sync" text="Existing conflicts stay protected in real time." />
          <InfoCard icon={<ShieldCheck className="h-4 w-4" />} title="Privacy" text="Clients only see available slots." />
        </div>
      </PanelCard>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex min-h-[88px] items-start gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] text-[#0053dc]">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-[#1f2933]">{title}</div>
        <div className="mt-1 text-[12px] leading-5 text-slate-700">{text}</div>
      </div>
    </div>
  );
}

// ─── Step 2: RhythmStep ───────────────────────────────────────────────────────

function RhythmStep({ week, onApplyTimeToEnabled, onSetDayTime }: {
  week: Record<string, WeekRule>;
  onApplyTimeToEnabled: (field: "start" | "end", value: string) => void;
  onSetDayTime: (dayKey: string, field: "start" | "end", value: string) => void;
}) {
  const enabledDayIndexes = getEnabledDayIndexes(week);
  const firstEnabled = enabledDayIndexes[0];
  const start = typeof firstEnabled === "number" ? week[String(firstEnabled)]?.start || "09:00" : "09:00";
  const end = typeof firstEnabled === "number" ? week[String(firstEnabled)]?.end || "17:00" : "17:00";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2c3437]">Set your working hours</h2>
        <p className="mt-1 text-sm text-slate-700">Define your daily window. Fine-tune each day below.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.50fr]">
        <PanelCard className="bg-slate-50/70">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-[#2c3437]">The standard day</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Most teams use a 9‑to‑5 window. Apply a clean default first, then adjust specific days below.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3.5 py-1.5 text-xs font-semibold text-[#0053dc]">9 AM – 5 PM</span>
              <span className="rounded-full bg-slate-200/70 px-3.5 py-1.5 text-xs font-semibold text-slate-700">Enabled days only</span>
            </div>
          </div>
        </PanelCard>

        <PanelCard>
          <div className="space-y-6">
            <SoftField label="Starting at">
              <TimeInputShell icon={<Clock className="h-4 w-4" />} value={start} onChange={(v) => onApplyTimeToEnabled("start", v)} />
            </SoftField>
            <div className="flex justify-center">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0053dc] text-white shadow-[0_4px_16px_rgba(0,83,220,0.3)]">
                <ArrowRight className="h-3.5 w-3.5 rotate-90" />
              </span>
            </div>
            <SoftField label="Ending at">
              <TimeInputShell icon={<Timer className="h-4 w-4" />} value={end} onChange={(v) => onApplyTimeToEnabled("end", v)} />
            </SoftField>
          </div>
        </PanelCard>
      </div>

      <PanelCard className="p-4 sm:p-5">
        <div>
          <h3 className="text-sm font-semibold text-[#2c3437]">Fine-tune each day</h3>
          <p className="mt-0.5 text-xs text-slate-700">Disabled days stay hidden from public booking pages.</p>
        </div>
        <div className="mt-4 grid gap-2.5">
          {Object.keys(week).sort((a, b) => Number(a) - Number(b)).map((key) => {
            const rule = week[key];
            return (
              <div key={key} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:grid-cols-[96px_1fr] sm:items-center">
                <div className="flex items-center gap-2.5">
                  <span className={cx("h-2 w-2 rounded-full shrink-0", rule.enabled ? "bg-[#0053dc]" : "bg-slate-300")} />
                  <span className={cx("text-sm font-semibold", rule.enabled ? "text-[#364248]" : "text-slate-400")}>
                    {DAY_LABELS[Number(key)]}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="time" value={rule.start} disabled={!rule.enabled} onChange={(e) => onSetDayTime(key, "start", e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#364248] outline-none transition focus:border-blue-400 disabled:text-slate-300" />
                  <input type="time" value={rule.end} disabled={!rule.enabled} onChange={(e) => onSetDayTime(key, "end", e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#364248] outline-none transition focus:border-blue-400 disabled:text-slate-300" />
                </div>
              </div>
            );
          })}
        </div>
      </PanelCard>
    </div>
  );
}

function TimeInputShell({ icon, value, onChange }: { icon: React.ReactNode; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex h-13 items-center gap-2.5 rounded-xl bg-slate-100 px-4">
      <span className="text-[#0053dc] shrink-0">{icon}</span>
      <input type="time" value={value} onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-base font-semibold tracking-tight text-[#2c3437] outline-none" />
      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
    </div>
  );
}

// ─── Step 3: DurationStep ─────────────────────────────────────────────────────

function DurationStep({ duration, onChange }: { duration: number; onChange: (duration: number) => void }) {
  const customDuration = ![...DURATION_PRESETS, ...EXTRA_DURATION_PRESETS].includes(duration as any);
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[#2c3437]">Default meeting duration</h2>
        <p className="mt-1 text-sm text-slate-700">Select a standard duration. Custom event types can override this later.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DURATION_PRESETS.map((minutes) => {
          const active = duration === minutes;
          return (
            <button key={minutes} type="button" onClick={() => onChange(minutes)}
              className={cx(
                "relative rounded-2xl border bg-white p-5 text-center transition-all",
                active ? "border-[#0053dc] ring-2 ring-blue-100 shadow-[0_4px_16px_rgba(0,83,220,0.10)]" : "border-slate-200 hover:border-slate-300 hover:shadow-sm",
              )}
            >
              {active && (
                <span className="absolute right-4 top-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0053dc] text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                {minutes === 30
                  ? <ClockIconAuto size={22} className="text-[#0053dc]" />
                  : minutes === 60
                    ? <Timer className="h-5 w-5 text-slate-700" />
                    : <span className="text-base font-bold">{minutes}</span>
                }
              </span>
              <div className="mt-6 text-xl font-semibold text-[#2c3437]">{minutes}</div>
              <div className="mt-1 text-xs font-medium text-slate-400">Minutes</div>
              {minutes === 30 && (
                <span className="mt-4 inline-flex rounded-full bg-[#0053dc] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Recommended
                </span>
              )}
            </button>
          );
        })}
      </div>

      <PanelCard className="mx-auto max-w-2xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SoftField label="Custom duration" hint="Use this when your default slot length is not in the presets.">
            <input type="number" min={5} step={5} value={customDuration ? duration : ""} placeholder="Enter minutes"
              onChange={(e) => onChange(parseInt(e.target.value, 10) || 30)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-blue-400 sm:w-56" />
          </SoftField>
          <div className="flex flex-wrap gap-2">
            {EXTRA_DURATION_PRESETS.map((minutes) => (
              <button key={minutes} type="button" onClick={() => onChange(minutes)}
                className={cx(
                  "h-9 rounded-full px-4 text-sm font-semibold transition",
                  duration === minutes ? "bg-[#0053dc] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}>
                {minutes} min
              </button>
            ))}
          </div>
        </div>
      </PanelCard>
    </div>
  );
}

// ─── Step 4: BreakStep ────────────────────────────────────────────────────────

function BreakStep({
  schedule, onScheduleChange,
  blocks, blockDate, blockStart, blockEnd,
  onBlockDateChange, onBlockStartChange, onBlockEndChange, onAddBlock, onRemoveBlock,
}: {
  schedule: Schedule | null; onScheduleChange: (patch: Partial<Schedule>) => void;
  blocks: DateBlock[]; blockDate: string; blockStart: string; blockEnd: string;
  onBlockDateChange: (v: string) => void; onBlockStartChange: (v: string) => void; onBlockEndChange: (v: string) => void;
  onAddBlock: () => void; onRemoveBlock: (index: number) => void;
}) {
  const before = schedule?.buffer_before_minutes || 0;
  const after = schedule?.buffer_after_minutes || 0;
  const buffersEnabled = before > 0 || after > 0;

  return (
    <div className="space-y-5">
      <PanelCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <IconBubble><CoffeeIconAuto size={20} className="text-current" /></IconBubble>
            <div>
              <h2 className="text-base font-semibold text-[#2c3437]">Add breathing room</h2>
              <p className="mt-0.5 text-sm leading-6 text-slate-700">Create automatic buffer time around meetings so your calendar doesn't feel packed.</p>
            </div>
          </div>
          <button type="button" aria-pressed={buffersEnabled}
            onClick={() => onScheduleChange(buffersEnabled ? { buffer_before_minutes: 0, buffer_after_minutes: 0 } : { buffer_before_minutes: 15, buffer_after_minutes: 15 })}
            className={cx("relative h-8 w-14 rounded-full p-1 transition-colors shrink-0", buffersEnabled ? "bg-[#0053dc]" : "bg-slate-200")}>
            <span className={cx("block h-6 w-6 rounded-full bg-white shadow-sm transition-transform", buffersEnabled ? "translate-x-6" : "translate-x-0")} />
          </button>
        </div>
      </PanelCard>

      <div className="grid gap-4 md:grid-cols-2">
        <PanelCard>
          <SoftField label="Buffer before">
            <input type="number" min={0} value={before} onChange={(e) => onScheduleChange({ buffer_before_minutes: parseInt(e.target.value, 10) || 0 })}
              className="h-13 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-lg font-semibold outline-none focus:border-blue-400" />
          </SoftField>
          <p className="mt-2 text-xs text-slate-400">Minutes blocked before every meeting.</p>
        </PanelCard>
        <PanelCard>
          <SoftField label="Buffer after">
            <input type="number" min={0} value={after} onChange={(e) => onScheduleChange({ buffer_after_minutes: parseInt(e.target.value, 10) || 0 })}
              className="h-13 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-lg font-semibold outline-none focus:border-blue-400" />
          </SoftField>
          <p className="mt-2 text-xs text-slate-400">Minutes blocked after every meeting.</p>
        </PanelCard>
      </div>

      <div className="flex gap-3 rounded-xl border border-violet-100 bg-violet-50/60 p-4 text-violet-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-sm leading-6">Need a lunch block or a one-off unavailable window? Add a date-specific block below.</p>
      </div>

      <PanelCard>
        <h3 className="text-sm font-semibold text-[#2c3437]">One-off time blocks</h3>
        <p className="mt-0.5 text-xs text-slate-400">Blocks remove slots from a specific date.</p>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <SoftField label="Date">
            <input type="date" value={blockDate} onChange={(e) => onBlockDateChange(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-400" />
          </SoftField>
          <SoftField label="Block starts">
            <input type="time" value={blockStart} onChange={(e) => onBlockStartChange(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-400" />
          </SoftField>
          <SoftField label="Block ends">
            <input type="time" value={blockEnd} onChange={(e) => onBlockEndChange(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-400" />
          </SoftField>
          <button type="button" onClick={onAddBlock}
            className="h-11 rounded-xl bg-[#1a2028] px-5 text-sm font-semibold text-white hover:bg-[#2c3437] transition-colors">
            Add block
          </button>
        </div>

        <RulesList empty="No one-off blocks set yet.">
          {blocks.map((block, index) => (
            <RuleRow key={`${block.date}_${block.start}_${index}`} title={block.date}
              detail={`${formatTimeLabel(block.start)} – ${formatTimeLabel(block.end)}`}
              onRemove={() => onRemoveBlock(index)} />
          ))}
        </RulesList>
      </PanelCard>
    </div>
  );
}

// ─── Step 5: LimitsStep ───────────────────────────────────────────────────────

function LimitsStep({ schedule, summary, onScheduleChange }: {
  schedule: Schedule | null;
  summary: { tz: string; prettyDays: string; timeText: string };
  onScheduleChange: (patch: Partial<Schedule>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[#2c3437]">Booking limits</h2>
        <p className="mt-1 text-sm text-slate-700">Define the boundaries for your schedule to prevent burnout and ensure you're always prepared.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PanelCard>
          <IconBubble><CalendarDays className="h-5 w-5" /></IconBubble>
          <div className="mt-5">
            <SoftField label="Booking window" hint="How many days ahead clients can book.">
              <input type="number" min={1} value={schedule?.max_days_ahead || 60}
                onChange={(e) => onScheduleChange({ max_days_ahead: parseInt(e.target.value, 10) || 60 })}
                className="h-13 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-lg font-semibold outline-none focus:border-blue-400" />
            </SoftField>
          </div>
        </PanelCard>
        <PanelCard>
          <IconBubble tone="violet"><Timer className="h-5 w-5" /></IconBubble>
          <div className="mt-5">
            <SoftField label="Minimum notice" hint="Minimum minutes required before a new booking.">
              <input type="number" min={0} value={schedule?.min_notice_minutes || 0}
                onChange={(e) => onScheduleChange({ min_notice_minutes: parseInt(e.target.value, 10) || 0 })}
                className="h-13 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-lg font-semibold outline-none focus:border-blue-400" />
            </SoftField>
          </div>
        </PanelCard>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0053dc]">
          <Zap className="h-4 w-4" />
        </span>
        <div>
          <div className="text-sm font-semibold text-blue-900">Your current setup</div>
          <p className="mt-0.5 text-sm text-blue-700">{summary.prettyDays} · {summary.timeText} · {summary.tz}</p>
        </div>
      </div>

      <PanelCard>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h3 className="text-sm font-semibold text-[#2c3437]">Host timezone</h3>
            <p className="mt-0.5 text-xs text-slate-400">Availability rules are applied using this timezone.</p>
          </div>
          <TimezonePicker value={schedule?.timezone || ""} onChange={(next) => onScheduleChange({ timezone: next })} label="Host Timezone" />
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Auto-detected: <span className="font-semibold text-slate-600">{detectBrowserTimeZone()}</span>
        </p>
      </PanelCard>
    </div>
  );
}

// ─── Step 6: AdvancedRulesPanel ───────────────────────────────────────────────

function AdvancedRulesPanel({
  activeAdvancedTab, setActiveAdvancedTab,
  overrides, overrideDate, overrideMode, overrideStart, overrideEnd,
  setOverrideDate, setOverrideMode, setOverrideStart, setOverrideEnd,
  addOrUpdateOverride, removeOverride,
  ranges, rangeStartDate, rangeEndDate, rangeStartTime, rangeEndTime, rangeDays,
  setRangeStartDate, setRangeEndDate, setRangeStartTime, setRangeEndTime,
  toggleRangeDay, addRange, removeRange,
}: {
  activeAdvancedTab: AdvancedTabKey; setActiveAdvancedTab: (tab: AdvancedTabKey) => void;
  overrides: DateOverride[]; overrideDate: string; overrideMode: DateOverride["mode"]; overrideStart: string; overrideEnd: string;
  setOverrideDate: (v: string) => void; setOverrideMode: (v: DateOverride["mode"]) => void;
  setOverrideStart: (v: string) => void; setOverrideEnd: (v: string) => void;
  addOrUpdateOverride: () => void; removeOverride: (date: string) => void;
  ranges: DateRangeRule[]; rangeStartDate: string; rangeEndDate: string; rangeStartTime: string; rangeEndTime: string; rangeDays: number[];
  setRangeStartDate: (v: string) => void; setRangeEndDate: (v: string) => void;
  setRangeStartTime: (v: string) => void; setRangeEndTime: (v: string) => void;
  toggleRangeDay: (dayIdx: number) => void; addRange: () => void; removeRange: (id: string) => void;
}) {
  return (
    <PanelCard>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#0053dc]">
            <Settings2 className="h-3.5 w-3.5" /> Advanced settings
          </div>
          <h3 className="mt-1.5 text-xl font-semibold text-[#2c3437]">Overrides and date ranges</h3>
          <p className="mt-0.5 text-sm text-slate-700">Fine-grained controls for specific dates and date windows.</p>
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1 shrink-0">
          {(["overrides", "ranges"] as const).map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveAdvancedTab(tab)}
              className={cx(
                "h-9 rounded-lg px-4 text-sm font-semibold transition-colors capitalize",
                activeAdvancedTab === tab ? "bg-white text-[#0053dc] shadow-sm" : "text-slate-700 hover:text-slate-700",
              )}>
              {tab === "overrides" ? "Overrides" : "Date ranges"}
            </button>
          ))}
        </div>
      </div>

      {activeAdvancedTab === "overrides" ? (
        <div className="mt-6">
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <SoftField label="Date">
              <input type="date" value={overrideDate} onChange={(e) => setOverrideDate(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-400" />
            </SoftField>
            <SoftField label="Mode">
              <select value={overrideMode} onChange={(e) => setOverrideMode(e.target.value as DateOverride["mode"])}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-400">
                <option value="available">Available</option>
                <option value="unavailable">Unavailable all day</option>
              </select>
            </SoftField>
            <SoftField label="Time window">
              <div className="grid grid-cols-2 gap-2">
                <input type="time" value={overrideStart} disabled={overrideMode === "unavailable"} onChange={(e) => setOverrideStart(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-400 disabled:text-slate-300" />
                <input type="time" value={overrideEnd} disabled={overrideMode === "unavailable"} onChange={(e) => setOverrideEnd(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-400 disabled:text-slate-300" />
              </div>
            </SoftField>
            <button type="button" onClick={addOrUpdateOverride}
              className="h-11 rounded-xl bg-[#1a2028] px-5 text-sm font-semibold text-white hover:bg-[#2c3437] transition-colors">
              Add / Update
            </button>
          </div>
          <RulesList empty="No overrides set yet.">
            {overrides.map((override) => (
              <RuleRow key={override.date} title={override.date}
                detail={override.mode === "unavailable" ? "Unavailable all day" : `Available · ${formatTimeLabel(override.start)} – ${formatTimeLabel(override.end)}`}
                onRemove={() => removeOverride(override.date)} />
            ))}
          </RulesList>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <SoftField label="Start date">
              <input type="date" value={rangeStartDate} onChange={(e) => setRangeStartDate(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-400" />
            </SoftField>
            <SoftField label="End date">
              <input type="date" value={rangeEndDate} onChange={(e) => setRangeEndDate(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-400" />
            </SoftField>
            <SoftField label="Time window">
              <div className="grid grid-cols-2 gap-2">
                <input type="time" value={rangeStartTime} onChange={(e) => setRangeStartTime(e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-400" />
                <input type="time" value={rangeEndTime} onChange={(e) => setRangeEndTime(e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-400" />
              </div>
            </SoftField>
            <button type="button" onClick={addRange}
              className="h-11 rounded-xl bg-[#1a2028] px-5 text-sm font-semibold text-white hover:bg-[#2c3437] transition-colors">
              Add range
            </button>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2.5">Days in range</div>
            <div className="flex flex-wrap gap-2">
              {DAY_LABELS.map((day, index) => (
                <button key={day} type="button" onClick={() => toggleRangeDay(index)}
                  className={cx(
                    "h-9 rounded-full px-3.5 text-sm font-semibold transition-colors",
                    rangeDays.includes(index) ? "bg-[#0053dc] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          <RulesList empty="No date ranges set yet.">
            {ranges.map((range) => (
              <RuleRow key={range.id}
                title={`${range.start_date} → ${range.end_date}`}
                detail={`${(range.days || []).sort((a, b) => a - b).map((d) => DAY_LABELS[d]).join(", ")} · ${formatTimeLabel(range.start)} – ${formatTimeLabel(range.end)}`}
                onRemove={() => removeRange(range.id)} />
            ))}
          </RulesList>
        </div>
      )}
    </PanelCard>
  );
}

// ─── Shared list/row components ───────────────────────────────────────────────

function RulesList({ children, empty }: { children: React.ReactNode; empty: string }) {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {items.length ? items : <div className="p-4 text-sm text-slate-400">{empty}</div>}
    </div>
  );
}

function RuleRow({ title, detail, onRemove }: { title: string; detail: string; onRemove: () => void }) {
  return (
    <div className="flex flex-col gap-2 border-t border-slate-100 p-4 first:border-t-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm font-semibold text-[#2c3437]">{title}</div>
        <div className="mt-0.5 text-xs text-slate-700">{detail}</div>
      </div>
      <button type="button" onClick={onRemove}
        className="text-left text-xs font-semibold text-slate-400 hover:text-red-700 transition-colors sm:text-right">
        Remove
      </button>
    </div>
  );
}

// ─── Dashboard components ─────────────────────────────────────────────────────

function DayPill({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={cx(
        "flex min-h-[56px] flex-col items-center justify-center rounded-2xl px-2 text-center transition-all",
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shadow-[0_3px_12px_rgba(16,185,129,0.10)]"
          : "bg-slate-100/70 text-slate-400 hover:bg-slate-100",
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide">
        {label}
      </span>
      <span className="mt-1 text-[11px] font-medium">
        {active ? "Active" : "—"}
      </span>
    </span>
  );
}

function formatInlineTimeLabel(value: string) {
  if (!value) return "—";

  const [hourText, minuteText = "00"] = value.split(":");
  let hour = Number(hourText);

  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${String(hour).padStart(2, "0")}:${minuteText} ${period}`;
}
function WeeklyAvailabilityCard({
  week,
  summary,
  onEdit,
  onWeekChange,
}: {
  week: Record<string, WeekRule>;
  summary: { tz: string; prettyDays: string; timeText: string };
  onEdit: () => void;
  onWeekChange: React.Dispatch<React.SetStateAction<Record<string, WeekRule>>>;
}) {
  const enabledDays = getEnabledDayIndexes(week);
  const firstEnabledDay = enabledDays[0];

  const startValue =
    typeof firstEnabledDay === "number"
      ? week[String(firstEnabledDay)]?.start || "09:00"
      : "09:00";

  const endValue =
    typeof firstEnabledDay === "number"
      ? week[String(firstEnabledDay)]?.end || "17:00"
      : "17:00";
  const startInputRef = React.useRef<HTMLInputElement>(null);
  const endInputRef = React.useRef<HTMLInputElement>(null);

  function openTimePicker(input: HTMLInputElement | null) {
    if (!input) return;

    try {
      input.showPicker?.();
    } catch {
      input.focus();
      input.click();
    }
  }
  function toggleDay(index: number) {
    onWeekChange((current) => {
      const key = String(index);

      return {
        ...current,
        [key]: {
          ...current[key],
          enabled: !current[key]?.enabled,
          start: current[key]?.start || startValue,
          end: current[key]?.end || endValue,
        },
      };
    });
  }

  function updateTimeForActiveDays(field: "start" | "end", value: string) {
    onWeekChange((current) => {
      const activeDays = getEnabledDayIndexes(current);
      const targetDays = activeDays.length ? activeDays : [0, 1, 2, 3, 4];

      const next = { ...current };

      targetDays.forEach((dayIndex) => {
        const key = String(dayIndex);

        next[key] = {
          ...next[key],
          enabled: true,
          start: next[key]?.start || "09:00",
          end: next[key]?.end || "17:00",
          [field]: value,
        };
      });

      return next;
    });
  }

  return (
    <PanelCard className="self-start">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#1f2933]">
            Weekly availability
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Click days or working hours to edit directly.
          </p>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="w-fit shrink-0 text-xs font-semibold text-[#0053dc] transition-colors hover:text-[#003fa8]"
        >
          Edit days &amp; hours
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {DAY_LABELS.map((day, index) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(index)}
            className="min-w-0 text-left active:scale-[0.98]"
          >
            <DayPill label={day} active={!!week[String(index)]?.enabled} />
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-600 shadow-[0_1px_4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/60">
            <Clock className="h-4 w-4" />
          </span>

          <div>
            <div className="text-[13px] font-semibold text-[#1f2933]">
              Working Window
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
              <span>
                {enabledDays.length} active{" "}
                {enabledDays.length === 1 ? "day" : "days"}
              </span>
              <span className="text-slate-300">·</span>
              <span>{summary.prettyDays}</span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="relative inline-flex items-center gap-1 text-[18px] font-bold tracking-tight text-[#0053dc]">
            <button
              type="button"
              onClick={() => openTimePicker(startInputRef.current)}
              className="rounded-lg px-1 transition hover:bg-white active:scale-95"
              title="Change start time"
            >
              {formatInlineTimeLabel(startValue)}
            </button>

            <input
              ref={startInputRef}
              type="time"
              value={startValue}
              onChange={(e) => updateTimeForActiveDays("start", e.target.value)}
              className="absolute h-px w-px opacity-0"
              tabIndex={-1}
            />

            <span>–</span>

            <button
              type="button"
              onClick={() => openTimePicker(endInputRef.current)}
              className="rounded-lg px-1 transition hover:bg-white active:scale-95"
              title="Change end time"
            >
              {formatInlineTimeLabel(endValue)}
            </button>

            <input
              ref={endInputRef}
              type="time"
              value={endValue}
              onChange={(e) => updateTimeForActiveDays("end", e.target.value)}
              className="absolute h-px w-px opacity-0"
              tabIndex={-1}
            />
          </div>

          <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-slate-400">
            {summary.tz}
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
function RhythmRow({ icon, label, value, helper, onClick }: {
  icon: React.ReactNode; label: string; value: string; helper?: string; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-left transition-colors hover:bg-[#eef4ff]">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0053dc] shadow-[0_1px_4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/60">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold text-[#1f2933]">{label}</span>
          <span className="shrink-0 text-[13px] font-semibold text-[#0053dc]">{value}</span>
        </span>
        {helper && <span className="mt-0.5 block truncate text-[11px] text-slate-700">{helper}</span>}
      </span>
      <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0053dc]" />
    </button>
  );
}

function MeetingRhythmCard({
  schedule,
  blocks,
  onScheduleChange,

  blockDate,
  blockStart,
  blockEnd,
  onBlockDateChange,
  onBlockStartChange,
  onBlockEndChange,
  onAddBlock,

  overrideDate,
  overrideMode,
  overrideStart,
  overrideEnd,
  setOverrideDate,
  setOverrideMode,
  setOverrideStart,
  setOverrideEnd,
  addOrUpdateOverride,
}: {
  schedule: Schedule | null;
  blocks: DateBlock[];
  onScheduleChange: (patch: Partial<Schedule>) => void;

  blockDate: string;
  blockStart: string;
  blockEnd: string;
  onBlockDateChange: (value: string) => void;
  onBlockStartChange: (value: string) => void;
  onBlockEndChange: (value: string) => void;
  onAddBlock: () => void;

  overrideDate: string;
  overrideMode: DateOverride["mode"];
  overrideStart: string;
  overrideEnd: string;
  setOverrideDate: (value: string) => void;
  setOverrideMode: (value: DateOverride["mode"]) => void;
  setOverrideStart: (value: string) => void;
  setOverrideEnd: (value: string) => void;
  addOrUpdateOverride: () => void;
}) {
  const before = schedule?.buffer_before_minutes || 0;
  const after = schedule?.buffer_after_minutes || 0;
  const sameBuffer = before === after;
  const bufferValue = sameBuffer ? String(after) : "custom";
  const duration = schedule?.duration_minutes || 30;

  function updateDuration(value: string) {
    const minutes = Number(value);
    if (!minutes) return;

    onScheduleChange({
      duration_minutes: minutes,
    });
  }

  function updateBuffer(value: string) {
    if (value === "custom") return;

    const minutes = Number(value) || 0;

    onScheduleChange({
      buffer_before_minutes: minutes,
      buffer_after_minutes: minutes,
    });
  }

  function updateCustomBuffer(field: "before" | "after", value: string) {
    const minutes = Number(value) || 0;

    if (field === "before") {
      onScheduleChange({ buffer_before_minutes: minutes });
    } else {
      onScheduleChange({ buffer_after_minutes: minutes });
    }
  }

  return (
    <PanelCard className="self-start">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#2c3437]">
            Meeting rhythm
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Duration, buffer, breaks, and date-specific availability.
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
          Direct edit
        </span>
      </div>

      <div className="grid gap-2.5">
        <div className="rounded-xl bg-[#eef4ff] p-3 ring-1 ring-blue-100">
          <div className="grid gap-3 xl:grid-cols-[minmax(210px,1fr)_minmax(250px,auto)] xl:items-center">            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0053dc] ring-1 ring-blue-100">
                <ClockIconAuto size={17} className="text-current" />
              </span>

              <div>
                <p className="text-[13px] font-semibold text-[#1f2933]">
                  Default duration
                </p>
                <p className="text-[11px] text-slate-500">
                  Used when an event type has no custom duration.
                </p>
              </div>
            </div>

            <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-[120px_90px]">
              <select
                value={[15, 30, 45, 60, 90, 120].includes(duration) ? duration : "custom"}
                onChange={(e) => {
                  if (e.target.value !== "custom") {
                    updateDuration(e.target.value);
                  }
                }}
                className="h-10 rounded-xl border border-blue-100 bg-white px-3 text-sm font-semibold text-[#0053dc] outline-none transition focus:border-[#0053dc]"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
                <option value="custom">Custom</option>
              </select>

              <input
                type="number"
                min={5}
                step={5}
                value={duration}
                onChange={(e) => updateDuration(e.target.value)}
                className="h-10 rounded-xl border border-blue-100 bg-white px-3 text-sm font-semibold text-[#0053dc] outline-none transition focus:border-[#0053dc]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/60">
          <div className="grid gap-3 lg:grid-cols-[minmax(180px,1fr)_minmax(258px,auto)] lg:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0053dc] ring-1 ring-slate-200/70">
                <ZapIconAuto size={15} className="text-current" />
              </span>

              <div className="min-w-0">
                <p className="whitespace-nowrap text-[13px] font-semibold text-[#1f2933]">
                  Smart buffer
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                  Buffer before and after meetings.
                </p>
              </div>
            </div>

            <div className="grid w-full gap-2 sm:grid-cols-[126px_62px_62px] lg:w-auto">
              <select
                value={bufferValue}
                onChange={(e) => updateBuffer(e.target.value)}
                className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#364248] outline-none transition focus:border-[#0053dc]"
              >
                <option value="0">No buffer</option>
                <option value="5">5 min both</option>
                <option value="10">10 min both</option>
                <option value="15">15 min both</option>
                <option value="30">30 min both</option>
                {bufferValue === "custom" && (
                  <option value="custom">Custom</option>
                )}
              </select>

              <input
                type="number"
                min={0}
                value={before}
                onChange={(e) => updateCustomBuffer("before", e.target.value)}
                placeholder="Before"
                title="Buffer before"
                className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-center text-sm font-semibold text-[#364248] outline-none transition focus:border-[#0053dc]"
              />

              <input
                type="number"
                min={0}
                value={after}
                onChange={(e) => updateCustomBuffer("after", e.target.value)}
                placeholder="After"
                title="Buffer after"
                className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-center text-sm font-semibold text-[#364248] outline-none transition focus:border-[#0053dc]"
              />
            </div>
          </div>
        </div>

        <details className="group rounded-xl bg-slate-50 ring-1 ring-slate-200/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 ring-1 ring-slate-200/70">
                <CoffeeIconAuto size={15} className="text-current" />
              </span>

              <div>
                <p className="text-[13px] font-semibold text-[#1f2933]">
                  Break time
                </p>
                <p className="text-[11px] text-slate-500">
                  Add lunch or unavailable blocks.
                </p>
              </div>
            </div>

            <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
          </summary>

          <div className="border-t border-slate-200/70 p-3">
            <div className="grid gap-2 lg:grid-cols-[1fr_110px_110px_auto]">
              <input
                type="date"
                value={blockDate}
                onChange={(e) => onBlockDateChange(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#364248] outline-none transition focus:border-[#0053dc]"
              />

              <input
                type="time"
                value={blockStart}
                onChange={(e) => onBlockStartChange(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#364248] outline-none transition focus:border-[#0053dc]"
              />

              <input
                type="time"
                value={blockEnd}
                onChange={(e) => onBlockEndChange(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#364248] outline-none transition focus:border-[#0053dc]"
              />

              <button
                type="button"
                onClick={onAddBlock}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1a2028] px-4 text-sm font-semibold text-white transition hover:bg-[#2c3437]"
              >
                Add
              </button>
            </div>

            {blocks.length > 0 && (
              <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[#1f2933]">
                    Breaks added
                  </p>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    {blocks.length}
                  </span>
                </div>

                <div className="max-h-28 space-y-1.5 overflow-y-auto pr-1">
                  {blocks.map((block, index) => (
                    <div
                      key={`${block.date}-${block.start}-${block.end}-${index}`}
                      className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-[#1f2933]"
                    >
                      {block.date} · {formatTimeLabel(block.start)} –{" "}
                      {formatTimeLabel(block.end)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </details>

        <details className="group rounded-xl border border-amber-100 bg-amber-50/70">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-amber-700 ring-1 ring-amber-200">
                <CalendarDays className="h-4 w-4" />
              </span>

              <div>
                <p className="text-[13px] font-semibold text-amber-900">
                  Specific date availability
                </p>
                <p className="text-[11px] text-amber-700">
                  Override one date only.
                </p>
              </div>
            </div>

            <ChevronDown className="h-4 w-4 text-amber-600 transition group-open:rotate-180" />
          </summary>

          <div className="border-t border-amber-100 p-3">
            <div className="grid gap-2 lg:grid-cols-[1fr_170px]">
              <input
                type="date"
                value={overrideDate}
                onChange={(e) => setOverrideDate(e.target.value)}
                className="h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm font-semibold text-[#364248] outline-none transition focus:border-amber-500"
              />

              <select
                value={overrideMode}
                onChange={(e) =>
                  setOverrideMode(e.target.value as DateOverride["mode"])
                }
                className="h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm font-semibold text-[#364248] outline-none transition focus:border-amber-500"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable / holiday</option>
              </select>
            </div>

            {overrideMode === "available" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="time"
                  value={overrideStart}
                  onChange={(e) => setOverrideStart(e.target.value)}
                  className="h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm font-semibold text-[#364248] outline-none transition focus:border-amber-500"
                />

                <input
                  type="time"
                  value={overrideEnd}
                  onChange={(e) => setOverrideEnd(e.target.value)}
                  className="h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm font-semibold text-[#364248] outline-none transition focus:border-amber-500"
                />
              </div>
            )}

            <button
              type="button"
              onClick={addOrUpdateOverride}
              className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              {overrideMode === "unavailable"
                ? "Mark unavailable"
                : "Save availability"}
            </button>
          </div>
        </details>
      </div>
    </PanelCard>
  );
}

// function LimitStat({ label, value, helper }: { label: string; value: string; helper?: string }) {
//   return (
//     <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/60">
//       <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
//       <p className="mt-1.5 truncate text-[14px] font-semibold text-[#1f2933]">{value}</p>
//       {helper && <p className="mt-0.5 truncate text-[11px] text-slate-400">{helper}</p>}
//     </div>
//   );
// }
const DEFAULT_HOST_TIMEZONE = "Asia/Kolkata";

const HOST_TIMEZONE_OPTIONS = [
  { value: "Asia/Kolkata", label: "India" },
  { value: "UTC", label: "UTC" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "America/New_York", label: "New York" },
  { value: "America/Chicago", label: "Chicago" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
  { value: "Australia/Sydney", label: "Sydney" },
];

function getUtcOffsetLabel(timeZone: string) {
  try {
    const offsetPart = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
    })
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName")?.value;

    return (offsetPart || "GMT").replace("GMT", "UTC");
  } catch {
    return "UTC";
  }
}

function getTimezoneBadge(timeZone: string) {
  const badges: Record<string, string> = {
    "Asia/Kolkata": "IST",
    UTC: "UTC",
    "Asia/Dubai": "GST",
    "Asia/Singapore": "SGT",
    "Asia/Tokyo": "JST",
    "Europe/London": "GMT",
    "Europe/Paris": "CET",
    "America/New_York": "ET",
    "America/Chicago": "CT",
    "America/Los_Angeles": "PT",
    "Australia/Sydney": "AET",
  };

  return badges[timeZone] || "TZ";
}

function cleanTimezoneLabel(timeZone: string) {
  return timeZone.replace(/_/g, " ");
}

function HostTimezoneDropdown({
  value,
  onChange,
}: {
  value?: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const selectedTimezone = value?.trim() || DEFAULT_HOST_TIMEZONE;

  const optionExists = HOST_TIMEZONE_OPTIONS.some(
    (option) => option.value === selectedTimezone
  );

  const options = optionExists
    ? HOST_TIMEZONE_OPTIONS
    : [
      {
        value: selectedTimezone,
        label: cleanTimezoneLabel(selectedTimezone),
      },
      ...HOST_TIMEZONE_OPTIONS,
    ];

  React.useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-600">
          Timezone
        </span>
      </div>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-[44px] w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 text-left shadow-sm transition hover:border-[#0053dc]/40 focus:border-[#0053dc] focus:outline-none"
      >
        <span className="text-sm font-semibold text-gray-900">
          {getUtcOffsetLabel(selectedTimezone)}
        </span>

        <span className="flex items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            {getTimezoneBadge(selectedTimezone)}
          </span>

          <ChevronDown
            className={cx(
              "h-4 w-4 text-slate-400 transition",
              open && "rotate-180"
            )}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {options.map((option) => {
            const active = option.value === selectedTimezone;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cx(
                  "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition",
                  active
                    ? "bg-[#eef4ff] text-[#0053dc]"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {option.label}
                  </span>
                  <span className="block text-[11px] font-medium text-slate-400">
                    {getUtcOffsetLabel(option.value)}
                  </span>
                </span>

                <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                  {getTimezoneBadge(option.value)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// function HostTimezoneDisplay() {
//   return (
//     <div>
//       <div className="mb-1 flex items-center justify-between">
//         <span className="text-[11px] font-medium text-gray-600">
//           Timezone
//         </span>
//       </div>

//       <div className="flex h-[44px] w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 shadow-sm">
//         <span className="text-sm font-semibold text-gray-900">
//           {getUtcOffsetLabel(schedule?.timezone || detectBrowserTimeZone())}
//         </span>

//         <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
//           IST
//         </span>
//       </div>
//     </div>
//   );
// }
function BookingLimitsDashboardCard({
  schedule,
  summary,
  onScheduleChange,
}: {
  schedule: Schedule | null;
  summary: { tz: string; prettyDays: string; timeText: string };
  onScheduleChange: (patch: Partial<Schedule>) => void;
}) {
  const minNotice = schedule?.min_notice_minutes || 0;
  const maxDaysAhead = schedule?.max_days_ahead || 60;

  function updateMinNotice(value: string) {
    const minutes = Number(value);

    onScheduleChange({
      min_notice_minutes: Number.isFinite(minutes) ? Math.max(0, minutes) : 0,
    });
  }

  function updateMaxDaysAhead(value: string) {
    const days = Number(value);

    onScheduleChange({
      max_days_ahead: Number.isFinite(days) && days > 0 ? days : 60,
    });
  }

  return (
    <PanelCard className="self-start">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[#2c3437]">
            Booking limits
          </h2>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
Control when clients can book and keep your availability protected.          </p>
        </div>

        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#0053dc] ring-1 ring-slate-200/70">
          <CalendarDays className="h-4 w-4" />
        </span>
      </div>

      <div className="grid gap-3">
        <div className="rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200/60">
          <div className="mb-3 flex items-center justify-between gap-3">
            {/* <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#1f2933]">
                Booking rules
              </p>
              <p className="text-[11px] leading-4 text-slate-500">
                Control how soon and how far ahead people can book.
              </p>
            </div> */}
{/* 
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#0053dc] ring-1 ring-slate-200/70">
              <CalendarDays className="h-4 w-4" />
            </span> */}
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <label className="block min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Minimum notice
              </span>

              <div className="mt-2 grid grid-cols-[minmax(0,1fr)_76px] gap-2">
                <select
                  value={
                    [0, 15, 30, 60, 120, 240, 1440].includes(minNotice)
                      ? minNotice
                      : "custom"
                  }
                  onChange={(e) => {
                    if (e.target.value !== "custom") {
                      updateMinNotice(e.target.value);
                    }
                  }}
                  className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#1f2933] outline-none transition focus:border-[#0053dc]"
                >
                  <option value={0}>No notice</option>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={240}>4 hours</option>
                  <option value={1440}>1 day</option>
                  <option value="custom">Custom</option>
                </select>

                <input
                  type="number"
                  min={0}
                  value={minNotice}
                  onChange={(e) => updateMinNotice(e.target.value)}
                  className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#1f2933] outline-none transition focus:border-[#0053dc]"
                />
              </div>
            </label>

            <label className="block min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Booking window
              </span>

              <div className="mt-2 grid grid-cols-[minmax(0,1fr)_90px] gap-2">
                <input
                  type="number"
                  min={1}
                  value={maxDaysAhead}
                  onChange={(e) => updateMaxDaysAhead(e.target.value)}
                  className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#1f2933] outline-none transition focus:border-[#0053dc]"
                />
                <span className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-2 text-[11px] font-semibold text-slate-400 ring-1 ring-slate-200">
                  days ahead
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/60">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#1f2933]">
                Host timezone
              </p>
              <p className="text-[11px] leading-4 text-slate-500">
                Availability rules use this timezone.
              </p>
            </div>
          </div>

          <HostTimezoneDropdown
            value={schedule?.timezone || DEFAULT_HOST_TIMEZONE}
            onChange={(next) => onScheduleChange({ timezone: next })}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {/* <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-emerald-800">
                Calendar sync enabled
              </p>
              <p className="mt-0.5 text-[11px] leading-4 text-emerald-700">
                Calendar conflicts stay protected.
              </p>
            </div>

            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 ring-1 ring-emerald-100">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div> */}

          <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#0053dc]">
              Active schedule
            </p>

            <p className="mt-1 truncate text-[13px] font-semibold leading-5 text-[#1a3a7a]">
              {summary.prettyDays}
            </p>

            <p className="mt-0.5 text-[12px] font-semibold text-[#0053dc]">
              {summary.timeText}
            </p>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
function ApplyScopeOption({ active, title, description, badge, onClick }: {
  active: boolean; title: string; description: string; badge?: string; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className={cx(
        "relative min-h-[110px] rounded-xl p-4 text-left transition-all",
        active ? "bg-[#eef4ff] ring-2 ring-[#0053dc]" : "bg-white ring-1 ring-slate-200 hover:bg-slate-50",
      )}
    >
      <span className={cx(
        "absolute left-4 top-4 inline-flex h-4 w-4 items-center justify-center rounded-full ring-1",
        active ? "bg-[#0053dc] ring-[#0053dc]" : "bg-white ring-slate-300",
      )}>
        {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      {badge && (
        <span className="absolute right-0 top-0 rounded-bl-lg rounded-tr-xl bg-[#0053dc] px-3 py-1 text-[9px] font-semibold uppercase tracking-wide text-white">
          {badge}
        </span>
      )}
      <div className="pt-7">
        <div className={cx("text-sm font-semibold", active ? "text-[#0053dc]" : "text-[#2c3437]")}>{title}</div>
        <p className="mt-1.5 text-xs leading-5 text-slate-700">{description}</p>
      </div>
    </button>
  );
}

function ApplyScheduleChangesCard({ applyScope, onApplyScopeChange, onSave, onDiscard, saving, loading }: {
  applyScope: ApplyChangeScope; onApplyScopeChange: (scope: ApplyChangeScope) => void;
  onSave: () => void; onDiscard: () => void; saving: boolean; loading: boolean;
}) {
  return (
    <PanelCard>
      <h2 className="text-base font-semibold text-[#2c3437]">Apply schedule changes</h2>
      <p className="mt-1 text-xs text-slate-700">Decide how your modifications should impact existing and future bookings.</p>

      <div className="mt-5 grid gap-2.5 lg:grid-cols-2">
        <ApplyScopeOption active={applyScope === "upcoming"} title="Upcoming events only"
          description="Changes apply to new bookings starting now. Existing booked meetings stay as they are."
          onClick={() => onApplyScopeChange("upcoming")} />
        <ApplyScopeOption active={applyScope === "all"} badge="Recommended" title="Previous + upcoming"
          description="Use this when your schedule rules should be treated as the new source of truth for this profile."
          onClick={() => onApplyScopeChange("all")} />
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600 ring-1 ring-red-100">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Existing booked meetings will not be cancelled automatically.
        </div>
        <div className="flex shrink-0 flex-col-reverse gap-2.5 sm:flex-row sm:items-center">
          <button type="button" onClick={onDiscard} disabled={loading || saving}
            className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">
            Discard
          </button>
          <button type="button" onClick={onSave} disabled={loading || saving}
            className="inline-flex h-11 min-w-[132px] items-center justify-center rounded-xl bg-[#0053dc] px-6 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,83,220,0.22)] hover:bg-[#0046c0] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none transition-all">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </PanelCard>
  );
}

function StickyUnsavedBanner({
  onSave,
  onDiscard,
  saving,
}: {
  applyScope: ApplyChangeScope;
  onApplyScopeChange: (scope: ApplyChangeScope) => void;
  onSave: () => void;
  onDiscard: () => void;
  saving: boolean;
}) {
  return (
    <div className="sticky top-4 z-30 mb-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-100 bg-amber-50/95 px-4 py-3 shadow-[0_8px_28px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-amber-600 ring-1 ring-amber-200">
            <Info className="h-4 w-4" />
          </span>

          <div>
            <p className="text-sm font-semibold text-[#1f2933]">
              Unsaved schedule changes
            </p>
            <p className="mt-0.5 text-xs text-slate-600">
              Review your changes and save when ready.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onDiscard}
            disabled={saving}
            className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-slate-600 transition hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex h-9 min-w-[112px] items-center justify-center rounded-xl bg-[#0053dc] px-4 text-xs font-semibold text-white shadow-[0_6px_18px_rgba(0,83,220,0.22)] transition hover:bg-[#0046c0] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function ScheduleDashboard({
  schedule,
  week,
  summary,
  blocks,
  applyScope,
  onApplyScopeChange,
  onOpenSetup,
  onSave,
  onDiscard,
  onWeekChange,
  onScheduleChange,

  blockDate,
  blockStart,
  blockEnd,
  onBlockDateChange,
  onBlockStartChange,
  onBlockEndChange,
  onAddBlock,

  overrideDate,
  overrideMode,
  overrideStart,
  overrideEnd,
  setOverrideDate,
  setOverrideMode,
  setOverrideStart,
  setOverrideEnd,
  addOrUpdateOverride,

  saving,
  loading,
  hasUnsavedChanges,
}: {
  schedule: Schedule | null;
  week: Record<string, WeekRule>;
  summary: { tz: string; prettyDays: string; timeText: string };
  blocks: DateBlock[];

  applyScope: ApplyChangeScope;
  onApplyScopeChange: (scope: ApplyChangeScope) => void;
  onOpenSetup: (step?: SetupStep) => void;
  onSave: () => void;
  onDiscard: () => void;

  onWeekChange: React.Dispatch<React.SetStateAction<Record<string, WeekRule>>>;
  onScheduleChange: (patch: Partial<Schedule>) => void;

  blockDate: string;
  blockStart: string;
  blockEnd: string;
  onBlockDateChange: (value: string) => void;
  onBlockStartChange: (value: string) => void;
  onBlockEndChange: (value: string) => void;
  onAddBlock: () => void;

  overrideDate: string;
  overrideMode: DateOverride["mode"];
  overrideStart: string;
  overrideEnd: string;
  setOverrideDate: (value: string) => void;
  setOverrideMode: (value: DateOverride["mode"]) => void;
  setOverrideStart: (value: string) => void;
  setOverrideEnd: (value: string) => void;
  addOrUpdateOverride: () => void;

  saving: boolean;
  loading: boolean;
  hasUnsavedChanges: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#2c3437]">
      <main className="mx-auto w-full max-w-[1720px] px-3 pb-24 pt-4 sm:px-5 sm:pt-6 lg:px-7 2xl:px-10">
        {loading ? (
          <PanelCard className="py-20 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#0053dc] border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-slate-400">
              Loading your schedule…
            </p>
          </PanelCard>
        ) : (
          <section className="grid gap-4 2xl:gap-5">
            {hasUnsavedChanges && (
              <StickyUnsavedBanner
                applyScope={applyScope}
                onApplyScopeChange={onApplyScopeChange}
                onSave={onSave}
                onDiscard={onDiscard}
                saving={saving}
              />
            )}

            <WeeklyAvailabilityCard
              week={week}
              summary={summary}
              onEdit={() => onOpenSetup(1)}
              onWeekChange={onWeekChange}
            />

            <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] 2xl:grid-cols-[minmax(0,1fr)_minmax(390px,0.82fr)] 2xl:gap-5">
              <MeetingRhythmCard
                schedule={schedule}
                blocks={blocks}
                onScheduleChange={onScheduleChange}
                blockDate={blockDate}
                blockStart={blockStart}
                blockEnd={blockEnd}
                onBlockDateChange={onBlockDateChange}
                onBlockStartChange={onBlockStartChange}
                onBlockEndChange={onBlockEndChange}
                onAddBlock={onAddBlock}
                overrideDate={overrideDate}
                overrideMode={overrideMode}
                overrideStart={overrideStart}
                overrideEnd={overrideEnd}
                setOverrideDate={setOverrideDate}
                setOverrideMode={setOverrideMode}
                setOverrideStart={setOverrideStart}
                setOverrideEnd={setOverrideEnd}
                addOrUpdateOverride={addOrUpdateOverride}
              />

                <BookingLimitsDashboardCard
                  schedule={schedule}
                  summary={summary}
                  onScheduleChange={onScheduleChange}
                />
            </div>

            <ApplyScheduleChangesCard
              applyScope={applyScope}
              onApplyScopeChange={onApplyScopeChange}
              onSave={onSave}
              onDiscard={onDiscard}
              saving={saving}
              loading={loading}
            />
          </section>
        )}
      </main>
    </div>
  );
}

// ─── Root export (logic unchanged) ───────────────────────────────────────────

export default function YourSchedulePage() {
  const { toast } = useToast();
  const [userSub, setUserSub] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("slotly_user");
    if (!saved) return;
    try { const parsed = JSON.parse(saved); setUserSub(parsed.sub); } catch { }
  }, []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [week, setWeek] = useState<Record<string, WeekRule>>(defaultWeek());
  const [screenMode, setScreenMode] = useState<ScheduleScreenMode>("dashboard");
  const [activeStep, setActiveStep] = useState<SetupStep>(1);
  const [activeAdvancedTab, setActiveAdvancedTab] = useState<AdvancedTabKey>("overrides");
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [applyScope, setApplyScope] = useState<ApplyChangeScope>("upcoming");

  const [overrides, setOverrides] = useState<DateOverride[]>([]);
  const [overrideDate, setOverrideDate] = useState("");
  const [overrideMode, setOverrideMode] = useState<DateOverride["mode"]>("available");
  const [overrideStart, setOverrideStart] = useState("09:00");
  const [overrideEnd, setOverrideEnd] = useState("17:00");

  const [blocks, setBlocks] = useState<DateBlock[]>([]);
  const [blockDate, setBlockDate] = useState("");
  const [blockStart, setBlockStart] = useState("13:00");
  const [blockEnd, setBlockEnd] = useState("14:00");

  const [ranges, setRanges] = useState<DateRangeRule[]>([]);
  const [rangeStartDate, setRangeStartDate] = useState("");
  const [rangeEndDate, setRangeEndDate] = useState("");
  const [rangeStartTime, setRangeStartTime] = useState("09:00");
  const [rangeEndTime, setRangeEndTime] = useState("17:00");
  const [rangeDays, setRangeDays] = useState<number[]>([0, 1, 2, 3, 4]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("slotly-schedule-edit-mode", screenMode === "setup");
    return () => { document.body.classList.remove("slotly-schedule-edit-mode"); };
  }, [screenMode]);

  async function loadScheduleData(options?: { decideInitialMode?: boolean; showError?: boolean }) {
    if (!userSub) return;
    setLoading(true);
    try {
      const data = await fetchSchedule(userSub);
      const detectedTz = detectBrowserTimeZone();
      const normalized = { ...data, timezone: (data?.timezone || "").trim() || detectedTz };
      const nextWeek = fromAvailabilityJson(normalized.availability_json);
      const nextOverrides = parseOverrides(normalized.availability_json);
      const nextBlocks = parseBlocks(normalized.availability_json);
      const nextRanges = parseRanges(normalized.availability_json);
      setSchedule(normalized); setWeek(nextWeek); setOverrides(nextOverrides); setBlocks(nextBlocks); setRanges(nextRanges);
      setSavedSnapshot(createScheduleSnapshot(normalized, nextWeek, nextOverrides, nextBlocks, nextRanges));
      setApplyScope(getInitialApplyScope(userSub));
      if (!data?.timezone || !String(data.timezone).trim()) {
        try { await updateSchedule(userSub, { timezone: detectedTz }); } catch { }
      }
      if (options?.decideInitialMode) {
        if (shouldAutoStartSetup(userSub, normalized)) { markSetupSeen(userSub); setActiveStep(1); setScreenMode("setup"); }
        else setScreenMode("dashboard");
      }
    } catch (e: any) {
      if (options?.showError !== false) toast({ title: "Failed to load schedule", description: e?.message || "Please try again.", variant: "error" });
    } finally { setLoading(false); }
  }

  useEffect(() => {
    if (!userSub) return;
    let mounted = true;
    (async () => { if (mounted) await loadScheduleData({ decideInitialMode: true, showError: true }); })();
    return () => { mounted = false; };
  }, [userSub]);

  const summary = useScheduleSummary(schedule, week);
  const currentSnapshot = useMemo(() => createScheduleSnapshot(schedule, week, overrides, blocks, ranges), [schedule, week, overrides, blocks, ranges]);
  const hasUnsavedChanges = !!savedSnapshot && !!currentSnapshot && currentSnapshot !== savedSnapshot;
  const setupComplete = !!userSub && (!!safeGetStorage(storageKey(SETUP_COMPLETE_STORAGE_PREFIX, userSub)) || hasSavedAvailability(schedule));

  function updateScheduleDraft(patch: Partial<Schedule>) { setSchedule((c) => (c ? { ...c, ...patch } : c)); }

  function validateWeek() {
    for (const key of Object.keys(week)) {
      const rule = week[key];
      if (!rule.enabled) continue;
      if (!rule.start || !rule.end || rule.end <= rule.start) {
        toast({ title: "Invalid weekly hours", description: `${DAY_LABELS[Number(key)]} end time must be after start time.`, variant: "error" });
        return false;
      }
    }
    return true;
  }

  async function save(options?: { returnToDashboard?: boolean }) {
    if (!userSub || !schedule) return;
    if (!validateWeek()) return;
    setSaving(true);
    try {
      safeSetStorage(storageKey(APPLY_SCOPE_STORAGE_PREFIX, userSub), applyScope);
      const availability_json = buildAvailabilityJson(week, overrides, blocks, ranges);
      const updated = await updateSchedule(userSub, {
        timezone: schedule.timezone,
        duration_minutes: schedule.duration_minutes,
        availability_json,
        buffer_before_minutes: schedule.buffer_before_minutes,
        buffer_after_minutes: schedule.buffer_after_minutes,
        min_notice_minutes: schedule.min_notice_minutes,
        max_days_ahead: schedule.max_days_ahead,
      });

      await syncScheduleToAllEventTypes(userSub, updated, availability_json);
      const nextWeek = fromAvailabilityJson(updated.availability_json); const nextOverrides = parseOverrides(updated.availability_json);
      const nextBlocks = parseBlocks(updated.availability_json); const nextRanges = parseRanges(updated.availability_json);
      setSchedule(updated); setWeek(nextWeek); setOverrides(nextOverrides); setBlocks(nextBlocks); setRanges(nextRanges);
      setSavedSnapshot(createScheduleSnapshot(updated, nextWeek, nextOverrides, nextBlocks, nextRanges));
      markSetupComplete(userSub);
      toast({ title: "Schedule saved", description: applyScope === "all" ? "Saved with previous + upcoming preference." : "Saved for upcoming events only.", variant: "success" });
      if (options?.returnToDashboard) { setScreenMode("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }
    } catch (e: any) { toast({ title: "Failed to save", description: e?.message || "Please try again.", variant: "error" }); }
    finally { setSaving(false); }
  }

  function openSetup(step: SetupStep = 1) { if (userSub) markSetupSeen(userSub); setActiveStep(step); setScreenMode("setup"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function closeSetup() { setScreenMode("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function goNext() { if (activeStep < 6) { setActiveStep((c) => Math.min(c + 1, 6) as SetupStep); return; } save({ returnToDashboard: true }); }
  function goBack() { setActiveStep((c) => Math.max(c - 1, 1) as SetupStep); }

  function changeApplyScope(scope: ApplyChangeScope) {
    setApplyScope(scope);
    if (userSub) {
      safeSetStorage(storageKey(APPLY_SCOPE_STORAGE_PREFIX, userSub), scope);
    }
  }

  function discardChanges() {
    void loadScheduleData({ showError: true });
  }

  function toggleDay(dayKey: string) { setWeek((c) => ({ ...c, [dayKey]: { ...c[dayKey], enabled: !c[dayKey].enabled } })); }
  function applyWorkweek() { setWeek((c) => { const n = { ...c }; for (const k of Object.keys(n)) n[k] = { ...n[k], enabled: Number(k) <= 4 }; return n; }); }
  function applyEveryday() { setWeek((c) => { const n = { ...c }; for (const k of Object.keys(n)) n[k] = { ...n[k], enabled: true }; return n; }); }
  function applyTimeToEnabled(field: "start" | "end", value: string) { setWeek((c) => { const n = { ...c }; for (const k of Object.keys(n)) if (n[k].enabled) n[k] = { ...n[k], [field]: value }; return n; }); }
  function setDayTime(dayKey: string, field: "start" | "end", value: string) { setWeek((c) => ({ ...c, [dayKey]: { ...c[dayKey], [field]: value } })); }

  function addOrUpdateOverride() {
    if (!overrideDate) return;
    if (overrideMode === "available" && (!overrideStart || !overrideEnd || overrideEnd <= overrideStart)) {
      toast({ title: "Invalid override time", description: "End time must be after start time.", variant: "error" }); return;
    }
    setOverrides((c) => { const n = c.filter((o) => o.date !== overrideDate); n.push({ date: overrideDate, mode: overrideMode, start: overrideStart, end: overrideEnd }); return n.sort((a, b) => a.date.localeCompare(b.date)); });
  }
  function removeOverride(date: string) { setOverrides((c) => c.filter((o) => o.date !== date)); }

  function addBlock() {
    if (!blockDate) return;
    if (!blockStart || !blockEnd || blockEnd <= blockStart) { toast({ title: "Invalid block time", description: "Block end time must be after start time.", variant: "error" }); return; }
    setBlocks((c) => [...c, { date: blockDate, start: blockStart, end: blockEnd }].sort((a, b) => a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)));
  }
  function removeBlock(idx: number) { setBlocks((c) => c.filter((_, i) => i !== idx)); }

  function toggleRangeDay(dayIdx: number) { setRangeDays((c) => c.includes(dayIdx) ? c.filter((d) => d !== dayIdx) : [...c, dayIdx].sort((a, b) => a - b)); }
  function addRange() {
    if (!rangeStartDate || !rangeEndDate) return;
    if (rangeEndDate < rangeStartDate) { toast({ title: "Invalid date range", description: "End date must be on or after start date.", variant: "error" }); return; }
    if (!rangeStartTime || !rangeEndTime || rangeEndTime <= rangeStartTime) { toast({ title: "Invalid range time", description: "End time must be after start time.", variant: "error" }); return; }
    const id = `${rangeStartDate}_${rangeEndDate}_${Date.now()}`;
    setRanges((c) => [...c, { id, start_date: rangeStartDate, end_date: rangeEndDate, days: rangeDays.length ? rangeDays : [0, 1, 2, 3, 4], start: rangeStartTime, end: rangeEndTime }].sort((a, b) => a.start_date.localeCompare(b.start_date)));
  }
  function removeRange(id: string) { setRanges((c) => c.filter((r) => r.id !== id)); }

  if (!userSub) return <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-slate-400">Loading…</div>;

  if (screenMode === "dashboard") {
    return (
      <ScheduleDashboard
        schedule={schedule}
        week={week}
        summary={summary}
        blocks={blocks}
        applyScope={applyScope}
        onApplyScopeChange={changeApplyScope}
        onOpenSetup={openSetup}
        onSave={() => {
          void save();
        }}
        onDiscard={discardChanges}
        onWeekChange={setWeek}
        onScheduleChange={updateScheduleDraft}

        blockDate={blockDate}
        blockStart={blockStart}
        blockEnd={blockEnd}
        onBlockDateChange={setBlockDate}
        onBlockStartChange={setBlockStart}
        onBlockEndChange={setBlockEnd}
        onAddBlock={addBlock}

        overrideDate={overrideDate}
        overrideMode={overrideMode}
        overrideStart={overrideStart}
        overrideEnd={overrideEnd}
        setOverrideDate={setOverrideDate}
        setOverrideMode={setOverrideMode}
        setOverrideStart={setOverrideStart}
        setOverrideEnd={setOverrideEnd}
        addOrUpdateOverride={addOrUpdateOverride}

        saving={saving}
        loading={loading}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-10">
      <StepNav activeStep={activeStep} onStepClick={setActiveStep} onClose={closeSetup} />

      <main className="mx-auto mt-3 w-full max-w-[1184px] px-3 pb-28 sm:mt-6 sm:px-5 sm:pb-8 lg:px-6">
        {loading ? (
          <PanelCard className="py-20 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#0053dc] border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-slate-400">Loading your schedule…</p>
          </PanelCard>
        ) : (
          <div className="mx-auto grid w-full max-w-[1184px] grid-cols-1 items-start sm:grid-cols-[52px_minmax(0,1040px)_52px] sm:gap-5">
              <div className="hidden justify-center pt-2 sm:flex">
                <SideAngleButton direction="prev" disabled={activeStep === 1} onClick={goBack} />
              </div>

            <div className="min-w-0">
              {activeStep === 1 && <DaySelectionStep week={week} onToggleDay={toggleDay} onApplyWorkweek={applyWorkweek} onApplyEveryday={applyEveryday} />}
              {activeStep === 2 && <RhythmStep week={week} onApplyTimeToEnabled={applyTimeToEnabled} onSetDayTime={setDayTime} />}
              {activeStep === 3 && <DurationStep duration={schedule?.duration_minutes || 30} onChange={(d) => updateScheduleDraft({ duration_minutes: d })} />}
              {activeStep === 4 && (
                <BreakStep schedule={schedule} onScheduleChange={updateScheduleDraft}
                  blocks={blocks} blockDate={blockDate} blockStart={blockStart} blockEnd={blockEnd}
                  onBlockDateChange={setBlockDate} onBlockStartChange={setBlockStart} onBlockEndChange={setBlockEnd}
                  onAddBlock={addBlock} onRemoveBlock={removeBlock} />
              )}
              {activeStep === 5 && <LimitsStep schedule={schedule} summary={summary} onScheduleChange={updateScheduleDraft} />}
              {activeStep === 6 && (
                <AdvancedRulesPanel
                  activeAdvancedTab={activeAdvancedTab} setActiveAdvancedTab={setActiveAdvancedTab}
                  overrides={overrides} overrideDate={overrideDate} overrideMode={overrideMode} overrideStart={overrideStart} overrideEnd={overrideEnd}
                  setOverrideDate={setOverrideDate} setOverrideMode={setOverrideMode} setOverrideStart={setOverrideStart} setOverrideEnd={setOverrideEnd}
                  addOrUpdateOverride={addOrUpdateOverride} removeOverride={removeOverride}
                  ranges={ranges} rangeStartDate={rangeStartDate} rangeEndDate={rangeEndDate} rangeStartTime={rangeStartTime} rangeEndTime={rangeEndTime} rangeDays={rangeDays}
                  setRangeStartDate={setRangeStartDate} setRangeEndDate={setRangeEndDate} setRangeStartTime={setRangeStartTime} setRangeEndTime={setRangeEndTime}
                  toggleRangeDay={toggleRangeDay} addRange={addRange} removeRange={removeRange}
                />
              )}
            </div>

              <div className="hidden justify-center pt-2 sm:flex">
                <SideAngleButton
                  direction="next"
                  disabled={!schedule || saving || loading}
                  saving={saving}
                  onClick={goNext}
                />
              </div>
          </div>
        )}
      </main>
    </div>
  );
}
