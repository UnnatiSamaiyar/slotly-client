const API_BASE = process.env.NEXT_PUBLIC_CALENDAR_API || "http://localhost:8000";

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
};

export async function fetchContacts(userSub: string): Promise<Contact[]> {
  const res = await fetch(`${API_BASE}/contacts/list?user_sub=${encodeURIComponent(userSub)}`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function createContact(userSub: string, payload: {
  email: string;
  name?: string;
  phone?: string | null;
  company?: string | null;
}) {
  const res = await fetch(`${API_BASE}/contacts/create?user_sub=${encodeURIComponent(userSub)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Failed to create contact");
  return data;
}

export async function updateContact(userSub: string, contactId: number, payload: {
  name?: string;
  phone?: string | null;
  company?: string | null;
}) {
  const res = await fetch(`${API_BASE}/contacts/${contactId}?user_sub=${encodeURIComponent(userSub)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Failed to update contact");
  return data;
}

export async function deleteContact(userSub: string, contactId: number) {
  const res = await fetch(`${API_BASE}/contacts/${contactId}?user_sub=${encodeURIComponent(userSub)}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Failed to delete contact");
  return data;
}
