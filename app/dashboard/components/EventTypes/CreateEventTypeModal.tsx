
// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Plus, MapPin, Video, X, UploadCloud, Image as ImageIcon, CheckCircle2 } from "lucide-react";
// import AvailabilityEditorModal from "../Schedule/AvailabilityEditorModal";
// import TimezonePicker from "../TimezonePicker";
// import { getBrowserTimezone, getPreferredTimezone } from "@/lib/timezone";
// import { getMe, uploadBrandLogo } from "@/lib/userApi";

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
//   const [meetingMode, setMeetingMode] = useState<MeetingMode>("google_meet");
//   const [location, setLocation] = useState("");
//   const [durationMinutes, setDurationMinutes] = useState<number>(15);
//   const [timezone, setTimezone] = useState<string>(() => getPreferredTimezone() || getBrowserTimezone());
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Brand/logo (saved on user profile; can be reused for multiple event types)
//   const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
//   const [logoUrl, setLogoUrl] = useState<string | null>(null);
//   const [logoUploading, setLogoUploading] = useState(false);

//   // Calendly-like: each Event Type can have its own availability
//   const [availabilityJson, setAvailabilityJson] = useState<string>("{}");
//   const [availabilityOpen, setAvailabilityOpen] = useState(false);

//   const needsLocation = meetingMode === "in_person";

//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

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

//   // Load existing saved logo from user profile (if any)
//   useEffect(() => {
//     if (!open) return;
//     if (!userSub) return;
//     (async () => {
//       try {
//         const me = await getMe();
//         setExistingLogoUrl(me?.brand_logo_url || null);
//       } catch {
//         // silent; logo is optional
//       }
//     })();
//   }, [open, userSub]);

//   const icon = useMemo(
//     () => (meetingMode === "google_meet" ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />),
//     [meetingMode]
//   );

//   const effectiveLogo = logoUrl || existingLogoUrl || null;

//   const logoSrc = useMemo(() => {
//     if (!effectiveLogo) return null;
//     if (effectiveLogo.startsWith("http://") || effectiveLogo.startsWith("https://")) return effectiveLogo;
//     if (effectiveLogo.startsWith("/")) return `${apiBase}${effectiveLogo}`;
//     return `${apiBase}/${effectiveLogo}`;
//   }, [effectiveLogo, apiBase]);

//   const availabilityMeta = useMemo(() => {
//     const len = String(availabilityJson || "{}").length;
//     const isSet = availabilityJson && availabilityJson !== "{}" && len > 2;
//     return { len, isSet };
//   }, [availabilityJson]);

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

//         {/* Sheet / Modal */}
//         <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6">
//           <motion.div
//             initial={{ opacity: 0, y: 18, scale: 0.99 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 18, scale: 0.99 }}
//             transition={{ type: "spring", stiffness: 380, damping: 30 }}
//             className="relative w-full sm:max-w-[720px] bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
//           >
//             {/* Header */}
//             <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b bg-white">
//               <div className="flex items-start gap-4">
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
//                   <Plus className="w-5 h-5" />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <div className="flex items-center justify-between gap-3">
//                     <div>
//                       <div className="text-lg sm:text-xl font-semibold text-slate-900">Create event type</div>
//                       <div className="text-sm text-slate-500 mt-0.5">
//                         Configure a booking link for visitors.
//                       </div>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={onClose}
//                       className="inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-600"
//                       aria-label="Close"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Body */}
//             <form onSubmit={submit}>
//               <div className="px-5 sm:px-6 py-5 sm:py-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   {/* Left column */}
//                   <div className="space-y-4">
//                     {/* Title */}
//                     <div>
//                       <label className="text-xs font-medium text-slate-600">Title</label>
//                       <input
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         className="mt-1 w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
//                         placeholder="e.g. Intro Call"
//                       />
//                     </div>

