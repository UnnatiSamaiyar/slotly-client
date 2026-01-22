"use client";

import React, { useState, useMemo, useEffect } from "react";
import { getPreferredTimezone } from "../../lib/timezone";
import LocationSelector from "../shared/LocationSelector";

// Meeting Type Options
const MEETING_TYPES = [
  { label: "Introductory", color: "bg-blue-500" },
  { label: "Product Demo", color: "bg-green-500" },
  { label: "Support Call", color: "bg-orange-500" },
  { label: "Strategy Call", color: "bg-purple-500" },
];

// ⭐ MEETING MODE OPTIONS
const MEETING_MODES = [
  { label: "Google Meet", value: "google_meet" },
  { label: "In-Person Meeting", value: "in_person" },
];

type Slot = {
  time: string; // "09:00"
  iso?: string;
  available: boolean | string | number | null | undefined;
};

function toBool(v: any) {
  return v === true || v === "true" || v === 1 || v === "1";
}

export default function BookingForm({ userSub }: { userSub: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ⭐ MULTIPLE ATTENDEES ARRAY
  const [attendees, setAttendees] = useState([""]);

  const [title, setTitle] = useState("Intro Call");
  const [date, setDate] = useState(""); // from <input type="date"> => YYYY-MM-DD
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [message, setMessage] = useState("");
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);

  const [meetingMode, setMeetingMode] = useState(MEETING_MODES[0]);
  const [location, setLocation] = useState("");

  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // -----------------------------
  // Fetch backend availability
  // -----------------------------
  useEffect(() => {
    // reset time whenever date changes (prevents stale selection)
    setTime("");

    if (!date) {
      setSlots([]);
      setSlotsError(null);
      return;
    }

    let cancelled = false;

    async function loadSlots() {
      try {
        setSlotsLoading(true);
        setSlotsError(null);

        // Calendly-style: viewer tz is a UI preference (dashboard selector) persisted to DB.
        // Fallback to browser timezone if not set.
        const viewerTz = getPreferredTimezone();
        const res = await fetch(
          `https://api.slotly.io/bookings/availability?user_sub=${encodeURIComponent(
            userSub
          )}&date=${date}&tz=${encodeURIComponent(viewerTz)}`
        );

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(
            `Availability API failed (${res.status}). ${
              txt ? `Response: ${txt}` : ""
            }`
          );
        }

        const data = await res.json();
        const incoming = Array.isArray(data?.slots) ? data.slots : [];

        if (!cancelled) {
          setSlots(incoming);
        }
      } catch (e: any) {
        if (!cancelled) {
          setSlots([]);
          setSlotsError(e?.message || "Failed to load slots");
        }
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    }

    loadSlots();

    return () => {
      cancelled = true;
    };
  }, [date, userSub]);

  // -----------------------------
  // Smart availability
  // -----------------------------
  const availabilityStatus = useMemo(() => {
    if (!date || !time) return null;
    const slot = slots.find((s) => s.time === time);
    if (!slot) return null;

    const ok = toBool(slot.available);

    return ok
      ? { text: "Available", color: "text-green-600", icon: "✔" }
      : { text: "Unavailable", color: "text-red-600", icon: "⚠" };
  }, [date, time, slots]);

  // -----------------------------
  // Meeting Link Preview
  // -----------------------------
  const meetingLink = useMemo(() => {
    return `https://slotly.io/dashboard/book?user_sub=${encodeURIComponent(
      userSub
    )}`;
  }, [userSub]);

  // -----------------------------
  // Add attendee
  // -----------------------------
  const addAttendee = () => setAttendees([...attendees, ""]);

  const updateAttendee = (index: number, value: string) => {
    const copy = [...attendees];
    copy[index] = value;
    setAttendees(copy);
  };

  // -----------------------------
  // Create Booking
  // -----------------------------
  const createBooking = async () => {
    setMessage("");

    if (!date || !time) {
      setMessage("Please select date & time");
      return;
    }

    const validAttendees = attendees.filter((a) => a.trim() !== "");
    if (validAttendees.length === 0) {
      setMessage("Please enter at least one attendee email.");
      return;
    }

    if (meetingMode.value === "in_person" && location.trim().length < 10) {
      setMessage(
        "Please provide a complete in-person meeting location (full address)."
      );
      return;
    }

    // local date + time => Date => ISO (UTC). This can shift dates if backend assumes UTC.
    const startISO = `${date}T${time}:00`;

    try {
      const res = await fetch(
        `https://api.slotly.io/bookings/create?user_sub=${encodeURIComponent(
          userSub
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guest_name: name,
            attendees: validAttendees,
            start_iso: startISO,
            title,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            meeting_mode: meetingMode.value,
            location: meetingMode.value === "in_person" ? location : null,
          }),
        }
      );

      if (!res.ok) {
        setMessage("Error: " + (await res.text()));
        return;
      }

      setMessage("Meeting created successfully!");
    } catch (error: any) {
      setMessage("Request failed: " + (error?.message || String(error)));
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col lg:flex-row">
      {/* LEFT PREVIEW PANEL */}
      <div className="w-full lg:w-[32%] bg-white border-b lg:border-b-0 lg:border-r shadow-sm lg:shadow-lg">
        <div className="p-6 sm:p-8 lg:p-10 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
            Live Preview
          </h2>

          <div className="space-y-5 sm:space-y-6 bg-gray-50 rounded-xl p-5 sm:p-6 border shadow-inner">
            <div>
              <p className="text-xs text-gray-500 uppercase">Meeting Type</p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm text-white rounded-full ${meetingType.color}`}
              >
                {meetingType.label}
              </span>
            </div>

            <Preview
              label="Meeting Mode"
              value={
                meetingMode.value === "google_meet"
                  ? "Google Meet (auto-generated)"
                  : `In-Person: ${location || "—"}`
              }
            />

            <Preview label="Meeting Title" value={title} />

            {availabilityStatus && (
              <div className="pt-1">
                <p className="text-xs text-gray-500 uppercase">Availability</p>
                <p
                  className={`text-sm font-semibold flex items-center gap-2 mt-1 ${availabilityStatus.color}`}
                >
                  {availabilityStatus.icon} {availabilityStatus.text}
                </p>
              </div>
            )}

            <Preview label="Host" value={name || "—"} />
            <Preview
              label="Attendees"
              value={attendees.filter((a) => a.trim() !== "").join(", ") || "—"}
            />
            <Preview label="Date" value={date || "—"} />
            <Preview label="Time" value={time || "—"} />
            <Preview label="Duration" value={`${duration} minutes`} />

            {/* <div className="pt-2">
              <p className="text-xs text-gray-500 uppercase">Meeting Link</p>
              <p
                className="text-blue-600 underline text-sm mt-1"
                style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
              >
                {meetingLink}
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            Create a Meeting
          </h1>
          <p className="text-gray-600 mb-8 sm:mb-10">
            Add details below for your invite.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <FormField label="Your Name" value={name} setValue={setName} />
            <FormField label="Your Email" value={email} setValue={setEmail} />
            <FormField
              label="Meeting Title"
              value={title}
              setValue={setTitle}
            />

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Meeting Type
              </label>
              <select
                className="p-3 w-full rounded-xl border bg-white shadow-sm"
                onChange={(e) =>
                  setMeetingType(
                    MEETING_TYPES.find((t) => t.label === e.target.value) ??
                      MEETING_TYPES[0]
                  )
                }
              >
                {MEETING_TYPES.map((t) => (
                  <option key={t.label}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Meeting Mode
              </label>
              <select
                className="p-3 w-full rounded-xl border bg-white shadow-sm"
                value={meetingMode.value}
                onChange={(e) =>
                  setMeetingMode(
                    MEETING_MODES.find((m) => m.value === e.target.value) ??
                      MEETING_MODES[0]
                  )
                }
              >
                {MEETING_MODES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {meetingMode.value === "in_person" && (
              <div className="md:col-span-2">
                <LocationSelector value={location} onChange={setLocation} />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Invitee Emails
              </label>

              <div className="space-y-3">
                {attendees.map((email, idx) => (
                  <input
                    key={idx}
                    type="email"
                    placeholder={`Invitee Email ${idx + 1}`}
                    value={email}
                    onChange={(e) => updateAttendee(idx, e.target.value)}
                    className="p-3 w-full rounded-xl border bg-white shadow-sm"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={addAttendee}
                className="mt-3 text-indigo-600 text-sm font-semibold hover:underline"
              >
                + Add another attendee
              </button>
            </div>

            <FormField label="Date" type="date" value={date} setValue={setDate} />

            {/* Time Slot Selector */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Select Time
              </label>

              <div className="mt-2">
                {!date && (
                  <p className="text-gray-500 text-sm">Select a date first</p>
                )}

                {date && slotsLoading && (
                  <p className="text-gray-500 text-sm">Loading slots…</p>
                )}

                {date && !slotsLoading && slotsError && (
                  <p className="text-red-600 text-sm">{slotsError}</p>
                )}

                {date && !slotsLoading && !slotsError && slots.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No slots returned for this date.
                  </p>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {slots.map((s) => {
                    const ok = toBool(s.available);
                    return (
                      <button
                        key={s.time}
                        type="button"
                        disabled={!ok}
                        onClick={() => ok && setTime(s.time)}
                        className={`
                          py-2 px-2 text-center rounded-lg border text-sm font-medium
                          transition
                          ${
                            ok
                              ? "bg-white hover:bg-indigo-100 border-indigo-300"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                          }
                          ${time === s.time ? "ring-2 ring-indigo-500" : ""}
                        `}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Duration</label>
              <select
                className="p-3 w-full rounded-xl border bg-white shadow-sm"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={createBooking}
            className="w-full max-w-xl mx-auto block mt-10 sm:mt-12 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-base sm:text-lg font-semibold shadow-lg"
          >
            Create Meeting
          </button>

          {message && (
            <div className="mt-6 w-full max-w-xl mx-auto text-center text-indigo-700 bg-indigo-100 py-3 rounded-xl shadow-sm">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------
// Extra Components
// ---------------------------
function Preview({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p
        className="text-sm sm:text-md font-semibold text-gray-800 mt-1"
        style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
      >
        {value}
      </p>
    </div>
  );
}

function FormField({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="p-3 w-full rounded-xl border bg-white shadow-sm hover:bg-indigo-50/40 focus:ring-2 focus:ring-indigo-400"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}