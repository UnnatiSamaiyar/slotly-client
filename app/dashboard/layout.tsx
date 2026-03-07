"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserProfile } from "./hooks/useUserProfile";

type DashboardUserContextType = {
    user: any;
    userSub: string;
};

const DashboardUserContext =
    createContext<DashboardUserContextType | null>(null);

export const useDashboardUser = () => {
    const ctx = useContext(DashboardUserContext);
    if (!ctx) {
        throw new Error("useDashboardUser must be used inside DashboardLayout");
    }
    return ctx;
};

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

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [userSub, setUserSub] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setUserSub(getUserSub());
        setHydrated(true);
    }, []);

    const { data: user, loading: isLoading } = useUserProfile(userSub);

    if (!hydrated) {
        return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
    }

    if (!userSub) {
        if (typeof window !== "undefined") window.location.replace("/");
        return null;
    }

    if (isLoading || !user) {
        return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
    }

    return (
        <DashboardUserContext.Provider value={{ user, userSub }}>
            {children}
        </DashboardUserContext.Provider>
    );
}