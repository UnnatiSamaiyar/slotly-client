// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Plus,
//   MapPin,
//   Video,
//   X,
//   UploadCloud,
//   Image as ImageIcon,
//   CheckCircle2,
// } from "lucide-react";
// import AvailabilityEditorModal from "../Schedule/AvailabilityEditorModal";
// import TimezonePicker from "../TimezonePicker";
// import { getBrowserTimezone, getPreferredTimezone } from "@/lib/timezone";
// import { getMe, uploadBrandLogo } from "@/lib/userApi";
// import BookingForm from "@/components/booking/BookingForm";
// type MeetingMode = "google_meet" | "in_person";

// export default function CreateEventTypeModal({
//   open,
//   onClose,
//   onCreate,
//   userSub,
// }: {
//   open: boolean;
//   onClose: () => void;
//   onCreate: (payload: {
//     title: string;
//     meeting_mode: MeetingMode;
//     location?: string;
//     availability_json?: string;
//     duration_minutes?: number;
//     timezone?: string | null;
//     brand_logo_url?: string | null;
//   }) => Promise<void>;
//   userSub: string | null;
// }) {
//   const [title, setTitle] = useState("");
//   const [meetingMode, setMeetingMode] =
//     useState<MeetingMode>("google_meet");
//   const [location, setLocation] = useState("");
//   const [durationMinutes, setDurationMinutes] = useState<number>(15);
//   const [timezone, setTimezone] = useState<string>(
//     () => getPreferredTimezone() || getBrowserTimezone()
//   );
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isPublic, setIsPublic] = useState(true);
//   const [existingLogoUrl, setExistingLogoUrl] =
//     useState<string | null>(null);
//   const [logoUrl, setLogoUrl] = useState<string | null>(null);
//   const [logoUploading, setLogoUploading] = useState(false);

//   const [availabilityJson, setAvailabilityJson] = useState<string>("{}");
//   const [availabilityOpen, setAvailabilityOpen] = useState(false);

//   const needsLocation = meetingMode === "in_person";

//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const apiBase =
//     process.env.NEXT_PUBLIC_API_BASE || "https://api.slotly.io";

//   useEffect(() => {
//     if (!open) return;
//     setError(null);
//     setTitle("");
//     setMeetingMode("google_meet");
//     setLocation("");
//     setDurationMinutes(15);
//     setTimezone(getPreferredTimezone() || getBrowserTimezone());
//     setAvailabilityJson("{}");
//     setAvailabilityOpen(false);
//     setSaving(false);
//     setExistingLogoUrl(null);
//     setLogoUrl(null);
//     setLogoUploading(false);
//   }, [open]);

//   useEffect(() => {
//     if (!open || !userSub) return;
//     (async () => {
//       try {
//         const me = await getMe();
//         setExistingLogoUrl(me?.brand_logo_url || null);
//       } catch { }
//     })();
//   }, [open, userSub]);

//   const icon = useMemo(
//     () =>
//       meetingMode === "google_meet" ? (
//         <Video className="w-5 h-5" />
//       ) : (
//         <MapPin className="w-5 h-5" />
//       ),
//     [meetingMode]
//   );

//   const effectiveLogo = logoUrl || existingLogoUrl || null;

//   const logoSrc = useMemo(() => {
//     if (!effectiveLogo) return null;
//     if (effectiveLogo.startsWith("http")) return effectiveLogo;
//     if (effectiveLogo.startsWith("/"))
//       return `${apiBase}${effectiveLogo}`;
//     return `${apiBase}/${effectiveLogo}`;
//   }, [effectiveLogo, apiBase]);

//   const availabilityMeta = useMemo(() => {
//     const len = String(availabilityJson || "{}").length;
//     const isSet = availabilityJson && availabilityJson !== "{}" && len > 2;
//     return { len, isSet };
//   }, [availabilityJson]);
//   const [mode, setMode] = useState<"event_type" | "new_event">("event_type");
//   async function submit(e?: React.FormEvent) {
//     if (e) e.preventDefault();
//     setError(null);

//     const cleanTitle = title.trim();
//     const cleanLocation = location.trim();

//     if (!cleanTitle) {
//       setError("Title is required");
//       return;
//     }
//     if (needsLocation && !cleanLocation) {
//       setError("Location is required for in-person meeting");
//       return;
//     }

