// // src/app/dashboard/hooks/useEventTypes.ts
// import { useEffect, useState } from "react";
// import { EventType } from "../types";
// import * as api from "../api/eventTypes";

// export function useEventTypes(userSub: string | null) {
//   const [data, setData] = useState<EventType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!userSub) return;
//     let mounted = true;
//     (async () => {
//       setLoading(true); setError(null);
//       try {
//         const r = await api.fetchEventTypes(userSub);
//         if (!mounted) return;
//         setData(r);
//       } catch (err: any) {
//         if (!mounted) return;
//         setError(err.message || String(err));
//         setData([]);
//       } finally { if (!mounted) return; setLoading(false); }
//     })();
//     return () => { mounted = false; };
//   }, [userSub]);

//   return { data, loading, error } as const;
// }









// src/app/dashboard/hooks/useEventTypes.ts
import { useCallback, useEffect, useState } from "react";
import { EventType } from "../types";
import * as api from "../api/eventTypes";

export function useEventTypes(userSub: string | null) {
  const [items, setItems] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!userSub) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await api.fetchEventTypes(userSub);
      setItems(list);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [userSub]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // create
  const create = useCallback(async (payload: { title: string; duration: number; location?: string; availability_json?: string }) => {
    if (!userSub) throw new Error("no user");
    setLoading(true);
    try {
      await api.createEventType(userSub, payload);
      await fetchAll();
    } finally {
      setLoading(false);
    }
  }, [userSub, fetchAll]);

  const update = useCallback(async (id: number, payload: Partial<{ title: string; duration: number; location: string; availability_json: string }>) => {
    if (!userSub) throw new Error("no user");
    setLoading(true);
    try {
      await api.updateEventType(userSub, id, payload);
      await fetchAll();
    } finally {
      setLoading(false);
    }
  }, [userSub, fetchAll]);

  const remove = useCallback(async (id: number) => {
    if (!userSub) throw new Error("no user");
    setLoading(true);
    try {
      await api.deleteEventType(userSub, id);
      await fetchAll();
    } finally {
      setLoading(false);
    }
  }, [userSub, fetchAll]);

  return { items, loading, error, refresh: fetchAll, create, update, remove } as const;
}
