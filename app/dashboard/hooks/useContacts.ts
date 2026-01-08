"use client";

import { useEffect, useState } from "react";
import { fetchContacts, Contact } from "../api/contacts";

export function useContacts(userSub: string | null) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    if (!userSub) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchContacts(userSub);
      setContacts(Array.isArray(rows) ? rows : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSub]);

  return { contacts, loading, error, refresh };
}
