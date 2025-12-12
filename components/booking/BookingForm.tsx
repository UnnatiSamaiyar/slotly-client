// "use client";

// import React, { useState } from "react";

// export default function BookingForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [inviteeEmail, setInviteeEmail] = useState("");
//   const [title, setTitle] = useState("Intro Call");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [duration, setDuration] = useState(15);
//   const [message, setMessage] = useState("");

//   const PROFILE_SLUG = "intro-call"; // Make sure this matches DB

//   const createBooking = async () => {
//     setMessage("");

//     if (!date || !time) {
//       setMessage("Please select date & time");
//       return;
//     }

//     // Combine into ISO datetime
//     const startISO = new Date(`${date}T${time}:00`).toISOString();

//     const payload = {
//       profile_slug: PROFILE_SLUG,
//       guest_name: name,
//       guest_email: inviteeEmail,
//       start_iso: startISO,
//     };

//     console.log("Sending payload:", payload);

//     try {
//       const res = await fetch("http://localhost:8000/bookings/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         setMessage("Error: " + errText);
//         return;
//       }

//       const data = await res.json();
//       setMessage("Booking created! Google Event ID: " + data.google_event_id);
//     } catch (error: any) {
//       setMessage("Request failed: " + error.message);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h2 className="text-3xl font-semibold mb-2">Book a meeting</h2>
//       <p className="text-gray-600 mb-8">
//         Create a meeting and invite someone — both calendars will get the event.
//       </p>

//       <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border">

//         <div>
//           <label>Your name</label>
//           <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
//         </div>

//         <div>
//           <label>Your email</label>
//           <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
//         </div>

//         <div>
//           <label>Invitee email</label>
//           <input className="input" value={inviteeEmail} onChange={(e) => setInviteeEmail(e.target.value)} />
//         </div>

//         <div>
//           <label>Event title</label>
//           <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
//         </div>

//         <div>
//           <label>Date</label>
//           <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
//         </div>

//         <div>
//           <label>Time</label>
//           <input type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
//         </div>

//         <div>
//           <label>Duration</label>
//           <select className="input" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
//             <option value={15}>15 min</option>
//             <option value={30}>30 min</option>
//             <option value={60}>60 min</option>
//           </select>
//         </div>

//         <div>
//           <label>Description</label>
//           <input className="input" placeholder="Optional meeting notes" />
//         </div>

//       </div>

//       <button
//         onClick={createBooking}
//         className="px-6 py-3 mt-6 rounded-md bg-blue-600 text-white font-semibold"
//       >
//         Create booking & invite
//       </button>

//       {message && (
//         <div className="mt-4 text-red-600 font-semibold">
//           {message}
//         </div>
//       )}
//     </div>
//   );
// }






// "use client";

// import React, { useState } from "react";

// export default function BookingForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [inviteeEmail, setInviteeEmail] = useState("");
//   const [title, setTitle] = useState("Intro Call");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [duration, setDuration] = useState(15);
//   const [message, setMessage] = useState("");

//   const PROFILE_SLUG = "intro-call";

//   const createBooking = async () => {
//     setMessage("");

//     if (!date || !time) {
//       setMessage("Please select date & time");
//       return;
//     }

//     const startISO = new Date(`${date}T${time}:00`).toISOString();

//     const payload = {
//       profile_slug: PROFILE_SLUG,
//       guest_name: name,
//       guest_email: inviteeEmail,
//       start_iso: startISO,
//     };

//     try {
//       const res = await fetch("http://localhost:8000/bookings/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         setMessage("Error: " + err);
//         return;
//       }

//       setMessage("🎉 Booking created successfully!");
//     } catch (error: any) {
//       setMessage("Request failed: " + error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-12">
//       <div className="w-full mx-auto bg-white shadow-xl border overflow-hidden flex">

//         {/* LEFT SECTION */}
//         <div className="w-1/3 bg-blue-600 text-white p-10 flex flex-col justify-between">
//           <div>
//             <h1 className="text-2xl font-semibold mb-2">Schedule Meeting</h1>
//             <p className="text-blue-100 text-sm">
//               Create a booking and automatically send calendar invites.
//             </p>

//             <div className="mt-8 space-y-5 text-sm">
//               <div>
//                 <p className="opacity-70">Event Title</p>
//                 <p className="font-medium">{title || "—"}</p>
//               </div>

//               <div>
//                 <p className="opacity-70">Duration</p>
//                 <p className="font-medium">{duration} minutes</p>
//               </div>

//               <div>
//                 <p className="opacity-70">Selected Date</p>
//                 <p className="font-medium">{date || "None"}</p>
//               </div>

//               <div>
//                 <p className="opacity-70">Selected Time</p>
//                 <p className="font-medium">{time || "None"}</p>
//               </div>
//             </div>
//           </div>

//           <div className="text-xs opacity-70">Powered by <span className="font-semibold">Slotly</span></div>
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="w-2/3 p-10">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6">Enter Meeting Details</h2>

