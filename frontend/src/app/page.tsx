import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/shared/hero-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <HeroSection />
    </main>
  );
}