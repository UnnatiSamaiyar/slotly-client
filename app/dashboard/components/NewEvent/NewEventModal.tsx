





//@ts-nocheck
"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_CALENDAR_API || "http://api.slotly.io";

export default function NewEventModal({ open, onClose, user }) {
  const { toast } = useToast();

  const [form, setForm] = useState({
    invitee_email: "",
    title: "",
    date: "",
    time: "",
    duration: 30,
    description: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const startISO = new Date(`${form.date}T${form.time}`).toISOString();

    const res = await fetch(`${API_BASE}/calendar/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_sub: user.sub,
        invitee_email: form.invitee_email,
        title: form.title,
        start: startISO,
        duration: form.duration,
        description: form.description
      }),
    });

    const data = await res.json();
    console.log("CREATE EVENT RESPONSE:", data);

    if (res.ok) {
      toast({ title: "Meeting created", description: "Your meeting has been scheduled successfully.", variant: "success" });
      onClose();
      setTimeout(() => window.location.reload(), 700);
    } else {
      toast({ title: "Create failed", description: data?.error || "Unable to create meeting. Please try again.", variant: "error" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[500px]">
        <h2 className="text-xl font-semibold mb-4">Book a Meeting</h2>

        <div className="space-y-3">
          <input
            name="invitee_email"
            placeholder="Invitee email"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="title"
            placeholder="Event title"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            type="time"
            name="time"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <select
            name="duration"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          >
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="60">60 min</option>
          </select>

          <textarea
            name="description"
            placeholder="Optional notes"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-3 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Create booking & invite
          </button>
        </div>
      </div>
    </div>
  );
}
