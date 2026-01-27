import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, RotateCcw, Trophy, AlertTriangle, Gamepad2, Star, Zap, Brain, Target, Clock, Medal, User, Award, ChevronDown } from "lucide-react";
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
  // PHẦN A: MỐI QUAN HỆ GIAI CẤP - DÂN TỘC - NHÂN LOẠI
  {
    id: 1,
    question: "Trong mối quan hệ biện chứng giữa giai cấp và dân tộc, yếu tố nào đóng vai trò quyết định xu hướng phát triển của dân tộc?",
    scenario: "Câu hỏi lý thuyết cơ bản",
    level: "basic",
    options: [
      {
        text: "Truyền thống văn hóa lâu đời",
        isCorrect: false,
        explanation: "❌ Truyền thống văn hóa là yếu tố phụ, không quyết định.",
      },
      {
        text: "Giai cấp thống trị xã hội",
        isCorrect: true,
        explanation: "✅ Đúng! Giai cấp nào nắm quyền lực kinh tế và nhà nước sẽ quyết định xu hướng phát triển của dân tộc.",
      },
      {
        text: "Vị trí địa lý và tài nguyên",
        isCorrect: false,
        explanation: "Địa lý ảnh hưởng nhưng không quyết định.",
      },
      {
        text: "Lực lượng đông đảo nhất",
        isCorrect: false,
        explanation: "Số lượng đông không phải là yếu tố quyết định.",
      },
    ],
  },
  {
    id: 2,
    question: "Luận điểm: 'Hãy xóa bỏ tình trạng người bóc lột người thì tình trạng dân tộc này bóc lột dân tộc khác cũng sẽ bị xóa bỏ' khẳng định mối liên hệ nào?",
    scenario: "Phân tích mối liên hệ giai cấp-dân tộc",
    level: "basic",
    options: [
      {
        text: "Giải phóng dân tộc là tiền đề giải phóng giai cấp",
        isCorrect: false,
        explanation: "Ngược lại, giải phóng giai cấp là tiền đề giải phóng dân tộc.",
      },
      {
        text: "Áp bức giai cấp là căn nguyên của áp bức dân tộc",
        isCorrect: true,
        explanation: "✅ Đúng! Áp bức dân tộc thường gắn liền với áp bức giai cấp.",
      },
      {
        text: "Đấu tranh giai cấp làm lu mờ bản sắc dân tộc",
        isCorrect: false,
        explanation: "Đấu tranh giai cấp và dân tộc có thể kết hợp với nhau.",
      },
      {
        text: "Dân tộc và giai cấp là hai phạm trù tách biệt",
        isCorrect: false,
        explanation: "Chúng liên quan chặt chẽ với nhau.",
      },
    ],
  },
  {
    id: 3,
    question: "Tại sao nói lợi ích của giai cấp công nhân thống nhất với lợi ích của nhân loại?",
    scenario: "Câu hỏi lý thuyết cơ bản",
    level: "basic",
    options: [
      {
        text: "Vì giai cấp công nhân muốn thay thế chế độ bóc lột cũ bằng chế độ bóc lột mới ưu việt hơn",
        isCorrect: false,
        explanation: "Không, công nhân muốn xóa bỏ sự bóc lột hoàn toàn.",
      },
      {
        text: "Vì giai cấp công nhân đại diện cho phương thức sản xuất hiện đại và giàu có nhất",
        isCorrect: false,
        explanation: "Đây không phải lý do gốc rễ.",
      },
      {
        text: "Vì giai cấp công nhân chỉ có thể tự giải phóng mình khi giải phóng toàn xã hội khỏi áp bức",
        isCorrect: true,
        explanation: "✅ Đúng! Giai cấp công nhân không thể giải phóng bản thân mà không giải phóng cả nhân loại.",
      },
      {
        text: "Vì đây là giai cấp có số lượng đông đảo nhất trong cơ cấu dân số toàn cầu",
        isCorrect: false,
        explanation: "Số lượng không phải là lý do cơ bản.",
      },
    ],
  },
  {
    id: 4,
    question: "Trong xã hội có giai cấp, khái niệm 'Dân tộc' chịu sự chi phối chủ yếu bởi yếu tố nào?",
    scenario: "Phân tích bản chất của khái niệm dân tộc",
    level: "basic",
    options: [
      {
        text: "Tính chất giai cấp",
        isCorrect: true,
        explanation: "✅ Đúng! Tính chất giai cấp chi phối khái niệm dân tộc trong xã hội có giai cấp.",
      },
      {
        text: "Bản sắc văn hóa",
        isCorrect: false,
        explanation: "Bản sắc văn hóa là yếu tố phụ.",
      },
      {
        text: "Ngôn ngữ giao tiếp",
        isCorrect: false,
        explanation: "Ngôn ngữ chỉ là biểu hiện ngoài.",
      },
      {
        text: "Phong tục tập quán",
        isCorrect: false,
        explanation: "Phong tục không phải yếu tố chi phối chủ yếu.",
      },
    ],
  },
  {
    id: 5,
    question: "Đối với giai cấp công nhân, việc giải quyết vấn đề dân tộc phải đứng trên lập trường nào?",
    scenario: "Nguyên tắc của giai cấp công nhân",
    level: "advanced",
    options: [
      {
        text: "Chủ nghĩa dân tộc cực đoan",
        isCorrect: false,
        explanation: "Dân tộc chủ nghĩa cực đoan sẽ chia rẽ giai cấp công nhân.",
      },
      {
        text: "Chủ nghĩa quốc tế vô sản",
        isCorrect: true,
        explanation: "✅ Đúng! Giai cấp công nhân phải đứng trên lập trường chủ nghĩa quốc tế vô sản.",
      },
      {
        text: "Chủ nghĩa nhân đạo trừu tượng",
        isCorrect: false,
        explanation: "Nhân đạo trừu tượng không là nguyên tắc xác định.",
      },
      {
        text: "Chủ nghĩa thực dụng kinh tế",
        isCorrect: false,
        explanation: "Thực dụng không phải nguyên tắc cơ bản.",
      },
    ],
  },
  {
    id: 6,
    question: "Nhận định nào sau đây là SAI khi nói về quan hệ giữa nhân loại và giai cấp?",
    scenario: "Phân tích sai - đúng",
    level: "advanced",
    options: [
      {
        text: "Lợi ích giai cấp thống trị luôn luôn đối lập tuyệt đối với lợi ích nhân loại trong mọi thời đại",
        isCorrect: true,
        explanation: "✅ ĐÚNG - Đây là nhận định SAI! Vì giai cấp thống trị khi còn tiến bộ thì lợi ích vẫn phù hợp với nhân loại.",
      },
      {
        text: "Nhân loại là cộng đồng người toàn cầu, nhưng bị phân chia bởi lợi ích giai cấp",
        isCorrect: false,
        explanation: "Nhận định này đúng.",
      },
      {
        text: "Sự phát triển của nhân loại diễn ra thông qua sự phát triển của các dân tộc và giai cấp",
        isCorrect: false,
        explanation: "Nhận định này đúng.",
      },
      {
        text: "Trong thời đại ngày nay, vấn đề giai cấp và dân tộc gắn liền với vấn đề nhân loại",
        isCorrect: false,
        explanation: "Nhận định này đúng.",
      },
    ],
  },
  {
    id: 7,
    question: "Vai trò của 'Dân tộc' đối với 'Giai cấp' được thể hiện như thế nào?",
    scenario: "Mối quan hệ chức năng",
    level: "advanced",
    options: [
      {
        text: "Dân tộc quyết định sự hình thành của giai cấp",
        isCorrect: false,
        explanation: "Ngược lại, giai cấp hình thành trong khuôn khổ dân tộc.",
      },
      {
        text: "Dân tộc là 'địa bàn' trực tiếp để giai cấp tiến hành đấu tranh",
        isCorrect: true,
        explanation: "✅ Đúng! Dân tộc là không gian mà trong đó giai cấp tồn tại và đấu tranh.",
      },
      {
        text: "Dân tộc là yếu tố phụ, không ảnh hưởng đến đấu tranh giai cấp",
        isCorrect: false,
        explanation: "Dân tộc có ảnh hưởng quan trọng.",
      },
      {
        text: "Dân tộc luôn mâu thuẫn gay gắt với lợi ích giai cấp",
        isCorrect: false,
        explanation: "Không phải lúc nào cũng như vậy.",
      },
    ],
  },
  {
    id: 8,
    question: "Điền vào chỗ trống luận điểm của Hồ Chí Minh: 'Trong thời đại mới, độc lập dân tộc phải gắn liền với [...]'",
    scenario: "Tư tưởng Hồ Chí Minh",
    level: "advanced",
    options: [
      {
        text: "Hợp tác quốc tế",
        isCorrect: false,
        explanation: "Hợp tác là phương tiện, không phải nội dung cơ bản.",
      },
      {
        text: "Chủ nghĩa xã hội",
        isCorrect: true,
        explanation: "✅ Đúng! Độc lập dân tộc phải gắn liền với chủ nghĩa xã hội để xây dựng tương lai phồn vinh.",
      },
      {
        text: "Kinh tế thị trường",
        isCorrect: false,
        explanation: "Kinh tế thị trường không phải lựa chọn tương lai.",
      },
      {
        text: "Bản sắc văn hóa",
        isCorrect: false,
        explanation: "Văn hóa là kết quả, không phải nội dung cơ bản.",
      },
    ],
  },

  // PHẦN B: CÁCH MẠNG XÃ HỘI
  {
    id: 9,
    question: "Nguyên nhân sâu xa (nguyên nhân kinh tế) dẫn đến sự bùng nổ của cách mạng xã hội là gì?",
    scenario: "Câu hỏi lý thuyết cơ bản",
    level: "basic",
    options: [
      {
        text: "Mâu thuẫn gay gắt giữa các phe phái chính trị trong bộ máy nhà nước",
        isCorrect: false,
        explanation: "Đấu tranh nội bộ thượng tầng không phải nguyên nhân gốc rễ.",
      },
      {
        text: "Mâu thuẫn giữa Lực lượng sản xuất tiến bộ và Quan hệ sản xuất lỗi thời",
        isCorrect: true,
        explanation: "✅ Đúng! Khi LLSX phát triển mà QHSX quá chật, cách mạng nổ ra để phá vỡ lồng công.",
      },
      {
        text: "Sự nghèo đói cùng cực của quần chúng nhân dân lao động",
        isCorrect: false,
        explanation: "Nghèo đói chỉ là điều kiện, không phải nguyên nhân gốc rễ.",
      },
      {
        text: "Sự khủng hoảng toàn diện về tư tưởng và văn hóa của xã hội",
        isCorrect: false,
        explanation: "Khủng hoảng tư tưởng là hệ quả, không phải nguyên nhân.",
      },
    ],
  },
  {
    id: 10,
    question: "Sự khác biệt căn bản về CHẤT giữa 'Cách mạng xã hội' và 'Cải cách' là gì?",
    scenario: "So sánh bản chất hai hình thức thay đổi",
    level: "basic",
    options: [
      {
        text: "Cách mạng thay đổi thể chế chính trị; Cải cách củng cố thể chế hiện có",
        isCorrect: true,
        explanation: "✅ Đúng! Cách mạng phá bỏ và xây dựng mới; Cải cách chỉ sửa chữa cái cũ.",
      },
      {
        text: "Cách mạng diễn ra nhanh chóng; Cải cách diễn ra từ từ, chậm chạp",
        isCorrect: false,
        explanation: "Tốc độ không phải tiêu chí phân biệt cơ bản.",
      },
      {
        text: "Cách mạng luôn dùng bạo lực; Cải cách luôn diễn ra trong hòa bình",
        isCorrect: false,
        explanation: "Cải cách cũng có thể dùng bạo lực.",
      },
      {
        text: "Cách mạng do quần chúng làm; Cải cách do lãnh đạo thực hiện",
        isCorrect: false,
        explanation: "Cả hai đều cần sự tham gia của lãnh đạo.",
      },
    ],
  },
  {
    id: 11,
    question: "'Đảo chính' khác với 'Cách mạng xã hội' ở điểm mấu chốt nào?",
    scenario: "Phân biệt hai khái niệm",
    level: "basic",
    options: [
      {
        text: "Đảo chính có đổ máu, còn cách mạng xã hội thì không",
        isCorrect: false,
        explanation: "Cả hai đều có thể có bạo lực.",
      },
      {
        text: "Đảo chính thay đổi người lãnh đạo nhưng giữ nguyên chế độ xã hội",
        isCorrect: true,
        explanation: "✅ Đúng! Đảo chính = 'Bình mới rượu cũ'. Cách mạng = Thay cả bình lẫn rượu.",
      },
      {
        text: "Đảo chính nhận được sự ủng hộ của tuyệt đại đa số quần chúng nhân dân",
        isCorrect: false,
        explanation: "Đảo chính thường không có sự ủng hộ của nhân dân.",
      },
      {
        text: "Đảo chính giải quyết được mâu thuẫn cơ bản giữa LLSX và QHSX",
        isCorrect: false,
        explanation: "Đảo chính không giải quyết mâu thuẫn cơ bản.",
      },
    ],
  },
  {
    id: 12,
    question: "Vấn đề cơ bản của mọi cuộc cách mạng xã hội là vấn đề gì?",
    scenario: "Câu hỏi lý thuyết cơ bản",
    level: "basic",
    options: [
      {
        text: "Tiêu diệt giai cấp đối kháng",
        isCorrect: false,
        explanation: "Tiêu diệt giai cấp là hậu quả, không phải vấn đề cơ bản.",
      },
      {
        text: "Giành chính quyền nhà nước",
        isCorrect: true,
        explanation: "✅ Đúng! Nếu không giành chính quyền, giai cấp cách mạng không thể xây dựng xã hội mới.",
      },
      {
        text: "Cải thiện đời sống nhân dân",
        isCorrect: false,
        explanation: "Cải thiện đời sống là kết quả, không phải vấn đề cơ bản.",
      },
      {
        text: "Xây dựng lực lượng vũ trang",
        isCorrect: false,
        explanation: "Lực lượng vũ trang là phương tiện, không phải vấn đề cơ bản.",
      },
    ],
  },
  {
    id: 13,
    question: "Theo quan điểm mác-xít, phương pháp cách mạng bạo lực là:",
    scenario: "Phân tích vai trò của bạo lực",
    level: "advanced",
    options: [
      {
        text: "Phương thức duy nhất để giành chính quyền trong mọi hoàn cảnh",
        isCorrect: false,
        explanation: "Bạo lực không phải phương thức duy nhất.",
      },
      {
        text: "Quy luật phổ biến trong các cuộc cách mạng xã hội đã qua",
        isCorrect: true,
        explanation: "✅ Đúng! Bạo lực là quy luật phổ biến nhất trong cách mạng xã hội lịch sử.",
      },
      {
        text: "Sự lựa chọn ưu tiên hàng đầu của giai cấp công nhân",
        isCorrect: false,
        explanation: "Giai cấp công nhân không tìm kiếm bạo lực, mà bị giai cấp thống trị ép buộc.",
      },
      {
        text: "Hành động vi phạm đạo đức và nhân văn của nhân loại",
        isCorrect: false,
        explanation: "Bạo lực cách mạng là hành động công juste để bảo vệ nhân loại.",
      },
    ],
  },
  {
    id: 14,
    question: "Cách mạng xã hội đóng vai trò như thế nào trong sự phát triển của lịch sử?",
    scenario: "Vai trò của cách mạng",
    level: "advanced",
    options: [
      {
        text: "Là những 'cơn điên cuồng' của lịch sử",
        isCorrect: false,
        explanation: "Cách mạng không phải điên cuồng mà là quy luật khách quan.",
      },
      {
        text: "Là sự ngắt quãng, làm thụt lùi quá trình tiến hóa xã hội",
        isCorrect: false,
        explanation: "Cách mạng thúc đẩy tiến hóa, không làm thụt lùi.",
      },
      {
        text: "Là 'đầu tàu' thúc đẩy lịch sử phát triển tới hình thái cao hơn",
        isCorrect: true,
        explanation: "✅ Đúng! Cách mạng là động lực chính thúc đẩy lịch sử tiến bộ.",
      },
      {
        text: "Là phương thức duy nhất để giải quyết mọi mâu thuẫn xã hội",
        isCorrect: false,
        explanation: "Không phải duy nhất, nhưng là phương thức chính yếu.",
      },
    ],
  },
  {
    id: 15,
    question: "Điều kiện khách quan để cách mạng xã hội nổ ra là gì?",
    scenario: "Phân tích điều kiện cách mạng",
    level: "advanced",
    options: [
      {
        text: "Tình thế cách mạng xuất hiện",
        isCorrect: true,
        explanation: "✅ Đúng! Tình thế cách mạng là điều kiện khách quan cần thiết.",
      },
      {
        text: "Giai cấp lãnh đạo đã sẵn sàng",
        isCorrect: false,
        explanation: "Sự sẵn sàng của giai cấp là điều kiện chủ quan.",
      },
      {
        text: "Quần chúng nhân dân muốn khởi nghĩa",
        isCorrect: false,
        explanation: "Đây cũng là điều kiện chủ quan.",
      },
      {
        text: "Kẻ thù của cách mạng đã suy yếu",
        isCorrect: false,
        explanation: "Sự suy yếu của kẻ thù là điều kiện nhưng không phải khách quan.",
      },
    ],
  },
  {
    id: 16,
    question: "Sự phát triển của công cụ lao động và công nghệ (AI, Internet...) thuộc yếu tố nào trong nguyên nhân cách mạng?",
    scenario: "Phân loại yếu tố nguyên nhân",
    level: "advanced",
    options: [
      {
        text: "Quan hệ sản xuất",
        isCorrect: false,
        explanation: "Quan hệ sản xuất là cách thức tổ chức sản xuất.",
      },
      {
        text: "Lực lượng sản xuất",
        isCorrect: true,
        explanation: "✅ Đúng! Công cụ lao động và công nghệ là thành phần của lực lượng sản xuất.",
      },
      {
        text: "Kiến trúc thượng tầng",
        isCorrect: false,
        explanation: "Kiến trúc thượng tầng là tư tưởng và thể chế.",
      },
      {
        text: "Cơ sở hạ tầng",
        isCorrect: false,
        explanation: "Cơ sở hạ tầng là nền tảng địa lý.",
      },
    ],
  },
  {
    id: 17,
    question: "Cách mạng xã hội kết thúc khi nào?",
    scenario: "Xác định thời điểm kết thúc",
    level: "advanced",
    options: [
      {
        text: "Khi giai cấp thống trị bị lật đổ",
        isCorrect: false,
        explanation: "Lật đổ giai cấp thống trị chỉ là bước đầu.",
      },
      {
        text: "Khi chính quyền nhà nước về tay giai cấp cách mạng",
        isCorrect: false,
        explanation: "Giành chính quyền mới là bước đầu của cách mạng.",
      },
      {
        text: "Khi thiết lập được phương thức sản xuất mới tiến bộ hơn",
        isCorrect: true,
        explanation: "✅ Đúng! Cách mạng xã hội kết thúc khi hình thái kinh tế-xã hội mới được thiết lập.",
      },
      {
        text: "Khi tiếng súng đấu tranh đã chấm dứt hoàn toàn",
        isCorrect: false,
        explanation: "Dừng bạo lực không có nghĩa là kết thúc cách mạng.",
      },
    ],
  },
  {
    id: 18,
    question: "Tại sao nói cách mạng xã hội là bước chuyển biến về 'Chất'?",
    scenario: "Phân tích bản chất của cách mạng",
    level: "advanced",
    options: [
      {
        text: "Vì nó thay đổi căn bản hình thái kinh tế - xã hội",
        isCorrect: true,
        explanation: "✅ Đúng! Cách mạng thay đổi căn bản, không phải chỉnh sửa ngoài.",
      },
      {
        text: "Vì nó diễn ra với quy mô rộng lớn toàn cầu",
        isCorrect: false,
        explanation: "Quy mô không phải tiêu chí xác định chất.",
      },
      {
        text: "Vì nó huy động được số lượng người tham gia đông đảo",
        isCorrect: false,
        explanation: "Số lượng không phải tiêu chí xác định chất.",
      },
      {
        text: "Vì nó sử dụng những vũ khí và phương tiện hiện đại",
        isCorrect: false,
        explanation: "Vũ khí chỉ là phương tiện, không phải nội dung.",
      },
    ],
  },
  {
    id: 19,
    question: "Phương pháp hòa bình trong cách mạng xã hội có giá trị như thế nào?",
    scenario: "Đánh giá phương pháp hòa bình",
    level: "roleplay",
    options: [
      {
        text: "Là phương pháp thủ tiêu đấu tranh giai cấp",
        isCorrect: false,
        explanation: "Hòa bình không thủ tiêu đấu tranh.",
      },
      {
        text: "Là phương pháp thỏa hiệp vô nguyên tắc",
        isCorrect: false,
        explanation: "Hòa bình không phải thỏa hiệp vô nguyên tắc.",
      },
      {
        text: "Là phương pháp quý giá nhưng rất hiếm khi xảy ra",
        isCorrect: true,
        explanation: "✅ Đúng! Hòa bình cách mạng quý giá nhưng rất hiếm trong lịch sử.",
      },
      {
        text: "Là phương pháp phổ biến nhất trong lịch sử nhân loại",
        isCorrect: false,
        explanation: "Bạo lực mới là phương pháp phổ biến, không phải hòa bình.",
      },
    ],
  },
  {
    id: 20,
    question: "Việc chuyển đổi số quốc gia (xây dựng Chính phủ điện tử, công dân số) hiện nay phản ánh quy luật nào?",
    scenario: "Vận dụng lý thuyết cách mạng vào thực tiễn",
    level: "roleplay",
    options: [
      {
        text: "Kiến trúc thượng tầng phải đổi mới để phù hợp với sự phát triển của Lực lượng sản xuất",
        isCorrect: true,
        explanation: "✅ Đúng! Công nghệ số (LLSX) phát triển buộc quản trị (QHSX) phải đổi mới.",
      },
      {
        text: "Đấu tranh giai cấp đang diễn ra gay gắt trong không gian mạng",
        isCorrect: false,
        explanation: "Chuyển đổi số không phải thể hiện đấu tranh giai cấp.",
      },
      {
        text: "Sự thay đổi người lãnh đạo dẫn đến sự thay đổi của chế độ xã hội",
        isCorrect: false,
        explanation: "Đó không phải nguyên nhân chuyển đổi số.",
      },
      {
        text: "Quan hệ sản xuất quyết định trình độ của Lực lượng sản xuất",
        isCorrect: false,
        explanation: "Ngược lại, LLSX quyết định QHSX.",
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
  const [showStats, setShowStats] = useState(false);

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

        {/* AI Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-2xl p-6 shadow-xl"
        >
          <button
            onClick={() => setShowStats(!showStats)}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 group-hover:from-cyan-200 group-hover:to-blue-200 transition-colors">
                <Brain className="h-5 w-5 text-cyan-600" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 text-lg">Phân Tích Lý Thuyết & Công Cụ Hỗ Trợ</h3>
                <p className="text-xs text-slate-600 mt-1">Xem chi tiết AI và Prompts được sử dụng</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: showStats ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-5 w-5 text-slate-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-6 pt-6 border-t border-blue-200"
              >
                {/* AI Models Section */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></span>
                    AI Models Được Sử Dụng
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200 hover:border-cyan-400 transition-colors">
                      <p className="text-sm font-medium text-slate-900">Claude 3.5 Sonnet</p>
                      <p className="text-xs text-slate-600 mt-1">Chính - Phân tích lý thuyết Mác Lê Niên, xây dựng cấu trúc câu hỏi</p>
                    </div>
                    <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200 hover:border-cyan-400 transition-colors">
                      <p className="text-sm font-medium text-slate-900">GitHub Copilot</p>
                      <p className="text-xs text-slate-600 mt-1">Hỗ trợ React/TypeScript implementation</p>
                    </div>
                    <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200 hover:border-cyan-400 transition-colors">
                      <p className="text-sm font-medium text-slate-900">GPT-4o</p>
                      <p className="text-xs text-slate-600 mt-1">Kiểm chứng độ chính xác nội dung lý thuyết</p>
                    </div>
                  </div>
                </div>

                {/* Prompts Section */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    Prompts Về Lý Thuyết
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Phân tích mối quan hệ biện chứng giữa giai cấp và dân tộc theo quan điểm Mác Lê Niên",
                      "Giải thích vai trò của giai cấp công nhân trong cách mạng vô sản thế giới",
                      "Phân tích mối liên hệ giữa chủ nghĩa thực dân và áp bức giai cấp",
                      "Xây dựng hệ thống câu hỏi trắc nghiệm về lý thuyết giai cấp, dân tộc và nhân loại",
                      "Tạo kịch bản vai trò để người học áp dụng lý thuyết vào thực tế",
                      "Phát triển trò chơi tương tác về lịch sử cách mạng và phong trào công nhân"
                    ].map((prompt, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-purple-50 border border-purple-200 hover:border-purple-400 transition-colors">
                        <p className="text-sm text-slate-800 leading-relaxed">▪ {prompt}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Concepts Section */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Các Khái Niệm Chính Được Triển Khai
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { icon: "✓", text: "Câu hỏi cơ bản (Basic Level)" },
                      { icon: "✓", text: "Câu hỏi nâng cao (Advanced Level)" },
                      { icon: "✓", text: "Kịch bản vai trò (Roleplay Level)" },
                      { icon: "✓", text: "Xếp hạng thời gian thực (Realtime)" },
                      { icon: "✓", text: "Tracking với Supabase" },
                      { icon: "✓", text: "Framer Motion animations" }
                    ].map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-green-50 border border-green-200 flex items-start gap-2 hover:border-green-400 transition-colors">
                        <span className="text-green-600 font-bold flex-shrink-0">{item.icon}</span>
                        <span className="text-sm text-slate-800">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Objectives Section */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                    Mục Tiêu Học Tập
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Nắm vững mối liên hệ biện chứng giữa giai cấp, dân tộc và nhân loại",
                      "Hiểu rõ vai trò lãnh đạo của giai cấp công nhân",
                      "Phân tích các mâu thuẫn chính trong xã hội giai cấp",
                      "Nhận biết tính tiến bộ của chủ nghĩa xã hội",
                      "Áp dụng lý thuyết vào phân tích các tình huống thực tế"
                    ].map((objective, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-orange-50 border border-orange-200 flex items-start gap-3 hover:border-orange-400 transition-colors">
                        <span className="text-orange-600 font-bold flex-shrink-0">{idx + 1}.</span>
                        <span className="text-sm text-slate-800">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default GameSection;
