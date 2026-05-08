"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDashboardUser } from "../layout";
import { useContacts } from "../hooks/useContacts";
import { createContact, updateContact, deleteContact } from "../api/contacts";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Mail,
  Phone,
  Building2,
  User2,
  Pencil,
  Trash2,
  X,
  ChevronRight,
} from "lucide-react";

function initials(name?: string) {
  const n = (name || "").trim();
  if (!n) return "C";
  const parts = n.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || "C";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
}

function clampText(v?: string | null) {
  const s = String(v || "").trim();
  return s || "—";
}

function getAvatarColor(name?: string) {
  const colors = [
    "bg-red-100 text-red-600",
    "bg-green-100 text-green-600",
    "bg-blue-100 text-blue-600",
    "bg-yellow-100 text-yellow-700",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
    "bg-indigo-100 text-indigo-600",
    "bg-teal-100 text-teal-600",
  ];

  if (!name) return colors[0];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

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

  const [searchQuery, setSearchQuery] = useState("");
  const { user, userSub } = useDashboardUser();

  const { contacts, loading, error, refresh } = useContacts(userSub);

  useEffect(() => {
    const handleTopbarSearch = (event: Event) => {
      setSearchQuery(String((event as CustomEvent<string>).detail || ""));
    };

    window.addEventListener(
      "slotly-contacts-search",
      handleTopbarSearch as EventListener
    );

    return () => {
      window.removeEventListener(
        "slotly-contacts-search",
        handleTopbarSearch as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const handleOpenCreateContact = () => openCreate();

    window.addEventListener(
      "slotly-open-create-contact",
      handleOpenCreateContact as EventListener
    );

    return () => {
      window.removeEventListener(
        "slotly-open-create-contact",
        handleOpenCreateContact as EventListener
      );
    };
  }, []);

  const filtered = useMemo(() => {
    const base = Array.isArray(contacts) ? contacts : [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;

    return base.filter((c: any) => {
      const name = String(c.name || "").toLowerCase();
      const email = String(c.email || "").toLowerCase();
      const company = String(c.company || "").toLowerCase();
      return name.includes(q) || email.includes(q) || company.includes(q);
    });
  }, [contacts, searchQuery]);

  const totalCount = Array.isArray(contacts) ? contacts.length : 0;
  const shownCount = filtered.length;

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
      toast({
        title: "Deleted",
        description: "Contact removed.",
        variant: "success",
      });
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
      <div className="flex h-screen items-center justify-center text-base sm:text-xl">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 2xl:max-w-[1800px]">
      {/* <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">All contacts</div>
            <div className="mt-1 text-xs text-slate-500">
              Search is now handled from the topbar on this page.
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{shownCount}</span>
              <span className="text-slate-400"> / </span>
              <span className="font-semibold text-slate-900">{totalCount}</span>{" "}
              <span className="text-slate-500">shown</span>
            </div>

            <button
              type="button"
              onClick={() => refresh()}
              className="h-10 rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add contact
            </button>
          </div>
        </div>

        {loading ? <div className="mt-3 text-sm text-slate-500">Loading contacts…</div> : null}
        {error ? <div className="mt-3 break-words text-sm text-red-600">{error}</div> : null}
      </div> */}

      <div>
        {!loading && filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50">
                <User2 className="h-5 w-5 text-indigo-700" />
              </div>
              <div className="min-w-0">
                <div className="text-base font-semibold text-slate-900">No contacts found</div>
                <div className="mt-1 text-sm text-slate-500">
                  {searchQuery.trim()
                    ? "Try a different search term."
                    : "Once you get bookings, contacts will appear here automatically."}
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4" /> Add your first contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)] md:block">
              <div className="overflow-x-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                      <th className="px-5 py-3">Contact</th>
                      <th className="px-5 py-3">Email</th>
                      <th className="px-5 py-3">Phone</th>
                      <th className="px-5 py-3">Company</th>
                      <th className="px-5 py-3">Last meeting</th>
                      <th className="w-[10%] px-3 py-3 text-center">
                        <span className="block leading-tight">
                          Total<br />meetings
                        </span>
                      </th>
                      <th className="w-[12%] px-3 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((c: any) => (
                      <tr key={c.id} className="transition hover:bg-slate-50/60">
                        <td className="px-5 py-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full font-semibold ${getAvatarColor(
                                c.name
                              )}`}
                            >
                              {initials(c.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="max-w-[260px] truncate font-semibold text-slate-900">
                                {clampText(c.name)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                            <span className="max-w-[320px] truncate">{clampText(c.email)}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                            <span className="max-w-[180px] truncate">{c.phone || "—"}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                            <span className="max-w-[220px] truncate">{c.company || "—"}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3">
                          <span className="text-slate-700">{formatDate(c.last_meeting_at)}</span>
                        </td>

                        <td className="px-3 py-3 text-center">
                          <span className="font-semibold text-slate-900">{c.total_meetings || 0}</span>
                        </td>

                        <td className="px-3 py-3 text-center">
                          <div className="inline-flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(c)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(c)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3 md:hidden">
              {filtered.map((c: any) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${getAvatarColor(
                        c.name
                      )}`}
                    >
                      {initials(c.name)}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-900">{clampText(c.name)}</div>
                      <div className="truncate text-xs text-slate-500">{clampText(c.email)}</div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{c.phone || "—"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{c.company || "—"}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
                      <span className="text-slate-500">Last meeting</span>
                      <span className="font-medium text-slate-900">{formatDate(c.last_meeting_at)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
                      <span className="text-slate-500">Total meetings</span>
                      <span className="font-semibold text-slate-900">{c.total_meetings || 0}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(c)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {modalOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/40 p-3 sm:p-6"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="mx-auto flex h-[calc(100vh-24px)] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:h-auto sm:max-h-[85vh] 2xl:max-w-[800px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <div className="text-lg font-semibold text-slate-900">
                  {editing ? "Edit contact" : "Add contact"}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {editing
                    ? "Update details. Email stays the same."
                    : "Add manually (or let bookings auto-create it)."}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Name</label>
                  <div className="relative mt-1">
                    <User2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Name (auto-fetched, editable)"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                </div>

                {!editing ? (
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Email</label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Email (manual add)"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      If you don’t add manually, bookings will auto-create contacts.
                    </div>
                  </div>
                ) : null}

                <div>
                  <label className="text-xs font-semibold text-slate-600">Phone (optional)</label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Company (optional)</label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Company"
                      value={form.company}
                      onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white px-5 py-4">
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  className="h-11 w-full rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
