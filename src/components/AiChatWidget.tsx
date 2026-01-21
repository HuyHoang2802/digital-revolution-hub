import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMsg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "ai_chat_widget_history_v1";

function fakeReply(userText: string) {
  if (/leaderboard|bảng xếp hạng/i.test(userText)) {
    return "Bạn muốn leaderboard lấy từ Supabase hay localStorage? Mình hướng dẫn tiếp được nhé.";
  }
  if (/supabase/i.test(userText)) {
    return "Supabase giúp lưu dữ liệu + realtime. Khi bạn sẵn sàng làm API, mình sẽ nối AI thật vào.";
  }
  return `Mình đã nhận: "${userText}". (Demo UI — chưa nối API)`;
}

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as ChatMsg[];
    } catch {
      // ignore
    }
    return [{ role: "assistant", content: "Chào bạn! Mình là trợ lý AI. Bạn cần mình giúp gì?" }];
  });

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const send = () => {
    if (!canSend) return;

    const userText = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "assistant", content: fakeReply(userText) },
    ]);
  };

  return (
    <>
      {/* Floating character button (use your image: public/AI.png) */}
      <div className="fixed bottom-3 sm:bottom-4 right-3 sm:right-4 z-[9999]">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen((v) => !v)}
          className="relative bg-transparent p-0 border-0 shadow-none"
          aria-label="Open AI chat"
        >
          <img
            src="/AI.png"
            alt="AI"
            className="w-16 h-16 sm:w-[88px] sm:h-[88px] object-contain select-none"
            draggable={false}
          />

          {/* Bubble "???" like your screenshot */}
          {!open && (
            <div className="absolute -top-1 -left-6 sm:-left-8 rotate-[-8deg] bg-white border border-border shadow-md rounded-full px-2 py-1">
              <span className="text-[9px] sm:text-[11px] font-semibold text-foreground whitespace-nowrap">Hỏi gì ?</span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="fixed bottom-24 sm:bottom-28 right-3 sm:right-10 z-[9999] w-[calc(100%-1.5rem)] sm:w-[420px] max-w-md sm:max-w-none overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border border-border bg-white flex-shrink-0">
                  <img src="/AI.png" alt="AI Avatar" className="h-full w-full object-contain" />
                </div>
                <div className="leading-tight min-w-0">
                  <p className="font-bold text-foreground text-sm sm:text-base truncate">Trợ lý AI</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Demo UI (chưa nối API)</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close" className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-64 sm:h-[360px] overflow-y-auto px-2 sm:px-3 py-2 sm:py-3 space-y-2">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs sm:text-sm leading-relaxed ${
                      m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-2 sm:p-3 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập..."
                className="text-xs sm:text-sm h-8 sm:h-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
              <Button onClick={send} disabled={!canSend} className="gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm">
                <Send className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Gửi</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}