// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import { getPreferredTimezone } from "../../lib/timezone";
// import LocationSelector from "../shared/LocationSelector";

// // Meeting Type Options
// const MEETING_TYPES = [
//   { label: "Introductory", color: "bg-blue-500" },
//   { label: "Product Demo", color: "bg-green-500" },
//   { label: "Support Call", color: "bg-orange-500" },
//   { label: "Strategy Call", color: "bg-purple-500" },
// ];

// // ⭐ MEETING MODE OPTIONS
// const MEETING_MODES = [
//   { label: "Google Meet", value: "google_meet" },
//   { label: "In-Person Meeting", value: "in_person" },
// ];

// type Slot = {
//   time: string; // "09:00"
//   iso?: string;
//   available: boolean | string | number | null | undefined;
// };

// function toBool(v: any) {
//   return v === true || v === "true" || v === 1 || v === "1";
// }

// export default function BookingForm({ userSub }: { userSub: string }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   // ⭐ MULTIPLE ATTENDEES ARRAY
//   const [attendees, setAttendees] = useState([""]);

//   const [title, setTitle] = useState("Intro Call");
//   const [date, setDate] = useState(""); // from <input type="date"> => YYYY-MM-DD
//   const [time, setTime] = useState("");
//   const [duration, setDuration] = useState(30);
//   const [message, setMessage] = useState("");
//   const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);

//   const [meetingMode, setMeetingMode] = useState(MEETING_MODES[0]);
//   const [location, setLocation] = useState("");

//   const [slots, setSlots] = useState<Slot[]>([]);
//   const [slotsLoading, setSlotsLoading] = useState(false);
//   const [slotsError, setSlotsError] = useState<string | null>(null);

//   // -----------------------------
//   // Fetch backend availability
//   // -----------------------------
//   useEffect(() => {
//     // reset time whenever date changes (prevents stale selection)
//     setTime("");

//     if (!date) {
//       setSlots([]);
//       setSlotsError(null);
//       return;
//     }

//     let cancelled = false;

//     async function loadSlots() {
//       try {
//         setSlotsLoading(true);
//         setSlotsError(null);

//         // Calendly-style: viewer tz is a UI preference (dashboard selector) persisted to DB.
//         // Fallback to browser timezone if not set.
//         const viewerTz = getPreferredTimezone();
//         const res = await fetch(
//           `https://api.slotly.io/bookings/availability?user_sub=${encodeURIComponent(
//             userSub
//           )}&date=${date}&tz=${encodeURIComponent(viewerTz)}`
//         );

//         if (!res.ok) {
//           const txt = await res.text().catch(() => "");
//           throw new Error(
//             `Availability API failed (${res.status}). ${
//               txt ? `Response: ${txt}` : ""
//             }`
//           );
//         }

//         const data = await res.json();
//         const incoming = Array.isArray(data?.slots) ? data.slots : [];

//         if (!cancelled) {
//           setSlots(incoming);
//         }
//       } catch (e: any) {
//         if (!cancelled) {
//           setSlots([]);
//           setSlotsError(e?.message || "Failed to load slots");
//         }
//       } finally {
//         if (!cancelled) setSlotsLoading(false);
//       }
//     }

//     loadSlots();

//     return () => {
//       cancelled = true;
//     };
//   }, [date, userSub]);

//   // -----------------------------
//   // Smart availability
//   // -----------------------------
//   const availabilityStatus = useMemo(() => {
//     if (!date || !time) return null;
//     const slot = slots.find((s) => s.time === time);
//     if (!slot) return null;

//     const ok = toBool(slot.available);

//     return ok
//       ? { text: "Available", color: "text-green-600", icon: "✔" }
//       : { text: "Unavailable", color: "text-red-600", icon: "⚠" };
//   }, [date, time, slots]);

//   // -----------------------------
//   // Meeting Link Preview
//   // -----------------------------
//   const meetingLink = useMemo(() => {
//     return `https://slotly.io/dashboard/book?user_sub=${encodeURIComponent(
//       userSub
//     )}`;
//   }, [userSub]);

//   // -----------------------------
//   // Add attendee
//   // -----------------------------
//   const addAttendee = () => setAttendees([...attendees, ""]);

//   const updateAttendee = (index: number, value: string) => {
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

//     const validAttendees = attendees.filter((a) => a.trim() !== "");
//     if (validAttendees.length === 0) {
//       setMessage("Please enter at least one attendee email.");
//       return;
//     }

//     if (meetingMode.value === "in_person" && location.trim().length < 10) {
//       setMessage(
//         "Please provide a complete in-person meeting location (full address)."
//       );
//       return;
//     }

//     // local date + time => Date => ISO (UTC). This can shift dates if backend assumes UTC.
//     const startISO = `${date}T${time}:00`;

//     try {
//       const res = await fetch(
//         `https://api.slotly.io/bookings/create?user_sub=${encodeURIComponent(
//           userSub
//         )}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             guest_name: name,
//             attendees: validAttendees,
//             start_iso: startISO,
//             title,
//             timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//             meeting_mode: meetingMode.value,
//             location: meetingMode.value === "in_person" ? location : null,
//           }),
//         }
//       );

//       if (!res.ok) {
//         setMessage("Error: " + (await res.text()));
//         return;
//       }

//       setMessage("Meeting created successfully!");
//     } catch (error: any) {
//       setMessage("Request failed: " + (error?.message || String(error)));
//     }
//   };

//   // -----------------------------
//   // UI
//   // -----------------------------
//   return (
//     <div className="min-h-screen w-full bg-gray-50 flex flex-col lg:flex-row">
//       {/* LEFT PREVIEW PANEL */}
//       <div className="w-full lg:w-[32%] bg-white border-b lg:border-b-0 lg:border-r shadow-sm lg:shadow-lg">
//         <div className="p-6 sm:p-8 lg:p-10 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
//           <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
//             Live Preview
//           </h2>

//           <div className="space-y-5 sm:space-y-6 bg-gray-50 rounded-xl p-5 sm:p-6 border shadow-inner">
//             <div>
//               <p className="text-xs text-gray-500 uppercase">Meeting Type</p>
//               <span
//                 className={`inline-block mt-2 px-3 py-1 text-sm text-white rounded-full ${meetingType.color}`}
//               >
//                 {meetingType.label}
//               </span>
//             </div>

