import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Calendar, DollarSign, BookOpen, ArrowLeft, Monitor, Award, CheckCircle, Cpu, Mail, Phone, Loader2, CreditCard, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/shared/SEOHead";
import { courseJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { useCourse, useSettings } from "@/hooks";
import { useT } from "@/providers/TranslationProvider";
import { api } from "@/lib/api";

const brandColors = ["#e44d90", "#8b5cf6", "#3b82f6", "#06b6d4"];

const CourseDetail = () => {
  const { t } = useT();
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isPending, isError } = useCourse(slug!);
  const { data: settings } = useSettings();
  const [activeStage, setActiveStage] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ first_name: "", last_name: "", tel: "", email: "" });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      const res = await api.post("/flitt/checkout", {
        course_slug: course.slug,
        first_name: paymentForm.first_name,
        last_name: paymentForm.last_name,
        tel: paymentForm.tel,
        email: paymentForm.email,
      });
      window.location.href = res.data.checkout_url;
    } catch (err: any) {
      setPaymentError(err?.response?.data?.message || err?.response?.data?.error || "შეცდომა. სცადეთ თავიდან.");
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  if (isError || !course) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t('course_detail.not_found')}</h1>
            <Link to="/courses" className="text-primary hover:underline">{t('course_detail.back_to_courses')}</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const stage = course.stages[activeStage] ?? null;

  const contactEmail = settings?.contact.email ?? "reschoolspace@gmail.com";
  const contactPhone = settings?.contact.phone ?? "+995 551 420 099";

  return (
    <>
      <SEOHead
        title={course.meta_title || course.title}
        description={course.meta_description || course.description}
        path={`/courses/${course.slug}`}
        image={course.og_image || course.image || undefined}
        jsonLd={courseJsonLd(course)}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd([
            { name: t('course_detail.back_link'), url: '/courses' },
            { name: course.title, url: `/courses/${course.slug}` },
          ]))}
        </script>
      </Helmet>
      <Navbar />
      <main className="pt-24">
        {/* Location Selector */}
        <section className="border-b border-border bg-card/50">
          <div className="container mx-auto px-4 py-8">
            <AnimatedSection>
              <h2 className="text-lg font-bold mb-4" style={{ color: "#8b5cf6" }}>{t('course_detail.select_location')}</h2>
              <div className="flex flex-wrap gap-3">
                {course.locations.map((loc, i) => (
                  <button
                    key={loc.city}
                    onClick={() => setSelectedLocation(i)}
                    className={`px-5 py-3 rounded-xl text-sm font-medium transition-all border ${
                      selectedLocation === i
                        ? "border-transparent text-white"
                        : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                    }`}
                    style={selectedLocation === i ? { background: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" } : {}}
                  >
                    <div className="font-semibold">{loc.city}</div>
                    <div className="text-[11px] opacity-75 mt-0.5">{loc.address}</div>
                  </button>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Hero */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15 blur-[120px]" style={{ background: "hsl(265, 85%, 65%)" }} />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#e44d90] transition-colors mb-6">
                <ArrowLeft size={14} /> {t('course_detail.back_link')}
              </Link>
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={course.image} alt={course.title} className="w-20 h-20" />
                    <div>
                      <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" }}>{course.title}</h1>
                      <p className="font-medium text-sm mt-1" style={{ color: "#e44d90" }}>({course.subtitle})</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="text-foreground font-medium">{course.instructor}</span> {t('course_detail.additional_modules')}
                  </p>
                  <div className="text-muted-foreground leading-relaxed mt-4 whitespace-pre-line text-sm">
                    {course.full_description}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={`/contact?course=${course.slug}`}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)", boxShadow: "0 4px 20px -4px rgba(139, 92, 246, 0.4)" }}
                    >
                      {t('course_detail.register_button')}
                    </Link>
                    {course.has_payment && course.price && (
                      <button
                        onClick={() => setPaymentModal(true)}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105 border-2"
                        style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
                      >
                        <CreditCard size={16} />
                        ონლაინ გადახდა — {course.price} ₾
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Stage Tabs */}
        <section className="border-y border-border bg-card/30">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {course.stages.map((s, i) => {
                const color = brandColors[i % brandColors.length];
                return (
                  <button
                    key={i}
                    onClick={() => setActiveStage(i)}
                    className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeStage === i
                        ? "border-current"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    style={activeStage === i ? { color, borderColor: color } : {}}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stage Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Meta Info Cards */}
            <section className="py-10">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <MetaCard icon={Calendar} label={t('course_detail.start_date')} value={stage?.start_date ?? '—'} color="#e44d90" />
                  <MetaCard icon={Clock} label={t('course_detail.duration')} value={stage?.duration ?? '—'} color="#8b5cf6" />
                  <MetaCard icon={MapPin} label={t('course_detail.location')} value={course.locations[selectedLocation]?.city ?? '—'} color="#3b82f6" />
                  <MetaCard icon={BookOpen} label={t('course_detail.schedule')} value={stage?.schedule ?? '—'} color="#06b6d4" />
                  <MetaCard icon={DollarSign} label={t('course_detail.price')} value={stage?.price ?? '—'} color="#e44d90" />
                </div>
              </div>
            </section>

            {/* Course Content */}
            <section className="pb-12">
              <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-12">
                    {stage && <ContentSection title={t('course_detail.goal')} content={stage.goal} color="#e44d90" />}
                    {stage && <ContentSection title={t('course_detail.prerequisite')} content={stage.prerequisite} color="#8b5cf6" />}

                    {/* Topics */}
                    {stage && <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "#3b82f6" }}>
                        <BookOpen size={20} style={{ color: "#3b82f6" }} />
                        {t('course_detail.topics')}
                      </h3>
                      <div className="space-y-3">
                        {stage.topics.map((topic, i) => (
                          <motion.div
                            key={topic.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border border-border hover:border-[#3b82f6]/30 transition-colors"
                          >
                            <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: `${brandColors[i % brandColors.length]}15`, color: brandColors[i % brandColors.length] }}>
                              {i + 1}
                            </span>
                            <span className="text-sm text-foreground">{topic.title}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>}

                    {/* Outcomes */}
                    {stage && <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "#06b6d4" }}>
                        <Award size={20} style={{ color: "#06b6d4" }} />
                        {t('course_detail.outcomes')}
                      </h3>
                      <div className="space-y-2">
                        {stage.outcomes.map((outcome, i) => (
                          <motion.div
                            key={outcome.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle size={16} className="flex-shrink-0 mt-1" style={{ color: brandColors[i % brandColors.length] }} />
                            <span className="text-sm text-muted-foreground">{outcome.title}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>}

                    {/* Computer Requirements */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#e44d90" }}>
                        <Cpu size={20} style={{ color: "#e44d90" }} />
                        {t('course_detail.computer_requirements')}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{course.computer_requirements}</p>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
                      <h3 className="font-bold text-foreground mb-4">{t('course_detail.interested')}</h3>
                      <Link
                        to={`/contact?course=${course.slug}`}
                        className="w-full flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-white mb-3"
                        style={{ background: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" }}
                      >
                        {t('course_detail.register_button')}
                      </Link>
                      {course.has_payment && course.price && (
                        <button
                          onClick={() => setPaymentModal(true)}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border-2 transition-all hover:scale-[1.02] mb-4"
                          style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
                        >
                          <CreditCard size={14} />
                          გადახდა — {course.price} ₾
                        </button>
                      )}
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Monitor size={14} style={{ color: "#8b5cf6" }} />
                          <span>{course.format}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock size={14} style={{ color: "#3b82f6" }} />
                          <span>{course.duration}</span>
                        </div>
                        {course.certificate && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Award size={14} style={{ color: "#06b6d4" }} />
                            <span>{t('course_detail.certificate')}</span>
                          </div>
                        )}
                        {course.internship && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle size={14} style={{ color: "#e44d90" }} />
                            <span>{t('course_detail.internship')}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2">{t('course_detail.technologies')}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {course.technologies.map((tech, i) => (
                            <span key={tech.id} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors" style={{ borderLeft: `2px solid ${brandColors[i % brandColors.length]}` }}>
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h4 className="font-bold text-sm mb-4" style={{ color: "#06b6d4" }}>{t('course_detail.contact_info')}</h4>
                      <div className="space-y-3 text-sm">
                        <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-muted-foreground hover:text-[#e44d90] transition-colors">
                          <Mail size={14} /> {contactEmail}
                        </a>
                        <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-muted-foreground hover:text-[#8b5cf6] transition-colors">
                          <Phone size={14} /> {contactPhone}
                        </a>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border space-y-2">
                        <p className="text-xs font-semibold text-foreground">{t('course_detail.addresses')}</p>
                        {course.locations.map((loc, i) => (
                          <div key={loc.city} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <MapPin size={12} className="mt-0.5 flex-shrink-0" style={{ color: brandColors[i % brandColors.length] }} />
                            <div>
                              <span className="font-medium text-foreground">{loc.city}</span>
                              <br />
                              {loc.address}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

        {/* Mentors */}
        {course.mentors && course.mentors.length > 0 && (
          <section className="py-12 bg-card/30">
            <div className="container mx-auto px-4">
              <h3 className="text-xl font-bold mb-6" style={{ color: "#8b5cf6" }}>{t('course_detail.mentors')}</h3>
              <div className="flex flex-wrap gap-4">
                {course.mentors.map((m, i) => {
                  const color = brandColors[i % brandColors.length];
                  return (
                    <Link key={m.id} to={`/mentors/${m.id}`} className="group">
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-opacity-30 transition-all">
                        {m.photo ? (
                          <img src={m.photo} alt={m.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${color}, ${brandColors[(i + 1) % brandColors.length]})` }}
                          >
                            {m.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold group-hover:underline" style={{ color }}>{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.role}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setPaymentModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setPaymentModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}>
                  <CreditCard size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">ონლაინ გადახდა</h2>
                  <p className="text-sm text-muted-foreground">{course.title} — {course.price} ₾</p>
                </div>
              </div>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">სახელი</label>
                    <input
                      type="text"
                      required
                      placeholder="სახელი"
                      value={paymentForm.first_name}
                      onChange={(e) => setPaymentForm(f => ({ ...f, first_name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">გვარი</label>
                    <input
                      type="text"
                      required
                      placeholder="გვარი"
                      value={paymentForm.last_name}
                      onChange={(e) => setPaymentForm(f => ({ ...f, last_name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">ტელეფონი</label>
                  <input
                    type="tel"
                    required
                    placeholder="+995 5XX XXX XXX"
                    value={paymentForm.tel}
                    onChange={(e) => setPaymentForm(f => ({ ...f, tel: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">ელ. ფოსტა</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={paymentForm.email}
                    onChange={(e) => setPaymentForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
                  />
                </div>
                {paymentError && (
                  <p className="text-sm text-red-500">{paymentError}</p>
                )}
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}
                >
                  {paymentLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <CreditCard size={16} />
                      გადახდის გვერდზე გადასვლა
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const MetaCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <div className="rounded-xl border border-border bg-card p-4 hover:border-opacity-30 transition-colors" style={{ borderColor: undefined }}>
    <div className="flex items-center gap-2 mb-1">
      <Icon size={14} style={{ color }} />
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
    <p className="text-sm font-semibold text-foreground">{value}</p>
  </div>
);

const ContentSection = ({ title, content, color }: { title: string; content: string; color: string }) => (
  <div>
    <h3 className="text-xl font-bold mb-4" style={{ color }}>{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
  </div>
);

export default CourseDetail;
