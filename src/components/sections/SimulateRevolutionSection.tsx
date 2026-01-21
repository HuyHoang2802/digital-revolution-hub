import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, AlertCircle, Wrench, Zap, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Choice = "reform" | "coup" | "revolution";

interface ChoiceResult {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  success: boolean;
}

const resultData: Record<Choice, ChoiceResult> = {
  reform: {
    title: "🔴 Cải cách (Dán Băng Keo)",
    description:
      "Máy vẫn chạy nhưng vẫn chậm. Bạn chỉ sơn lại cái nhà cũ. Nhìn mới hơn, nhưng cột kèo bên trong vẫn mục nát. Vấn đề gốc rễ không được giải quyết → Sớm hay muộn cũng sẽ bốc cháy lại.",
    icon: <AlertCircle className="h-16 w-16" />,
    color: "from-red-500 to-orange-500",
    success: false
  },
  coup: {
    title: "🟡 Đảo Chính (Đổi Người Ngồi Máy)",
    description:
      "Người khác vào ở, nhưng nhà vẫn dột. Máy vẫn hỏng, chỉ khác người dùng. Bạn đổi lãnh đạo nhưng cấu trúc/quy chế cũ vẫn nguyên → Vấn đề tái diễn.",
    icon: <Wrench className="h-16 w-16" />,
    color: "from-yellow-500 to-amber-500",
    success: false
  },
  revolution: {
    title: "🟢 Cách Mạng Xã Hội (Mua Dàn Máy Mới)",
    description:
      "Thay toàn bộ mainboard và hệ điều hành. Đập bỏ nhà cũ, xây tòa nhà chọc trời mới. Đây là thay đổi hoàn toàn về chất lượng cuộc sống. Mọi thứ vận hành trơn tru, năng suất tăng vọt!",
    icon: <CheckCircle className="h-16 w-16" />,
    color: "from-green-500 to-emerald-500",
    success: true
  }
};

