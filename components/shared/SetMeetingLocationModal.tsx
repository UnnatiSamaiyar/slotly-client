// // "use client";

// // import React, { useEffect, useMemo, useState } from "react";
// // import { AnimatePresence, motion } from "framer-motion";
// // import { X } from "lucide-react";

// // const VENUE_TYPES = [
// //   { value: "office", label: "Office" },
// //   { value: "client_office", label: "Client office" },
// //   { value: "coworking", label: "Co-working space" },
// //   { value: "cafe", label: "Cafe" },
// //   { value: "hotel", label: "Hotel lobby" },
// //   { value: "onsite", label: "On-site (store/factory/site)" },
// //   { value: "other", label: "Other" },
// //   {value: "custom", label: "Custom"}
// // ];

// // function normalizeSpaces(s: string) {
// //   return String(s || "").replace(/\s+/g, " ").trim();
// // }

// // function mapsSearchUrl(query: string) {
// //   const q = normalizeSpaces(query);
// //   if (!q) return "";
// //   return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
// // }

// // function composeLocation(venueType: string, venueName: string, mapsUrl: string) {
// //   const vtLabel = VENUE_TYPES.find((v) => v.value === venueType)?.label || "Location";
// //   const vn = normalizeSpaces(venueName);
// //   const mu = normalizeSpaces(mapsUrl);

// //   const head = vn ? `${vtLabel}: ${vn}` : vtLabel;
// //   return mu ? `${head} (${mu})` : head;
// // }

// // export default function SetMeetingLocationModal({
// //   open,
// //   onClose,
// //   initialValue,
// //   onSave,
// // }: {
// //   open: boolean;
// //   onClose: () => void;
// //   initialValue: string;
// //   onSave: (locationString: string) => void;
// // }) {
// //   const [venueType, setVenueType] = useState(VENUE_TYPES[0].value);
// //   const [venueName, setVenueName] = useState("");
// //   const [mapsUrl, setMapsUrl] = useState("");

// //   // If we already have a saved string (legacy), keep it as-is by showing it in venue name.
// //   useEffect(() => {
// //     if (!open) return;
// //     setVenueType(VENUE_TYPES[0].value);
// //     setVenueName("");
// //     setMapsUrl("");

// //     const v = normalizeSpaces(initialValue);
// //     if (v) {
// //       setVenueType("other");
// //       setVenueName(v);
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [open]);

// //   const effectiveMapsUrl = useMemo(() => {
// //     const mu = normalizeSpaces(mapsUrl);
// //     if (mu) return mu;
// //     // ✅ Auto-generate Maps link if user didn't provide it
// //     const vn = normalizeSpaces(venueName);
// //     return vn ? mapsSearchUrl(vn) : "";
// //   }, [mapsUrl, venueName]);

// //   const preview = useMemo(() => {
// //     return composeLocation(venueType, venueName, effectiveMapsUrl);
// //   }, [venueType, venueName, effectiveMapsUrl]);

// //   if (!open) return null;

// //   return (
// //     <AnimatePresence>
// //       <div className="fixed inset-0 z-[9999]">
// //         {/* Backdrop */}
// //         <motion.button
// //           type="button"
// //           aria-label="Close"
// //           className="absolute inset-0 bg-black/40"
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           exit={{ opacity: 0 }}
// //           onClick={onClose}
// //         />

// //         {/* Modal */}
// //         <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6">
// //           <motion.div
// //             initial={{ opacity: 0, y: 18, scale: 0.99 }}
// //             animate={{ opacity: 1, y: 0, scale: 1 }}
// //             exit={{ opacity: 0, y: 18, scale: 0.99 }}
// //             transition={{ type: "spring", stiffness: 380, damping: 30 }}
// //             className="relative w-full sm:max-w-[640px] bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[95dvh] overflow-hidden"
// //           >
// //             <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b bg-white">
// //               <div className="flex items-center justify-between gap-3">
// //                 <div>
// //                   <div className="text-lg sm:text-xl font-semibold text-slate-900">
// //                     Set meeting location
// //                   </div>
// //                   <div className="text-sm text-slate-500 mt-0.5">
// //                     Choose a venue and share a Maps link (optional).
// //                   </div>
// //                 </div>
// //                 <button
// //                   type="button"
// //                   onClick={onClose}
// //                   className="inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-600"
// //                 >
// //                   <X className="w-5 h-5" />
// //                 </button>
// //               </div>
// //             </div>

