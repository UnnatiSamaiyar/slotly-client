// // src/app/dashboard/components/Events/EventCard.tsx
// "use client";
// import React from "react";
// import { motion } from "framer-motion";
// import { CalendarEvent } from "../../types";
// import { formatEventDate } from "../Calendar/CalendarHelpers";
// import { CheckCircle } from "lucide-react";

// export default function EventCard({ event }: { event: CalendarEvent }) {
//   return (
//     <motion.div layout initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white">
//       <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center"><CheckCircle className="w-5 h-5" /></div>
//       <div className="flex-1">
//         <div className="flex items-center justify-between">
//           <div className="font-semibold">{event.summary}</div>
//           {/* <div className="text-sm text-gray-400">{formatEventDate(event.start)}</div> */}

//           <div className="text-sm text-gray-400">
//   {event.start ? new Date(event.start).toLocaleString() : ""}
// </div>

//         </div>
//         <div className="text-sm text-gray-500">{event.location}</div>
//         {event.htmlLink && <a href={event.htmlLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600">Open in Google Calendar</a>}
//       </div>
//     </motion.div>
//   );
// }











// src/app/dashboard/components/Events/EventCard.tsx
"use client";

import React from "react";
import { CalendarEvent } from "../../types";

export default function EventCard({ event }: { event: CalendarEvent }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white hover:bg-gray-50 cursor-pointer">
      <div className="font-semibold text-sm">{event.summary}</div>
      <div className="text-sm text-gray-500">
  {events.filter(e => isSameISODate(e.start, selectedDate)).length} events
</div>
      <div className="text-xs text-blue-500 underline mt-2">
        <a href={event.htmlLink} target="_blank">Open in Google Calendar</a>
      </div>
    </div>
  );
}
