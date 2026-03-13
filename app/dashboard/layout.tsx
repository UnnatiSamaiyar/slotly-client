// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useUserProfile } from "./hooks/useUserProfile";

// type DashboardUserContextType = {
//     user: any;
//     userSub: string;
// };

// const DashboardUserContext =
//     createContext<DashboardUserContextType | null>(null);

// export const useDashboardUser = () => {
//     const ctx = useContext(DashboardUserContext);
//     if (!ctx) {
//         throw new Error("useDashboardUser must be used inside DashboardLayout");
//     }
//     return ctx;
// };

// function getUserSub(): string | null {
//     try {
//         const raw = localStorage.getItem("slotly_user");
//         if (!raw) return null;
//         const parsed = JSON.parse(raw);
//         return parsed?.sub || null;
//     } catch {
//         return null;
//     }
// }

// export default function DashboardLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     const [userSub, setUserSub] = useState<string | null>(null);
//     const [hydrated, setHydrated] = useState(false);

//     useEffect(() => {
//         setUserSub(getUserSub());
//         setHydrated(true);
//     }, []);

//     const { data: user, loading: isLoading } = useUserProfile(userSub);

//     if (!hydrated) {
//         return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
//     }

//     if (!userSub) {
//         if (typeof window !== "undefined") window.location.replace("/");
//         return null;
//     }

//     if (isLoading || !user) {
//         return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
//     }

//     return (
//         <DashboardUserContext.Provider value={{ user, userSub }}>
//             {children}
//         </DashboardUserContext.Provider>
//     );
// }


"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import { Menu } from "lucide-react";
import { useUserProfile } from "./hooks/useUserProfile";

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
    const [userSub, setUserSub] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

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

    return (
        <DashboardUserContext.Provider value={{ user, userSub }}>
            <div className="h-screen bg-slate-50 flex overflow-hidden">
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
                    <div className="relative shrink-0 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
                        {!isDesktop && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="absolute left-4 top-4 h-10 w-10 rounded-xl border border-slate-200 bg-white shadow-sm lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        )}

                        <div className={!isDesktop ? "pl-12 sm:pl-0" : ""}>
                            <Topbar
                                user={user}
                                searchQuery=""
                                onSearchQueryChange={() => { }}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
                        {children}
                    </div>
                </main>
            </div>
        </DashboardUserContext.Provider>
    );
}