// //             <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-4">
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Venue type</label>
// //                 <select
// //                   value={venueType}
// //                   onChange={(e) => setVenueType(e.target.value)}
// //                   className="w-full rounded-xl border p-3 bg-white shadow-sm"
// //                 >
// //                   {VENUE_TYPES.map((v) => (
// //                     <option key={v.value} value={v.value}>
// //                       {v.label}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Venue name</label>
// //                 <input
// //                   value={venueName}
// //                   onChange={(e) => setVenueName(e.target.value)}
// //                   placeholder="e.g., Slotly HQ / Blue Tokai"
// //                   className="w-full rounded-xl border p-3 bg-white shadow-sm"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">
// //                   Google Maps link (optional)
// //                 </label>
// //                 <input
// //                   value={mapsUrl}
// //                   onChange={(e) => setMapsUrl(e.target.value)}
// //                   placeholder="https://maps.google.com/..."
// //                   className="w-full rounded-xl border p-3 bg-white shadow-sm"
// //                   inputMode="url"
// //                 />
// //                 {!normalizeSpaces(mapsUrl) && normalizeSpaces(venueName) && (
// //                   <div className="mt-2 text-xs text-slate-500">
// //                     We&apos;ll auto-generate a Maps link from the venue name.
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="rounded-xl bg-gray-50 border p-4">
// //                 <div className="text-[11px] font-medium text-gray-600">What invitees will see</div>
// //                 <div className="mt-1 text-sm text-gray-900 break-words">
// //                   {preview || "—"}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="px-5 sm:px-6 py-4 border-t bg-white flex justify-end">
// //               <button
// //                 type="button"
// //                 onClick={() => {
// //                   const finalStr = normalizeSpaces(preview);
// //                   onSave(finalStr);
// //                   onClose();
// //                 }}
// //                 className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold"
// //               >
// //                 Save location
// //               </button>
// //             </div>
// //           </motion.div>
// //         </div>
// //       </div>
// //     </AnimatePresence>
// //   );
// // }




// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { X } from "lucide-react";

// const VENUE_TYPES = [
//   { value: "office", label: "Office" },
//   { value: "client_office", label: "Client office" },
//   { value: "coworking", label: "Co-working space" },
//   { value: "cafe", label: "Cafe" },
//   { value: "hotel", label: "Hotel lobby" },
//   { value: "onsite", label: "On-site (store/factory/site)" },
//   { value: "other", label: "Other" },
//   { value: "custom", label: "Custom" },
// ];

// function normalizeSpaces(s: string) {
//   return String(s || "").replace(/\s+/g, " ").trim();
// }

// function mapsSearchUrl(query: string) {
//   const q = normalizeSpaces(query);
//   if (!q) return "";
//   return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
// }

// function composeLocation(
//   venueType: string,
//   customVenueType: string,
//   venueName: string,
//   mapsUrl: string
// ) {
//   const baseLabel =
//     venueType === "custom"
//       ? normalizeSpaces(customVenueType) || "Custom"
//       : VENUE_TYPES.find((v) => v.value === venueType)?.label || "Location";

//   const vn = normalizeSpaces(venueName);
//   const mu = normalizeSpaces(mapsUrl);

//   const head = vn ? `${baseLabel}: ${vn}` : baseLabel;
//   return mu ? `${head} (${mu})` : head;
// }

// export default function SetMeetingLocationModal({
//   open,
//   onClose,
//   initialValue,
//   onSave,
// }: {
//   open: boolean;
//   onClose: () => void;
//   initialValue: string;
//   onSave: (locationString: string) => void;
// }) {
//   const [venueType, setVenueType] = useState(VENUE_TYPES[0].value);
//   const [customVenueType, setCustomVenueType] = useState("");
//   const [venueName, setVenueName] = useState("");
//   const [mapsUrl, setMapsUrl] = useState("");

//   useEffect(() => {
//     if (!open) return;
//     setVenueType(VENUE_TYPES[0].value);
//     setCustomVenueType("");
//     setVenueName("");
//     setMapsUrl("");

