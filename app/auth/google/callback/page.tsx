
"use client";

//@ts-nocheck
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalligraphyToast from "@/components/CalligraphyToast";
function safeParseState(stateStr?: string | null) {
  if (!stateStr) return null;

  try {
    let base64 = stateStr.replace(/-/g, "+").replace(/_/g, "/");

    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    const decoded = window.atob(base64);
    return JSON.parse(decoded);
  } catch {
    try {
      const decoded = decodeURIComponent(stateStr);
      return JSON.parse(decoded);
    } catch {
      try {
        return JSON.parse(stateStr);
      } catch {
        return null;
      }
    }
  }
}

function pickApiBase() {
  const envBase =
    (process.env.NEXT_PUBLIC_API_BASE ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "").trim();

  if (envBase) return envBase.replace(/\/+$/, "");
  return "https://api.slotly.io";
}

function GoogleCallbackInner() {
  const router = useRouter();
  const sp = useSearchParams();

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [message, setMessage] = useState("Completing login…");

  const code = sp.get("code");
  const stateStr = sp.get("state");

  const stateObj = useMemo(() => safeParseState(stateStr), [stateStr]);

  const returnTo = useMemo(() => {
    const rt = stateObj?.fromCreateEventModal
      ? "/dashboard/event-types?create_event=1"
      : stateObj?.returnTo;

    if (typeof rt === "string" && rt.startsWith("/")) return rt;
    return "/dashboard";
  }, [stateObj]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setStatus("loading");
        setMessage("Completing login…");

        if (!code) {
          setStatus("error");
          setMessage("Missing OAuth code. Please try logging in again.");
          return;
        }

        const API_BASE = pickApiBase();

        const res = await fetch(`${API_BASE}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            code,
            state: stateStr || null,
            mode: stateObj?.mode || "login",
            returnTo,
          }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Login failed");
        }

        const payload = await res.json();

        const user =
          payload?.user ||
          payload?.data?.user ||
          payload?.profile ||
          payload?.data?.profile ||
          payload;

        const sub = user?.sub || user?.google_sub || user?.id || null;

        if (!sub) {
          throw new Error("Login succeeded but user id (sub) was not returned by server.");
        }

        const session = {
          sub: String(sub),
          email: user?.email || "",
          name: user?.name || "",
          picture: user?.picture || "",
          image: user?.picture || "",
          raw: user,
        };

        try {
          localStorage.setItem("slotly_user", JSON.stringify(session));
          sessionStorage.setItem("slotly_user", JSON.stringify(session));

          const token = payload?.token || payload?.access_token || null;
          if (token) {
            localStorage.setItem("slotly_token", token);
            localStorage.setItem("access_token", token);
            sessionStorage.setItem("slotly_token", token);
            sessionStorage.setItem("access_token", token);
          }

          window.dispatchEvent(new Event("slotly-auth-changed"));

          console.log("Saved slotly_user:", localStorage.getItem("slotly_user"));
          console.log("Saved slotly_token:", localStorage.getItem("slotly_token"));
        } catch (err) {
          console.error("Failed saving login session:", err);
          throw err;
        }

        if (cancelled) return;

        setStatus("done");
        setMessage("Login successful. Redirecting…");

        setTimeout(() => {
          router.replace(returnTo);
          router.refresh();
        }, 500);
      } catch (e: any) {
        if (cancelled) return;
        console.error("Google callback error:", e);
        setStatus("error");
        setMessage(e?.message || "Login failed. Please try again.");
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [code, stateStr, returnTo, router, stateObj]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="text-xl font-semibold text-gray-900">
          {status === "error"
            ? "Login Failed"
            : status === "done"
              ? "Welcome back"
              : "Signing you in"}
        </div>

        <div
          className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-gray-600"
            }`}
        >
          {message}
        </div>

        {status === "error" ? (
          <button
            onClick={() => router.replace("/login")}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Go to Login
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Signing you in…
        </div>
      }
    >
      <GoogleCallbackInner />
    </Suspense>
  );
}

// "use client";

// //@ts-nocheck
// import React, { Suspense, useEffect, useMemo, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";

// function safeParseState(stateStr?: string | null) {
//   if (!stateStr) return null;

//   try {
//     const normalized = stateStr.replace(/-/g, "+").replace(/_/g, "/");
//     const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
//     const decoded = window.atob(padded);
//     return JSON.parse(decoded);
//   } catch {
//     try {
//       const decoded = decodeURIComponent(stateStr);
//       return JSON.parse(decoded);
//     } catch {
//       try {
//         return JSON.parse(stateStr);
//       } catch {
//         return null;
//       }
//     }
//   }
// }

// function pickApiBase() {
//   const envBase =
//     (process.env.NEXT_PUBLIC_API_BASE ||
//       process.env.NEXT_PUBLIC_BACKEND_URL ||
//       "").trim();

//   if (envBase) return envBase.replace(/\/+$/, "");
//   return "https://api.slotly.io";
// }

// function WritingToast({
//   open,
//   name,
//   subtext,
// }: {
//   open: boolean;
//   name: string;
//   subtext?: string;
// }) {
//   const text = `Welcome back, ${name || "User"}`;

//   return (
//     <AnimatePresence>
//       {open ? (
//         <motion.div
//           initial={{ opacity: 0, y: -18, scale: 0.96 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           exit={{ opacity: 0, y: -14, scale: 0.96 }}
//           transition={{ duration: 0.28, ease: "easeOut" }}
//           className="fixed right-4 top-4 z-[9999] w-[min(92vw,440px)]"
//         >
//           <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white/95 shadow-2xl backdrop-blur-xl">
//             <div className="px-5 py-4">
//               <div className="flex items-start gap-3">
//                 <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
//                 <div className="min-w-0 flex-1">
//                   <div className="overflow-hidden">
//                     <div
//                       className="inline-block max-w-full whitespace-nowrap text-[28px] leading-none text-neutral-900"
//                       style={{
//                         fontFamily:
//                           '"Brush Script MT","Segoe Script","Lucida Handwriting","Apple Chancery",cursive',
//                         width: "0ch",
//                         borderRight: "2px solid rgba(17,24,39,0.75)",
//                         animation:
//                           "slotly-handwrite 2s steps(28, end) forwards, slotly-caret 0.8s step-end infinite",
//                       }}
//                     >
//                       {text}
//                     </div>
//                   </div>

//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 1.15, duration: 0.35 }}
//                     className="mt-2 text-sm text-neutral-600"
//                   >
//                     {subtext || "Login successful. Redirecting..."}
//                   </motion.p>
//                 </div>
//               </div>
//             </div>

//             <motion.div
//               initial={{ width: "100%" }}
//               animate={{ width: "0%" }}
//               transition={{ duration: 2.6, ease: "linear" }}
//               className="h-1 bg-neutral-900/80"
//             />
//           </div>

//           <style jsx>{`
//             @keyframes slotly-handwrite {
//               from {
//                 width: 0ch;
//               }
//               to {
//                 width: 28ch;
//               }
//             }

//             @keyframes slotly-caret {
//               0%,
//               100% {
//                 border-right-color: rgba(17, 24, 39, 0.75);
//               }
//               50% {
//                 border-right-color: transparent;
//               }
//             }
//           `}</style>
//         </motion.div>
//       ) : null}
//     </AnimatePresence>
//   );
// }

// function GoogleCallbackInner() {
//   const router = useRouter();
//   const sp = useSearchParams();

//   const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
//   const [message, setMessage] = useState("Completing login…");
//   const [toastOpen, setToastOpen] = useState(false);
//   const [displayName, setDisplayName] = useState("User");

//   const code = sp.get("code");
//   const stateStr = sp.get("state");

//   const stateObj = useMemo(() => safeParseState(stateStr), [stateStr]);

//   const returnTo = useMemo(() => {
//     const rt = stateObj?.returnTo;
//     if (typeof rt === "string" && rt.startsWith("/")) return rt;
//     return "/dashboard";
//   }, [stateObj]);

//   useEffect(() => {
//     let cancelled = false;
//     let redirectTimer: ReturnType<typeof setTimeout> | null = null;

//     async function run() {
//       try {
//         setStatus("loading");
//         setMessage("Completing login…");

//         if (!code) {
//           setStatus("error");
//           setMessage("Missing OAuth code. Please try logging in again.");
//           return;
//         }

//         const API_BASE = pickApiBase();

//         const res = await fetch(`${API_BASE}/auth/google`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             code,
//             state: stateStr || null,
//             mode: stateObj?.mode || "login",
//             returnTo,
//           }),
//         });

//         if (!res.ok) {
//           const text = await res.text().catch(() => "");
//           throw new Error(text || "Login failed");
//         }

//         const payload = await res.json();

//         const user =
//           payload?.user ||
//           payload?.data?.user ||
//           payload?.profile ||
//           payload?.data?.profile ||
//           payload;

//         const sub = user?.sub || user?.google_sub || user?.id || null;

//         if (!sub) {
//           throw new Error("Login succeeded but user id (sub) was not returned by server.");
//         }

//         const session = {
//           sub: String(sub),
//           email: user?.email || "",
//           name: user?.name || "",
//           picture: user?.picture || "",
//           image: user?.picture || "",
//           raw: user,
//         };

//         try {
//           localStorage.setItem("slotly_user", JSON.stringify(session));
//           sessionStorage.setItem("slotly_user", JSON.stringify(session));

//           const token = payload?.token || payload?.access_token || null;
//           if (token) {
//             localStorage.setItem("slotly_token", token);
//             localStorage.setItem("access_token", token);
//             sessionStorage.setItem("slotly_token", token);
//             sessionStorage.setItem("access_token", token);
//           }

//           window.dispatchEvent(new Event("slotly-auth-changed"));
//         } catch (err) {
//           console.error("Failed saving login session:", err);
//           throw err;
//         }

//         if (cancelled) return;

//         setDisplayName(session.name || session.email?.split("@")[0] || "User");
//         setStatus("done");
//         setMessage("Login successful. Redirecting...");
//         setToastOpen(true);

//         redirectTimer = setTimeout(() => {
//           setToastOpen(false);
//           router.replace(returnTo);
//           router.refresh();
//         }, 2600);
//       } catch (e: any) {
//         if (cancelled) return;
//         console.error("Google callback error:", e);
//         setStatus("error");
//         setMessage(e?.message || "Login failed. Please try again.");
//       }
//     }

//     run();

//     return () => {
//       cancelled = true;
//       if (redirectTimer) clearTimeout(redirectTimer);
//     };
//   }, [code, stateStr, returnTo, router, stateObj]);

//   if (status === "error") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white px-6">
//         <div className="w-full max-w-md rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
//           <div className="text-xl font-semibold text-gray-900">Login Failed</div>
//           <div className="mt-3 text-sm text-red-600">{message}</div>

//           <button
//             onClick={() => router.replace("/login")}
//             className="mt-6 inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <WritingToast open={toastOpen} name={displayName} subtext={message} />

//       <div className="min-h-screen bg-white">
//         {status === "loading" ? (
//           <div className="flex min-h-screen items-center justify-center px-6">
//             <div className="text-sm text-gray-600">Loading...</div>
//           </div>
//         ) : null}
//       </div>
//     </>
//   );
// }

// export default function GoogleCallbackPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen flex items-center justify-center bg-white">
//           <div className="text-sm text-gray-600">Loading...</div>
//         </div>
//       }
//     >
//       <GoogleCallbackInner />
//     </Suspense>
//   );
// }