//           <div className="grid grid-cols-2 gap-6">
//             <div className="flex flex-col">
//               <label className="text-sm font-medium text-gray-600">Your Name</label>
//               <input
//                 className="mt-1 p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400"
//                 placeholder="John Doe"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="text-sm font-medium text-gray-600">Your Email</label>
//               <input
//                 className="mt-1 p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="text-sm font-medium text-gray-600">Invitee Email</label>
//               <input
//                 className="mt-1 p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400"
//                 placeholder="invitee@example.com"
//                 value={inviteeEmail}
//                 onChange={(e) => setInviteeEmail(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="text-sm font-medium text-gray-600">Meeting Title</label>
//               <input
//                 className="mt-1 p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="text-sm font-medium text-gray-600">Date</label>
//               <input
//                 type="date"
//                 className="mt-1 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="text-sm font-medium text-gray-600">Time</label>
//               <input
//                 type="time"
//                 className="mt-1 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="text-sm font-medium text-gray-600">Duration</label>
//               <select
//                 className="mt-1 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
//                 value={duration}
//                 onChange={(e) => setDuration(Number(e.target.value))}
//               >
//                 <option value={15}>15 minutes</option>
//                 <option value={30}>30 minutes</option>
//                 <option value={60}>1 hour</option>
//               </select>
//             </div>
//           </div>

//           <button
//             onClick={createBooking}
//             className="w-full mt-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium shadow-md"
//           >
//             Create Meeting
//           </button>

//           {message && (
//             <div className="mt-4 text-center text-sm font-semibold text-blue-700 bg-blue-50 py-3 rounded-lg">
//               {message}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";

// import React, { useState, useMemo } from "react";

// // Meeting Type Options
// const MEETING_TYPES = [
//   { label: "Introductory", color: "bg-blue-500" },
//   { label: "Product Demo", color: "bg-green-500" },
//   { label: "Support Call", color: "bg-orange-500" },
//   { label: "Strategy Call", color: "bg-purple-500" },
// ];

// export default function BookingForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [inviteeEmail, setInviteeEmail] = useState("");
//   const [title, setTitle] = useState("Intro Call");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [duration, setDuration] = useState(30);
//   const [message, setMessage] = useState("");
//   const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);

//   const PROFILE_SLUG = "intro-call";

//   // -----------------------------------------------------------
//   // 1️⃣ Smart Availability + Conflict Checker (FIXED)
//   // -----------------------------------------------------------
//   const availabilityStatus = useMemo(() => {
//     if (!date || !time) return null;

//     const parts = time.split(":");
//     if (parts.length < 2) return null;

//     const minutes = parseInt(parts[1], 10);
//     if (isNaN(minutes)) return null;

//     if (minutes === 0) {
//       return { text: "Available", color: "text-green-600", icon: "✔" };
//     }
//     if (minutes === 30) {
//       return { text: "Possible conflict", color: "text-red-600", icon: "⚠" };
//     }

//     return { text: "Check this time", color: "text-gray-600", icon: "ℹ" };
//   }, [date, time]);

//   // -----------------------------------------------------------
//   // 4️⃣ Meeting Link Preview (FIXED)
//   // -----------------------------------------------------------
//   const meetingLink = useMemo(() => {
//     const base = `https://slotly.com/book/${encodeURIComponent(PROFILE_SLUG)}`;

//     const raw = name.trim() || title.trim() || "guest";

//     const safe = encodeURIComponent(
//       raw.toLowerCase().replace(/\s+/g, "-")
//     );

//     return `${base}?for=${safe}`;
//   }, [name, title]);

//   // -----------------------------------------------------------
//   // POST CALL
//   // -----------------------------------------------------------
//   const createBooking = async () => {
//     setMessage("");

//     if (!date || !time) {
//       setMessage("Please select date & time");
//       return;
//     }

//     const startISO = new Date(`${date}T${time}:00`).toISOString();

//     try {
//       const res = await fetch("http://localhost:8000/bookings/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           profile_slug: PROFILE_SLUG,
//           guest_name: name,
//           guest_email: inviteeEmail,
//           start_iso: startISO,
//         }),
//       });

//       if (!res.ok) {
//         setMessage("Error: " + (await res.text()));
//         return;
//       }

//       setMessage("🎉 Meeting created successfully!");
//     } catch (error) {
//       setMessage("Request failed: " + error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex bg-gray-50">

//       {/* LEFT PREVIEW PANEL */}
//       <div className="w-[32%] bg-white border-r shadow-lg p-10">
//         <h2 className="text-xl font-bold text-gray-900 mb-6">Live Preview</h2>

//         <div className="space-y-6 bg-gray-50 rounded-xl p-6 border shadow-inner">

//           {/* Meeting Type Badge */}
//           <div>
//             <p className="text-xs text-gray-500 uppercase tracking-wide">
//               Meeting Type
//             </p>
//             <span
//               className={`inline-block mt-1 px-3 py-1 text-sm text-white rounded-full ${meetingType.color}`}
//             >
//               {meetingType.label}
//             </span>
//           </div>

