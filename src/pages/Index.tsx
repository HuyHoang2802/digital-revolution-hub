import { useRef, useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import TheorySection from "@/components/sections/TheorySection";
import NationalityClassSection from "@/components/sections/NationalityClassSection";
import GameSection from "@/components/sections/GameSection";
import RevolutionSection from "@/components/sections/RevolutionSection";
import SimulateRevolutionSection from "@/components/sections/SimulateRevolutionSection";
import { useSessionId } from "@/hooks/useSessionId";
import { useRealtimeLeaderboard } from "@/hooks/useRealtimeLeaderboard";
import AiChatWidget from "@/components/AiChatWidget";

const Index = () => {
  const sessionId = useSessionId();
  const { onlinePlayers } = useRealtimeLeaderboard();
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
      <HeroSection onStart={scrollToContent} liveCount={onlinePlayers} />
      
      <div ref={contentRef}>
        <TheorySection />
        <NationalityClassSection />
        <RevolutionSection />
        <SimulateRevolutionSection />
        <GameSection sessionId={sessionId} onGameComplete={handleGameComplete} />
        <AiChatWidget />
      </div>
    </main>
  );
};

export default Index;
