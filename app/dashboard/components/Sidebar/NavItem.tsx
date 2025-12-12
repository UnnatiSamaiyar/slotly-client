// src/app/dashboard/components/Sidebar/NavItem.tsx
import Link from "next/link";
import React from "react";

export default function NavItem({ icon, label, href, active }: { icon: React.ReactNode; label: string; href?: string; active?: boolean }) {
  const className = `flex items-center gap-3 p-3 rounded-lg cursor-pointer ${active ? 'bg-gray-100' : 'hover:bg-gray-50'}`;
  return href ? (
    <Link href={href} className={className}>
      <div className="text-slate-700">{icon}</div>
      <div className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-gray-700'}`}>{label}</div>
    </Link>
  ) : (
    <div className={className}>
      <div className="text-slate-700">{icon}</div>
      <div className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-gray-700'}`}>{label}</div>
    </div>
  );
}
