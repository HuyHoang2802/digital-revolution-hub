import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, RotateCcw, Trophy, AlertTriangle, Gamepad2, Star, Zap, Brain, Target, Clock, Medal, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeLeaderboard } from "@/hooks/useRealtimeLeaderboard";

interface Question {
  id: number;
  question: string;
  scenario: string;
  level: "basic" | "advanced" | "roleplay";
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

interface LeaderboardEntry {
  name: string;
  score: number;
  time: number;
  date: string;
}

interface RealtimeLeaderboardEntry {
  name?: string;
  score: number;
  time_spent?: number;
  created_at: string;
}

const questions: Question[] = [
  // LEVEL 1: LÝ THUYẾT CƠ BẢN
  {
    id: 1,
    question: "Theo quan điểm Triết học Mác - Lênin, yếu tố nào quyết định xu hướng phát triển của một Dân tộc?",
    scenario: "Câu hỏi lý thuyết cấp độ 1",
    level: "basic",
    options: [
      {
        text: "Truyền thống văn hóa",
        isCorrect: false,
        explanation: "Không, văn hóa chỉ là yếu tố phụ. Giai cấp thống trị mới quyết định hướng đi.",
      },
      {
        text: "Vị trí địa lý",
        isCorrect: false,
        explanation: "Địa lý ảnh hưởng nhưng không quyết định. Giai cấp thống trị nắm kinh tế và nhà nước.",
      },
      {
        text: "Giai cấp thống trị",
        isCorrect: true,
        explanation: "✅ Đúng! Giai cấp nào nắm quyền lực kinh tế và nhà nước sẽ lái 'chiếc xe dân tộc' đi theo hướng đó.",
      },
      {
        text: "Tất cả mọi người dân",
        isCorrect: false,
        explanation: "Không, mọi người không có quyền lực ngang nhau trong xã hội giai cấp.",
      },
    ],
  },
  {
    id: 2,
    question: "Nguyên nhân sâu xa dẫn đến Cách mạng xã hội là gì?",
    scenario: "Câu hỏi lý thuyết cấp độ 1",
    level: "basic",
    options: [
      {
        text: "Mâu thuẫn giữa Lực lượng sản xuất và Quan hệ sản xuất",
        isCorrect: true,
        explanation: "✅ Đúng! Khi LLSX lớn quá nhanh mà QHSX (cấu trúc xã hội) quá chật → Cách mạng nổ ra để phá vỡ lồng công.",
      },
      {
        text: "Mâu thuẫn giữa các phe phái trong triều đình",
        isCorrect: false,
        explanation: "Đấu tranh nội bộ thượng tầng không phải nguyên nhân gốc rễ của cách mạng.",
      },
      {
        text: "Do thiên tai, dịch bệnh làm dân đói khổ",
        isCorrect: false,
        explanation: "Thiên tai chỉ là điều kiện, không phải nguyên nhân gốc rễ.",
      },
      {
        text: "Do nước khác xâm lược",
        isCorrect: false,
        explanation: "Xâm lược là yếu tố bên ngoài, không phải mâu thuẫn nội bộ.",
      },
    ],
  },
  {
    id: 3,
    question: "Vấn đề cơ bản nhất của mọi cuộc cách mạng xã hội là gì?",
    scenario: "Câu hỏi lý thuyết cấp độ 1",
    level: "basic",
    options: [
      {
        text: "Đổi tên nước",
        isCorrect: false,
        explanation: "Đổi tên là vấn đề hành chính không cơ bản.",
      },
      {
        text: "Giành chính quyền nhà nước",
        isCorrect: true,
        explanation: "✅ Đúng! Nếu không nắm chính quyền, giai cấp cách mạng không thể cải tạo xã hội cũ và xây dựng xã hội mới.",
      },
      {
        text: "Chia lại ruộng đất",
        isCorrect: false,
        explanation: "Chia ruộng chỉ là một biện pháp, không phải vấn đề cơ bản.",
      },
      {
        text: "Tăng lương cho công nhân",
        isCorrect: false,
        explanation: "Tăng lương là tác động trong cơ cấu cũ, không thay đổi bản chất.",
      },
    ],
  },
  {
    id: 4,
    question: "Sự khác biệt cơ bản giữa 'Cách mạng xã hội' và 'Đảo chính' là gì?",
    scenario: "Câu hỏi tư duy so sánh cấp độ 2",
    level: "advanced",
    options: [
      {
        text: "Cách mạng có bạo lực, đảo chính thì không",
        isCorrect: false,
        explanation: "Đảo chính cũng có thể bạo lực. Sự khác biệt không ở bạo lực.",
      },
      {
        text: "Cách mạng thay đổi hoàn toàn chế độ xã hội, đảo chính chỉ thay người lãnh đạo",
        isCorrect: true,
        explanation: "✅ Đúng! Đảo chính = 'Bình mới rượu cũ'. Cách mạng = Thay cả bình lẫn rượu (hình thái kinh tế-xã hội).",
      },
      {
        text: "Cách mạng diễn ra nhanh, đảo chính diễn ra chậm",
        isCorrect: false,
        explanation: "Tốc độ không phải tiêu chí phân biệt cơ bản.",
      },
      {
        text: "Cả hai đều giống nhau",
        isCorrect: false,
        explanation: "Không, chúng hoàn toàn khác nhau về bản chất.",
      },
    ],
  },
  {
    id: 5,
    question: "Tại sao nói lợi ích của giai cấp công nhân thống nhất với lợi ích của nhân loại?",
    scenario: "Câu hỏi tư duy cấp độ 2",
    level: "advanced",
    options: [
      {
        text: "Vì giai cấp công nhân đông đảo nhất",
        isCorrect: false,
        explanation: "Con số đông không đủ để giải thích lợi ích toàn cầu.",
      },
      {
        text: "Vì họ làm ra nhiều của cải nhất",
        isCorrect: false,
        explanation: "Sản xuất của cải là điều kiện nhưng không phải lý do cơ bản.",
      },
      {
        text: "Vì muốn giải phóng mình, họ buộc phải giải phóng toàn xã hội khỏi bóc lột",
        isCorrect: true,
        explanation: "✅ Đúng! Giai cấp công nhân không muốn thay thế một ách áp bức bằng ách áp bức khác, mà muốn xóa bỏ vĩnh viễn sự áp bức.",
      },
      {
        text: "Vì họ nắm giữ công nghệ cao",
        isCorrect: false,
        explanation: "Công nghệ chỉ là công cụ, không phải lý do gốc rễ.",
      },
    ],
  },
  {
    id: 6,
    question: "Cải cách và Cách mạng khác nhau như thế nào?",
    scenario: "So sánh chiến lược thay đổi xã hội...",
    level: "advanced",
    options: [
      {
        text: "Cải cách thay đổi từ trong, Cách mạng phá bỏ hoàn toàn",
        isCorrect: true,
        explanation: "✅ Đúng! Cải cách = sơn lại nhà cũ (vấn đề gốc vẫn còn). Cách mạng = đập nhà xây tòa nhà mới.",
      },
      {
        text: "Cải cách nhanh, Cách mạng chậm",
        isCorrect: false,
        explanation: "Tốc độ không phải tiêu chí phân biệt chính.",
      },
      {
        text: "Cải cách tốt hơn vì ít đổ máu",
        isCorrect: false,
        explanation: "Cải cách tốt hơn không có nghĩa là giải quyết mâu thuẫn gốc rễ.",
      },
      {
        text: "Không có gì khác biệt cả",
        isCorrect: false,
        explanation: "Chúng khác nhau rất lớn về bản chất.",
      },
    ],
  },
  {
    id: 7,
    question: "Việc chuyển đổi từ Sổ hộ khẩu giấy sang VNeID thể hiện điều gì dưới góc độ Triết học?",
    scenario: "Liên hệ với thực tiễn Việt Nam hiện đại...",
    level: "roleplay",
    options: [
      {
        text: "Sự thay đổi về bản chất giai cấp của Nhà nước",
        isCorrect: false,
        explanation: "Bản chất 'Nhà nước của dân' không thay đổi, chỉ công cụ quản lý thay đổi.",
      },
      {
        text: "Sự thay đổi về phương thức quản trị do Lực lượng sản xuất (Công nghệ) phát triển",
        isCorrect: true,
        explanation: "✅ Đúng! Công nghệ số (LLSX) phát triển buộc thủ tục hành chính (QHSX) phải nâng cấp để phù hợp với thời đại 4.0.",
      },
      {
        text: "Chỉ là một trào lưu công nghệ nhất thời",
        isCorrect: false,
        explanation: "Không, đó là quy luật khách quan: LLSX phát triển thì QHSX phải thay đổi.",
      },
      {
        text: "Nhà nước muốn kiểm soát người dân chặt hơn",
        isCorrect: false,
        explanation: "Mục đích là cải thiện dịch vụ công, không phải tăng kiểm soát.",
      },
    ],
  },
  {
    id: 8,
    question: "Số hóa thủ tục hành chính (VNeID, e-license, e-invoice) là hình thái cải cách hay cách mạng?",
    scenario: "Phân tích chính sách chuẩn hóa kỹ thuật số tại Việt Nam...",
    level: "roleplay",
    options: [
      {
        text: "Là cách mạng vì thay đổi hoàn toàn hệ thống",
        isCorrect: false,
        explanation: "Bản chất quyền lực và giai cấp không thay đổi, nên không phải cách mạng xã hội.",
      },
      {
        text: "Là cải cách vì thay đổi phương thức quản lý mà không động vào bản chất quyền lực",
        isCorrect: true,
        explanation: "✅ Đúng! Đó là cải cách tiến bộ - thay đổi QHSX (quản trị) để phù hợp với LLSX (công nghệ) phát triển, nhưng không thay đổi hình thái xã hội.",
      },
      {
        text: "Không phải cải cách cũng không phải cách mạng",
        isCorrect: false,
        explanation: "Đó rõ ràng là một hình thức cải cách.",
      },
      {
        text: "Là đảo chính vì thay đổi lớn",
        isCorrect: false,
        explanation: "Đảo chính là tấn công vào quyền lực, không phải cải tiến kỹ thuật.",
      },
    ],
  },
  {
    id: 9,
    question: "Trong kỷ nguyên số, 'Cách mạng xã hội' có nhất thiết phải đổ máu không?",
    scenario: "Phân tích lý thuyết cách mạng trong bối cảnh hiện đại...",
    level: "roleplay",
    options: [
      {
        text: "Luôn luôn phải đổ máu mới là cách mạng",
        isCorrect: false,
        explanation: "Lênin không bao giờ tuyệt đối hóa bạo lực. Nếu điều kiện cho phép, con đường hòa bình là quý giá nhất.",
      },
      {
        text: "Không, có thể diễn ra bằng con đường hòa bình, qua đấu tranh lý thuyết và cải cách triệt để",
        isCorrect: true,
        explanation: "✅ Đúng! Cách mạng không nhất thiết phải bạo lực. Nó là thay đổi bản chất hình thái xã hội - có thể qua hòa bình nếu lực lượng cách mạng đủ mạnh.",
      },
      {
        text: "Cách mạng kỷ nguyên số chỉ diễn ra trên mạng xã hội",
        isCorrect: false,
        explanation: "Mạng xã hội chỉ là công cụ, không phải sân khấu cách mạng thực sự.",
      },
      {
        text: "Kỷ nguyên số không có cách mạng nữa",
        isCorrect: false,
        explanation: "Mâu thuẫn giai cấp vẫn tồn tại trong kỷ nguyên số, cách mạng vẫn có thể xảy ra.",
      },
    ],
  },
  {
    id: 10,
    question: "Công nhân công nghiệp 4.0 bị bóc lột như thế nào khác với công nhân thế kỷ 19?",
    scenario: "Liên hệ bóc lột lao động trong thời đại số...",
    level: "roleplay",
    options: [
      {
        text: "Hoàn toàn như nhau, chỉ khác công cụ lao động",
        isCorrect: false,
        explanation: "Hình thức khác nhưng bản chất bóc lột là như nhau: giá trị lao động bị chiếm đoạt.",
      },
      {
        text: "Khác hoàn toàn, công nhân 4.0 không bị bóc lột",
        isCorrect: false,
        explanation: "Không, bóc lột vẫn tồn tại, chỉ hình thức khác: Gig economy, remote work, AI monitoring...",
      },
      {
        text: "Hình thức khác nhưng bản chất bóc lột vẫn là chiếm đoạt giá trị lao động, chỉ lợi dụng công nghệ tinh vi hơn",
        isCorrect: true,
        explanation: "✅ Đúng! Bóc lột không biến mất ở kỷ nguyên số, nó chỉ tinh vi hơn: thuật toán quyết định lương, không hợp đồng, giám sát AI...",
      },
      {
        text: "Công nhân 4.0 giàu hơn nên không bị bóc lột",
        isCorrect: false,
        explanation: "Tiền lương cao hơn không có nghĩa là không bị bóc lột.",
      },
    ],
  },
  {
    id: 11,
    question: "🏭 TÌNH HUỐNG 1: Sự cố tại nhà máy",
    scenario: "Công nhân đình công vì máy móc cũ kỹ (Mâu thuẫn LLSX và QHSX). Bạn là người đứng đầu, chọn gì?",
    level: "roleplay",
    options: [
      {
        text: "Đuổi việc hết công nhân, tuyển người mới",
        isCorrect: false,
        explanation: "❌ Mâu thuẫn không được giải quyết, chỉ hoãn lại. Sớm hay muộn sẽ có đình công lại.",
      },
      {
        text: "Đầu tư máy mới, sửa đổi quy chế lương thưởng, đối thoại với công nhân",
        isCorrect: true,
        explanation: "✅ CHIẾN THẮNG! Giải quyết mâu thuẫn bằng cách mở đường cho LLSX phát triển.",
      },
    ],
  },
  {
    id: 12,
    question: "🏛️ TÌNH HUỐNG 2: Chính phủ số",
    scenario: "Người dân phàn nàn thủ tục làm giấy tờ quá lâu. Bạn là bộ trưởng, chọn gì?",
    level: "roleplay",
    options: [
      {
        text: "Tăng thêm 1000 cán bộ để làm việc nhanh hơn",
        isCorrect: false,
        explanation: "⚠️ Giải pháp tạm thời: tốn kém, bộ máy cồng kềnh, vấn đề gốc không được giải quyết.",
      },
      {
        text: "Số hóa quy trình, cho phép nộp hồ sơ online qua VNeID",
        isCorrect: true,
        explanation: "✅ TUYỆT VỜI! Thay đổi QHSX (quản trị) phù hợp với LLSX (công nghệ) phát triển.",
      },
    ],
  },
  {
    id: 13,
    question: "🔧 TÌNH HUỐNG 3: Cơ sở sản xuất gặp khủng hoảng",
    scenario: "Công ty bạn lạc hậu so với công nghệ đối thủ (Mâu thuẫn LLSX). Bạn chọn?",
    level: "roleplay",
    options: [
      {
        text: "Nhập máy mới từ nước ngoài, giữ nguyên quy trình sản xuất",
        isCorrect: false,
        explanation: "❌ KHÔNG ĐỦ! Nâng cấp LLSX mà không thay đổi QHSX → hiệu suất vẫn thấp.",
      },
      {
        text: "Cải cách toàn diện: Máy mới + Đào tạo công nhân + Thay đổi quy trình sản xuất",
        isCorrect: true,
        explanation: "✅ CHIẾN THẮNG! LLSX phát triển buộc QHSX phải thay đổi. Thay cả phần cứng lẫn phần mềm.",
      },
    ],
  },
];

interface GameSectionProps {
  sessionId: string;
  onGameComplete: (score: number, total: number) => void;
}

const GameSection = ({ sessionId, onGameComplete }: GameSectionProps) => {
  const { leaderboard: realtimeLeaderboard } = useRealtimeLeaderboard();

  const [gameState, setGameState] = useState<"welcome" | "playing" | "gameOver" | "complete">("welcome");
  const [playerName, setPlayerName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [finishTime, setFinishTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (realtimeLeaderboard.length > 0) {
      const formattedLeaderboard = realtimeLeaderboard.map((entry) => ({
  name: entry.player_name ?? "Ẩn danh",
  score: entry.score,
  time: entry.time_spent ?? 0,
  date: entry.created_at,
}));
      setLeaderboard(formattedLeaderboard);
    }
  }, [realtimeLeaderboard]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "basic":
        return <Brain className="h-4 w-4" />;
      case "advanced":
        return <Zap className="h-4 w-4" />;
      case "roleplay":
        return <Target className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "basic":
        return "from-blue-500 to-cyan-500";
      case "advanced":
        return "from-purple-500 to-pink-500";
      case "roleplay":
        return "from-orange-500 to-red-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "basic":
        return "Lý thuyết cơ bản";
      case "advanced":
        return "Tư duy nâng cao";
      case "roleplay":
        return "Tình huống thực tế";
      default:
        return "Câu hỏi";
    }
  };

