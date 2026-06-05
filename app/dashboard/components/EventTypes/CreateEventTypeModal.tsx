

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,

  X,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import {
  Calendar,
  Video,
  Phone,
  MapPin,
  Briefcase,
  Handshake,
  User,
  BarChart,
  Brain,
  Target,
  FileText,
  School,
  Users,
  Zap,
  Search,
  MessageCircle,
} from "lucide-react";
import AvailabilityEditorModal from "../Schedule/AvailabilityEditorModal";
import TimezonePicker from "../TimezonePicker";
import { getBrowserTimezone, getPreferredTimezone } from "@/lib/timezone";
import { uploadBrandLogo } from "@/lib/userApi";
import BookingForm from "@/components/booking/BookingForm";
import SetMeetingLocationModal from "@/components/shared/SetMeetingLocationModal";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
type MeetingMode = "google_meet" | "in_person";
type EventTypeModalPayload = {
  title: string;
  meeting_mode: MeetingMode;
  location?: string;
  availability_json?: string | null;
  duration_minutes?: number;
  timezone?: string | null;
  brand_logo_url?: string | null;
  icon?: string | null;
  is_public?: boolean;
  description?: string;
};

type EditableEventType = {
  id: number;
  title?: string | null;
  meeting_mode?: string | null;
  location?: string | null;
  availability_json?: string | null;
  duration_minutes?: number | null;
  timezone?: string | null;
  brand_logo_url?: string | null;
  icon?: string | null;
  is_public?: boolean | null;
  description?: string | null;
};
const EVENT_ICON_OPTIONS = [
  { key: "calendar", icon: Calendar },
  { key: "video", icon: Video },
  { key: "phone", icon: Phone },
  { key: "pin", icon: MapPin },
  { key: "briefcase", icon: Briefcase },
  { key: "handshake", icon: Handshake },
  { key: "user", icon: User },
  { key: "chart", icon: BarChart },
  { key: "brain", icon: Brain },
  { key: "target", icon: Target },
  { key: "file", icon: FileText },
  { key: "home", icon: School },
  { key: "users", icon: Users },
  { key: "zap", icon: Zap },
  { key: "search", icon: Search },
  { key: "message", icon: MessageCircle },
];

const getEventIcon = (key: string | null | undefined) => {
  return EVENT_ICON_OPTIONS.find((item) => item.key === key)?.icon ?? null;
};

