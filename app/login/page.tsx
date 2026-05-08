// @ts-nocheck

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import EmailAuthPanel from "@/components/auth/EmailAuthPanel";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LOGIN_SLIDES = [
  {
    key: "dashboard",
    title: "Smarter scheduling for modern teams",
    description:
      "Create booking links, manage availability, and schedule meetings without back-and-forth.",
    image: "/login-carousel/dashboard.png",
    features: [
      {
        label: "Booking link",
        value: "Ready to share",
        detail: "slotly.com/olivia/intro",
      },
      {
        label: "Availability",
        value: "9:00 AM – 5:00 PM",
        detail: "Mon – Fri",
      },
      {
        label: "Booking page preview",
        value: "See what invitees see",
        detail: "View booking page",
      },
    ],
  },
  {
    key: "event-types-one",
    title: "Build booking workflows faster",
    description:
      "Create reusable event types, share professional booking links, and manage scheduling from one workspace.",
    image: "/login-carousel/event-types-one.png",
    features: [
      {
        label: "Reusable templates",
        value: "4 event types",
        detail: "Discovery, Demo, Review",
      },
      {
        label: "Total bookings",
        value: "1,284",
        detail: "Tracked automatically",
      },
      {
        label: "Active links",
        value: "12 live links",
        detail: "Ready to share",
      },
    ],
  },
  {
    key: "event-types-two",
    title: "Control every scheduling link",
    description:
      "Manage active links, availability, public booking pages, and event type settings with a clean Slotly dashboard.",
    image: "/login-carousel/event-types-two.png",
    features: [
      {
        label: "Link status",
        value: "Active controls",
        detail: "Enable or pause links",
      },
      {
        label: "Public booking",
        value: "Shareable pages",
        detail: "Copy links instantly",
      },
      {
        label: "Team workflow",
        value: "Organized events",
        detail: "Clean workspace control",
      },
    ],
  },
];

// ─── unchanged helper ────────────────────────────────────────────────────────
function getSlidePosition(index: number, activeIndex: number) {
  const total = LOGIN_SLIDES.length;
  const diff = (index - activeIndex + total) % total;
  if (diff === 0) return "active";
  if (diff === 1) return "next";
  if (diff === total - 1) return "prev";
  return "hidden";
}

// ─── 3-D transform per position ──────────────────────────────────────────────
function getSlide3DStyle(
  position: "active" | "next" | "prev" | "hidden"
): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 24,
    
    overflow: "hidden",
    transition:
      "transform 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease, filter 0.6s ease",
  };

  switch (position) {
    case "active":
      return {
        ...base,
        transform: "translateX(0) scale(1) rotateY(0deg)",
        opacity: 1,
        zIndex: 20,
      };

    case "next":
      return {
        ...base,
        transform: "translateX(65%) scale(0.78) rotateY(-18deg)",
        opacity: 0.55,
        // filter: "blur(4px) brightness(0.9)",
        zIndex: 10,
      };

    case "prev":
      return {
        ...base,
        transform: "translateX(-65%) scale(0.78) rotateY(18deg)",
        opacity: 0.55,
        filter: "blur(4px) brightness(0.9)",
        zIndex: 10,
        filter: "blur(5px) brightness(0.85)",
      };

    default:
      return {
        ...base,
        opacity: 0,
        transform: "scale(0.6)",
        zIndex: 0,
        pointerEvents: "none",
      };
  }
}