//             <Preview
//               label="Meeting Mode"
//               value={
//                 meetingMode.value === "google_meet"
//                   ? "Google Meet (auto-generated)"
//                   : `In-Person: ${location || "—"}`
//               }
//             />

//             <Preview label="Meeting Title" value={title} />

//             {availabilityStatus && (
//               <div className="pt-1">
//                 <p className="text-xs text-gray-500 uppercase">Availability</p>
//                 <p
//                   className={`text-sm font-semibold flex items-center gap-2 mt-1 ${availabilityStatus.color}`}
//                 >
//                   {availabilityStatus.icon} {availabilityStatus.text}
//                 </p>
//               </div>
//             )}

//             <Preview label="Host" value={name || "—"} />
//             <Preview
//               label="Attendees"
//               value={attendees.filter((a) => a.trim() !== "").join(", ") || "—"}
//             />
//             <Preview label="Date" value={date || "—"} />
//             <Preview label="Time" value={time || "—"} />
//             <Preview label="Duration" value={`${duration} minutes`} />

//             {/* <div className="pt-2">
//               <p className="text-xs text-gray-500 uppercase">Meeting Link</p>
//               <p
//                 className="text-blue-600 underline text-sm mt-1"
//                 style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
//               >
//                 {meetingLink}
//               </p>
//             </div> */}
//           </div>
//         </div>
//       </div>

//       {/* RIGHT FORM PANEL */}
//       <div className="flex-1 p-6 sm:p-10 lg:p-14 overflow-y-auto">
//         <div className="max-w-5xl mx-auto">
//           <h1 className="text-2xl sm:text-3xl font-bold mb-1">
//             Create a Meeting
//           </h1>
//           <p className="text-gray-600 mb-8 sm:mb-10">
//             Add details below for your invite.
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
//             <FormField label="Your Name" value={name} setValue={setName} />
//             <FormField label="Your Email" value={email} setValue={setEmail} />
//             <FormField
//               label="Meeting Title"
//               value={title}
//               setValue={setTitle}
//             />

//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 Meeting Type
//               </label>
//               <select
//                 className="p-3 w-full rounded-xl border bg-white shadow-sm"
//                 onChange={(e) =>
//                   setMeetingType(
//                     MEETING_TYPES.find((t) => t.label === e.target.value) ??
//                       MEETING_TYPES[0]
//                   )
//                 }
//               >
//                 {MEETING_TYPES.map((t) => (
//                   <option key={t.label}>{t.label}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 Meeting Mode
//               </label>
//               <select
//                 className="p-3 w-full rounded-xl border bg-white shadow-sm"
//                 value={meetingMode.value}
//                 onChange={(e) =>
//                   setMeetingMode(
//                     MEETING_MODES.find((m) => m.value === e.target.value) ??
//                       MEETING_MODES[0]
//                   )
//                 }
//               >
//                 {MEETING_MODES.map((m) => (
//                   <option key={m.value} value={m.value}>
//                     {m.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {meetingMode.value === "in_person" && (
//               <div className="md:col-span-2">
//                 <LocationSelector value={location} onChange={setLocation} />
//               </div>
//             )}

//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-600 mb-1">
//                 Invitee Emails
//               </label>

//               <div className="space-y-3">
//                 {attendees.map((email, idx) => (
//                   <input
//                     key={idx}
//                     type="email"
//                     placeholder={`Invitee Email ${idx + 1}`}
//                     value={email}
//                     onChange={(e) => updateAttendee(idx, e.target.value)}
//                     className="p-3 w-full rounded-xl border bg-white shadow-sm"
//                   />
//                 ))}
//               </div>

//               <button
//                 type="button"
//                 onClick={addAttendee}
//                 className="mt-3 text-indigo-600 text-sm font-semibold hover:underline"
//               >
//                 + Add another attendee
//               </button>
//             </div>

//             <FormField label="Date" type="date" value={date} setValue={setDate} />

//             {/* Time Slot Selector */}
//             <div>
//               <label className="block text-sm text-gray-600 mb-1">
//                 Select Time
//               </label>

//               <div className="mt-2">
//                 {!date && (
//                   <p className="text-gray-500 text-sm">Select a date first</p>
//                 )}

//                 {date && slotsLoading && (
//                   <p className="text-gray-500 text-sm">Loading slots…</p>
//                 )}

//                 {date && !slotsLoading && slotsError && (
//                   <p className="text-red-600 text-sm">{slotsError}</p>
//                 )}

//                 {date && !slotsLoading && !slotsError && slots.length === 0 && (
//                   <p className="text-gray-500 text-sm">
//                     No slots returned for this date.
//                   </p>
//                 )}

//                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
//                   {slots.map((s) => {
//                     const ok = toBool(s.available);
//                     return (
//                       <button
//                         key={s.time}
//                         type="button"
//                         disabled={!ok}
//                         onClick={() => ok && setTime(s.time)}
//                         className={`
//                           py-2 px-2 text-center rounded-lg border text-sm font-medium
//                           transition
//                           ${
//                             ok
//                               ? "bg-white hover:bg-indigo-100 border-indigo-300"
//                               : "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
//                           }
//                           ${time === s.time ? "ring-2 ring-indigo-500" : ""}
//                         `}
//                       >
//                         {s.time}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm text-gray-600 mb-1">Duration</label>
//               <select
//                 className="p-3 w-full rounded-xl border bg-white shadow-sm"
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
//             type="button"
//             onClick={createBooking}
//             className="w-full max-w-xl mx-auto block mt-10 sm:mt-12 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-base sm:text-lg font-semibold shadow-lg"
//           >
//             Create Meeting
//           </button>

