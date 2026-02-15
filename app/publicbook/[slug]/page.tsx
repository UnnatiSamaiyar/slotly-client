//@ts-nocheck
"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import PublicEventInfo from "./components/PublicEventInfo";
import PublicCalendar from "./components/PublicCalendar";
import PublicTimeSlots from "./components/PublicTimeSlots";
import PublicBookingForm from "./components/PublicBookingForm";
import { useToast } from "@/hooks/use-toast";

function StepPill({ active, done, label }: any) {
  return (
    <div
      className={[
        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm",
        active
          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
          : done
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-gray-200 bg-white text-gray-500",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold",
          active
            ? "bg-indigo-600 text-white"
            : done
            ? "bg-emerald-600 text-white"
            : "bg-gray-200 text-gray-600",
        ].join(" ")}
      >
        {done ? "✓" : ""}
      </span>
      <span className="font-medium">{label}</span>
    </div>
  );
}

export default function PublicBookingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();

  const [profile, setProfile] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotISO, setSelectedSlotISO] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const viewerTz = useMemo(() => {
    if (typeof window === "undefined") return "UTC";
    return (
      localStorage.getItem("slotly_viewer_tz") ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      "UTC"
    );
  }, []);

  // Default = event's timezone (profile.timezone). If missing, fall back to viewer/browser.
  const [selectedTz, setSelectedTz] = useState<string>(viewerTz);
  const didInitTzRef = useRef(false);

  // When profile loads, force default timezone = event timezone ONCE.
  useEffect(() => {
    if (didInitTzRef.current) return;
    if (!profile) return;
    const etz = String(profile?.timezone || "").trim();
    if (etz) {
      setSelectedTz(etz);
      didInitTzRef.current = true;
      return;
    }
    didInitTzRef.current = true;
  }, [profile]);

  // expose to children without changing a lot of props plumbing
  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as any).__slotly_viewer_tz = selectedTz;
    localStorage.setItem("slotly_viewer_tz", selectedTz);
  }, [selectedTz]);

  const tzOptions = useMemo(() => {
    try {
      // modern browsers
      // @ts-ignore
      const list = (Intl as any).supportedValuesOf?.("timeZone") as string[] | undefined;
      if (Array.isArray(list) && list.length) return list;
    } catch {}
    // fallback: common zones
    return [
      "Asia/Kolkata",
      "Asia/Dubai",
      "Asia/Singapore",
      "Europe/London",
      "Europe/Paris",
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "Australia/Sydney",
      "UTC",
    ];
  }, []);

  useEffect(() => {
    if (!slug) return;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://api.slotly.io/public/profile/${encodeURIComponent(slug)}`
        );
        if (!res.ok) throw new Error(await res.text());
        const payload = await res.json();
        setProfile(payload.profile);
      } catch (err: any) {
        setMessage("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  // When profile loads, set default timezone to the event/profile timezone.
  useEffect(() => {
    const t = String(profile?.timezone || "").trim();
    if (!t) return;
    setSelectedTz(t);
  }, [profile?.timezone]);

  const stepDateDone = !!selectedDate;
  const stepTimeDone = !!selectedSlotISO;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading…
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-50">
        {message || "Profile not found"}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Top step bar */}
        <div className="px-6 py-4 border-b bg-white">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <StepPill label="Date" active={!stepDateDone} done={stepDateDone} />
              <StepPill
                label="Time"
                active={stepDateDone && !stepTimeDone}
                done={stepTimeDone}
              />
              <StepPill label="Details" active={stepTimeDone} done={false} />
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="whitespace-nowrap">Timezone</span>
              <select
                value={selectedTz}
                onChange={(e) => setSelectedTz(e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white"
              >
                {tzOptions.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left info panel */}
          <div className="lg:col-span-5">
            <PublicEventInfo profile={profile} />
          </div>

          {/* Right side: fixed-height workspace */}
          <div className="lg:col-span-7 p-5 sm:p-8">
            <div className="grid grid-cols-1 gap-6">
              <PublicCalendar
                slug={slug}
                bookingWindow={profile?.booking_window}
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                  setSelectedDate(d);
                  setSelectedSlotISO(null);
                }}
              />

              {/* Equal-height two-column section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="min-h-0">
                  <PublicTimeSlots
                    slug={slug}
                    date={selectedDate}
                    selectedSlotISO={selectedSlotISO}
                    viewerTz={selectedTz}
                    onSelectSlot={setSelectedSlotISO}
                    // NEW: internal height control
                    heightClass="h-[520px]"
                  />
                </div>

                <div className="min-h-0">
                  <PublicBookingForm
                    slug={slug}
                    profile={profile}
                    selectedSlotISO={selectedSlotISO}
                    viewerTz={selectedTz}
                    // NEW: internal height control
                    heightClass="h-[520px]"
                    onBooked={() => {
                      setSelectedDate(null);
                      setSelectedSlotISO(null);
                      toast({
                        title: "Booking confirmed",
                        description: "You will receive a confirmation email shortly.",
                        variant: "success",
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
