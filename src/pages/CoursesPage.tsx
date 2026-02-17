import { Link } from "react-router-dom";
import { Clock, Monitor, Award, Users, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SEOHead from "@/components/shared/SEOHead";
import { useCourses } from "@/hooks";
import { useT } from "@/providers/TranslationProvider";

const brandColors = ["#e44d90", "#8b5cf6", "#3b82f6", "#06b6d4"];

const CoursesPage = () => {
  const { data: courses, isPending } = useCourses();
  const { t } = useT();

  return (
    <>
      <SEOHead
        title={t('courses_page.title')}
        description={t('courses_page.description')}
        path="/courses"
      />
      <Navbar />
      <main className="pt-24">
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                <span className="gradient-text">{t('courses_page.hero_title')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('courses_page.hero_subtitle')}
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-4 space-y-8">
            {isPending && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {!courses?.length && !isPending && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">{t('courses_page.no_courses')}</p>
              </div>
            )}
            {courses?.map((course, i) => {
              const color = brandColors[i % brandColors.length];
              return (
                <AnimatedSection key={course.slug} delay={i * 0.1}>
                  <div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-opacity-30 transition-all" style={{ borderColor: undefined }}>
                    <div className="p-8 md:p-10">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-shrink-0 flex items-start">
                          <img src={course.image} alt={course.title} className="w-24 h-24 md:w-32 md:h-32" loading="lazy" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold mb-1" style={{ color }}>{course.title}</h2>
                          <p className="text-sm mb-4" style={{ color: brandColors[(i + 1) % brandColors.length] }}>{course.subtitle}</p>
                          <p className="text-muted-foreground leading-relaxed mb-6">{course.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                              { icon: Clock, text: course.duration, c: "#e44d90" },
                              { icon: Monitor, text: course.format, c: "#8b5cf6" },
                              { icon: Award, text: course.certificate ? t('courses_page.certificate') : "—", c: "#3b82f6" },
                              { icon: Users, text: course.internship ? t('courses_page.internship') : "—", c: "#06b6d4" },
                            ].map(({ icon: Icon, text, c }) => (
                              <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon size={16} style={{ color: c }} /> {text}
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-6">
                            {course.technologies.map((tech) => (
                              <span key={tech.id} className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">{tech.name}</span>
                            ))}
                          </div>

                          <div className="flex gap-3">
                            <Link
                              to={`/courses/${course.slug}`}
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                              style={{ background: `linear-gradient(135deg, ${color}, ${brandColors[(i + 1) % brandColors.length]})` }}
                            >
                              {t('courses_page.view_details')} <ArrowRight size={14} />
                            </Link>
                            <Link
                              to="/contact"
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-secondary transition-all"
                            >
                              {t('courses_page.register')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CoursesPage;