//           {message && (
//             <div className="mt-6 w-full max-w-xl mx-auto text-center text-indigo-700 bg-indigo-100 py-3 rounded-xl shadow-sm">
//               {message}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ---------------------------
// // Extra Components
// // ---------------------------
// function Preview({ label, value }: { label: string; value: any }) {
//   return (
//     <div>
//       <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
//       <p
//         className="text-sm sm:text-md font-semibold text-gray-800 mt-1"
//         style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// function FormField({
//   label,
//   value,
//   setValue,
//   type = "text",
// }: {
//   label: string;
//   value: string;
//   setValue: (v: string) => void;
//   type?: string;
// }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-600 mb-1">
//         {label}
//       </label>
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
// import { getPreferredTimezone } from "../../lib/timezone";
// import LocationSelector from "../shared/LocationSelector";

// /* ------------------ CONSTANTS ------------------ */

// const MEETING_TYPES = [
//   { label: "Introductory", color: "bg-blue-500" },
//   { label: "Product Demo", color: "bg-green-500" },
//   { label: "Support Call", color: "bg-orange-500" },
//   { label: "Strategy Call", color: "bg-purple-500" },
// ];

// const MEETING_MODES = [
//   { label: "Google Meet", value: "google_meet" },
//   { label: "In-Person Meeting", value: "in_person" },
// ];

// type Slot = {
//   time: string;
//   available: boolean | string | number | null | undefined;
// };

// const toBool = (v: any) => v === true || v === "true" || v === 1 || v === "1";

// /* ------------------ COMPONENT ------------------ */

// export default function BookingForm({ userSub }: { userSub: string }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   // const [attendees, setAttendees] = useState([""]);
//   const [attendees, setAttendees] = useState<string[]>([]);
//   const [attendeeInput, setAttendeeInput] = useState(""); // ✅ ADD THIS


//   const [title, setTitle] = useState("Intro Call");
//   const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);
//   const [meetingMode, setMeetingMode] = useState(MEETING_MODES[0]);
//   const [location, setLocation] = useState("");

//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [duration, setDuration] = useState(30);

//   const [slots, setSlots] = useState<Slot[]>([]);
//   const [slotsLoading, setSlotsLoading] = useState(false);
//   const [slotsError, setSlotsError] = useState<string | null>(null);

//   const [message, setMessage] = useState("");

//   /* ------------------ FETCH AVAILABILITY ------------------ */

//   useEffect(() => {
//     setTime("");

//     if (!date) {
//       setSlots([]);
//       setSlotsError(null);
//       return;
//     }

//     let cancelled = false;

//     async function loadSlots() {
//       try {
//         setSlotsLoading(true);
//         setSlotsError(null);

//         const tz = getPreferredTimezone();
//         const res = await fetch(
//           `https://api.slotly.io/bookings/availability?user_sub=${encodeURIComponent(
//             userSub
//           )}&date=${date}&tz=${encodeURIComponent(tz)}`
//         );

//         if (!res.ok) throw new Error("Failed to load availability");

//         const data = await res.json();
//         if (!cancelled) setSlots(Array.isArray(data?.slots) ? data.slots : []);
//       } catch (e: any) {
//         if (!cancelled) setSlotsError(e.message || "Unable to load slots");
//       } finally {
//         if (!cancelled) setSlotsLoading(false);
//       }
//     }

//     loadSlots();
//     return () => {
//       cancelled = true;
//     };
//   }, [date, userSub]);

//   /* ------------------ CREATE BOOKING ------------------ */

//   const createBooking = async () => {
//     setMessage("");

//     if (!date || !time) {
//       setMessage("Please select a date and time.");
//       return;
//     }

//     const validAttendees = attendees.filter((a) => a.trim());
//     if (!validAttendees.length) {
//       setMessage("Please enter at least one attendee email.");
//       return;
//     }

//     if (meetingMode.value === "in_person" && location.trim().length < 10) {
//       setMessage("Please provide a complete meeting address.");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `https://api.slotly.io/bookings/create?user_sub=${encodeURIComponent(
//           userSub
//         )}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             guest_name: name,
//             attendees: validAttendees,
//             start_iso: `${date}T${time}:00`,
//             title,
//             timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//             meeting_mode: meetingMode.value,
//             location: meetingMode.value === "in_person" ? location : null,
//           }),
//         }
//       );

//       if (!res.ok) throw new Error(await res.text());

//       setMessage("Meeting created successfully.");
//     } catch (e: any) {
//       setMessage(e.message || "Failed to create meeting.");
//     }
//   };

//   /* ------------------ UI ------------------ */

//   return (
//     <div className="flex flex-col lg:flex-row">
//       {/* LEFT PREVIEW */}
//       <aside className="lg:w-[32%] border-b lg:border-b-0 lg:border-r bg-white">
//         <div className="p-6 lg:p-8 lg:sticky lg:top-0 space-y-5">
//           <h2 className="text-lg font-semibold">Live preview</h2>

//           <Preview label="Meeting type">
//             <span
//               className={`inline-block px-3 py-1 text-sm text-white rounded-full ${meetingType.color}`}
//             >
//               {meetingType.label}
//             </span>
//           </Preview>

//           <Preview label="Title" value={title} />
//           <Preview label="Host" value={name || "—"} />
//           <Preview
//             label="Attendees"
//             value={attendees.filter(Boolean).join(", ") || "—"}
//           />
//           <Preview label="Date" value={date || "—"} />
//           <Preview label="Time" value={time || "—"} />
//           <Preview label="Duration" value={`${duration} minutes`} />
//         </div>
//       </aside>

//       {/* RIGHT FORM */}
//       <section className="flex-1 p-6 lg:p-10">
//         {/* <div className="max-w-3xl mx-auto space-y-10"> */}
//           <div className="max-w-3xl mx-auto space-y-6">

//           {/* SECTION 1 */}
//           <Section title="Meeting details">
//             {/* <Input label="Your name" value={name} setValue={setName} />
//             <Input label="Your email" value={email} setValue={setEmail} /> */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input label="Your name" value={name} setValue={setName} />
//               <Input label="Your email" value={email} setValue={setEmail} />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input label="Meeting title" value={title} setValue={setTitle} />
//               {/* <Select
//                 label="Meeting type"
//                 options={MEETING_TYPES.map((t) => t.label)}
//                 onChange={(v) =>
//                   setMeetingType(
//                     MEETING_TYPES.find((t) => t.label === v) || MEETING_TYPES[0]
//                   )
//                 }
//               /> */}
//               <Select
//                 label="Meeting mode"
//                 options={MEETING_MODES.map((m) => m.label)}
//                 onChange={(v) =>
//                   setMeetingMode(
//                     MEETING_MODES.find((m) => m.label === v) || MEETING_MODES[0]
//                   )
//                 }
//               />