//     setSaving(true);
//     try {
//       await onCreate({
//         title: cleanTitle,
//         meeting_mode: meetingMode,
//         location: needsLocation ? cleanLocation : "",
//         availability_json: availabilityJson,
//         duration_minutes: durationMinutes,
//         timezone,
//         brand_logo_url: logoUrl || existingLogoUrl || null,
//       });
//       onClose();
//     } catch (err: any) {
//       setError(err?.message || String(err));
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (!open) return null;

//   return (
//     <AnimatePresence>
//       <div className="fixed inset-0 z-50">
//         {/* Backdrop */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="absolute inset-0 bg-black/40"
//           onClick={onClose}
//         />

//         {/* Modal */}
//         <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6">
//           <motion.div
//             initial={{ opacity: 0, y: 18, scale: 0.99 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 18, scale: 0.99 }}
//             transition={{ type: "spring", stiffness: 380, damping: 30 }}
//             className="relative w-full sm:max-w-[720px] bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl 
//                        max-h-[95dvh] flex flex-col overflow-hidden"
//           >
//             {/* Header */}
//             <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b bg-white">
//               <div className="flex items-start gap-4">
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
//                   <Plus className="w-5 h-5" />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <div className="flex items-center justify-between">

//                     {/* LEFT: Title */}
//                     <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
//                       Create Event
//                     </h2>

//                     {/* RIGHT: Toggle + Close */}
//                     <div className="flex items-center gap-4">

//                       {/* Segmented Toggle */}
//                       <div className="flex bg-slate-100 rounded-full p-1">

//                         <button
//                           type="button"
//                           onClick={() => setIsPublic(false)}
//                           className={`px-4 py-1.5 text-sm rounded-full transition ${!isPublic
//                               ? "bg-white shadow font-medium text-slate-900"
//                               : "text-slate-500"
//                             }`}
//                         >
//                           Private
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() => setIsPublic(true)}
//                           className={`px-4 py-1.5 text-sm rounded-full transition ${isPublic
//                               ? "bg-white shadow font-medium text-slate-900"
//                               : "text-slate-500"
//                             }`}
//                         >
//                           Public
//                         </button>

//                       </div>

//                       {/* Close Button */}
//                       <button
//                         type="button"
//                         onClick={onClose}
//                         className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600"
//                       >
//                         <X className="w-5 h-5" />
//                       </button>

//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* BODY */}
//             <form
//               onSubmit={submit}
//               className="flex-1 overflow-y-auto"
//             >

//               <AnimatePresence mode="wait">
//                 {isPublic ? (

//                   <motion.div
//                     key="public"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                   >

//                     <div className="px-5 sm:px-6 py-5 sm:py-6">
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

//                         {/* LEFT */}
//                         <div className="space-y-4">
//                           {/* ---- YOUR LEFT CODE UNCHANGED ---- */}

//                           <div>
//                             <label className="text-xs font-medium text-slate-600">
//                               Title
//                             </label>
//                             <input
//                               value={title}
//                               onChange={(e) => setTitle(e.target.value)}
//                               className="mt-1 w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-200"
//                               placeholder="e.g. Intro Call"
//                             />
//                           </div>

//                           <div>
//                             <label className="text-xs font-medium text-slate-600">
//                               Meeting type
//                             </label>
//                             <div className="mt-1 flex items-center gap-2">
//                               <div className="w-11 h-11 rounded-xl border flex items-center justify-center">
//                                 {icon}
//                               </div>
//                               <select
//                                 value={meetingMode}
//                                 onChange={(e) =>
//                                   setMeetingMode(
//                                     e.target.value as MeetingMode
//                                   )
//                                 }
//                                 className="w-full px-3.5 py-2.5 border rounded-xl"
//                               >
//                                 <option value="google_meet">
//                                   Google Meet
//                                 </option>
//                                 <option value="in_person">
//                                   In-person meeting
//                                 </option>
//                               </select>
//                             </div>
//                           </div>

//                           <div>
//                             <label className="text-xs font-medium text-slate-600">
//                               Duration
//                             </label>
//                             <select
//                               value={durationMinutes}
//                               onChange={(e) =>
//                                 setDurationMinutes(
//                                   Number(e.target.value)
//                                 )
//                               }
//                               className="mt-1 w-full px-3.5 py-2.5 border rounded-xl"
//                             >
//                               {[5, 10, 15, 20, 30, 45, 60, 90, 120].map(m => (
//                                 <option key={m} value={m}>
//                                   {m} minutes
//                                 </option>
//                               ))}
//                             </select>
//                           </div>

//                           <TimezonePicker
//                             value={timezone}
//                             onChange={setTimezone}
//                             label="Event timezone"
//                             openDirection="up"   // ✅ add this
//                           />

