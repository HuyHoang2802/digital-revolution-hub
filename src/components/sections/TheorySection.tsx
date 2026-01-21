import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Ship, Scale, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RelationshipWindow {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Ship | typeof Scale | typeof Puzzle;
  gradient: string;
  examples: string[];
  caption: string;
}



const relationshipWindows: RelationshipWindow[] = [
  {
    id: "nation-class",
    title: "Dân tộc & Giai cấp",
    subtitle: "Ai cầm lái, tàu đi hướng đó",
    description: "Giai cấp quyết định Dân tộc:  Trong xã hội có giai cấp, vấn đề dân tộc luôn mang tính giai cấp. Giai cấp nào nắm quyền lãnh đạo sẽ quyết định xu hướng phát triển của dân tộc đó.",
    icon: Ship,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    caption: "Ai cầm lái, tàu đi hướng đó.",
    examples: [
      "Giai cấp tư sản lãnh đạo → Dân tộc theo Tư bản chủ nghĩa",
      "Giai cấp công nhân lãnh đạo → Dân tộc đi lên Chủ nghĩa xã hội",
      "Đấu tranh giai cấp diễn ra trong phạm vi dân tộc cụ thể",
      "Giải phóng giai cấp là tiền đề giải phóng dân tộc hoàn toàn"
    ]
  },
  {
    id: "class-humanity",
    title: "Giai cấp & Nhân loại",
    subtitle:  "Giải phóng mình để cứu nhân loại",
    description:  "Lợi ích của giai cấp công nhân thống nhất với lợi ích nhân loại. Muốn tự giải phóng mình thì buộc phải giải phóng toàn xã hội khỏi chế độ bóc lột.",
    icon: Scale,
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    caption: "Giai cấp vô sản: Giải phóng mình để cứu nhân loại.",
    examples: [
      "Giai cấp bóc lột:  Lợi ích đối lập với nhân loại",
      "Giai cấp công nhân:  Lợi ích thống nhất với nhân loại",
      "Xây dựng xã hội Cộng sản - không còn giai cấp",
      "Trả lại bản chất tốt đẹp cho nhân loại"
    ]
  },
  {
    id: "nation-humanity",
    title: "Dân tộc & Nhân loại",
    subtitle: "Mảnh ghép tạo nên bức tranh",
    description: "Dân tộc là một bộ phận của nhân loại.  Sự phát triển của mỗi dân tộc đóng góp vào văn minh chung.  Hòa nhập không có nghĩa là hòa tan - phải giữ gìn bản sắc riêng.",
    icon: Puzzle,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    caption: "Mỗi dân tộc là một mảnh ghép màu sắc tạo nên bức tranh nhân loại.",
    examples: [
      "Dân tộc là bộ phận của nhân loại",
      "Toàn cầu hóa:  Các vấn đề cần chung tay giải quyết",
      "Giữ gìn bản sắc văn hóa riêng",
      "Làm phong phú thêm cho văn minh nhân loại"
    ]
  }
];

const TheorySection = () => {
  const [selectedRelationship, setSelectedRelationship] = useState<RelationshipWindow | null>(null);

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
        text:  "text-secondary-foreground",
      },
      accent: {
        bg: "bg-accent",
        border:  "border-accent",
        text: "text-accent-foreground",
      },
    };
    return colors[color as keyof typeof colors]?.[type] || "";
  };

  return (
    <section className="min-h-screen py-12 sm:py-16 px-3 sm:px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4 sm:mb-6"
            style={{ lineHeight: 1.3, letterSpacing: "-0.01em" }}
          >
            Quan hệ giai cấp – dân tộc - nhân loại
          </h2>
        </motion.div>

        {/* Three Interactive Relationship Windows */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-foreground">
            Ba mối quan hệ cốt lõi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {relationshipWindows.map((window, index) => {
              const IconComponent = window.icon;
              return (
                <motion.div
                  key={window.id}
                  initial={{ opacity:  0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <button
                    onClick={() => setSelectedRelationship(window)}
                    className="w-full h-full p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover-lift text-left transition-all duration-300 group relative overflow-hidden active:scale-95 sm:active:scale-100"
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${window.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${window.gradient} shadow-lg flex-shrink-0`}>
                          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                      </div>
                      
                      <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">
                        {window.title}
                      </h4>
                      
                      <p className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r ${window.gradient}`}>
                        {window.subtitle}
                      </p>
                      
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                        {window.description}
                      </p>
                      
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
                        <p className="text-[10px] sm:text-xs italic text-muted-foreground line-clamp-2">
                          &quot;{window.caption}&quot;
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Flowchart connections - visible on larger screens */}
        <div className="hidden sm:block relative -mt-8 mb-16">
          <div className="flex justify-center">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX:  1 }}
              viewport={{ once: true }}
              className="h-0.5 w-32 bg-gradient-to-r from-primary via-secondary to-accent"
            />
          </div>
        </div>
      </div>

      {/* Detail Modal for Relationship Windows */}
      <AnimatePresence>
        {selectedRelationship && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
            onClick={() => setSelectedRelationship(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity:  1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl border-2 border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Gradient */}
              <div className={`relative p-6 bg-gradient-to-br ${selectedRelationship.gradient}`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {(() => {
                        const IconComponent = selectedRelationship.icon;
                        return <IconComponent className="h-8 w-8 text-white" />;
                      })()}
                      <h3 className="text-2xl font-bold text-white">
                        {selectedRelationship.title}
                      </h3>
                    </div>
                    <p className="text-white/90 font-semibold text-lg">
                      {selectedRelationship.subtitle}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedRelationship(null)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-foreground leading-relaxed mb-6">
                  {selectedRelationship.description}
                </p>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Các điểm chính: </h4>
                  {selectedRelationship.examples.map((example, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity:  0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className={`mt-1 w-2 h-2 rounded-full bg-gradient-to-br ${selectedRelationship.gradient} flex-shrink-0`} />
                      <p className="text-sm text-foreground">{example}</p>
                    </motion.div>
                  ))}
                </div>

                <div className={`p-4 rounded-xl bg-muted/50 border-l-4 border-primary`}>
                  <p className="text-sm italic text-muted-foreground text-center">
                    {selectedRelationship.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion. div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TheorySection;