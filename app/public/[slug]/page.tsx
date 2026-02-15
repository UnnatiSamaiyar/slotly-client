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










"use client";

import React, { useEffect, useState } from "react";

type Profile = {
  slug: string;
  title: string;
  duration_minutes: number;
  user_id: number;
  host_name?: string;
  host_sub?: string;
};

export default function PublicBookingPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/booking/public/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error(await res.text());
        const payload = await res.json();
        setProfile(payload.profile);
      } catch (err: any) {
        setMessage("Failed to load profile: " + (err.message || String(err)));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  // Generate 7 days × slots (09:00–16:00)
  const generateSlots = () => {
    const slots: string[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(day.getDate() + i);
      for (let h = 9; h <= 16; h++) {
        const dt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, 0, 0);
        slots.push(dt.toISOString());
      }
    }
    return slots;
  };

  const handleBook = async () => {
    if (!selected) return setMessage("Please select a date & time.");
    if (!guestName || !guestEmail) return setMessage("Enter your name and email.");

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_slug: slug,
          guest_name: guestName,
          guest_email: guestEmail,
          start_iso: selected,
        }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.detail || JSON.stringify(payload));

      setMessage("Success! Your booking is confirmed.");
      setSelected(null);
      setGuestName("");
      setGuestEmail("");

    } catch (err: any) {
      setMessage("Booking failed: " + (err.message || String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-600">Loading your booking page…</div>;
  if (!profile) return <div className="p-10 text-center text-red-600">{message || "Profile not found"}</div>;

  const slots = generateSlots();

  // Group slots by date for a modern Calendly layout
  const groupedSlots: Record<string, string[]> = {};
  slots.forEach((s) => {
    const d = new Date(s);
    const dateKey = d.toDateString();
    if (!groupedSlots[dateKey]) groupedSlots[dateKey] = [];
    groupedSlots[dateKey].push(s);
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex justify-center p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT — PROFILE INFO */}
        <div className="p-10 bg-gradient-to-br from-blue-600 to-blue-500 text-white">
          <h1 className="text-3xl font-bold mb-2">{profile.title}</h1>
          <p className="text-blue-100 mb-4">
            {profile.duration_minutes}-minute meeting
          </p>

          <div className="mt-6">
            <p className="text-sm opacity-80">Hosted by</p>
            <p className="text-lg font-semibold">{profile.host_name || "Host"}</p>
          </div>

          <div className="mt-10 text-sm opacity-80 leading-relaxed">
            Select a date & time on the right and complete your details to book instantly.
          </div>
        </div>

        {/* RIGHT — BOOKING FLOW */}
        <div className="p-10">

          {/* DATE & TIME SECTION */}
          <h2 className="text-xl font-semibold mb-4">Select a Time</h2>

          <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2">
            {Object.keys(groupedSlots).map((date) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{date}</h3>

                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {groupedSlots[date].map((s) => {
                    const isSelected = selected === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelected(s)}
                        className={`px-3 py-2 rounded-lg border text-sm transition
                          ${isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow"
                            : "border-gray-200 hover:bg-gray-100"
                          }`}
                      >
                        {new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* DETAILS FORM */}
          <h2 className="text-xl font-semibold mt-10 mb-4">Your Details</h2>

          <input
            className="w-full p-3 border rounded-lg mb-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 outline-none"
            placeholder="Your name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <input
            className="w-full p-3 border rounded-lg mb-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 outline-none"
            placeholder="Your email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
          />

          <button
            disabled={submitting}
            onClick={handleBook}
            className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
          >
            {submitting ? "Booking…" : "Confirm Booking"}
          </button>

          {message && (
            <p className="mt-3 text-sm text-center text-gray-700">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