//           {/* Standard Preview Fields */}
//           <Preview label="Meeting Title" value={title} />

//           {/* Availability */}
//           {availabilityStatus && (
//             <div className="pt-2">
//               <p className="text-xs text-gray-500 uppercase tracking-wide">
//                 Availability
//               </p>
//               <p
//                 className={`text-sm font-semibold flex items-center gap-2 ${availabilityStatus.color}`}
//               >
//                 {availabilityStatus.icon} {availabilityStatus.text}
//               </p>
//             </div>
//           )}

//           <Preview label="Host" value={name || "—"} />
//           <Preview label="Invitee Email" value={inviteeEmail || "—"} />
//           <Preview label="Date" value={date || "—"} />
//           <Preview label="Time" value={time || "—"} />
//           <Preview label="Duration" value={`${duration} minutes`} />

//           {/* Meeting Link */}
//           <div className="pt-3">
//             <p className="text-xs text-gray-500 uppercase tracking-wide">
//               Meeting Link
//             </p>
//             <p className="text-blue-600 underline break-all text-sm">
//               {meetingLink}
//             </p>
//           </div>
//         </div>

//         <p className="text-xs text-gray-400 mt-10">Powered by Slotly</p>
//       </div>

//       {/* RIGHT FORM PANEL */}
//       <div className="flex-1 p-14 overflow-y-auto">
//         <h1 className="text-3xl font-bold mb-1">Create a Meeting</h1>
//         <p className="text-gray-600 mb-10">Add details below for your invite.</p>

//         <div className="grid grid-cols-2 gap-10 max-w-4xl">

//           <FormField label="Your Name" value={name} setValue={setName} />
//           <FormField label="Your Email" value={email} setValue={setEmail} />
//           <FormField label="Invitee Email" value={inviteeEmail} setValue={setInviteeEmail} />
//           <FormField label="Meeting Title" value={title} setValue={setTitle} />

//           {/* Meeting Type Dropdown */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Meeting Type</label>
//             <select
//               className="p-3 w-full rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
//               onChange={(e) =>
//                 setMeetingType(
//                   MEETING_TYPES.find((t) => t.label === e.target.value) ??
//                     MEETING_TYPES[0]
//                 )
//               }
//             >
//               {MEETING_TYPES.map((t) => (
//                 <option key={t.label}>{t.label}</option>
//               ))}
//             </select>
//           </div>

//           <FormField label="Date" type="date" value={date} setValue={setDate} />
//           <FormField label="Time" type="time" value={time} setValue={setTime} />

//           {/* Duration */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Duration</label>
//             <select
//               className="p-3 w-full rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
//               value={duration}
//               onChange={(e) => setDuration(Number(e.target.value))}
//             >
//               <option value={15}>15 minutes</option>
//               <option value={30}>30 minutes</option>
//               <option value={60}>1 hour</option>
//             </select>
//           </div>
//         </div>

//         <button
//           onClick={createBooking}
//           className="w-full max-w-xl mt-12 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold shadow-lg transition active:scale-95"
//         >
//           Create Meeting
//         </button>

//         {message && (
//           <div className="mt-6 w-full max-w-xl text-center text-indigo-700 bg-indigo-100 border border-indigo-200 py-3 rounded-xl shadow-sm">
//             {message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // -----------------------------------------------------------
// // EXTRA COMPONENTS
// // -----------------------------------------------------------

// function Preview({ label, value }) {
//   return (
//     <div>
//       <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
//       <p className="text-md font-semibold text-gray-800 mt-1">{value}</p>
//     </div>
//   );
// }

// function FormField({ label, value, setValue, type = "text" }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-600 mb-1">
//         {label}
//       </label>
//       <input
//         type={type}
//         className="p-3 w-full rounded-xl border bg-white shadow-sm hover:bg-indigo-50/40 focus:bg-white focus:ring-2 focus:ring-indigo-400 transition"
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//       />
//     </div>
//   );
// }








// "use client";

// import React, { useState, useMemo, useEffect } from "react";

// // Meeting Type Options
// const MEETING_TYPES = [
//   { label: "Introductory", color: "bg-blue-500" },
//   { label: "Product Demo", color: "bg-green-500" },
//   { label: "Support Call", color: "bg-orange-500" },
//   { label: "Strategy Call", color: "bg-purple-500" },
// ];

// export default function BookingForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [inviteeEmail, setInviteeEmail] = useState("");
//   const [title, setTitle] = useState("Intro Call");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [duration, setDuration] = useState(30);
//   const [message, setMessage] = useState("");
//   const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);

//   const [slots, setSlots] = useState([]); 

//   const PROFILE_SLUG = "intro-call";

//   // -----------------------------------------------------------
//   // 1️⃣ FETCH BACKEND AVAILABILITY WHEN DATE CHANGES
//   // -----------------------------------------------------------
//   useEffect(() => {
//     if (!date) return;

