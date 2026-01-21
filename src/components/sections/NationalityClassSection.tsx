import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Zap, Sparkles, Star } from "lucide-react";

interface MetaphorCard {
  id: string;
  title: string;
  description: string;
  color: "primary" | "secondary" | "accent" | "destructive" | "success";
}

const metaphorCards: MetaphorCard[] = [
  {
    id: "bus",
    title: "Dân tộc",
    description: "Chiếc xe bus - Phương tiện để toàn bộ xã hội di chuyển",
    color:  "primary",
  },
  {
    id: "driver",
    title: "Giai cấp thống trị",
    description: "Người lái xe - Quyết định hướng đi của toàn bộ dân tộc",
    color:  "secondary",
  },
];

const scenarios = [
  {
    title: "Xe hỏng (Dân tộc suy vong)",
    driver: "Tài xế",
    consequence: "Tài xế cũng chết",
    color: "destructive",
    icon: <AlertTriangle className="h-6 w-6" />,
    description: 
      "Nếu dân tộc suy vong, giai cấp thống trị cũng không thể tồn tại.  Đó là sự liên kết sinh tử.",
  },
  {
    title: "Tài xế tồi (Giai cấp phản động)",
    driver: "Giai cấp phản động",
    consequence: "Xe lao xuống vực",
    color: "destructive",
    icon: <AlertTriangle className="h-6 w-6" />,
    description:
      "Một giai cấp thống trị tồi sẽ đẩy dân tộc vào khủng hoảng. Cách mạng sẽ bùng nổ.",
  },
  {
    title: "Tài xế tốt (Giai cấp tiên phong)",
    driver: "Đảng Cộng sản - Đội tiên phong giai cấp công nhân",
    consequence: "Xe chạy đúng hướng",
    color: "success",
    icon: <CheckCircle className="h-6 w-6" />,
    description:
      'Một giai cấp tiên phong sẽ dẫn dắt dân tộc đi theo con đường tiến bộ vì mục tiêu "Dân giàu, nước mạnh".',
  },
];

const vietnamContext = {
  vehicle: "Dân tộc Việt Nam",
  passengers: [
    "Giai cấp công nhân",
    "Nông dân",
    "Trí thức",
    "Tiểu tư sản",
    "Các dân tộc thiểu số",
  ],
  driver: "Đảng Cộng sản Việt Nam",
  driverRole: "Đội tiên phong của giai cấp công nhân",
  direction: "Con đường Xã hội chủ nghĩa",
  goal: "Dân giàu, nước mạnh",
  achievements: [
    "Độc lập dân tộc (1945)",
    "Thống nhất đất nước (1975)",
    "Công nghiệp hóa hiện đại hóa",
    "Chuyển đổi số",
    "Tham gia cộng đồng quốc tế",
  ],
};

