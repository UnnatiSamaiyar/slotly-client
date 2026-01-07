"use client";

import { useEffect, useState } from "react";

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "collect", label: "Information We Collect" },
    { id: "usage", label: "How We Use Information" },
    { id: "cookies", label: "Cookies & Tracking" },
    { id: "sharing", label: "Data Sharing" },
    { id: "security", label: "Data Security" },
    { id: "retention", label: "Data Retention" },
    { id: "rights", label: "User Rights" },
    { id: "children", label: "Children’s Privacy" },
    { id: "updates", label: "Policy Updates" },
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
    <main className="bg-gradient-to-b from-slate-50 to-white">
      <section className="max-w-7xl mx-auto px-6 py-20">
        {/* HEADER */}
        <header className="mb-20">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-3xl leading-relaxed">
            Slotly (“we”, “our”, “us”) respects your privacy and is committed to
            protecting your personal information. This Privacy Policy explains
            how we collect, use, store, and protect data when you use our
            website, applications, and services (collectively, the “Service”).
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
            <Section id="collect" title="1. Information We Collect">
              <SubTitle>a) Personal Information</SubTitle>
              <ul className="list-disc pl-6">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Username</li>
                <li>Booking and scheduling details</li>
                <li>Profile or business information (if provided)</li>
              </ul>

              <SubTitle>b) Technical & Usage Data</SubTitle>
              <ul className="list-disc pl-6">
                <li>IP address</li>
                <li>Device and browser information</li>
                <li>Pages visited and interactions</li>
                <li>Date and time of access</li>
                <li>Cookies and similar technologies</li>
              </ul>

              <SubTitle>c) Third-Party Authentication</SubTitle>
              <p>
                If you sign in using Google or another third-party provider, we
                may receive your name, email address, and profile image (if
                permitted). Slotly does not access passwords or private
                third-party data beyond what you explicitly authorize.
              </p>
            </Section>

            <Section id="usage" title="2. How We Use Information">
              <ul className="list-disc pl-6">
                <li>Provide and operate the Service</li>
                <li>Manage bookings and user accounts</li>
                <li>Communicate service-related updates</li>
                <li>Improve performance and user experience</li>
                <li>Maintain security and prevent misuse</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="font-medium">
                We do not sell or rent personal data.
              </p>
            </Section>

            <Section id="cookies" title="3. Cookies & Tracking">
              Slotly uses cookies to maintain user sessions, improve platform
              performance, and analyze usage patterns. You can manage cookies
              through your browser settings.
            </Section>

            <Section id="sharing" title="4. Data Sharing">
              We may share limited data only with trusted third parties such as
              hosting providers, analytics services, notification services, and
              payment processors (if applicable). All third parties are required
              to protect your data.
            </Section>

            <Section id="security" title="5. Data Security">
              We use industry-standard safeguards including HTTPS encryption,
              secure servers, and access controls. No system is completely
              secure.
            </Section>

            <Section id="retention" title="6. Data Retention">
              We retain personal data only as long as necessary to provide the
              Service, meet legal obligations, and resolve disputes.
            </Section>

            <Section id="rights" title="7. User Rights">
              You may request access, correction, or deletion of your personal
              data by contacting us.
            </Section>

            <Section id="children" title="8. Children’s Privacy">
              Slotly is not intended for children under the age of 13.
            </Section>

            <Section id="updates" title="9. Policy Updates">
              We may update this Privacy Policy from time to time.
            </Section>

            <Section id="contact" title="10. Contact">
              <strong>Email:</strong> support@slotly.io <br />
              <strong>Website:</strong> http://localhost:3000
            </Section>
          </div>
        </div>
      </section>
    </main>
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

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-2xl font-medium text-slate-800 mt-8 mb-3">
      {children}
    </h3>
  );
}
