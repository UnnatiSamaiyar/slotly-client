"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import { useUserProfile } from "../hooks/useUserProfile";
import { useContacts } from "../hooks/useContacts";
import { createContact, updateContact, deleteContact } from "../api/contacts";
import { useToast } from "@/hooks/use-toast";

export default function ContactsPage() {
  const { toast } = useToast();

  const confirmToast = (title: string, description?: string) =>
    new Promise<boolean>((resolve) => {
      let resolved = false;
      toast({
        title,
        description,
        variant: "info",
        durationMs: 0,
        action: {
          label: "Confirm",
          onClick: () => {
            resolved = true;
            resolve(true);
          },
        },
        onDismiss: () => {
          if (!resolved) resolve(false);
        },
      });
    });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userSub, setUserSub] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("slotly_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserSub(parsed.sub);
      } catch (err) {
        console.error("Invalid session:", err);
      }
    }
  }, []);

  const { data: user } = useUserProfile(userSub);
  const { contacts, loading, error, refresh } = useContacts(userSub);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) =>
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.company || "").toLowerCase().includes(q)
    );
  }, [contacts, searchQuery]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  function openCreate() {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", company: "" });
    setModalOpen(true);
  }

  function openEdit(c: any) {
    setEditing(c);
    setForm({
      name: c.name || "",
      email: c.email || "",
      phone: c.phone || "",
      company: c.company || "",
    });
    setModalOpen(true);
  }

  async function onSave() {
    if (!userSub) return;

    try {
      if (editing) {
        await updateContact(userSub, editing.id, {
          name: form.name,
          phone: form.phone || null,
          company: form.company || null,
        });
      } else {
        // name/email auto fetched in your requirement,
        // but we allow entering email to create a contact manually too.
        await createContact(userSub, {
          email: form.email,
          name: form.name || undefined,
          phone: form.phone || null,
          company: form.company || null,
        });
      }

      setModalOpen(false);
      toast({
        title: "Saved",
        description: editing ? "Contact updated." : "Contact added.",
        variant: "success",
      });
      await refresh();
    } catch (e: any) {
      toast({
        title: "Save failed",
        description: e?.message || "Unable to save contact. Please try again.",
        variant: "error",
      });
    }
  }

  async function onDelete(c: any) {
    if (!userSub) return;
    const ok = await confirmToast(
      "Delete this contact?",
      `This will remove ${c.email} from your contacts.`
    );
    if (!ok) {
      toast({
        title: "Cancelled",
        description: "Contact was not deleted.",
        variant: "default",
      });
      return;
    }

    try {
      await deleteContact(userSub, c.id);
      toast({ title: "Deleted", description: "Contact removed.", variant: "success" });
      await refresh();
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: e?.message || "Unable to delete contact. Please try again.",
        variant: "error",
      });
    }
  }

  if (!userSub || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-base sm:text-xl">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex text-slate-900">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((s: boolean) => !s)}
        user={user}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
        <Topbar
          user={user}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold truncate">Contacts</h3>
                <div className="text-xs text-gray-500 mt-1">
                  Auto-saved from bookings. Add phone/company manually.
                </div>
              </div>

              <button
                type="button"
                onClick={openCreate}
                className="text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 w-full sm:w-auto"
              >
                Add Contact
              </button>
            </div>

            {loading ? (
              <div className="text-sm text-gray-500">Loading contacts…</div>
            ) : null}
            {error ? (
              <div className="text-sm text-red-600 break-words">{error}</div>
            ) : null}

            {!loading && filtered.length === 0 ? (
              <div className="text-sm text-gray-500">No contacts yet.</div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-[720px] px-4 sm:px-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="py-2">Name</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Phone</th>
                        <th className="py-2">Company</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c: any) => (
                        <tr key={c.id} className="border-t">
                          <td className="py-2 font-medium">
                            <span className="block max-w-[220px] truncate">{c.name}</span>
                          </td>
                          <td className="py-2">
                            <span className="block max-w-[280px] truncate">{c.email}</span>
                          </td>
                          <td className="py-2">
                            <span className="block max-w-[160px] truncate">
                              {c.phone || "—"}
                            </span>
                          </td>
                          <td className="py-2">
                            <span className="block max-w-[200px] truncate">
                              {c.company || "—"}
                            </span>
                          </td>
                          <td className="py-2 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(c)}
                                className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => onDelete(c)}
                                className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Modal */}
        {modalOpen ? (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setModalOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="bg-white p-5 sm:p-6 rounded-xl shadow-xl w-full max-w-[560px]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                {editing ? "Edit Contact" : "Add Contact"}
              </h2>

              <div className="space-y-3">
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Name (auto-fetched, editable)"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />

                {!editing ? (
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Email (auto-fetched from bookings; for manual add enter here)"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  />
                ) : (
                  <div className="text-sm text-gray-600 break-words">
                    Email: <span className="font-medium">{form.email}</span>
                  </div>
                )}

                <input
                  className="w-full border p-2 rounded"
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />

                <input
                  className="w-full border p-2 rounded"
                  placeholder="Company (optional)"
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 border rounded w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  className="px-3 py-2 bg-blue-600 text-white rounded w-full sm:w-auto"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
