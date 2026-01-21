import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Lightbulb, Target, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RevolutionBlock {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  icon: typeof Lightbulb | typeof Target | typeof Flame | typeof Zap;
  gradient:  string;
  details: string[];
}

const revolutionBlocks: RevolutionBlock[] = [
  {
    id: "concept",
    title: "Cách mạng xã hội là gì?",
    subtitle: "Bước nhảy vọt về chất",
    content: "Là một 'bước nhảy vọt' về chất. Nó thay thế hình thái kinh tế - xã hội cũ bằng cái mới cao hơn.",
    icon: Lightbulb,
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
    details: [
      "Thay đổi toàn diện cấu trúc xã hội",
      "Khác với 'Cải cách' - chỉ sửa chữa nhỏ lẻ",
      "Khác với 'Đảo chính' - chỉ thay người lãnh đạo",
      "Tạo ra hình thái kinh tế - xã hội mới cao hơn"
    ]
  },
  {
    id: "cause",
    title: "Nguồn gốc của 'Cơn bão' Cách mạng",
    subtitle: "Mâu thuẫn không thể hòa giải",
    content: "Do mâu thuẫn giữa Lực lượng sản xuất (phát triển nhanh) và Quan hệ sản xuất (lỗi thời, kìm hãm).",
    icon: Zap,
    gradient: "from-orange-500 via-red-500 to-rose-500",
    details: [
      "Lực lượng sản xuất phát triển không ngừng",
      "Quan hệ sản xuất cũ kìm hãm sự phát triển",
      "Giống như thân thể lớn nhưng áo quá chật",
      "Mâu thuẫn tích tụ đến điểm bùng nổ"
    ]
  },
  {
    id: "objective",
    title: "Chiếc chìa khóa quyền lực",
    subtitle: "Vấn đề cơ bản",
    content: "Vấn đề cơ bản của mọi cuộc cách mạng xã hội là GIÀNH CHÍNH QUYỀN NHÀ NƯỚC.",
    icon: Target,
    gradient: "from-red-500 via-pink-500 to-purple-500",
    details: [
      "Chính quyền là công cụ thống trị của giai cấp",
      "Không giành chính quyền = cách mạng chưa thành",
      "Phải đập tan bộ máy nhà nước cũ",
      "Xây dựng chính quyền mới của giai cấp cách mạng"
    ]
  },
  {
    id: "method",
    title: "Con đường Cách mạng",
    subtitle: "Phương pháp thực hiện",
    content: "Cách mạng có thể diễn ra theo hai con đường:  bạo lực hoặc hòa bình.",
    icon: Flame,
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
    details: [
      "Cách mạng bạo lực: Hình thức phổ biến",
      "Dùng sức mạnh vũ lực đập tan bộ máy cũ",
      "Cách mạng hòa bình: Hình thức quý hiếm",
      "Giành chính quyền qua đấu tranh nghị trường"
    ]
  }
];

