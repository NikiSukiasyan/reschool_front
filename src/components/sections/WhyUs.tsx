import { motion } from "framer-motion";
import AnimatedSection from "../shared/AnimatedSection";
import SectionHeader from "../shared/SectionHeader";
import type { WhyUsCard } from "@/lib/api-types";
import { useT } from "@/providers/TranslationProvider";

const brandColors = ["#e44d90", "#8b5cf6", "#3b82f6", "#06b6d4"];

// Generate a subtle glow color from brandColors based on index
const getGlowColor = (index: number): string => {
  const color = brandColors[index % brandColors.length];
  return `${color}1a`;
};

interface WhyUsProps {
  cards: WhyUsCard[];
}

const WhyUs = ({ cards }: WhyUsProps) => {
  const { t } = useT();

  return (
    <section className="py-fluid-section">
      <div className="container mx-auto px-4">
        <SectionHeader title={t('whyus.title')} subtitle={t('whyus.subtitle')} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-fluid">
          {cards.map((card, i) => {
            const color = brandColors[i % brandColors.length];
            const glowColor = getGlowColor(i);
            return (
              <AnimatedSection key={card.id} delay={i * 0.08}>
                <motion.div className="rounded-2xl border border-border bg-card p-6 hover:border-primary/20 transition-all duration-300 h-full group relative overflow-hidden" whileHover={{ y: -4, scale: 1.02 }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{ background: `radial-gradient(circle at 30% 30%, ${glowColor}, transparent 70%)` }} />
                  <div className="relative z-10">
                    {card.image && (
                      <img src={card.image} alt={card.title} className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" loading="lazy" />
                    )}
                    <h3 className="font-bold mb-2 transition-colors" style={{ color }}>{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