//                           {needsLocation && (
//                             <div>
//                               <label className="text-xs font-medium text-slate-600">
//                                 Location
//                               </label>
//                               <input
//                                 value={location}
//                                 onChange={(e) =>
//                                   setLocation(e.target.value)
//                                 }
//                                 className="mt-1 w-full px-3.5 py-2.5 border rounded-xl"
//                               />
//                             </div>
//                           )}
//                         </div>

//                         {/* RIGHT */}
//                         <div className="space-y-6">

//                           {/* ---- YOUR RIGHT CODE UNCHANGED ---- */}

//                           <div className="rounded-2xl border p-5 bg-white">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <div className="text-sm font-semibold">Brand logo</div>
//                                 <div className="text-xs text-slate-500">
//                                   Displayed on booking page
//                                 </div>
//                               </div>

//                               {effectiveLogo && (
//                                 <span className="text-xs font-medium text-emerald-600">
//                                   Saved
//                                 </span>
//                               )}
//                             </div>

//                             <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
//                               <div className="h-14 w-full sm:w-40 flex items-center justify-center rounded-xl border bg-slate-50">
//                                 {logoSrc ? (
//                                   <img
//                                     src={logoSrc}
//                                     className="max-h-10 max-w-[120px] object-contain"
//                                   />
//                                 ) : (
//                                   <ImageIcon className="w-5 h-5 text-slate-300" />
//                                 )}
//                               </div>

//                               <button
//                                 type="button"
//                                 onClick={() => fileInputRef.current?.click()}
//                                 className="h-10 px-4 rounded-lg bg-slate-900 text-white whitespace-nowrap shrink-0"
//                               >
//                                 Upload logo
//                               </button>
//                             </div>

//                             <input
//                               ref={fileInputRef}
//                               type="file"
//                               accept="image/*"
//                               className="hidden"
//                               onChange={async (e) => {
//                                 const f = e.target.files?.[0];
//                                 if (!f) return;
//                                 setLogoUploading(true);
//                                 try {
//                                   const url = await uploadBrandLogo(f);
//                                   setLogoUrl(url);
//                                 } catch {
//                                   setError("Failed to upload logo");
//                                 } finally {
//                                   setLogoUploading(false);
//                                 }
//                               }}
//                             />
//                           </div>

//                           {/* Availability and error remain same */}
//                           {/* AVAILABILITY */}
//                           <div className="rounded-2xl border p-5">
//                             <div className="flex justify-between">
//                               <div>
//                                 <div className="text-sm font-semibold">
//                                   Availability
//                                 </div>
//                                 <div className="text-xs text-slate-500">
//                                   When guests can book
//                                 </div>
//                               </div>
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   setAvailabilityOpen(true)
//                                 }
//                                 className="h-10 px-4 rounded-lg bg-slate-900 text-white"
//                               >
//                                 {availabilityMeta.isSet
//                                   ? "Edit"
//                                   : "Set"}
//                               </button>
//                             </div>

