"use client";

import React, { useEffect, useMemo, useState } from "react";

type Props = {
  /** A single human-readable location string that will be stored/sent to backend */
  value: string;
  onChange: (locationString: string) => void;
  compact?: boolean;
};

// Real-world venue types that match how meetings happen in practice.
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

function buildLocationString(params: {
  venueType: string;
  venueName: string;
  addressLine: string;
  city: string;
  region: string;
  country: string;
  mapsUrl: string;
}) {
  const vtLabel =
    VENUE_TYPES.find((v) => v.value === params.venueType)?.label || "Location";

  const venueName = normalizeSpaces(params.venueName);
  const addressLine = normalizeSpaces(params.addressLine);
  const city = normalizeSpaces(params.city);
  const region = normalizeSpaces(params.region);
  const country = normalizeSpaces(params.country);
  const mapsUrl = normalizeSpaces(params.mapsUrl);

  const placeBits = [addressLine, city, region, country].filter(Boolean);
  const place = placeBits.join(", ");

  const head = venueName ? `${vtLabel}: ${venueName}` : vtLabel;
  const withAddress = place ? `${head} — ${place}` : head;

  return mapsUrl ? `${withAddress} (${mapsUrl})` : withAddress;
}

/**
 * LocationSelector
 * - Uses a structured, real-world set of fields (venue type + address components)
 * - Outputs a single "location" string compatible with the current backend schema
 */
export default function LocationSelector({ value, onChange, compact }: Props) {
  // We keep internal fields and continuously emit a single string.
  const [venueType, setVenueType] = useState(VENUE_TYPES[0].value);
  const [venueName, setVenueName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("India");
  const [mapsUrl, setMapsUrl] = useState("");

  // If consumer passes a pre-filled string (e.g., saved), keep it but do not
  // attempt to parse back reliably.
  useEffect(() => {
    // Only initialize once if there is a value; user can then edit fields.
    if (!value) return;
    // If user already typed something earlier, keep it visible through "Other".
    setVenueType("other");
    // Put the whole string into addressLine as a best-effort so it doesn't get lost.
    setAddressLine(value);
    // Do not override country/city/region.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const composed = useMemo(() => {
    return buildLocationString({
      venueType,
      venueName,
      addressLine,
      city,
      region,
      country,
      mapsUrl,
    });
  }, [venueType, venueName, addressLine, city, region, country, mapsUrl]);

  useEffect(() => {
    onChange(normalizeSpaces(composed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composed]);

  const grid = compact ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3";

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">Location</div>
          <div className="text-xs text-gray-500">
            Use a real address so invitees know exactly where to go.
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
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

        <div className={grid}>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Venue name (optional)</label>
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
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Full address</label>
          <input
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            placeholder="Street, building, landmark"
            className="w-full rounded-lg border p-3 bg-white shadow-sm"
          />
        </div>

        <div className={grid}>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Noida"
              className="w-full rounded-lg border p-3 bg-white shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">State / Region</label>
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g., Uttar Pradesh"
              className="w-full rounded-lg border p-3 bg-white shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g., India"
            className="w-full rounded-lg border p-3 bg-white shadow-sm"
          />
        </div>

        <div className="rounded-lg bg-gray-50 border p-3">
          <div className="text-[11px] font-medium text-gray-600">What invitees will see</div>
          <div className="mt-1 text-sm text-gray-900 break-words">
            {composed || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