//               {meetingMode.value === "in_person" && (
//                 <LocationSelector value={location} onChange={setLocation} />
//               )}
//             </div>

            

    
//           </Section>

//           {/* SECTION 2 */}
//           <Section title="Invite attendees">
//             <div className="border rounded-xl p-3 bg-white focus-within:ring-2 focus-within:ring-indigo-400">
//               <div className="flex flex-wrap gap-2">
//                 {/* EMAIL CHIPS */}
//                 {attendees.map((email, i) => (
//                   <span
//                     key={i}
//                     className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
//                   >
//                     {email}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setAttendees(attendees.filter((_, idx) => idx !== i))
//                       }
//                       className="text-indigo-500 hover:text-red-600 font-bold"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}

//                 {/* INPUT */}
//                 <input
//                   type="email"
//                   value={attendeeInput}
//                   placeholder={
//                     attendees.length === 0 ? "Add attendee emails" : ""
//                   }
//                   onChange={(e) => setAttendeeInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" || e.key === ",") {
//                       e.preventDefault();
//                       const email = attendeeInput.trim();

//                       if (
//                         email &&
//                         !attendees.includes(email)
//                       ) {
//                         setAttendees([...attendees, email]);
//                         setAttendeeInput("");
//                       }
//                     }

//                     // Backspace removes last chip
//                     if (
//                       e.key === "Backspace" &&
//                       attendeeInput === "" &&
//                       attendees.length > 0
//                     ) {
//                       setAttendees(attendees.slice(0, -1));
//                     }
//                   }}
//                   className="flex-1 min-w-[180px] outline-none text-sm px-2 py-1"
//                 />
//               </div>
//             </div>

//             <p className="text-xs text-gray-500 mt-2">
//               Press <b>Enter</b> or <b>,</b> to add multiple emails
//             </p>
//           </Section>


//           {/* SECTION 3 */}
          
//           <Section title="Date & time">
//             {/* DATE + DURATION (same row, same label group) */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* DATE */}
//               <Input
//                 type="date"
//                 label="Date"
//                 value={date}
//                 setValue={setDate}
//               />

//               {/* DURATION */}
//               <Select
//                 label="Duration"
//                 options={["15 minutes", "30 minutes", "60 minutes"]}
//                 value={`${duration} minutes`}
//                 onChange={(v) =>
//                   setDuration(parseInt(v.split(" ")[0], 10))
//                 }
//               />
//             </div>

//             {/* TIME */}
//             <div className="mt-4">
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Select time
//               </label>

//               {/* SELECTED TIME */}
//               {time && (
//                 <div className="mt-3 flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
//                   <div>
//                     <p className="text-xs text-gray-500">Selected time</p>
//                     <p className="text-sm font-semibold text-indigo-700">
//                       {time}
//                     </p>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => setTime("")}
//                     className="text-sm text-indigo-600 hover:underline font-medium"
//                   >
//                     Change
//                   </button>
//                 </div>
//               )}

//               {/* TIME SLOT PICKER */}
//               {!time && (
//                 <>
//                   {!date && (
//                     <div className="mt-2 text-sm text-gray-500 bg-gray-50 border border-dashed rounded-lg p-3">
//                       Select a date to view available time slots.
//                     </div>
//                   )}

//                   {date && slotsLoading && (
//                     <p className="mt-2 text-sm text-gray-500 animate-pulse">
//                       Loading available times…
//                     </p>
//                   )}

//                   {date && slotsError && (
//                     <p className="mt-2 text-sm text-red-600">
//                       {slotsError}
//                     </p>
//                   )}

//                   {date && !slotsLoading && !slotsError && slots.length === 0 && (
//                     <p className="mt-2 text-sm text-gray-500">
//                       No available time slots for this date.
//                     </p>
//                   )}

//                   {date && !slotsLoading && !slotsError && slots.length > 0 && (
//                     <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
//                       {slots.map((s) => {
//                         const ok = toBool(s.available);

//                         return (
//                           <button
//                             key={s.time}
//                             type="button"
//                             disabled={!ok}
//                             onClick={() => ok && setTime(s.time)}
//                             className={`
//                     py-2 rounded-lg text-sm font-medium border
//                     transition-all duration-150
//                     ${ok
//                                 ? "bg-white hover:bg-indigo-50 hover:border-indigo-400"
//                                 : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
//                               }
//                   `}
//                           >
//                             {s.time}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </Section>



//           {/* CTA */}
//           {/* <button
//             onClick={createBooking}
//             className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-lg"
//           >
//             Create meeting
//           </button> */}
//           <button
//             type="button"
//             onClick={createBooking}
//             className="
//     w-full max-w-xl mx-auto block
//     mt-10 sm:mt-12
//     py-4
//     rounded-xl
//     bg-indigo-600 hover:bg-indigo-700
//     text-white
//     text-base sm:text-lg
//     font-semibold
//     shadow-lg
//     transition
//   "
//           >
//             Create meeting
//           </button>


//           {message && (
//             <div className="text-center text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl py-3">
//               {message}
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// /* ------------------ HELPERS ------------------ */

// function Section({ title, children }: any) {
//   return (
//     <div className="space-y-3">
//       <h3 className="text-base font-semibold text-gray-900">
//         {title}
//       </h3>
//       <div className="space-y-3">{children}</div>
//     </div>
//   );
// }


// function Preview({ label, value, children }: any) {
//   return (
//     <div>
//       <p className="text-xs uppercase text-gray-500">{label}</p>
//       <div className="text-sm font-semibold mt-1">{children || value}</div>
//     </div>
//   );
// }

// function Input({ label, value, setValue, type = "text" }: any) {
//   return (
//     <div>
//       <label className="text-sm font-medium text-gray-600 mb-1 block">
//         {label}
//       </label>
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         className="w-full p-3 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
//       />
//     </div>
//   );
// }

