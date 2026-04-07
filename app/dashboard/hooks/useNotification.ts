"use client";

import { useState, useCallback } from "react";

type NotificationType = {
    id: number | string;
    type?: string;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
    action_url?: string | null;
};

const API_BASE = (
    process.env.NEXT_PUBLIC_API_URL || "https://api.slotly.io0"
).replace(/\/$/, "");

function getUserSub(): string | null {
    try {
        const keys = ["slotly_user", "user", "auth_user", "slotlyUser"];

        for (const key of keys) {
            const raw = localStorage.getItem(key);
            if (!raw) continue;

            try {
                const parsed = JSON.parse(raw);
                if (parsed?.sub) return parsed.sub;
                if (parsed?.user?.sub) return parsed.user.sub;
            } catch {
                continue;
            }
        }

        return null;
    } catch {
        return null;
    }
}

function normalizeNotifications(items: any[]): NotificationType[] {
    const uniqueMap = new Map<number | string, NotificationType>();

    for (const item of items) {
        if (!item?.id) continue;

        uniqueMap.set(item.id, {
            id: item.id,
            type: item.type,
            title: item.title || "Notification",
            message: item.message || "",
            created_at: item.created_at || "",
            is_read: Boolean(item.is_read),
            action_url: item.action_url ?? null,
        });
    }

    return Array.from(uniqueMap.values()).sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
    });
}

export default function useNotifications() {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        const userSub = getUserSub();

        if (!userSub) {
            setNotifications([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `${API_BASE}/notifications?user_sub=${encodeURIComponent(userSub)}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.detail || "Failed to fetch notifications");
            }

            const items = Array.isArray(data?.items) ? data.items : [];
            setNotifications(normalizeNotifications(items));
        } catch (err: any) {
            setError(err.message || "Failed to fetch notifications");
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (id: number | string) => {
        const userSub = getUserSub();
        if (!userSub) return;

        try {
            const res = await fetch(
                `${API_BASE}/notifications/mark-read?user_sub=${encodeURIComponent(userSub)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                }
            );

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.detail || "Failed to mark notification as read");
            }

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, is_read: true } : n
                )
            );
        } catch (err: any) {
            setError(err.message || "Failed to mark notification as read");
        }
    }, []);

    const markAllRead = useCallback(async () => {
        const userSub = getUserSub();
        if (!userSub) return;

        try {
            const res = await fetch(
                `${API_BASE}/notifications/mark-all-read?user_sub=${encodeURIComponent(userSub)}`,
                {
                    method: "POST",
                }
            );

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.detail || "Failed to mark all as read");
            }

            setNotifications((prev) =>
                prev.map((n) => ({ ...n, is_read: true }))
            );
        } catch (err: any) {
            setError(err.message || "Failed to mark all as read");
        }
    }, []);

    return {
        notifications,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllRead,
    };
}