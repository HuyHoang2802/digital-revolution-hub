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
      {/* Floating character button - mobile first */}
      <div className="fixed bottom-2 right-2 xs:bottom-3 xs:right-3 sm:bottom-4 sm:right-4 z-[9999]">
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
            className="w-14 h-14 xs:w-16 xs:h-16 sm:w-[88px] sm:h-[88px] object-contain select-none"
            draggable={false}
          />

          {/* Bubble hint - hidden when panel open */}
          {!open && (
            <div className="absolute -top-0.5 -left-6 xs:-left-7 rotate-[-8deg] bg-white border border-border shadow-md rounded-full px-2 py-1">
              <span className="text-[8px] xs:text-[9px] sm:text-[11px] font-semibold text-foreground whitespace-nowrap">Hỏi gì ?</span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Chat Panel - mobile-first bottom sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="fixed z-[9999] overflow-hidden border border-border bg-card shadow-2xl rounded-2xl
              left-2 right-2 bottom-20 xs:bottom-24
              sm:left-auto sm:right-6 sm:w-[420px] sm:bottom-28"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 xs:px-4 py-2 xs:py-3 border-b border-border gap-2">
              <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
                <div className="h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border border-border bg-white flex-shrink-0">
                  <img src="/AI.png" alt="AI Avatar" className="h-full w-full object-contain" />
                </div>
                <div className="leading-tight min-w-0">
                  <p className="font-bold text-foreground text-xs xs:text-sm truncate">Trợ lý AI</p>
                  <p className="text-[8px] xs:text-[9px] text-muted-foreground truncate">Demo UI (chưa nối API)</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)} 
                aria-label="Close"
                className="h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 flex-shrink-0"
              >
                <X className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Messages - responsive height */}
            <div className="overflow-y-auto px-2 xs:px-3 py-2 xs:py-3 space-y-2
              max-h-[50vh] xs:max-h-[55vh] sm:h-[360px]">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs xs:text-sm leading-relaxed ${
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
            <div className="border-t border-border p-2 xs:p-3 flex gap-1 xs:gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập..."
                className="text-xs xs:text-sm h-8 xs:h-9 sm:h-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
              <Button 
                onClick={send} 
                disabled={!canSend} 
                className="gap-1 xs:gap-2 px-2 xs:px-3 h-8 xs:h-9 sm:h-10 text-xs xs:text-sm flex-shrink-0"
              >
                <Send className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Gửi</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}