// // slotly-client/app/dashboard/event-types/[slug]/edit/page.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import { getEventType, updateEventType } from "@/lib/eventApi";
// import { useRouter } from "next/navigation";

// export default function EditEventType({ params }: { params: { slug: string } }) {
//   const slug = params.slug;
//   const [item, setItem] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [title, setTitle] = useState("");
//   const [duration, setDuration] = useState(30);
//   const [description, setDescription] = useState("");
//   const [active, setActive] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     getEventType(slug)
//       .then((x) => {
//         if (!x) throw new Error("Not found");
//         if (!mounted) return;
//         setItem(x);
//         setTitle(x.title);
//         setDuration(x.duration_minutes);
//         setDescription(x.description || "");
//         setActive(x.active ?? true);
//       })
//       .catch((e) => {
//         alert("Event not found");
//         router.push("/dashboard/event-types");
//       })
//       .finally(() => mounted && setLoading(false));
//     return () => { mounted = false; };
//   }, [slug]);

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await updateEventType(slug, { title: title.trim(), duration_minutes: duration, description, active });
//       alert("Saved");
//     } catch (e: any) {
//       alert("Save error: " + (e.message || e));
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="p-8">Loading…</div>;

//   return (
//     <div className="p-8 max-w-2xl mx-auto">
//       <div className="mb-4 flex items-center justify-between">
//         <h2 className="text-xl font-semibold">Edit Event Type</h2>
//         <div className="text-sm text-gray-500">Public link: <code className="bg-gray-100 px-2 py-1 rounded">/bookings/{item?.slug}</code></div>
//       </div>

//       <div className="space-y-4 bg-white p-6 rounded-xl border">
//         <div>
//           <label className="block text-sm font-medium mb-1">Title</label>
//           <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded w-full" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
//           <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="border p-2 rounded">
//             <option value={15}>15</option>
//             <option value={30}>30</option>
//             <option value={45}>45</option>
//             <option value={60}>60</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Active</label>
//           <div>
//             <label className="inline-flex items-center gap-2">
//               <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
//               <span className="text-sm">Active (public)</span>
//             </label>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="border p-2 rounded w-full" />
//         </div>

//         <div className="flex justify-between items-center">
//           <div className="text-sm text-gray-500">Created: {item?.created_at ? new Date(item.created_at).toLocaleString() : "—"}</div>
//           <div>
//             <button onClick={() => router.push("/dashboard/event-types")} className="mr-3 px-4 py-2 border rounded">Back</button>
//             <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
//               {saving ? "Saving…" : "Save changes"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










"use client";

import React, { useEffect, useState } from "react";
import { getEventType, updateEventType } from "@/lib/eventApi";
import { useRouter } from "next/navigation";

export default function EditEventType({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getEventType(slug)
      .then((x) => {
        if (!x) throw new Error("Not found");
        if (!mounted) return;

        setItem(x);
        setTitle(x.title);
        setDuration(x.duration_minutes);
        setDescription(x.description || "");
        setActive(x.active ?? true);
      })
      .catch(() => {
        alert("Event not found");
        router.push("/dashboard/event-types");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateEventType(slug, {
        title: title.trim(),
        duration_minutes: duration,
        description,
        active,
      });
      alert("Saved");
    } catch (e: any) {
      alert("Save error: " + (e.message || e));
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="p-10 text-center text-gray-500">Loading event type…</div>;

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      {/* PAGE HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Event Type</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update title, duration, description, and visibility.
          </p>
        </div>

        <div className="mt-4 md:mt-0 text-sm">
          <span className="text-gray-500">Public Link:</span>{" "}
          <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">
            /bookings/{item?.slug}
          </code>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter a name for this event"
          />
        </div>

        {/* DURATION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>

        {/* ACTIVE */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
          <div>
            <p className="text-sm font-medium text-gray-700">Public Visibility</p>
            <p className="text-xs text-gray-500">Show or hide this event externally.</p>
          </div>

          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
            <div className="absolute left-0 top-0 h-5 w-5 bg-white rounded-full border shadow transform peer-checked:translate-x-5 transition"></div>
          </label>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            placeholder="Add a description for invitees…"
          />
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-gray-500">
            Created:{" "}
            {item?.created_at
              ? new Date(item.created_at).toLocaleString()
              : "—"}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard/event-types")}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Back
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
