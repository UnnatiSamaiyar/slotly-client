// "use client";

// import React, { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// type Profile = {
//   slug: string;
//   title: string;
//   duration_minutes: number;
//   user_id: number;
//   host_name?: string;
//   host_sub?: string;
// };

// export default function PublicBookingPage({ params }: { params: { slug: string } }) {
//   const slug = params.slug;
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState<string | null>(null); // ISO string
//   const [guestName, setGuestName] = useState("");
//   const [guestEmail, setGuestEmail] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`http://localhost:8000/booking/public/${encodeURIComponent(slug)}`);
//         if (!res.ok) throw new Error(await res.text());
//         const payload = await res.json();
//         setProfile(payload.profile);
//       } catch (err: any) {
//         setMessage("Failed to load profile: " + (err.message || String(err)));
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [slug]);

//   // create a simple slots list for next 7 days (09:00,10:00,...16:00) in local timezone
//   const generateSlots = () => {
//     const slots: string[] = [];
//     const days = 7;
//     for (let i = 0; i < days; i++) {
//       const day = new Date();
//       day.setDate(day.getDate() + i);
//       for (let h = 9; h <= 16; h++) {
//         const dt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, 0, 0);
//         slots.push(dt.toISOString());
//       }
//     }
//     return slots;
//   };

//   const handleBook = async () => {
//     if (!selected) { setMessage("Select a time first."); return; }
//     if (!guestName || !guestEmail) { setMessage("Enter name and email."); return; }
//     setSubmitting(true);
//     setMessage(null);
//     try {
//       const res = await fetch("/api/booking", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           profile_slug: slug,
//           guest_name: guestName,
//           guest_email: guestEmail,
//           start_iso: selected,
//         }),
//       });
//       const payload = await res.json();
//       if (!res.ok) throw new Error(payload?.detail || JSON.stringify(payload));
//       setMessage("Booked! Confirmation sent (if host calendar accepted).");
//       setSelected(null);
//       setGuestName(""); setGuestEmail("");
//     } catch (err: any) {
//       setMessage("Booking failed: " + (err.message || String(err)));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div className="p-6">Loading…</div>;
//   if (!profile) return <div className="p-6 text-red-600">{message || "Profile not found"}</div>;

//   const slots = generateSlots();

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-3xl mx-auto">
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//           <h2 className="text-2xl font-semibold">{profile.title}</h2>
//           <p className="text-sm text-gray-500">Duration: {profile.duration_minutes} minutes</p>
//           <p className="text-sm text-gray-400 mt-2">Host: {profile.host_name || "Host"}</p>

//           <div className="mt-6">
//             <h3 className="font-medium mb-2">Choose a slot (next 7 days)</h3>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-auto p-2">
//               {slots.map(s => (
//                 <button
//                   key={s}
//                   onClick={() => setSelected(s)}
//                   className={`text-left p-2 rounded border ${selected === s ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:bg-gray-50"}`}
//                 >
//                   <div className="text-sm">{new Date(s).toLocaleString()}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="font-medium mb-2">Your details</h3>
//             <input className="w-full p-2 border rounded mb-2" placeholder="Your name" value={guestName} onChange={(e)=>setGuestName(e.target.value)} />
//             <input className="w-full p-2 border rounded mb-2" placeholder="Your email" value={guestEmail} onChange={(e)=>setGuestEmail(e.target.value)} />
//             <div className="flex items-center gap-2">
//               <button disabled={submitting} onClick={handleBook} className="px-4 py-2 bg-blue-600 text-white rounded">
//                 {submitting ? "Booking…" : "Confirm Booking"}
//               </button>
//               {message && <div className="text-sm text-gray-700">{message}</div>}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { use, useEffect, useState } from "react";
// import PublicBookingHeader from "./components/PublicBookingHeader";
// import PublicBookingSlots from "./components/PublicBookingSlots";
// import PublicBookingForm from "./components/PublicBookingForm";

// export default function PublicBookingPage({ params }: any) {
//   // ⭐ NEW — unwrap params properly
//   const { slug } = use(params);

