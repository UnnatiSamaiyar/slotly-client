export default function PublicBookingSlots({
  slots,
  selectedSlot,
  setSelectedSlot,
}: any) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select a Time</h2>

      <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
        {Object.entries(
          slots.reduce((acc: any, slot: any) => {
            const slotIso = typeof slot === "string" ? slot : slot?.iso || slot;
            const d = new Date(slotIso).toDateString();
            acc[d] = acc[d] || [];
            acc[d].push(slot);
            return acc;
          }, {})
        ).map(([date, daySlots]: any) => (
          <div key={date}>
            <h3 className="text-sm text-gray-500 mb-2">{date}</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {daySlots.map((slot: any) => {
                const iso = typeof slot === "string" ? slot : slot?.iso || slot;
                const available =
                  typeof slot === "string" ? true : slot?.available ?? true;

                const isSelected = selectedSlot === iso;
                const disabled = !available;

                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && setSelectedSlot(iso)}
                    className={[
                      "px-3 py-2 rounded-lg border text-sm transition-all",
                      isSelected && !disabled
                        ? "bg-blue-600 text-white border-blue-600 shadow"
                        : disabled
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                        : "border-gray-300 hover:bg-gray-100",
                    ].join(" ")}
                  >
                    {new Date(iso).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