//     fetch(`http://localhost:8000/bookings/availability/${PROFILE_SLUG}?date=${date}`)
//       .then((res) => res.json())
//       .then((data) => setSlots(data.slots || []))
//       .catch(() => setSlots([]));
//   }, [date]);

//   // -----------------------------------------------------------
//   // 2️⃣ Smart Availability Preview
//   // -----------------------------------------------------------
//   const availabilityStatus = useMemo(() => {
//     if (!date || !time) return null;

//     const slot = slots.find((s) => s.time === time);
//     if (!slot) return null;

//     return slot.available
//       ? { text: "Available", color: "text-green-600", icon: "✔" }
//       : { text: "Unavailable", color: "text-red-600", icon: "⚠" };
//   }, [date, time, slots]);

//   // -----------------------------------------------------------
//   // 3️⃣ Meeting Link Preview
//   // -----------------------------------------------------------
//   const meetingLink = useMemo(() => {
//     const base = `https://slotly.com/book/${encodeURIComponent(PROFILE_SLUG)}`;
//     const raw = name.trim() || title.trim() || "guest";
//     const safe = encodeURIComponent(raw.toLowerCase().replace(/\s+/g, "-"));
//     return `${base}?for=${safe}`;
//   }, [name, title]);

//   // -----------------------------------------------------------
//   // 4️⃣ POST CALL
//   // -----------------------------------------------------------
//   const createBooking = async () => {
//     setMessage("");

//     if (!date || !time) {
//       setMessage("Please select date & time");
//       return;
//     }

//     const startISO = new Date(`${date}T${time}:00`).toISOString();

//     try {
//       const res = await fetch("http://localhost:8000/bookings/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           profile_slug: PROFILE_SLUG,
//           guest_name: name,
//           guest_email: inviteeEmail,
//           start_iso: startISO,
//           title,
//           timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//         }),
//       });

//       if (!res.ok) {
//         setMessage("Error: " + (await res.text()));
//         return;
//       }

//       setMessage("🎉 Meeting created successfully!");
//     } catch (error) {
//       setMessage("Request failed: " + error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex bg-gray-50">

//       {/* LEFT PREVIEW PANEL */}
//       <div className="w-[32%] bg-white border-r shadow-lg p-10">
//         <h2 className="text-xl font-bold text-gray-900 mb-6">Live Preview</h2>

//         <div className="space-y-6 bg-gray-50 rounded-xl p-6 border shadow-inner">
//           <div>
//             <p className="text-xs text-gray-500 uppercase">Meeting Type</p>
//             <span className={`inline-block mt-1 px-3 py-1 text-sm text-white rounded-full ${meetingType.color}`}>
//               {meetingType.label}
//             </span>
//           </div>

//           <Preview label="Meeting Title" value={title} />

//           {availabilityStatus && (
//             <div className="pt-2">
//               <p className="text-xs text-gray-500 uppercase">Availability</p>
//               <p className={`text-sm font-semibold flex items-center gap-2 ${availabilityStatus.color}`}>
//                 {availabilityStatus.icon} {availabilityStatus.text}
//               </p>
//             </div>
//           )}

//           <Preview label="Host" value={name || "—"} />
//           <Preview label="Invitee Email" value={inviteeEmail || "—"} />
//           <Preview label="Date" value={date || "—"} />
//           <Preview label="Time" value={time || "—"} />
//           <Preview label="Duration" value={`${duration} minutes`} />

//           <div className="pt-3">
//             <p className="text-xs text-gray-500 uppercase">Meeting Link</p>
//             <p className="text-blue-600 underline break-all text-sm">{meetingLink}</p>
//           </div>
//         </div>

//         <p className="text-xs text-gray-400 mt-10">Powered by Slotly</p>
//       </div>

//       {/* RIGHT FORM PANEL */}
//       <div className="flex-1 p-14 overflow-y-auto">
//         <h1 className="text-3xl font-bold mb-1">Create a Meeting</h1>
//         <p className="text-gray-600 mb-10">Add details below for your invite.</p>

//         <div className="grid grid-cols-2 gap-10 max-w-4xl">

//           <FormField label="Your Name" value={name} setValue={setName} />
//           <FormField label="Your Email" value={email} setValue={setEmail} />
//           <FormField label="Invitee Email" value={inviteeEmail} setValue={setInviteeEmail} />
//           <FormField label="Meeting Title" value={title} setValue={setTitle} />

//           {/* Meeting Type Dropdown */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Meeting Type</label>
//             <select
//               className="p-3 w-full rounded-xl border bg-white shadow-sm"
//               onChange={(e) =>
//                 setMeetingType(MEETING_TYPES.find((t) => t.label === e.target.value) ??
//                   MEETING_TYPES[0])
//               }
//             >
//               {MEETING_TYPES.map((t) => (
//                 <option key={t.label}>{t.label}</option>
//               ))}
//             </select>
//           </div>

//           {/* Date Input */}
//           <FormField label="Date" type="date" value={date} setValue={setDate} />

//           {/* TIME SLOTS FIXED */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Select Time</label>

