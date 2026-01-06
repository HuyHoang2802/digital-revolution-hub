import { useState, useEffect } from "react";

export const useSessionId = () => {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // Generate or retrieve session ID
    let id = sessionStorage.getItem("game_session_id");
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("game_session_id", id);
    }
    setSessionId(id);
  }, []);

  return sessionId;
};
