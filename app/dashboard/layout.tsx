

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
import DashboardTourProvider from "./components/Tour/DashboardTourProvider";

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
    const [scheduleFocusMode, setScheduleFocusMode] = useState(false);
 
    const [createEventTypeOpen, setCreateEventTypeOpen] = useState(false);

    useEffect(() => {
        setUserSub(getUserSub());
        setHydrated(true);
    }, []);
    useEffect(() => {
        if (typeof document === "undefined") return;

        const syncScheduleFocusMode = () => {
            const enabled = document.body.classList.contains(
                "slotly-schedule-edit-mode"
            );

            setScheduleFocusMode(enabled);

            if (enabled) {
                setSidebarOpen(false);
            } else if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            }
        };

        syncScheduleFocusMode();

        const observer = new MutationObserver(syncScheduleFocusMode);

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        const apply = () => {
            const desktop = window.innerWidth >= 1024;
            const focusMode = document.body.classList.contains(
                "slotly-schedule-edit-mode"
            );

            setIsDesktop(desktop);
            setSidebarOpen(desktop && !focusMode);
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
            <DashboardTourProvider>
                <div className="h-screen bg-white flex overflow-hidden">
                    {isDesktop && (
                        <Sidebar
                            open={scheduleFocusMode ? false : sidebarOpen}
                            onToggle={() => {
                                if (scheduleFocusMode) return;
                                setSidebarOpen((s) => !s);
                            }}
                            user={user}
                        />
                    )}

                    {!isDesktop && sidebarOpen && !scheduleFocusMode && (
                        <div className="fixed inset-0 z-50 flex">
                            <div
                                className="absolute inset-0 bg-black/35"
                                onClick={() => setSidebarOpen(false)}
                            />
                            <Sidebar open user={user} onToggle={() => setSidebarOpen(false)} />
                        </div>
                    )}

                    <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
                        {showTopbar && !scheduleFocusMode && (
                            <div className="relative shrink-0 bg-white">
                                {!isDesktop && (
                                    <button
                                        type="button"
                                        onClick={() => setSidebarOpen(true)}
                                        data-tour="mobile-sidebar-toggle"
                                        aria-label="Open sidebar"
                                        className="absolute left-4 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm lg:hidden"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </button>
                                )}

                                <div className={!isDesktop ? "pl-14 sm:pl-0" : ""}>
                                    <Topbar
                                        user={user}
                                        searchQuery=""
                                        onSearchQueryChange={() => { }}
                                        onCreateEventTypeClick={() => setCreateEventTypeOpen(true)}
                                    />
                                </div>
                            </div>
                        )}
                        <div
                            className={
                                scheduleFocusMode
                                    ? "flex-1 overflow-y-auto px-0 pb-0 pt-0"
                                    : "flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4"
                            }
                        >
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
            </DashboardTourProvider>
        </DashboardUserContext.Provider>
    );
}