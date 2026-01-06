import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Check, X, RotateCcw, Trophy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: number;
  question: string;
  scenario: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Xã hội xuất hiện mâu thuẫn gay gắt giữa các giai cấp. Nhà nước nên làm gì?",
    scenario: "Bạn là nhà hoạch định chính sách...",
    options: [
      {
        text: "Đàn áp bạo lực để duy trì trật tự",
        isCorrect: false,
        explanation: "Đàn áp chỉ làm mâu thuẫn trầm trọng hơn, dẫn đến cách mạng bùng nổ!",
      },
      {
        text: "Cải cách thể chế, điều chỉnh quan hệ lợi ích",
        isCorrect: true,
        explanation: "Đúng! Cải cách đúng hướng giúp xã hội phát triển bền vững.",
      },
    ],
  },
  {
    id: 2,
    question: "Thủ tục hành chính quá phức tạp, người dân kêu ca. Giải pháp nào?",
    scenario: "Cử tri phản ánh về thủ tục rườm rà...",
    options: [
      {
        text: "Giữ nguyên vì \"quy trình là quy trình\"",
        isCorrect: false,
        explanation: "Cứng nhắc làm mất niềm tin của nhân dân vào bộ máy nhà nước!",
      },
      {
        text: "Số hóa và đơn giản hóa thủ tục",
        isCorrect: true,
        explanation: "Đúng! Chuyển đổi số là xu hướng tất yếu của Nhà nước kiến tạo.",
      },
    ],
  },
  {
    id: 3,
    question: "Công nghệ mới xuất hiện nhưng pháp luật chưa theo kịp. Bạn chọn?",
    scenario: "AI và Blockchain đang thay đổi xã hội...",
    options: [
      {
        text: "Cấm đoán để chờ nghiên cứu thêm",
        isCorrect: false,
        explanation: "Cấm đoán khiến đất nước tụt hậu so với thế giới!",
      },
      {
        text: "Sandbox thử nghiệm, vừa làm vừa điều chỉnh",
        isCorrect: true,
        explanation: "Đúng! Kiến tạo môi trường thử nghiệm là cách tiếp cận tiến bộ.",
      },
    ],
  },
  {
    id: 4,
    question: "Nhà nước là gì theo lý luận Mác-Lênin?",
    scenario: "Câu hỏi lý thuyết cơ bản...",
    options: [
      {
        text: "Tổ chức đại diện cho toàn xã hội",
        isCorrect: false,
        explanation: "Không! Nhà nước mang bản chất giai cấp, phục vụ giai cấp thống trị.",
      },
      {
        text: "Công cụ chuyên chính của giai cấp thống trị",
        isCorrect: true,
        explanation: "Đúng! Nhà nước ra đời từ mâu thuẫn giai cấp không thể điều hòa.",
      },
    ],
  },
  {
    id: 5,
    question: "Để xây dựng Nhà nước pháp quyền XHCN, cần ưu tiên?",
    scenario: "Định hướng phát triển Việt Nam...",
    options: [
      {
        text: "Tập trung quyền lực để điều hành hiệu quả",
        isCorrect: false,
        explanation: "Tập trung quá mức dễ dẫn đến lạm quyền, mất dân chủ!",
      },
      {
        text: "Phân công quyền lực, kiểm soát lẫn nhau",
        isCorrect: true,
        explanation: "Đúng! Kiểm soát quyền lực là nguyên tắc của Nhà nước pháp quyền.",
      },
    ],
  },
];

interface GameSectionProps {
  sessionId: string;
  onGameComplete: (score: number, total: number) => void;
}

