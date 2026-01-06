import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, FileText, Fingerprint, Clock, Shield, Zap } from "lucide-react";

interface FlipCard {
  id: string;
  frontTitle: string;
  frontDescription: string;
  frontIcon: React.ReactNode;
  backTitle: string;
  backDescription: string;
  backIcon: React.ReactNode;
}

const flipCards: FlipCard[] = [
  {
    id: "identity",
    frontTitle: "CMND/CCCD Giấy",
    frontDescription: "Mang theo nhiều giấy tờ, dễ mất, hư hỏng, phải đến trực tiếp cơ quan để làm thủ tục",
    frontIcon: <FileText className="h-10 w-10" />,
    backTitle: "VNeID - Định danh số",
    backDescription: "Một ứng dụng thay thế tất cả, xác thực trực tuyến, bảo mật sinh trắc học, tiện lợi mọi lúc mọi nơi",
    backIcon: <Fingerprint className="h-10 w-10" />,
  },
  {
    id: "procedure",
    frontTitle: "Thủ tục hành chính cũ",
    frontDescription: "Xếp hàng dài, giấy tờ phức tạp, thời gian xử lý kéo dài từ tuần đến tháng",
    frontIcon: <Clock className="h-10 w-10" />,
    backTitle: "Dịch vụ công trực tuyến",
    backDescription: "Nộp hồ sơ online 24/7, theo dõi tiến độ real-time, nhận kết quả tại nhà",
    backIcon: <Zap className="h-10 w-10" />,
  },
  {
    id: "security",
    frontTitle: "Bảo mật truyền thống",
    frontDescription: "Dễ bị giả mạo, khó xác minh, phụ thuộc vào con người kiểm tra",
    frontIcon: <FileText className="h-10 w-10" />,
    backTitle: "Bảo mật công nghệ cao",
    backDescription: "Mã hóa dữ liệu, xác thực đa lớp, nhận diện khuôn mặt và vân tay",
    backIcon: <Shield className="h-10 w-10" />,
  },
];

const CaseStudySection = () => {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className="min-h-screen py-16 px-4 bg-muted">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Smartphone className="h-5 w-5" />
            <span className="font-medium">Case Study</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            VNeID & <span className="text-primary">Chính phủ số</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cách mạng xã hội không chỉ là bạo lực, mà là <strong>sự thay đổi về chất</strong>. 
            Công nghệ là động lực thúc đẩy thay đổi thượng tầng kiến trúc.
          </p>
        </motion.div>

        {/* Flip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {flipCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="flip-card h-80 cursor-pointer"
              onClick={() => toggleCard(card.id)}
            >
              <div className={`flip-card-inner relative w-full h-full ${flippedCards.has(card.id) ? "flipped" : ""}`}
                style={{ transformStyle: "preserve-3d", transition: "transform 0.6s" }}
              >
                {/* Front */}
                <div 
                  className="flip-card-front absolute inset-0 p-6 rounded-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center text-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="mb-4 p-3 rounded-full bg-primary-foreground/20">
                    {card.frontIcon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.frontTitle}</h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed">
                    {card.frontDescription}
                  </p>
                  <p className="mt-4 text-xs text-primary-foreground/60">
                    👆 Chạm để lật
                  </p>
                </div>

                {/* Back */}
                <div 
                  className="flip-card-back absolute inset-0 p-6 rounded-2xl bg-success text-success-foreground flex flex-col items-center justify-center text-center"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="mb-4 p-3 rounded-full bg-success-foreground/20">
                    {card.backIcon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.backTitle}</h3>
                  <p className="text-success-foreground/90 text-sm leading-relaxed">
                    {card.backDescription}
                  </p>
                  <p className="mt-4 text-xs text-success-foreground/60">
                    👆 Chạm để quay lại
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-6 md:p-8 text-center"
        >
          <h3 className="text-xl font-bold text-foreground mb-4">
            🎯 Ý nghĩa lý luận
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            VNeID và Chính phủ điện tử là minh chứng cho thấy: <strong className="text-primary">Cách mạng công nghệ</strong> đang thúc đẩy 
            sự thay đổi căn bản trong quan hệ giữa <strong className="text-secondary">Nhà nước và Công dân</strong>. 
            Từ mô hình "cai trị" sang mô hình "phục vụ" - đó chính là bản chất của Nhà nước kiến tạo.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudySection;