//   const [profile, setProfile] = useState<any>(null);
//   const [slots, setSlots] = useState<any[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState<string | null>(null);

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await fetch(`http://localhost:8000/public/profile/${encodeURIComponent(slug)}`)

//         const data = await res.json();

//         setProfile(data.profile);
//         setSlots(data.slots || []);
//       } catch (err) {
//         setMessage("Failed to load booking page.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
//         Loading booking page…
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
//         {message || "Profile not found"}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-6">
//       <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">

//         {/* LEFT: PROFILE INFO */}
//         <PublicBookingHeader profile={profile} />

//         {/* RIGHT: SLOTS + FORM */}
//         <div className="flex-1 p-10">
//           <PublicBookingSlots
//             slots={slots}
//             selectedSlot={selectedSlot}
//             setSelectedSlot={setSelectedSlot}
//           />

//           <PublicBookingForm
//             slug={slug}
//             selectedSlot={selectedSlot}
//             setSelectedSlot={setSelectedSlot}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }






// "use client";

// import React, { useEffect, useState, use } from "react";
// import PublicEventInfo from "./components/PublicEventInfo";
// import PublicCalendar from "./components/PublicCalendar";
// import PublicTimeSlots from "./components/PublicTimeSlots";
// import PublicBookingForm from "./components/PublicBookingForm";

// type PageProps = {
//   params: Promise<{ slug: string }>;
// };

// export default function PublicBookingPage({ params }: PageProps) {
//   // ✅ UNWRAP params properly
//   const { slug } = use(params);

//   const [profile, setProfile] = useState<any | null>(null);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedSlotISO, setSelectedSlotISO] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState<string | null>(null);

//   useEffect(() => {
//     async function load() {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `http://localhost:8000/public/profile/${encodeURIComponent(slug)}`
//         );

//         if (!res.ok) throw new Error(await res.text());

//         const data = await res.json();
//         setProfile(data.profile);
//       } catch (err: any) {
//         setMessage("Failed to load profile: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading…
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600">
//         {message || "Profile not found"}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
//       <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
//         <PublicEventInfo profile={profile} />

//         <div className="p-8">
//           <h2 className="text-xl font-semibold mb-4">
//             Select a Date & Time
//           </h2>

//           <PublicCalendar
//             slug={slug}
//             selectedDate={selectedDate}
//             onSelectDate={(d) => {
//               setSelectedDate(d);
//               setSelectedSlotISO(null);
//             }}
//           />

//           <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <PublicTimeSlots
//               slug={slug}
//               date={selectedDate}
//               selectedSlotISO={selectedSlotISO}
//               onSelectSlot={setSelectedSlotISO}
//             />

//             <PublicBookingForm
//               slug={slug}
//               profile={profile}
//               selectedSlotISO={selectedSlotISO}
//               onBooked={() => {
//                 setSelectedDate(null);
//                 setSelectedSlotISO(null);
//                 alert("Booking confirmed!");
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import PublicEventInfo from "./components/PublicEventInfo";
import PublicCalendar from "./components/PublicCalendar";
import PublicTimeSlots from "./components/PublicTimeSlots";
import PublicBookingForm from "./components/PublicBookingForm";

export default function PublicBookingPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [profile, setProfile] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotISO, setSelectedSlotISO] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/public/profile/${encodeURIComponent(slug)}`
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

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {message || "Profile not found"}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <PublicEventInfo profile={profile} />

        <div className="p-8">
          <PublicCalendar
            slug={slug}
            selectedDate={selectedDate}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setSelectedSlotISO(null);
            }}
          />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PublicTimeSlots
              slug={slug}
              date={selectedDate}
              selectedSlotISO={selectedSlotISO}
              onSelectSlot={setSelectedSlotISO}
            />

            <PublicBookingForm
              slug={slug}
              profile={profile}
              selectedSlotISO={selectedSlotISO}
              onBooked={() => {
                setSelectedDate(null);
                setSelectedSlotISO(null);
                alert("Booking confirmed");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
