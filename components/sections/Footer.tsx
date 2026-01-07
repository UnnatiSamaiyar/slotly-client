"use client";

import React from "react";
import {
  ArrowRight,
  Twitter,
  Linkedin,
  Youtube,
  ShieldCheck,
  Lock,
  Globe,
  Mail,
} from "lucide-react";

/**
 * SlotlyFooter (Calendly-style)
 * - Clean, enterprise SaaS footer
 * - Link groups + trust strip + final CTA + legal bar
 * - Non-functional links (set hrefs as you need)
 */
export default function SlotlyFooter() {
  return (
    <footer className="relative w-full bg-white">
      {/* Top CTA band (Calendly-like) */}
      <div className="relative overflow-hidden border-t border-gray-200">
        <div aria-hidden className="absolute inset-0">
          <div className="absolute -top-36 left-1/2 h-[420px] w-[980px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-50 blur-[110px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                Scheduling that feels effortless — for you and your team.
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Share one link, stay in sync across calendars, and automate follow-ups
                without extra tools.
              </p>

              {/* Trust strip */}
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
                  <ShieldCheck className="h-4 w-4 text-gray-600" />
                  Secure by design
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
                  <Lock className="h-4 w-4 text-gray-600" />
                  Privacy-first
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
                  <Globe className="h-4 w-4 text-gray-600" />
                  Global time zones
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_55px_-30px_rgba(37,99,235,0.8)] hover:bg-blue-700 transition"
              >
                Get started free <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="/demo"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
              >
                Request a demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_2fr]">
            {/* Brand / short pitch */}
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold">
                  S
                </div>
                <div className="leading-tight">
                  <div className="text-lg font-semibold text-gray-900">
                    Slotly
                  </div>
                  <div className="text-sm text-gray-500">
                    Scheduling, simplified.
                  </div>
                </div>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600">
                Slotly helps individuals and teams schedule faster with clean booking
                pages, calendar sync, and automations that remove the back-and-forth.
              </p>

              {/* Contact */}
              <div className="mt-5 flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-500" />
                <a className="hover:text-gray-900 transition" href="mailto:support@slotly.io">
                  support@slotly.io
                </a>
              </div>

              {/* Social */}
              <div className="mt-6 flex items-center gap-3">
                <SocialIcon href="https://twitter.com" label="Twitter">
                  <Twitter className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon href="https://linkedin.com" label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon href="https://youtube.com" label="YouTube">
                  <Youtube className="h-4 w-4" />
                </SocialIcon>
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
              <FooterCol
                title="Product"
                links={[
                  { label: "Scheduling", href: "/product/scheduling" },
                  { label: "Event types", href: "/product/event-types" },
                  { label: "Team scheduling", href: "/product/teams" },
                  { label: "Integrations", href: "/integrations" },
                  { label: "Security", href: "/security" },
                ]}
              />
              <FooterCol
                title="Solutions"
                links={[
                  { label: "Sales", href: "/solutions/sales" },
                  { label: "Recruiting", href: "/solutions/recruiting" },
                  { label: "Customer success", href: "/solutions/customer-success" },
                  { label: "Education", href: "/solutions/education" },
                  { label: "Freelancers", href: "/solutions/freelancers" },
                ]}
              />
              <FooterCol
                title="Company"
                links={[
                  { label: "About", href: "/about" },
                  { label: "Careers", href: "/careers" },
                  { label: "Press", href: "/press" },
                  { label: "Partners", href: "/partners" },
                  { label: "Contact", href: "/contact" },
                ]}
              />
              <FooterCol
                title="Resources"
                links={[
                  { label: "Help Center", href: "/help" },
                  { label: "Developer API", href: "/developers" },
                  { label: "Blog", href: "/blog" },
                  { label: "Status", href: "/status" },
                  { label: "Community", href: "/community" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom legal bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Slotly. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <a className="text-gray-500 hover:text-gray-900 transition" href="/privacy">
                Privacy
              </a>
              <a className="text-gray-500 hover:text-gray-900 transition" href="/terms">
                Terms
              </a>
              <a className="text-gray-500 hover:text-gray-900 transition" href="/cookie-policy">
                Cookie Policy
              </a>
              <a className="text-gray-500 hover:text-gray-900 transition" href="/gdpr">
                GDPR
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* -------------------- helpers -------------------- */

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
