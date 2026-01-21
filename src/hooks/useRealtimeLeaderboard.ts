import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardEntry {
  id: number;
  session_id: string;
  player_name: string | null;
  score: number;
  total_questions: number;
  time_spent: number;
  completed: boolean;
  created_at: string;
}

export const useRealtimeLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from("game_sessions")
          .select("id, session_id, player_name, score, total_questions, time_spent, completed, created_at")
          .eq("completed", true)
          .order("score", { ascending: false })
          .order("time_spent", { ascending: true })
          .limit(10);

        if (error) throw error;
        setLeaderboard((data ?? []) as LeaderboardEntry[]);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    const sub = supabase
      .channel("leaderboard_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_sessions" },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);

  // NOTE: This is still "estimated online" (last 5 minutes).
  // For "online thật" (presence), we can upgrade later.
  useEffect(() => {
    const updateOnlinePlayers = async () => {
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

        const { data, error } = await supabase
          .from("game_sessions")
          .select("session_id")
          .gt("created_at", fiveMinutesAgo);

        if (error) throw error;

        const uniqueSessions = new Set((data ?? []).map((d) => d.session_id));
        setOnlinePlayers(uniqueSessions.size);
      } catch (error) {
        console.error("Error fetching online players:", error);
      }
    };

    updateOnlinePlayers();
    const interval = setInterval(updateOnlinePlayers, 10000);
    return () => clearInterval(interval);
  }, []);

  return { leaderboard, onlinePlayers, loading };
};