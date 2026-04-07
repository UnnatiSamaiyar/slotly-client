"use client";

import { useRouter } from "next/navigation";

type NotificationItemProps = {
    data: {
        id: number | string;
        title?: string;
        message?: string;
        created_at?: string;
        is_read: boolean;
        action_url?: string | null;
    };
    onMarkAsRead?: (id: number | string) => Promise<void> | void;
};

export default function NotificationItem({
    data,
    onMarkAsRead,
}: NotificationItemProps) {
    const router = useRouter();

    const handleClick = async () => {
        if (!data.is_read && onMarkAsRead) {
            await onMarkAsRead(data.id);
        }

        if (data.action_url) {
            router.push(data.action_url);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`cursor-pointer rounded-2xl border p-4 transition ${data.is_read
                    ? "border-slate-200 bg-white"
                    : "border-indigo-200 bg-indigo-50"
                }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        {data.title || "Notification"}
                    </h3>

                    {data.message ? (
                        <p className="mt-1 text-sm text-slate-600">{data.message}</p>
                    ) : null}
                </div>

                {!data.is_read && (
                    <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" />
                )}
            </div>

            <p className="mt-3 text-xs text-slate-400">
                {data.created_at ? new Date(data.created_at).toLocaleString() : ""}
            </p>
        </div>
    );
}