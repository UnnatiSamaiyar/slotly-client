"use client";

import { useEffect, useState } from "react";
import GoogleLoginButton from "../auth/GoogleLoginButton";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8  000").replace(/\/$/, "");

export default function CalendarConnectionStatus({ userSub }: { userSub: string }) {
  const [connected, setConnected] = useState<boolean | null>(null);

  const fetchStatus = async () => {
    const res = await fetch(`${API_BASE}/auth/calendar-status?user_sub=${encodeURIComponent(userSub)}`);
    const data = await res.json();
    setConnected(data.calendar_connected);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (connected === null) {
    return <p>Checking calendar connection...</p>;
  }

  return (
    <div className="p-6 border rounded-xl bg-white shadow">
      <h2 className="text-xl font-semibold mb-3">Google Calendar Status</h2>

      {connected ? (
        <p className="text-green-600 font-medium">✓ Connected</p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-red-600 font-medium">✗ Not Connected</p>
          <GoogleLoginButton variant="calendar" label="Connect Google Calendar" returnTo="/dashboard" />
          <p className="text-xs text-slate-500">
            Google may show a warning because verification is in progress. Connect only if you need calendar sync.
          </p>
        </div>
      )}
    </div>
  );
}
