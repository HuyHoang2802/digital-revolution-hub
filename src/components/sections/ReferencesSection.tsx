import { motion } from "framer-motion";
import { BookOpen, ExternalLink, FileText, Building2 } from "lucide-react";

interface Reference {
  title: string;
  source: string;
  url?: string;
  icon: React.ReactNode;
}

const references: Reference[] = [
  {
    title: "Giáo trình Chủ nghĩa xã hội khoa học",
    source: "Bộ Giáo dục và Đào tạo",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Văn kiện Đại hội Đảng lần thứ XIII",
    source: "Đảng Cộng sản Việt Nam",
    url: "https://tulieuvankien.dangcongsan.vn/",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Cổng Dịch vụ công Quốc gia",
    source: "Chính phủ Việt Nam",
    url: "https://dichvucong.gov.vn/",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "VNeID - Ứng dụng Định danh điện tử",
    source: "Bộ Công an",
    url: "https://vneid.gov.vn/",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Chiến lược Chuyển đổi số Quốc gia",
    source: "Bộ Thông tin và Truyền thông",
    url: "https://dx.mic.gov.vn/",
    icon: <FileText className="h-5 w-5" />,
  },
];

const ReferencesSection = () => {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground mb-4">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Nguồn tham khảo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            Tài liệu <span className="text-primary">chính thống</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {references.map((ref, index) => (
            <motion.div
              key={ref.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {ref.url ? (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {ref.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{ref.title}</h3>
                    <p className="text-sm text-muted-foreground">{ref.source}</p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                </a>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    {ref.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{ref.title}</h3>
                    <p className="text-sm text-muted-foreground">{ref.source}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-border text-center"
        >
          <p className="text-muted-foreground text-sm">
            Bài thuyết trình được xây dựng với sự hỗ trợ của công nghệ AI
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Nội dung đã được xác minh và biên tập bởi sinh viên
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ReferencesSection;