//             <div className="grid grid-cols-4 gap-3 mt-2">
//               {slots.length === 0 && (
//                 <p className="text-gray-500 text-sm">Select a date to load slots</p>
//               )}

//               {slots.map((s) => (
//                 <button
//                   key={s.time}
//                   disabled={!s.available}
//                   onClick={() => setTime(s.time)}
//                   className={`
//                     p-2 text-center rounded-lg border text-sm
//                     ${
//                       s.available
//                         ? "bg-white hover:bg-indigo-100 border-indigo-300"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
//                     }
//                     ${time === s.time ? "ring-2 ring-indigo-500" : ""}
//                   `}
//                 >
//                   {s.time}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Duration */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Duration</label>
//             <select
//               className="p-3 w-full rounded-xl border bg-white shadow-sm"
//               value={duration}
//               onChange={(e) => setDuration(Number(e.target.value))}
//             >
//               <option value={15}>15 minutes</option>
//               <option value={30}>30 minutes</option>
//               <option value={60}>1 hour</option>
//             </select>
//           </div>
//         </div>

//         <button
//           onClick={createBooking}
//           className="w-full max-w-xl mt-12 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold shadow-lg"
//         >
//           Create Meeting
//         </button>

//         {message && (
//           <div className="mt-6 w-full max-w-xl text-center text-indigo-700 bg-indigo-100 py-3 rounded-xl shadow-sm">
//             {message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // -----------------------------------------------------------
// // EXTRA COMPONENTS
// // -----------------------------------------------------------

// function Preview({ label, value }) {
//   return (
//     <div>
//       <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
//       <p className="text-md font-semibold text-gray-800 mt-1">{value}</p>
//     </div>
//   );
// }

// function FormField({ label, value, setValue, type = "text" }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
//       <input
//         type={type}
//         className="p-3 w-full rounded-xl border bg-white shadow-sm hover:bg-indigo-50/40 focus:ring-2 focus:ring-indigo-400"
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//       />
//     </div>
//   );
// }










// "use client";

// import React, { useState, useMemo, useEffect } from "react";

// // Meeting Type Options
// const MEETING_TYPES = [
//   { label: "Introductory", color: "bg-blue-500" },
//   { label: "Product Demo", color: "bg-green-500" },
//   { label: "Support Call", color: "bg-orange-500" },
//   { label: "Strategy Call", color: "bg-purple-500" },
// ];

// export default function BookingForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   // ⭐ MULTIPLE ATTENDEES ARRAY
//   const [attendees, setAttendees] = useState([""]);

//   const [title, setTitle] = useState("Intro Call");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [duration, setDuration] = useState(30);
//   const [message, setMessage] = useState("");
//   const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);

//   const [slots, setSlots] = useState([]);

//   const PROFILE_SLUG = "intro-call";

//   // -----------------------------
//   // Fetch backend availability
//   // -----------------------------
//   useEffect(() => {
//     if (!date) return;
//     fetch(`http://localhost:8000/bookings/availability/${PROFILE_SLUG}?date=${date}`)
//       .then((res) => res.json())
//       .then((data) => setSlots(data.slots || []))
//       .catch(() => setSlots([]));
//   }, [date]);

//   // -----------------------------
//   // Smart availability
//   // -----------------------------
//   const availabilityStatus = useMemo(() => {
//     if (!date || !time) return null;
//     const slot = slots.find((s) => s.time === time);
//     if (!slot) return null;

//     return slot.available
//       ? { text: "Available", color: "text-green-600", icon: "✔" }
//       : { text: "Unavailable", color: "text-red-600", icon: "⚠" };
//   }, [date, time, slots]);

//   // -----------------------------
//   // Meeting Link Preview
//   // -----------------------------
//   const meetingLink = useMemo(() => {
//     const base = `https://slotly.com/book/${encodeURIComponent(PROFILE_SLUG)}`;
//     const raw = name.trim() || title.trim() || "guest";
//     const safe = encodeURIComponent(raw.toLowerCase().replace(/\s+/g, "-"));
//     return `${base}?for=${safe}`;
//   }, [name, title]);

//   // -----------------------------
//   // Add attendee
//   // -----------------------------
//   const addAttendee = () => {
//     setAttendees([...attendees, ""]);
//   };

//   const updateAttendee = (index, value) => {
//     const copy = [...attendees];
//     copy[index] = value;
//     setAttendees(copy);
//   };

//   // -----------------------------
//   // Create Booking
//   // -----------------------------
//   const createBooking = async () => {
//     setMessage("");

//     if (!date || !time) {
//       setMessage("Please select date & time");
//       return;
//     }

//     const validAttendees = attendees.filter(a => a.trim() !== "");

//     if (validAttendees.length === 0) {
//       setMessage("Please enter at least one attendee email.");
//       return;
//     }

//     const startISO = new Date(`${date}T${time}:00`).toISOString();

//     try {
//       const res = await fetch("http://localhost:8000/bookings/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           profile_slug: PROFILE_SLUG,
//           guest_name: name,
//           attendees: validAttendees,   // ⭐ UPDATED
//           start_iso: startISO,
//           title,
//           timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//         }),
//       });