const SimulateRevolutionSection = () => {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <section className="min-h-screen py-20 px-4 bg-gradient-to-b from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-40 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cpu className="h-10 w-10 text-purple-600" />
            <h2  className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-6"
            style={{ fontSize: "3rem", lineHeight: 2 }}>
              Mô Phỏng Cách Mạng
            </h2>
            <Zap className="h-10 w-10 text-blue-600" />
          </div>
          
        </motion.div>

        {/* Problem Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 p-8 bg-white rounded-2xl shadow-lg border-2 border-purple-200"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            Bối Cảnh: Chiếc PC Cũ Bốc Khói
          </h3>
          <div className="space-y-4 text-slate-700">
            <p className="text-lg font-semibold">
              Tưởng tượng một Công ty công nghệ hiện đại:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">⚙️ Lực lượng sản xuất:</span>
                <span>Nhân viên giỏi dùng AI, máy tính khủng. Phát triển nhanh như tên lửa.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">📋 Quan hệ sản xuất:</span>
                <span>Quy chế cũ: Chấm công giấy, trả lương tiền mặt, cấm dùng Internet!</span>
              </li>
            </ul>
            <p className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-semibold">
              🔥 <strong>Mâu thuẫn:</strong> Đội ngũ tiên tiến (phần cứng mạnh) bị kìm hãm bởi quy chế lỗi thời (phần mềm yếu).
              PC sắp bốc cháy!
            </p>
          </div>
        </motion.div>

        {/* Interactive Choices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">
            Công ty lựa chọn giải pháp nào? 🤔
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Choice A: Reform */}
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedChoice("reform");
                setShowExplanation(true);
              }}
              className={`p-6 rounded-2xl border-3 transition-all ${
                selectedChoice === "reform"
                  ? "bg-red-100 border-red-500 shadow-xl"
                  : "bg-white border-red-300 hover:shadow-lg"
              }`}
            >
              <div className="text-4xl mb-3">🔴</div>
              <h4 className="font-bold text-lg text-red-700 mb-2">Cải Cách</h4>
              <p className="text-sm text-slate-600">Dán băng keo, sơn lại mình PC</p>
              <p className="text-xs text-red-600 font-semibold mt-3">Kết quả: ❌ Thất bại</p>
            </motion.button>

            {/* Choice B: Coup */}
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedChoice("coup");
                setShowExplanation(true);
              }}
              className={`p-6 rounded-2xl border-3 transition-all ${
                selectedChoice === "coup"
                  ? "bg-yellow-100 border-yellow-500 shadow-xl"
                  : "bg-white border-yellow-300 hover:shadow-lg"
              }`}
            >
              <div className="text-4xl mb-3">🟡</div>
              <h4 className="font-bold text-lg text-yellow-700 mb-2">Đảo Chính</h4>
              <p className="text-sm text-slate-600">Đổi IT Manager, PC vẫn cũ</p>
              <p className="text-xs text-yellow-600 font-semibold mt-3">Kết quả: ❌ Thất bại</p>
            </motion.button>

            {/* Choice C: Revolution */}
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedChoice("revolution");
                setShowExplanation(true);
              }}
              className={`p-6 rounded-2xl border-3 transition-all ${
                selectedChoice === "revolution"
                  ? "bg-green-100 border-green-500 shadow-xl"
                  : "bg-white border-green-300 hover:shadow-lg"
              }`}
            >
              <div className="text-4xl mb-3">🟢</div>
              <h4 className="font-bold text-lg text-green-700 mb-2">Cách Mạng</h4>
              <p className="text-sm text-slate-600">Mua PC mới + HĐH mới</p>
              <p className="text-xs text-green-600 font-semibold mt-3">Kết quả: ✅ Thành công</p>
            </motion.button>
          </div>

          {/* Reset Button */}
          {selectedChoice !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <Button
                onClick={() => {
                  setSelectedChoice(null);
                  setShowExplanation(false);
                }}
                variant="outline"
                className="text-slate-600 border-slate-300"
              >
                ↺ Chọn lại
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Result Display */}
        <AnimatePresence>
          {showExplanation && selectedChoice && resultData[selectedChoice] && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`mb-16 p-8 rounded-2xl bg-gradient-to-br ${resultData[selectedChoice]!.color} text-white shadow-2xl`}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">{resultData[selectedChoice]!.icon}</div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold mb-3">{resultData[selectedChoice]!.title}</h4>
                  <p className="text-lg leading-relaxed font-semibold opacity-90">
                    {resultData[selectedChoice]!.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explanation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Zap className="h-8 w-8 text-purple-600" />
            Tại Sao Chỉ Cách Mạng Mới Thành Công?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cải cách */}
            <div className="p-6 bg-white rounded-xl border-2 border-red-300">
              <h4 className="font-bold text-red-700 text-lg mb-3">❌ Cải Cách</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>✗ Chỉ sửa chữa bề ngoài</li>
                <li>✗ Vấn đề gốc vẫn còn</li>
                <li>✗ Sớm hay muộn lại hỏng</li>
              </ul>
            </div>

            {/* Đảo chính */}
            <div className="p-6 bg-white rounded-xl border-2 border-yellow-300">
              <h4 className="font-bold text-yellow-700 text-lg mb-3">❌ Đảo Chính</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>✗ Đổi người, cơ cấu vẫn cũ</li>
                <li>✗ Quy chế lỗi thời không đổi</li>
                <li>✗ Vấn đề tái diễn lại</li>
              </ul>
            </div>

            {/* Cách Mạng */}
            <div className="p-6 bg-white rounded-xl border-2 border-green-300 shadow-lg">
              <h4 className="font-bold text-green-700 text-lg mb-3">✅ Cách Mạng</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>✓ Đập bỏ cũ, xây cái mới</li>
                <li>✓ Thay đổi toàn bộ cấu trúc</li>
                <li>✓ Thành công bền vững lâu dài</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl border-l-4 border-purple-600">
            <p className="text-slate-800 font-semibold leading-relaxed">
              <strong>💡 Kết luận:</strong> Cách mạng xã hội không chỉ là bạo lực hay lật đổ. Nó là thay đổi hoàn toàn hình thái
              kinh tế - xã hội từ gốc rễ. Giống như "Nâng cấp hệ điều hành", không phải chỉ xóa một file hay đổi giao diện.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SimulateRevolutionSection;
