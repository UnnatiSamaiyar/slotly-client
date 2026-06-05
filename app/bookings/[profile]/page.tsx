// //@ts-nocheck
// "use client";

// import React, { useEffect, useState } from "react";
// import Calendar from "@/components/booking/Calendar";
// import TimeSlots from "@/components/booking/TimeSlots";
// import BookingForm from "@/components/booking/BookingForm";

// export default function BookingPage({ params }: { params: { profile: string } }) {
//   const slug = params.profile;

//   const [profileData, setProfileData] = useState<any>(null);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);

//   useEffect(() => {
//     const load = async () => {
//       const res = await fetch(` https://api.slotly.io/booking/profile/${slug}`);
//       const data = await res.json();
//       setProfileData(data);
//     };
//     load();
//   }, [slug]);

//   if (!profileData) {
//     return <div className="p-10 text-center">Loading…</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
//       {/* HEADER */}
//       <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl mb-8">
//         <h1 className="text-3xl font-semibold">{profileData.title}</h1>
//         <p className="text-gray-600 mt-2">{profileData.description}</p>
//         <p className="text-sm text-gray-500 mt-1">{profileData.duration} min meeting</p>
//       </div>

//       {/* 3 STEP LAYOUT */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-5xl">
//         {/* Calendar */}
//         <div className="col-span-1">
//           <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
//         </div>

//         {/* Time Slots */}
//         <div className="col-span-1">
//           <TimeSlots
//             date={selectedDate}
//             duration={profileData.duration}
//             timezone={profileData.timezone}
//             onSelectTime={setSelectedTime}
//           />
//         </div>

//         {/* Booking Form */}
//         <div className="col-span-1">
//           <BookingForm
//             date={selectedDate}
//             time={selectedTime}
//             duration={profileData.duration}
//             profile={slug}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }



//@ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Calendar from "@/components/booking/Calendar";
import TimeSlots from "@/components/booking/TimeSlots";
import BookingForm from "@/components/booking/BookingForm";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.slotly.io";

export default function BookingPage({
  params,
}: {
  params: { profile: string };
}) {
  const slug = params.profile;

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);

  const viewerTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_BASE}/public/profile/${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Profile not found");
        }

        const data = await res.json();

        if (!alive) return;

        setProfileData(data?.profile || null);
      } catch (err: any) {
        if (!alive) return;
        setError(err?.message || "Failed to load booking page");
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (slug) loadProfile();

    return () => {
      alive = false;
    };
  }, [slug]);

  function handleDateChange(date: string | null) {
    setSelectedDate(date);
    setSelectedTime(null);
  }

  if (loading) {
    return <div className="p-10 text-center">Loading…</div>;
  }

  if (error || !profileData) {
    return (
      <div className="p-10 text-center text-sm font-medium text-red-600">
        {error || "Booking page not found"}
      </div>
    );
  }

  if (profileData.is_active === false) {
    return (
      <div className="p-10 text-center text-sm font-medium text-gray-600">
        This event is currently unavailable for new bookings.
      </div>
    );
  }

  const durationMinutes = Number(profileData.duration_minutes || 30);
  const hostTimezone = profileData.timezone || "UTC";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          {profileData.title}
        </h1>

        {profileData.host_name ? (
          <p className="text-gray-600 mt-2">Hosted by {profileData.host_name}</p>
        ) : null}

        <p className="text-sm text-gray-500 mt-1">
          {durationMinutes} min meeting
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Times shown in {viewerTimezone}
        </p>
      </div>

      {/* 3 STEP LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Calendar */}
        <div className="col-span-1">
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={handleDateChange}
            bookingWindow={profileData.booking_window}
            maxDaysAhead={profileData.max_days_ahead}
            timezone={hostTimezone}
          />
        </div>

        {/* Time Slots */}
        <div className="col-span-1">
          <TimeSlots
            slug={slug}
            date={selectedDate}
            duration={durationMinutes}
            timezone={viewerTimezone}
            hostTimezone={hostTimezone}
            onSelectTime={setSelectedTime}
          />
        </div>

        {/* Booking Form */}
        <div className="col-span-1">
          <BookingForm
            date={selectedDate}
            time={selectedTime}
            duration={durationMinutes}
            profile={slug}
            timezone={viewerTimezone}
            meetingMode={profileData.meeting_mode}
            location={profileData.location}
            title={profileData.title}
          />
        </div>
      </div>
    </div>
  );
}