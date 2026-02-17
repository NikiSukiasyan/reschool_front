import { useEffect, useRef, useCallback } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
}

interface Orb {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  color: number[];
  phase: number;
  speed: number;
  alive: boolean;
  absorbT: number;
}

interface BurstParticle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  color: number[];
  life: number;
  maxLife: number;
}

interface ShockRing {
  x: number; y: number;
  color: number[];
  age: number;
  maxAge: number;
}

const TRAIL_LENGTH = 65;
const POINT_LIFETIME = 2.5;
const SMOOTHING = 0.35;

const GRADIENT_STOPS = [
  [228, 77, 144],
  [168, 85, 247],
  [139, 92, 246],
  [59, 130, 246],
  [6, 182, 212],
];

const ORB_COLORS = [
  [228, 77, 144],
  [139, 92, 246],
  [59, 130, 246],
  [6, 182, 212],
  [168, 85, 247],
];

const lerpRgb = (a: number[], b: number[], t: number) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const getGradientColor = (t: number): number[] => {
  const idx = t * (GRADIENT_STOPS.length - 1);
  const i = Math.floor(idx);
  const f = idx - i;
  if (i >= GRADIENT_STOPS.length - 1) return GRADIENT_STOPS[GRADIENT_STOPS.length - 1];
  return lerpRgb(GRADIENT_STOPS[i], GRADIENT_STOPS[i + 1], f);
};

const catmullRom = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
};

const ORB_COUNT = 5;
const ORB_ABSORB_DIST = 80;
const ORB_ATTRACT_DIST = 180;
const ORB_RESPAWN_TIME = 4;

// Adaptive quality levels
const QUALITY = {
  high: { trailSegmentMult: 2, orbGlow: true, sparkles: true, blur: true, burstCount: 20, ringCount: 2, trailWidth: 12, glowWidth: 36 },
  medium: { trailSegmentMult: 1, orbGlow: true, sparkles: false, blur: false, burstCount: 10, ringCount: 1, trailWidth: 10, glowWidth: 28 },
  low: { trailSegmentMult: 0.5, orbGlow: false, sparkles: false, blur: false, burstCount: 5, ringCount: 0, trailWidth: 8, glowWidth: 0 },
};

