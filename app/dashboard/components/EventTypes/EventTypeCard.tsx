// // src/app/dashboard/components/EventTypes/EventTypeCard.tsx
// "use client";
// import React from "react";
// import { EventType } from "../../types";

// export default function EventTypeCard({ item }: { item: EventType }) {
//   return (
//     <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all bg-white">
//       <div className="flex items-center gap-3">
//         <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${item.color ?? 'from-blue-500 to-indigo-600'} text-white flex items-center justify-center`}>⌚</div>
//         <div>
//           <div className="font-semibold">{item.title}</div>
//           <div className="text-xs text-gray-500">{item.duration_minutes} minutes</div>
//         </div>
//       </div>
//       <button className="text-sm text-blue-600">Edit</button>
//     </div>
//   );
// }










// // src/app/dashboard/components/EventTypes/EventTypeCard.tsx
// "use client";
// import React from "react";
// import { EventType } from "../../types";

// export default function EventTypeCard({ item }: { item: EventType }) {
//   return (
//     <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all bg-white">
//       <div className="flex items-center gap-3">
        
//         {/* Static color for now (no color in DB) */}
//         <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
//           ⌚
//         </div>

//         <div>
//           <div className="font-semibold">{item.title}</div>
//           <div className="text-xs text-gray-500">{item.duration} minutes</div>
          
//           {/* Show location also */}
//           {item.location && (
//             <div className="text-xs text-gray-400">{item.location}</div>
//           )}
//         </div>

//       </div>

//       <button className="text-sm text-blue-600">Edit</button>
//     </div>
//   );
// }









// // src/app/dashboard/components/EventTypes/EventTypeCard.tsx
// "use client";
// import React from "react";
// import { EventType } from "../../types";
// import { Edit3 } from "lucide-react";

// export default function EventTypeCard({
//   item,
//   onEdit,
// }: {
//   item: EventType;
//   onEdit: (item: EventType) => void;
// }) {
//   return (
//     <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 shadow-sm bg-white hover:shadow-lg transition-shadow">
//       <div className="flex items-center gap-4">
//         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow">
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//             <path d="M12 7v5l3 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//             <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
//           </svg>
//         </div>

//         <div>
//           <div className="text-sm font-semibold text-slate-800">{item.title}</div>
//           <div className="text-xs text-slate-500 mt-1">
//             {item.duration} minutes
//             {item.location ? (
//               <span className="block text-[11px] text-slate-400 mt-1">{item.location}</span>
//             ) : null}
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <button
//           onClick={() => onEdit(item)}
//           className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 rounded-md flex items-center gap-2"
//           aria-label={`Edit ${item.title}`}
//         >
//           <Edit3 className="w-4 h-4" />
//           <span className="hidden sm:inline">Edit</span>
//         </button>
//       </div>
//     </div>
//   );
// }








"use client";
import React from "react";
import { EventType } from "../../types";
import { Edit3, Link as LinkIcon, Copy } from "lucide-react";

export default function EventTypeCard({
  item,
  onEdit,
}: {
  item: EventType;
  onEdit: (item: EventType) => void;
}) {
  // Public booking link (username will come from future profile page)
  const username = "tushar"; // TODO: replace with real dynamic user.username
  const bookingUrl = `https://slotly.io/${username}/${item.slug}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(bookingUrl);
  }

  return (
    <div className="flex flex-col p-4 rounded-xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 7v5l3 2"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.2"
              />
            </svg>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-800">{item.title}</div>
            <div className="text-xs text-slate-500 mt-1">
              {item.duration} minutes
              {item.location && (
                <span className="block text-[11px] text-slate-400 mt-1">
                  {item.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onEdit(item)}
          className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 rounded-md flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>

      {/* Public Booking Link */}
      <div className="mt-3 flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-sm border">
        <div className="flex items-center gap-2 text-slate-600 overflow-hidden">
          <LinkIcon className="w-4 h-4" />
          <span className="truncate">{bookingUrl}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2 hover:bg-slate-200 rounded-md"
        >
          <Copy className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
