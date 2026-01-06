import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, TrendingUp, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardStats {
  totalPlayers: number;
  averageScore: number;
  perfectScores: number;
}

const LeaderboardSection = () => {
  const [stats, setStats] = useState<LeaderboardStats>({
    totalPlayers: 0,
    averageScore: 0,
    perfectScores: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel("game-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_sessions",
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from("game_sessions")
        .select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        const completedGames = data.filter((g) => g.completed);
        const totalScore = completedGames.reduce((sum, g) => sum + g.score, 0);
        const avgScore = completedGames.length > 0 ? totalScore / completedGames.length : 0;
        const perfect = completedGames.filter((g) => g.score === g.total_questions).length;

        setStats({
          totalPlayers: data.length,
          averageScore: Math.round(avgScore * 10) / 10,
          perfectScores: perfect,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      icon: <Users className="h-6 w-6" />,
      label: "Lượt chơi",
      value: stats.totalPlayers,
      color: "primary",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      label: "Điểm TB",
      value: stats.averageScore,
      color: "secondary",
    },
    {
      icon: <Medal className="h-6 w-6" />,
      label: "Điểm tuyệt đối",
      value: stats.perfectScores,
      color: "accent",
    },
  ];

  return (
    <section className="py-12 px-4 bg-muted">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Trophy className="h-5 w-5" />
            <span className="font-medium">Bảng xếp hạng Live</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            Thống kê <span className="text-primary">Real-time</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-card border border-border rounded-xl p-4 text-center`}
            >
              <div className={`inline-flex p-2 rounded-full bg-${stat.color}/10 text-${stat.color} mb-2`}>
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {isLoading ? "..." : stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
