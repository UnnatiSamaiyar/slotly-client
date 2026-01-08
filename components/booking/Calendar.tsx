"use client";

export default function Calendar({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: string | null;
  setSelectedDate: (d: string) => void;
}) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeek = first.getDay();

  const dates = [];

  for (let i = 0; i < startWeek; i++) dates.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = new Date(year, month, d).toISOString().slice(0, 10);
    dates.push(iso);
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
        {dates.map((iso, idx) => (
          <button
            key={idx}
            disabled={!iso}
            onClick={() => iso && setSelectedDate(iso)}
            className={`
              p-2 rounded-lg
              ${iso === selectedDate ? "bg-blue-600 text-white" : "hover:bg-gray-100"}
              ${!iso && "opacity-0 cursor-default"}
            `}
          >
            {iso ? iso.slice(-2) : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
