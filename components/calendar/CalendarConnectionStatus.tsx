<<<<<<< HEAD
//@ts-nocheck
=======
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
"use client";

import { useEffect, useState } from "react";
import GoogleLoginButton from "../auth/GoogleLoginButton";

export default function CalendarConnectionStatus({ userSub }: { userSub: string }) {
  const [connected, setConnected] = useState<boolean | null>(null);

  const fetchStatus = async () => {
<<<<<<< HEAD
    const res = await fetch(`https://api.slotly.io/auth/calendar-status?user_sub=${userSub}`);
    const data = await res.json();
    setConnected(data.calendar_connected);
  };
=======
    const res = await fetch(`http://localhost:8000/auth/calendar-status?user_sub=${userSub}`);
    const data = await res.json();
    setConnected(data.calendar_connected);
  };

>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
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
          <GoogleLoginButton onSuccess={fetchStatus} />
        </div>
      )}
    </div>
  );
}
<<<<<<< HEAD

=======
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
