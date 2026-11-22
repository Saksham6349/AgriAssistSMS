import { HeroSection } from "@/components/HeroSection";
import { LandingPage } from "@/components/LandingPage";
import './landing.css';

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/80 to-slate-950">
      {/* Decorative radial lighting accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-gradient-to-b from-emerald-600/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="relative z-10">
        <HeroSection />
        <LandingPage />
      </div>
    </div>
  );
}
