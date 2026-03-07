// "use client";
// import { useEffect, useState } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useMotionValueEvent,
// } from "framer-motion";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Menu, X } from "lucide-react";
// import { CommandPalette } from "./commandpallete";
// import { useRouter, usePathname } from "next/navigation";
// import Image from "next/image";

// type NavItem = { label: string; id: string; hideOnMobile?: boolean };

// const NAV_ITEMS: NavItem[] = [
//   { label: "Features", id: "features" },
//   { label: "How it works", id: "how-it-works", hideOnMobile: true }, // hidden on mobile
//   { label: "Security", id: "security" },
//   { label: "FAQ", id: "faq" },
// ];

// function scrollToSection(id: string) {
//   const el = document.getElementById(id);
//   if (!el) return;

//   const headerOffset = 88; // tweak if needed
//   const elementPosition = el.getBoundingClientRect().top + window.scrollY;
//   const offsetPosition = elementPosition - headerOffset;

//   window.scrollTo({ top: offsetPosition, behavior: "smooth" });

//   // keep hash for nav clicks (good UX), but NOT for brand click
//   history.replaceState(null, "", `#${id}`);
// }

// export function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [open, setOpen] = useState(false);
//   const { scrollY } = useScroll();

//   useMotionValueEvent(scrollY, "change", (latest) => {
//     setIsScrolled(latest > 20);
//   });

//   const router = useRouter();
//   const pathname = usePathname();

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [hydrated, setHydrated] = useState(false);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("slotly_user");
//       setIsLoggedIn(!!raw);
//     } catch {
//       setIsLoggedIn(false);
//     } finally {
//       setHydrated(true);
//     }
//   }, []);
//   const handleNavClick = (id: string) => {
//     setIsOpen(false);

//     // If user is on another page, go to home with hash
//     if (pathname !== "/") {
//       router.push(`/#${id}`);
//       return;
//     }

//     // Same page: smooth scroll
//     requestAnimationFrame(() => scrollToSection(id));
//   };

//   const mobileItems = NAV_ITEMS.filter((x) => !x.hideOnMobile);

//   const handleBrandClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsOpen(false);

//     // ✅ hard reload to homepage; NO #hero
//     // If already on "/", still reload.
//     window.location.href = "/";
//   };

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -80 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg transition-all duration-500 ${
//           isScrolled
//             ? "bg-white/70 border-b border-gray-200 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.08)] py-3"
//             : "bg-transparent border-transparent py-5"
//         }`}
//       >
//         <div className="container mx-auto flex items-center justify-between px-6">
//           {/* Brand (hard reload, no hash) */}
//          <Link href="/" className="flex items-center">
//             <motion.div whileHover={{ scale: 1.05 }} className="relative">
//               <Image
//                 src="/assets/Slotlyio-logo.png"
//                 alt="Slotly"
//                 width={240}
//                 height={40}
//                 priority
//                 className="h-14 w-auto"
//               />
//             </motion.div>
//           </Link>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center gap-10">
//             {NAV_ITEMS.map((item) => (
//               <button
//                 key={item.id}
//                 type="button"
//                 onClick={() => handleNavClick(item.id)}
//                 className="relative text-gray-700 font-medium transition-colors hover:text-blue-600 group"
//               >
//                 {item.label}
//                 <span className="absolute left-0 bottom-[-3px] w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300" />
//               </button>
//             ))}
//             {hydrated && (isLoggedIn ? (
//               <Button
//                 onClick={() => {
//                   setIsOpen(false);
//                   router.push("/dashboard");
//                 }}
//                 className="rounded-full text-sm font-semibold px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all"
//               >
//                 Dashboard
//               </Button>
//             ) : (
//               <Button
//                 onClick={() => {
//                   setIsOpen(false);
//                   router.push("/login");
//                 }}
//                 className="rounded-full text-sm font-semibold px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all"
//               >
//                 Get Started
//               </Button>
//             ))}
//           </div>

//           {/* Mobile toggle */}
//           <button
//             onClick={() => setIsOpen((s) => !s)}
//             className="md:hidden text-gray-800 focus:outline-none"
//             aria-label="Toggle menu"
//           >
//             {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* Mobile overlay + drawer */}
//         <AnimatePresence>
//           {isOpen && (
//             <>
//               {/* Overlay */}
//               <motion.button
//                 type="button"
//                 aria-label="Close menu"
//                 className="fixed inset-0 z-[60] bg-black/10 md:hidden"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={() => setIsOpen(false)}
//               />

//               {/* Drawer */}
//               <motion.div
//                 className="relative z-[70] md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-inner pointer-events-auto"
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: "auto", opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.35 }}
//               >
//                 <div className="flex flex-col items-center gap-6 py-8">
//                   {mobileItems.map((item) => (
//                     <button
//                       key={item.id}
//                       type="button"
//                       onClick={() => handleNavClick(item.id)}
//                       className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
//                     >
//                       {item.label}
//                     </button>
//                   ))}