//       if (!res.ok) {
//         setMessage("Error: " + (await res.text()));
//         return;
//       }

//       setMessage("🎉 Meeting created successfully!");
//     } catch (error) {
//       setMessage("Request failed: " + error.message);
//     }
//   };

//   // -----------------------------
//   // UI
//   // -----------------------------
//   return (
//     <div className="min-h-screen w-full flex bg-gray-50">

//       {/* LEFT PREVIEW PANEL */}
//       <div className="w-[32%] bg-white border-r shadow-lg p-10">
//         <h2 className="text-xl font-bold text-gray-900 mb-6">Live Preview</h2>

//         <div className="space-y-6 bg-gray-50 rounded-xl p-6 border shadow-inner">
//           <div>
//             <p className="text-xs text-gray-500 uppercase">Meeting Type</p>
//             <span className={`inline-block mt-1 px-3 py-1 text-sm text-white rounded-full ${meetingType.color}`}>
//               {meetingType.label}
//             </span>
//           </div>

//           <Preview label="Meeting Title" value={title} />

//           {availabilityStatus && (
//             <div className="pt-2">
//               <p className="text-xs text-gray-500 uppercase">Availability</p>
//               <p className={`text-sm font-semibold flex items-center gap-2 ${availabilityStatus.color}`}>
//                 {availabilityStatus.icon} {availabilityStatus.text}
//               </p>
//             </div>
//           )}

//           <Preview label="Host" value={name || "—"} />

//           {/* MULTIPLE ATTENDEES PREVIEW */}
//           <Preview
//             label="Attendees"
//             value={attendees.filter(a => a.trim() !== "").join(", ") || "—"}
//           />

//           <Preview label="Date" value={date || "—"} />
//           <Preview label="Time" value={time || "—"} />
//           <Preview label="Duration" value={`${duration} minutes`} />

//           <div className="pt-3">
//             <p className="text-xs text-gray-500 uppercase">Meeting Link</p>
//             <p className="text-blue-600 underline break-all text-sm">{meetingLink}</p>
//           </div>
//         </div>

//         <p className="text-xs text-gray-400 mt-10">Powered by Slotly</p>
//       </div>

//       {/* RIGHT FORM PANEL */}
//       <div className="flex-1 p-14 overflow-y-auto">
//         <h1 className="text-3xl font-bold mb-1">Create a Meeting</h1>
//         <p className="text-gray-600 mb-10">Add details below for your invite.</p>

//         <div className="grid grid-cols-2 gap-10 max-w-4xl">
//           <FormField label="Your Name" value={name} setValue={setName} />
//           <FormField label="Your Email" value={email} setValue={setEmail} />
//           <FormField label="Meeting Title" value={title} setValue={setTitle} />

//           {/* Meeting Type */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Meeting Type</label>
//             <select
//               className="p-3 w-full rounded-xl border bg-white shadow-sm"
//               onChange={(e) =>
//                 setMeetingType(
//                   MEETING_TYPES.find((t) => t.label === e.target.value) ?? MEETING_TYPES[0]
//                 )
//               }
//             >
//               {MEETING_TYPES.map((t) => (
//                 <option key={t.label}>{t.label}</option>
//               ))}
//             </select>
//           </div>

//           {/* MULTIPLE ATTENDEE FIELDS */}
//           <div className="col-span-2">
//             <label className="block text-sm text-gray-600 mb-1">Invitee Emails</label>

//             <div className="space-y-3">
//               {attendees.map((email, idx) => (
//                 <input
//                   key={idx}
//                   type="email"
//                   placeholder={`Invitee Email ${idx + 1}`}
//                   value={email}
//                   onChange={(e) => updateAttendee(idx, e.target.value)}
//                   className="p-3 w-full rounded-xl border bg-white shadow-sm"
//                 />
//               ))}
//             </div>

//             <button
//               onClick={addAttendee}
//               className="mt-2 text-indigo-600 text-sm font-semibold hover:underline"
//             >
//               + Add another attendee
//             </button>
//           </div>

//           {/* Date */}
//           <FormField label="Date" type="date" value={date} setValue={setDate} />

//           {/* TIME SLOTS */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Select Time</label>

//             <div className="grid grid-cols-4 gap-3 mt-2">
//               {slots.length === 0 && (
//                 <p className="text-gray-500 text-sm">Select a date to load slots</p>
//               )}

//               {slots.map((s) => (
//                 <button
//                   key={s.time}
//                   disabled={!s.available}
//                   onClick={() => setTime(s.time)}
//                   className={`
//                     p-2 text-center rounded-lg border text-sm
//                     ${
//                       s.available
//                         ? "bg-white hover:bg-indigo-100 border-indigo-300"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
//                     }
//                     ${time === s.time ? "ring-2 ring-indigo-500" : ""}
//                   `}
//                 >
//                   {s.time}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Duration */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Duration</label>
//             <select
//               className="p-3 w-full rounded-xl border bg-white shadow-sm"
//               value={duration}
//               onChange={(e) => setDuration(Number(e.target.value))}
//             >
//               <option value={15}>15 minutes</option>
//               <option value={30}>30 minutes</option>
//               <option value={60}>1 hour</option>
//             </select>
//           </div>
//         </div>