// function Select({ label, options, onChange }: any) {
//   return (
//     <div>
//       <label className="text-sm font-medium text-gray-600 mb-1 block">
//         {label}
//       </label>
//       <select
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full p-3 rounded-xl border bg-white shadow-sm"
//       >
//         {options.map((o: string) => (
//           <option key={o}>{o}</option>
//         ))}
//       </select>
//     </div>
//   );
// }

// "use client";

// import React, { useState, useEffect } from "react";
// import { getPreferredTimezone } from "../../lib/timezone";
// import LocationSelector from "../shared/LocationSelector";

// /* ------------------ CONSTANTS ------------------ */

// const MEETING_TYPES = [
//   { label: "Introductory", color: "bg-blue-500" },
//   { label: "Product Demo", color: "bg-green-500" },
//   { label: "Support Call", color: "bg-orange-500" },
//   { label: "Strategy Call", color: "bg-purple-500" },
// ];

// const MEETING_MODES = [
//   { label: "Google Meet", value: "google_meet" },
//   { label: "In-Person Meeting", value: "in_person" },
// ];

// type Slot = {
//   time: string;
//   available: boolean | string | number | null | undefined;
// };

// const toBool = (v: any) => v === true || v === "true" || v === 1 || v === "1";

// /* ------------------ COMPONENT ------------------ */

// export default function BookingForm({ userSub }: { userSub: string }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   const [attendees, setAttendees] = useState<string[]>([]);
//   const [attendeeInput, setAttendeeInput] = useState("");

//   const [title, setTitle] = useState("Intro Call");
//   const [meetingType] = useState(MEETING_TYPES[0]);
//   const [meetingMode, setMeetingMode] = useState(MEETING_MODES[0]);
//   const [location, setLocation] = useState("");

//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [duration, setDuration] = useState(30);

//   const [slots, setSlots] = useState<Slot[]>([]);
//   const [slotsLoading, setSlotsLoading] = useState(false);
//   const [slotsError, setSlotsError] = useState<string | null>(null);

//   const [message, setMessage] = useState("");

//   /* ------------------ FETCH AVAILABILITY ------------------ */

//   useEffect(() => {
//     setTime("");

//     if (!date) {
//       setSlots([]);
//       setSlotsError(null);
//       return;
//     }

//     let cancelled = false;

//     async function loadSlots() {
//       try {
//         setSlotsLoading(true);
//         setSlotsError(null);

//         const tz = getPreferredTimezone();
//         const res = await fetch(
//           `https://api.slotly.io/bookings/availability?user_sub=${encodeURIComponent(
//             userSub
//           )}&date=${date}&tz=${encodeURIComponent(tz)}`
//         );

//         if (!res.ok) throw new Error("Failed to load availability");

//         const data = await res.json();
//         if (!cancelled) setSlots(Array.isArray(data?.slots) ? data.slots : []);
//       } catch (e: any) {
//         if (!cancelled) setSlotsError(e.message || "Unable to load slots");
//       } finally {
//         if (!cancelled) setSlotsLoading(false);
//       }
//     }

//     loadSlots();
//     return () => {
//       cancelled = true;
//     };
//   }, [date, userSub]);

//   /* ------------------ CREATE BOOKING ------------------ */

//   const createBooking = async () => {
//     setMessage("");

//     if (!date || !time) {
//       setMessage("Please select a date and time.");
//       return;
//     }

//     const validAttendees = attendees.filter((a) => a.trim());
//     if (!validAttendees.length) {
//       setMessage("Please enter at least one attendee email.");
//       return;
//     }

//     if (meetingMode.value === "in_person" && location.trim().length < 10) {
//       setMessage("Please provide a complete meeting address.");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `https://api.slotly.io/bookings/create?user_sub=${encodeURIComponent(
//           userSub
//         )}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             guest_name: name,
//             attendees: validAttendees,
//             start_iso: `${date}T${time}:00`,
//             title,
//             timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//             meeting_mode: meetingMode.value,
//             location: meetingMode.value === "in_person" ? location : null,
//           }),
//         }
//       );

//       if (!res.ok) throw new Error(await res.text());

//       setMessage("Meeting created successfully.");
//     } catch (e: any) {
//       setMessage(e.message || "Failed to create meeting.");
//     }
//   };

//   /* ------------------ UI ------------------ */

//   return (
//     <div className="flex flex-col lg:flex-row">
//       {/* LEFT PREVIEW */}
//       <aside className="lg:w-[32%] border-b lg:border-b-0 lg:border-r bg-white">
//         <div className="p-6 lg:p-8 lg:sticky lg:top-0 space-y-5">
//           <h2 className="text-lg font-semibold">Live preview</h2>

//           <Preview label="Meeting type">
//             <span
//               className={`inline-block px-3 py-1 text-sm text-white rounded-full ${meetingType.color}`}
//             >
//               {meetingType.label}
//             </span>
//           </Preview>

//           <Preview label="Title" value={title} />
//           <Preview label="Host" value={name || "—"} />
//           <Preview
//             label="Attendees"
//             value={attendees.filter(Boolean).join(", ") || "—"}
//           />
//           <Preview label="Date" value={date || "—"} />
//           <Preview label="Time" value={time || "—"} />
//           <Preview label="Duration" value={`${duration} minutes`} />
//         </div>
//       </aside>

//       {/* RIGHT FORM */}
//       <section className="flex-1 p-6 lg:p-10">
//         <div className="max-w-3xl mx-auto space-y-6">

//           {/* ✅ MESSAGE AT TOP */}
//           {message && (
//             <div className="fixed top-6 right-6 z-50">
//               <div
//                 className="
//         max-w-sm
//         bg-white
//         border border-indigo-200
//         text-indigo-700
//         px-5 py-3
//         rounded-xl
//         shadow-lg
//         animate-slide-in
//       "
//               >
//                 {message}
//               </div>
//             </div>
//           )}


