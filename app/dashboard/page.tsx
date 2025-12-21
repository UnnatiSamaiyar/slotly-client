<<<<<<< HEAD
// "use client";


// import React, { useState } from "react";
// import { Calendar, Menu, PlusCircle, User, Settings, LogOut, BellRing, CheckCircle } from "lucide-react";
// import { motion } from "framer-motion";

// // Single-file Dashboard component for Next.js App Router
// // Place this file at: app/dashboard/page.tsx
// // Requires TailwindCSS, lucide-react, framer-motion, and your shadcn/ui Button/Card components (optional)

// export default function DashboardPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
//   const [events] = useState(mockEvents());

//   return (
//     <div className="min-h-screen bg-gray-50 flex text-slate-900">
//       {/* SIDEBAR */}
//       <aside className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-white border-r border-gray-200 shadow-sm flex flex-col` }>
//         <div className="flex items-center gap-3 px-4 py-5">
//           <button onClick={() => setSidebarOpen(s => !s)} className="p-1 rounded-md hover:bg-gray-100">
//             <Menu className="w-5 h-5 text-slate-700" />
//           </button>
//           {sidebarOpen && <div className="text-2xl font-bold text-blue-600">Slotly</div>}
//         </div>

//         <nav className="mt-6 px-2 flex-1">
//           <NavItem icon={<Calendar className="w-5 h-5" />} label="Calendar" active />
//           <NavItem icon={<PlusCircle className="w-5 h-5" />} label="Event Types" />
//           <NavItem icon={<User className="w-5 h-5" />} label="Contacts" />
//           <NavItem icon={<BellRing className="w-5 h-5" />} label="Notifications" />
//           <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
//         </nav>

//         <div className="px-4 py-4">
//           <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm">
//             <PlusCircle className="w-4 h-4" />
//             {sidebarOpen && <span>New Event</span>}
//           </button>
//         </div>

//         <div className="px-4 py-4 border-t border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">JD</div>
//             {sidebarOpen && <div>
//               <div className="font-semibold">John Doe</div>
//               <div className="text-xs text-gray-500">Founder</div>
//             </div>}
//           </div>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="flex-1 p-8">
//         {/* Top bar */}
//         <header className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-semibold">Your Schedule</h2>
//             <p className="text-sm text-gray-500">Overview of upcoming meetings and availability</p>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <input type="text" placeholder="Search events" className="px-4 py-2 rounded-lg border border-gray-200 bg-white" />
//             </div>
//             <button className="p-2 rounded-md hover:bg-gray-100"><BellRing className="w-5 h-5" /></button>
//             <div className="flex items-center gap-3">
//               <img src="/menwithtab.png" alt="me" className="w-9 h-9 rounded-full shadow-sm object-cover" />
//               <div className="text-right">
//                 <div className="text-sm font-semibold">John Doe</div>
//                 <div className="text-xs text-gray-500">slotly.team</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="grid grid-cols-12 gap-6">
//           {/* LEFT: Calendar + day list */}
//           <section className="col-span-12 lg:col-span-8">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-4">
//                   <h3 className="text-lg font-semibold">Calendar</h3>
//                   <div className="text-sm text-gray-500">{selectedDate}</div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Today</button>
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Week</button>
//                 </div>
//               </div>

//               {/* Simple monthly mock calendar */}
//               <div className="grid grid-cols-7 gap-2 text-sm">
//                 {renderWeekHeaders()}
//                 {renderMonthGrid(selectedDate, setSelectedDate)}
//               </div>
//             </div>

//             {/* Today's events */}
//             <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-semibold">Today</h4>
//                 <div className="text-sm text-gray-500">{events.filter(e => e.date === selectedDate).length} events</div>
//               </div>

//               <div className="space-y-4">
//                 {events.filter(e => e.date === selectedDate).map((ev) => (
//                   <EventCard key={ev.id} event={ev} />
//                 ))}
//                 {events.filter(e => e.date === selectedDate).length === 0 && (
//                   <div className="text-gray-500">No events for this day. Create one now.</div>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* RIGHT: Event types and details */}
//           <aside className="col-span-12 lg:col-span-4">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
//               <h4 className="font-semibold mb-3">Event Types</h4>
//               <p className="text-sm text-gray-500 mb-4">Quick links to create and edit your event types.</p>

//               <div className="space-y-3">
//                 <EventTypeCard title="30-min Meeting" duration="30" color="from-blue-500 to-indigo-500" />
//                 <EventTypeCard title="60-min Deep Work" duration="60" color="from-emerald-500 to-teal-500" />
//                 <EventTypeCard title="Intro Call" duration="15" color="from-purple-500 to-pink-500" />
//               </div>

//               <button className="mt-6 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">Create Event Type</button>
//             </div>

//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <h4 className="font-semibold mb-3">Upcoming</h4>
//               <ul className="space-y-3">
//                 {events.slice(0,4).map(ev => (
//                   <li key={ev.id} className="flex items-start gap-3">
//                     <div className="w-2 h-10 rounded bg-gradient-to-b from-blue-400 to-indigo-500" />
//                     <div className="flex-1">
//                       <div className="text-sm font-semibold">{ev.title}</div>
//                       <div className="text-xs text-gray-500">{ev.time} • {ev.date}</div>
//                     </div>
//                     <div className="text-sm text-gray-400">{ev.location}</div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// }

// function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }){
//   return (
//     <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${active ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
//       <div className="text-slate-700">{icon}</div>
//       <div className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-gray-700'}`}>{label}</div>
//     </div>
//   );
// }

// function EventCard({ event }: { event: any }){
//   return (
//     <motion.div layout initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white">
//       <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
//         <CheckCircle className="w-5 h-5" />
//       </div>
//       <div className="flex-1">
//         <div className="flex items-center justify-between">
//           <div className="font-semibold">{event.title}</div>
//           <div className="text-sm text-gray-400">{event.time}</div>
//         </div>
//         <div className="text-sm text-gray-500">{event.location}</div>
//       </div>
//     </motion.div>
//   );
// }

// function EventTypeCard({ title, duration, color }: { title: string; duration: string | number; color: string }){
//   return (
//     <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all bg-white">
//       <div className="flex items-center gap-3">
//         <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${color} text-white flex items-center justify-center`}>⌚</div>
//         <div>
//           <div className="font-semibold">{title}</div>
//           <div className="text-xs text-gray-500">{duration} minutes</div>
//         </div>
//       </div>
//       <button className="text-sm text-blue-600">Edit</button>
//     </div>
//   );
// }