//                     {/* Meeting Type */}
//                     <div>
//                       <label className="text-xs font-medium text-slate-600">Meeting type</label>
//                       <div className="mt-1 flex items-center gap-2">
//                         <div className="w-11 h-11 rounded-xl border bg-white flex items-center justify-center text-slate-700">
//                           {icon}
//                         </div>
//                         <select
//                           value={meetingMode}
//                           onChange={(e) => setMeetingMode(e.target.value as MeetingMode)}
//                           className="w-full px-3.5 py-2.5 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
//                         >
//                           <option value="google_meet">Google Meet</option>
//                           <option value="in_person">In-person meeting</option>
//                         </select>
//                       </div>
//                     </div>

//                     {/* Duration */}
//                     <div>
//                       <label className="text-xs font-medium text-slate-600">Duration</label>
//                       <select
//                         value={durationMinutes}
//                         onChange={(e) => setDurationMinutes(Number(e.target.value))}
//                         className="mt-1 w-full px-3.5 py-2.5 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
//                       >
//                         {[5, 10, 15, 20, 30, 45, 60, 90, 120].map((m) => (
//                           <option key={m} value={m}>
//                             {m} minutes
//                           </option>
//                         ))}
//                       </select>
//                       <div className="mt-1 text-xs text-slate-500">This controls the slot size shown to guests.</div>
//                     </div>

//                     {/* Timezone */}
//                     <div>
//                       <TimezonePicker
//                         value={timezone}
//                         onChange={setTimezone}
//                         label="Event timezone"
//                         title="This timezone becomes the default on the public booking link"
//                         helperText={
//                           <>
//                             Guests will see available slots in{" "}
//                             <span className="font-medium text-gray-700">{timezone}</span> by default.
//                           </>
//                         }
//                       />
//                     </div>

//                     {/* Location */}
//                     {needsLocation && (
//                       <div>
//                         <label className="text-xs font-medium text-slate-600">Location</label>
//                         <input
//                           value={location}
//                           onChange={(e) => setLocation(e.target.value)}
//                           className="mt-1 w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
//                           placeholder="e.g. Office address + Google Maps link"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   {/* Right column */}
//                   <div className="space-y-4">
//                     {/* Brand logo - Calendly style */}
//                     <div className="border border-slate-200 rounded-2xl p-4 bg-white">
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="min-w-0">
//                           <div className="text-sm font-semibold text-slate-900">Brand logo (optional)</div>
//                           <div className="text-xs text-slate-500 mt-0.5">
//                             Shows on the public booking page and stays saved in your profile for reuse.
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mt-4 flex items-center gap-3">
//                         {/* Preview box (Calendly-like) */}
//                         <div className="shrink-0">
//                           {logoSrc ? (
//                             <div className="h-[54px] w-[120px] rounded-xl ring-1 ring-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden px-2">
//                               {/* eslint-disable-next-line @next/next/no-img-element */}
//                               <img
//                                 src={logoSrc}
//                                 alt=""
//                                 className="max-h-[44px] w-auto max-w-[104px] object-contain"
//                                 loading="eager"
//                                 decoding="async"
//                               />
//                             </div>
//                           ) : (
//                             <div className="h-[54px] w-[120px] rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
//                               <div className="flex items-center gap-2">
//                                 <ImageIcon className="w-4 h-4" />
//                                 No logo
//                               </div>
//                             </div>
//                           )}
//                         </div>

//                         {/* Status text */}
//                         <div className="flex-1 min-w-0">
//                           <div className="text-xs text-slate-700 font-medium">
//                             {logoUrl ? (
//                               <span className="inline-flex items-center gap-1.5">
//                                 <CheckCircle2 className="w-4 h-4 text-emerald-600" />
//                                 New logo selected
//                               </span>
//                             ) : existingLogoUrl ? (
//                               <span className="text-slate-700">Using saved profile logo</span>
//                             ) : (
//                               <span className="text-slate-500">Upload a logo</span>
//                             )}
//                           </div>
//                           <div className="text-[11px] text-slate-500 mt-1">PNG/JPG/WebP/SVG • max 8MB</div>
//                         </div>

