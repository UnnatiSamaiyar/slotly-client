"use client";

<<<<<<< HEAD
import React, { useEffect, useMemo, useRef, useState } from "react";
import LocationSelector from "@/components/shared/LocationSelector";
=======
import React, { useEffect, useMemo, useState } from "react";
import LocationSelector from "@/components/shared/LocationSelector";

function normalizeSpaces(s: string) {
  return String(s || "").replace(/\s+/g, " ").trim();
}
>>>>>>> 6f1a8f49dde73878af27096bfbd1418fcc8ff0bb

function normalizeSpaces(s: string) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

function SelectedSummary({ iso }: any) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const day = d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
      <div className="mb-3 rounded-lg border bg-gray-50 px-3 py-2 text-sm">
        <div className="text-gray-500">Selected slot</div>
        <div className="font-semibold text-gray-900">
          {day} • {time}
        </div>
      </div>
    );
  } catch {
    return null;
  }
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Dialog */}
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <div
          className={[
            "w-full max-w-lg bg-white rounded-2xl shadow-2xl border overflow-hidden",
            "transition-all duration-200 ease-out",
            "animate-in fade-in zoom-in-95",
          ].join(" ")}
        >
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div className="font-semibold">{title || "Modal"}</div>
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 rounded-md hover:bg-gray-100 text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>

          <div className="px-5 py-4 border-t bg-white flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicBookingForm({
  slug,
  profile,
  selectedSlotISO,
  onBooked,
  heightClass = "h-[520px]",
}: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
<<<<<<< HEAD
  const [meetingMode, setMeetingMode] = useState<"google_meet" | "in_person">(
    "google_meet"
  );

=======
  const [meetingMode, setMeetingMode] = useState<"google_meet" | "in_person">("google_meet");
>>>>>>> 6f1a8f49dde73878af27096bfbd1418fcc8ff0bb
  const [location, setLocation] = useState("");
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const viewerTz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

<<<<<<< HEAD
  // prevent auto-open modal on first render
  const didMountRef = useRef(false);