const RevolutionSection = () => {
  const [selectedBlock, setSelectedBlock] = useState<RevolutionBlock | null>(null);
  const [comparisonSlider, setComparisonSlider] = useState(50);
  const [showRevolution, setShowRevolution] = useState(false);

  return (
    <section className="min-h-screen py-16 px-4 bg-background relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Sparkles className="h-8 w-8 text-orange-500" />
            <h2 
              className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-pink-600"
              style={{ fontSize: "2.75rem", lineHeight: 2 }}
            >
              Cách Mạng Xã Hội
            </h2>
            <Sparkles className="h-8 w-8 text-pink-500" />
          </motion.div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bước nhảy vọt lớn lao thay đổi toàn bộ cấu tr��c xã hội
          </p>
        </motion.div>

        {/* Information Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {revolutionBlocks.map((block, index) => {
            const IconComponent = block.icon;
            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setSelectedBlock(block)}
                  className="w-full p-6 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover-lift text-left transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${block.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${block.gradient} shadow-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground flex-1">{block.title}</h3>
                    </div>
                    <p className={`text-sm font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${block.gradient}`}>
                      {block.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{block.content}</p>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Interactive Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y:  0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Zap className="h-6 w-6 text-orange-500" />
              <h3 className="text-2xl md:text-3xl font-black text-foreground text-center">
                Trước & Sau Cách Mạng
              </h3>
            </div>

            {/* Comparison Visual */}
            <div className="relative mb-8 h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-border">
              {/* Before State (Left) */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 flex flex-col items-center justify-center text-center p-6"
                style={{ width: `${100 - comparisonSlider}%` }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-4"
                >
                  <Flame className="h-12 md:h-16 w-12 md:w-16 text-orange-400/70 mx-auto" />
                </motion.div>
                <h4 className="text-xl md:text-2xl font-black text-orange-300 mb-3">Trước Cách Mạng</h4>
                <div className="space-y-2 text-xs md:text-sm text-slate-200">
                  <p>🔗 Quan hệ sản xuất lỗi thời</p>
                  <p>⚔️ Mâu thuẫn gay gắt</p>
                  <p>👑 Giai cấp thống trị áp bức</p>
                  <p>📉 Kìm hãm phát triển</p>
                </div>
              </motion.div>

              {/* After State (Right) */}
              <motion.div
                className="absolute right-0 inset-y-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 flex flex-col items-center justify-center text-center p-6"
                style={{ width:  `${comparisonSlider}%` }}
              >
                <motion. div
                  animate={{ y:  [0, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                  className="mb-4"
                >
                  <Lightbulb className="h-12 md:h-16 w-12 md:w-16 text-yellow-200 mx-auto" />
                </motion.div>
                <h4 className="text-xl md:text-2xl font-black text-cyan-100 mb-3">Sau Cách Mạng</h4>
                <div className="space-y-2 text-xs md:text-sm text-cyan-50">
                  <p>🚀 Quan hệ sản xuất mới</p>
                  <p>✨ Hòa hợp xã hội</p>
                  <p>👥 Giai cấp cách mạng lãnh đạo</p>
                  <p>📈 Phát triển vượt bậc</p>
                </div>
              </motion.div>

              {/* Dynamic Divider */}
              <motion. div
                className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white to-transparent shadow-lg"
                style={{ left: `${comparisonSlider}%` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration:  2, repeat: Infinity }}
              />
            </div>

            {/* Slider Control */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-orange-500 whitespace-nowrap">Trước CM</span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={comparisonSlider}
                    onChange={(e) => setComparisonSlider(Number(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-orange-500 to-cyan-500"
                    style={{
                      background: `linear-gradient(to right, rgb(249, 115, 22) 0%, rgb(249, 115, 22) ${comparisonSlider}%, rgb(6, 182, 212) ${comparisonSlider}%, rgb(6, 182, 212) 100%)`
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-cyan-500 whitespace-nowrap">Sau CM</span>
              </div>

             
             
            </div>
          </div>

      
        </motion.div>
      </div>

      {/* Enhanced Detail Modal */}
      <AnimatePresence>
        {selectedBlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
            onClick={() => setSelectedBlock(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale:  0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-card rounded-3xl shadow-2xl border-2 border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Gradient */}
              <div className={`relative p-6 bg-gradient-to-br ${selectedBlock.gradient}`}>
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    {(() => {
                      const IconComponent = selectedBlock.icon;
                      return <IconComponent className="h-10 w-10 text-white flex-shrink-0" />;
                    })()}
                    <div>
                      <h3 className="text-2xl md: text-3xl font-black text-white mb-1">{selectedBlock.title}</h3>
                      <p className="text-white/90 font-semibold text-base md:text-lg">{selectedBlock.subtitle}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedBlock(null)}
                    className="text-white hover:bg-white/20 flex-shrink-0"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-foreground text-base md:text-lg leading-relaxed mb-6">
                  {selectedBlock.content}
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Các điểm chính: 
                  </h4>
                  {selectedBlock.details.map((detail, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={`mt-1 w-2 h-2 rounded-full bg-gradient-to-br ${selectedBlock.gradient} flex-shrink-0`} />
                      <p className="text-sm text-foreground">{detail}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RevolutionSection;