//                         {/* Upload button */}
//                         <div className="shrink-0">
//                           <input
//                             ref={fileInputRef}
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             onChange={async (e) => {
//                               const f = e.target.files?.[0];
//                               if (!f) return;
//                               setError(null);
//                               setLogoUploading(true);
//                               try {
//                                 const url = await uploadBrandLogo(f);
//                                 if (!url) throw new Error("Upload failed");
//                                 setLogoUrl(url);
//                               } catch (err: any) {
//                                 setError(err?.message || "Failed to upload logo");
//                               } finally {
//                                 setLogoUploading(false);
//                                 e.currentTarget.value = "";
//                               }
//                             }}
//                           />

//                           <button
//                             type="button"
//                             onClick={() => fileInputRef.current?.click()}
//                             className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition ${
//                               logoUploading
//                                 ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
//                                 : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
//                             }`}
//                             disabled={logoUploading}
//                           >
//                             <UploadCloud className="w-4 h-4" />
//                             {logoUploading ? "Uploading…" : effectiveLogo ? "Change" : "Upload"}
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Availability */}
//                     <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="min-w-0">
//                           <div className="text-sm font-semibold text-slate-900">Availability (required)</div>
//                           <div className="text-xs text-slate-500 mt-0.5">
//                             Define when this event type can be booked. Supports weekly rules, date ranges, one-off overrides, and time blocks.
//                           </div>
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() => setAvailabilityOpen(true)}
//                           className="shrink-0 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
//                         >
//                           Set availability
//                         </button>
//                       </div>

//                       <div className="mt-3 flex items-center justify-between">
//                         <div className="text-xs text-slate-600">
//                           {availabilityMeta.isSet ? (
//                             <span className="inline-flex items-center gap-1.5">
//                               <CheckCircle2 className="w-4 h-4 text-emerald-600" />
//                               Availability configured
//                             </span>
//                           ) : (
//                             <span className="text-slate-500">Not set yet</span>
//                           )}
//                         </div>
//                         <div className="text-xs text-slate-500">
//                           Rules JSON length: <span className="font-mono">{availabilityMeta.len}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Error */}
//                     {error && (
//                       <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//                         {error}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="px-5 sm:px-6 py-4 border-t bg-white flex items-center justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving || logoUploading}
//                   className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-60"
//                 >
//                   {saving ? "Creating…" : "Create"}
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>

