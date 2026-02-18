// //@ts-nocheck
// "use client";

// import { useParams } from "next/navigation";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import PublicEventInfo from "./components/PublicEventInfo";
// import PublicCalendar from "./components/PublicCalendar";
// import PublicTimeSlots from "./components/PublicTimeSlots";
// import PublicBookingForm from "./components/PublicBookingForm";
// import { useToast } from "@/hooks/use-toast";

// function StepPill({ active, done, label }: any) {
//   return (
//     <div
//       className={[
//         "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm",
//         active
//           ? "border-indigo-300 bg-indigo-50 text-indigo-700"
//           : done
//           ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//           : "border-gray-200 bg-white text-gray-500",
//       ].join(" ")}
//     >
//       <span
//         className={[
//           "inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold",
//           active
//             ? "bg-indigo-600 text-white"
//             : done
//             ? "bg-emerald-600 text-white"
//             : "bg-gray-200 text-gray-600",
//         ].join(" ")}
//       >
//         {done ? "✓" : ""}
//       </span>
//       <span className="font-medium">{label}</span>
//     </div>
//   );
// }

// export default function PublicBookingPage() {
//   const params = useParams();
//   const slug = params.slug as string;
//   const { toast } = useToast();

//   const [profile, setProfile] = useState<any | null>(null);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedSlotISO, setSelectedSlotISO] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState<string | null>(null);

//   const viewerTz = useMemo(() => {
//     if (typeof window === "undefined") return "UTC";
//     return (
//       localStorage.getItem("slotly_viewer_tz") ||
//       Intl.DateTimeFormat().resolvedOptions().timeZone ||
//       "UTC"
//     );
//   }, []);

//   // Default = event's timezone (profile.timezone). If missing, fall back to viewer/browser.
//   const [selectedTz, setSelectedTz] = useState<string>(viewerTz);
//   const didInitTzRef = useRef(false);

//   // When profile loads, force default timezone = event timezone ONCE.
//   useEffect(() => {
//     if (didInitTzRef.current) return;
//     if (!profile) return;
//     const etz = String(profile?.timezone || "").trim();
//     if (etz) {
//       setSelectedTz(etz);
//       didInitTzRef.current = true;
//       return;
//     }
//     didInitTzRef.current = true;
//   }, [profile]);

//   // expose to children without changing a lot of props plumbing
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     (window as any).__slotly_viewer_tz = selectedTz;
//     localStorage.setItem("slotly_viewer_tz", selectedTz);
//   }, [selectedTz]);

//   const tzOptions = useMemo(() => {
//     try {
//       // modern browsers
//       // @ts-ignore
//       const list = (Intl as any).supportedValuesOf?.("timeZone") as string[] | undefined;
//       if (Array.isArray(list) && list.length) return list;
//     } catch {}
//     // fallback: common zones
//     return [
//       "Asia/Kolkata",
//       "Asia/Dubai",
//       "Asia/Singapore",
//       "Europe/London",
//       "Europe/Paris",
//       "America/New_York",
//       "America/Chicago",
//       "America/Denver",
//       "America/Los_Angeles",
//       "Australia/Sydney",
//       "UTC",
//     ];
//   }, []);

//   useEffect(() => {
//     if (!slug) return;

//     async function load() {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `https://api.slotly.io/public/profile/${encodeURIComponent(slug)}`
//         );
//         if (!res.ok) throw new Error(await res.text());
//         const payload = await res.json();
//         setProfile(payload.profile);
//       } catch (err: any) {
//         setMessage("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, [slug]);

//   // When profile loads, set default timezone to the event/profile timezone.
//   useEffect(() => {
//     const t = String(profile?.timezone || "").trim();
//     if (!t) return;
//     setSelectedTz(t);
//   }, [profile?.timezone]);

//   const stepDateDone = !!selectedDate;
//   const stepTimeDone = !!selectedSlotISO;

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         Loading…
//       </div>
//     );

//   if (!profile)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-50">
//         {message || "Profile not found"}
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Top step bar */}
//         <div className="px-6 py-4 border-b bg-white">
//           <div className="flex flex-wrap items-center gap-3 justify-between">
//             <div className="flex flex-wrap items-center gap-2">
//               <StepPill label="Date" active={!stepDateDone} done={stepDateDone} />
//               <StepPill
//                 label="Time"
//                 active={stepDateDone && !stepTimeDone}
//                 done={stepTimeDone}
//               />
//               <StepPill label="Details" active={stepTimeDone} done={false} />
//             </div>

//             <div className="flex items-center gap-2 text-xs text-gray-500">
//               <span className="whitespace-nowrap">Timezone</span>
//               <select
//                 value={selectedTz}
//                 onChange={(e) => setSelectedTz(e.target.value)}
//                 className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white"
//               >
//                 {tzOptions.map((tz) => (
//                   <option key={tz} value={tz}>
//                     {tz}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Main layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-12">
//           {/* Left info panel */}
//           <div className="lg:col-span-5">
//             <PublicEventInfo profile={profile} />
//           </div>

//           {/* Right side: fixed-height workspace */}
//           <div className="lg:col-span-7 p-5 sm:p-8">
//             <div className="grid grid-cols-1 gap-6">
//               <PublicCalendar
//                 slug={slug}
//                 bookingWindow={profile?.booking_window}
//                 selectedDate={selectedDate}
//                 onSelectDate={(d) => {
//                   setSelectedDate(d);
//                   setSelectedSlotISO(null);
//                 }}
//               />

//               {/* Equal-height two-column section */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="min-h-0">
//                   <PublicTimeSlots
//                     slug={slug}
//                     date={selectedDate}
//                     selectedSlotISO={selectedSlotISO}
//                     viewerTz={selectedTz}
//                     onSelectSlot={setSelectedSlotISO}
//                     // NEW: internal height control
//                     heightClass="h-[520px]"
//                   />
//                 </div>

//                 <div className="min-h-0">
//                   <PublicBookingForm
//                     slug={slug}
//                     profile={profile}
//                     selectedSlotISO={selectedSlotISO}
//                     viewerTz={selectedTz}
//                     // NEW: internal height control
//                     heightClass="h-[520px]"
//                     onBooked={() => {
//                       setSelectedDate(null);
//                       setSelectedSlotISO(null);
//                       toast({
//                         title: "Booking confirmed",
//                         description: "You will receive a confirmation email shortly.",
//                         variant: "success",
//                       });
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//@ts-nocheck
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
  const slug = params.slug as string;
  const { toast } = useToast();

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
          `https://api.slotly.io/public/profile/${slug}`
        );
        const data = await res.json();
        setProfile(data.profile);
        setSelectedTz(data.profile?.timezone || viewerTz);
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

  const handleBack = () => {
    if (profile) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex justify-center px-3 sm:px-6 py-4 sm:py-8">
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
                    {/* Back */}
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

                    {/* Next */}
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
              src="/Slotlyio-logo.png"
              alt="Slotly"
              className="h-5 sm:h-6 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
