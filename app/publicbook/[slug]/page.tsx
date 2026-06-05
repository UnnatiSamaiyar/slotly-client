// //@ts-nocheck

// "use client";

// import { useParams, useRouter } from "next/navigation";
// import React, { useEffect, useMemo, useState } from "react";
// import PublicEventInfo from "./components/PublicEventInfo";
// import PublicCalendar from "./components/PublicCalendar";
// import PublicTimeSlots from "./components/PublicTimeSlots";
// import PublicBookingForm from "./components/PublicBookingForm";
// import { useToast } from "@/hooks/use-toast";
// import { ArrowLeft } from "lucide-react";

// export default function PublicBookingPage() {
//   const params = useParams();
//   const router = useRouter();
//   const slug = String(params?.slug || "");
//   const { toast } = useToast();
//   const apiBase = "https://api.slotly.io";

//   const [profile, setProfile] = useState<any | null>(null);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedSlotISO, setSelectedSlotISO] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const viewerTz = useMemo(
//     () =>
//       typeof window === "undefined"
//         ? "UTC"
//         : Intl.DateTimeFormat().resolvedOptions().timeZone,
//     []
//   );

//   const [selectedTz, setSelectedTz] = useState(viewerTz);

//   /* ---------------- FETCH PROFILE ---------------- */
//   useEffect(() => {
//     if (!slug) return;

//     (async () => {
//       try {
//         const res = await fetch(
//           `${apiBase}/public/profile/${encodeURIComponent(slug)}`
//         );

//         if (!res.ok) {
//           throw new Error(`Failed with status ${res.status}`);
//         }

//         const data = await res.json();
//         const resolvedProfile = data?.profile || data || null;

//         setProfile(resolvedProfile);
//         setSelectedTz(resolvedProfile?.timezone || viewerTz);
//       } catch (err) {
//         console.error("Failed to load public profile:", err);
//         setProfile(null);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [slug, viewerTz]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Loading…
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F8F8FB] px-6">
//         <div className="w-full max-w-md rounded-[24px] border border-[#E4E7EC] bg-white p-8 text-center shadow-sm">
//           <h1 className="text-[24px] font-semibold text-[#101828]">
//             Event no longer available
//           </h1>
//           <p className="mt-3 text-[15px] leading-6 text-[#667085]">
//             This booking link has been deactivated by the host and is no longer accepting bookings.
//           </p>
//         </div>
//       </div>
//     );
//   }
//   const handleBack = () => {
//     if (profile) {
//       router.push("/dashboard");
//     } else {
//       router.push("/");
//     }
//   };

//   if (profile?.is_active === false) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F8F8FB] px-6">
//         <div className="w-full max-w-md rounded-[24px] border border-[#E4E7EC] bg-white p-8 text-center shadow-sm">
//           <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
//             <span className="text-2xl">🚫</span>
//           </div>
//           <h1 className="mt-4 text-[22px] font-semibold text-[#101828]">
//             Event Suspended by Host
//           </h1>
//           <p className="mt-3 text-[15px] leading-6 text-[#667085]">
//             <span className="font-medium text-gray-800">{profile?.name}</span> has
//             temporarily disabled bookings for this event.
//           </p>
//           <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
//             <span className="font-medium">Event:</span> {profile?.title || slug}
//           </div>
//           <p className="mt-4 text-sm text-gray-500">
//             Please contact the host directly to reschedule or for more information.
//           </p>
//           {profile?.email && (

//             href = {`mailto:${profile.email}`}
//           className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
//   >
//           Contact Host
//         </a>
// )}
//         <div className="mt-6 border-t border-gray-100 pt-4 flex justify-center">

//           href="/"
//           className="text-xs text-gray-400 hover:text-indigo-600 transition" >
//           ← Back to home
//         </a>
//       </div>
//         </div >
//       </div >
//     );
//   }
 

//   return (
//     <div className="min-h-screen bg-gray-50 flex justify-center px-3 sm:px-6 py-4 sm:py-6">
//       <div
//         className="
//           w-full
//           max-w-4xl
//           bg-white
//           rounded-xl sm:rounded-2xl
//           shadow-md sm:shadow-lg
//           flex flex-col
//           overflow-hidden
//         "
//       >
//         {/* HEADER */}
//         <header className="px-4 sm:px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">
//               {profile?.name}
//             </div>
//           </div>
//         </header>

