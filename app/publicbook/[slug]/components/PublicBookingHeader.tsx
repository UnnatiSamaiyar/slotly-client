export default function PublicBookingHeader({ profile }: any) {
  return (
    <div className="w-full md:w-1/3 bg-gradient-to-b from-blue-600 to-indigo-600 text-white p-10 flex flex-col justify-between">

      <div>
        <p className="text-white/70 text-sm">Booking with</p>
        <h1 className="text-3xl font-bold mt-2">{profile.host_name || "Your Host"}</h1>

        <p className="mt-6 text-lg font-semibold">{profile.title}</p>
        <p className="text-white/80">
          {profile.duration_minutes}-minute meeting
        </p>
      </div>

      <div className="mt-10 text-sm text-white/90">
        Select a time on the right and confirm your details to book instantly.
      </div>

    </div>
  );
}
