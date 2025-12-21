import { Hero } from "../components/sections/Hero";
import { Features } from "../components/sections/Features";
import { Testimonials } from "../components/sections/Testimonials";
import { CTA } from "../components/sections/CTA";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Navbar } from "@/components/layout/Navbar";
<<<<<<< HEAD
import Footer from "@/components/layout/Footer";
=======
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      {/* <Testimonials /> */}
      <CTA />
<<<<<<< HEAD
      <Footer />
=======
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
    </main>
  );
}
