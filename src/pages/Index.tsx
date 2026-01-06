import { useRef, useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import TheorySection from "@/components/sections/TheorySection";
import CaseStudySection from "@/components/sections/CaseStudySection";
import GameSection from "@/components/sections/GameSection";
import LeaderboardSection from "@/components/sections/LeaderboardSection";
import ReferencesSection from "@/components/sections/ReferencesSection";
import { useSessionId } from "@/hooks/useSessionId";
import { useLiveCount } from "@/hooks/useLiveCount";

const Index = () => {
  const sessionId = useSessionId();
  const liveCount = useLiveCount();
  const contentRef = useRef<HTMLDivElement>(null);
  const [, setGameResult] = useState<{ score: number; total: number } | null>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGameComplete = (score: number, total: number) => {
    setGameResult({ score, total });
  };

  return (
    <main className="min-h-screen">
      <HeroSection onStart={scrollToContent} liveCount={liveCount} />
      
      <div ref={contentRef}>
        <TheorySection />
        <CaseStudySection />
        <GameSection sessionId={sessionId} onGameComplete={handleGameComplete} />
        <LeaderboardSection />
        <ReferencesSection />
      </div>
    </main>
  );
};

export default Index;
