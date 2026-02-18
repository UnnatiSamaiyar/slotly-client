// "use client";

// import { useSearchParams } from "next/navigation";
// import BookingForm from "../../components/booking/BookingForm";

// export default function BookingPageClient() {
//   const sp = useSearchParams();
//   const userSub = sp.get("user_sub") || "";

//   if (!userSub) return <div className="p-6">Missing user_sub</div>;

//   return (
//     <div className="min-h-screen w-full flex bg-gray-100">
//       <div className="absolute top-0 left-0 w-full bg-white shadow-sm border-b p-6">
//         <h1 className="text-2xl font-semibold">Book a Meeting</h1>
//         <p className="text-sm text-gray-500">
//           Create a meeting and invite someone — both calendars will get the event.
//         </p>
//       </div>

//       <div className="w-full flex pt-32">
//         <div className="flex-1 px-10 pb-10">
//           <BookingForm userSub={userSub} />
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import BookingForm from "../../components/booking/BookingForm";
import Sidebar from "@/app/dashboard/components/Sidebar/Sidebar";

export default function BookingPageClient() {
  const sp = useSearchParams();
  const [open, setOpen] = useState(true);

  const userSub = sp.get("user_sub");

  if (userSub === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Invalid booking link
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Please reopen the booking link from the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* FIXED SIDEBAR */}
      <div className="fixed inset-y-0 left-0 z-40">
        <Sidebar
          open={open}
          onToggle={() => setOpen((prev) => !prev)}
        />
      </div>

      {/* RIGHT SIDE */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${open ? "ml-64" : "ml-20"
          }`}
      >
        {/* HEADER */}
        <header className="bg-white border-b sticky top-0 z-20">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-semibold text-gray-900">
              Create a meeting
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Invite someone and we’ll add the event to both calendars.
            </p>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-8">
            <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-6">
              <BookingForm userSub={userSub} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
