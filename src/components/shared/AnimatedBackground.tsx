import { motion } from "framer-motion";

const colors = [
  "hsl(52, 70%, 45%)",
  "hsl(140, 80%, 36%)",
  "hsl(197, 70%, 42%)",
  "hsl(0, 58%, 42%)",
];

/* ── Smooth flowing curves only ── */
const curvePaths = [
  "M-100 300 C200 100, 400 500, 600 200 S900 400, 1100 150",
  "M1100 400 C800 600, 600 100, 400 450 S100 200, -100 500",
  "M-100 100 C150 350, 350 50, 500 300 S750 550, 1100 250",
  "M1100 550 C900 300, 650 600, 450 350 S200 100, -100 400",
  "M480 -50 C300 200, 700 300, 480 550 S200 400, 480 650",
  "M-50 500 Q250 300, 500 450 T1050 350",
];

const FlowingLine = ({ path, delay, color, duration, width }: {
  path: string; delay: number; color: string; duration: number; width: number;
}) => (
  <>
    <motion.path
      d={path}
      stroke={color}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: [0, 0.6, 1],
        opacity: [0, 0.1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: duration * 0.4,
        ease: "easeInOut",
      }}
    />
    <motion.path
      d={path}
      stroke={color}
      strokeWidth={width * 3}
      fill="none"
      strokeLinecap="round"
      filter="url(#softglow)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: [0, 0.6, 1],
        opacity: [0, 0.04, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: duration * 0.4,
        ease: "easeInOut",
      }}
    />
  </>
);

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 960 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="softglow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {curvePaths.map((path, i) => (
        <FlowingLine
          key={i}
          path={path}
          delay={i * 2.5}
          color={colors[i % colors.length]}
          duration={9 + (i % 3) * 2}
          width={1.2 + (i % 2) * 0.5}
        />
      ))}
    </svg>
  </div>
);

export default AnimatedBackground;
