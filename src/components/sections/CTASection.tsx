import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import AnimatedSection from "../shared/AnimatedSection";
import { useT } from "@/providers/TranslationProvider";

interface CTASectionProps {
  phone?: string;
}

const CTASection = ({ phone }: CTASectionProps) => {
  const { t } = useT();

  return (
    <section className="py-fluid-section">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center" style={{ background: "var(--gradient-subtle)" }}>
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-20 blur-[100px]" style={{ background: "hsl(52, 70%, 45%)" }} />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="gradient-text">{t('cta.hashtag')}</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-lg mx-auto">
                {t('cta.description')}
              </p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
                <Phone size={16} />
                <span className="text-sm">{phone || '+995 598 773 288'}</span>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" }}
              >
                {t('cta.register_online')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTASection;
