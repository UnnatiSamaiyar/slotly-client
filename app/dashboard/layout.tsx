

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import CreateEventTypeModal from "@/app/dashboard/components/EventTypes/CreateEventTypeModal";
import { Menu } from "lucide-react";
import { useUserProfile } from "./hooks/useUserProfile";
import { createEventType } from "@/lib/eventApi";
import { useToast } from "@/hooks/use-toast";

type DashboardUserContextType = {
    user: any;
    userSub: string;
};

const DashboardUserContext = createContext<DashboardUserContextType | null>(null);

export const useDashboardUser = () => {
    const ctx = useContext(DashboardUserContext);
    if (!ctx) throw new Error("useDashboardUser must be used inside DashboardLayout");
    return ctx;
};

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

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { toast } = useToast();

    const [userSub, setUserSub] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [createEventTypeOpen, setCreateEventTypeOpen] = useState(false);

    useEffect(() => {
        setUserSub(getUserSub());
        setHydrated(true);
    }, []);

    useEffect(() => {
        const apply = () => {
            const desktop = window.innerWidth >= 1024;
            setIsDesktop(desktop);
            setSidebarOpen(desktop);
        };
        apply();
        window.addEventListener("resize", apply);
        return () => window.removeEventListener("resize", apply);
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

    const showTopbar = pathname?.startsWith("/dashboard") ?? true;

    async function handleCreateEventType(payload: unknown) {
        await createEventType(payload as any);
        setCreateEventTypeOpen(false);
        toast({
            title: "Created",
            description: "Event type created successfully.",
            variant: "success",
        });
        window.dispatchEvent(new CustomEvent("slotly-event-type-created"));
    }

    return (
        <DashboardUserContext.Provider value={{ user, userSub }}>
            <div className="min-h-screen h-screen bg-white flex overflow-hidden">
                {isDesktop && (
                    <Sidebar
                        open={sidebarOpen}
                        onToggle={() => setSidebarOpen((s) => !s)}
                        user={user}
                    />
                )}

                {!isDesktop && sidebarOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        <div
                            className="absolute inset-0 bg-black/35"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <Sidebar open user={user} onToggle={() => setSidebarOpen(false)} />
                    </div>
                )}

                <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    {showTopbar && (
                        <div className="relative shrink-0 px-3 sm:px-3 lg:px-3 xl:px-3 2xl:px-3 pt-3 sm:pt-3 2xl:pt-3">
                            {/* Hamburger — absolutely positioned, only on non-desktop */}
                            {!isDesktop && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="absolute left-4 top-4 sm:left-6 h-10 w-10 rounded-xl border border-slate-200 bg-white shadow-sm lg:hidden flex items-center justify-center"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>
                            )}

                            {/* Topbar — always has left padding to clear the hamburger on non-desktop */}
                            <div className={!isDesktop ? "pl-12" : ""}>
                                <Topbar
                                    user={user}
                                    searchQuery=""
                                    onSearchQueryChange={() => { }}
                                    onCreateEventTypeClick={() => setCreateEventTypeOpen(true)}
                                />
                            </div>
                        </div>
                    )}

                    {!showTopbar && !isDesktop && (
                        <div className="shrink-0 px-4 pt-4 sm:px-6 flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="h-10 w-10 rounded-xl border border-slate-200 bg-white shadow-sm lg:hidden flex items-center justify-center"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                    <div
                        className={`flex-1 min-h-0 flex flex-col overflow-y-auto px-3 sm:px-4 lg:px-5 xl:px-6 2xl:px-8 pb-4 ${showTopbar ? "pt-4" : "pt-4 sm:pt-6"}`}>
                        {children}
                    </div>
                </main>

                <CreateEventTypeModal
                    open={createEventTypeOpen}
                    onClose={() => setCreateEventTypeOpen(false)}
                    userSub={userSub}
                    onCreate={handleCreateEventType}
                />
            </div>
        </DashboardUserContext.Provider>
    );
}