//     const v = normalizeSpaces(initialValue);
//     if (v) {
//       setVenueType("other");
//       setVenueName(v);
//     }
//   }, [open, initialValue]);

//   const effectiveMapsUrl = useMemo(() => {
//     const mu = normalizeSpaces(mapsUrl);
//     if (mu) return mu;
//     const vn = normalizeSpaces(venueName);
//     return vn ? mapsSearchUrl(vn) : "";
//   }, [mapsUrl, venueName]);

//   const preview = useMemo(() => {
//     return composeLocation(venueType, customVenueType, venueName, effectiveMapsUrl);
//   }, [venueType, customVenueType, venueName, effectiveMapsUrl]);

//   if (!open) return null;

//   return (
//     <AnimatePresence>
//       <div className="fixed inset-0 z-[9999]">
//         <motion.button
//           type="button"
//           aria-label="Close"
//           className="absolute inset-0 bg-black/40"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose}
//         />

//         <div className="absolute inset-0 flex items-end justify-center p-0 sm:items-center sm:p-6">
//           <motion.div
//             initial={{ opacity: 0, y: 18, scale: 0.99 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 18, scale: 0.99 }}
//             transition={{ type: "spring", stiffness: 380, damping: 30 }}
//             className="relative max-h-[95dvh] w-full overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-[640px] sm:rounded-2xl"
//           >
//             <div className="border-b bg-white px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
//               <div className="flex items-center justify-between gap-3">
//                 <div>
//                   <div className="text-lg font-semibold text-slate-900 sm:text-xl">
//                     Set meeting location
//                   </div>
//                   <div className="mt-0.5 text-sm text-slate-500">
//                     Choose a venue and share a Maps link (optional).
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-600">
//                   Venue type
//                 </label>
//                 <select
//                   value={venueType}
//                   onChange={(e) => setVenueType(e.target.value)}
//                   className="w-full rounded-xl border bg-white p-3 shadow-sm"
//                 >
//                   {VENUE_TYPES.map((v) => (
//                     <option key={v.value} value={v.value}>
//                       {v.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {venueType === "custom" && (
//                 <div>
//                   <label className="mb-1 block text-xs font-medium text-gray-600">
//                     Custom venue type
//                   </label>
//                   <input
//                     value={customVenueType}
//                     onChange={(e) => setCustomVenueType(e.target.value)}
//                     placeholder="e.g., Showroom / Branch office / Studio"
//                     className="w-full rounded-xl border bg-white p-3 shadow-sm"
//                   />
//                 </div>
//               )}

//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-600">
//                   Venue name
//                 </label>
//                 <input
//                   value={venueName}
//                   onChange={(e) => setVenueName(e.target.value)}
//                   placeholder="e.g., Slotly HQ / Blue Tokai"
//                   className="w-full rounded-xl border bg-white p-3 shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-600">
//                   Google Maps link (optional)
//                 </label>
//                 <input
//                   value={mapsUrl}
//                   onChange={(e) => setMapsUrl(e.target.value)}
//                   placeholder="https://maps.google.com/..."
//                   className="w-full rounded-xl border bg-white p-3 shadow-sm"
//                   inputMode="url"
//                 />
//                 {!normalizeSpaces(mapsUrl) && normalizeSpaces(venueName) && (
//                   <div className="mt-2 text-xs text-slate-500">
//                     We&apos;ll auto-generate a Maps link from the venue name.
//                   </div>
//                 )}
//               </div>

//               <div className="rounded-xl border bg-gray-50 p-4">
//                 <div className="text-[11px] font-medium text-gray-600">
//                   What invitees will see
//                 </div>
//                 <div className="mt-1 break-words text-sm text-gray-900">
//                   {preview || "—"}
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end border-t bg-white px-5 py-4 sm:px-6">
//               <button
//                 type="button"
//                 onClick={() => {
//                   const finalStr = normalizeSpaces(preview);
//                   onSave(finalStr);
//                   onClose();
//                 }}
//                 className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 font-semibold text-white"
//               >
//                 Save location
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </AnimatePresence>
//   );
// }


