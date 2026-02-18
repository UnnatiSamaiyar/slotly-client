// export default function PublicBookingHeader({ profile }: any) {
//   const apiBase = process.env.NEXT_PUBLIC_API_BASE || "https://api.slotly.io";
//   return (
//     <div className="w-full bg-gradient-to-b from-blue-600 to-indigo-600 text-white p-8 sm:p-10 flex flex-col">
//       <div>
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
//         <p className="text-white/70 text-sm">Booking with</p>
//         <h1 className="text-3xl font-bold mt-2">
//           {profile.host_name || "Your Host"}
//         </h1>

//         <p className="mt-6 text-lg font-semibold">{profile.title}</p>
//         <p className="text-white/80">{profile.duration_minutes}-minute meeting</p>
//       </div>

//       <div className="mt-auto pt-8">
//         <div className="text-sm text-white/90 bg-white/10 border border-white/15 rounded-xl p-4">
//           Select a date & time and confirm your details to book instantly.
//         </div>
//       </div>
//     </div>
//   );
// }
export default function PublicBookingHeader({ profile, onBack }: any) {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE || "https://api.slotly.io";

  return (
    <div className="w-full bg-gradient-to-b from-blue-600 to-indigo-600 text-white">
      <div className="max-w-[800px] mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4">

    

        {/* TOP ROW */}
        <div className="flex items-center justify-between gap-4">

 
          <div className="flex items-center gap-3">
            {/* BACK BUTTON (optional) */}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-8 h-8 rounded-full bg-white/15
                  hover:bg-white/25 transition
                  flex items-center justify-center text-white"
                aria-label="Go back"
              >
                ←
              </button>
            )}

            {/* BRAND LOGO */}
            {profile?.brand_logo_url && (
              <img
                src={`${apiBase}${profile.brand_logo_url}`}
                alt="Brand logo"
                className="h-7 sm:h-8 w-auto max-w-[160px] object-contain"

              />
            )}
          </div>
        </div>

        {/* HOST INFO */}
        <div>
          <p className="text-white/70 text-sm">Booking with</p>
          <h1 className="text-xl sm:text-2xl font-semibold mt-1 leading-tight">

            {profile?.host_name || "Your Host"}
          </h1>
        </div>

        {/* MEETING INFO */}
        <div className="space-y-1">
          <p className="text-lg font-semibold">
            {profile?.title}
          </p>
          <p className="text-white/80 text-sm">
            {profile?.duration_minutes}-minute meeting
          </p>
        </div>

        {/* HELPER NOTE */}
        <div className="mt-1">

          <div className="text-sm text-white/90 bg-white/10
            border border-white/15 rounded-lg px-4 py-3">
            Select a date & time and confirm your details to book instantly.
          </div>
        </div>
      </div>
    </div>
  );
}
