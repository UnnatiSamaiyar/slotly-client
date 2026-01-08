import { Hero } from "../components/sections/Hero";
import { Features } from "../components/sections/Features";
import { Testimonials } from "../components/sections/Testimonials";
import { CTA } from "../components/sections/CTA";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Navbar } from "@/components/layout/Navbar";
import MiniDashboardMock from "@/components/MiniDashboardMock";
import { Footer } from "@/components/layout/Footer";
import { FAQSection, SecurityTrustSection } from "@/components/sections/SecurityTrustSection";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <Navbar />
      <Hero />
      <Features />
      {/* <HowItWorks /> */}
      <MiniDashboardMock />
      <SecurityTrustSection />
      <FAQSection />
      {/* <Testimonials /> */}
      <CTA />
      <Footer />
    </main>
  );
}
