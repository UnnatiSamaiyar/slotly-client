//@ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import Calendar from "@/components/booking/Calendar";
import TimeSlots from "@/components/booking/TimeSlots";
import BookingForm from "@/components/booking/BookingForm";

export default function BookingPage({ params }: { params: { profile: string } }) {
  const slug = params.profile;

  const [profileData, setProfileData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`https://api.slotly.io/booking/profile/${slug}`);
      const data = await res.json();
      setProfileData(data);
    };
    load();
  }, [slug]);

  if (!profileData) {
    return <div className="p-10 text-center">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl mb-8">
        <h1 className="text-3xl font-semibold">{profileData.title}</h1>
        <p className="text-gray-600 mt-2">{profileData.description}</p>
        <p className="text-sm text-gray-500 mt-1">{profileData.duration} min meeting</p>
      </div>

      {/* 3 STEP LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Calendar */}
        <div className="col-span-1">
          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>

        {/* Time Slots */}
        <div className="col-span-1">
          <TimeSlots
            date={selectedDate}
            duration={profileData.duration}
            timezone={profileData.timezone}
            onSelectTime={setSelectedTime}
          />
        </div>

        {/* Booking Form */}
        <div className="col-span-1">
          <BookingForm
            date={selectedDate}
            time={selectedTime}
            duration={profileData.duration}
            profile={slug}
          />
        </div>
      </div>
    </div>
  );
}
