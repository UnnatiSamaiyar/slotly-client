// "use client";

// import React, { useMemo } from "react";



// export default function PublicEventInfo({ profile }: { profile: any }) {
//   const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://api.slotly.io";
//   const hostName = profile.host_name || profile.host || "Host";
//   const title = profile.title || "Meeting";
//   const duration = profile.duration_minutes ?? profile.duration ?? 30;

//   const subtitle = useMemo(() => {
//     return `${duration}-minute meeting`;
//   }, [duration]);

//   return (
//     <div className="h-full p-8 sm:p-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex flex-col">
//       <div className="mb-6">
//         {profile?.brand_logo_url && (
//           <div className="mb-4">
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               src={`${apiBase}${profile.brand_logo_url}`}
//               alt="Brand logo"
//               className="h-10 w-auto max-w-[220px] object-contain"
//             />
//           </div>
//         )}
//         <div className="text-xs uppercase tracking-wide text-white/75">
//           Booking with
//         </div>
//         <h1 className="text-3xl font-bold mt-2 leading-tight">{hostName}</h1>
//       </div>

//       <div className="mb-8">
//         <h2 className="text-xl font-semibold">{title}</h2>
//         <div className="text-sm text-white/80 mt-2">{subtitle}</div>
//       </div>

//       <div className="mt-auto">
//         <div className="rounded-xl bg-white/10 border border-white/15 p-4 text-sm text-white/90">
//           Select a date & time, then confirm your details to book instantly.
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import React, { useMemo, useState } from "react";

export default function PublicEventInfo({ profile }: { profile: any }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://api.slotly.io";
  const hostName = profile.host_name || profile.host || "Host";
  const title = profile.title || "Meeting";
  const duration = profile.duration_minutes ?? profile.duration ?? 30;

  const subtitle = useMemo(() => {
    return `${duration}-minute meeting`;
  }, [duration]);

  // ✅ Safe absolute URL builder
  const logoSrc = useMemo(() => {
    const u = profile?.brand_logo_url;
    if (!u || typeof u !== "string") return null;
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    if (u.startsWith("/")) return `${apiBase}${u}`;
    return `${apiBase}/${u}`;
  }, [profile?.brand_logo_url, apiBase]);

  // ✅ AUTO mode: detect portrait vs landscape once image loads
  const [logoMode, setLogoMode] = useState<"unknown" | "wide" | "badge">("unknown");

  return (
    <div className="h-full p-8 sm:p-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex flex-col">
      <div className="mb-6">
        {logoSrc && (
          <div className="mb-5">
            {/* WIDE MODE (landscape logos) */}
            {logoMode !== "badge" && (
              <div className="inline-flex items-center rounded-2xl bg-white/10 ring-1 ring-white/15 px-4 py-3 max-w-[320px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoSrc}
                  alt=""
                  className="block max-h-[64px] w-auto max-w-[240px] object-contain"
                  loading="eager"
                  decoding="async"
                  onLoad={(e) => {
                    // Decide mode based on intrinsic ratio (no guesswork)
                    const img = e.currentTarget;
                    const w = img.naturalWidth || 0;
                    const h = img.naturalHeight || 0;
                    if (!w || !h) return;
                    // portrait/square => badge (bigger presence)
                    setLogoMode(w / h < 1.15 ? "badge" : "wide");
                  }}
                />
              </div>
            )}

            {/* BADGE MODE (portrait/square logos) */}
            {logoMode === "badge" && (
              <div className="inline-flex items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoSrc}
                  alt=""
                  className="block h-[88px] w-[88px] object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}
          </div>
        )}

        <div className="text-xs uppercase tracking-wide text-white/75">Booking with</div>
        <h1 className="text-3xl font-bold mt-2 leading-tight">{hostName}</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="text-sm text-white/80 mt-2">{subtitle}</div>
      </div>

      <div className="mt-auto">
        <div className="rounded-xl bg-white/10 border border-white/15 p-4 text-sm text-white/90">
          Select a date & time, then confirm your details to book instantly.
        </div>
      </div>
    </div>
  );
}