// // Helpers to render a simple month grid (not a full calendar library)
// function renderWeekHeaders(){
//   return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
//     <div key={d} className="text-xs font-medium text-gray-500 text-center py-2">{d}</div>
//   ));
// }

// function renderMonthGrid(selectedDate: string, setSelectedDate: (d:string)=>void){
//   const date = new Date(selectedDate);
//   const year = date.getFullYear();
//   const month = date.getMonth();
//   const first = new Date(year, month, 1);
//   const startWeek = first.getDay();
//   const daysInMonth = new Date(year, month+1, 0).getDate();
//   const cells: React.ReactNode[] = [];

//   for(let i=0;i<startWeek;i++) cells.push(<div key={`pad-${i}`} className="p-2"></div>);
//   for(let d=1; d<=daysInMonth; d++){
//     const iso = new Date(year, month, d).toISOString().slice(0,10);
//     cells.push(
//       <button key={iso} onClick={()=>setSelectedDate(iso)} className="p-2 rounded-lg hover:bg-blue-50 text-center">
//         <div className="text-sm">{d}</div>
//       </button>
//     );
//   }
//   return cells;
// }

// function mockEvents(){
//   const today = new Date().toISOString().slice(0,10);
//   return [
//     { id:1, title: "Intro with Acme", date: today, time: "10:00", location: "Zoom" },
//     { id:2, title: "Design Sync", date: today, time: "14:00", location: "Google Meet" },
//     { id:3, title: "Weekly Review", date: today, time: "16:30", location: "Office" },
//     { id:4, title: "Follow up: X", date: new Date(Date.now()+86400000).toISOString().slice(0,10), time: "11:00", location: "Zoom" },
//   ];
// }

















// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   Menu,
//   PlusCircle,
//   User,
//   Settings,
//   LogOut,
//   BellRing,
//   CheckCircle,
// } from "lucide-react";
// import { motion } from "framer-motion";

// // ----------------------------------------
// // GOOGLE CALENDAR LOGIN BUTTON
// // ----------------------------------------
// function GoogleLoginButton({ onSuccess }: { onSuccess?: () => void }) {
//   const handleGoogleLogin = () => {
//     const client = google.accounts.oauth2.initCodeClient({
//       client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//       scope: [
//         "openid",
//         "email",
//         "profile",
//         "https://www.googleapis.com/auth/calendar",
//         "https://www.googleapis.com/auth/calendar.events",
//       ].join(" "),
//       ux_mode: "popup",
//       redirect_uri: "https://slotly.io/auth/callback/google",
//       callback: async (response) => {
//         const code = response.code;

//         await fetch("https://api.slotly.io/auth/google", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ code }),
//         });

//         if (onSuccess) onSuccess();
//       },
//     });

//     client.requestCode();
//   };

//   return (
//     <button
//       onClick={handleGoogleLogin}
//       className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm"
//     >
//       Connect Calendar
//     </button>
//   );
// }

// // ----------------------------------------
// // CALENDAR CONNECTION STATUS
// // ----------------------------------------
// function CalendarConnectionStatus({ userSub }: { userSub: string }) {
//   const [status, setStatus] = useState<null | boolean>(null);

//   const loadStatus = async () => {
//     const res = await fetch(
//       `https://api.slotly.io/auth/calendar-status?user_sub=${userSub}`
//     );
//     const data = await res.json();
//     setStatus(data.calendar_connected);
//   };

//   useEffect(() => {
//     loadStatus();
//   }, []);

//   if (status === null) {
//     return <div className="text-xs text-gray-400">Checking calendar...</div>;
//   }

//   if (status === true) {
//     return (
//       <div className="text-xs font-semibold text-green-600 flex items-center gap-1">
//         <CheckCircle className="w-3 h-3" />
//         Calendar Connected
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center gap-2">
//       <div className="text-xs text-red-600">Not Connected</div>
//       <GoogleLoginButton onSuccess={loadStatus} />
//     </div>
//   );
// }

// // ----------------------------------------
// // DASHBOARD PAGE
// // ----------------------------------------
// export default function DashboardPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedDate, setSelectedDate] = useState<string>(() =>
//     new Date().toISOString().slice(0, 10)
//   );
//   const [events] = useState(mockEvents());

//   return (
//     <div className="min-h-screen bg-gray-50 flex text-slate-900">
//       {/* SIDEBAR */}
//       <aside
//         className={`${
//           sidebarOpen ? "w-64" : "w-16"
//         } transition-all duration-300 bg-white border-r border-gray-200 shadow-sm flex flex-col`}
//       >
//         <div className="flex items-center gap-3 px-4 py-5">
//           <button
//             onClick={() => setSidebarOpen((s) => !s)}
//             className="p-1 rounded-md hover:bg-gray-100"
//           >
//             <Menu className="w-5 h-5 text-slate-700" />
//           </button>
//           {sidebarOpen && (
//             <div className="text-2xl font-bold text-blue-600">Slotly</div>
//           )}
//         </div>

//         <nav className="mt-6 px-2 flex-1">
//           <NavItem icon={<Calendar className="w-5 h-5" />} label="Calendar" active />
//           <NavItem icon={<PlusCircle className="w-5 h-5" />} label="Event Types" />
//           <NavItem icon={<User className="w-5 h-5" />} label="Contacts" />
//           <NavItem icon={<BellRing className="w-5 h-5" />} label="Notifications" />
//           <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
//         </nav>

//         <div className="px-4 py-4">
//           <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm">
//             <PlusCircle className="w-4 h-4" />
//             {sidebarOpen && <span>New Event</span>}
//           </button>
//         </div>

//         <div className="px-4 py-4 border-t border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">
//               JD
//             </div>
//             {sidebarOpen && (
//               <div>
//                 <div className="font-semibold">John Doe</div>
//                 <div className="text-xs text-gray-500">Founder</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="flex-1 p-8">
//         {/* Top bar */}
//         <header className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-semibold">Your Schedule</h2>
//             <p className="text-sm text-gray-500">
//               Overview of upcoming meetings and availability
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* GOOGLE CALENDAR STATUS */}
//             <CalendarConnectionStatus userSub="test-user-123" />

//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search events"
//                 className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
//               />
//             </div>
//             <button className="p-2 rounded-md hover:bg-gray-100">
//               <BellRing className="w-5 h-5" />
//             </button>
//             <div className="flex items-center gap-3">
//               <img
//                 src="/menwithtab.png"
//                 alt="me"
//                 className="w-9 h-9 rounded-full shadow-sm object-cover"
//               />
//               <div className="text-right">
//                 <div className="text-sm font-semibold">John Doe</div>
//                 <div className="text-xs text-gray-500">slotly.team</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="grid grid-cols-12 gap-6">
//           {/* LEFT */}
//           <section className="col-span-12 lg:col-span-8">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-4">
//                   <h3 className="text-lg font-semibold">Calendar</h3>
//                   <div className="text-sm text-gray-500">{selectedDate}</div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
//                     Today
//                   </button>
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
//                     Week
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-7 gap-2 text-sm">
//                 {renderWeekHeaders()}
//                 {renderMonthGrid(selectedDate, setSelectedDate)}
//               </div>
//             </div>