//                             <div className="mt-3 flex items-center gap-2 text-sm">
//                               {availabilityMeta.isSet ? (
//                                 <>
//                                   <CheckCircle2 className="w-4 h-4 text-emerald-600" />
//                                   Availability configured
//                                 </>
//                               ) : (
//                                 <span className="text-slate-500">
//                                   No availability set
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           {error && (
//                             <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 rounded-xl">
//                               {error}
//                             </div>
//                           )}
//                         </div>

//                       </div>
//                     </div>

//                   </motion.div>

//                 ) : (

//                   <motion.div
//                     key="private"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="p-6"
//                   >
//                     <BookingForm userSub={userSub!} />
//                   </motion.div>

//                 )}
//               </AnimatePresence>

//               {/* FOOTER ONLY FOR PUBLIC */}
//               {isPublic && (
//                 <div className="px-5 sm:px-6 py-4 border-t flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
//                   <button
//                     type="button"
//                     onClick={onClose}
//                     className="px-4 py-2 rounded-xl border"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={saving || logoUploading}
//                     className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
//                   >
//                     {saving ? "Creating…" : "Create"}
//                   </button>
//                 </div>
//               )}

//             </form>
//           </motion.div>
//         </div>

//         <AvailabilityEditorModal
//           open={availabilityOpen}
//           initialAvailabilityJson={
//             availabilityJson !== "{}"
//               ? availabilityJson
//               : null
//           }
//           onClose={() => setAvailabilityOpen(false)}
//           onSave={(json) => {
//             setAvailabilityJson(json || "{}");
//             setAvailabilityOpen(false);
//           }}
//         />
//       </div>
//     </AnimatePresence>
//   );
// }

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MapPin,
  Video,
  X,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import AvailabilityEditorModal from "../Schedule/AvailabilityEditorModal";
import TimezonePicker from "../TimezonePicker";
import { getBrowserTimezone, getPreferredTimezone } from "@/lib/timezone";
import { getMe, uploadBrandLogo } from "@/lib/userApi";
import BookingForm from "@/components/booking/BookingForm";

type MeetingMode = "google_meet" | "in_person";

export default function CreateEventTypeModal({
  open,
  onClose,
  onCreate,
  userSub,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: {
    title: string;
    meeting_mode: MeetingMode;
    location?: string;
    availability_json?: string;
    duration_minutes?: number;
    timezone?: string | null;
    brand_logo_url?: string | null;
  }) => Promise<void>;
  userSub: string | null;
}) {
  const [title, setTitle] = useState("");
  const [meetingMode, setMeetingMode] = useState<MeetingMode>("google_meet");
  const [location, setLocation] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [timezone, setTimezone] = useState<string>(() => getPreferredTimezone() || getBrowserTimezone());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  const [availabilityJson, setAvailabilityJson] = useState<string>("{}");
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const needsLocation = meetingMode === "in_person";

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "https://api.slotly.io";

  useEffect(() => {
    if (!open) return;
    setError(null);
    setTitle("");
    setMeetingMode("google_meet");
    setLocation("");
    setDurationMinutes(15);
    setTimezone(getPreferredTimezone() || getBrowserTimezone());
    setAvailabilityJson("{}");
    setAvailabilityOpen(false);
    setSaving(false);
    setExistingLogoUrl(null);
    setLogoUrl(null);
    setLogoUploading(false);
    setIsPublic(true);
  }, [open]);

  useEffect(() => {
    if (!open || !userSub) return;
    (async () => {
      try {
        const me = await getMe();
        setExistingLogoUrl(me?.brand_logo_url || null);
      } catch { }
    })();
  }, [open, userSub]);

  const icon = useMemo(
    () => (meetingMode === "google_meet" ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />),
    [meetingMode]
  );

  const effectiveLogo = logoUrl || existingLogoUrl || null;

  const logoSrc = useMemo(() => {
    if (!effectiveLogo) return null;
    if (effectiveLogo.startsWith("http")) return effectiveLogo;
    if (effectiveLogo.startsWith("/")) return `${apiBase}${effectiveLogo}`;
    return `${apiBase}/${effectiveLogo}`;
  }, [effectiveLogo, apiBase]);

  const availabilityMeta = useMemo(() => {
    const len = String(availabilityJson || "{}").length;
    const isSet = availabilityJson && availabilityJson !== "{}" && len > 2;
    return { len, isSet };
  }, [availabilityJson]);

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    const cleanLocation = location.trim();

    if (!cleanTitle) {
      setError("Title is required");
      return;
    }
    if (needsLocation && !cleanLocation) {
      setError("Location is required for in-person meeting");
      return;
    }

    setSaving(true);
    try {
      await onCreate({
        title: cleanTitle,
        meeting_mode: meetingMode,
        location: needsLocation ? cleanLocation : "",
        availability_json: availabilityJson,
        duration_minutes: durationMinutes,
        timezone,
        brand_logo_url: logoUrl || existingLogoUrl || null,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />

        {/* Modal shell */}
        <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="
              relative w-full
              sm:max-w-[720px] lg:max-w-[860px] 2xl:max-w-[980px]
              bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl
              max-h-[100dvh] sm:max-h-[95dvh]
              flex flex-col overflow-hidden
            "
          >
            {/* Header */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b bg-white">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Title */}
                    <h2 className="text-base sm:text-xl font-semibold text-slate-900">
                      Create Event
                    </h2>

                    {/* Toggle + Close */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      {/* Segmented Toggle */}
                      <div className="flex bg-slate-100 rounded-full p-1 w-fit">
                        <button
                          type="button"
                          onClick={() => setIsPublic(false)}
                          className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full transition ${!isPublic ? "bg-white shadow font-medium text-slate-900" : "text-slate-500"
                            }`}
                        >
                          Private
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsPublic(true)}
                          className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full transition ${isPublic ? "bg-white shadow font-medium text-slate-900" : "text-slate-500"
                            }`}
                        >
                          Public
                        </button>
                      </div>

                      {/* Close */}
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BODY */}
            <form onSubmit={submit} className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {isPublic ? (
                  <motion.div
                    key="public"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 sm:px-6 py-4 sm:py-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                        {/* LEFT */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-medium text-slate-600">Title</label>
                            <input
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="mt-1 w-full h-11 px-3.5 border rounded-xl focus:ring-2 focus:ring-blue-200 outline-none"
                              placeholder="e.g. Intro Call"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-slate-600">Meeting type</label>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0">
                                {icon}
                              </div>
                              <select
                                value={meetingMode}
                                onChange={(e) => setMeetingMode(e.target.value as MeetingMode)}
                                className="w-full h-11 px-3.5 border rounded-xl outline-none"
                              >
                                <option value="google_meet">Google Meet</option>
                                <option value="in_person">In-person meeting</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-medium text-slate-600">Duration</label>
                            <select
                              value={durationMinutes}
                              onChange={(e) => setDurationMinutes(Number(e.target.value))}
                              className="mt-1 w-full h-11 px-3.5 border rounded-xl outline-none"
                            >
                              {[5, 10, 15, 20, 30, 45, 60, 90, 120].map((m) => (
                                <option key={m} value={m}>
                                  {m} minutes
                                </option>
                              ))}
                            </select>
                          </div>

                          <TimezonePicker
                            value={timezone}
                            onChange={setTimezone}
                            label="Event timezone"
                            openDirection="up"
                          />

                          {needsLocation && (
                            <div>
                              <label className="text-xs font-medium text-slate-600">Location</label>
                              <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="mt-1 w-full h-11 px-3.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                          )}
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-5 sm:space-y-6">
                          {/* Brand logo */}
                          <div className="rounded-2xl border p-4 sm:p-5 bg-white">
                            <div className="flex justify-between items-start gap-3">
                              <div>
                                <div className="text-sm font-semibold">Brand logo</div>
                                <div className="text-xs text-slate-500">Displayed on booking page</div>
                              </div>

                              {effectiveLogo && (
                                <span className="text-xs font-medium text-emerald-600 shrink-0">
                                  Saved
                                </span>
                              )}
                            </div>

                            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                              <div className="h-14 w-full sm:w-44 flex items-center justify-center rounded-xl border bg-slate-50">
                                {logoSrc ? (
                                  <img
                                    src={logoSrc}
                                    className="max-h-10 max-w-[140px] object-contain"
                                    alt="Brand logo"
                                  />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-slate-300" />
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-11 sm:h-10 w-full sm:w-auto px-4 rounded-xl bg-slate-900 text-white whitespace-nowrap"
                              >
                                {logoUploading ? "Uploading..." : "Upload logo"}
                              </button>
                            </div>

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                setLogoUploading(true);
                                try {
                                  const url = await uploadBrandLogo(f);
                                  setLogoUrl(url);
                                } catch {
                                  setError("Failed to upload logo");
                                } finally {
                                  setLogoUploading(false);
                                }
                              }}
                            />
                          </div>

                          {/* Availability */}
                          <div className="rounded-2xl border p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold">Availability</div>
                                <div className="text-xs text-slate-500">When guests can book</div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setAvailabilityOpen(true)}
                                className="h-11 sm:h-10 w-full sm:w-auto px-4 rounded-xl bg-slate-900 text-white"
                              >
                                {availabilityMeta.isSet ? "Edit" : "Set"}
                              </button>
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-sm">
                              {availabilityMeta.isSet ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  Availability configured
                                </>
                              ) : (
                                <span className="text-slate-500">No availability set</span>
                              )}
                            </div>
                          </div>

                          {error && (
                            <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 rounded-xl">
                              {error}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="private"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-6"
                  >
                    <BookingForm userSub={userSub!} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FOOTER ONLY FOR PUBLIC */}
              {isPublic && (
                <div className="px-4 sm:px-6 py-4 border-t flex flex-col-reverse sm:flex-row gap-3 sm:justify-end bg-white">
                  <button type="button" onClick={onClose} className="h-11 sm:h-10 px-4 rounded-xl border">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || logoUploading}
                    className="h-11 sm:h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-60"
                  >
                    {saving ? "Creating…" : "Create"}
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>

        <AvailabilityEditorModal
          open={availabilityOpen}
          initialAvailabilityJson={availabilityJson !== "{}" ? availabilityJson : null}
          onClose={() => setAvailabilityOpen(false)}
          onSave={(json) => {
            setAvailabilityJson(json || "{}");
            setAvailabilityOpen(false);
          }}
        />
      </div>
    </AnimatePresence>
  );
}