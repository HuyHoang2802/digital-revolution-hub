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
      <div className="fixed bottom-4 right-4 z-[9999]">
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
            className="w-[88px] h-[88px] object-contain select-none"
            draggable={false}
          />

          {/* Bubble "???" like your screenshot */}
          {!open && (
            <div className="absolute -top-1 -left-8 rotate-[-8deg] bg-white border border-border shadow-md rounded-full px-2 py-1">
              <span className="text-[11px] font-semibold text-foreground">Bạn cần hỏi gì ???</span>
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
            className="fixed bottom-28 right-10 z-[9999] w-[420px] sm:w-[480px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full overflow-hidden border border-border bg-white">
                  <img src="/AI.png" alt="AI Avatar" className="h-full w-full object-contain" />
                </div>
                <div className="leading-tight">
                  <p className="font-bold text-foreground">Trợ lý AI</p>
                  <p className="text-xs text-muted-foreground">Demo UI (chưa nối API)</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-[360px] overflow-y-auto px-3 py-3 space-y-2">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
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
            <div className="border-t border-border p-3 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
              <Button onClick={send} disabled={!canSend} className="gap-2">
                <Send className="h-4 w-4" />
                Gửi
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}