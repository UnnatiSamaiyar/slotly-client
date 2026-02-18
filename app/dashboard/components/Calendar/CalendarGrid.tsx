// // src/app/dashboard/components/Calendar/CalendarGrid.tsx
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { ISODate } from "../../types";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { buildDayTooltip, toISODateLocal } from "./CalendarHelpers";

// type Props = {
//   selectedDate: ISODate;
//   setSelectedDate: (d: ISODate) => void;
//   eventsByDate: Record<string, any[]>;
// };

// function monthLabel(d: Date) {
//   return d.toLocaleString([], { month: "long", year: "numeric" });
// }

// export default function CalendarGrid({
//   selectedDate,
//   setSelectedDate,
//   eventsByDate,
// }: Props) {
//   const [cursor, setCursor] = useState(() => {
//     const d = new Date(selectedDate);
//     return Number.isNaN(d.getTime()) ? new Date() : d;
//   });

//   useEffect(() => {
//     const d = new Date(selectedDate);
//     if (!Number.isNaN(d.getTime())) setCursor(d);
//   }, [selectedDate]);

//   const year = cursor.getFullYear();
//   const month = cursor.getMonth();

//   const weeks = useMemo(() => {
//     const first = new Date(year, month, 1);
//     const firstDay = first.getDay(); // 0..6 Sun..Sat
//     const startDate = new Date(year, month, 1 - firstDay);

//     const cells: Date[] = [];
//     for (let i = 0; i < 42; i++) {
//       const d = new Date(startDate);
//       d.setDate(startDate.getDate() + i);
//       cells.push(d);
//     }
//     return cells;
//   }, [year, month]);

//   const selected = useMemo(() => new Date(selectedDate), [selectedDate]);
//   const todayISO = useMemo(() => toISODateLocal(new Date()), []);

//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//     <div className="w-full">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-3">
//         <div className="min-w-0">
//           <div className="text-base sm:text-lg font-semibold text-slate-900 truncate">
//             {monthLabel(cursor)}
//           </div>
//         </div>

//         <div className="flex items-center gap-2 shrink-0">
//           {/* Segmented nav */}
//           <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//             <button
//               onClick={() => {
//                 const d = new Date(cursor);
//                 d.setMonth(d.getMonth() - 1);
//                 setCursor(d);
//               }}
//               className="h-10 w-10 flex items-center justify-center hover:bg-gray-50 transition"
//               aria-label="Previous month"
//               type="button"
//             >
//               <ChevronLeft className="w-4 h-4 text-slate-700" />
//             </button>

//             <div className="h-10 w-px bg-gray-200" />

//             <button
//               onClick={() => {
//                 const d = new Date(cursor);
//                 d.setMonth(d.getMonth() + 1);
//                 setCursor(d);
//               }}
//               className="h-10 w-10 flex items-center justify-center hover:bg-gray-50 transition"
//               aria-label="Next month"
//               type="button"
//             >
//               <ChevronRight className="w-4 h-4 text-slate-700" />
//             </button>
//           </div>

//           <button
//             onClick={() => {
//               setSelectedDate(todayISO as ISODate);
//               setCursor(new Date());
//             }}
//             className="h-10 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium transition whitespace-nowrap"
//             type="button"
//           >
//             Today
//           </button>
//         </div>
//       </div>

//       {/* Day headers */}
//       <div className="grid grid-cols-7 gap-1 sm:gap-2">
//         {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
//           <div
//             key={`${d}-${i}`}
//             className="text-[11px] sm:text-xs font-medium text-gray-500 text-center py-1"
//           >
//             {d}
//           </div>
//         ))}

//         {/* Cells */}
//         {weeks.map((d, idx) => {
//           const iso = toISODateLocal(d);
//           const inMonth = d.getMonth() === month;
//           const isSelected = toISODateLocal(selected) === iso;
//           const isToday = iso === todayISO;

//           const dayEvents = eventsByDate?.[iso] || [];
//           const hasEvents = dayEvents.length > 0;
//           const tooltip = hasEvents ? buildDayTooltip(dayEvents, 3) : "";

//           return (
//             <div key={`${iso}-${idx}`} className="flex items-center justify-center">
//               <button
//                 onClick={() => setSelectedDate(iso as ISODate)}
//                 title={tooltip}
//                 type="button"
//                 aria-label={`Select ${iso}`}
//                 className={[
//                   // size + shape
//                   "relative flex items-center justify-center rounded-full",
//                   "h-10 w-10 sm:h-11 sm:w-11",
//                   "text-sm font-medium transition",
//                   "focus:outline-none focus:ring-2 focus:ring-indigo-500/25",

//                   // states
//                   inMonth ? "text-slate-900" : "text-gray-400",
//                   inMonth ? "hover:bg-gray-50" : "hover:bg-gray-50/60",