//         <AvailabilityEditorModal
//           open={availabilityOpen}
//           initialAvailabilityJson={availabilityJson && availabilityJson !== "{}" ? availabilityJson : null}
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
import { Plus, MapPin, Video, X, UploadCloud, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import AvailabilityEditorModal from "../Schedule/AvailabilityEditorModal";
import TimezonePicker from "../TimezonePicker";
import { getBrowserTimezone, getPreferredTimezone } from "@/lib/timezone";
import { getMe, uploadBrandLogo } from "@/lib/userApi";

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

  // Brand/logo (saved on user profile; can be reused for multiple event types)
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  // Calendly-like: each Event Type can have its own availability
  const [availabilityJson, setAvailabilityJson] = useState<string>("{}");
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const needsLocation = meetingMode === "in_person";

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

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
  }, [open]);

  // Load existing saved logo from user profile (if any)
  useEffect(() => {
    if (!open) return;
    if (!userSub) return;
    (async () => {
      try {
        const me = await getMe();
        setExistingLogoUrl(me?.brand_logo_url || null);
      } catch {
        // silent; logo is optional
      }
    })();
  }, [open, userSub]);

  const icon = useMemo(
    () => (meetingMode === "google_meet" ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />),
    [meetingMode]
  );

  const effectiveLogo = logoUrl || existingLogoUrl || null;

  const logoSrc = useMemo(() => {
    if (!effectiveLogo) return null;
    if (effectiveLogo.startsWith("http://") || effectiveLogo.startsWith("https://")) return effectiveLogo;
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

        {/* Sheet / Modal */}
        <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full sm:max-w-[720px] bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b bg-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg sm:text-xl font-semibold text-slate-900">Create event type</div>
                      <div className="text-sm text-slate-500 mt-0.5">
                        Configure a booking link for visitors.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-600"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <form onSubmit={submit}>
              <div className="px-5 sm:px-6 py-5 sm:py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="text-xs font-medium text-slate-600">Title</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="e.g. Intro Call"
                      />
                    </div>

                    {/* Meeting Type */}
                    <div>
                      <label className="text-xs font-medium text-slate-600">Meeting type</label>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="w-11 h-11 rounded-xl border bg-white flex items-center justify-center text-slate-700">
                          {icon}
                        </div>
                        <select
                          value={meetingMode}
                          onChange={(e) => setMeetingMode(e.target.value as MeetingMode)}
                          className="w-full px-3.5 py-2.5 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                          <option value="google_meet">Google Meet</option>
                          <option value="in_person">In-person meeting</option>
                        </select>
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-xs font-medium text-slate-600">Duration</label>
                      <select
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(Number(e.target.value))}
                        className="mt-1 w-full px-3.5 py-2.5 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        {[5, 10, 15, 20, 30, 45, 60, 90, 120].map((m) => (
                          <option key={m} value={m}>
                            {m} minutes
                          </option>
                        ))}
                      </select>
                      <div className="mt-1 text-xs text-slate-500">This controls the slot size shown to guests.</div>
                    </div>

                    {/* Timezone */}
                    <div>
                      <TimezonePicker
                        value={timezone}
                        onChange={setTimezone}
                        label="Event timezone"
                        title="This timezone becomes the default on the public booking link"
                        helperText={
                          <>
                            Guests will see available slots in{" "}
                            <span className="font-medium text-gray-700">{timezone}</span> by default.
                          </>
                        }
                      />
                    </div>

                    {/* Location */}
                    {needsLocation && (
                      <div>
                        <label className="text-xs font-medium text-slate-600">Location</label>
                        <input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="mt-1 w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="e.g. Office address + Google Maps link"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right column */}
                  {/* Right column */}
                  <div className="space-y-6">

                    {/* BRAND LOGO */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            Brand logo
                          </div>
                          <div className="text-xs text-slate-500">
                            Displayed on your booking page
                          </div>
                        </div>

                        {effectiveLogo && (
                          <span className="text-xs font-medium text-emerald-600">
                            Saved
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">

                        {/* Preview */}
                        <div className="relative w-full max-w-lg sm:max-w-2xl bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">

                          {logoSrc ? (
                            <img
                              src={logoSrc}
                              className="max-h-10 w-auto object-contain"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-300" />
                          )}
                        </div>

                        {/* Upload */}
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
                            disabled={logoUploading}
                          >
                            {logoUploading ? "Uploading…" : effectiveLogo ? "Change logo" : "Upload logo"}
                          </button>

                          <span className="text-[11px] text-slate-400">
                            PNG, JPG, SVG • Max 8MB
                          </span>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            setError(null);
                            setLogoUploading(true);
                            try {
                              const url = await uploadBrandLogo(f);
                              if (!url) throw new Error("Upload failed");
                              setLogoUrl(url);
                            } catch (err: any) {
                              setError(err?.message || "Failed to upload logo");
                            } finally {
                              setLogoUploading(false);
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* AVAILABILITY */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            Availability
                          </div>
                          <div className="text-xs text-slate-500">
                            Set when guests can book this event
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setAvailabilityOpen(true)}
                          className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
                        >
                          {availabilityMeta.isSet ? "Edit" : "Set"}
                        </button>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm">
                        {availabilityMeta.isSet ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-slate-700">Availability configured</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            <span className="text-slate-500">
                                No availability set — guests cannot book yet
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="px-5 sm:px-6 py-4 border-t bg-white flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || logoUploading}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-60"
                >
                  {saving ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <AvailabilityEditorModal
          open={availabilityOpen}
          initialAvailabilityJson={availabilityJson && availabilityJson !== "{}" ? availabilityJson : null}
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
