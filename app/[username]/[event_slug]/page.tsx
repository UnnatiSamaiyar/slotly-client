// "use client";

// import React, { useEffect, useState } from "react";
// import Calendar from "@/components/booking/Calendar";
// import TimeSlots from "@/components/booking/TimeSlots";
// import BookingForm from "@/components/booking/BookingForm";

// export default function PublicBookingPage({
//   params,
//   searchParams,
// }: {
//   params: { username: string; event_slug: string };
//   searchParams: any;
// }) {
//   const { username, event_slug } = params;

//   // Final slug shape for backend → "tushar/intro-meeting"
//   const profileSlug = `${username}/${event_slug}`;

//   const [profileData, setProfileData] = useState<any>(null);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);

//   useEffect(() => {
//     const load = async () => {
//       const res = await fetch(
//         `https://api.slotly.io/booking/profile/${profileSlug}`
//       );
//       const data = await res.json();
//       setProfileData(data);
//     };

//     load();
//   }, [profileSlug]);

//   if (!profileData) {
//     return <div className="p-10 text-center">Loading…</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
//       {/* HEADER */}
//       <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl mb-8">
//         <h1 className="text-3xl font-semibold">{profileData.title}</h1>
//         <p className="text-gray-600 mt-2">{profileData.description}</p>
//         <p className="text-sm text-gray-500 mt-1">
//           {profileData.duration} min meeting
//         </p>
//       </div>

//       {/* BOOKING LAYOUT */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-5xl">
//         {/* Calendar */}
//         <div className="col-span-1">
//           <Calendar
//             selectedDate={selectedDate}
//             setSelectedDate={setSelectedDate}
//           />
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
//             profile={profileSlug} // <-- Important change
//           />
//         </div>
//       </div>
//     </div>
//   );
// }














//@ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
import Calendar from "@/components/booking/Calendar";
import TimeSlots from "@/components/booking/TimeSlots";
import BookingForm from "@/components/booking/BookingForm";

export default function PublicBookingPage({
  params,
}: {
  params: { username: string; event_slug: string };
}) {
  const { username, event_slug } = params;

  const [eventData, setEventData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `https://api.slotly.io/booking/profile/${event_slug}`
      );
      const data = await res.json();
      setEventData(data);
    };
    load();
  }, [event_slug]);

  if (!eventData)
    return <div className="p-10 text-center">Loading booking page…</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-sm mb-10">
        <div className="flex items-center gap-4">
          {/* <img
            src={eventData.host_picture || "/default-profile.png"}
            className="w-14 h-14 rounded-full"
            alt=""
          /> */}
          <div>
            <h3 className="text-gray-700">Hosted by {eventData.host_name}</h3>
            <h1 className="text-3xl font-semibold">{eventData.title}</h1>
            <p className="text-gray-500 mt-1">
              {eventData.duration} min • {username}
            </p>
          </div>
        </div>
      </div>

      {/* Booking UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="col-span-1">
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        <div className="col-span-1">
          <TimeSlots
            date={selectedDate}
            duration={eventData.duration}
            timezone={eventData.timezone}
            onSelectTime={setSelectedTime}
          />
        </div>

        <div className="col-span-1">
          <BookingForm
            date={selectedDate}
            time={selectedTime}
            duration={eventData.duration}
            profile={event_slug}
            username={username}
          />
        </div>
      </div>
    </div>
  );
}