function normalizeAvailabilityForPayload(value: string | null | undefined): string | null {
  const raw = String(value || "").trim();

  if (!raw || raw === "{}") {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    const week = parsed.week || parsed.weekly || parsed.rules;
    const overrides = parsed.overrides;
    const ranges = parsed.ranges;
    const bookingWindow = parsed.booking_window || parsed.window;

    const hasWeek =
      week &&
      typeof week === "object" &&
      Object.values(week).some((value) => Array.isArray(value) && value.length > 0);

    const hasOverrides =
      overrides &&
      typeof overrides === "object" &&
      Object.keys(overrides).length > 0;

    const hasRanges = Array.isArray(ranges) && ranges.length > 0;

    const hasBookingWindow =
      bookingWindow &&
      typeof bookingWindow === "object" &&
      Boolean(bookingWindow.enabled);

    if (!hasWeek && !hasOverrides && !hasRanges && !hasBookingWindow) {
      return null;
    }

    return JSON.stringify(parsed);
  } catch {
    return null;
  }
}
export default function CreateEventTypeModal({
  open,
  onClose,
  onCreate,
  onUpdate,
  userSub,
  mode = "create",
  item = null,
}: {
  open: boolean;
  onClose: () => void;
  onCreate?: (payload: EventTypeModalPayload) => Promise<void>;
  onUpdate?: (id: number, payload: EventTypeModalPayload) => Promise<void>;
  userSub: string | null;
  mode?: "create" | "edit";
  item?: EditableEventType | null;
}) {
  const isEdit = mode === "edit";
  const [title, setTitle] = useState("");
  const [meetingMode, setMeetingMode] = useState<MeetingMode>("google_meet");
  const [location, setLocation] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [timezone, setTimezone] = useState<string>(() => getPreferredTimezone() || getBrowserTimezone());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
 

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [checkingGoogle, setCheckingGoogle] = useState(false);
  const [availabilityJson, setAvailabilityJson] = useState<string>("");
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedEventIcon, setSelectedEventIcon] = useState<string | null>(null);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const iconPickerRef = useRef<HTMLDivElement | null>(null);
  const needsLocation = meetingMode === "in_person";
  const needsGoogle = meetingMode === "google_meet";
  const googleBlocked = !isEdit && needsGoogle && !googleConnected;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const apiBase =
    (process.env.NEXT_PUBLIC_API_BASE || "https://api.slotly.io")
      .trim()
      .replace(/\/+$/, "");

  const showGoogleConnectPill =
    meetingMode === "google_meet" && !checkingGoogle && !googleConnected;

  async function fetchGoogleCalendarStatus() {
    if (!userSub) {
      setGoogleConnected(false);
      return;
    }

    setCheckingGoogle(true);

    try {
      const url = `${apiBase}/auth/calendar-status?user_sub=${encodeURIComponent(userSub)}`;
      console.log("MODAL calendar URL:", url);

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        console.error("MODAL calendar status failed:", res.status, res.statusText);
        setGoogleConnected(false);
        return;
      }

      const data = await res.json();
      console.log("MODAL calendar response:", data);

      setGoogleConnected(Boolean(data?.calendar_connected));
    } catch (err) {
      console.error("Failed to fetch Google Calendar status:", err);
      setGoogleConnected(false);
    } finally {
      setCheckingGoogle(false);
    }
  }
  useEffect(() => {
    if (!open) return;

    fetchGoogleCalendarStatus();
    setError(null);
    setAvailabilityOpen(false);
    setLocationModalOpen(false);
    setSaving(false);
    setLogoUrl(null);
    setLogoUploading(false);
    setIconPickerOpen(false);

    if (isEdit && item) {
      setTitle(String(item.title || ""));
      setMeetingMode(
        String(item.meeting_mode || "google_meet") === "in_person"
          ? "in_person"
          : "google_meet"
      );
      setLocation(String(item.location || ""));
      setDurationMinutes(Number(item.duration_minutes || 15));
      setTimezone(String(item.timezone || getPreferredTimezone() || getBrowserTimezone()));
      setAvailabilityJson(String(item.availability_json || ""));
      setExistingLogoUrl(item.brand_logo_url || null);
      setDescription(String(item.description || ""));
      setSelectedEventIcon(item.icon || null);
      setIsPublic(true);
      return;
    }

    setTitle("");
    setMeetingMode("google_meet");
    setLocation("");
    setDurationMinutes(15);
    setTimezone(getPreferredTimezone() || getBrowserTimezone());
    setAvailabilityJson("");
    setExistingLogoUrl(null);
    setDescription("");
    setSelectedEventIcon(null);
    setIsPublic(true);
  }, [open, userSub, isEdit, item]);


 
  useEffect(() => {
    if (!open) return;

    const refresh = () => {
      fetchGoogleCalendarStatus();
    };

    window.addEventListener("focus", refresh);
    window.addEventListener("slotly-calendar-changed", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("slotly-calendar-changed", refresh);
    };
  }, [open, userSub]);

  useEffect(() => {
    if (!open) return;

    if (meetingMode === "in_person" && !location.trim()) {
      const t = setTimeout(() => setLocationModalOpen(true), 120);
      return () => clearTimeout(t);
    }

    if (meetingMode !== "in_person") {
      setLocationModalOpen(false);
      setLocation("");
    }
  }, [meetingMode, open, location]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        iconPickerRef.current &&
        !iconPickerRef.current.contains(event.target as Node)
      ) {
        setIconPickerOpen(false);
      }
    }

    if (iconPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [iconPickerOpen]);
  useEffect(() => {
    if (!open) return;

    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open]);
  const titleIcon = useMemo(() => {
    const icon = getEventIcon(selectedEventIcon);
  
    if (icon) return icon;

    return meetingMode === "google_meet" ? Video : MapPin;
  }, [meetingMode, selectedEventIcon]);
  const Icon = titleIcon;
  const effectiveLogo = logoUrl || existingLogoUrl || null;
  const logoSrc = (() => {
    if (!effectiveLogo) return null;

    if (effectiveLogo.includes("/user/logo")) return null;

    if (effectiveLogo.startsWith("http")) return effectiveLogo;

    if (effectiveLogo.startsWith("/uploads")) {
      return `${apiBase}${effectiveLogo}`;
    }

    return null;
  })();
  const availabilityMeta = useMemo(() => {
    const normalized = normalizeAvailabilityForPayload(availabilityJson);
    return { isSet: Boolean(normalized) };
  }, [availabilityJson]);

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    const cleanLocation = location.trim();

    if (!cleanTitle) {
      setError("Title is required");
      return;
    }
    if (needsLocation && !cleanLocation) {
      setError("Location is required for in-person meeting");
      return;
    }
    if (googleBlocked) {
      setError("Please connect Google Calendar first");
      return;
    }
    setSaving(true);
    try {
      const payload: EventTypeModalPayload = {
        title: cleanTitle,
        meeting_mode: meetingMode,
        location: needsLocation ? cleanLocation : "",
        availability_json: normalizeAvailabilityForPayload(availabilityJson),
        duration_minutes: durationMinutes,
        timezone,
        brand_logo_url: logoUrl || existingLogoUrl || null,
        icon: selectedEventIcon || null,
        is_public: isEdit ? true : isPublic,
        description: description.trim(),
      };

      if (isEdit) {
        if (!item?.id || !onUpdate) throw new Error("Missing update handler");
        await onUpdate(Number(item.id), payload);
      } else {
        if (!onCreate) throw new Error("Missing create handler");
        await onCreate(payload);
      }

      onClose();
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;
  const descriptionWordCount = description
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />

        {/* Modal shell */}
        <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="
              relative w-full
              sm:max-w-[720px] lg:max-w-[860px] 2xl:max-w-[980px]
              bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl
              max-h-[100dvh] sm:max-h-[95dvh]
              flex flex-col overflow-hidden
            "
          >
            {/* Header */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b bg-white">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Title */}
                    <h2 className="text-base sm:text-xl font-semibold text-slate-900">
                      {isEdit ? "Edit Event" : "Create Event"}
                    </h2>

                    {/* Toggle + Close */}
                    <div className="flex items-center justify-end gap-3 sm:gap-4">
                      {!isEdit && (
                      <div className="inline-flex h-10 items-center rounded-full bg-slate-100 p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsPublic(false)}
                          className={`inline-flex h-8 min-w-[78px] items-center justify-center rounded-full px-4 text-xs sm:text-sm transition ${!isPublic
                              ? "bg-white font-medium text-slate-900 shadow-sm"
                              : "text-slate-500"
                            }`}
                        >
                          Private
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsPublic(true)}
                          className={`inline-flex h-8 min-w-[78px] items-center justify-center rounded-full px-4 text-xs sm:text-sm transition ${isPublic
                              ? "bg-white font-medium text-slate-900 shadow-sm"
                              : "text-slate-500"
                            }`}
                        >
                          Public
                        </button>
                      </div>
                      )}
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
                        aria-label="Close"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BODY */}
            <form onSubmit={submit} className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {isPublic ? (
                  <motion.div
                    key="public"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 sm:px-6 py-4 sm:py-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                        {/* LEFT */}
                        <div className="space-y-4">
                          <div className="relative" ref={iconPickerRef}>
                            <label className="text-xs font-medium text-slate-600">
                              Title
                            </label>

                            <div className="mt-1 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setIconPickerOpen((prev) => !prev)}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-white transition hover:bg-slate-50 focus:outline-none"
                                aria-label="Choose event icon"
                              >
                                <Icon className="w-4 h-4 text-slate-600" />
                              </button>

                              <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full h-11 px-3.5 border rounded-xl focus:ring-2 focus:ring-blue-200 outline-none"
                                placeholder="e.g. Intro Call"
                              />
                            </div>

                            {iconPickerOpen && (
                              <div className="absolute left-0 top-[52px] z-50 w-[280px] rounded-2xl border bg-[#2f2f32] shadow-2xl p-3">
                                <div className="grid grid-cols-6 gap-3">
                                  {EVENT_ICON_OPTIONS.map((item) => {
                                    const Icon = item.icon;   // ✅ move here

                                    return (
                                      <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => {
                                          setSelectedEventIcon(item.key);
                                          setIconPickerOpen(false);
                                        }}
                                        className="w-9 h-9 rounded-xl text-white hover:bg-white/10 flex items-center justify-center transition"
                                      >
                                        <Icon size={20} />
                                      </button>
                                    );
                                  })}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedEventIcon(null);
                                    setIconPickerOpen(false);
                                  }}
                                  className="mt-3 w-full h-9 rounded-lg bg-white/10 text-sm font-medium text-white hover:bg-white/15 transition"
                                >
                                  Reset to default
                                </button>
                              </div>
                            
                            )}
                          </div>

                          

                          <div>
                            <label className="text-xs font-medium text-slate-600">
                              Meeting type
                            </label>

                            <div className="mt-1 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0">
                                  {Icon ? <Icon className="w-5 h-5" /> : null}
                                </div>

                                <select
                                  value={meetingMode}
                                  onChange={(e) => setMeetingMode(e.target.value as MeetingMode)}
                                  className="h-11 min-w-0 flex-1 px-3.5 border rounded-xl outline-none bg-white"
                                >
                                  <option value="google_meet">Google Meet</option>
                                  <option value="in_person">In-person meeting</option>
                                </select>
                              </div>

                              {showGoogleConnectPill && (
                                <div className="w-full rounded-2xl border border-slate-200 bg-slate-100 p-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="text-xs sm:text-sm font-medium text-slate-700">
                                      Google Calendar not connected
                                    </div>

                                    <GoogleLoginButton
                                      variant="calendar"
                                      compact
                                      label="Connect"
                                      returnTo="/dashboard/event-types?create_event=1"
                                      userSub={userSub || undefined}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600">Duration</label>
                            <select
                              value={durationMinutes}
                              onChange={(e) => setDurationMinutes(Number(e.target.value))}
                              className="mt-1 w-full h-11 px-3.5 border rounded-xl outline-none"
                            >
                              {[5, 10, 15, 20, 30, 45, 60, 90, 120].map((m) => (
                                <option key={m} value={m}>
                                  {m} minutes
                                </option>
                              ))}
                            </select>
                          </div>

                          <TimezonePicker
                            value={timezone}
                            onChange={setTimezone}
                            label="Event timezone"
                            openDirection="up"
                          />

                          {needsLocation && (
                            <div>
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-slate-600">Location</label>

                                <button
                                  type="button"
                                  onClick={() => setLocationModalOpen(true)}
                                  className="text-xs font-semibold text-indigo-600"
                                >
                                  {location?.trim() ? "Edit" : "Set"}
                                </button>
                              </div>

                              <div className="mt-1 rounded-xl border bg-slate-50 px-3.5 py-3 text-sm text-slate-900 break-words min-h-[44px] flex items-center">
                                {location?.trim() ? location : "No location set"}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-5 sm:space-y-6">
                          {/* Brand logo */}
                          <div>
                            <label className="text-xs font-medium text-slate-600">Description</label>
                            <div className="relative mt-1">
                              <textarea
                                value={description}
                                onChange={(e) => {
                                  const nextValue = e.target.value;
                                  const nextWordCount = nextValue.trim().split(/\s+/).filter(Boolean).length;

                                  if (nextWordCount <= 50) {
                                    setDescription(nextValue);
                                  }
                                }}
                                rows={2}
                                className="w-full min-h-[0px] px-1 py-1.5 border rounded-xl focus:ring-2 focus:ring-blue-200 outline-none resize-none text-sm leading-5"
                                placeholder="Brief description of this event…"
                              />
                              <span className="absolute bottom-2 right-3 text-xs text-slate-400">
                                {descriptionWordCount}/50 words
                              </span>
                            </div>
                          </div>
                          <div className="rounded-2xl border p-3 sm:p-4 bg-white">
                            <div className="flex justify-between items-start gap-3">
                              <div>
                                <div className="text-sm font-semibold">Brand logo</div>
                                <div className="text-xs text-slate-500">Displayed on booking page</div>
                              </div>

                              {effectiveLogo && (
                                <span className="text-xs font-medium text-emerald-600 shrink-0">
                                  Saved
                                </span>
                              )}
                            </div>

                            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                              <div className="h-14 w-full sm:w-44 flex items-center justify-center rounded-xl border bg-slate-50">
                                {logoSrc ? (
                                  <img
                                    src={logoSrc}
                                    className="max-h-10 max-w-[140px] object-contain"
                                    alt="Brand logo"
                                  />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-slate-300" />
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-11 sm:h-10 w-full sm:w-auto px-4 rounded-xl bg-slate-900 text-white whitespace-nowrap"
                              >
                                {logoUploading ? "Uploading..." : "Upload logo"}
                              </button>
                            </div>

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;

                                setLogoUploading(true);
                                setError(null);

                                try {
                                  const url = await uploadBrandLogo(f);

                                  // 🔥 DEBUG LOG (important)
                                  console.log("UPLOADED LOGO URL:", url);

                                  setLogoUrl(url);
                                } catch (err: any) {
                                  console.error("UPLOAD ERROR:", err);
                                  setError(err?.message || "Failed to upload logo");
                                } finally {
                                  setLogoUploading(false);
                                }
                              }}
                            />
                          </div>

                          {/* Availability */}
                          <div className="rounded-2xl border p-2 sm:p-3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold">Availability</div>
                                <div className="text-xs text-slate-500">When guests can book</div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setAvailabilityOpen(true)}
                                className="h-11 sm:h-10 w-full sm:w-auto px-4 rounded-xl bg-slate-900 text-white"
                              >
                                {availabilityMeta.isSet ? "Edit" : "Set"}
                              </button>
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-sm">
                              {availabilityMeta.isSet ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  Availability configured
                                </>
                              ) : (
                                  <span className="text-slate-500">Inherits your schedule</span>
                              )}
                            </div>
                          </div>

                          {error && (
                            <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 rounded-xl">
                              {error}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="private"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-6"
                  >
                    <BookingForm userSub={userSub!} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FOOTER ONLY FOR PUBLIC */}
              {isPublic && (
                <div className="px-4 sm:px-6 py-4 border-t flex flex-col-reverse sm:flex-row gap-3 sm:justify-end bg-white">
                  <button type="button" onClick={onClose} className="h-11 sm:h-10 px-4 rounded-xl border">
                    Cancel
                  </button>
                  <div className="relative group w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={saving || logoUploading || checkingGoogle || googleBlocked}
                      className={`w-full sm:w-auto h-11 sm:h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition ${googleBlocked
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:opacity-90"
                        }`}
                    >
                      {saving ? (isEdit ? "Saving…" : "Creating…") : isEdit ? "Save changes" : "Create"}
                    </button>

                    {googleBlocked && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                        <div className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-xs whitespace-nowrap shadow-lg">
                          Connect Google Calendar first
                        </div>
                        <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-1/2 -translate-x-1/2 top-full -mt-1" />
                      </div>
                    )}
                  </div>
                </div>
                
              )}
            </form>
          </motion.div>
        </div>

        <AvailabilityEditorModal
     
  open={availabilityOpen}
          initialAvailabilityJson={normalizeAvailabilityForPayload(availabilityJson)}
          onClose={() => setAvailabilityOpen(false)}
          onSave={(json) => {
            setAvailabilityJson(normalizeAvailabilityForPayload(json) || "");
            setAvailabilityOpen(false);
          }}
        />
        <SetMeetingLocationModal
          open={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          initialValue={location}
          onSave={(loc) => {
            setLocation(loc);
            setLocationModalOpen(false);
          }}
        />



      </div>
    </AnimatePresence>
  );
}