  const handleStartGame = () => {
    if (!playerName.trim()) {
      alert("Vui lòng nhập tên danh xưng!");
      return;
    }
    setStartTime(Date.now());
    setGameState("playing");
  };

  const handleAnswer = async (optionIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(optionIndex);
    setShowResult(true);

    const isCorrect = questions[currentQuestion].options[optionIndex].isCorrect;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setGameState("gameOver");
      const durationSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
await updateGameSession(score, currentQuestion + 1, false, durationSeconds);
      return;
    }

    if (currentQuestion === questions.length - 1) {
      const finalScore = score + 1;
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      setFinishTime(Number(duration.toFixed(2)));

      const newEntry: LeaderboardEntry = {
        name: playerName,
        score: finalScore,
        time: Number(duration.toFixed(2)),
        date: new Date().toISOString(),
      };

      const updatedLeaderboard = [...leaderboard, newEntry]
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.time - b.time;
        })
        .slice(0, 10);

      setLeaderboard(updatedLeaderboard);
      localStorage.setItem("revolutionGameLeaderboard", JSON.stringify(updatedLeaderboard));

      setGameState("complete");
      const durationSeconds = (Date.now() - startTime) / 1000;
      await updateGameSession(finalScore, questions.length, true, durationSeconds);
      onGameComplete(finalScore, questions.length);
    }
  };

 const updateGameSession = async (currentScore: number, totalQuestions: number, completed: boolean, timeSpentSeconds: number) => {
  try {
    await supabase.from("game_sessions").insert({
      session_id: sessionId,
      player_name: playerName,         // ✅ add
      score: currentScore,
      total_questions: totalQuestions,
      time_spent: Math.round(timeSpentSeconds), // ✅ add (seconds)
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
    setGameState("welcome");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setPlayerName("");
    setStartTime(0);
    setFinishTime(0);
  };

  const currentQ = gameState === "playing" ? questions[currentQuestion] : null;

  return (
    <section className="min-h-screen py-10 xs:py-12 sm:py-14 md:py-16 px-2 xs:px-3 sm:px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <motion.div
          className="absolute top-8 xs:top-12 sm:top-16 md:top-20 left-4 xs:left-6 sm:left-10 w-40 xs:w-56 sm:w-80 md:w-96 h-40 xs:h-56 sm:h-80 md:h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-8 xs:bottom-12 sm:bottom-16 md:bottom-20 right-4 xs:right-6 sm:right-10 w-40 xs:w-56 sm:w-80 md:w-96 h-40 xs:h-56 sm:h-80 md:h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 xs:mb-10 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1.5 xs:gap-2 sm:gap-2 px-2.5 xs:px-3.5 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-primary/20 mb-2 xs:mb-3 sm:mb-4 text-xs xs:text-sm sm:text-base"
          >
            <Gamepad2 className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="font-semibold text-foreground whitespace-nowrap">Mini-Game Tương Tác</span>
          </motion.div>
          <h2
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2 xs:mb-3 sm:mb-4"
            style={{ lineHeight: 1.3, letterSpacing: "-0.01em" }}
          >
            The Policymaker
          </h2>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Đưa ra quyết định đúng đắn để dẫn dắt xã hội phát triển!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
          <div className="lg:col-span-2 min-w-0">
            <AnimatePresence mode="wait">
              {gameState === "welcome" && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-12 text-center shadow-2xl"
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mb-2 sm:mb-4">Chào mừng!</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto">
                    Kiểm tra kiến thức lý luận chính trị của bạn. Trả lời nhanh và chính xác!
                  </p>

                  <div className="max-w-sm mx-auto space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Nhập tên của bạn..."
                        className="pl-10 h-12 text-base"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleStartGame()}
                      />
                    </div>

                    <Button
                      onClick={handleStartGame}
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-base font-bold"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      BẮT ĐẦU
                    </Button>
                  </div>
                </motion.div>
              )}

              {gameState === "playing" && currentQ && (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                          <span className="text-sm font-medium text-muted-foreground">Câu hỏi</span>
                          <span className="text-sm font-bold text-foreground">
                            {currentQuestion + 1}/{questions.length}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getLevelColor(
                            currentQ.level
                          )} bg-opacity-10`}
                        >
                          {getLevelIcon(currentQ.level)}
                          <span className="text-sm font-medium text-foreground">{getLevelLabel(currentQ.level)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-bold text-foreground">{score} điểm</span>
                      </div>
                    </div>

                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getLevelColor(currentQ.level)} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-10 shadow-lg"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-6">
                      <span className="text-sm text-muted-foreground italic">{currentQ.scenario}</span>
                    </div>

                    <h3 className="text-base sm:text-xl md:text-2xl font-bold text-foreground mb-6 sm:mb-8 leading-relaxed">
                      {currentQ.question}
                    </h3>

                    <div className="space-y-4">
                      {currentQ.options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={showResult}
                          whileHover={!showResult ? { scale: 1.02, x: 4 } : {}}
                          whileTap={!showResult ? { scale: 0.98 } : {}}
                          className={`w-full p-5 rounded-2xl text-left transition-all duration-300 border-2 ${
                            showResult
                              ? option.isCorrect
                                ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20"
                                : selectedAnswer === index
                                ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20"
                                : "border-border bg-muted/30 opacity-60"
                              : "border-border bg-card hover:border-primary hover:bg-primary/5 hover:shadow-lg"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold transition-all ${
                                showResult
                                  ? option.isCorrect
                                    ? "bg-green-500 text-white shadow-lg"
                                    : selectedAnswer === index
                                    ? "bg-red-500 text-white shadow-lg"
                                    : "bg-muted text-muted-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {showResult ? (
                                option.isCorrect ? (
                                  <Check className="h-5 w-5" />
                                ) : selectedAnswer === index ? (
                                  <X className="h-5 w-5" />
                                ) : (
                                  <span className="text-sm">{String.fromCharCode(65 + index)}</span>
                                )
                              ) : (
                                <span className="text-sm">{String.fromCharCode(65 + index)}</span>
                              )}
                            </div>
                            <span className="text-foreground font-medium flex-1 pt-0.5">{option.text}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {showResult && gameState === "playing" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-8 space-y-4"
                        >
                          <div className="p-5 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {currentQ.options.find((o) => o.isCorrect)?.explanation}
                            </p>
                          </div>
                          {currentQuestion < questions.length - 1 && (
                            <Button onClick={nextQuestion} className="w-full" size="lg">
                              Câu tiếp theo →
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}

              {gameState === "gameOver" && (
                <motion.div
                  key="gameover"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card border-2 border-red-500/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-12 text-center shadow-2xl"
                >
                  <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="h-12 w-12 text-red-500" />
                  </div>
                  <h3 className="text-3xl font-black text-red-600 mb-3">Khủng hoảng xã hội! 💥</h3>
                  <p className="text-muted-foreground text-lg mb-6">Quyết định sai lầm dẫn đến bất ổn</p>
                  <Button
                    onClick={restartGame}
                    size="lg"
                    className="gap-2"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Thử lại
                  </Button>
                </motion.div>
              )}

              {gameState === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card border-2 border-green-500/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-12 text-center shadow-2xl"
                >
                  <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Trophy className="h-10 sm:h-14 w-10 sm:w-14 text-green-500" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-green-600 mb-3 sm:mb-4">Hoàn thành! 🎉</h3>

                  <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-border">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Người thực hiện:</p>
                    <p className="text-xl sm:text-2xl font-black text-primary mb-3 sm:mb-4 truncate">{playerName}</p>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-background/50">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Điểm số</p>
                        <p className="text-2xl sm:text-3xl font-black text-foreground">
                          {score}/{questions.length}
                        </p>
                      </div>

                      <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-background/50">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Thời gian</p>
                        <p className="text-2xl sm:text-3xl font-black text-foreground font-mono">{finishTime}s</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={restartGame} variant="outline" size="lg" className="gap-2 border-2">
                    <RotateCcw className="h-5 w-5" />
                    Chơi lại
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-3xl p-6 shadow-xl sticky top-6"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-green-500/10 border-2 border-green-500/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-green-500"
                    />
                    <span className="text-xs font-semibold text-foreground">Live</span>
                  </div>
                </div>
              </motion.div>

              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-black text-foreground">Top Điểm</h3>
              </div>

              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Chưa có kỷ lục</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 ${
                        index === 0
                          ? "bg-amber-500/10 border-amber-500/30"
                          : index === 1
                          ? "bg-slate-400/10 border-slate-400/30"
                          : index === 2
                          ? "bg-orange-600/10 border-orange-600/30"
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${
                            index === 0
                              ? "bg-amber-500 text-white"
                              : index === 1
                              ? "bg-slate-400 text-white"
                              : index === 2
                              ? "bg-orange-600 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground truncate">{entry.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>
                              <Star className="h-3 w-3 inline mr-1" />
                              {entry.score}
                            </span>
                            <span>
                              <Clock className="h-3 w-3 inline mr-1" />
                              {entry.time}s
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameSection;