//         <button
//           onClick={createBooking}
//           className="w-full max-w-xl mt-12 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold shadow-lg"
//         >
//           Create Meeting
//         </button>

//         {message && (
//           <div className="mt-6 w-full max-w-xl text-center text-indigo-700 bg-indigo-100 py-3 rounded-xl shadow-sm">
//             {message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ---------------------------
// // Extra Components
// // ---------------------------
// function Preview({ label, value }) {
//   return (
//     <div>
//       <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
//       <p className="text-md font-semibold text-gray-800 mt-1">{value}</p>
//     </div>
//   );
// }

// function FormField({ label, value, setValue, type = "text" }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
//       <input
//         type={type}
//         className="p-3 w-full rounded-xl border bg-white shadow-sm hover:bg-indigo-50/40 focus:ring-2 focus:ring-indigo-400"
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//       />
//     </div>
//   );
// }











"use client";

import React, { useState, useMemo, useEffect } from "react";

// Meeting Type Options
const MEETING_TYPES = [
  { label: "Introductory", color: "bg-blue-500" },
  { label: "Product Demo", color: "bg-green-500" },
  { label: "Support Call", color: "bg-orange-500" },
  { label: "Strategy Call", color: "bg-purple-500" },
];

// ⭐ MEETING MODE OPTIONS
const MEETING_MODES = [
  { label: "Google Meet", value: "google_meet" },
  { label: "In-Person Meeting", value: "in_person" },
];

