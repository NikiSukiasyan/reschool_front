import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SEOHead from "@/components/shared/SEOHead";
import { useTestimonials } from "@/hooks";
import { Quote, Loader2 } from "lucide-react";
import { useT } from "@/providers/TranslationProvider";

const brandColors = ["#e44d90", "#8b5cf6", "#3b82f6", "#06b6d4"];

const Students = () => {
  const [active, setActive] = useState("all");
  const { data: testimonials, isPending } = useTestimonials();
  const { t } = useT();

  const filters = [
    { id: "all", label: t('students.filter.all') },
    { id: "development", label: t('students.filter.development') },
    { id: "design", label: t('students.filter.design') },
    { id: "management", label: t('students.filter.management') },
  ];

  const stats = [
    { value: "1000+", label: t('students.stat.graduates'), color: "#e44d90" },
    { value: "85%", label: t('students.stat.employment'), color: "#8b5cf6" },
    { value: "40+", label: t('students.stat.partners'), color: "#3b82f6" },
    { value: "4.9/5", label: t('students.stat.rating'), color: "#06b6d4" },
  ];

  const filtered = testimonials ? (active === "all" ? testimonials : testimonials.filter((item) => item.category === active)) : [];

  return (
    <>
      <SEOHead
        title={t('students.page_title')}
        description={t('students.page_description')}
        path="/students"
      />
      <Navbar />
      <main className="pt-24">
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                <span className="gradient-text">{t('students.hero_title')}</span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="flex justify-center gap-8 md:gap-12 mt-8">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActive(f.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    active === f.id
                      ? "text-white"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                  style={active === f.id ? { background: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" } : {}}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {isPending && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isPending && !filtered.length && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">{t('students.no_testimonials')}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => {
                const color = brandColors[i % brandColors.length];
                return (
                  <AnimatedSection key={item.id} delay={i * 0.05}>
                    <div className="rounded-2xl border border-border bg-card p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                        <div>
                          <p className="font-semibold text-sm" style={{ color }}>{item.name}</p>
                          <p className="text-xs" style={{ color: brandColors[(i + 2) % brandColors.length] }}>{item.course}</p>
                        </div>
                        {item.badge && (
                          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${color}15`, color }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <Quote className="mb-2 opacity-20" size={20} style={{ color }} />
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{item.quote}"</p>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Students;
