import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import SEOHead from "@/components/shared/SEOHead";
import { useAboutPage } from "@/hooks";
import { getIcon } from "@/lib/icons";
import { useT } from "@/providers/TranslationProvider";

const brandColors = ["#e44d90", "#8b5cf6", "#3b82f6", "#06b6d4"];

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
  </div>
);

const About = () => {
  const { data, isPending } = useAboutPage();
  const { t } = useT();

  if (isPending || !data) {
    return <Loading />;
  }

  return (
    <>
      <SEOHead
        title={t('about.page_title')}
        description={t('about.page_description')}
        path="/about"
      />
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                <span className="gradient-text">{t('about.hero_title')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('about.hero_description')}
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="flex justify-center gap-12 mt-12">
                {data.statistics.map((stat) => (
                  <div key={stat.id} className="text-center">
                    <div className="text-4xl font-black" style={{ color: stat.color }}>
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-card/30">
          <div className="container mx-auto px-4">
            <SectionHeader title={t('about.values_title')} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.values.map((v, i) => {
                const color = brandColors[i % brandColors.length];
                const Icon = getIcon(v.icon);
                return (
                  <AnimatedSection key={v.id} delay={i * 0.08}>
                    <div className="rounded-2xl border border-border bg-card p-6 h-full hover:border-[color]/20 transition-all group">
                      <Icon className="mb-4" size={28} style={{ color }} />
                      <h3 className="font-bold mb-2" style={{ color }}>{v.title}</h3>
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <SectionHeader title={t('about.timeline_title')} />
            <div className="max-w-2xl mx-auto space-y-0">
              {data.timeline.map((item, i) => {
                const color = brandColors[i % brandColors.length];
                return (
                  <AnimatedSection key={item.id} delay={i * 0.1}>
                    <div className="flex gap-6 pb-10 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                        {i < data.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                      </div>
                      <div className="pb-2">
                        <span className="text-xs font-bold" style={{ color }}>{item.year}</span>
                        <h3 className="font-bold" style={{ color }}>{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mentors */}
        <section className="py-24 bg-card/30">
          <div className="container mx-auto px-4">
            <SectionHeader title={t('about.team_title')} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {data.mentors.map((m, i) => {
                const color = brandColors[i % brandColors.length];
                return (
                  <AnimatedSection key={m.id} delay={i * 0.1}>
                    <Link to={`/mentors/${m.id}`} className="block cursor-pointer">
                      <div className="text-center p-6 rounded-2xl border border-border bg-card hover:border-opacity-30 transition-all">
                        {m.photo ? (
                          <img
                            src={m.photo}
                            alt={m.name}
                            className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${color}, ${brandColors[(i + 1) % brandColors.length]})` }}
                          >
                            {m.name.charAt(0)}
                          </div>
                        )}
                        <h3 className="font-bold text-sm" style={{ color }}>{m.name}</h3>
                        <p className="text-xs mt-1" style={{ color: brandColors[(i + 2) % brandColors.length] }}>{m.role}</p>
                      </div>
                    </Link>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="py-24">
            <div className="container mx-auto px-4">
              <SectionHeader title={t('about.projects_title')} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {data.projects.map((project, i) => {
                  const color = brandColors[i % brandColors.length];
                  return (
                    <AnimatedSection key={project.id} delay={i * 0.08}>
                      <a
                        href={project.url}
                        target={project.link_target === 'blank' ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-opacity-30 transition-all">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="w-full h-40 flex items-center justify-center text-3xl font-bold text-white"
                              style={{ background: `linear-gradient(135deg, ${color}, ${brandColors[(i + 1) % brandColors.length]})` }}
                            >
                              {project.title.charAt(0)}
                            </div>
                          )}
                          <div className="p-5 flex items-center justify-between">
                            <h3 className="font-bold text-sm" style={{ color }}>{project.title}</h3>
                            {project.link_target === 'blank' && (
                              <ExternalLink size={14} className="text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </a>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default About;