//         {/* MAIN CONTENT */}
//         <main
//           className="
//             grid
//             grid-cols-1
//             lg:grid-cols-12
//             gap-6
//             px-4 sm:px-6 py-6
//             flex-1
//             overflow-y-auto
//           "
//         >
//           {/* LEFT PANEL */}
//           <aside className="lg:col-span-5 space-y-5">
//             {/* BACK BUTTON */}
//             <button
//               type="button"
//               onClick={handleBack}
//               aria-label="Go back"
//               className="
//                 w-9 h-9
//                 flex items-center justify-center
//                 rounded-full
//                 bg-blue-50
//                 text-blue-800
//                 hover:bg-blue-100
//                 transition
//               "
//             >
//               <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
//             </button>

//             <PublicEventInfo profile={profile} />
//           </aside>

//           {/* RIGHT PANEL */}
//           <section
//             className="
//               lg:col-span-7
//               flex
//               justify-center
//             "
//           >
//             <div
//               className="
//                 w-full
//                 max-w-lg
//                 space-y-6
//               "
//             >
//               {/* STEP 1 — CALENDAR */}
//               {!selectedDate && (
//                 <PublicCalendar
//                   slug={slug}
//                   bookingWindow={profile?.booking_window}
//                   selectedDate={selectedDate}
//                   onSelectDate={(d) => {
//                     setSelectedDate(d);
//                     setSelectedSlotISO(null);
//                   }}
//                 />
//               )}

//               {/* STEP 2 — TIME */}
//               {selectedDate && !selectedSlotISO && (
//                 <>
//                   <PublicTimeSlots
//                     slug={slug}
//                     date={selectedDate}
//                     selectedSlotISO={selectedSlotISO}
//                     viewerTz={selectedTz}
//                     onSelectSlot={setSelectedSlotISO}
//                   />

//                   <div className="flex justify-between items-center pt-2">
//                     {/* Back */}
//                     <button
//                       type="button"
//                       onClick={() => setSelectedDate(null)}
//                       className="
//                         w-9 h-9
//                         flex items-center justify-center
//                         rounded-full
//                         bg-blue-50
//                         text-blue-800
//                         hover:bg-blue-100
//                         transition
//                       "
//                     >
//                       <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
//                     </button>

//                     {/* Next */}
//                     <button
//                       disabled={!selectedSlotISO}
//                       className={`
//                         px-5 py-2
//                         rounded-lg
//                         text-white
//                         font-medium
//                         transition
//                         ${selectedSlotISO
//                           ? "bg-indigo-600 hover:bg-indigo-700"
//                           : "bg-gray-300 cursor-not-allowed"
//                         }
//                       `}
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </>
//               )}

//               {/* STEP 3 — DETAILS */}
//               {selectedSlotISO && (
//                 <>
//                   <PublicBookingForm
//                     slug={slug}
//                     profile={profile}
//                     selectedSlotISO={selectedSlotISO}
//                     viewerTz={selectedTz}
//                     onBooked={() => {
//                       setSelectedDate(null);
//                       setSelectedSlotISO(null);
//                       toast({
//                         title: "Booking confirmed",
//                         description: "Confirmation email sent",
//                         variant: "success",
//                       });
//                     }}
//                   />

//                   <div className="flex justify-start">
//                     <button
//                       type="button"
//                       onClick={() => setSelectedSlotISO(null)}
//                       className="
//                         w-9 h-9
//                         flex items-center justify-center
//                         rounded-full
//                         bg-blue-50
//                         text-blue-800
//                         hover:bg-blue-100
//                         transition
//                       "
//                     >
//                       <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </section>
//         </main>

//         <div className="border-t px-4 sm:px-6 py-4 flex justify-center bg-gray-50">
//           <a
//             href="/dashboard"
//             target="_blank"
//             className="flex items-center gap-2 text-xs text-gray-500 hover:text-indigo-600 transition"
//           >
//             <span>Powered by</span>
//             <img
//               src="/Slotlyio-logo.webp"
//               alt="Slotly"
//               className="h-5 sm:h-6 w-auto object-contain"
//             />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }


//@ts-nocheck

"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import PublicEventInfo from "./components/PublicEventInfo";
import PublicCalendar from "./components/PublicCalendar";
import PublicTimeSlots from "./components/PublicTimeSlots";
import PublicBookingForm from "./components/PublicBookingForm";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

