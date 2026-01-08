"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import { useUserProfile } from "../hooks/useUserProfile";
import { useContacts } from "../hooks/useContacts";
import { createContact, updateContact, deleteContact } from "../api/contacts";
<<<<<<< HEAD
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

=======

export default function ContactsPage() {
>>>>>>> 6f1a8f49dde73878af27096bfbd1418fcc8ff0bb
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
    return contacts.filter(c =>
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
<<<<<<< HEAD
      toast({ title: "Saved", description: editing ? "Contact updated." : "Contact added.", variant: "success" });
      await refresh();
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message || "Unable to save contact. Please try again.", variant: "error" });
=======
      await refresh();
    } catch (e: any) {
      alert(e?.message || "Save failed");
>>>>>>> 6f1a8f49dde73878af27096bfbd1418fcc8ff0bb
    }
  }

  async function onDelete(c: any) {
    if (!userSub) return;
<<<<<<< HEAD
    const ok = await confirmToast("Delete this contact?", `This will remove ${c.email} from your contacts.`);
    if (!ok) {
      toast({ title: "Cancelled", description: "Contact was not deleted.", variant: "default" });
      return;
    }

    try {
      await deleteContact(userSub, c.id);
      toast({ title: "Deleted", description: "Contact removed.", variant: "success" });
      await refresh();
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.message || "Unable to delete contact. Please try again.", variant: "error" });
=======
    const ok = confirm(`Delete contact: ${c.email}?`);
    if (!ok) return;

    try {
      await deleteContact(userSub, c.id);
      await refresh();
    } catch (e: any) {
      alert(e?.message || "Delete failed");
>>>>>>> 6f1a8f49dde73878af27096bfbd1418fcc8ff0bb
    }
  }

  if (!userSub || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
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

      <main className="flex-1 p-8">
        <Topbar
          user={user}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Contacts</h3>
              <div className="text-xs text-gray-500 mt-1">
                Auto-saved from bookings. Add phone/company manually.
              </div>
            </div>

            <button
              onClick={openCreate}
              className="text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Add Contact
            </button>
          </div>

          {loading ? <div className="text-sm text-gray-500">Loading contacts…</div> : null}
          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          {!loading && filtered.length === 0 ? (
            <div className="text-sm text-gray-500">No contacts yet.</div>
          ) : (
            <div className="overflow-auto">
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
                      <td className="py-2 font-medium">{c.name}</td>
                      <td className="py-2">{c.email}</td>
                      <td className="py-2">{c.phone || "—"}</td>
                      <td className="py-2">{c.company || "—"}</td>
                      <td className="py-2 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEdit(c)}
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
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
          )}
        </div>

        {/* Modal */}
        {modalOpen ? (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
            <div className="bg-white p-6 rounded-xl shadow-xl w-[560px]" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-4">
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
                  <div className="text-sm text-gray-600">
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

              <div className="flex justify-end gap-3 mt-5">
                <button onClick={() => setModalOpen(false)} className="px-3 py-2 border rounded">
                  Cancel
                </button>
                <button onClick={onSave} className="px-3 py-2 bg-blue-600 text-white rounded">
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