=======
>>>>>>> 6f1a8f49dde73878af27096bfbd1418fcc8ff0bb
  useEffect(() => {
    const savedName = localStorage.getItem("slotly_name");
    const savedEmail = localStorage.getItem("slotly_email");
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    didMountRef.current = true;
  }, []);

  // ✅ Auto-open modal when user selects "in_person"
  useEffect(() => {
    if (!didMountRef.current) return;

    if (meetingMode === "in_person") {
      // open smoothly after dropdown closes
      const t = setTimeout(() => setLocationModalOpen(true), 120);
      return () => clearTimeout(t);
    }

    if (meetingMode === "google_meet") {
      // close modal + clear location
      setLocationModalOpen(false);
      setLocation("");
    }
  }, [meetingMode]);

  const locationPreview = useMemo(() => {
    const s = normalizeSpaces(location);
    if (!s) return "No location set";
    return s.length > 54 ? s.slice(0, 54) + "…" : s;
  }, [location]);

  async function submit() {
    setMessage(null);
    if (!selectedSlotISO) return setMessage("Please select a time slot.");
    if (!name || !email) return setMessage("Name & email required.");

    const normalizedLocation = normalizeSpaces(location);
    if (meetingMode === "in_person" && normalizedLocation.length < 10) {
<<<<<<< HEAD
      // if not set, open modal immediately
      setLocationModalOpen(true);
      return setMessage("Please provide a complete meeting location (full address).");
=======
      return setMessage(
        "Please provide a complete, real-world meeting location (full address)."
      );
>>>>>>> 6f1a8f49dde73878af27096bfbd1418fcc8ff0bb
    }

    setLoading(true);
    try {
      const payload = {
        profile_slug: slug,
        guest_name: name,
        attendees: [email],
        start_iso: selectedSlotISO,
        title: profile?.title,
        timezone: viewerTz,
        meeting_mode: meetingMode,
        location: meetingMode === "in_person" ? normalizedLocation : null,
      };

      const res = await fetch("https://api.slotly.io/public/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
<<<<<<< HEAD
      if (!res.ok) throw new Error(body?.detail ?? "Server error");
=======
      if (!res.ok)
        throw new Error(body?.detail ?? JSON.stringify(body) ?? "Server error");
>>>>>>> 6f1a8f49dde73878af27096bfbd1418fcc8ff0bb

      localStorage.setItem("slotly_name", name);
      localStorage.setItem("slotly_email", email);

      setMessage("Booking confirmed! Check your email for details.");
      if (onBooked) onBooked();
    } catch (e: any) {
      setMessage("Booking failed: " + (e.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !!selectedSlotISO && !loading;

  return (
    <>
      <div className={`bg-white rounded-xl border shadow-sm ${heightClass} flex flex-col`}>
        {/* header fixed */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold">Your Details</div>
          <div className="text-xs text-gray-500">{viewerTz}</div>
        </div>

<<<<<<< HEAD
        {/* scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-24">
          <SelectedSummary iso={selectedSlotISO} />

          <input
            className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

          <input
            className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <div className="mb-3">
            <label className="text-sm font-medium block mb-1">Meeting mode</label>
            <select
              value={meetingMode}
              onChange={(e) => setMeetingMode(e.target.value as any)}
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none"
            >
              <option value="google_meet">Google Meet</option>
              <option value="in_person">In-person</option>
            </select>
          </div>

          {/* compact location summary (no extra click needed) */}
          {meetingMode === "in_person" && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Location</label>
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(true)}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Edit
                </button>
              </div>

              <div className="rounded-lg border bg-white px-3 py-2 text-sm text-gray-700">
                {locationPreview}
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Selecting In-person opens location automatically.
              </div>
            </div>
          )}

          {message && (
            <div
              className={[
                "mt-3 text-sm text-center rounded-lg px-3 py-2 border",
                message.toLowerCase().includes("failed")
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700",
              ].join(" ")}
            >
              {message}
            </div>
          )}
        </div>

        {/* sticky CTA */}
        <div className="p-4 border-t bg-white">
          <button
            onClick={submit}
            disabled={!canSubmit}
            className={[
              "w-full py-3 rounded-lg font-semibold transition",
              canSubmit
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed",
            ].join(" ")}
          >
            {loading ? "Booking…" : canSubmit ? "Confirm Booking" : "Select time first"}
          </button>
        </div>
      </div>

      {/* Location Modal */}
      <Modal
        open={locationModalOpen}
        title="Set meeting location"
        onClose={() => setLocationModalOpen(false)}
      >
        <LocationSelector value={location} onChange={setLocation} compact />

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setLocationModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            Save location
          </button>
        </div>
      </Modal>
    </>
=======
      <input
        className="w-full p-3 border rounded-lg mb-3 focus:ring-1 focus:ring-indigo-400 outline-none"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full p-3 border rounded-lg mb-3 focus:ring-1 focus:ring-indigo-400 outline-none"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="mb-3">
        <label className="text-sm font-medium block mb-1">Meeting mode</label>
        <select
          value={meetingMode}
          onChange={(e) => setMeetingMode(e.target.value as any)}
          className="p-2 border rounded-lg w-full"
        >
          <option value="google_meet">Google Meet</option>
          <option value="in_person">In-person</option>
        </select>
      </div>

      {meetingMode === "in_person" && (
        <div className="mb-3">
          <LocationSelector value={location} onChange={setLocation} compact />
        </div>
      )}

      <button
        onClick={submit}
        disabled={loading || !selectedSlotISO}
        className={`w-full py-3 rounded-lg text-white font-semibold ${
          !selectedSlotISO || loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading
          ? "Booking…"
          : selectedSlotISO
          ? "Confirm Booking"
          : "Select time first"}
      </button>

      {message && (
        <div className="mt-3 text-sm text-center text-gray-700">{message}</div>
      )}
    </div>
>>>>>>> 6f1a8f49dde73878af27096bfbd1418fcc8ff0bb
  );
}