"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const VENUE_TYPES = [
  { value: "office", label: "Office" },
  { value: "client_office", label: "Client office" },
  { value: "coworking", label: "Co-working space" },
  { value: "cafe", label: "Cafe" },
  { value: "hotel", label: "Hotel lobby" },
  { value: "onsite", label: "On-site (store/factory/site)" },
  { value: "other", label: "Other" },
  { value: "custom", label: "Custom" },
];

function normalizeSpaces(s: string) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

function mapsSearchUrl(query: string) {
  const q = normalizeSpaces(query);
  if (!q) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function composeLocation(
  venueType: string,
  customVenueType: string,
  venueName: string,
  mapsUrl: string
) {
  const baseLabel =
    venueType === "custom"
      ? normalizeSpaces(customVenueType) || "Custom"
      : VENUE_TYPES.find((v) => v.value === venueType)?.label || "Location";

  const vn = normalizeSpaces(venueName);
  const mu = normalizeSpaces(mapsUrl);

  const head = vn ? `${baseLabel}: ${vn}` : baseLabel;
  return mu ? `${head} (${mu})` : head;
}

export default function SetMeetingLocationModal({
  open,
  onClose,
  initialValue,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initialValue: string;
  onSave: (locationString: string) => void;
}) {
  const [venueType, setVenueType] = useState(VENUE_TYPES[0].value);
  const [customVenueType, setCustomVenueType] = useState("");
  const [venueName, setVenueName] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    setVenueType(VENUE_TYPES[0].value);
    setCustomVenueType("");
    setVenueName("");
    setMapsUrl("");

    const v = normalizeSpaces(initialValue);
    if (v) {
      setVenueType("other");
      setVenueName(v);
    }
  }, [open, initialValue]);

  const effectiveMapsUrl = useMemo(() => {
    const mu = normalizeSpaces(mapsUrl);
    if (mu) return mu;
    const vn = normalizeSpaces(venueName);
    return vn ? mapsSearchUrl(vn) : "";
  }, [mapsUrl, venueName]);

  const preview = useMemo(() => {
    return composeLocation(venueType, customVenueType, venueName, effectiveMapsUrl);
  }, [venueType, customVenueType, venueName, effectiveMapsUrl]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999]">
        <motion.button
          type="button"
          aria-label="Close"
          className="absolute inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-[620px] rounded-2xl bg-white shadow-2xl"
          >
            <div className="border-b bg-white px-4 pb-3 pt-4 sm:px-5 sm:pb-3 sm:pt-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    Set meeting location
                  </div>
                  <div className="mt-0.5 text-sm text-slate-500">
                    Choose a venue and share a Maps link (optional).
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Venue type
                </label>
                <select
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  className="h-11 w-full rounded-xl border bg-white px-3 shadow-sm"
                >
                  {VENUE_TYPES.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              {venueType === "custom" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Custom venue type
                  </label>
                  <input
                    value={customVenueType}
                    onChange={(e) => setCustomVenueType(e.target.value)}
                    placeholder="e.g., Showroom / Branch office / Studio"
                    className="h-11 w-full rounded-xl border bg-white px-3 shadow-sm"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Venue name
                </label>
                <input
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g., Slotly HQ / Blue Tokai"
                  className="h-11 w-full rounded-xl border bg-white px-3 shadow-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Google Maps link (optional)
                </label>
                <input
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="h-11 w-full rounded-xl border bg-white px-3 shadow-sm"
                  inputMode="url"
                />
                {!normalizeSpaces(mapsUrl) && normalizeSpaces(venueName) && (
                  <div className="mt-1 text-[11px] text-slate-500">
                    We&apos;ll auto-generate a Maps link from the venue name.
                  </div>
                )}
              </div>

              <div className="rounded-xl border bg-gray-50 p-3">
                <div className="text-[11px] font-medium text-gray-600">
                  What invitees will see
                </div>
                <div className="mt-1 break-words text-sm text-gray-900">
                  {preview || "—"}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t bg-white px-4 py-3 sm:px-5 sm:py-4">
              <button
                type="button"
                onClick={() => {
                  const finalStr = normalizeSpaces(preview);
                  onSave(finalStr);
                  onClose();
                }}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 font-semibold text-white"
              >
                Save location
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}