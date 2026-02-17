import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import AnimatedSection from "../shared/AnimatedSection";
import SectionHeader from "../shared/SectionHeader";
import type { Testimonial } from "@/lib/api-types";
import { useT } from "@/providers/TranslationProvider";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useT();

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 340;
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <SectionHeader title={t('testimonials.title')} subtitle={t('testimonials.subtitle')} />

        <div className="relative">
          <div className="flex gap-2 justify-end mb-6">
            <button onClick={() => scroll("left")} className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors" aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll("right")} className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors" aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {testimonials.map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 0.05} className="snap-start flex-shrink-0 w-[320px]">
                <div className="rounded-2xl border border-border bg-card p-6 h-full flex flex-col">
                  <Quote className="text-[#8b5cf6]/30 mb-3" size={24} />
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">"{item.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                    <div>
                     <p className="text-sm font-semibold text-[#06b6d4]">{item.name}</p>
                      <p className="text-xs text-[#8b5cf6]">{item.course}</p>
                    </div>
                    {item.badge && (
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#e44d90]/10 text-[#e44d90] font-medium">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