const MouseTrail = () => {
  // Respect reduced motion preference
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const smoothMouseRef = useRef({ x: -100, y: -100 });
  const prevMouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);
  const activeRef = useRef(false);
  const fadeRef = useRef(0);
  const distAccum = useRef(0);
  const orbsRef = useRef<Orb[]>([]);
  const orbRespawnTimers = useRef<number[]>([]);
  const initializedRef = useRef(false);
  const burstsRef = useRef<BurstParticle[]>([]);
  const ringsRef = useRef<ShockRing[]>([]);
  const trailBoostRef = useRef(1);

  // FPS tracking for adaptive quality
  const fpsHistoryRef = useRef<number[]>([]);
  const qualityRef = useRef<keyof typeof QUALITY>("high");
  const frameCountRef = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    activeRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    activeRef.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      if (!initializedRef.current || orbsRef.current.length === 0) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const lw = canvas.width / dpr;
        const lh = canvas.height / dpr;
        orbsRef.current = Array.from({ length: ORB_COUNT }, (_, i) => {
          const bx = 80 + Math.random() * (lw - 160);
          const by = 80 + Math.random() * (lh - 160);
          return {
            x: bx, y: by, baseX: bx, baseY: by,
            radius: 12 + Math.random() * 18,
            color: ORB_COLORS[i % ORB_COLORS.length],
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.5,
            alive: true,
            absorbT: 0,
          };
        });
        orbRespawnTimers.current = new Array(ORB_COUNT).fill(0);
        initializedRef.current = true;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Adaptive quality: check FPS every 30 frames
      frameCountRef.current++;
      if (dt > 0) {
        const fps = 1 / dt;
        fpsHistoryRef.current.push(fps);
        if (fpsHistoryRef.current.length > 30) fpsHistoryRef.current.shift();
      }
      if (frameCountRef.current % 30 === 0 && fpsHistoryRef.current.length >= 10) {
        const avgFps = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
        if (avgFps < 30) qualityRef.current = "low";
        else if (avgFps < 50) qualityRef.current = "medium";
        else qualityRef.current = "high";
      }

      const q = QUALITY[qualityRef.current];

      // Hide trail instantly when hero card is hovered
      const heroHovered = !!(window as any).__heroCardHovered;
      if (heroHovered) {
        activeRef.current = false;
        fadeRef.current = Math.max(0, fadeRef.current - dt * 8); // fast fade out
        if (fadeRef.current < 0.01) {
          pointsRef.current.length = 0;
        }
      }

      trailBoostRef.current = Math.max(1, trailBoostRef.current - dt * 0.3);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const logicalW = canvas.width / dpr;
      const logicalH = canvas.height / dpr;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Smooth mouse
      const sm = smoothMouseRef.current;
      sm.x += (mouseRef.current.x - sm.x) * SMOOTHING;
      sm.y += (mouseRef.current.y - sm.y) * SMOOTHING;

      const mx = sm.x;
      const my = sm.y;
      const ddx = mx - prevMouseRef.current.x;
      const ddy = my - prevMouseRef.current.y;
      const speed = Math.sqrt(ddx * ddx + ddy * ddy);

      // Add trail points
      distAccum.current += speed;
      const spacing = 5;
      while (distAccum.current >= spacing && activeRef.current) {
        distAccum.current -= spacing;
        pointsRef.current.unshift({
          x: mx, y: my, vx: ddx * 0.04, vy: ddy * 0.04, age: 0,
        });
        if (pointsRef.current.length > TRAIL_LENGTH) pointsRef.current.pop();
        fadeRef.current = 1;
      }

      prevMouseRef.current = { x: mx, y: my };

      if (!activeRef.current || speed < 1) {
        fadeRef.current = Math.max(0, fadeRef.current - dt * 0.8);
      }

      // Age points
      const pts = pointsRef.current;
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.age += dt;
        if (p.age >= POINT_LIFETIME) {
          pts.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.99;
        p.vy *= 0.99;
      }

      // ── Orbs ──
      const orbs = orbsRef.current;
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];

        if (!orb.alive) {
          orbRespawnTimers.current[i] += dt;
          if (orbRespawnTimers.current[i] > ORB_RESPAWN_TIME) {
            orb.alive = true;
            orb.absorbT = 0;
            orb.baseX = 80 + Math.random() * (logicalW - 160);
            orb.baseY = 80 + Math.random() * (logicalH - 160);
            orb.x = orb.baseX;
            orb.y = orb.baseY;
            orb.phase = Math.random() * Math.PI * 2;
            orbRespawnTimers.current[i] = 0;
          }
          continue;
        }

        orb.phase += dt * orb.speed;
        const floatX = Math.sin(orb.phase) * 18;
        const floatY = Math.cos(orb.phase * 0.7) * 13;

        const orbDx = mx - orb.x;
        const orbDy = my - orb.y;
        const orbDist = Math.sqrt(orbDx * orbDx + orbDy * orbDy);

        const inAttractZone = orbDist < ORB_ATTRACT_DIST && activeRef.current;
        const attractT = inAttractZone ? Math.max(0, 1 - orbDist / ORB_ATTRACT_DIST) : 0;

        if (orbDist < ORB_ABSORB_DIST && activeRef.current) {
          orb.absorbT = Math.min(1, orb.absorbT + dt * 2.5);
          orb.x += (mx - orb.x) * 0.15;
          orb.y += (my - orb.y) * 0.15;

          if (orb.absorbT > 0.9) {
            trailBoostRef.current = Math.min(2.5, trailBoostRef.current + 0.4);

            // Burst particles
            const [cr, cg, cb] = orb.color;
            for (let j = 0; j < q.burstCount; j++) {
              const angle = (Math.PI * 2 * j) / q.burstCount + (Math.random() - 0.5) * 0.4;
              const spd = 60 + Math.random() * 120;
              burstsRef.current.push({
                x: orb.x, y: orb.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                radius: 3 + Math.random() * 4,
                color: [cr + (255 - cr) * 0.3, cg + (255 - cg) * 0.3, cb + (255 - cb) * 0.3],
                life: 0,
                maxLife: 0.5 + Math.random() * 0.3,
              });
            }

            if (q.ringCount > 0) {
              ringsRef.current.push(
                { x: orb.x, y: orb.y, color: orb.color, age: 0, maxAge: 0.5 },
              );
            }

            fadeRef.current = 1;
            orb.alive = false;
            continue;
          }
        } else if (inAttractZone) {
          orb.absorbT = Math.max(0, orb.absorbT - dt * 1.5);
          const pullStrength = attractT * 0.02;
          orb.x += orbDx * pullStrength;
          orb.y += orbDy * pullStrength;
          orb.x += (orb.baseX + floatX - orb.x) * 0.01;
          orb.y += (orb.baseY + floatY - orb.y) * 0.01;
        } else {
          orb.absorbT = Math.max(0, orb.absorbT - dt * 1.5);
          orb.x += (orb.baseX + floatX - orb.x) * 0.03;
          orb.y += (orb.baseY + floatY - orb.y) * 0.03;
        }

        // Draw orb
        const proximityScale = 1 + attractT * 0.3;
        const drawRadius = orb.radius * (1 - orb.absorbT * 0.6) * proximityScale;
        const [cr, cg, cb] = orb.color;
        const pulse = 0.5 + 0.5 * Math.sin(orb.phase * 2);
        const orbAlpha = (0.3 + pulse * 0.15) * (1 - orb.absorbT * 0.5);

        if (q.orbGlow) {
          const glowMult = 2.2 + attractT;
          const glowGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, drawRadius * glowMult);
          glowGrad.addColorStop(0, `rgba(255,255,255,${Math.min(1, orbAlpha)})`);
          glowGrad.addColorStop(0.2, `rgba(${cr},${cg},${cb},${orbAlpha * 0.8})`);
          glowGrad.addColorStop(0.6, `rgba(${cr},${cg},${cb},${orbAlpha * 0.15})`);
          glowGrad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, drawRadius * glowMult, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        } else {
          // Simple circle for low quality
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, drawRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${orbAlpha})`;
          ctx.fill();
        }
      }

      // ── Trail ribbon (optimized: single pass, fewer segments) ──
      if (pts.length >= 3) {
        const boost = trailBoostRef.current;
        const segMult = q.trailSegmentMult;
        const totalSegs = Math.floor((pts.length - 1) * segMult);

        // Glow pass (optional)
        if (q.blur && totalSegs > 0) {
          ctx.save();
          ctx.filter = "blur(3px)";
          ctx.lineWidth = q.glowWidth * boost;
          ctx.lineCap = "round";
          ctx.beginPath();
          for (let seg = 0; seg < totalSegs; seg++) {
            const t = seg / totalSegs;
            const idx = t * (pts.length - 1);
            const ii = Math.floor(idx);
            const frac = idx - ii;
            const i0 = Math.max(0, ii - 1);
            const i2 = Math.min(pts.length - 1, ii + 1);
            const i3 = Math.min(pts.length - 1, ii + 2);
            const px = catmullRom(pts[i0].x, pts[ii].x, pts[i2].x, pts[i3].x, frac);
            const py = catmullRom(pts[i0].y, pts[ii].y, pts[i2].y, pts[i3].y, frac);
            if (seg === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          const midColor = getGradientColor(0.5);
          ctx.strokeStyle = `rgba(${midColor[0] | 0},${midColor[1] | 0},${midColor[2] | 0},${0.1 * fadeRef.current})`;
          ctx.stroke();
          ctx.restore();
        }

        // Main trail — batch into fewer stroke calls using gradient segments
        const batchSize = Math.max(1, Math.floor(totalSegs / 8));
        for (let batch = 0; batch < totalSegs; batch += batchSize) {
          const endSeg = Math.min(batch + batchSize, totalSegs);
          const midT = ((batch + endSeg) / 2) / totalSegs;
          const [cr, cg, cb] = getGradientColor(midT);
          const taper = Math.pow(1 - midT, 0.4);
          const pointAge = pts[Math.min(Math.floor(midT * (pts.length - 1)), pts.length - 1)].age / POINT_LIFETIME;
          const ageFade = Math.max(0, 1 - pointAge * pointAge);
          const alpha = ageFade * taper * 0.7 * fadeRef.current;

          if (alpha < 0.005) continue;

          ctx.beginPath();
          ctx.lineWidth = q.trailWidth * boost * taper;
          ctx.lineCap = "round";
          ctx.strokeStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha})`;

          for (let seg = batch; seg <= endSeg; seg++) {
            const t = seg / totalSegs;
            const idx = t * (pts.length - 1);
            const ii = Math.floor(idx);
            const frac = idx - ii;
            const i0 = Math.max(0, ii - 1);
            const i2 = Math.min(pts.length - 1, ii + 1);
            const i3 = Math.min(pts.length - 1, ii + 2);
            const px = catmullRom(pts[i0].x, pts[ii].x, pts[i2].x, pts[i3].x, frac);
            const py = catmullRom(pts[i0].y, pts[ii].y, pts[i2].y, pts[i3].y, frac);
            if (seg === batch) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      // ── Sparkles (only high quality) ──
      if (q.sparkles && pts.length > 0 && fadeRef.current > 0.3 && speed > 8) {
        const head = pts[0];
        const angle = Math.random() * Math.PI * 2;
        const dist = 8 + Math.random() * 14;
        ctx.beginPath();
        ctx.arc(head.x + Math.cos(angle) * dist, head.y + Math.sin(angle) * dist, 2, 0, Math.PI * 2);
        const [cr, cg, cb] = getGradientColor(Math.random() * 0.3);
        ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${0.4 * fadeRef.current})`;
        ctx.fill();
      }

      // ── Bursts ──
      const bursts = burstsRef.current;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.life += dt;
        if (b.life >= b.maxLife) { bursts.splice(i, 1); continue; }
        const t = b.life / b.maxLife;
        const ease = 1 - t * t;
        b.x += b.vx * dt * ease;
        b.y += b.vy * dt * ease;
        b.vy += 25 * dt;
        const alpha = (1 - t) * (1 - t);
        const r = b.radius * (1 - t * 0.5);
        const [cr, cg, cb] = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha})`;
        ctx.fill();
      }

      // ── Shock rings ──
      const rings = ringsRef.current;
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.age += dt;
        if (ring.age >= ring.maxAge) { rings.splice(i, 1); continue; }
        const t = ring.age / ring.maxAge;
        const radius = 16 + t * 120;
        const alpha = (1 - t) * 0.5;
        const [cr, cg, cb] = ring.color;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha})`;
        ctx.lineWidth = Math.max(0.5, (1 - t) * 3);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default MouseTrail;
