//@ts-nocheck
"use client";

import {
    CalendarDays,
    XCircle,
    CheckCircle,
    RefreshCw,
    AlertTriangle,
    UserPlus,
    BarChart2,
    Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type NotificationItemProps = {
    notification: {
        id: number;
        type?: string;
        title: string;
        description?: string;
        message?: string;
        read: boolean;
        time?: string;
        action_url?: string;
    };
    markAsRead: (id: number) => void;
};

type IconConfig = {
    icon: React.ReactNode;
    bg: string;
    border: string;
};

function getIconConfig(type?: string, title?: string, description?: string): IconConfig {
    const raw = `${type || ""} ${title || ""} ${description || ""}`.toLowerCase();

    if (raw.includes("cancel") || raw.includes("declined") || raw.includes("removed")) {
        return { icon: <XCircle className="w-5 h-5 text-red-500" />, bg: "bg-red-50", border: "border-red-100" };
    }
    if (raw.includes("reschedule") || raw.includes("rescheduled") || raw.includes("moved") || raw.includes("updated")) {
        return { icon: <RefreshCw className="w-5 h-5 text-amber-500" />, bg: "bg-amber-50", border: "border-amber-100" };
    }
    if (raw.includes("success") || raw.includes("connected") || raw.includes("synced") || raw.includes("active")) {
        return { icon: <CheckCircle className="w-5 h-5 text-emerald-500" />, bg: "bg-emerald-50", border: "border-emerald-100" };
    }
    if (raw.includes("contact") || raw.includes("added")) {
        return { icon: <UserPlus className="w-5 h-5 text-sky-500" />, bg: "bg-sky-50", border: "border-sky-100" };
    }
    if (raw.includes("disconnected") || raw.includes("warning") || raw.includes("alert") || raw.includes("error") || raw.includes("reconnect")) {
        return { icon: <AlertTriangle className="w-5 h-5 text-orange-500" />, bg: "bg-orange-50", border: "border-orange-100" };
    }
    if (raw.includes("analytics") || raw.includes("report") || raw.includes("summary") || raw.includes("efficiency")) {
        return { icon: <BarChart2 className="w-5 h-5 text-violet-500" />, bg: "bg-violet-50", border: "border-violet-100" };
    }
    if (raw.includes("booking") || raw.includes("meeting") || raw.includes("call") || raw.includes("scheduled")) {
        return { icon: <CalendarDays className="w-5 h-5 text-indigo-500" />, bg: "bg-indigo-50", border: "border-indigo-100" };
    }
    return { icon: <Bell className="w-5 h-5 text-slate-500" />, bg: "bg-slate-100", border: "border-slate-200" };
}

function getActionRoute(type?: string, title?: string, description?: string, action_url?: string): string | null {
    if (action_url) return action_url;
    const raw = `${type || ""} ${title || ""} ${description || ""}`.toLowerCase();
    if (raw.includes("booking") || raw.includes("meeting") || raw.includes("call") || raw.includes("scheduled") || raw.includes("reschedule") || raw.includes("cancel")) return "/dashboard/your-schedule";
    if (raw.includes("contact") || raw.includes("added")) return "/dashboard/contacts";
    if (raw.includes("integration") || raw.includes("connected") || raw.includes("disconnected") || raw.includes("reconnect") || raw.includes("calendar")) return "/dashboard/settings";
    if (raw.includes("analytics") || raw.includes("report") || raw.includes("summary")) return "/dashboard/analytics";
    return null;
}

function getActionLabel(type?: string, title?: string, description?: string): string {
    const raw = `${type || ""} ${title || ""} ${description || ""}`.toLowerCase();
    if (raw.includes("reconnect") || raw.includes("disconnected")) return "Reconnect Now";
    if (raw.includes("reschedule") || raw.includes("rescheduled")) return "Update Calendar";
    if (raw.includes("contact") || raw.includes("added")) return "View Contact";
    if (raw.includes("analytics") || raw.includes("report") || raw.includes("summary")) return "View Analytics";
    if (raw.includes("booking") || raw.includes("meeting") || raw.includes("scheduled")) return "View Details";
    return "View Details";
}

export default function NotificationItem({ notification, markAsRead }: NotificationItemProps) {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const isUnread = !(notification.read ?? notification.is_read);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 20);
        return () => clearTimeout(t);
    }, []);

    const { icon, bg, border } = getIconConfig(notification.type, notification.title, notification.description);
    const actionRoute = getActionRoute(notification.type, notification.title, notification.description, notification.action_url);
    const actionLabel = getActionLabel(notification.type, notification.title, notification.description);

    const handleClick = () => {
        if (isUnread) markAsRead(notification.id);

        if (actionRoute) {
            router.push(actionRoute);
        }
    };

    // const handleAction = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     if (!notification.read) markAsRead(notification.id);
    //     if (actionRoute) router.push(actionRoute);
    // };

    return (
        <div
            onClick={handleClick}
            className={`
  group relative flex cursor-pointer items-start gap-3 overflow-hidden border-b border-slate-200
  px-4 py-3 transition
  ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
  ${isUnread ? "bg-[#E8F3FF] hover:bg-[#DDEEFF]" : "bg-white hover:bg-slate-50"}
`}
        >
            {isUnread && (
                <span className="pointer-events-none absolute inset-y-0 left-0 z-0 w-1/3 animate-[notifGlare_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />            )}
            <div
                className={`
  relative z-10 mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border
  ${bg} ${border}
`}
            >
                {icon}
            </div>

            <div className="relative z-10 min-w-0 flex-1 pr-2">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3
                            className={`
              line-clamp-2 text-[13px] leading-[18px] text-slate-900
              ${isUnread ? "font-semibold" : "font-medium"}
              sm:text-sm sm:leading-5
            `}
                        >
                            {notification.title}
                        </h3>

                        {(notification.description || notification.message) && (
                            <p className="mt-0.5 line-clamp-2 text-[12px] leading-[17px] text-slate-600 sm:text-[13px]">
                                {notification.description || notification.message}
                            </p>
                        )}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                        <span
                            className={`
              whitespace-nowrap text-[11px] font-medium
              ${isUnread ? "text-[#0A66C2]" : "text-slate-500"}
            `}
                        >
                            {notification.time || ""}
                        </span>

                        <span className="text-xl leading-none text-slate-400">•••</span>
                    </div>
                </div>
            </div>
        </div>
    );
}