export default function PublicBookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || "");
  const { toast } = useToast();
  // const apiBase = "https://api.slotly.io";
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.slotly.io";

  const [profile, setProfile] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotISO, setSelectedSlotISO] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const viewerTz = useMemo(
    () =>
      typeof window === "undefined"
        ? "UTC"
        : Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  const [selectedTz, setSelectedTz] = useState(viewerTz);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const res = await fetch(
          `${apiBase}/public/profile/${encodeURIComponent(slug)}`
        );

        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        const data = await res.json();
        const resolvedProfile = data?.profile || data || null;

        setProfile(resolvedProfile);
        setSelectedTz(resolvedProfile?.timezone || viewerTz);
      } catch (err) {
        console.error("Failed to load public profile:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, viewerTz]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FB] px-6">
        <div className="w-full max-w-md rounded-[24px] border border-[#E4E7EC] bg-white p-8 text-center shadow-sm">
          <h1 className="text-[24px] font-semibold text-[#101828]">
            Event no longer available
          </h1>
          <p className="mt-3 text-[15px] leading-6 text-[#667085]">
            This booking link has been deactivated by the host and is no longer accepting bookings.
          </p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (profile) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  if (profile?.is_active === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FB] px-6">
        <div className="w-full max-w-md rounded-[24px] border border-[#E4E7EC] bg-white p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <span className="text-2xl">📅</span>
          </div>
          <h1 className="mt-4 text-[22px] font-semibold text-[#101828]">
            Event Suspended by Host 
          </h1>
        
          <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
            <span className="font-medium">Event:</span> {profile?.title || slug}
          </div>
          {/* <p className="mt-4 text-sm text-gray-500">
            Please contact the host directly to reschedule or for more information.
          </p> */}
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
            >
              Contact Host
            </a>
          )}
          <div className="mt-4  gap-3 color-gray-500"> Powered by Slotly </div>
          <div className="mt-6 border-t border-gray-100 pt-4 flex justify-center">
          
            <a
              href="/"
              className="text-xs text-gray-400 hover:text-indigo-600 transition"
            >
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-3 sm:px-6 py-4 sm:py-6">
      <div
        className="
          w-full
          max-w-4xl
          bg-white
          rounded-xl sm:rounded-2xl
          shadow-md sm:shadow-lg
          flex flex-col
          overflow-hidden
        "
      >
        {/* HEADER */}
        <header className="px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">
              {profile?.name}
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-6
            px-4 sm:px-6 py-6
            flex-1
            overflow-y-auto
          "
        >
          {/* LEFT PANEL */}
          <aside className="lg:col-span-5 space-y-5">
            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="
                w-9 h-9
                flex items-center justify-center
                rounded-full
                bg-blue-50
                text-blue-800
                hover:bg-blue-100
                transition
              "
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <PublicEventInfo profile={profile} />
          </aside>

          {/* RIGHT PANEL */}
          <section
            className="
              lg:col-span-7
              flex
              justify-center
            "
          >
            <div
              className="
                w-full
                max-w-lg
                space-y-6
              "
            >
              {/* STEP 1 — CALENDAR */}
              {!selectedDate && (
                <PublicCalendar
                  slug={slug}
                  bookingWindow={profile?.booking_window}
                  activeWeekdays={profile?.active_weekdays}
                  selectedDate={selectedDate}
                  onSelectDate={(d) => {
                    setSelectedDate(d);
                    setSelectedSlotISO(null);
                  }}
                />
              )}

              {/* STEP 2 — TIME */}
              {selectedDate && !selectedSlotISO && (
                <>
                  <PublicTimeSlots
                    slug={slug}
                    date={selectedDate}
                    selectedSlotISO={selectedSlotISO}
                    viewerTz={selectedTz}
                    onSelectSlot={setSelectedSlotISO}
                  />

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDate(null)}
                      className="
                        w-9 h-9
                        flex items-center justify-center
                        rounded-full
                        bg-blue-50
                        text-blue-800
                        hover:bg-blue-100
                        transition
                      "
                    >
                      <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>

                    <button
                      disabled={!selectedSlotISO}
                      className={`
                        px-5 py-2
                        rounded-lg
                        text-white
                        font-medium
                        transition
                        ${selectedSlotISO
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-gray-300 cursor-not-allowed"
                        }
                      `}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3 — DETAILS */}
              {selectedSlotISO && (
                <>
                  <PublicBookingForm
                    slug={slug}
                    profile={profile}
                    selectedSlotISO={selectedSlotISO}
                    viewerTz={selectedTz}
                    onBooked={() => {
                      setSelectedDate(null);
                      setSelectedSlotISO(null);
                      toast({
                        title: "Booking confirmed",
                        description: "Confirmation email sent",
                        variant: "success",
                      });
                    }}
                  />

                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={() => setSelectedSlotISO(null)}
                      className="
                        w-9 h-9
                        flex items-center justify-center
                        rounded-full
                        bg-blue-50
                        text-blue-800
                        hover:bg-blue-100
                        transition
                      "
                    >
                      <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        </main>

        <div className="border-t px-4 sm:px-6 py-4 flex justify-center bg-gray-50">
          <a
            href="/dashboard"
            target="_blank"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-indigo-600 transition"
          >
            <span>Powered by</span>
            <img
              src="/Slotlyio-logo.webp"
              alt="Slotly"
              className="h-5 sm:h-6 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  );
}