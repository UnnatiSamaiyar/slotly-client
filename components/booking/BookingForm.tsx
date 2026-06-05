


"use client";
import { useRouter } from "next/navigation";

import React, { useState, useEffect } from "react";
import { getPreferredTimezone } from "../../lib/timezone";
import LocationSelector from "../shared/LocationSelector";
import StatusModal from "../shared/StatusModal";

/* ------------------ CONSTANTS ------------------ */

const MEETING_TYPES = [
  { label: "Introductory", color: "bg-blue-500" },
  { label: "Product Demo", color: "bg-green-500" },
  { label: "Support Call", color: "bg-orange-500" },
  { label: "Strategy Call", color: "bg-purple-500" },
];

const MEETING_MODES = [
  { label: "Google Meet", value: "google_meet" },
  { label: "In-Person Meeting", value: "in_person" },
];
type Slot = {
  time: string;
  iso?: string;
  available: boolean | string | number | null | undefined;
};

const toBool = (v: any) => v === true || v === "true" || v === 1 || v === "1";

/* ------------------ COMPONENT ------------------ */

export default function BookingForm({
  userSub,
  isActive = true,

  // public booking props - optional, dashboard flow still works
  date: publicDate,
  time: publicTime,
  duration: publicDuration,
  profile,
  timezone,
  meetingMode: publicMeetingMode,
  location: publicLocation,
  title: publicTitle,
}: {
  userSub?: string;
  isActive?: boolean;

  date?: string | null;
  time?: Slot | string | null;
  duration?: number;
  profile?: string;
  timezone?: string;
  meetingMode?: string;
  location?: string | null;
  title?: string;
}) {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");

  const [attendees, setAttendees] = useState<string[]>([]);
  const [attendeeInput, setAttendeeInput] = useState("");
  const [slotsFetched, setSlotsFetched] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("Intro Call");
  const [meetingType] = useState(MEETING_TYPES[0]);
  const [meetingMode, setMeetingMode] = useState(MEETING_MODES[0]);
  const [location, setLocation] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const router = useRouter();
  const [showStatus, setShowStatus] = useState(false);
  const [statusType, setStatusType] = useState<"success" | "error">("success");

  // ✅ Mobile preview drawer state
  const [previewOpen, setPreviewOpen] = useState(false);
  const isPublicBooking = Boolean(profile);

  const effectiveDate = publicDate ?? date;
  const effectiveDuration = Number(publicDuration || duration || 30);
  const effectiveTimezone =
    timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const publicSlotIso =
    publicTime && typeof publicTime === "object"
      ? publicTime.iso
      : null;

  const publicSlotLabel =
    publicTime && typeof publicTime === "object"
      ? publicTime.time
      : typeof publicTime === "string"
        ? publicTime
        : "";

  /* ------------------ SCROLL TO TOP ------------------ */

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ------------------ FETCH AVAILABILITY ------------------ */
  /* ------------------ FETCH AVAILABILITY ------------------ */

  useEffect(() => {
    setTime("");
    setSlotsFetched(false);

    if (!date || isActive === false) {
      setSlots([]);
      setSlotsError(null);
      return;
    }

    if (isPublicBooking) {
      setSlots([]);
      setSlotsError(null);
      return;
    }

    if (!userSub) {
      setSlots([]);
      setSlotsError("User not loaded. Please refresh and try again.");
      return;
    }

    const safeUserSub = userSub;
    let cancelled = false;

    async function loadSlots() {
      try {
        setSlotsLoading(true);
        setSlotsError(null);

        const tz = getPreferredTimezone();

        const res = await fetch(
          `https://api.slotly.io/bookings/availability?user_sub=${encodeURIComponent(
            safeUserSub
          )}&date=${date}&duration=${duration}&tz=${encodeURIComponent(tz)}`
        );

        if (!res.ok) throw new Error("Failed to load availability");

        const data = await res.json();

        if (!cancelled) {
          setSlots(Array.isArray(data?.slots) ? data.slots : []);
          setSlotsFetched(true);
        }
      } catch {
        if (!cancelled) {
          setSlots([]);
          setSlotsFetched(true);
        }
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    }

    loadSlots();

    return () => {
      cancelled = true;
    };
  }, [date, userSub, duration, isPublicBooking, isActive]);
  /* ------------------ CREATE BOOKING ------------------ */

  const createBooking = async () => {
    if (isActive === false) {
      setMessage("This event is currently unavailable");
      return;
    }

    scrollToTop();

    if (!effectiveDate) {
      setMessage("Please select a date.");
      return;
    }

    if (isPublicBooking) {
      if (!publicSlotIso) {
        setMessage("Please select a time slot.");
        return;
      }
    } else if (!time) {
      setMessage("Please select a time slot.");
      return;
    }

    if (!attendees.length) {
      setMessage("Please add at least one attendee.");
      return;
    }

    if (!isPublicBooking && meetingMode.value === "in_person" && location.trim().length < 10) {
      setMessage("Please enter complete meeting address.");
      return;
    }

    setMessage("");

    setStatusType("success");
    setShowStatus(true);

    try {
      if (isPublicBooking) {
        const res = await fetch("https://api.slotly.io/public/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile_slug: profile,
            guest_name: attendees[0]?.split("@")[0] || "Guest",
            attendees,
            start_iso: publicSlotIso,
            title: publicTitle || title,
            timezone: effectiveTimezone,
            meeting_mode: publicMeetingMode || "google_meet",
            location: publicMeetingMode === "in_person" ? publicLocation : null,
          }),
        });

        if (!res.ok) throw new Error();

        return;
      }

      const res = await fetch(
        `https://api.slotly.io/bookings/create?user_sub=${encodeURIComponent(
          userSub || ""
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guest_name: attendees[0]?.split("@")[0] || "Guest",
            attendees,
            start_iso: `${date}T${time}:00`,
            title,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            meeting_mode: meetingMode.value,
            location: meetingMode.value === "in_person" ? location : null,
          }),
        }
      );

      if (!res.ok) throw new Error();
    } catch {
      setStatusType("error");
      setShowStatus(true);
      setTime("");
    }
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="relative flex flex-col lg:flex-row">
      <StatusModal
        open={showStatus}
        type={statusType}
        onClose={() => {
          setShowStatus(false);
          router.refresh();
        }}
      />

      {previewOpen && (
        <button
          type="button"
          onClick={() => setPreviewOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          aria-label="Close preview"
        />
      )}

      {message && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl shadow-lg">
            {message}
          </div>
        </div>
      )}

      <aside
        className={`
          bg-white
          lg:w-[32%] lg:border-r lg:static
          fixed lg:sticky lg:top-0 bottom-0 left-0 right-0
          z-40 lg:z-auto
          border-t lg:border-t-0
          shadow-[0_-10px_30px_-20px_rgba(0,0,0,0.25)] lg:shadow-none
          transition-transform duration-200
          ${previewOpen ? "translate-y-0" : "translate-y-[calc(100%-72px)]"}
          lg:translate-y-0
        `}
      >
        <div className="px-4 pt-3 pb-4 sm:px-6 lg:p-8 space-y-3 lg:space-y-5 max-h-[55vh] lg:max-h-none overflow-auto">
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setPreviewOpen((s) => !s);
              }
            }}
            className="w-full flex items-center justify-between py-2 lg:cursor-default"
          >
            <span className="text-sm lg:text-lg font-semibold text-gray-900">
              Live preview
            </span>

            <svg
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 lg:hidden ${previewOpen ? "rotate-180" : "rotate-0"
                }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <Preview
            label="Attendees"
            value={attendees.filter(Boolean).join(", ") || "—"}
          />
          <Preview label="Date" value={effectiveDate || "—"} />
          <Preview
            label="Time"
            value={isPublicBooking ? publicSlotLabel || "—" : time || "—"}
          />
          <Preview label="Duration" value={`${effectiveDuration} minutes`} />
        </div>
      </aside>

      <section className="flex-1 px-4 py-6 sm:px-6 lg:p-10 pb-[120px] lg:pb-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <Section title="Meeting details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <Input label="Meeting title" value={title} setValue={setTitle} />
              <Select
                label="Meeting mode"
                options={MEETING_MODES.map((m) => m.label)}
                onChange={(v: string) =>
                  setMeetingMode(
                    MEETING_MODES.find((m) => m.label === v) || MEETING_MODES[0]
                  )
                }
              />

              {meetingMode.value === "in_person" && (
                <LocationSelector value={location} onChange={setLocation} />
              )}
            </div>
          </Section>

          <Section title="Invite attendees">
            <div className="border rounded-xl p-3 bg-white focus-within:ring-2 focus-within:ring-indigo-400">
              <div className="flex flex-wrap gap-2">
                {attendees.map((email, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() =>
                        setAttendees(attendees.filter((_, idx) => idx !== i))
                      }
                      className="text-indigo-500 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  type="email"
                  value={attendeeInput}
                  placeholder={attendees.length === 0 ? "Add attendee emails" : ""}
                  onChange={(e) => setAttendeeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const email = attendeeInput.trim();
                      if (email && !attendees.includes(email)) {
                        setAttendees([...attendees, email]);
                        setAttendeeInput("");
                      }
                    }

                    if (
                      e.key === "Backspace" &&
                      attendeeInput === "" &&
                      attendees.length > 0
                    ) {
                      setAttendees(attendees.slice(0, -1));
                    }
                  }}
                  className="flex-1 min-w-[180px] outline-none text-sm px-2 py-1"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Press <b>Enter</b> or <b>,</b> to add multiple emails
            </p>
          </Section>

          {!isPublicBooking && (
            <Section title="Date & time">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <Input type="date" label="Date" value={date} setValue={setDate} />

                <Select
                  label="Duration"
                  options={["15 minutes", "30 minutes", "60 minutes"]}
                  value={`${duration} minutes`}
                  onChange={(v: string) =>
                    setDuration(parseInt(v.split(" ")[0], 10))
                  }
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Select time
                </label>

                {time && (
                  <div className="mt-3 flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
                    <div>
                      <p className="text-xs text-gray-500">Selected time</p>
                      <p className="text-sm font-semibold text-indigo-700">
                        {time}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTime("")}
                      className="text-sm text-indigo-600 hover:underline font-medium"
                    >
                      Change
                    </button>
                  </div>
                )}

                {!time && (
                  <>
                    {!date && (
                      <div className="mt-2 text-sm text-gray-500 bg-gray-50 border border-dashed rounded-lg p-3">
                        Select a date to view available time slots.
                      </div>
                    )}

                    {date && slotsLoading && (
                      <p className="mt-2 text-sm text-gray-500 animate-pulse">
                        Loading available times…
                      </p>
                    )}

                    {date && slotsError && (
                      <p className="mt-2 text-sm text-red-600">{slotsError}</p>
                    )}

                    {date &&
                      slotsFetched &&
                      !slotsLoading &&
                      !slotsError &&
                      slots.length === 0 && (
                        <p className="mt-2 text-sm text-gray-500">
                          No available time slots for this date.
                        </p>
                      )}

                    {date && !slotsLoading && !slotsError && slots.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mt-3">
                        {slots.map((s) => {
                          const ok = toBool(s.available);

                          return (
                            <button
                              key={s.time}
                              type="button"
                              disabled={!ok}
                              onClick={() => ok && setTime(s.time)}
                              className={`
                                py-2.5 sm:py-2 rounded-lg text-sm font-medium border
                                transition-all duration-150
                                ${ok
                                  ? "bg-white hover:bg-indigo-50 hover:border-indigo-400"
                                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                }
                              `}
                            >
                              {s.time}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </Section>
          )}

          <button
            type="button"
            onClick={createBooking}
            className="w-full max-w-xl mx-auto block mt-8 sm:mt-10 py-3.5 sm:py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg"
          >
            {isActive === false ? "Unavailable" : "Create meeting"}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ------------------ HELPERS ------------------ */

function Section({ title, children }: any) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Preview({ label, value, children }: any) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <div className="text-sm font-semibold mt-1">{children || value}</div>
    </div>
  );
}

function Input({ label, value, setValue, type = "text" }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}

function Select({ label, options, onChange, value }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl border bg-white shadow-sm"
      >
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
