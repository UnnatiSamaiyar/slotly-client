// src/app/dashboard/hooks/useUserProfile.ts
import { useEffect, useState } from "react";
import { UserProfile } from "../types";
import * as api from "../api/user";

export function useUserProfile(userSub: string | null) {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userSub) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await api.fetchUserProfile(userSub);
        if (!mounted) return;
        setData(r);
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || String(err));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [userSub]);

  return { data, loading, error } as const;
}