//           {/* SECTION 1 */}
//           <Section title="Meeting details">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input label="Your name" value={name} setValue={setName} />
//               <Input label="Your email" value={email} setValue={setEmail} />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input label="Meeting title" value={title} setValue={setTitle} />
//               <Select
//                 label="Meeting mode"
//                 options={MEETING_MODES.map((m) => m.label)}
//                 onChange={(v) =>
//                   setMeetingMode(
//                     MEETING_MODES.find((m) => m.label === v) || MEETING_MODES[0]
//                   )
//                 }
//               />

//               {meetingMode.value === "in_person" && (
//                 <LocationSelector value={location} onChange={setLocation} />
//               )}
//             </div>
//           </Section>

//           {/* SECTION 2 */}
//           <Section title="Invite attendees">
//             <div className="border rounded-xl p-3 bg-white focus-within:ring-2 focus-within:ring-indigo-400">
//               <div className="flex flex-wrap gap-2">
//                 {attendees.map((email, i) => (
//                   <span
//                     key={i}
//                     className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
//                   >
//                     {email}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setAttendees(attendees.filter((_, idx) => idx !== i))
//                       }
//                       className="text-indigo-500 hover:text-red-600 font-bold"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}

//                 <input
//                   type="email"
//                   value={attendeeInput}
//                   placeholder={
//                     attendees.length === 0 ? "Add attendee emails" : ""
//                   }
//                   onChange={(e) => setAttendeeInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" || e.key === ",") {
//                       e.preventDefault();
//                       const email = attendeeInput.trim();
//                       if (email && !attendees.includes(email)) {
//                         setAttendees([...attendees, email]);
//                         setAttendeeInput("");
//                       }
//                     }

//                     if (
//                       e.key === "Backspace" &&
//                       attendeeInput === "" &&
//                       attendees.length > 0
//                     ) {
//                       setAttendees(attendees.slice(0, -1));
//                     }
//                   }}
//                   className="flex-1 min-w-[180px] outline-none text-sm px-2 py-1"
//                 />
//               </div>
//             </div>

//             <p className="text-xs text-gray-500 mt-2">
//               Press <b>Enter</b> or <b>,</b> to add multiple emails
//             </p>
//           </Section>

//           {/* SECTION 3 */}
//           <Section title="Date & time">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 type="date"
//                 label="Date"
//                 value={date}
//                 setValue={setDate}
//               />

//               <Select
//                 label="Duration"
//                 options={["15 minutes", "30 minutes", "60 minutes"]}
//                 value={`${duration} minutes`}
//                 onChange={(v) =>
//                   setDuration(parseInt(v.split(" ")[0], 10))
//                 }
//               />
//             </div>

            // <div className="mt-4">
            //   <label className="text-sm font-medium text-gray-700 mb-1 block">
            //     Select time
            //   </label>

            //   {time && (
            //     <div className="mt-3 flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
            //       <div>
            //         <p className="text-xs text-gray-500">Selected time</p>
            //         <p className="text-sm font-semibold text-indigo-700">
            //           {time}
            //         </p>
            //       </div>

            //       <button
            //         type="button"
            //         onClick={() => setTime("")}
            //         className="text-sm text-indigo-600 hover:underline font-medium"
            //       >
            //         Change
            //       </button>
            //     </div>
//               )}

//               {!time && (
//                 <>
//                   {!date && (
//                     <div className="mt-2 text-sm text-gray-500 bg-gray-50 border border-dashed rounded-lg p-3">
//                       Select a date to view available time slots.
//                     </div>
//                   )}

//                   {date && slotsLoading && (
//                     <p className="mt-2 text-sm text-gray-500 animate-pulse">
//                       Loading available times…
//                     </p>
//                   )}

//                   {date && slotsError && (
//                     <p className="mt-2 text-sm text-red-600">{slotsError}</p>
//                   )}

//                   {date &&
//                     !slotsLoading &&
//                     !slotsError &&
//                     slots.length === 0 && (
//                       <p className="mt-2 text-sm text-gray-500">
//                         No available time slots for this date.
//                       </p>
//                     )}

//                   {date &&
//                     !slotsLoading &&
//                     !slotsError &&
//                     slots.length > 0 && (
//                       <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
//                         {slots.map((s) => {
//                           const ok = toBool(s.available);

//                           return (
//                             <button
//                               key={s.time}
//                               type="button"
//                               disabled={!ok}
//                               onClick={() => ok && setTime(s.time)}
//                               className={`
//                                 py-2 rounded-lg text-sm font-medium border
//                                 transition-all duration-150
//                                 ${ok
//                                   ? "bg-white hover:bg-indigo-50 hover:border-indigo-400"
//                                   : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
//                                 }
//                               `}
//                             >
//                               {s.time}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     )}
//                 </>
//               )}
//             </div>
//           </Section>

//           {/* CTA */}
//           <button
//             type="button"
//             onClick={createBooking}
//             className="
//               w-full max-w-xl mx-auto block
//               mt-10 sm:mt-12
//               py-4 rounded-xl
//               bg-indigo-600 hover:bg-indigo-700
//               text-white text-base sm:text-lg
//               font-semibold shadow-lg transition
//             "
//           >
//             Create meeting
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// }

// /* ------------------ HELPERS ------------------ */

// function Section({ title, children }: any) {
//   return (
//     <div className="space-y-3">
//       <h3 className="text-base font-semibold text-gray-900">{title}</h3>
//       <div className="space-y-3">{children}</div>
//     </div>
//   );
// }

// function Preview({ label, value, children }: any) {
//   return (
//     <div>
//       <p className="text-xs uppercase text-gray-500">{label}</p>
//       <div className="text-sm font-semibold mt-1">{children || value}</div>
//     </div>
//   );
// }

// function Input({ label, value, setValue, type = "text" }: any) {
//   return (
//     <div>
//       <label className="text-sm font-medium text-gray-600 mb-1 block">
//         {label}
//       </label>
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         className="w-full p-3 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
//       />
//     </div>
//   );
// }

// function Select({ label, options, onChange }: any) {
//   return (
//     <div>
//       <label className="text-sm font-medium text-gray-600 mb-1 block">
//         {label}
//       </label>
//       <select
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full p-3 rounded-xl border bg-white shadow-sm"
//       >
//         {options.map((o: string) => (
//           <option key={o}>{o}</option>
//         ))}
//       </select>
//     </div>
//   );
// }