//                   // selected
//                   isSelected ? "bg-indigo-600 text-white shadow-sm" : "",

//                   // subtle border only when not selected (keeps it clean)
//                   !isSelected ? "border border-transparent hover:border-gray-200" : "border border-indigo-600",
//                 ].join(" ")}
//               >
//                 {d.getDate()}

//                 {/* Today ring (only if not selected) */}
//                 {isToday && !isSelected ? (
//                   <span className="absolute inset-0 rounded-full ring-2 ring-indigo-500/40" />
//                 ) : null}

//                 {/* Event indicator: tiny dot + optional count badge */}
//                 {hasEvents ? (
//                   <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
//                     <span
//                       className={[
//                         "h-1.5 w-1.5 rounded-full",
//                         isSelected ? "bg-white/95" : "bg-indigo-600",
//                       ].join(" ")}
//                     />
//                     {dayEvents.length > 1 ? (
//                       <span
//                         className={[
//                           "text-[10px] leading-none",
//                           isSelected ? "text-white/90" : "text-gray-500",
//                         ].join(" ")}
//                       >
//                         {dayEvents.length}
//                       </span>
//                     ) : null}
//                   </span>
//                 ) : null}
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//     </div>
//   );
// }
// src/app/dashboard/components/Calendar/CalendarGrid.tsx



"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ISODate } from "../../types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildDayTooltip, toISODateLocal } from "./CalendarHelpers";

type Props = {
  selectedDate: ISODate;
  setSelectedDate: (d: ISODate) => void;
  eventsByDate: Record<string, any[]>;
};

function monthLabel(d: Date) {
  return d.toLocaleString([], { month: "long", year: "numeric" });
}

export default function CalendarGrid({
  selectedDate,
  setSelectedDate,
  eventsByDate,
}: Props) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date(selectedDate);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  });

  useEffect(() => {
    const d = new Date(selectedDate);
    if (!Number.isNaN(d.getTime())) setCursor(d);
  }, [selectedDate]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const firstDay = first.getDay();
    const startDate = new Date(year, month, 1 - firstDay);

    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      cells.push(d);
    }
    return cells;
  }, [year, month]);

  const selected = useMemo(() => new Date(selectedDate), [selectedDate]);
  const todayISO = useMemo(() => toISODateLocal(new Date()), []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-slate-900">
          {monthLabel(cursor)}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const d = new Date(cursor);
              d.setMonth(d.getMonth() - 1);
              setCursor(d);
            }}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>

          <button
            onClick={() => {
              const d = new Date(cursor);
              d.setMonth(d.getMonth() + 1);
              setCursor(d);
            }}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>

          <button
            onClick={() => {
              setSelectedDate(todayISO as ISODate);
              setCursor(new Date());
            }}
            className="px-3 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium transition"
          >
            Today
          </button>
        </div>
      </div>

      {/* WEEKDAYS */}
      <div className="grid grid-cols-7 mb-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-xs font-medium text-slate-400 text-center"
          >
            {d}
          </div>
        ))}
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, idx) => {
          const iso = toISODateLocal(d);
          const inMonth = d.getMonth() === month;
          const isSelected = toISODateLocal(selected) === iso;
          const isToday = iso === todayISO;

          const dayEvents = eventsByDate?.[iso] || [];
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={`${iso}-${idx}`}
              onClick={() => setSelectedDate(iso as ISODate)}
              className={[
                "relative h-20 rounded-lg p-2 transition-all duration-200",
                "flex flex-col items-start justify-between border",
                "border-transparent",
                "hover:bg-slate-50",

                !inMonth && "text-slate-300",

                // 🔵 Make event days visible
                hasEvents && !isSelected && "bg-indigo-50 border-indigo-100",

                // 🔷 Selected day stronger
                isSelected && "bg-indigo-600 text-white border-indigo-600",

              ].join(" ")}
            >
            
              {/* DATE NUMBER */}
              <div
                className={[
                  "text-sm font-medium",
                  isToday && !isSelected && "text-indigo-600 font-semibold",
                  isSelected && "text-white",
                ].join(" ")}
              >
                {d.getDate()}
              </div>

              {/* GOOGLE STYLE DOTS */}
              {hasEvents && (
                <div className="w-full space-y-1 mt-1">
                  {dayEvents.slice(0, 2).map((_, i) => (
                    <div
                      key={i}
                      className={[
                        "h-2 w-full rounded",
                        isSelected ? "bg-white" : "bg-indigo-500",
                      ].join(" ")}
                    />
                  ))}

                  {dayEvents.length > 2 && (
                    <div
                      className={[
                        "text-[11px] font-semibold",
                        isSelected ? "text-white/90" : "text-indigo-600",
                      ].join(" ")}
                    >
                      +{dayEvents.length - 2}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}