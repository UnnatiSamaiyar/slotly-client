export default function PublicBookingHeader({ profile }: any) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://api.slotly.io";
  return (
    <div className="w-full bg-gradient-to-b from-blue-600 to-indigo-600 text-white p-8 sm:p-10 flex flex-col">
      <div>
        {profile?.brand_logo_url && (
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${apiBase}${profile.brand_logo_url}`}
              alt="Brand logo"
              className="h-10 w-auto max-w-[220px] object-contain"
            />
          </div>
        )}
        <p className="text-white/70 text-sm">Booking with</p>
        <h1 className="text-3xl font-bold mt-2">
          {profile.host_name || "Your Host"}
        </h1>

        <p className="mt-6 text-lg font-semibold">{profile.title}</p>
        <p className="text-white/80">{profile.duration_minutes}-minute meeting</p>
      </div>

      <div className="mt-auto pt-8">
        <div className="text-sm text-white/90 bg-white/10 border border-white/15 rounded-xl p-4">
          Select a date & time and confirm your details to book instantly.
        </div>
      </div>
    </div>
  );
}