// Animated Bus SVG - Fixed wheel for broken variant
const AnimatedBus = ({ variant = "normal" }: { variant?:  "normal" | "broken" | "crash" }) => {
  const getBusColor = () => {
    switch (variant) {
      case "broken":
        return "#ef4444";
      case "crash":
        return "#dc2626";
      default:
        return "#c9302c";
    }
  };

  // Tính toán vị trí xe dựa trên variant
  const busX = variant === "normal" ? 80 : 100;
  const wheel1X = busX + 30;
  const wheel2X = busX + 125;

  return (
    <svg viewBox="0 0 300 200" className="w-full h-auto drop-shadow-lg" style={{ maxHeight: "300px" }}>
      {/* Road */}
      <line x1="0" y1="120" x2="300" y2="120" stroke="#9ca3af" strokeWidth="3" strokeDasharray="12,8" />
      
      {/* Road markers */}
      <motion.line 
        x1={0} 
        y1={125} 
        x2={300} 
        y2={125} 
        stroke="#d1d5db" 
        strokeWidth={1}
        strokeDasharray="20,15"
        animate={{ strokeDashoffset: [0, -35] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="2" dy="4" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Bus group - everything moves together */}
      <g>
        {/* Bus body */}
        <rect
          x={busX}
          y="75"
          width="145"
          height="65"
          fill={getBusColor()}
          rx="10"
          opacity={variant === "crash" ? "0.6" : "1"}
          filter="url(#shadow)"
        />

        {/* Bus top */}
        <rect
          x={busX + 5}
          y="70"
          width="50"
          height="10"
          fill={getBusColor()}
          rx="5"
          opacity="0.9"
          filter="url(#shadow)"
        />

        {/* Bus windows with reflection */}
        {[0, 1, 2].map((i) => (
          <g key={`window-${i}`}>
            <rect
              x={busX + 20 + i * 35}
              y="85"
              width="28"
              height="25"
              fill="#e0f2fe"
              rx="3"
              opacity={variant === "broken" ? "0.3" : "0.9"}
            />
            <rect
              x={busX + 20 + i * 35}
              y="85"
              width="28"
              height="8"
              fill="#ffffff"
              rx="3"
              opacity="0.5"
            />
          </g>
        ))}

        {/* Driver window */}
        <rect x={busX - 5} y="82" width="22" height="28" fill="#e0f2fe" rx="3" />
        <rect x={busX - 5} y="82" width="22" height="9" fill="#ffffff" rx="3" opacity="0.5" />

        {/* Headlights */}
        <circle cx={busX + 150} cy="135" r="4" fill="#fef08a" opacity="0.8" />
        <circle cx={busX + 150} cy="125" r="3" fill="#fbbf24" />

        {/* Wheel 1 (Front wheel) - Always visible */}
        <g>
          <circle cx={wheel1X} cy="145" r="13" fill="#1f2937" filter="url(#shadow)" />
          <circle cx={wheel1X} cy="145" r="8" fill="#374151" />
          <g>
            <circle cx={wheel1X} cy="145" r="4" fill="#6b7280" />
            <line x1={wheel1X} y1="145" x2={wheel1X} y2="137" stroke="#9ca3af" strokeWidth="2" />
            {variant === "normal" && (
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from={`0 ${wheel1X} 145`}
                to={`360 ${wheel1X} 145`}
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </g>
        </g>

        {/* Wheel 2 (Back wheel) - Hidden when broken */}
        {variant !== "broken" && (
          <g>
            <circle cx={wheel2X} cy="145" r="13" fill="#1f2937" filter="url(#shadow)" />
            <circle cx={wheel2X} cy="145" r="8" fill="#374151" />
            <g>
              <circle cx={wheel2X} cy="145" r="4" fill="#6b7280" />
              <line x1={wheel2X} y1="145" x2={wheel2X} y2="137" stroke="#9ca3af" strokeWidth="2" />
              {variant === "normal" && (
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from={`0 ${wheel2X} 145`}
                  to={`360 ${wheel2X} 145`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </g>
          </g>
        )}

        {/* Driver */}
        <circle cx={busX + 5} cy="95" r="7" fill="#fdbcb4" />
        <rect x={busX + 2} y="100" width="6" height="8" fill="#3b82f6" rx="2" />

        {/* Smoke effect (if broken) */}
        {variant === "broken" && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={`smoke-${i}`}
                cx={busX + 80 + i * 15}
                cy={70 - i * 5}
                r={8 - i}
                fill="#9ca3af"
                opacity="0.6"
                animate={{ y: [0, -20], opacity: [0.6, 0], scale: [1, 1.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </>
        )}

        {/* Crash effect */}
        {variant === "crash" && (
          <>
            <motion.g
              animate={{ rotate: [0, -20, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <path
                d={`M ${busX - 20} 140 L ${busX - 40} 160 L ${busX - 30} 145 L ${busX - 45} 155`}
                stroke="#ef4444"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </motion.g>
            {[0, 1, 2, 3].map((i) => (
              <motion.circle
                key={`crash-particle-${i}`}
                cx={busX + i * 10}
                cy={140 + i * 5}
                r={3}
                fill="#fbbf24"
                animate={{ 
                  x: [0, -10 - i * 5], 
                  y: [0, -15 + i * 3], 
                  opacity: [1, 0] 
                }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </>
        )}

        {/* Falling wheel for broken variant - FIXED:  Starts from wheel2X position */}
        {variant === "broken" && (
          <motion.g
            animate={{ 
              x: [0, 30, 60],
              y: [0, 15, 25],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <circle cx={wheel2X} cy="145" r="13" fill="#1f2937" opacity="0.7" filter="url(#shadow)" />
            <circle cx={wheel2X} cy="145" r="8" fill="#374151" opacity="0.7" />
            <circle cx={wheel2X} cy="145" r="4" fill="#6b7280" opacity="0.7" />
            <line x1={wheel2X} y1="145" x2={wheel2X} y2="137" stroke="#9ca3af" strokeWidth="2" opacity="0.7" />
          </motion.g>
        )}
      </g>
    </svg>
  );
};

// Dialectical relationship visualization - Enhanced
const DialecticalVisualization = () => {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-auto" style={{ maxHeight: "240px" }}>
      {/* Animated background circles */}
      <motion.circle
        cx="100"
        cy="80"
        r="60"
        fill="#fef3c7"
        opacity="0.3"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat:  Infinity }}
      />
      <motion.circle
        cx="300"
        cy="80"
        r="60"
        fill="#fce7f3"
        opacity="0.3"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat:  Infinity, delay: 0.5 }}
      />

      {/* Bus symbol */}
      <circle cx="100" cy="80" r="45" fill="#fef3c7" stroke="#f59e0b" strokeWidth="3" />
      <text x="100" y="90" textAnchor="middle" fontSize="32">
        🚌
      </text>
      <text x="100" y="140" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#1f2937">
        Dân tộc
      </text>

      {/* Driver symbol */}
      <circle cx="300" cy="80" r="45" fill="#fce7f3" stroke="#ec4899" strokeWidth="3" />
      <text x="300" y="90" textAnchor="middle" fontSize="32">
        👨‍💼
      </text>
      <text x="300" y="140" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#1f2937">
        Giai cấp
      </text>

      {/* Connection arrows - Enhanced */}
      <defs>
        <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#6366f1" />
        </marker>
        <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Animated connection line */}
      <motion.path
        d="M 145 70 Q 200 50, 255 70"
        stroke="url(#arrowGradient)"
        strokeWidth="4"
        fill="none"
        strokeDasharray="8,4"
        animate={{ strokeDashoffset: [0, -12] }}
        transition={{ duration:  1.5, repeat: Infinity }}
      />
      <motion.path
        d="M 255 90 Q 200 110, 145 90"
        stroke="url(#arrowGradient)"
        strokeWidth="4"
        fill="none"
        strokeDasharray="8,4"
        animate={{ strokeDashoffset: [12, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Relationship text */}
      <motion.g
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <rect x="140" y="40" width="120" height="30" fill="#6366f1" rx="15" opacity="0.9" />
        <text x="200" y="60" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">
          ⚔️ LIÊN KẾT SINH TỬ
        </text>
      </motion.g>

      {/* Bottom:  Consequence boxes - Enhanced */}
      

      
    </svg>
  );
};

// Scenario visualization
const ScenarioVisual = ({ scenarioIndex }: { scenarioIndex: number }) => {
  const getScenario = () => {
    switch (scenarioIndex) {
      case 0:
        return "broken";
      case 1:
        return "crash";
      default:
        return "normal";
    }
  };

  return <AnimatedBus variant={getScenario() as "normal" | "broken" | "crash"} />;
};

// Journey map - Enhanced
const VietnamJourneyMap = () => {
  return (
    <svg viewBox="0 0 400 360" className="w-full h-auto" style={{ maxHeight: "360px" }}>
      {/* Road path with gradient */}
      <defs>
        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="33%" stopColor="#f59e0b" />
          <stop offset="66%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background glow */}
      <motion.path
        d="M 50 50 Q 150 100, 200 180 T 350 310"
        stroke="url(#roadGradient)"
        strokeWidth="50"
        fill="none"
        opacity="0.15"
        filter="url(#glow)"
      />

      {/* Main road */}
      <path
        d="M 50 50 Q 150 100, 200 180 T 350 310"
        stroke="url(#roadGradient)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />

      {/* Animated dashed line */}
      <motion.path
        d="M 50 50 Q 150 100, 200 180 T 350 310"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
        strokeDasharray="8,8"
        strokeLinecap="round"
        animate={{ strokeDashoffset: [0, -16] }}
        transition={{ duration:  2, repeat: Infinity, ease: "linear" }}
      />

      {/* Milestone markers - Enhanced */}
      <g>
        {/* Start - 1945 */}
        <motion.circle 
          cx="50" 
          cy="50" 
          r="25" 
          fill="#dc2626"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        />
        <circle cx="50" cy="50" r="20" fill="#dc2626" stroke="#ffffff" strokeWidth="3" />
        <text x="50" y="58" textAnchor="middle" fontSize="28">
          🚩
        </text>
        <rect x="15" y="75" width="70" height="35" fill="#ffffff" rx="8" opacity="0.95" />
        <text x="50" y="90" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#dc2626">
          1945
        </text>
        <text x="50" y="105" textAnchor="middle" fontSize="10" fill="#6b7280">
          Độc lập
        </text>
      </g>

      <g>
        {/* Second milestone - 1975 */}
        <motion.circle 
          cx="150" 
          cy="115" 
          r="25" 
          fill="#f59e0b"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <circle cx="150" cy="115" r="20" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
        <text x="150" y="123" textAnchor="middle" fontSize="28">
          ⚔️
        </text>
        <rect x="115" y="140" width="70" height="35" fill="#ffffff" rx="8" opacity="0.95" />
        <text x="150" y="155" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f59e0b">
          1975
        </text>
        <text x="150" y="170" textAnchor="middle" fontSize="10" fill="#6b7280">
          Thống nhất
        </text>
      </g>

      <g>
        {/* Third milestone - 1986+ */}
        <motion.circle 
          cx="220" 
          cy="195" 
          r="25" 
          fill="#10b981"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <circle cx="220" cy="195" r="20" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
        <text x="220" y="203" textAnchor="middle" fontSize="28">
          🏭
        </text>
        <rect x="175" y="220" width="90" height="35" fill="#ffffff" rx="8" opacity="0.95" />
        <text x="220" y="235" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#10b981">
          1986+
        </text>
        <text x="220" y="250" textAnchor="middle" fontSize="10" fill="#6b7280">
          Công nghiệp hóa
        </text>
      </g>

      <g>
        {/* Current milestone - 2020+ */}
        <motion. circle 
          cx="310" 
          cy="280" 
          r="25" 
          fill="#0891b2"
          animate={{ scale:  [1, 1.15, 1] }}
          transition={{ duration: 2, repeat:  Infinity, delay: 1.5 }}
        />
        <circle cx="310" cy="280" r="20" fill="#0891b2" stroke="#ffffff" strokeWidth="3" />
        <text x="310" y="288" textAnchor="middle" fontSize="28">
          💻
        </text>
        <rect x="260" y="305" width="100" height="35" fill="#ffffff" rx="8" opacity="0.95" />
        <text x="310" y="320" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0891b2">
          2020+
        </text>
        <text x="310" y="335" textAnchor="middle" fontSize="10" fill="#6b7280">
          Chuyển đổi số
        </text>
      </g>

      {/* Animated bus traveling */}
      <motion.g
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <animateMotion
          dur="10s"
          repeatCount="indefinite"
          path="M 50 50 Q 150 100, 200 180 T 350 310"
        >
          <mpath href="#motionPath" />
        </animateMotion>
        <circle r="18" fill="#c9302c" opacity="0.9" />
        <text textAnchor="middle" y="8" fontSize="28" filter="url(#glow)">
          🚌
        </text>
      </motion.g>

      {/* Goal section - Enhanced */}
   
      <text x="320" y="345" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#059669">
        🎯 Mục tiêu:  Dân giàu, nước mạnh
      </text>
    </svg>
  );
};

const NationalityClassSection = () => {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="min-h-screen py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-72 h-32 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-20 sm:top-40 right-5 sm:right-10 w-32 sm:w-72 h-32 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y:  [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-5 sm:-bottom-10 left-1/2 w-32 sm:w-72 h-32 sm:h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y:  [0, -80, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div 
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once:  true }}
      >
        {/* Section Title - Enhanced */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-3 sm:mb-6 shadow-lg text-xs sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="text-2xl sm:text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚌
            </motion.span>
            <span className="font-bold tracking-wide">Metaphor Giáo dục</span>
            <Sparkles className="h-3 w-3 sm:h-5 sm:w-5 flex-shrink-0" />
          </motion.div>
          
          <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-3 sm:mb-6 leading-tight">
            Dân tộc & Giai cấp
            <br />
            <span className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-black">Chiếc Xe Bus</span>
          </h2>
          
          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Hiểu rõ mối quan hệ <strong className="font-bold text-indigo-600">biện chứng</strong> giữa dân tộc và giai cấp qua một metaphor sinh động
          </p>
        </motion.div>

        {/* Main Metaphor Cards - Enhanced */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16"
          variants={containerVariants}
        >
          {metaphorCards.map((card, index) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 60px -15px rgba(0, 0, 0, 0.3)"
              }}
              className="group bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-indigo-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden relative shadow-xl transition-all duration-300"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="h-56 mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                  {card.id === "bus" ?  (
                    <div className="w-full h-full p-6">
                      <AnimatedBus variant="normal" />
                    </div>
                  ) : (
                    <motion.div 
                      className="text-8xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness:  300 }}
                    >
                      👨‍💼
                    </motion.div>
                  )}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-3">
                  {card.title}
                </h3>
                <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                  {card. description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dialectical Relationship - Enhanced */}
        <motion. div
          variants={itemVariants}
          whileHover={{ boxShadow: "0 25px 70px -15px rgba(99, 102, 241, 0.4)" }}
          className="bg-white/90 backdrop-blur-md border-2 border-indigo-200 rounded-3xl p-10 mb-16 shadow-2xl relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }} />
          </div>

          <div className="relative z-10">
            <motion.h3 
              className="text-3xl md:text-4xl font-black tracking-tight text-center mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness:  200 }}
            >
              ⚔️ Mối Quan Hệ Biện Chứng
            </motion.h3>

            <div className="h-80 mb-10 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 flex items-center justify-center shadow-inner">
              <DialecticalVisualization />
            </div>

            {/* Scenario Cards - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {scenarios.map((scenario, idx) => (
                <motion. button
                  key={idx}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedScenario(idx)}
                  className={`${
                    idx === 2
                      ? "bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-300 hover:border-emerald-400"
                      : "bg-gradient-to-br from-red-50 to-rose-100 border-red-300 hover:border-red-400"
                  } border-2 rounded-2xl p-6 cursor-pointer text-left transition-all duration-300 shadow-lg hover:shadow-xl ${
                    selectedScenario === idx ? 'ring-4 ring-indigo-300' : ''
                  }`}
                >
                  <div className="h-36 mb-4 bg-white/70 rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
                    {idx === 2 ?  (
                      <AnimatedBus variant="normal" />
                    ) : idx === 0 ? (
                      <AnimatedBus variant="broken" />
                    ) : (
                      <AnimatedBus variant="crash" />
                    )}
                  </div>
                  <h4 className={`font-bold text-base tracking-tight mb-2 ${idx === 2 ? "text-emerald-700" :  "text-red-700"}`}>
                    {scenario.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold tracking-wide">{scenario.consequence}</p>
                </motion. button>
              ))}
            </div>

            {/* Scenario Details - Enhanced */}
            <AnimatePresence mode="wait">
              {selectedScenario !== null && (
                <motion. div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-8 shadow-lg">
                    <button
                      onClick={() => setSelectedScenario(null)}
                      className="text-slate-400 hover:text-slate-600 mb-6 text-2xl font-bold transition-colors hover:rotate-90 inline-block duration-300"
                    >
                      ✕
                    </button>
                    <div className="grid grid-cols-1 md: grid-cols-2 gap-10">
                      <motion.div 
                        className="h-80 bg-white rounded-2xl flex items-center justify-center p-6 shadow-md"
                        initial={{ scale:  0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness:  200 }}
                      >
                        <ScenarioVisual scenarioIndex={selectedScenario} />
                      </motion. div>
                      <div className="flex flex-col justify-center">
                        <div className="flex items-start gap-5 mb-6">
                          <motion.div 
                            className={`p-4 rounded-2xl ${
                              selectedScenario === 2 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                            } shadow-md`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {scenarios[selectedScenario].icon}
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="text-2xl md:text-3xl font-bold tracking-tight mb-5 text-slate-800">
                              {scenarios[selectedScenario].title}
                            </h4>
                            <div className="space-y-3 mb-5">
                              <p className="text-slate-700 font-medium">
                                <strong className="font-bold text-indigo-600">Tài xế:  </strong> {scenarios[selectedScenario]. driver}
                              </p>
                              <p className="text-slate-700 font-medium">
                                <strong className="font-bold text-indigo-600">Hậu quả: </strong> {scenarios[selectedScenario].consequence}
                              </p>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium bg-white/70 p-4 rounded-xl">
                              {scenarios[selectedScenario].description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Vietnam Application - Enhanced */}
        <motion.div
          variants={itemVariants}
          whileHover={{ boxShadow: "0 25px 70px -15px rgba(234, 88, 12, 0.4)" }}
          className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          
          <div className="relative z-10">
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white mb-8 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-6 w-6" />
              <span className="font-bold tracking-wide text-base">Áp dụng ở Việt Nam</span>
              <Star className="h-5 w-5 fill-current" />
            </motion.div>

            {/* Journey Map - Enhanced */}
            <div className="bg-white rounded-2xl p-8 mb-10 shadow-xl border border-orange-100">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-8 bg-gradient-to-r from-red-600 to-orange-600 text-transparent bg-clip-text">
                🛣️ Hành Trình Dân tộc
              </h3>
              <VietnamJourneyMap />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left:  Bus metaphor */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 mb-6 flex items-center gap-3">
                  <span className="text-4xl">🚌</span>
                  Chiếc Xe Bus
                </h3>

                <div className="space-y-5">
                  <motion.div 
                    className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200 shadow-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-xs text-slate-500 mb-3 font-bold uppercase tracking-wider">
                      Dân tộc
                    </p>
                    <p className="font-bold text-lg md:text-xl text-red-700">{vietnamContext.vehicle}</p>
                  </motion.div>

                  <motion.div 
                    className="bg-white rounded-2xl p-6 border-2 border-orange-200 shadow-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">
                      Hành khách
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {vietnamContext.passengers.map((passenger, idx) => (
                        <motion.span
                          key={idx}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 text-xs font-bold shadow-sm border border-orange-200"
                        >
                          {passenger}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-xs text-slate-500 mb-3 font-bold uppercase tracking-wider">
                      Người lái
                    </p>
                    <p className="font-bold text-lg md:text-xl text-blue-700 mb-2">{vietnamContext.driver}</p>
                    <p className="text-xs text-slate-600 bg-white/70 px-3 py-2 rounded-lg font-medium">
                      {vietnamContext. driverRole}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Right: Journey details */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 mb-6 flex items-center gap-3">
                  <span className="text-4xl">🎯</span>
                  Mục Tiêu & Thành Tựu
                </h3>

                <div className="space-y-5">
                  <motion.div 
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 shadow-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-xs text-slate-500 mb-3 font-bold uppercase tracking-wider">
                      Hướng đi
                    </p>
                    <p className="font-bold text-lg md:text-xl text-purple-700">{vietnamContext.direction}</p>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 border-2 border-emerald-300 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    animate={{ 
                      boxShadow: [
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        "0 20px 25px -5px rgba(16, 185, 129, 0.3)",
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <p className="text-xs text-slate-500 mb-3 font-bold uppercase tracking-wider">
                      Mục tiêu
                    </p>
                    <p className="font-black text-2xl md:text-3xl text-emerald-700 flex items-center gap-2">
                      <span>🌟</span>
                      {vietnamContext.goal}
                    </p>
                  </motion.div>

                  <motion.div 
                    className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-xs text-slate-500 mb-5 font-bold uppercase tracking-wider">
                      Thành tựu đã đạt
                    </p>
                    <ul className="space-y-3">
                      {vietnamContext.achievements.map((achievement, idx) => (
                        <motion.li 
                          key={idx} 
                          className="flex items-start gap-3 group"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <span className="text-emerald-500 font-black text-xl mt-0.5 group-hover:scale-125 transition-transform">
                            ✓
                          </span>
                          <span className="text-slate-700 text-sm md:text-base font-semibold group-hover:text-indigo-600 transition-colors">
                            {achievement}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion. div>
      </motion.div>
    </section>
  );
};

export default NationalityClassSection;