//                   <Button
//                     onClick={() => {
//                       setIsOpen(false);
//                       router.push("/login");
//                     }}
//                     className="rounded-full text-sm font-semibold px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all"
//                   >
//                     Get Started
//                   </Button>
//                 </div>
//               </motion.div>
//             </>
//           )}
//         </AnimatePresence>
//       </motion.nav>

//       <CommandPalette open={open} setOpen={setOpen} />
//     </>
//   );
// }


"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { CommandPalette } from "./commandpallete";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

type NavItem = { label: string; id: string; hideOnMobile?: boolean };

const NAV_ITEMS: NavItem[] = [
  { label: "Features", id: "features" },
  { label: "How it works", id: "how-it-works", hideOnMobile: true },
  { label: "Security", id: "security" },
  { label: "FAQ", id: "faq" },
];

type LocalUser = {
  name?: string;
  full_name?: string;
  email?: string;
  image?: string;
  avatarUrl?: string;
  picture?: string;
};

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const headerOffset = 88;
  const elementPosition = el.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - headerOffset;

  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
}

function getInitials(name?: string) {
  const s = String(name || "").trim();
  if (!s) return "U";
  const parts = s.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "U";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
}

function ProfileMenu({
  user,
  onDashboard,
  onLogout,
}: {
  user: LocalUser;
  onDashboard: () => void;
  onLogout: () => void;
}) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const name = user?.name || user?.full_name || user?.email || "User";
  const email = user?.email;
  const imageUrl = user?.image || user?.avatarUrl || user?.picture;
  const initials = getInitials(name);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setAvatarOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setAvatarOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        type="button"
        onClick={() => setAvatarOpen((s) => !s)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1.5 shadow-sm hover:shadow transition"
        aria-haspopup="menu"
        aria-expanded={avatarOpen}
      >
        <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className="text-sm font-semibold text-gray-700">{initials}</span>
          )}
        </div>

        {/* Chevron only */}
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${avatarOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {avatarOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{name}</p>
            {email ? <p className="text-xs text-gray-500 line-clamp-1">{email}</p> : null}
          </div>

          <button
            type="button"
            onClick={() => {
              setAvatarOpen(false);
              onDashboard();
            }}
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => {
              setAvatarOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [localUser, setLocalUser] = useState<LocalUser>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("slotly_user");
      if (raw) {
        setIsLoggedIn(true);
        try {
          setLocalUser(JSON.parse(raw));
        } catch {
          setLocalUser({});
        }
      } else {
        setIsLoggedIn(false);
        setLocalUser({});
      }
    } catch {
      setIsLoggedIn(false);
      setLocalUser({});
    } finally {
      setHydrated(true);
    }
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem("slotly_user");
      localStorage.removeItem("slotly_token"); // if you have
      localStorage.removeItem("access_token"); // if you have
    } catch { }
    setIsLoggedIn(false);
    setLocalUser({});
    setIsOpen(false);
    router.push("/login");
  };

  const handleNavClick = (id: string) => {
    setIsOpen(false);

    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    requestAnimationFrame(() => scrollToSection(id));
  };

  const mobileItems = useMemo(() => NAV_ITEMS.filter((x) => !x.hideOnMobile), []);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg transition-all duration-500 ${isScrolled
            ? "bg-white/70 border-b border-gray-200 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.08)] py-3"
            : "bg-transparent border-transparent py-5"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Brand */}
          <Link href="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <Image
                src="/assets/Slotlyio-logo.webp"
                alt="Slotly"
                width={240}
                height={80}
                priority
                className="h-10 w-auto object-contain"
              />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="relative text-gray-700 font-medium transition-colors hover:text-blue-600 group"
              >
                {item.label}
                <span className="absolute left-0 bottom-[-3px] w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300" />
              </button>
            ))}

            {hydrated &&
              (isLoggedIn ? (
                <ProfileMenu
                  user={localUser}
                  onDashboard={() => {
                    setIsOpen(false);
                    router.push("/dashboard");
                  }}
                  onLogout={logout}
                />
              ) : (
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/login");
                  }}
                  className="rounded-full text-sm font-semibold px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all"
                >
                  Get Started
                </Button>
              ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((s) => !s)}
            className="md:hidden text-gray-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile overlay + drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close menu"
                className="fixed inset-0 z-[60] bg-black/10 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                className="relative z-[70] md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-inner pointer-events-auto"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex flex-col items-center gap-6 py-8">
                  {mobileItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}

                  {/* Mobile CTA changes based on login */}
                  {hydrated &&
                    (isLoggedIn ? (
                      <div className="w-full px-6 flex flex-col gap-3">
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/dashboard");
                          }}
                          className="w-full rounded-full text-sm font-semibold py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all"
                        >
                          Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          onClick={logout}
                          className="w-full rounded-full text-sm font-semibold py-3"
                        >
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/login");
                        }}
                        className="rounded-full text-sm font-semibold px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all"
                      >
                        Get Started
                      </Button>
                    ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      <CommandPalette open={open} setOpen={setOpen} />
    </>
  );
}