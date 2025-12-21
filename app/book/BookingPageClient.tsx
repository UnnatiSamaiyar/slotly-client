"use client";

import { useSearchParams } from "next/navigation";
import BookingForm from "../../components/booking/BookingForm";

export default function BookingPageClient() {
  const sp = useSearchParams();
  const userSub = sp.get("user_sub") || "";

  if (!userSub) return <div className="p-6">Missing user_sub</div>;

  return (
    <div className="min-h-screen w-full flex bg-gray-100">
      <div className="absolute top-0 left-0 w-full bg-white shadow-sm border-b p-6">
        <h1 className="text-2xl font-semibold">Book a Meeting</h1>
        <p className="text-sm text-gray-500">
          Create a meeting and invite someone — both calendars will get the event.
        </p>
      </div>

      <div className="w-full flex pt-32">
        <div className="flex-1 px-10 pb-10">
          <BookingForm userSub={userSub} />
        </div>
      </div>
    </div>
  );
}
