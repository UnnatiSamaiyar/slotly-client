//@ts-nocheck
"use client";

import React, { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Calendar from "@/components/booking/Calendar";
import TimeSlots from "@/components/booking/TimeSlots";
import BookingForm from "@/components/booking/BookingForm";

const RESERVED_USERNAMES = new Set(["dashboard"]);
const RESERVED_EVENT_SLUGS = new Set([
  "notifications",
  "contacts",
  "event-types",
  "your-schedule",
  "settings",
  "login",
  "signup",
]);

export default function PublicBookingPage({
  params,
}: {
  params:
  | { username: string; event_slug: string }
  | Promise<{ username: string; event_slug: string }>;
}) {
  const resolvedParams = (params as any)?.then ? use(params as any) : (params as any);
  const { username, event_slug } = resolvedParams || {};

  if (
    RESERVED_USERNAMES.has(String(username || "").toLowerCase()) ||
    RESERVED_EVENT_SLUGS.has(String(event_slug || "").toLowerCase())
  ) {
    notFound();
  }

  const [eventData, setEventData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!event_slug) return;

    async function load() {
      try {
        setError(null);

        const res = await fetch(
          `https://api.slotly.io0/public/profile/${encodeURIComponent(event_slug)}`
        );

        if (!res.ok) {
          throw new Error(await res.text());
        }

        const payload = await res.json();
        setEventData(payload.profile);
      } catch (err: any) {
        setError("Failed to load booking page");
      }
    }

    load();
  }, [event_slug]);

  if (!username || !event_slug) {
    return <div className="p-10 text-center text-red-600">Invalid booking link.</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  if (!eventData) {
    return <div className="p-10 text-center">Loading booking page…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-sm mb-10">
        <div>
          <h3 className="text-gray-700">
            Hosted by {eventData.host_name || username}
          </h3>
          <h1 className="text-3xl font-semibold">{eventData.title}</h1>
          <p className="text-gray-500 mt-1">
            {eventData.duration_minutes} min • {username}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        <div>
          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>

        <div>
          <TimeSlots
            date={selectedDate}
            duration={eventData.duration_minutes}
            timezone={eventData.timezone}
            onSelectTime={setSelectedTime}
          />
        </div>

        <div>
          <BookingForm
            date={selectedDate}
            time={selectedTime}
            duration={eventData.duration_minutes}
            profile={event_slug}
            username={username}
          />
        </div>
      </div>
    </div>
  );
}