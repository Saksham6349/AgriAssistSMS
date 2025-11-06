import { HeroSection } from "@/components/HeroSection";
import { LandingPage } from "@/components/LandingPage";
import './landing.css';

export default function Home() {
  return (
    <div 
      className="w-full bg-no-repeat bg-cover bg-center"
      style={{backgroundImage: "url('https://picsum.photos/seed/agriculture/1920/1080')"}}
      data-ai-hint="agriculture farming"
    >
      <div className="bg-card/10 backdrop-blur-sm">
        <HeroSection />
        <LandingPage />
      </div>
    </div>
  );
}
