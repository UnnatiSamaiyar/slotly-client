"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useEffect, useState } from "react";

export default function TermsAndConditionsPage() {
  const sections = [
    { id: "acceptance", label: "Acceptance of Terms" },
    { id: "eligibility", label: "Eligibility" },
    { id: "service", label: "Service Overview" },
    { id: "responsibilities", label: "User Responsibilities" },
    { id: "accounts", label: "Accounts & Termination" },
    { id: "bookings", label: "Bookings & Disputes" },
    { id: "payments", label: "Payments" },
    { id: "ip", label: "Intellectual Property" },
    { id: "thirdparty", label: "Third-Party Services" },
    { id: "privacy", label: "Privacy" },
    { id: "disclaimer", label: "Disclaimers" },
    { id: "liability", label: "Limitation of Liability" },
    { id: "indemnity", label: "Indemnification" },
    { id: "changes", label: "Changes to Terms" },
    { id: "law", label: "Governing Law" },
    { id: "contact", label: "Contact" },
  ];

  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
    <Navbar />
    <main className="bg-gradient-to-b from-slate-50 to-white">
      <section className="max-w-7xl mx-auto px-6 py-20">
        {/* HEADER */}
        <header className="mb-20">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Terms & Conditions
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-3xl leading-relaxed">
            These Terms and Conditions (“Terms”) govern your access to and use of
            Slotly’s website, applications, and services (“Service”). Please
            read them carefully before using the platform.
          </p>
          <p className="mt-4 text-base text-slate-500">
            Effective Date: [15 December 2025]
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          {/* SIDEBAR */}
          <aside className="hidden lg:block sticky top-24 h-fit">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500 mb-4">
                On this page
              </p>
              <ul className="space-y-2">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`block rounded-lg px-3 py-2 text-sm transition ${
                        active === s.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CONTENT */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-12">
            <Section id="acceptance" title="1. Acceptance of Terms">
              By accessing or using Slotly, you confirm that you have read,
              understood, and agree to be bound by these Terms. If you do not
              agree, you must not use the Service.
            </Section>

            <Section id="eligibility" title="2. Eligibility">
              You must be at least 18 years old (or have legal parental or
              guardian consent) to use Slotly. You agree to provide accurate,
              current, and complete information during registration.
            </Section>

            <Section id="service" title="3. Service Overview">
              Slotly is a booking and scheduling platform that allows users to
              create booking pages, share availability, and schedule
              appointments or events. Slotly acts solely as a technology
              provider and does not guarantee bookings or outcomes.
            </Section>

            <Section id="responsibilities" title="4. User Responsibilities">
              <ul className="list-disc pl-6">
                <li>Use the Service for lawful purposes only</li>
                <li>Provide accurate and up-to-date information</li>
                <li>Respect other users and their time</li>
                <li>Avoid misuse, abuse, or disruption of the Service</li>
                <li>Not attempt unauthorized access to the platform</li>
              </ul>
            </Section>

            <Section id="accounts" title="5. Accounts & Termination">
              Slotly reserves the right to suspend or terminate accounts that
              violate these Terms, pose security risks, or misuse the Service.
              You may request account deletion at any time.
            </Section>

            <Section id="bookings" title="6. Bookings & Disputes">
              Slotly is not a party to booking agreements. All responsibilities,
              cancellations, refunds, disputes, and outcomes are strictly
              between the users involved.
            </Section>

            <Section id="payments" title="7. Payments (If Enabled)">
              Payments, if supported, are processed by third-party payment
              providers. Slotly does not store sensitive payment information and
              is not responsible for payment disputes.
            </Section>

            <Section id="ip" title="8. Intellectual Property">
              All content, software, branding, and design on Slotly are the
              intellectual property of Slotly or its licensors. Unauthorized
              use, reproduction, or distribution is prohibited.
            </Section>

            <Section id="thirdparty" title="9. Third-Party Services">
              Slotly may integrate or link to third-party services. Slotly does
              not control and is not responsible for their content, policies, or
              practices.
            </Section>

            <Section id="privacy" title="10. Privacy">
              Your use of Slotly is governed by our Privacy Policy. These Terms
              and the Privacy Policy are intended to be consistent and
              complementary.
            </Section>

            <Section id="disclaimer" title="11. Disclaimers">
              The Service is provided “as is” and “as available” without
              warranties of any kind, whether express or implied.
            </Section>

            <Section id="liability" title="12. Limitation of Liability">
              To the maximum extent permitted by law, Slotly shall not be liable
              for indirect, incidental, or consequential damages, including
              missed bookings or disputes between users.
            </Section>

            <Section id="indemnity" title="13. Indemnification">
              You agree to indemnify and hold harmless Slotly from any claims,
              damages, losses, or liabilities arising from your use of the
              Service or violation of these Terms.
            </Section>

            <Section id="changes" title="14. Changes to Terms">
              Slotly may update these Terms at any time. Continued use of the
              Service after changes constitutes acceptance of the updated
              Terms.
            </Section>

            <Section id="law" title="15. Governing Law">
              These Terms are governed by and interpreted in accordance with the
              laws of India.
            </Section>

            <Section id="contact" title="16. Contact">
              <strong>Email:</strong> support@slotly.io <br />
              <strong>Website:</strong> http://localhost:3000
            </Section>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}

/* INTERNAL UI HELPERS */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-32">
      <h2 className="text-3xl font-semibold text-slate-900 mb-6">
        {title}
      </h2>
      <div className="text-xl text-slate-700 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}