"use client";
import { useRouter } from "next/navigation";

import React, { useState, useEffect } from "react";
import { getPreferredTimezone } from "../../lib/timezone";
import LocationSelector from "../shared/LocationSelector";
import StatusModal from "../shared/StatusModal";

/* ------------------ CONSTANTS ------------------ */

const MEETING_TYPES = [
  { label: "Introductory", color: "bg-blue-500" },
  { label: "Product Demo", color: "bg-green-500" },
  { label: "Support Call", color: "bg-orange-500" },
  { label: "Strategy Call", color: "bg-purple-500" },
];

const MEETING_MODES = [
  { label: "Google Meet", value: "google_meet" },
  { label: "In-Person Meeting", value: "in_person" },
];

type Slot = {
  time: string;
  available: boolean | string | number | null | undefined;
};

const toBool = (v: any) => v === true || v === "true" || v === 1 || v === "1";

/* ------------------ COMPONENT ------------------ */

export default function BookingForm({ userSub }: { userSub: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
 

  const [attendees, setAttendees] = useState<string[]>([]);
  const [attendeeInput, setAttendeeInput] = useState("");
  const [slotsFetched, setSlotsFetched] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("Intro Call");
  const [meetingType] = useState(MEETING_TYPES[0]);
  const [meetingMode, setMeetingMode] = useState(MEETING_MODES[0]);
  const [location, setLocation] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const router = useRouter();
  const [showStatus, setShowStatus] = useState(false);
  const [statusType, setStatusType] = useState<"success" | "error">("success");



  /* ------------------ SCROLL TO TOP ------------------ */

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ------------------ AUTO HIDE MESSAGE ------------------ */

  // useEffect(() => {
  //   if (!message) return;
  //   const timer = setTimeout(() => setMessage(""), 4000);
  //   return () => clearTimeout(timer);
  // }, [message]);

  /* ------------------ FETCH AVAILABILITY ------------------ */
  useEffect(() => {
    setTime("");
    setSlotsFetched(false);

    if (!date || !userSub) {
      setSlots([]);
      setSlotsError(null);
      return;
    }

    let cancelled = false;

    async function loadSlots() {
      try {
        setSlotsLoading(true);
        setSlotsError(null);

        const tz = getPreferredTimezone();
        const res = await fetch(
          `https://api.slotly.io/bookings/availability?user_sub=${encodeURIComponent(
            userSub
          )}&date=${date}&duration=${duration}&tz=${encodeURIComponent(tz)}`
        );

        if (!res.ok) throw new Error("Failed to load availability");

        const data = await res.json();
        if (!cancelled) {
          setSlots(Array.isArray(data?.slots) ? data.slots : []);
          setSlotsFetched(true);
        }
      } catch {
        if (!cancelled) {
          setSlots([]);
          setSlotsFetched(true);
        }
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    }

    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [date, userSub, duration]); // ✅ ADD duration



  /* ------------------ CREATE BOOKING ------------------ */

  // const createBooking = async () => {
  //   scrollToTop();

  //   if (!date || !time) {
  //     setMessage("Please select a date and time.");
  //     return;
  //   }

  //   const validAttendees = attendees.filter((a) => a.trim());
  //   if (!validAttendees.length) {
  //     setMessage("Please enter at least one attendee email.");
  //     return;
  //   }

  //   if (meetingMode.value === "in_person" && location.trim().length < 10) {
  //     setMessage("Please provide a complete meeting address.");
  //     return;
  //   }

  

  //   try {
  //     const res = await fetch(
  //       `https://api.slotly.io/bookings/create?user_sub=${encodeURIComponent(
  //         userSub
  //       )}`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           guest_name: name,
  //           attendees: validAttendees,
  //           start_iso: `${date}T${time}:00`,
  //           title,
  //           timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //           meeting_mode: meetingMode.value,
  //           location: meetingMode.value === "in_person" ? location : null,
  //         }),
  //       }
  //     );
  //     if (!res.ok) throw new Error(await res.text());

  //     // success
  //     setStatusType("success");
  //     setShowStatus(true);


  //     setTimeout(() => {
  //       router.replace("/dashboard");
  //     }, 1000);


  //   } catch (e: any) {
  //     setStatusType("error");
  //     setShowStatus(true);
  //     setTime(""); // reset slot if fa
  //     // iled
  //     setMessage(
  //       String(e.message).includes("already booked")
  //         ? "This time was just booked. Please choose another slot."
  //         : "Failed to create meeting."
  //     );
  //   }
  // };
  // const createBooking = async () => {
  //   scrollToTop();

  //   if (!date || !time) return;
  //   if (!attendees.length) return;
  //   if (meetingMode.value === "in_person" && location.trim().length < 10) return;

  //   try {
  //     const res = await fetch(
  //       `https://api.slotly.io/bookings/create?user_sub=${encodeURIComponent(
  //         userSub
  //       )}`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           guest_name: name,
  //           attendees,
  //           start_iso: `${date}T${time}:00`,
  //           title,
  //           timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //           meeting_mode: meetingMode.value,
  //           location: meetingMode.value === "in_person" ? location : null,
  //         }),
  //       }
  //     );

  //     if (!res.ok) throw new Error();

  //     setStatusType("success");
  //     setShowStatus(true);

  //   } catch {
  //     setStatusType("error");
  //     setShowStatus(true);
  //     setTime("");
  //   }
  // };

  const createBooking = async () => {
    scrollToTop();

    // ---------------- VALIDATION ----------------

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    if (!date) {
      setMessage("Please select a date.");
      return;
    }

    if (!time) {
      setMessage("Please select a time slot.");
      return;
    }

    if (!attendees.length) {
      setMessage("Please add at least one attendee.");
      return;
    }

    if (meetingMode.value === "in_person" && location.trim().length < 10) {
      setMessage("Please enter complete meeting address.");
      return;
    }

    // Clear old message
    setMessage("");

    // ---------------- OPEN MODAL IMMEDIATELY ----------------

    setStatusType("success");
    setShowStatus(true);
    try {
      const res = await fetch(
        `https://api.slotly.io/bookings/create?user_sub=${encodeURIComponent(userSub)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guest_name: name,
            attendees,
            start_iso: `${date}T${time}:00`,
            title,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            meeting_mode: meetingMode.value,
            location:
              meetingMode.value === "in_person" ? location : null,
          }),
        }
      );

      if (!res.ok) throw new Error();

    } catch {
      setStatusType("error");
      setShowStatus(true);
      setTime("");
    }
  };





  /* ------------------ UI ------------------ */

  return (
    <div className="flex flex-col lg:flex-row">
      <StatusModal
        open={showStatus}
        type={statusType}
        onClose={() => router.replace("/dashboard")}
      />
      {message && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl shadow-lg">
            {message}
          </div>
        </div>
      )}


    
      {/* LEFT PREVIEW */}
      <aside className="lg:w-[32%] border-b lg:border-b-0 lg:border-r bg-white">
        <div className="p-6 lg:p-8 lg:sticky lg:top-0 space-y-5">
          <h2 className="text-lg font-semibold">Live preview</h2>

          <Preview label="Meeting type">
            <span
              className={`inline-block px-3 py-1 text-sm text-white rounded-full ${meetingType.color}`}
            >
              {meetingType.label}
            </span>
          </Preview>

          <Preview label="Title" value={title} />
          <Preview label="Host" value={name || "—"} />
          <Preview
            label="Attendees"
            value={attendees.filter(Boolean).join(", ") || "—"}
          />
          <Preview label="Date" value={date || "—"} />
          <Preview label="Time" value={time || "—"} />
          <Preview label="Duration" value={`${duration} minutes`} />
        </div>
      </aside>

      {/* RIGHT FORM */}
      <section className="flex-1 p-6 lg:p-10">
        <div className="max-w-3xl mx-auto space-y-6">

          <Section title="Meeting details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Your name" value={name} setValue={setName} />
              <Input label="Your email" value={email} setValue={setEmail} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Meeting title" value={title} setValue={setTitle} />
              <Select
                label="Meeting mode"
                options={MEETING_MODES.map((m) => m.label)}
                onChange={(v: string) =>
  setMeetingMode(
    MEETING_MODES.find((m) => m.label === v) || MEETING_MODES[0]
  )
}

              />

              {meetingMode.value === "in_person" && (
                <LocationSelector value={location} onChange={setLocation} />
              )}
            </div>
          </Section>

          <Section title="Invite attendees">
            <div className="border rounded-xl p-3 bg-white focus-within:ring-2 focus-within:ring-indigo-400">
              <div className="flex flex-wrap gap-2">
                {attendees.map((email, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() =>
                        setAttendees(attendees.filter((_, idx) => idx !== i))
                      }
                      className="text-indigo-500 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  type="email"
                  value={attendeeInput}
                  placeholder={
                    attendees.length === 0 ? "Add attendee emails" : ""
                  }
                  onChange={(e) => setAttendeeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const email = attendeeInput.trim();
                      if (email && !attendees.includes(email)) {
                        setAttendees([...attendees, email]);
                        setAttendeeInput("");
                      }
                    }
                    if (
                      e.key === "Backspace" &&
                      attendeeInput === "" &&
                      attendees.length > 0
                    ) {
                      setAttendees(attendees.slice(0, -1));
                    }
                  }}
                  className="flex-1 min-w-[180px] outline-none text-sm px-2 py-1"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Press <b>Enter</b> or <b>,</b> to add multiple emails
            </p>
          </Section>

          <Section title="Date & time">
            {/* DATE + DURATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Date"
                value={date}
                setValue={setDate}
              />

              <Select
                label="Duration"
                options={["15 minutes", "30 minutes", "60 minutes"]}
                value={`${duration} minutes`}
                onChange={(v: string) =>
  setDuration(parseInt(v.split(" ")[0], 10))
}

              />
            </div>

            {/* TIME */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Select time
              </label>

              {/* ✅ SELECTED TIME CARD */}
              {time && (
                <div className="mt-3 flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-500">Selected time</p>
                    <p className="text-sm font-semibold text-indigo-700">
                      {time}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTime("")}
                    className="text-sm text-indigo-600 hover:underline font-medium"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* ✅ TIME SLOTS */}
              {!time && (
                <>
                  {!date && (
                    <div className="mt-2 text-sm text-gray-500 bg-gray-50 border border-dashed rounded-lg p-3">
                      Select a date to view available time slots.
                    </div>
                  )}

                  {date && slotsLoading && (
                    <p className="mt-2 text-sm text-gray-500 animate-pulse">
                      Loading available times…
                    </p>
                  )}

                  {date && slotsError && (
                    <p className="mt-2 text-sm text-red-600">
                      {slotsError}
                    </p>
                  )}

                  {date && slotsFetched && !slotsLoading && !slotsError && slots.length === 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      No available time slots for this date.
                    </p>
                  )}


                  {date && !slotsLoading && !slotsError && slots.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                      {slots.map((s) => {
                        const ok = toBool(s.available);

                        return (
                          <button
                            key={s.time}
                            type="button"
                            disabled={!ok}
                            onClick={() => ok && setTime(s.time)}
                            className={`
                    py-2 rounded-lg text-sm font-medium border
                    transition-all duration-150
                    ${ok
                                ? "bg-white hover:bg-indigo-50 hover:border-indigo-400"
                                : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              }
                  `}
                          >
                            {s.time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </Section>


          <button
            type="button"
            onClick={createBooking}
            className="w-full max-w-xl mx-auto block mt-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg"
          >
            Create meeting
          </button>
        </div>
      </section>
    </div>
  );
}

/* ------------------ HELPERS ------------------ */

function Section({ title, children }: any) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Preview({ label, value, children }: any) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <div className="text-sm font-semibold mt-1">{children || value}</div>
    </div>
  );
}

function Input({ label, value, setValue, type = "text" }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}

function Select({ label, options, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        {label}
      </label>
      <select
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl border bg-white shadow-sm"
      >
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}