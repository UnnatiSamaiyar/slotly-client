"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  getAllTimezones,
  getBrowserTimezone,
  getPreferredTimezone,
  isValidTimezone,
  setPreferredTimezone,
  subscribeTimezoneChange,
} from "../../../lib/timezone";

/**
 * Dynamic, browser-driven timezone selector.
 * - Default: browser timezone
 * - Override: localStorage (no DB persistence)
 * - Uses Intl.supportedValuesOf("timeZone") when available (dynamic list)
 */
export default function TimezonePicker() {
  const zones = useMemo(() => getAllTimezones(), []);

  const [tz, setTz] = useState<string>(() => getPreferredTimezone() || getBrowserTimezone());
  const [draft, setDraft] = useState<string>(tz);

  // Keep in sync if timezone is changed elsewhere
  useEffect(() => {
    return subscribeTimezoneChange(() => {
      const next = getPreferredTimezone() || getBrowserTimezone();
      setTz(next);
      setDraft(next);
    });
  }, []);

  const apply = (next: string) => {
    const cleaned = String(next || "").trim();
    if (!cleaned) return;
    if (!isValidTimezone(cleaned)) return;
    setPreferredTimezone(cleaned);
    setTz(cleaned);
    setDraft(cleaned);
  };

  const resetToBrowser = () => {
    const b = getBrowserTimezone();
    setPreferredTimezone(b);
    setTz(b);
    setDraft(b);
  };

  const invalid = draft.trim().length > 0 && !isValidTimezone(draft.trim());

  return (
    <div className="flex flex-col items-end">
      <label className="text-[11px] text-gray-500 mb-1">Timezone</label>

      <div className="flex items-center gap-2">
        {/* Searchable input via datalist */}
        <div className="relative">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => apply(draft)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply(draft);
              }
              if (e.key === "Escape") {
                setDraft(tz);
              }
            }}
            list="slotly-timezones"
            spellCheck={false}
            className={
              "w-[220px] px-3 py-2 rounded-xl border bg-white text-sm outline-none " +
              (invalid ? "border-red-300" : "border-gray-200")
            }
            title="Display timezone (not stored in DB)"
            aria-label="Timezone"
          />

          <datalist id="slotly-timezones">
            {/* Ensure current tz is always present */}
            {!zones.includes(tz) && <option value={tz} />}
            {zones.map((z) => (
              <option key={z} value={z} />
            ))}
          </datalist>
        </div>

        <button
          type="button"
          onClick={resetToBrowser}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm hover:bg-gray-50"
          title="Reset to browser timezone"
        >
          Auto
        </button>
      </div>

      {invalid && (
        <div className="mt-1 text-[11px] text-red-500">Invalid timezone. Pick from the list.</div>
      )}

      {!invalid && tz !== getBrowserTimezone() && (
        <div className="mt-1 text-[11px] text-gray-500">Showing times in {tz}</div>
      )}
    </div>
  );
}
