"use client";

import React, { useEffect, useMemo, useState } from "react";

type Props = {
  /** A single human-readable location string that will be stored/sent to backend */
  value: string;
  onChange: (locationString: string) => void;
  compact?: boolean;
};

const VENUE_TYPES = [
  { value: "office", label: "Office" },
  { value: "client_office", label: "Client office" },
  { value: "coworking", label: "Co-working space" },
  { value: "cafe", label: "Cafe" },
  { value: "hotel", label: "Hotel lobby" },
  { value: "onsite", label: "On-site (store/factory/site)" },
  { value: "other", label: "Other" },
];

function normalizeSpaces(s: string) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

function buildLocationString(params: { venueType: string; venueName: string; mapsUrl: string }) {
  const vtLabel = VENUE_TYPES.find((v) => v.value === params.venueType)?.label || "Location";
  const venueName = normalizeSpaces(params.venueName);
  const mapsUrl = normalizeSpaces(params.mapsUrl);

  const head = venueName ? `${vtLabel}: ${venueName}` : vtLabel;
  return mapsUrl ? `${head} (${mapsUrl})` : head;
}

export default function LocationSelector({ value, onChange, compact }: Props) {
  const [venueType, setVenueType] = useState(VENUE_TYPES[0].value);
  const [venueName, setVenueName] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");

  // Keep existing saved string (do not parse). If present, preserve it by setting "Other".
  useEffect(() => {
    if (!value) return;
    setVenueType("other");
    // Best-effort: keep visible info in venue name so user doesn't lose it.
    setVenueName(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const composed = useMemo(() => {
    return buildLocationString({ venueType, venueName, mapsUrl });
  }, [venueType, venueName, mapsUrl]);

  useEffect(() => {
    onChange(normalizeSpaces(composed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composed]);

  const stack = compact ? "space-y-3" : "space-y-3";

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">Location</div>
          <div className="text-xs text-gray-500">Choose a venue and share a Maps link (optional).</div>
        </div>
      </div>

      <div className={`mt-4 ${stack}`}>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Venue type</label>
          <select
            value={venueType}
            onChange={(e) => setVenueType(e.target.value)}
            className="w-full rounded-lg border p-3 bg-white shadow-sm"
          >
            {VENUE_TYPES.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Venue name</label>
          <input
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            placeholder="e.g., Slotly HQ / Blue Tokai"
            className="w-full rounded-lg border p-3 bg-white shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Google Maps link (optional)</label>
          <input
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            placeholder="https://maps.google.com/..."
            className="w-full rounded-lg border p-3 bg-white shadow-sm"
            inputMode="url"
          />
        </div>

        <div className="rounded-lg bg-gray-50 border p-3">
          <div className="text-[11px] font-medium text-gray-600">What invitees will see</div>
          <div className="mt-1 text-sm text-gray-900 break-words">{composed || "—"}</div>
        </div>
      </div>
    </div>
  );
}
