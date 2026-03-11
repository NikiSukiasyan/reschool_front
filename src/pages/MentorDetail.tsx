import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Linkedin, Facebook, Mail, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import SEOHead from "@/components/shared/SEOHead";
import { useMentorDetail } from "@/hooks";
import { useT } from "@/providers/TranslationProvider";

const brandColors = ["#e44d90", "#8b5cf6", "#3b82f6", "#06b6d4"];

const MentorDetail = () => {
  const { t } = useT();
  const { id } = useParams<{ id: string }>();
  const { data: mentor, isPending, isError } = useMentorDetail(id!);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isPending) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </>
    );
  }

  if (isError || !mentor) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t('mentor_detail.not_found')}</h1>
            <Link to="/about" className="text-primary hover:underline">{t('mentor_detail.back_to_about')}</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const hasSocial = mentor.linkedin || mentor.facebook || mentor.email;

  return (
    <>
      <SEOHead
        title={mentor.name}
        description={mentor.bio || mentor.role}
        path={`/mentors/${id}`}
        image={mentor.photo || undefined}
      />
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15 blur-[120px]" style={{ background: "hsl(265, 85%, 65%)" }} />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <Link to="/about" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#e44d90] transition-colors mb-8">
                <ArrowLeft size={14} /> {t('mentor_detail.back_to_about')}
              </Link>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Photo */}
                <div className="flex-shrink-0">
                  {mentor.photo ? (
                    <img
                      src={mentor.photo}
                      alt={mentor.name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover"
                    />
                  ) : (
                    <div
                      className="w-32 h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center text-4xl font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #e44d90, #8b5cf6)" }}
                    >
                      {mentor.name.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-black gradient-text mb-2">{mentor.name}</h1>
                  <p className="text-lg font-medium" style={{ color: "#e44d90" }}>{mentor.role}</p>

                  {/* Social Links */}
                  {hasSocial && (
                    <div className="flex gap-3 mt-4">
                      {mentor.linkedin && (
                        <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-[#0A66C2] transition-colors">
                          <Linkedin size={18} />
                        </a>
                      )}
                      {mentor.facebook && (
                        <a href={mentor.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-[#1877F2] transition-colors">
                          <Facebook size={18} />
                        </a>
                      )}
                      {mentor.email && (
                        <a href={`mailto:${mentor.email}`} className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-[#e44d90] transition-colors">
                          <Mail size={18} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Bio */}
        {mentor.bio && (
          <section className="pb-16">
            <div className="container mx-auto px-4">
              <AnimatedSection delay={0.1}>
                <div className="max-w-3xl">
                  <h2 className="text-xl font-bold mb-4" style={{ color: "#8b5cf6" }}>{t('mentor_detail.bio_title')}</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{mentor.bio}</p>
                </div>
              </AnimatedSection>
            </div>
          </section>
        )}

        {/* Info Grid */}
        {(mentor.experience_years || (mentor.specializations && mentor.specializations.length > 0)) && (
          <section className="pb-16">
            <div className="container mx-auto px-4">
              <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
                {mentor.experience_years && (
                  <AnimatedSection delay={0.15}>
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <p className="text-sm text-muted-foreground mb-1">{t('mentor_detail.experience')}</p>
                      <p className="text-3xl font-black" style={{ color: "#3b82f6" }}>
                        {mentor.experience_years} <span className="text-base font-medium text-muted-foreground">{t('mentor_detail.years')}</span>
                      </p>
                    </div>
                  </AnimatedSection>
                )}
                {mentor.specializations && mentor.specializations.length > 0 && (
                  <AnimatedSection delay={0.2}>
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <p className="text-sm text-muted-foreground mb-3">{t('mentor_detail.specializations')}</p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.specializations.map((spec, i) => (
                          <span
                            key={spec}
                            className="text-xs px-3 py-1.5 rounded-full font-medium"
                            style={{ background: `${brandColors[i % brandColors.length]}15`, color: brandColors[i % brandColors.length] }}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Courses */}
        {mentor.courses && mentor.courses.length > 0 && (
          <section className="py-16 bg-card/30">
            <div className="container mx-auto px-4">
              <SectionHeader title={t('mentor_detail.courses_title')} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {mentor.courses.map((course, i) => {
                  const color = brandColors[i % brandColors.length];
                  return (
                    <AnimatedSection key={course.id} delay={i * 0.08}>
                      <Link to={`/courses/${course.slug}`} className="block">
                        <div className="rounded-2xl border border-border bg-card p-6 hover:border-opacity-30 transition-all group">
                          <img src={course.image} alt={course.title} className="w-16 h-16 mb-4" loading="lazy" />
                          <h3 className="font-bold group-hover:underline" style={{ color }}>{course.title}</h3>
                        </div>
                      </Link>
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

export default MentorDetail;