//             {/* Today's events */}
//             <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-semibold">Today</h4>
//                 <div className="text-sm text-gray-500">
//                   {events.filter((e) => e.date === selectedDate).length} events
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {events
//                   .filter((e) => e.date === selectedDate)
//                   .map((ev) => (
//                     <EventCard key={ev.id} event={ev} />
//                   ))}

//                 {events.filter((e) => e.date === selectedDate).length === 0 && (
//                   <div className="text-gray-500">
//                     No events for this day. Create one now.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* RIGHT */}
//           <aside className="col-span-12 lg:col-span-4">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
//               <h4 className="font-semibold mb-3">Event Types</h4>
//               <p className="text-sm text-gray-500 mb-4">
//                 Quick links to create and edit your event types.
//               </p>

//               <div className="space-y-3">
//                 <EventTypeCard
//                   title="30-min Meeting"
//                   duration="30"
//                   color="from-blue-500 to-indigo-500"
//                 />
//                 <EventTypeCard
//                   title="60-min Deep Work"
//                   duration="60"
//                   color="from-emerald-500 to-teal-500"
//                 />
//                 <EventTypeCard
//                   title="Intro Call"
//                   duration="15"
//                   color="from-purple-500 to-pink-500"
//                 />
//               </div>

//               <button className="mt-6 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
//                 Create Event Type
//               </button>
//             </div>

//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <h4 className="font-semibold mb-3">Upcoming</h4>
//               <ul className="space-y-3">
//                 {events.slice(0, 4).map((ev) => (
//                   <li key={ev.id} className="flex items-start gap-3">
//                     <div className="w-2 h-10 rounded bg-gradient-to-b from-blue-400 to-indigo-500" />
//                     <div className="flex-1">
//                       <div className="text-sm font-semibold">{ev.title}</div>
//                       <div className="text-xs text-gray-500">
//                         {ev.time} • {ev.date}
//                       </div>
//                     </div>
//                     <div className="text-sm text-gray-400">{ev.location}</div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// }

// // ----------------------------------------
// // SMALL COMPONENTS
// // ----------------------------------------

// function NavItem({
//   icon,
//   label,
//   active,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   active?: boolean;
// }) {
//   return (
//     <div
//       className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
//         active ? "bg-gray-100" : "hover:bg-gray-50"
//       }`}
//     >
//       <div className="text-slate-700">{icon}</div>
//       <div
//         className={`text-sm font-medium ${
//           active ? "text-slate-900" : "text-gray-700"
//         }`}
//       >
//         {label}
//       </div>
//     </div>
//   );
// }

// function EventCard({ event }: { event: any }) {
//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 6 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0 }}
//       className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white"
//     >
//       <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
//         <CheckCircle className="w-5 h-5" />
//       </div>
//       <div className="flex-1">
//         <div className="flex items-center justify-between">
//           <div className="font-semibold">{event.title}</div>
//           <div className="text-sm text-gray-400">{event.time}</div>
//         </div>
//         <div className="text-sm text-gray-500">{event.location}</div>
//       </div>
//     </motion.div>
//   );
// }

// function EventTypeCard({
//   title,
//   duration,
//   color,
// }: {
//   title: string;
//   duration: string | number;
//   color: string;
// }) {
//   return (
//     <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all bg-white">
//       <div className="flex items-center gap-3">
//         <div
//           className={`w-10 h-10 rounded-md bg-gradient-to-br ${color} text-white flex items-center justify-center`}
//         >
//           ⌚
//         </div>
//         <div>
//           <div className="font-semibold">{title}</div>
//           <div className="text-xs text-gray-500">{duration} minutes</div>
//         </div>
//       </div>
//       <button className="text-sm text-blue-600">Edit</button>
//     </div>
//   );
// }

// // ----------------------------------------
// // CALENDAR HELPERS
// // ----------------------------------------

// function renderWeekHeaders() {
//   return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//     <div
//       key={d}
//       className="text-xs font-medium text-gray-500 text-center py-2"
//     >
//       {d}
//     </div>
//   ));
// }

// function renderMonthGrid(
//   selectedDate: string,
//   setSelectedDate: (d: string) => void
// ) {
//   const date = new Date(selectedDate);
//   const year = date.getFullYear();
//   const month = date.getMonth();
//   const first = new Date(year, month, 1);
//   const startWeek = first.getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const cells: React.ReactNode[] = [];

//   for (let i = 0; i < startWeek; i++)
//     cells.push(<div key={`pad-${i}`} className="p-2"></div>);

//   for (let d = 1; d <= daysInMonth; d++) {
//     const iso = new Date(year, month, d).toISOString().slice(0, 10);
//     cells.push(
//       <button
//         key={iso}
//         onClick={() => setSelectedDate(iso)}
//         className="p-2 rounded-lg hover:bg-blue-50 text-center"
//       >
//         <div className="text-sm">{d}</div>
//       </button>
//     );
//   }
//   return cells;
// }

// // ----------------------------------------
// // MOCK EVENTS
// // ----------------------------------------

// function mockEvents() {
//   const today = new Date().toISOString().slice(0, 10);
//   return [
//     { id: 1, title: "Intro with Acme", date: today, time: "10:00", location: "Zoom" },
//     { id: 2, title: "Design Sync", date: today, time: "14:00", location: "Google Meet" },
//     { id: 3, title: "Weekly Review", date: today, time: "16:30", location: "Office" },
//     {
//       id: 4,
//       title: "Follow up: X",
//       date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
//       time: "11:00",
//       location: "Zoom",
//     },
//   ];
// }















// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Calendar,
//   Menu,
//   PlusCircle,
//   User,
//   Settings,
//   LogOut,
//   BellRing,
//   CheckCircle,
// } from "lucide-react";
// import { motion } from "framer-motion";

// type EventItem = {
//   id: string;
//   summary: string;
//   start: string | null;
//   end: string | null;
//   location?: string | null;
//   htmlLink?: string | null;
//   organizer?: string | null;
// };

// export default function DashboardPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedDate, setSelectedDate] = useState<string>(() =>
//     new Date().toISOString().slice(0, 10)
//   );

//   // real events
//   const [events, setEvents] = useState<EventItem[]>([]);
//   const [loadingEvents, setLoadingEvents] = useState(false);
//   const [eventsError, setEventsError] = useState<string | null>(null);

//   // set this user_sub to the user record stored in DB (example: your test user)
//   // In production, you will get user_sub from session/auth
//   const USER_SUB = "102413774011411048990"; // <-- replace with the logged-in user's google sub

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoadingEvents(true);
//       setEventsError(null);
//       try {
//         const res = await fetch(`https://api.slotly.io/auth/calendar/events?user_sub=${USER_SUB}`);
//         if (!res.ok) {
//           const txt = await res.text();
//           throw new Error(txt || `HTTP ${res.status}`);
//         }
//         const payload = await res.json();
//         if (!payload.calendar_connected) {
//           setEvents([]);
//           setEventsError("Calendar not connected for this user.");
//         } else {
//           setEvents(payload.events || []);
//         }
//       } catch (err: any) {
//         setEventsError(err.message || String(err));
//       } finally {
//         setLoadingEvents(false);
//       }
//     };

//     fetchEvents();
//   }, [USER_SUB]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex text-slate-900">
//       {/* SIDEBAR */}
//       <aside className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-white border-r border-gray-200 shadow-sm flex flex-col`}>
//         <div className="flex items-center gap-3 px-4 py-5">
//           <button onClick={() => setSidebarOpen(s => !s)} className="p-1 rounded-md hover:bg-gray-100">
//             <Menu className="w-5 h-5 text-slate-700" />
//           </button>
//           {sidebarOpen && <div className="text-2xl font-bold text-blue-600">Slotly</div>}
//         </div>

//         <nav className="mt-6 px-2 flex-1">
//           <NavItem icon={<Calendar className="w-5 h-5" />} label="Calendar" active />
//           <NavItem icon={<PlusCircle className="w-5 h-5" />} label="Event Types" />
//           <NavItem icon={<User className="w-5 h-5" />} label="Contacts" />
//           <NavItem icon={<BellRing className="w-5 h-5" />} label="Notifications" />
//           <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
//         </nav>

//         <div className="px-4 py-4">
//           <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm">
//             <PlusCircle className="w-4 h-4" />
//             {sidebarOpen && <span>New Event</span>}
//           </button>
//         </div>

//         <div className="px-4 py-4 border-t border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">JD</div>
//             {sidebarOpen && <div>
//               <div className="font-semibold">John Doe</div>
//               <div className="text-xs text-gray-500">Founder</div>
//             </div>}
//           </div>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="flex-1 p-8">
//         {/* Top bar */}
//         <header className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-semibold">Your Schedule</h2>
//             <p className="text-sm text-gray-500">Overview of upcoming meetings and availability</p>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <input type="text" placeholder="Search events" className="px-4 py-2 rounded-lg border border-gray-200 bg-white" />
//             </div>
//             <button className="p-2 rounded-md hover:bg-gray-100"><BellRing className="w-5 h-5" /></button>
//             <div className="flex items-center gap-3">
//               <img src="/menwithtab.png" alt="me" className="w-9 h-9 rounded-full shadow-sm object-cover" />
//               <div className="text-right">
//                 <div className="text-sm font-semibold">John Doe</div>
//                 <div className="text-xs text-gray-500">slotly.team</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="grid grid-cols-12 gap-6">
//           {/* LEFT: Calendar + day list */}
//           <section className="col-span-12 lg:col-span-8">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-4">
//                   <h3 className="text-lg font-semibold">Calendar</h3>
//                   <div className="text-sm text-gray-500">{selectedDate}</div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Today</button>
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Week</button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-7 gap-2 text-sm">
//                 {renderWeekHeaders()}
//                 {renderMonthGrid(selectedDate, setSelectedDate)}
//               </div>
//             </div>

//             {/* Today's events */}
//             <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-semibold">Today</h4>
//                 <div className="text-sm text-gray-500">{events.filter(e => isSameISODate(e.start, selectedDate)).length} events</div>
//               </div>

//               <div className="space-y-4">
//                 {loadingEvents && <div className="text-gray-500">Loading events…</div>}
//                 {eventsError && <div className="text-red-600">{eventsError}</div>}
//                 {!loadingEvents && !eventsError && events.length === 0 && (
//                   <div className="text-gray-500">No events found. Connect your calendar or create events.</div>
//                 )}
//                 {events.filter(e => isSameISODate(e.start, selectedDate)).map((ev) => (
//                   <EventCard key={ev.id} event={ev} />
//                 ))}
//               </div>
//             </div>
//           </section>

//           {/* RIGHT: Event types and details */}
//           <aside className="col-span-12 lg:col-span-4">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
//               <h4 className="font-semibold mb-3">Event Types</h4>
//               <p className="text-sm text-gray-500 mb-4">Quick links to create and edit your event types.</p>

//               <div className="space-y-3">
//                 <EventTypeCard title="30-min Meeting" duration="30" color="from-blue-500 to-indigo-500" />
//                 <EventTypeCard title="60-min Deep Work" duration="60" color="from-emerald-500 to-teal-500" />
//                 <EventTypeCard title="Intro Call" duration="15" color="from-purple-500 to-pink-500" />
//               </div>

//               <button className="mt-6 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">Create Event Type</button>
//             </div>

//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <h4 className="font-semibold mb-3">Upcoming</h4>
//               <ul className="space-y-3">
//                 {events.slice(0, 4).map(ev => (
//                   <li key={ev.id} className="flex items-start gap-3">
//                     <div className="w-2 h-10 rounded bg-gradient-to-b from-blue-400 to-indigo-500" />
//                     <div className="flex-1">
//                       <div className="text-sm font-semibold">{ev.summary}</div>
//                       <div className="text-xs text-gray-500">{formatEventDate(ev.start)} • {ev.organizer}</div>
//                     </div>
//                     <div className="text-sm text-gray-400">{ev.location}</div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// }

// /* -------------------- helper components -------------------- */

// function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }){
//   return (
//     <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${active ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
//       <div className="text-slate-700">{icon}</div>
//       <div className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-gray-700'}`}>{label}</div>
//     </div>
//   );
// }

// function EventCard({ event }: { event: EventItem }){
//   return (
//     <motion.div layout initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white">
//       <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
//         <CheckCircle className="w-5 h-5" />
//       </div>
//       <div className="flex-1">
//         <div className="flex items-center justify-between">
//           <div className="font-semibold">{event.summary}</div>
//           <div className="text-sm text-gray-400">{formatEventDate(event.start)}</div>
//         </div>
//         <div className="text-sm text-gray-500">{event.location}</div>
//         {event.htmlLink && <a href={event.htmlLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600">Open in Google Calendar</a>}
//       </div>
//     </motion.div>
//   );
// }

// function EventTypeCard({ title, duration, color }: { title: string; duration: string | number; color: string }){
//   return (
//     <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all bg-white">
//       <div className="flex items-center gap-3">
//         <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${color} text-white flex items-center justify-center`}>⌚</div>
//         <div>
//           <div className="font-semibold">{title}</div>
//           <div className="text-xs text-gray-500">{duration} minutes</div>
//         </div>
//       </div>
//       <button className="text-sm text-blue-600">Edit</button>
//     </div>
//   );
// }

// /* -------------------- date helpers -------------------- */

// function formatEventDate(iso?: string | null) {
//   if (!iso) return "";
//   // ISO strings may be date (YYYY-MM-DD) or dateTime.
//   const d = new Date(iso);
//   return d.toLocaleString();
// }

// function isSameISODate(iso?: string | null, ymd?: string | null) {
//   if (!iso || !ymd) return false;
//   // compare only date part (YYYY-MM-DD)
//   const dt = new Date(iso);
//   const isoDate = dt.toISOString().slice(0, 10);
//   return isoDate === ymd;
// }

// /* -------------------- month grid helpers (reuse) -------------------- */

// function renderWeekHeaders(){
//   return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
//     <div key={d} className="text-xs font-medium text-gray-500 text-center py-2">{d}</div>
//   ));
// }

// function renderMonthGrid(selectedDate: string, setSelectedDate: (d:string)=>void){
//   const date = new Date(selectedDate);
//   const year = date.getFullYear();
//   const month = date.getMonth();
//   const first = new Date(year, month, 1);
//   const startWeek = first.getDay();
//   const daysInMonth = new Date(year, month+1, 0).getDate();
//   const cells: React.ReactNode[] = [];

//   for(let i=0;i<startWeek;i++) cells.push(<div key={`pad-${i}`} className="p-2"></div>);
//   for(let d=1; d<=daysInMonth; d++){
//     const iso = new Date(year, month, d).toISOString().slice(0,10);
//     cells.push(
//       <button key={iso} onClick={()=>setSelectedDate(iso)} className="p-2 rounded-lg hover:bg-blue-50 text-center">
//         <div className="text-sm">{d}</div>
//       </button>
//     );
//   }
//   return cells;
// }










// // app/dashboard/page.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Calendar,
//   Menu,
//   PlusCircle,
//   User,
//   Settings,
//   BellRing,
//   CheckCircle,
// } from "lucide-react";
// import { motion } from "framer-motion";

// import Link from "next/link";

// type EventItem = {
//   id: string;
//   summary: string;
//   start: string | null;
//   end: string | null;
//   location?: string | null;
//   htmlLink?: string | null;
//   organizer?: string | null;
// };

// export default function DashboardPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedDate, setSelectedDate] = useState<string>(() =>
//     new Date().toISOString().slice(0, 10)
//   );

//   // real events
//   const [events, setEvents] = useState<EventItem[]>([]);
//   const [loadingEvents, setLoadingEvents] = useState(false);
//   const [eventsError, setEventsError] = useState<string | null>(null);

//   // TODO: replace this with the logged-in user's google_sub from session/auth
//   // Example from your DB: "114029561545627197915"
//   const USER_SUB = "114029561545627197915";

//   // Derived map of events by local date string (YYYY-MM-DD)
//   const [eventsByDate, setEventsByDate] = useState<Record<string, EventItem[]>>({});

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoadingEvents(true);
//       setEventsError(null);
//       try {
//         const res = await fetch(
//           `https://api.slotly.io/auth/calendar/events?user_sub=${encodeURIComponent(
//             USER_SUB
//           )}`
//         );
//         if (!res.ok) {
//           const txt = await res.text();
//           throw new Error(txt || `HTTP ${res.status}`);
//         }
//         const payload = await res.json();
//         if (!payload.calendar_connected) {
//           setEvents([]);
//           setEventsByDate({});
//           setEventsError("Calendar not connected for this user.");
//         } else {
//           // normalize events (backend returns events array)
//           const normalized = (payload.events || []).map(normalizeEvent);
//           setEvents(normalized);
//           setEventsByDate(groupEventsByDate(normalized));
//         }
//       } catch (err: any) {
//         setEvents([]);
//         setEventsByDate({});
//         setEventsError(err.message || String(err));
//       } finally {
//         setLoadingEvents(false);
//       }
//     };

//     fetchEvents();
//     // re-fetch every 60s to keep UI fresh while testing (optional)
//     const id = setInterval(fetchEvents, 60000);
//     return () => clearInterval(id);
//   }, [USER_SUB]);

//   // When user clicks a date we already set selectedDate and grid uses that to display today's events.
//   return (
//     <div className="min-h-screen bg-gray-50 flex text-slate-900">
//       {/* SIDEBAR */}
//       <aside
//         className={`${
//           sidebarOpen ? "w-64" : "w-16"
//         } transition-all duration-300 bg-white border-r border-gray-200 shadow-sm flex flex-col`}
//       >
//         <div className="flex items-center gap-3 px-4 py-5">
//           <button
//             onClick={() => setSidebarOpen((s) => !s)}
//             className="p-1 rounded-md hover:bg-gray-100"
//           >
//             <Menu className="w-5 h-5 text-slate-700" />
//           </button>
//           {sidebarOpen && <div className="text-2xl font-bold text-blue-600">Slotly</div>}
//         </div>

//         <nav className="mt-6 px-2 flex-1">
//           <NavItem icon={<Calendar className="w-5 h-5" />} label="Calendar" active />
//           <NavItem icon={<PlusCircle className="w-5 h-5" />} label="Event Types" />
//           <NavItem icon={<User className="w-5 h-5" />} label="Contacts" />
//           <NavItem icon={<BellRing className="w-5 h-5" />} label="Notifications" />
//           <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
//         </nav>

//         <div className="px-4 py-4">
//           <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm">
//             <PlusCircle className="w-4 h-4" />
//             {sidebarOpen && <span>New Event</span>}
//           </button>
//         </div>

//         <div className="px-4 py-4 border-t border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">
//               JD
//             </div>
//             {sidebarOpen && (
//               <div>
//                 <div className="font-semibold">John Doe</div>
//                 <div className="text-xs text-gray-500">Founder</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="flex-1 p-8">
//         {/* Top bar */}
//         <header className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-semibold">Your Schedule</h2>
//             <p className="text-sm text-gray-500">Overview of upcoming meetings and availability</p>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <input type="text" placeholder="Search events" className="px-4 py-2 rounded-lg border border-gray-200 bg-white" />
//             </div>
//             <button className="p-2 rounded-md hover:bg-gray-100"><BellRing className="w-5 h-5" /></button>
//             <div className="flex items-center gap-3">
//               <img src="/menwithtab.png" alt="me" className="w-9 h-9 rounded-full shadow-sm object-cover" />
//               <div className="text-right">
//                 <div className="text-sm font-semibold">John Doe</div>
//                 <div className="text-xs text-gray-500">slotly.team</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="grid grid-cols-12 gap-6">
//           {/* LEFT: Calendar + day list */}
//           <section className="col-span-12 lg:col-span-8">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-4">
//                   <h3 className="text-lg font-semibold">Calendar</h3>
//                   <div className="text-sm text-gray-500">{selectedDate}</div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Today</button>
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Week</button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-7 gap-2 text-sm">
//                 {renderWeekHeaders()}
//                 {renderMonthGridWithDots(selectedDate, setSelectedDate, eventsByDate)}
//               </div>
//             </div>

//             {/* Today's events */}
//             <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-semibold">Today</h4>
//                 <div className="text-sm text-gray-500">{events.filter(e => isSameISODate(e.start, selectedDate)).length} events</div>
//               </div>

//               <div className="space-y-4">
//                 {loadingEvents && <div className="text-gray-500">Loading events…</div>}
//                 {eventsError && <div className="text-red-600">{eventsError}</div>}
//                 {!loadingEvents && !eventsError && events.length === 0 && (
//                   <div className="text-gray-500">No events found. Connect your calendar or create events.</div>
//                 )}
//                 {events.filter(e => isSameISODate(e.start, selectedDate)).map((ev) => (
//                   <EventCard key={ev.id} event={ev} />
//                 ))}
//               </div>
//             </div>
//           </section>

//           {/* RIGHT: Event types and details */}
//           <aside className="col-span-12 lg:col-span-4">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
//               <h4 className="font-semibold mb-3">Event Types</h4>
//               <p className="text-sm text-gray-500 mb-4">Quick links to create and edit your event types.</p>

//               <div className="space-y-3">
//                 <EventTypeCard title="30-min Meeting" duration="30" color="from-blue-500 to-indigo-500" />
//                 <EventTypeCard title="60-min Deep Work" duration="60" color="from-emerald-500 to-teal-500" />
//                 <EventTypeCard title="Intro Call" duration="15" color="from-purple-500 to-pink-500" />
//               </div>

//               <button className="mt-6 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">Create Event Type</button>
//             </div>

//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <h4 className="font-semibold mb-3">Upcoming</h4>
//               <ul className="space-y-3">
//                 {events.slice(0, 4).map(ev => (
//                   <li key={ev.id} className="flex items-start gap-3">
//                     <div className="w-2 h-10 rounded bg-gradient-to-b from-blue-400 to-indigo-500" />
//                     <div className="flex-1">
//                       <div className="text-sm font-semibold">{ev.summary}</div>
//                       <div className="text-xs text-gray-500">{formatEventDate(ev.start)} • {ev.organizer}</div>
//                     </div>
//                     <div className="text-sm text-gray-400">{ev.location}</div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// }

// /* -------------------- helper components -------------------- */

// // function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }){
// //   return (
// //     <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${active ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
// //       <div className="text-slate-700">{icon}</div>
// //       <div className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-gray-700'}`}>{label}</div>
// //     </div>
// //   );
// // }


// function NavItem({ icon, label, href, active }: { icon: React.ReactNode; label: string; href?: string; active?: boolean }) {
//   const className = `flex items-center gap-3 p-3 rounded-lg cursor-pointer ${active ? 'bg-gray-100' : 'hover:bg-gray-50'}`;
//   return href ? (
//     <Link href={href} className={className}>
//       <div className="text-slate-700">{icon}</div>
//       <div className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-gray-700'}`}>{label}</div>
//     </Link>
//   ) : (
//     <div className={className}>
//       <div className="text-slate-700">{icon}</div>
//       <div className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-gray-700'}`}>{label}</div>
//     </div>
//   );
// }
// function EventCard({ event }: { event: EventItem }){
//   return (
//     <motion.div layout initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white">
//       <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
//         <CheckCircle className="w-5 h-5" />
//       </div>
//       <div className="flex-1">
//         <div className="flex items-center justify-between">
//           <div className="font-semibold">{event.summary}</div>
//           <div className="text-sm text-gray-400">{formatEventDate(event.start)}</div>
//         </div>
//         <div className="text-sm text-gray-500">{event.location}</div>
//         {event.htmlLink && <a href={event.htmlLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600">Open in Google Calendar</a>}
//       </div>
//     </motion.div>
//   );
// }

// function EventTypeCard({ title, duration, color }: { title: string; duration: string | number; color: string }){
//   return (
//     <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all bg-white">
//       <div className="flex items-center gap-3">
//         <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${color} text-white flex items-center justify-center`}>⌚</div>
//         <div>
//           <div className="font-semibold">{title}</div>
//           <div className="text-xs text-gray-500">{duration} minutes</div>
//         </div>
//       </div>
//       <button className="text-sm text-blue-600">Edit</button>
//     </div>
//   );
// }

// /* -------------------- date helpers -------------------- */

// function formatEventDate(iso?: string | null) {
//   if (!iso) return "";
//   const d = new Date(iso);
//   return d.toLocaleString();
// }

// // Convert an ISO date/time or date to a local YYYY-MM-DD string (safe for timezone)
// function localYMD(isoOrDate?: string | null) {
//   if (!isoOrDate) return null;
//   const d = new Date(isoOrDate);
//   if (Number.isNaN(d.getTime())) return null;
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

// function isSameISODate(iso?: string | null, ymd?: string | null) {
//   if (!iso || !ymd) return false;
//   const isoDate = localYMD(iso);
//   return isoDate === ymd;
// }

// /* -------------------- normalization & grouping -------------------- */
// function normalizeEvent(ev: any): EventItem {
//   if (!ev) return { id: Math.random().toString(36), summary: "Untitled", start: null, end: null };
//   const start = ev.start?.dateTime || ev.start?.date || ev.start || null;
//   const end = ev.end?.dateTime || ev.end?.date || ev.end || null;
//   return {
//     id: ev.id || ev.eventId || String(Math.random()),
//     summary: ev.summary || ev.summaryText || ev.title || "Untitled",
//     start,
//     end,
//     location: ev.location || null,
//     htmlLink: ev.htmlLink || null,
//     organizer: ev.organizer?.email || ev.organizer || null,
//   };
// }

// function groupEventsByDate(events: EventItem[]) {
//   const map: Record<string, EventItem[]> = {};
//   for (const ev of events) {
//     const ymd = localYMD(ev.start) || localYMD(ev.end);
//     if (!ymd) continue;
//     if (!map[ymd]) map[ymd] = [];
//     map[ymd].push(ev);
//   }
//   return map;
// }

// /* -------------------- month grid helpers (with dots) -------------------- */

// function renderWeekHeaders(){
//   return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
//     <div key={d} className="text-xs font-medium text-gray-500 text-center py-2">{d}</div>
//   ));
// }

// function renderMonthGridWithDots(selectedDate: string, setSelectedDate: (d:string)=>void, eventsByDate: Record<string, EventItem[]>) {
//   const date = new Date(selectedDate);
//   const year = date.getFullYear();
//   const month = date.getMonth();
//   const first = new Date(year, month, 1);
//   const startWeek = first.getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const cells: React.ReactNode[] = [];

//   for (let i = 0; i < startWeek; i++) {
//     cells.push(<div key={`pad-${i}`} className="p-2"></div>);
//   }

//   for (let d = 1; d <= daysInMonth; d++) {
//     const thisDate = new Date(year, month, d);
//     const iso = `${thisDate.getFullYear()}-${String(thisDate.getMonth() + 1).padStart(2, "0")}-${String(thisDate.getDate()).padStart(2, "0")}`;
//     const hasEvents = !!eventsByDate[iso] && eventsByDate[iso].length > 0;
//     const isSelected = iso === selectedDate;

//     cells.push(
//       <button
//         key={iso}
//         onClick={() => setSelectedDate(iso)}
//         className={`p-2 rounded-lg text-center relative ${isSelected ? "bg-blue-50" : "hover:bg-blue-50"}`}
//         aria-label={`Select ${iso}`}
//       >
//         <div className={`text-sm ${isSelected ? "font-semibold text-slate-900" : "text-slate-700"}`}>{d}</div>

//         {/* Option 1: simple blue dot when the date has events */}
//         {hasEvents && (
//           <div className="absolute left-1/2 -translate-x-1/2 bottom-2">
//             <span className="block w-2.5 h-2.5 rounded-full bg-blue-600" />
//           </div>
//         )}
//       </button>
//     );
//   }
//   return cells;
// }










// // src/app/dashboard/page.tsx
// "use client";
// import React, { useState } from "react";
// import Sidebar from "./components/Sidebar/Sidebar";
// import Topbar from "./components/Topbar/Topbar.tsx";
// import CalendarGrid from "./components/Calendar/CalendarGrid";
// import EventList from "./components/Events/EventList";
// import UpcomingEvents from "./components/Events/UpcomingEvents";
// import EventTypes from "./components/EventTypes/EventTypes";
// import { useCalendarEvents } from "./hooks/useCalendarEvents";
// import { useUserProfile } from "./hooks/useUserProfile";
// import { useEventTypes } from "./hooks/useEventTypes";

// import { isSameISODate } from "./components/Calendar/CalendarHelpers";

// import EventTypesPanel from "./components/EventTypes/EventTypes";

// const DEFAULT_USER_SUB = process.env.NEXT_PUBLIC_DEFAULT_USER_SUB || "114029561545627197915";

// export default function DashboardPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

//   // replace with real auth session in future
//   const userSub = DEFAULT_USER_SUB;

//   const { data: user, loading: loadingUser } = useUserProfile(userSub);
//   const { events, eventsByDate, loading: loadingEvents, error: eventsError } = useCalendarEvents(userSub);
//   const { data: eventTypes } = useEventTypes(userSub);

//   return (
//     <div className="min-h-screen bg-gray-50 flex text-slate-900">
//       <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(s => !s)} />
//       <main className="flex-1 p-8">
//         <Topbar user={user} />

//         <div className="grid grid-cols-12 gap-6">
//           <section className="col-span-12 lg:col-span-8">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-4">
//                   <h3 className="text-lg font-semibold">Calendar</h3>
//                   <div className="text-sm text-gray-500">{selectedDate}</div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Today</button>
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Week</button>
//                 </div>
//               </div>

//               <CalendarGrid selectedDate={selectedDate} setSelectedDate={setSelectedDate} eventsByDate={eventsByDate} />
//             </div>

//             <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-semibold">Today</h4>
//                 <div className="text-sm text-gray-500">
//   {events.filter(e => isSameISODate(e.start, selectedDate)).length} events
// </div>
//                 {/* <div className="text-sm text-gray-500">{events.filter(e => new Date(e.start || '').toDateString() === new Date(selectedDate).toDateString()).length} events</div> */}
//               </div>

//               <EventList events={events} selectedDate={selectedDate} loading={loadingEvents} error={eventsError} />
//             </div>
//           </section>

//           {/* <aside className="col-span-12 lg:col-span-4">
//             <EventTypes items={eventTypes} />
//             <UpcomingEvents events={events} />
//           </aside> */}

//           <aside className="col-span-12 lg:col-span-4">
//   <EventTypesPanel userSub={userSub} />
//   <UpcomingEvents events={events} />
// </aside>
//         </div>
//       </main>
//     </div>
//   );
// }











// // src/app/dashboard/page.tsx
// "use client";
// import React, { useState } from "react";
// import Sidebar from "./components/Sidebar/Sidebar";
// import Topbar from "./components/Topbar/Topbar.tsx";
// import CalendarGrid from "./components/Calendar/CalendarGrid";
// import EventList from "./components/Events/EventList";
// import UpcomingEvents from "./components/Events/UpcomingEvents";
// import { useCalendarEvents } from "./hooks/useCalendarEvents";
// import { useUserProfile } from "./hooks/useUserProfile";
// import { useEventTypes } from "./hooks/useEventTypes";
// import { isSameISODate } from "./components/Calendar/CalendarHelpers";
// import EventTypesPanel from "./components/EventTypes/EventTypes";

// const DEFAULT_USER_SUB =
//   process.env.NEXT_PUBLIC_DEFAULT_USER_SUB || "114029561545627197915";

// export default function DashboardPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedDate, setSelectedDate] = useState<string>(() =>
//     new Date().toISOString().slice(0, 10)
//   );

//   // TEMP AUTH
//   const userSub = DEFAULT_USER_SUB;

//   const { data: user, loading: loadingUser } = useUserProfile(userSub);
//   const {
//     events,
//     eventsByDate,
//     loading: loadingEvents,
//     error: eventsError,
//   } = useCalendarEvents(userSub);

//   return (
//     <div className="min-h-screen bg-gray-50 flex text-slate-900">
//       <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((s) => !s)} />

//       <main className="flex-1 p-8">
//         <Topbar user={user} />

//         <div className="grid grid-cols-12 gap-6">
//           {/* LEFT SIDE - CALENDAR */}
//           <section className="col-span-12 lg:col-span-8">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-4">
//                   <h3 className="text-lg font-semibold">Calendar</h3>
//                   <div className="text-sm text-gray-500">{selectedDate}</div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
//                     Today
//                   </button>
//                   <button className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
//                     Week
//                   </button>
//                 </div>
//               </div>

//               <CalendarGrid
//                 selectedDate={selectedDate}
//                 setSelectedDate={setSelectedDate}
//                 eventsByDate={eventsByDate}
//               />
//             </div>

//             {/* TODAY EVENTS */}
//             <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-semibold">Today</h4>

//                 <div className="text-sm text-gray-500">
//                   {events.filter((e) => isSameISODate(e.start, selectedDate))
//                     .length}{" "}
//                   events
//                 </div>
//               </div>

//               <EventList
//                 events={events}
//                 selectedDate={selectedDate}
//                 loading={loadingEvents}
//                 error={eventsError}
//               />
//             </div>
//           </section>

//           {/* RIGHT SIDE - EVENT TYPES */}
//           <aside className="col-span-12 lg:col-span-4">
//             <EventTypesPanel userSub={userSub} username={user?.username ?? null} />
//             <UpcomingEvents events={events} />
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// }











"use client";

import React, { useState, useEffect } from "react";
=======
"use client";

import React, { useMemo, useState, useEffect } from "react";
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import CalendarGrid from "./components/Calendar/CalendarGrid";
import EventList from "./components/Events/EventList";
import UpcomingEvents from "./components/Events/UpcomingEvents";
import EventTypesPanel from "./components/EventTypes/EventTypes";

import { useCalendarEvents } from "./hooks/useCalendarEvents";
import { useUserProfile } from "./hooks/useUserProfile";
import { isSameISODate } from "./components/Calendar/CalendarHelpers";

<<<<<<< HEAD
// import NewEventModal from "./components/NewEvent/NewEventModal";


=======
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  const [userSub, setUserSub] = useState<string | null>(null);

<<<<<<< HEAD
  // const [newEventOpen, setNewEventOpen] = useState(false);


  // ---------------------------------
  // Load userSub from localStorage
  // ---------------------------------
=======
  // Search (Topbar controls)
  const [searchQuery, setSearchQuery] = useState("");

  // Load userSub from localStorage
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
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

<<<<<<< HEAD
  // ---------------------------------
  // HOOKS MUST ALWAYS RUN (fixes hook order error)
  // ---------------------------------
  const { data: user } = useUserProfile(userSub);
  const {
    events,
    eventsByDate,
    loading: loadingEvents,
    error: eventsError
  } = useCalendarEvents(userSub);

  // ---------------------------------
  // Show loading AFTER hooks run
  // ---------------------------------
=======
  // Hooks must always run
  const { data: user } = useUserProfile(userSub);
  const { events, eventsByDate, loading: loadingEvents, error: eventsError } =
    useCalendarEvents(userSub);

  // Filter events by search (summary / organizer / location)
  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return events;

    return events.filter((e: any) => {
      const summary = (e.summary || "").toLowerCase();
      const organizer = (e.organizer || "").toLowerCase();
      const location = (e.location || "").toLowerCase();
      return summary.includes(q) || organizer.includes(q) || location.includes(q);
    });
  }, [events, searchQuery]);

  // Calendar dots should respect search filter
  const filteredEventsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const ev of filteredEvents as any[]) {
      const iso = (ev.start || "").slice(0, 10);
      if (!iso) continue;
      map[iso] = map[iso] || [];
      map[iso].push(ev);
    }
    return map;
  }, [filteredEvents]);

  const dayCount = useMemo(() => {
    return filteredEvents.filter((e: any) => isSameISODate(e.start, selectedDate)).length;
  }, [filteredEvents, selectedDate]);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const isToday = selectedDate === todayISO;

