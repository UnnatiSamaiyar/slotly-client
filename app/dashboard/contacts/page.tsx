"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import { useUserProfile } from "../hooks/useUserProfile";
import { useContacts } from "../hooks/useContacts";
import { createContact, updateContact, deleteContact } from "../api/contacts";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  User2,
  Pencil,
  Trash2,
  X,
  ChevronRight,
  Menu,
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [userSub, setUserSub] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

  // ✅ keep your existing auth/session behavior
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

  // ✅ open sidebar by default only on large screens (mobile-friendly)
  useEffect(() => {
    const apply = () => {
      if (typeof window === "undefined") return;
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
  function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
  }
  const { data: user } = useUserProfile(userSub);
  const { contacts, loading, error, refresh } = useContacts(userSub);

  // ✅ keep your filtering logic, just make it safer if contacts is undefined
  const filtered = useMemo(() => {
    const base = Array.isArray(contacts) ? contacts : [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter((c: any) => {
      const name = (c.name || "").toLowerCase();
      const email = (c.email || "").toLowerCase();
      const company = (c.company || "").toLowerCase();
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
      `This will remove ${c.email} from your contacts.`,
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
        description:
          e?.message || "Unable to delete contact. Please try again.",
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
    // Full-height dashboard shell with independent scroll regions
    <div className="h-screen bg-slate-50 flex text-slate-900 overflow-hidden">
      {isDesktop ? (
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((s) => !s)}
          user={user}
        />
      ) : null}
      {!isDesktop && sidebarOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/35"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative h-full">
            <Sidebar
              open={true}
              onToggle={() => setSidebarOpen(false)}
              user={user}
            />
          </div>
        </div>
      ) : null}

      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        
          {/* Top bar area */}
          <div className="shrink-0 px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
            {/* Mobile menu button */}
            {!isDesktop ? (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="absolute left-3 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 active:scale-[0.98] transition lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-slate-700" />
              </button>
            ) : null}

            <div className={cx(!isDesktop && "pl-12 sm:pl-0")}>
              <Topbar
                user={user}
                searchQuery=""
                onSearchQueryChange={() => {}}
              />
            </div>
          </div>
        

        {/* scroll container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-slate-900">
                  Contacts
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Auto-saved from bookings. You can add phone/company for better
                  context.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={openCreate}
                  className="h-11 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add contact
                </button>
              </div>
            </div>

            {/* Search + Stats row */}
            <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="relative w-full lg:max-w-[520px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or company…"
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-3">
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">
                      {shownCount}
                    </span>
                    <span className="text-slate-400"> / </span>
                    <span className="font-semibold text-slate-900">
                      {totalCount}
                    </span>{" "}
                    <span className="text-slate-500">shown</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => refresh()}
                    className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="mt-3 text-sm text-slate-500">
                  Loading contacts…
                </div>
              ) : null}
              {error ? (
                <div className="mt-3 text-sm text-red-600 break-words">
                  {error}
                </div>
              ) : null}
            </div>

            {/* Content */}
            <div className="mt-6">
              {!loading && filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                      <User2 className="w-5 h-5 text-indigo-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-slate-900">
                        No contacts found
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        {searchQuery.trim()
                          ? "Try a different search term."
                          : "Once you get bookings, contacts will appear here automatically."}
                      </div>
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={openCreate}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
                        >
                          <Plus className="w-4 h-4" /> Add your first contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop table (Calendly-like clean table) */}
                  <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-900">
                        All contacts
                      </div>
                      <div className="text-xs text-slate-500">
                        Tip: click Edit to update phone/company.
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs font-semibold text-slate-500 bg-slate-50">
                            <th className="py-3 px-5">Contact</th>
                            <th className="py-3 px-5">Email</th>
                            <th className="py-3 px-5">Phone</th>
                            <th className="py-3 px-5">Company</th>
                            <th className="py-3 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filtered.map((c: any) => (
                            <tr
                              key={c.id}
                              className="hover:bg-slate-50/60 transition"
                            >
                              <td className="py-3 px-5">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-semibold">
                                    {initials(c.name)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-slate-900 truncate max-w-[260px]">
                                      {clampText(c.name)}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      ID: {c.id}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-5">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span className="truncate max-w-[320px]">
                                    {clampText(c.email)}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-5">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span className="truncate max-w-[180px]">
                                    {c.phone || "—"}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-5">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span className="truncate max-w-[220px]">
                                    {c.company || "—"}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-5 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openEdit(c)}
                                    className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold inline-flex items-center gap-2"
                                  >
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDelete(c)}
                                    className="h-9 px-3 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 font-semibold inline-flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
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

                  {/* Mobile cards (fast to scan, 2 taps max) */}
                  <div className="md:hidden space-y-3">
                    {filtered.map((c: any) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] p-4"
                      >
                        {/* Top row (avatar + name/email only) */}
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-semibold shrink-0">
                            {initials(c.name)}
                          </div>

                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate">
                              {clampText(c.name)}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {clampText(c.email)}
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="mt-3 grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="truncate">{c.phone || "—"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="truncate">{c.company || "—"}</span>
                          </div>
                        </div>

                        {/* Actions row (Edit bottom-left, Delete smaller bottom-right) */}
                        <div className="mt-4 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(c)}
                            className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold inline-flex items-center gap-2"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(c)}
                            className="h-8 px-2.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 font-semibold inline-flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Modal (premium + mobile safe, logic unchanged) */}
          {modalOpen ? (
            <div
              className="fixed inset-0 bg-black/40 z-50 p-3 sm:p-6"
              onClick={() => setModalOpen(false)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="mx-auto w-full max-w-[640px] h-[calc(100vh-24px)] sm:h-auto sm:max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* header */}
                <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-slate-900">
                      {editing ? "Edit contact" : "Add contact"}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      {editing
                        ? "Update details. Email stays the same."
                        : "Add manually (or let bookings auto-create it)."}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 inline-flex items-center justify-center"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                {/* body */}
                <div className="px-5 py-4 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">
                        Name
                      </label>
                      <div className="mt-1 relative">
                        <User2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Name (auto-fetched, editable)"
                          value={form.name}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, name: e.target.value }))
                          }
                        />
                      </div>
                    </div>

                    {!editing ? (
                      <div>
                        <label className="text-xs font-semibold text-slate-600">
                          Email
                        </label>
                        <div className="mt-1 relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Email (manual add)"
                            value={form.email}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, email: e.target.value }))
                            }
                          />
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">
                          If you don’t add manually, bookings will auto-create
                          contacts.
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-semibold text-slate-600">
                          Email
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900 break-words">
                          {form.email}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-slate-600">
                        Phone (optional)
                      </label>
                      <div className="mt-1 relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Phone"
                          value={form.phone}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, phone: e.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600">
                        Company (optional)
                      </label>
                      <div className="mt-1 relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Company"
                          value={form.company}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, company: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* footer */}
                <div className="px-5 py-4 border-t border-slate-200 bg-white">
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={onSave}
                      className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm w-full sm:w-auto"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
