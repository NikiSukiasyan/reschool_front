import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import HeroVisual from "./HeroVisual";
import AnimatedBackground from "../shared/AnimatedBackground";
import MouseTrail from "../shared/MouseTrail";
import type { Statistic, Banner, CourseList } from "@/lib/api-types";
import { useT } from "@/providers/TranslationProvider";

interface HeroProps {
  statistics: Statistic[];
  banners: Banner[];
  heroCards: CourseList[];
}

const Counter = ({ value, suffix, color }: { value: number; suffix: string; color?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, value]);

  return (
    <div ref={ref} className="text-2xl md:text-3xl font-bold" style={color ? { color } : undefined}>
      {count}{suffix}
    </div>
  );
};

const Particle = ({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) => (
  <motion.div
    className="absolute rounded-full"
    style={{ left: x, top: y, width: size, height: size, background: color }}
    animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(hsl(54, 75%, 48% / 0.3) 1px, transparent 1px),
        linear-gradient(90deg, hsl(54, 75%, 48% / 0.3) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }} />
  </div>
);

const Hero = ({ statistics, banners, heroCards }: HeroProps) => {
  const { t } = useT();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(springY, [-300, 300], [5, -5]);
  const rotateY = useTransform(springX, [-300, 300], [-5, 5]);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden" onMouseMove={handleMouse}>
      <AnimatedBackground />
      <MouseTrail />
      <GridBackground />

      <motion.div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-15 blur-[120px]" style={{ background: "hsl(52, 70%, 45%)" }} animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full opacity-10 blur-[100px]" style={{ background: "hsl(140, 80%, 36%)" }} animate={{ scale: [1, 1.3, 1], y: [0, -40, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-1/2 right-10 w-60 h-60 rounded-full opacity-8 blur-[80px]" style={{ background: "hsl(197, 70%, 42%)" }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-40 left-10 w-40 h-40 rounded-full opacity-8 blur-[60px]" style={{ background: "hsl(0, 58%, 42%)" }} animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />

      <Particle delay={0} x="10%" y="20%" size={4} color="hsl(52, 70%, 45%)" />
      <Particle delay={0.5} x="80%" y="15%" size={3} color="hsl(140, 80%, 36%)" />
      <Particle delay={1} x="70%" y="70%" size={5} color="hsl(197, 70%, 42%)" />
      <Particle delay={1.5} x="20%" y="80%" size={3} color="hsl(0, 58%, 42%)" />
      <Particle delay={2} x="50%" y="10%" size={4} color="hsl(52, 70%, 45%)" />
      <Particle delay={0.8} x="90%" y="50%" size={3} color="hsl(140, 80%, 36%)" />
      <Particle delay={1.2} x="30%" y="40%" size={2} color="hsl(197, 70%, 42%)" />
      <Particle delay={1.8} x="60%" y="85%" size={4} color="hsl(52, 70%, 45%)" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-fluid-lg items-center">
          <div>
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <span className="relative inline-block px-5 py-2 rounded-full text-xs 2xl:text-sm font-semibold mb-6">
                <span
                  className="absolute inset-0 rounded-full opacity-10"
                  style={{ background: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" }}
                />
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "1.5px solid transparent",
                    backgroundImage: "linear-gradient(hsl(240, 12%, 8%), hsl(240, 12%, 8%)), linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                  }}
                />
                <span className="relative z-10 bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" }}>
                  {t('hero.school_name')}
                </span>
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="text-fluid-hero font-black leading-tight mb-6">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" }}>{t('hero.hashtag_you')}</span>
              <br />
              <motion.span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)", backgroundSize: "200% 200%" }} animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
                {t('hero.can_do')}
              </motion.span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="text-fluid-body text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {t('hero.description')}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} className="flex flex-wrap gap-4 mb-12">
              <Link to="/contact" className="group relative inline-flex items-center gap-2 px-7 py-3.5 2xl:px-8 2xl:py-4 rounded-xl text-sm 2xl:text-base font-bold text-white transition-all hover:scale-105 overflow-hidden" style={{ background: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" }}>
                <span className="relative z-10 flex items-center gap-2">
                  {t('hero.request_consultation')}
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight size={16} />
                  </motion.span>
                </span>
              </Link>
              <Link to="/courses" className="inline-flex items-center gap-2 px-7 py-3.5 2xl:px-8 2xl:py-4 rounded-xl text-sm 2xl:text-base font-semibold text-foreground hover:scale-105 transition-all" style={{ border: "1px solid transparent", backgroundImage: "linear-gradient(hsl(240, 12%, 8%), hsl(240, 12%, 8%)), linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)", backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box" }}>
                {t('hero.view_courses')}
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.6 }} className="flex gap-8 2xl:gap-10">
              {statistics.map((stat, i) => (
                <motion.div key={stat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.15 }}>
                  <Counter value={parseInt(stat.value) || 0} suffix={stat.suffix} color={stat.color} />
                  <div className="text-xs 2xl:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <HeroVisual heroCards={heroCards} />
          </motion.div>
        </div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-6 h-10 rounded-full border-2 border-[#8b5cf6]/20 flex items-start justify-center p-1.5">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]/60" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
