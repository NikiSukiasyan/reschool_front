import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect, memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2, Palette, BarChart3, Cpu, Rocket, Zap,
  Monitor, Smartphone, Globe, Shield, Database, Cloud,
  Terminal, Layers, BookOpen, Lightbulb, Wrench, Settings,
  ArrowUpRight, Clock, Users, type LucideIcon,
} from "lucide-react";
import type { CourseList } from "@/lib/api-types";

const iconMap: Record<string, LucideIcon> = {
  Code2, Palette, BarChart3, Cpu, Rocket, Zap,
  Monitor, Smartphone, Globe, Shield, Database, Cloud,
  Terminal, Layers, BookOpen, Lightbulb, Wrench, Settings,
};

interface HeroCard {
  icon: LucideIcon;
  label: string;
  sub: string;
  accent: string;
  link: string;
  detail: string;
  duration: string;
  students: string;
}

const fallbackCards: HeroCard[] = [
  { icon: Code2, label: "Frontend", sub: "React · TypeScript", accent: "#89b4fa", link: "/courses/web-dev", detail: "ისწავლე თანამედროვე ვებ-დეველოპმენტი React-ით და TypeScript-ით.", duration: "6 თვე", students: "120+" },
  { icon: Palette, label: "Design", sub: "UI · UX", accent: "#f9e2af", link: "/courses/design", detail: "შექმენი მომხმარებლისთვის მოსახერხებელი ინტერფეისები Figma-ში.", duration: "4 თვე", students: "85+" },
  { icon: BarChart3, label: "IT PM", sub: "Agile · Scrum", accent: "#a6e3a1", link: "/courses/it-pm", detail: "გახდი IT პროექტ მენეჯერი — Agile, Scrum, ლიდერშიფი.", duration: "3 თვე", students: "60+" },
  { icon: Cpu, label: "Backend", sub: "Node · Database", accent: "#f38ba8", link: "/courses/backend-dev", detail: "სერვერული პროგრამირება Node.js-ით და მონაცემთა ბაზები.", duration: "6 თვე", students: "95+" },
  { icon: Rocket, label: "DevOps", sub: "CI · CD", accent: "#cba6f7", link: "/courses/devops", detail: "Docker, CI/CD პაიპლაინები და Cloud ინფრასტრუქტურა.", duration: "5 თვე", students: "45+" },
  { icon: Zap, label: "AI / ML", sub: "Python · ML", accent: "#f5e0dc", link: "/courses/ai-ml", detail: "ხელოვნური ინტელექტი Python-ით — TensorFlow და PyTorch.", duration: "6 თვე", students: "70+" },
];

function mapApiToCards(heroCards: CourseList[]): HeroCard[] {
  return heroCards.map((course) => ({
    icon: iconMap[course.hero_icon || ""] || Code2,
    label: course.hero_label || course.title,
    sub: course.hero_subtitle || "",
    accent: course.hero_accent || "#89b4fa",
    link: `/courses/${course.slug}`,
    detail: course.hero_detail || course.description || "",
    duration: course.duration || "",
    students: course.hero_students || "",
  }));
}

const positions = [
  { x: -180, y: -110 },
  { x: 0, y: -110 },
  { x: 180, y: -110 },
  { x: -180, y: 110 },
  { x: 0, y: 110 },
  { x: 180, y: 110 },
];

/* Launch angles — each card flies out from center in a unique arc */
const launchPaths = [
  { startX: 60, startY: 200, midX: -200, midY: -180 },   // sweeps from bottom-right to top-left
  { startX: 0, startY: 250, midX: 0, midY: -200 },       // rises straight up, overshoots
  { startX: -60, startY: 200, midX: 200, midY: -180 },   // sweeps from bottom-left to top-right
  { startX: 180, startY: 0, midX: -220, midY: 60 },      // flies from right, arcs to left
  { startX: 0, startY: -200, midX: 0, midY: 180 },       // drops from top, overshoots down
  { startX: -180, startY: 0, midX: 220, midY: 60 },      // flies from left, arcs to right
];

// Map of which card gets overlapped when a given card is hovered
// Left/center cards open RIGHT: 0→1, 1→2, 3→4, 4→5
// Right cards open LEFT: 2→1, 5→4
const overlapMap: Record<number, number> = { 0: 1, 1: 2, 2: 1, 3: 4, 4: 5, 5: 4 };