>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
  if (!userSub || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading your dashboard…
      </div>
    );
  }

<<<<<<< HEAD
  // ---------------------------------
  // RENDER DASHBOARD UI
  // ---------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex text-slate-900">
      {/* <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((s) => !s)} /> */}

<Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(s => !s)} user={user} />

      <main className="flex-1 p-8">
        <Topbar user={user} />

        <div className="grid grid-cols-12 gap-6">
          {/* CALENDAR */}
          <section className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">Calendar</h3>
                  <div className="text-sm text-gray-500">{selectedDate}</div>
                </div>
              </div>

              <CalendarGrid
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                eventsByDate={eventsByDate}
              />
            </div>

            <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Today</h4>
                <div className="text-sm text-gray-500">
                  {
                    events.filter((e) =>
                      isSameISODate(e.start, selectedDate)
                    ).length
                  }{" "}
                  events
=======
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

        <div className="grid grid-cols-12 gap-6">
          {/* PRIMARY: Today / Selected Day */}
          <section className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {isToday ? "Today" : "Schedule"}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    Showing{" "}
                    <span className="font-medium text-slate-700">{selectedDate}</span>
                    {searchQuery.trim() ? (
                      <>
                        {" "}
                        • filtered by{" "}
                        <span className="font-medium text-slate-700">
                          “{searchQuery.trim()}”
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {dayCount} events
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
                </div>
              </div>

              <EventList
<<<<<<< HEAD
                events={events}
=======
                events={filteredEvents}
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
                selectedDate={selectedDate}
                loading={loadingEvents}
                error={eventsError}
              />
            </div>
<<<<<<< HEAD
          </section>

          {/* RIGHT SIDEBAR PANELS */}
          <aside className="col-span-12 lg:col-span-4">
            <EventTypesPanel userSub={userSub} />
            <UpcomingEvents events={events} />
=======

            {/* Calendar becomes “filter + overview” */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">Calendar Overview</h4>
                  <div className="text-xs text-gray-500 mt-1">
                    Pick a date to filter the timeline.
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  Today
                </button>
              </div>

              <CalendarGrid
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                eventsByDate={filteredEventsByDate}
              />
            </div>
          </section>

          {/* RIGHT COLUMN: consistent spacing */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <EventTypesPanel userSub={userSub} />
            <UpcomingEvents events={filteredEvents} selectedDate={selectedDate} />

>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
          </aside>
        </div>
      </main>
    </div>
  );
}
<<<<<<< HEAD

=======
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
