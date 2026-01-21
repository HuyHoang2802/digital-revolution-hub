import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStart: () => void;
  liveCount: number;
}

const HeroSection = ({ onStart, liveCount }: HeroSectionProps) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full bg-secondary/10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              delay: i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-2">
        {/* Live counter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-xs sm:text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground flex-shrink-0" />
            <span className="text-primary-foreground font-medium whitespace-nowrap">{liveCount} người xem</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-white drop-shadow-lg mb-4 sm:mb-6"
          style={{ lineHeight: "1.2", letterSpacing: "-0.02em", textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
        >
          Sứ mệnh Giai cấp & Bước nhảy Cách mạng
        </motion.h1>


        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-block p-3 sm:p-4 bg-primary-foreground rounded-2xl shadow-2xl animate-pulse-glow">
            <QRCodeSVG
              value={currentUrl}
              size={window.innerWidth < 640 ? 120 : 180}
              bgColor="hsl(0, 0%, 100%)"
              fgColor="hsl(0, 72%, 45%)"
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-primary-foreground/80 mt-2 sm:mt-3 text-xs sm:text-sm">
            Quét mã QR để truy cập trên điện thoại
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
          >
            Bắt đầu trải nghiệm
            <ChevronDown className="ml-2 h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary-foreground/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