const GameSection = ({ sessionId, onGameComplete }: GameSectionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const handleAnswer = async (optionIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(optionIndex);
    setShowResult(true);

    const isCorrect = questions[currentQuestion].options[optionIndex].isCorrect;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      // Game over on wrong answer
      setGameOver(true);
      await updateGameSession(score, currentQuestion + 1, false);
      return;
    }

    // Check if game is complete
    if (currentQuestion === questions.length - 1) {
      const finalScore = score + 1;
      setGameComplete(true);
      await updateGameSession(finalScore, questions.length, true);
      onGameComplete(finalScore, questions.length);
    }
  };

  const updateGameSession = async (currentScore: number, totalQuestions: number, completed: boolean) => {
    try {
      await supabase.from("game_sessions").insert({
        session_id: sessionId,
        score: currentScore,
        total_questions: totalQuestions,
        completed,
      });
    } catch (error) {
      console.error("Error updating game session:", error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameOver(false);
    setGameComplete(false);
  };

  const currentQ = questions[currentQuestion];

  return (
    <section className="min-h-screen py-16 px-4 bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground mb-4">
            <Gamepad2 className="h-5 w-5" />
            <span className="font-medium">Mini-Game</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            The <span className="text-primary">Policymaker</span>
          </h2>
          <p className="text-muted-foreground">
            Đưa ra quyết định đúng để xã hội phát triển!
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            Câu {currentQuestion + 1}/{questions.length}
          </span>
          <span className="text-sm font-medium text-primary">
            Điểm: {score}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Game Over Screen */}
          {gameOver && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-12 w-12 text-destructive" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-destructive mb-2">
                Cách mạng bùng nổ! 💥
              </h3>
              <p className="text-muted-foreground mb-6">
                Quyết định sai lầm dẫn đến bất ổn xã hội. Hãy thử lại!
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {questions[currentQuestion].options[selectedAnswer!]?.explanation}
              </p>
              <Button onClick={restartGame} size="lg" className="gap-2">
                <RotateCcw className="h-5 w-5" />
                Chơi lại
              </Button>
            </motion.div>
          )}

          {/* Game Complete Screen */}
          {gameComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="inline-block mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                  <Trophy className="h-12 w-12 text-success" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-success mb-2">
                Xã hội phát triển! 🎉
              </h3>
              <p className="text-muted-foreground mb-4">
                Bạn đã hoàn thành xuất sắc với {score}/{questions.length} điểm!
              </p>
              <p className="text-sm text-foreground mb-6">
                Những quyết định đúng đắn dẫn đến một xã hội tiến bộ và thịnh vượng.
              </p>
              <Button onClick={restartGame} variant="outline" size="lg" className="gap-2">
                <RotateCcw className="h-5 w-5" />
                Chơi lại
              </Button>
            </motion.div>
          )}

          {/* Question Card */}
          {!gameOver && !gameComplete && (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg"
            >
              <p className="text-sm text-muted-foreground mb-2 italic">
                {currentQ.scenario}
              </p>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-6">
                {currentQ.question}
              </h3>

              <div className="space-y-4">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                      showResult
                        ? option.isCorrect
                          ? "border-success bg-success/10"
                          : selectedAnswer === index
                          ? "border-destructive bg-destructive/10 animate-shake"
                          : "border-border bg-muted/50 opacity-50"
                        : "border-border bg-card hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          showResult
                            ? option.isCorrect
                              ? "bg-success text-success-foreground"
                              : selectedAnswer === index
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-muted"
                            : "bg-muted"
                        }`}
                      >
                        {showResult ? (
                          option.isCorrect ? (
                            <Check className="h-4 w-4" />
                          ) : selectedAnswer === index ? (
                            <X className="h-4 w-4" />
                          ) : null
                        ) : (
                          <span className="text-xs font-medium">{String.fromCharCode(65 + index)}</span>
                        )}
                      </div>
                      <span className="text-foreground">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanation & Next Button */}
              <AnimatePresence>
                {showResult && !gameOver && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                  >
                    <div className="p-4 rounded-xl bg-muted mb-4">
                      <p className="text-sm text-muted-foreground">
                        {currentQ.options.find((o) => o.isCorrect)?.explanation}
                      </p>
                    </div>
                    {currentQuestion < questions.length - 1 && (
                      <Button onClick={nextQuestion} className="w-full" size="lg">
                        Câu tiếp theo
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GameSection;
