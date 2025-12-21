// "use client";

// import { useState } from "react";

// export default function PublicBookingForm({ slug, selectedSlot, setSelectedSlot }: any) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [msg, setMsg] = useState("");

//   const submit = async () => {
//     if (!selectedSlot) return setMsg("Please select a time.");
//     if (!name || !email) return setMsg("Enter your name and email.");

//     setSubmitting(true);
//     setMsg("");

//     try {
//       const res = await fetch("/api/booking", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           profile_slug: slug,
//           guest_name: name,
//           guest_email: email,
//           start_iso: selectedSlot,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.detail || "Failed to book.");

//       setMsg("🎉 Booking confirmed! Check your email.");
//       setName("");
//       setEmail("");
//       setSelectedSlot(null);

//     } catch (e: any) {
//       setMsg(e.message);
//     }

//     setSubmitting(false);
//   };

//   return (
//     <div className="mt-10">
//       <h2 className="text-xl font-semibold mb-4">Your Details</h2>

//       <input
//         className="w-full p-3 border rounded-lg mb-3"
//         placeholder="Your name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         className="w-full p-3 border rounded-lg mb-3"
//         placeholder="Your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <button
//         onClick={submit}
//         disabled={submitting}
//         className="w-full mt-3 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow"
//       >
//         {submitting ? "Booking…" : "Confirm Booking"}
//       </button>

//       {msg && <p className="mt-3 text-sm text-center text-gray-700">{msg}</p>}
//     </div>
//   );
// }









"use client";

import React, { useEffect, useState } from "react";

export default function PublicBookingForm({ slug, profile, selectedSlotISO, onBooked }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [meetingMode, setMeetingMode] = useState("google_meet");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Try prefill from localStorage if available
    const savedName = localStorage.getItem("slotly_name");
    const savedEmail = localStorage.getItem("slotly_email");
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  async function submit() {
    setMessage(null);
    if (!selectedSlotISO) return setMessage("Please select a time slot.");
    if (!name || !email) return setMessage("Name & email required.");

    setLoading(true);
    try {
      const payload = {
        profile_slug: slug,
        guest_name: name,
        attendees: [email],
        start_iso: selectedSlotISO,
        title: profile.title,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        meeting_mode: meetingMode,
        location: meetingMode === "in_person" ? location : null
      };

      const res = await fetch("http://localhost:8000/public/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.detail ?? JSON.stringify(body) ?? "Server error");

      // save name/email
      localStorage.setItem("slotly_name", name);
      localStorage.setItem("slotly_email", email);

      setMessage("Booking confirmed! Check your email for details.");
      if (onBooked) onBooked();
    } catch (e: any) {
      setMessage("Booking failed: " + (e.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      <div className="font-medium mb-3">Your Details</div>

      <input
        className="w-full p-3 border rounded-lg mb-3 focus:ring-1 focus:ring-indigo-400 outline-none"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full p-3 border rounded-lg mb-3 focus:ring-1 focus:ring-indigo-400 outline-none"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="mb-3">
        <label className="text-sm font-medium block mb-1">Meeting mode</label>
        <select value={meetingMode} onChange={(e) => setMeetingMode(e.target.value)} className="p-2 border rounded-lg w-full">
          <option value="google_meet">Google Meet</option>
          <option value="in_person">In-person</option>
        </select>
      </div>

      {meetingMode === "in_person" && (
        <input
          className="w-full p-3 border rounded-lg mb-3 focus:ring-1 focus:ring-indigo-400 outline-none"
          placeholder="Location (address)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      )}

      <button
        onClick={submit}
        disabled={loading || !selectedSlotISO}
        className={`w-full py-3 rounded-lg text-white font-semibold ${(!selectedSlotISO || loading) ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
      >
        {loading ? "Booking…" : (selectedSlotISO ? "Confirm Booking" : "Select time first")}
      </button>

      {message && <div className="mt-3 text-sm text-center text-gray-700">{message}</div>}
    </div>
  );
}
