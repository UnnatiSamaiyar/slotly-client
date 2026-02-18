// "use client";

// import React, { useMemo, useState } from "react";

// export default function PublicEventInfo({ profile }: { profile: any }) {
//   const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.slotly.io";
//   const hostName = profile.host_name || profile.host || "Host";
//   const title = profile.title || "Meeting";
//   const duration = profile.duration_minutes ?? profile.duration ?? 30;

//   const subtitle = useMemo(() => {
//     return `${duration}-minute meeting`;
//   }, [duration]);

//   // ✅ Safe absolute URL builder (UNCHANGED)
//   const logoSrc = useMemo(() => {
//     const u = profile?.brand_logo_url;
//     if (!u || typeof u !== "string") return null;
//     if (u.startsWith("http://") || u.startsWith("https://")) return u;
//     if (u.startsWith("/")) return `${apiBase}${u}`;
//     return `${apiBase}/${u}`;
//   }, [profile?.brand_logo_url, apiBase]);

//   // ✅ AUTO mode (UNCHANGED)
//   const [logoMode, setLogoMode] = useState<"unknown" | "wide" | "badge">("unknown");

//   return (
//     <div className="h-full p-8 sm:p-10 bg-white flex flex-col border-r">

//       {/* LOGO */}
//       {logoSrc && (
//         <div className="mb-6">
//           {logoMode !== "badge" && (
//             <div className="inline-flex items-center rounded-xl border px-4 py-3 max-w-[280px]">
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img
//                 src={logoSrc}
//                 alt=""
//                 className="block max-h-[56px] w-auto max-w-[220px] object-contain"
//                 loading="eager"
//                 decoding="async"
//                 onLoad={(e) => {
//                   const img = e.currentTarget;
//                   const w = img.naturalWidth || 0;
//                   const h = img.naturalHeight || 0;
//                   if (!w || !h) return;
//                   setLogoMode(w / h < 1.15 ? "badge" : "wide");
//                 }}
//               />
//             </div>
//           )}

//           {logoMode === "badge" && (
//             <div className="inline-flex items-center justify-center rounded-xl border p-4">
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img
//                 src={logoSrc}
//                 alt=""
//                 className="block h-[72px] w-[72px] object-contain"
//                 loading="eager"
//                 decoding="async"
//               />
//             </div>
//           )}
//         </div>
//       )}

//       {/* HOST */}
//       <div className="text-sm text-gray-500">Booking with</div>
//       <h1 className="text-2xl font-semibold text-gray-900 mt-1">
//         {hostName}
//       </h1>

//       {/* EVENT */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold text-gray-900">
//           {title}
//         </h2>
//         <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
//           ⏱ {subtitle}
//         </div>
//       </div>

//       {/* INFO BOX */}
//       <div className="mt-auto">
//         <div className="rounded-xl border p-4 text-sm text-gray-600 bg-gray-50">
//           Select a date & time, then confirm your details to book instantly.
//         </div>
//       </div>
//     </div>
//   );
// // }



"use client";

import React, { useMemo, useState } from "react";
import { Clock } from "lucide-react";


export default function PublicEventInfo({ profile }: { profile: any }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.slotly.io";
  const hostName = profile.host_name || profile.host || "Host";
  const title = profile.title || "Meeting";
  const duration = profile.duration_minutes ?? profile.duration ?? 30;

  const subtitle = useMemo(() => {
    return `${duration}-minute meeting`;
  }, [duration]);

  const logoSrc = useMemo(() => {
    const u = profile?.brand_logo_url;
    if (!u || typeof u !== "string") return null;
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    if (u.startsWith("/")) return `${apiBase}${u}`;
    return `${apiBase}/${u}`;
  }, [profile?.brand_logo_url, apiBase]);

  const [logoMode, setLogoMode] = useState<
    "unknown" | "wide" | "badge"
  >("unknown");

  return (
      <div className="h-full px-4 py-4 sm:px-6 sm:py-6 bg-white flex flex-col lg:border-r">

      {/* LOGO */}
      {logoSrc && (
        <div className="mb-4 sm:mb-5">

          {logoMode !== "badge" && (
            <div className="inline-flex items-center rounded-lg border px-4 py-2 max-w-[260px]">
              <img
                src={logoSrc}
                alt="Brand logo"
                className="block max-h-[44px] sm:max-h-[52px] w-auto max-w-[160px] sm:max-w-[200px] object-contain"

                loading="eager"
                decoding="async"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  const w = img.naturalWidth || 0;
                  const h = img.naturalHeight || 0;
                  if (!w || !h) return;
                  setLogoMode(w / h < 1.15 ? "badge" : "wide");
                }}
              />
            </div>
          )}

          {logoMode === "badge" && (
            <div className="inline-flex items-center justify-center rounded-lg border p-3">
              <img
                src={logoSrc}
                alt="Brand logo"
           
                className="block h-[52px] w-[52px] sm:h-[64px] sm:w-[64px] object-contain"

                loading="eager"
                decoding="async"
              />
            </div>
          )}
        </div>
      )}

      {/* HOST */}
      <div className="text-xs text-gray-800 uppercase tracking-wide">
        Booking with
      </div>
      <h1 className="text-base sm:text-lg font-semibold">
        {hostName}
      </h1>

      {/* EVENT */}
      <div className="mt-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">

          {title}
        </h2>
        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-800" />
          <span>{subtitle}</span>
        </div>

      </div>

      {/* INFO BOX */}
      <div className="mt-auto pt-4 sm:pt-6">
        <div className="rounded-lg bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-700">

          Choose a date and time that works for you.
        </div>

      </div>

      {/* ✅ POWERED BY FOOTER (Calendly-style) */}
      {/* <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t flex justify-center">

        <a
          href="/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 transition"
        >
          <span>Powered by</span>
          <img
            src="/Slotlyio-logo.png"
            alt="Slotly"
            className="h-4 opacity-80"
          />
        </a>
      </div> */}
    </div>
  );
}