export default function BookingForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ⭐ MULTIPLE ATTENDEES ARRAY
  const [attendees, setAttendees] = useState([""]);

  const [title, setTitle] = useState("Intro Call");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [message, setMessage] = useState("");
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);

  const [meetingMode, setMeetingMode] = useState(MEETING_MODES[0]); // ⭐ New
  const [location, setLocation] = useState(""); // ⭐ Only used for in-person

  const [slots, setSlots] = useState([]);

  const PROFILE_SLUG = "intro-call";

  // -----------------------------
  // Fetch backend availability
  // -----------------------------
  useEffect(() => {
    if (!date) return;
    fetch(`http://localhost:8000/bookings/availability/${PROFILE_SLUG}?date=${date}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots || []))
      .catch(() => setSlots([]));
  }, [date]);

  // -----------------------------
  // Smart availability
  // -----------------------------
  const availabilityStatus = useMemo(() => {
    if (!date || !time) return null;
    const slot = slots.find((s) => s.time === time);
    if (!slot) return null;

    return slot.available
      ? { text: "Available", color: "text-green-600", icon: "✔" }
      : { text: "Unavailable", color: "text-red-600", icon: "⚠" };
  }, [date, time, slots]);

  // -----------------------------
  // Meeting Link Preview
  // -----------------------------
  const meetingLink = useMemo(() => {
    const base = `https://slotly.com/book/${encodeURIComponent(PROFILE_SLUG)}`;
    const raw = name.trim() || title.trim() || "guest";
    const safe = encodeURIComponent(raw.toLowerCase().replace(/\s+/g, "-"));
    return `${base}?for=${safe}`;
  }, [name, title]);

  // -----------------------------
  // Add attendee
  // -----------------------------
  const addAttendee = () => setAttendees([...attendees, ""]);

  const updateAttendee = (index, value) => {
    const copy = [...attendees];
    copy[index] = value;
    setAttendees(copy);
  };

  // -----------------------------
  // Create Booking
  // -----------------------------
  const createBooking = async () => {
    setMessage("");

    if (!date || !time) {
      setMessage("Please select date & time");
      return;
    }

    const validAttendees = attendees.filter(a => a.trim() !== "");

    if (validAttendees.length === 0) {
      setMessage("Please enter at least one attendee email.");
      return;
    }

    if (meetingMode.value === "in_person" && location.trim() === "") {
      setMessage("Please enter the meeting location.");
      return;
    }

    const startISO = new Date(`${date}T${time}:00`).toISOString();

    try {
      const res = await fetch("http://localhost:8000/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_slug: PROFILE_SLUG,
          guest_name: name,
          attendees: validAttendees,
          start_iso: startISO,
          title,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

          // ⭐ NEW FIELDS
          meeting_mode: meetingMode.value,
          location: meetingMode.value === "in_person" ? location : null,
        }),
      });

      if (!res.ok) {
        setMessage("Error: " + (await res.text()));
        return;
      }

      setMessage("🎉 Meeting created successfully!");
    } catch (error) {
      setMessage("Request failed: " + error.message);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen w-full flex bg-gray-50">

      {/* LEFT PREVIEW PANEL */}
      <div className="w-[32%] bg-white border-r shadow-lg p-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Live Preview</h2>

        <div className="space-y-6 bg-gray-50 rounded-xl p-6 border shadow-inner">
          
          {/* Meeting Type */}
          <div>
            <p className="text-xs text-gray-500 uppercase">Meeting Type</p>
            <span className={`inline-block mt-1 px-3 py-1 text-sm text-white rounded-full ${meetingType.color}`}>
              {meetingType.label}
            </span>
          </div>

          {/* Meeting Mode Preview */}
          <Preview
            label="Meeting Mode"
            value={
              meetingMode.value === "google_meet"
                ? "Google Meet (auto-generated)"
                : `In-Person: ${location || "—"}`
            }
          />

          <Preview label="Meeting Title" value={title} />

          {availabilityStatus && (
            <div className="pt-2">
              <p className="text-xs text-gray-500 uppercase">Availability</p>
              <p className={`text-sm font-semibold flex items-center gap-2 ${availabilityStatus.color}`}>
                {availabilityStatus.icon} {availabilityStatus.text}
              </p>
            </div>
          )}

          <Preview label="Host" value={name || "—"} />

          <Preview
            label="Attendees"
            value={attendees.filter(a => a.trim() !== "").join(", ") || "—"}
          />

          <Preview label="Date" value={date || "—"} />
          <Preview label="Time" value={time || "—"} />
          <Preview label="Duration" value={`${duration} minutes`} />

          {/* Meeting Link */}
          <div className="pt-3">
            <p className="text-xs text-gray-500 uppercase">Meeting Link</p>
            <p className="text-blue-600 underline break-all text-sm">{meetingLink}</p>
          </div>

        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 p-14 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-1">Create a Meeting</h1>
        <p className="text-gray-600 mb-10">Add details below for your invite.</p>

        <div className="grid grid-cols-2 gap-10 max-w-4xl">

          <FormField label="Your Name" value={name} setValue={setName} />
          <FormField label="Your Email" value={email} setValue={setEmail} />
          <FormField label="Meeting Title" value={title} setValue={setTitle} />

          {/* Meeting Type */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Meeting Type</label>
            <select
              className="p-3 w-full rounded-xl border bg-white shadow-sm"
              onChange={(e) =>
                setMeetingType(
                  MEETING_TYPES.find((t) => t.label === e.target.value) ??
                  MEETING_TYPES[0]
                )
              }
            >
              {MEETING_TYPES.map((t) => (
                <option key={t.label}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Meeting Mode Dropdown */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Meeting Mode</label>
            <select
              className="p-3 w-full rounded-xl border bg-white shadow-sm"
              value={meetingMode.value}
              onChange={(e) =>
                setMeetingMode(MEETING_MODES.find((m) => m.value === e.target.value))
              }
            >
              {MEETING_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* In-Person Location Input */}
          {meetingMode.value === "in_person" && (
            <div className="col-span-2">
              <FormField
                label="Meeting Location (In-Person)"
                value={location}
                setValue={setLocation}
              />
            </div>
          )}

          {/* Attendees */}
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Invitee Emails</label>

            <div className="space-y-3">
              {attendees.map((email, idx) => (
                <input
                  key={idx}
                  type="email"
                  placeholder={`Invitee Email ${idx + 1}`}
                  value={email}
                  onChange={(e) => updateAttendee(idx, e.target.value)}
                  className="p-3 w-full rounded-xl border bg-white shadow-sm"
                />
              ))}
            </div>

            <button
              onClick={addAttendee}
              className="mt-2 text-indigo-600 text-sm font-semibold hover:underline"
            >
              + Add another attendee
            </button>
          </div>

          <FormField label="Date" type="date" value={date} setValue={setDate} />

          {/* Time Slot Selector */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Select Time</label>

            <div className="grid grid-cols-4 gap-3 mt-2">
              {slots.length === 0 && (
                <p className="text-gray-500 text-sm">Select a date to load slots</p>
              )}

              {slots.map((s) => (
                <button
                  key={s.time}
                  disabled={!s.available}
                  onClick={() => setTime(s.time)}
                  className={`
                    p-2 text-center rounded-lg border text-sm
                    ${s.available
                      ? "bg-white hover:bg-indigo-100 border-indigo-300"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"}
                    ${time === s.time ? "ring-2 ring-indigo-500" : ""}
                  `}
                >
                  {s.time}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Duration</label>
            <select
              className="p-3 w-full rounded-xl border bg-white shadow-sm"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>
        </div>

        <button
          onClick={createBooking}
          className="w-full max-w-xl mt-12 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold shadow-lg"
        >
          Create Meeting
        </button>

        {message && (
          <div className="mt-6 w-full max-w-xl text-center text-indigo-700 bg-indigo-100 py-3 rounded-xl shadow-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------
// Extra Components
// ---------------------------
function Preview({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-md font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

function FormField({ label, value, setValue, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        className="p-3 w-full rounded-xl border bg-white shadow-sm hover:bg-indigo-50/40 focus:ring-2 focus:ring-indigo-400"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
