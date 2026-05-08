"use client";

import { useState, useCallback, useEffect } from "react";

export type NotificationItem = {
    id: number;
    type?: string;
    title: string;
    description?: string;
    message?: string;
    read: boolean;
    is_read?: boolean;
    time?: string;
    day?: string;
    created_at?: string;
    action_url?: string;
};

const API_BASE = (
    process.env.NEXT_PUBLIC_API_URL || "https://api.slotly.io"
).replace(/\/$/, "");

function getUserSub(): string | null {
    try {
        const raw = localStorage.getItem("slotly_user");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.sub || null;
    } catch {
        return null;
    }
}

function getDay(created_at?: string): "today" | "yesterday" | "earlier" {
    if (!created_at) return "earlier";
    const d = new Date(created_at);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    ) return "today";

    if (
        d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear()
    ) return "yesterday";

    return "earlier";
}

function getTimeLabel(created_at?: string): string {
    if (!created_at) return "";
    const diff = Date.now() - new Date(created_at).getTime();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    if (diff < minute) return "Just now";
    if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
    if (diff < day) return `${Math.floor(diff / hour)}h ago`;
    return new Date(created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
}

function normalize(item: any): NotificationItem {
    return {
        id: item.id,
        type: item.type || "booking",
        title: item.title || "Notification",
        description: item.message || item.description || "",
        message: item.message || item.description || "",
        read: Boolean(item.is_read),
        is_read: Boolean(item.is_read),
        time: getTimeLabel(item.created_at),
        day: getDay(item.created_at),
        created_at: item.created_at,
        action_url: item.action_url,
    };
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        const userSub = getUserSub();
        if (!userSub) return;

        setLoading(true);
        try {
            const res = await fetch(
                `${API_BASE}/notifications?user_sub=${encodeURIComponent(userSub)}`,
                { cache: "no-store" }
            );
            const data = await res.json().catch(() => null);
            const items = Array.isArray(data)
                ? data
                : Array.isArray(data?.items)
                    ? data.items
                    : Array.isArray(data?.notifications)
                        ? data.notifications
                        : [];
            setNotifications(items.map(normalize));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (id: number) => {
        const userSub = getUserSub();
        if (!userSub) return;

        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true, is_read: true } : n))
        );

        try {
            await fetch(
                `${API_BASE}/notifications/mark-read?user_sub=${encodeURIComponent(userSub)}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id }),
                }
            );
        } catch { }
    }, []);

    const markAllAsRead = useCallback(async () => {
        const userSub = getUserSub();
        if (!userSub) return;

        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true, is_read: true }))
        );

        try {
            await fetch(
                `${API_BASE}/notifications/mark-all-read?user_sub=${encodeURIComponent(userSub)}`,
                { method: "POST" }
            );
        } catch { }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return {
        notifications,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        unreadCount,
    };
}