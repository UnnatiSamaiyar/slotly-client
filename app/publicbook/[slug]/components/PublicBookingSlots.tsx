export default function PublicBookingSlots({ slots, selectedSlot, setSelectedSlot }: any) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select a Time</h2>

      <div className="max-h-64 overflow-y-auto pr-2 space-y-4">

        {Object.entries(
          slots.reduce((acc: any, slot: string) => {
            const d = new Date(slot).toDateString();
            acc[d] = acc[d] || [];
            acc[d].push(slot);
            return acc;
          }, {})
        ).map(([date, daySlots]: any) => (
          <div key={date}>
            <h3 className="text-sm text-gray-500 mb-2">{date}</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {daySlots.map((slot: string) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all
                      ${isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow"
                        : "border-gray-300 hover:bg-gray-100"}
                    `}
                  >
                    {new Date(slot).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