const FloatingCard = memo(({
  card, pos, index, phase, hoveredIndex, onHoverChange,
}: {
  card: HeroCard;
  pos: typeof positions[0];
  index: number;
  phase: number;
  hoveredIndex: number | null;
  onHoverChange: (index: number | null) => void;
}) => {
  // Detail panel opens to the LEFT for right-column cards (pos.x > 0)
  const panelOnLeft = pos.x > 0;
  const navigate = useNavigate();
  const Icon = card.icon;
  const launch = launchPaths[index];

  const getAnimateProps = () => {
    if (phase < 1) {
      return { x: launch.startX, y: launch.startY, scale: 0, opacity: 0, rotate: (index % 2 === 0 ? -1 : 1) * 40 };
    }
    if (phase === 1) {
      return { x: 0, y: 0, scale: 0.4, opacity: 0.6, rotate: (index % 2 === 0 ? -1 : 1) * 15 };
    }
    if (phase === 2) {
      return {
        x: pos.x + pos.x * 0.2,
        y: pos.y + pos.y * 0.2,
        scale: 1.08, opacity: 1,
        rotate: (index % 2 === 0 ? -1 : 1) * 3,
      };
    }
    return { x: pos.x, y: pos.y, scale: 1, opacity: 1, rotate: 0 };
  };

  const getTransition = () => {
    if (phase === 1) return { duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] as const };
    if (phase === 2) return { duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as const };
    if (phase >= 3) return { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };
    return { duration: 0.3 };
  };

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 group/card"
      style={{
        translateX: "-50%",
        translateY: "-50%",
        zIndex: 10,
      }}
      initial={{
        x: launch.startX, y: launch.startY, scale: 0, opacity: 0,
        rotate: (index % 2 === 0 ? -1 : 1) * 40,
      }}
      animate={getAnimateProps()}
      transition={getTransition()}
      whileHover={phase >= 3 ? { zIndex: 40 } : undefined}
      onHoverStart={() => { (window as any).__heroCardHovered = true; onHoverChange(index); }}
      onHoverEnd={() => { (window as any).__heroCardHovered = false; onHoverChange(null); }}
    >
      {/* Card body + detail panel wrapper */}
      <div className="relative flex items-stretch gap-0">
        {/* Main card — all hover via CSS */}
        <div
          className="relative rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-150 group-hover/card:shadow-lg cursor-pointer"
          style={{
            width: 155, height: 180,
            background: `linear-gradient(165deg, ${card.accent}0d 0%, hsl(240 10% 7% / 0.95) 60%)`,
            border: `1px solid ${card.accent}15`,
            boxShadow: `0 4px 20px -6px ${card.accent}08`,
            // CSS custom properties for hover
            ['--hover-border' as any]: `${card.accent}40`,
            ['--hover-shadow' as any]: `0 12px 40px -8px ${card.accent}25`,
          }}
        >
          <style>{`
            .group\\/card:hover > div > div:first-child {
              border-color: var(--hover-border) !important;
              box-shadow: var(--hover-shadow) !important;
            }
          `}</style>
          {(() => {
            const isOverlapped = hoveredIndex !== null && overlapMap[hoveredIndex] === index;
            return (
              <div className={`relative flex flex-col items-center justify-center h-full p-4 gap-2.5 transition-opacity duration-150 ${isOverlapped ? 'opacity-0' : ''}`}>
                <div
                  className="flex items-center justify-center rounded-xl transition-opacity duration-150"
                  style={{
                    width: 54, height: 54,
                    background: `${card.accent}0a`,
                    border: `1px solid ${card.accent}18`,
                  }}
                >
                  <Icon size={28} style={{ color: card.accent }} strokeWidth={1.5} />
                </div>
                <div className="text-center transition-opacity duration-150">
                  <p className="font-bold tracking-wide text-sm" style={{ color: `${card.accent}dd` }}>
                    {card.label}
                  </p>
                  <p className="text-[10px] mt-0.5 font-medium" style={{ color: `${card.accent}50` }}>
                    {card.sub}
                  </p>
                </div>
                <div
                  className="flex items-center justify-center rounded-full cursor-pointer opacity-0 translate-y-1 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-150"
                  style={{
                    width: 28, height: 28,
                    background: `${card.accent}10`,
                    border: `1px solid ${card.accent}20`,
                  }}
                  onClick={(e) => { e.stopPropagation(); navigate(card.link); }}
                >
                  <ArrowUpRight size={14} style={{ color: card.accent }} />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Detail panel — opens LEFT for right-column cards, RIGHT otherwise */}
        <div
          className={`absolute top-0 z-20 rounded-2xl overflow-hidden backdrop-blur-xl opacity-0 pointer-events-none group-hover/card:opacity-100 group-hover/card:translate-x-0 group-hover/card:pointer-events-auto transition-all duration-150 ${
            panelOnLeft
              ? 'right-[157px] translate-x-2'
              : 'left-[157px] -translate-x-2'
          }`}
          style={{
            height: 210,
            width: 240,
            background: `linear-gradient(165deg, ${card.accent}0a 0%, hsl(240 10% 7% / 0.97) 50%)`,
            border: `1px solid ${card.accent}25`,
            ...(panelOnLeft ? { borderRight: 'none' } : { borderLeft: 'none' }),
          }}
        >
          <div className="p-4 flex flex-col justify-between h-full">
            <p className="text-[13px] leading-relaxed" style={{ color: `${card.accent}90` }}>
              {card.detail}
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <Clock size={13} style={{ color: `${card.accent}70` }} />
                <span className="text-[12px] font-medium" style={{ color: `${card.accent}60` }}>
                  {card.duration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={13} style={{ color: `${card.accent}70` }} />
                <span className="text-[12px] font-medium" style={{ color: `${card.accent}60` }}>
                  {card.students} სტუდენტი
                </span>
              </div>
              <button
                className="mt-2 px-5 py-2.5 rounded-lg text-[12px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  background: `${card.accent}18`,
                  color: card.accent,
                  border: `1px solid ${card.accent}25`,
                }}
                onClick={(e) => { e.stopPropagation(); navigate(card.link); }}
              >
                დეტალურად →
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

/* ── Shockwave ring for the explosion moment ── */
const ShockWave = ({ delay, color, size }: { delay: number; color: string; size: number }) => (
  <motion.div
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
    style={{
      width: size, height: size,
      border: `2px solid ${color}`,
    }}
    initial={{ scale: 0, opacity: 0.8 }}
    animate={{ scale: [0, 3.5], opacity: [0.7, 0] }}
    transition={{ duration: 1, delay, ease: "easeOut" }}
  />
);

/* ── Spark particles during explosion ── */
const Spark = ({ index, total, cards }: { index: number; total: number; cards: HeroCard[] }) => {
  const angle = (Math.PI * 2 * index) / total;
  const dist = 80 + Math.random() * 100;
  const accent = cards[index % cards.length].accent;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
      style={{
        width: 4, height: 4,
        background: accent,
        boxShadow: `0 0 6px ${accent}`,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 0.8,
        delay: 0.05 * (index % 6),
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  );
};

/* ── Main Component ── */
const HeroVisual = ({ heroCards }: { heroCards?: CourseList[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [phase, setPhase] = useState(0);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cards = useMemo(() => {
    if (heroCards && heroCards.length > 0) {
      return mapApiToCards(heroCards);
    }
    return fallbackCards;
  }, [heroCards]);

  const springConfig = { stiffness: 60, damping: 20 };
  const tiltX = useSpring(useTransform(mouseY, [-250, 250], [3, -3]), springConfig);
  const tiltY = useSpring(useTransform(mouseX, [-250, 250], [-3, 3]), springConfig);

  // Cinematic timeline
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);   // gather to center
    const t2 = setTimeout(() => setPhase(2), 1000);  // explode outward
    const t3 = setTimeout(() => setPhase(3), 1800);  // settle into place
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Only render up to 6 cards (matching positions/launchPaths)
  const visibleCards = cards.slice(0, 6);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full flex items-center justify-center"
      style={{ height: "clamp(460px, 40vw, 680px)", perspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full blur-[100px] pointer-events-none"
        style={{
          width: 280, height: 280,
          background: "radial-gradient(circle, hsl(270 60% 50% / 0.06), hsl(200 70% 50% / 0.04), transparent)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Center energy orb — visible during gather phase */}
      <AnimatePresence>
        {phase >= 1 && phase < 3 && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-20"
            style={{
              width: 60, height: 60,
              background: "radial-gradient(circle, hsl(270 80% 70% / 0.6), hsl(200 70% 50% / 0.3), transparent)",
              boxShadow: "0 0 40px hsl(270 60% 50% / 0.4), 0 0 80px hsl(200 70% 50% / 0.2)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase === 1 ? [0, 1.2, 0.9] : [0.9, 2.5],
              opacity: phase === 1 ? [0, 1, 0.8] : [0.8, 0],
            }}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ duration: phase === 1 ? 0.6 : 0.4, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Shockwaves on explosion */}
      {phase >= 2 && (
        <>
          <ShockWave delay={0} color="hsl(270 60% 55% / 0.3)" size={80} />
          <ShockWave delay={0.1} color="hsl(200 70% 50% / 0.2)" size={60} />
          <ShockWave delay={0.15} color="hsl(52 70% 45% / 0.15)" size={100} />
        </>
      )}

      {/* Spark particles on explosion */}
      {phase >= 2 && phase < 3 && (
        <>
          {Array.from({ length: 18 }, (_, i) => (
            <Spark key={i} index={i} total={18} cards={visibleCards} />
          ))}
        </>
      )}

      {/* Tilting wrapper */}
      <motion.div
        className="relative"
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Cards */}
        {visibleCards.map((card, i) => (
          <FloatingCard key={card.label} card={card} pos={positions[i]} index={i} phase={phase} hoveredIndex={hoveredIndex} onHoverChange={setHoveredIndex} />
        ))}

      </motion.div>
    </motion.div>
  );
};

export default HeroVisual;
