import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface TheoryBlock {
  id: string;
  title: string;
  description: string;
  details: string;
  color: "primary" | "secondary" | "accent";
}

const theoryBlocks: TheoryBlock[] = [
  {
    id: "origin",
    title: "Nguồn gốc Nhà nước",
    description: "Sản phẩm của xã hội có giai cấp",
    details: "Nhà nước không phải là một lực lượng từ bên ngoài áp đặt vào xã hội, mà là sản phẩm của xã hội đã phát triển đến một giai đoạn nhất định. Nhà nước xuất hiện khi xã hội phân chia thành các giai cấp đối kháng.",
    color: "primary",
  },
  {
    id: "contradiction",
    title: "Mâu thuẫn giai cấp",
    description: "Không thể điều hòa",
    details: "Mâu thuẫn giữa các giai cấp là không thể điều hòa được. Giai cấp thống trị cần công cụ để duy trì sự thống trị, đó chính là Nhà nước - bộ máy bạo lực có tổ chức.",
    color: "secondary",
  },
  {
    id: "revolution",
    title: "Cách mạng xã hội",
    description: "Thay đổi về chất",
    details: "Cách mạng xã hội không chỉ là bạo lực, mà là sự thay đổi về chất của hình thái kinh tế - xã hội. Đó là bước nhảy vọt từ chế độ cũ sang chế độ mới tiến bộ hơn.",
    color: "accent",
  },
  {
    id: "state-type",
    title: "Bản chất Nhà nước",
    description: "Công cụ của giai cấp thống trị",
    details: "Nhà nước là công cụ chuyên chính của giai cấp thống trị. Bản chất giai cấp của nhà nước quyết định chức năng, nhiệm vụ và phương thức hoạt động của nhà nước.",
    color: "primary",
  },
];

const TheorySection = () => {
  const [selectedBlock, setSelectedBlock] = useState<TheoryBlock | null>(null);
  const [comparisonValue, setComparisonValue] = useState([50]);

  const getColorClass = (color: string, type: "bg" | "border" | "text") => {
    const colors = {
      primary: {
        bg: "bg-primary",
        border: "border-primary",
        text: "text-primary",
      },
      secondary: {
        bg: "bg-secondary",
        border: "border-secondary",
        text: "text-secondary-foreground",
      },
      accent: {
        bg: "bg-accent",
        border: "border-accent",
        text: "text-accent-foreground",
      },
    };
    return colors[color as keyof typeof colors]?.[type] || "";
  };

  return (
    <section className="min-h-screen py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Lý thuyết <span className="text-primary">Nhà nước</span> và <span className="text-secondary">Cách mạng</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click vào các khối để tìm hiểu chi tiết về nguồn gốc, bản chất và quy luật phát triển của Nhà nước
          </p>
        </motion.div>

        {/* Interactive Flowchart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {theoryBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setSelectedBlock(block)}
                className={`w-full p-6 rounded-xl border-2 ${getColorClass(block.color, "border")} bg-card hover-lift text-left transition-all duration-300 group`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-lg font-bold ${getColorClass(block.color, "text")} mb-2`}>
                      {block.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{block.description}</p>
                  </div>
                  <ChevronRight className={`h-5 w-5 ${getColorClass(block.color, "text")} group-hover:translate-x-1 transition-transform`} />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Flowchart connections - visible on larger screens */}
        <div className="hidden sm:block relative -mt-8 mb-16">
          <div className="flex justify-center">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              className="h-0.5 w-32 bg-gradient-to-r from-primary via-secondary to-accent"
            />
          </div>
        </div>

        {/* Comparison Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">So sánh bản chất Nhà nước</h3>
          </div>

          <div className="mb-8">
            <Slider
              value={comparisonValue}
              onValueChange={setComparisonValue}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Old State */}
            <motion.div
              animate={{ opacity: comparisonValue[0] <= 50 ? 1 : 0.5 }}
              className="p-4 rounded-xl bg-primary/10 border border-primary/30"
            >
              <h4 className="font-bold text-primary mb-2 text-sm sm:text-base">Nhà nước "Cai trị"</h4>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>• Bóc lột, đàn áp</li>
                <li>• Phục vụ thiểu số</li>
                <li>• Quan liêu, xa dân</li>
                <li>• Thủ tục phức tạp</li>
              </ul>
            </motion.div>

            {/* New State */}
            <motion.div
              animate={{ opacity: comparisonValue[0] > 50 ? 1 : 0.5 }}
              className="p-4 rounded-xl bg-success/10 border border-success/30"
            >
              <h4 className="font-bold text-success mb-2 text-sm sm:text-base">Nhà nước "Kiến tạo"</h4>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>• Phục vụ, hỗ trợ</li>
                <li>• Phục vụ đa số</li>
                <li>• Minh bạch, gần dân</li>
                <li>• Số hóa, tiện lợi</li>
              </ul>
            </motion.div>
          </div>

          <p className="text-center text-muted-foreground text-sm mt-4">
            Kéo thanh trượt để so sánh hai mô hình Nhà nước
          </p>
        </motion.div>
      </div>

      {/* Detail Modal */}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md bg-card rounded-2xl p-6 shadow-2xl border-2 ${getColorClass(selectedBlock.color, "border")}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xl font-bold ${getColorClass(selectedBlock.color, "text")}`}>
                  {selectedBlock.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedBlock(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-foreground leading-relaxed">{selectedBlock.details}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TheorySection;
