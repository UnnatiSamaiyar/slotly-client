// "use client";

// import React from "react";
// import BookingForm from "../../components/booking/BookingForm";

// export default function BookingPage() {
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-start justify-center p-8">
//       <div className="w-full max-w-3xl">
//         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
//           <h1 className="text-2xl font-semibold">Book a meeting</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Create a meeting and invite someone — both calendars will get the event.
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//           <BookingForm />
//         </div>
//       </div>
//     </div>
//   );
// }






"use client";

import React from "react";
import BookingForm from "../../components/booking/BookingForm";

export default function BookingPage() {
  return (
    <div className="min-h-screen w-full flex bg-gray-100">

      {/* LEFT HEADER BAR (optional, nice top area) */}
      <div className="absolute top-0 left-0 w-full bg-white shadow-sm border-b p-6">
        <h1 className="text-2xl font-semibold">Book a Meeting</h1>
        <p className="text-sm text-gray-500">
          Create a meeting and invite someone — both calendars will get the event.
        </p>
      </div>

      {/* MAIN FULLSCREEN LAYOUT */}
      <div className="w-full flex pt-32"> 
        {/* ← this pushes content below header */}

        {/* RIGHT SIDE FORM (FULL WIDTH NOW) */}
        <div className="flex-1 px-10 pb-10">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
