import { motion } from "framer-motion";
import AnimatedSection from "../shared/AnimatedSection";
import SectionHeader from "../shared/SectionHeader";
import { getIcon } from "@/lib/icons";
import type { ProcessStep } from "@/lib/api-types";
import { useT } from "@/providers/TranslationProvider";

interface ProcessProps {
  steps: ProcessStep[];
}

const Process = ({ steps }: ProcessProps) => {
  const { t } = useT();

  return (
    <section className="py-fluid-section bg-card/30">
      <div className="container mx-auto px-4">
        <SectionHeader title={t('process.title')} subtitle={t('process.subtitle')} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-fluid">
          {steps.map((step, i) => {
            const Icon = getIcon(step.icon);
            const color = step.color;
            return (
              <AnimatedSection key={step.id} delay={i * 0.1}>
                <motion.div
                  className="relative text-center p-6 rounded-2xl border transition-transform cursor-default"
                  style={{
                    borderColor: `${color}33`,
                    background: `${color}15`,
                  }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: `${color}1a` }}
                  >
                    <Icon style={{ color }} size={24} />
                  </div>
                  <span
                    className="absolute top-4 right-4 text-5xl font-black opacity-10"
                    style={{ color }}
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-bold mb-2" style={{ color }}>{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
