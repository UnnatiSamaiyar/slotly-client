"use client";
import { useEffect } from "react";
import useNotifications from "../hooks/useNotification";
import NotificationItem from "../components/Notification/NotificationItem";
export default function NotificationsPage() {
    const {
        notifications,
        loading,
        error,
        fetchNotifications,
        markAllRead,
    } = useNotifications();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage your notifications and updates.
                    </p>
                </div>

                {notifications.length > 0 && (
                    <button
                        type="button"
                        onClick={markAllRead}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="min-h-[400px] rounded-2xl border border-slate-200 bg-white p-6">
                {loading ? (
                    <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
                        Loading notifications...
                    </div>
                ) : error ? (
                    <div className="flex min-h-[300px] items-center justify-center text-sm text-red-600">
                        {error}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
                        No notifications yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((item: any) => (
                            <NotificationItem key={item.id} data={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}