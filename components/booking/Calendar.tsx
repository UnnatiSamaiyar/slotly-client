// "use client";

// export default function Calendar({
//   selectedDate,
//   setSelectedDate,
// }: {
//   selectedDate: string | null;
//   setSelectedDate: (d: string) => void;
// }) {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth();

//   const first = new Date(year, month, 1);
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const startWeek = first.getDay();

//   const dates = [];

//   for (let i = 0; i < startWeek; i++) dates.push(null);

//   for (let d = 1; d <= daysInMonth; d++) {
//     const iso = new Date(year, month, d).toISOString().slice(0, 10);
//     dates.push(iso);
//   }

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md">
//       <h2 className="text-lg font-semibold mb-4">Select a Date</h2>

//       <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 mb-3">
//         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//           <div key={d}>{d}</div>
//         ))}
//       </div>

//       <div className="grid grid-cols-7 gap-2">
//         {dates.map((iso, idx) => (
//           <button
//             key={idx}
//             disabled={!iso}
//             onClick={() => iso && setSelectedDate(iso)}
//             className={`
//               p-2 rounded-lg
//               ${iso === selectedDate ? "bg-blue-600 text-white" : "hover:bg-gray-100"}
//               ${!iso && "opacity-0 cursor-default"}
//             `}
//           >
//             {iso ? iso.slice(-2) : ""}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";

type BookingWindow = {
  enabled?: boolean;
  start_date?: string;
  end_date?: string;
} | null;

function toLocalDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default function Calendar({
  selectedDate,
  setSelectedDate,
  bookingWindow = null,
  maxDaysAhead = 60,
}: {
  selectedDate: string | null;
  setSelectedDate: (d: string) => void;
  bookingWindow?: BookingWindow;
  maxDaysAhead?: number;
  timezone?: string;
}) {
  const today = new Date();
  const todayIso = toLocalDateString(today);
  const maxIso = toLocalDateString(addDays(today, Number(maxDaysAhead || 60)));

  const year = today.getFullYear();
  const month = today.getMonth();

  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeek = first.getDay();

  const dates: Array<string | null> = [];

  for (let i = 0; i < startWeek; i++) dates.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toLocalDateString(new Date(year, month, d));
    dates.push(iso);
  }

  function isDateDisabled(iso: string | null) {
    if (!iso) return true;

    if (iso < todayIso) return true;
    if (iso > maxIso) return true;

    if (bookingWindow?.enabled) {
      const start = bookingWindow.start_date || "";
      const end = bookingWindow.end_date || "";

      if (start && iso < start) return true;
      if (end && iso > end) return true;
    }

    return false;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Select a Date</h2>

      <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 mb-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dates.map((iso, idx) => {
          const disabled = isDateDisabled(iso);

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => iso && !disabled && setSelectedDate(iso)}
              className={`
                p-2 rounded-lg
                ${iso === selectedDate ? "bg-blue-600 text-white" : "hover:bg-gray-100"}
                ${!iso && "opacity-0 cursor-default"}
                ${disabled && iso ? "opacity-40 cursor-not-allowed hover:bg-transparent" : ""}
              `}
            >
              {iso ? iso.slice(-2) : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}