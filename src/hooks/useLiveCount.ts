import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useLiveCount = () => {
  const [liveCount, setLiveCount] = useState(1);

  useEffect(() => {
    // Fetch initial count
    const fetchCount = async () => {
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
      
      const { count } = await supabase
        .from("game_sessions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", oneMinuteAgo);

      setLiveCount(Math.max(1, (count || 0) + 1));
    };

    fetchCount();

    // Subscribe to new sessions
    const channel = supabase
      .channel("live-count")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "game_sessions",
        },
        () => {
          setLiveCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return liveCount;
};