export default function LoginPage() {
  // ─── ALL ORIGINAL LOGIC – UNTOUCHED ──────────────────────────────────────
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goNext = () => {
    setDirection(1);
    setActiveSlide((prev) => (prev + 1) % LOGIN_SLIDES.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setActiveSlide(
      (prev) => (prev - 1 + LOGIN_SLIDES.length) % LOGIN_SLIDES.length
    );
  };

  const goToSlide = (index: number) => {
    if (index === activeSlide) return;
    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveSlide((current) => (current + 1) % LOGIN_SLIDES.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[100dvh] overflow-x-hidden flex items-center justify-center bg-gray-50 px-2 py-4 sm:px-6">
      {/* Main Card */}
      <div className="w-full max-w-[1180px] bg-white rounded-3xl shadow-xl flex flex-col lg:flex-row relative">

        {/* ── LEFT SECTION (login form) – UNTOUCHED ── */}
        <div className="w-full lg:w-1/2 flex justify-center px-6 sm:px-10 py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="mb-6">
              <Link href="/">
                <Image
                  src="/Slotlyio-logo.webp"
                  alt="Slotly Logo"
                  width={100}
                  height={20}
                  priority
                  className="cursor-pointer"
                />
              </Link>
            </div>

            <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.04em] text-[#111827] sm:text-[36px]">
              Welcome back
            </h1>

            <p className="mt-2.5 text-[15px] font-medium leading-6 text-[#667085]">
              Sign in to your workspace
            </p>

            <div className="mt-6">
              <GoogleLoginButton />
            </div>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <EmailAuthPanel />
          </motion.div>
        </div>

        {/* ── RIGHT SECTION – 3D carousel replaces three-panel layout ── */}
        <div className="relative hidden w-full overflow-hidden bg-white p-5 lg:flex lg:w-[58%] lg:items-center lg:justify-center">
          <div
            className="
              relative h-[560px] w-full overflow-hidden rounded-[30px] border border-white/80
bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.25),transparent_40%),linear-gradient(135deg,#5B8CFF_0%,#315CF6_50%,#A78BFA_100%)]              shadow-[0_32px_80px_rgba(49,92,246,0.22)]
            "
          >
            {/* ambient decorations */}
            <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.68)_1px,transparent_1px)] [background-size:11px_11px]" />
            <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-8 h-72 w-72 rounded-full bg-indigo-300/35 blur-3xl" />

            {/* ── 3D CAROUSEL STAGE ── */}
            {/*
              All three slides live in one container.
              Their position (active / next / prev) drives the 3-D CSS transform.
              getSlidePosition() and getSlide3DStyle() do the math — same idea as
              the vanilla-JS slider (translateX + scale + rotateY + blur), just
              expressed as static inline styles instead of imperative JS writes.
            */}
            <div
              className="absolute left-1/2 top-[26px] z-20 -translate-x-1/2"
              style={{ width: "70%", height: 240, perspective: "1200px" }}
            >
              {LOGIN_SLIDES.map((slide, index) => {
                const position = getSlidePosition(index, activeSlide);
                const style3D = getSlide3DStyle(position);

                return (
                  <div key={slide.key} style={style3D}>
                    {position === "active" ? (
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-full h-full"
                      >
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          priority={index === activeSlide}
                          sizes="620px"
                          className="object-cover object-top"
                        />
                      </motion.div>
                    ) : (
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={index === activeSlide}
                        sizes="620px"
                        className="object-cover object-top"
                      />
                    )}

                    {/* overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
                    {position === "active" && (
                      <div className="absolute inset-0 rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.25)] pointer-events-none" />
                    )}
                    {/* border */}
                    <div className="pointer-events-none absolute inset-0 rounded-[24px] border border-white/70" />
                  </div>
                );
              })}
            </div>

            {/* ── FEATURE CARDS (original logic, untouched) ── */}
            <motion.div
              key={`${activeSlide}-features`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute left-1/2 top-[300px] z-30 grid w-[78%] -translate-x-1/2 grid-cols-3 gap-3"
            >
              {LOGIN_SLIDES[activeSlide].features.map((feature, index) => (
                <div
                  key={feature.label}
                  className="
                    min-h-[82px] rounded-[16px] border border-white/80 bg-white/88
                    px-4 py-3 text-left shadow-[0_14px_34px_rgba(15,23,42,0.13)]
                    backdrop-blur-xl
                  "
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`
                        mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold
                        ${index === 0
                          ? "bg-[#EEF4FF] text-[#2563EB]"
                          : index === 1
                            ? "bg-[#ECFDF5] text-[#059669]"
                            : "bg-[#F5F3FF] text-[#4F46E5]"
                        }
                      `}
                    >
                      {index === 0 ? "↗" : index === 1 ? "✓" : "▣"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-bold text-[#111827]">
                        {feature.label}
                      </p>
                      <p className="mt-1 truncate text-[11px] font-semibold text-[#2563EB]">
                        {feature.value}
                      </p>
                      <p className="mt-1 truncate text-[10.5px] font-medium text-slate-500">
                        {feature.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* ── LEFT ARROW (original) ── */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous slide"
              className="
                absolute left-[20px] top-[30%] z-40 flex h-10 w-12 -translate-y-1/2 items-center justify-center
                rounded-full border border-white/85 bg-white/95 text-[#315CF6]
                shadow-[0_12px_28px_rgba(15,23,42,0.16)]
                transition duration-500 ease-out hover:scale-105 hover:bg-white active:scale-95
              "
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* ── RIGHT ARROW (original) ── */}
            <button
              type="button"
              onClick={goNext}
              aria-label="Next slide"
              className="
                absolute right-[20px] top-[30%] z-40 flex h-10 w-12 -translate-y-1/2 items-center justify-center
                rounded-full border border-white/85 bg-white/95 text-[#315CF6]
                shadow-[0_12px_28px_rgba(15,23,42,0.16)]
                transition duration-500 ease-out hover:scale-105 hover:bg-white active:scale-95
              "
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* ── BOTTOM TEXT + DOTS (original, untouched) ── */}
            <div className="absolute inset-x-8 bottom-4 z-30 text-center">
              <motion.div
                key={`${activeSlide}-text`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <h2 className="text-[22px] font-bold leading-tight tracking-[-0.03em] text-white">
                  {LOGIN_SLIDES[activeSlide].title}
                </h2>
                <p className="mx-auto mt-2 max-w-[520px] text-[13px] font-medium leading-5 text-white/85">
                  {LOGIN_SLIDES[activeSlide].description}
                </p>
              </motion.div>

              <div className="mt-2 flex items-center justify-center gap-2">
                {LOGIN_SLIDES.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${activeSlide === index
                        ? "w-8 bg-white shadow-[0_0_14px_rgba(255,255,255,0.65)]"
                        : "w-2 bg-white/45 hover:bg-white/70"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
