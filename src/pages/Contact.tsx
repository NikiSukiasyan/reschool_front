import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SEOHead from "@/components/shared/SEOHead";
import { toast } from "sonner";
import { useRegister, useCourses, useSettings } from "@/hooks";
import { useT } from "@/providers/TranslationProvider";

const brandColors = ["#e44d90", "#8b5cf6", "#3b82f6", "#06b6d4"];

const Contact = () => {
  const { t } = useT();
  const { data: settings } = useSettings();
  const { data: courses } = useCourses();
  const registerMutation = useRegister();

  const registrationSchema = z.object({
    first_name: z.string().min(1, t('validation.first_name_required')),
    last_name: z.string().min(1, t('validation.last_name_required')),
    phone: z.string().min(1, t('validation.phone_required')),
    email: z.string().email(t('validation.email_invalid')),
    course_id: z.number({ required_error: t('validation.course_required') }),
    city: z.string().min(1, t('validation.city_required')),
    message: z.string().optional(),
  });
  type RegistrationFormData = z.infer<typeof registrationSchema>;

  const cityOptions = [
    { value: "თბილისი", label: t('cities.tbilisi') },
    { value: "ბათუმი", label: t('cities.batumi') },
    { value: "ქუთაისი", label: t('cities.kutaisi') },
    { value: "რუსთავი", label: t('cities.rustavi') },
    { value: "ზუგდიდი", label: t('cities.zugdidi') },
  ];

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const contactInfo = settings ? [
    { icon: Phone, label: t('contact.phone_label'), value: settings.contact.phone, color: "#e44d90" },
    { icon: Mail, label: t('contact.email_label'), value: settings.contact.email, color: "#8b5cf6" },
    { icon: MapPin, label: t('contact.address_label'), value: settings.contact.address, color: "#3b82f6" },
    { icon: Clock, label: t('contact.working_hours_label'), value: settings.contact.working_hours, color: "#06b6d4" },
  ] : [];

  const onSubmit = form.handleSubmit((data) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success(t('contact.success'));
        form.reset();
      },
      onError: () => {
        toast.error(t('contact.error'));
      },
    });
  });

  const inputClass = "w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 transition-all";
  const selectClass = `${inputClass} appearance-none`;

  return (
    <>
      <SEOHead
        title={t('contact.page_title')}
        description={t('contact.page_description')}
        path="/contact"
      />
      <Navbar />
      <main className="pt-24">
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                <span className="gradient-text">{t('contact.hero_title')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {t('contact.hero_subtitle')}
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
              {/* Contact info */}
              <div className="lg:col-span-2 space-y-4">
                {contactInfo.map((c) => (
                  <AnimatedSection key={c.label}>
                    <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4 hover:border-opacity-30 transition-all">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}15` }}>
                        <c.icon size={18} style={{ color: c.color }} />
                      </div>
                      <div>
                        <p className="text-xs mb-0.5" style={{ color: c.color }}>{c.label}</p>
                        <p className="text-sm font-medium text-foreground">{c.value}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
                <AnimatedSection delay={0.3}>
                  <div className="flex gap-3 pt-4">
                    {settings && ['facebook', 'instagram', 'tiktok', 'linkedin'].map((key, i) => {
                      const url = settings.social[key as keyof typeof settings.social];
                      return (
                        <a key={key} href={url || '#'} className="px-3 py-1.5 rounded-lg bg-secondary text-xs text-muted-foreground transition-colors" style={{ ['--hover-color' as any]: brandColors[i % brandColors.length] }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </a>
                      );
                    })}
                    {!settings && ["Facebook", "Instagram", "TikTok", "LinkedIn"].map((s, i) => (
                      <a key={s} href="#" className="px-3 py-1.5 rounded-lg bg-secondary text-xs text-muted-foreground transition-colors" style={{ ['--hover-color' as any]: brandColors[i % brandColors.length] }}>
                        {s}
                      </a>
                    ))}
                  </div>
                </AnimatedSection>
              </div>

              {/* Form */}
              <AnimatedSection className="lg:col-span-3" delay={0.2}>
                <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-8 space-y-4">
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#8b5cf6" }}>{t('contact.form_title')}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <input {...form.register('first_name')} placeholder={t('contact.first_name')} className={inputClass} />
                      {form.formState.errors.first_name && (
                        <p className="text-xs text-red-400 mt-1">{form.formState.errors.first_name.message}</p>
                      )}
                    </div>
                    <div>
                      <input {...form.register('last_name')} placeholder={t('contact.last_name')} className={inputClass} />
                      {form.formState.errors.last_name && (
                        <p className="text-xs text-red-400 mt-1">{form.formState.errors.last_name.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <input {...form.register('phone')} type="tel" placeholder={t('contact.phone')} className={inputClass} />
                      {form.formState.errors.phone && (
                        <p className="text-xs text-red-400 mt-1">{form.formState.errors.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <input {...form.register('email')} type="email" placeholder={t('contact.email')} className={inputClass} />
                      {form.formState.errors.email && (
                        <p className="text-xs text-red-400 mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <select {...form.register('course_id', { valueAsNumber: true })} className={selectClass}>
                        <option value="">{t('contact.select_course')}</option>
                        {courses?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                      {form.formState.errors.course_id && (
                        <p className="text-xs text-red-400 mt-1">{form.formState.errors.course_id.message}</p>
                      )}
                    </div>
                    <div>
                      <select {...form.register('city')} className={selectClass}>
                        <option value="">{t('contact.select_city')}</option>
                        {cityOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                      {form.formState.errors.city && (
                        <p className="text-xs text-red-400 mt-1">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                  </div>
                  <textarea {...form.register('message')} placeholder={t('contact.message')} rows={4} className={inputClass} />
                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                    style={{ background: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)", boxShadow: "0 4px 20px -4px rgba(139, 92, 246, 0.4)" }}
                  >
                    {registerMutation.isPending ? t('contact.sending') : <><Send size={16} /> {t('contact.submit')}</>}
                  </button>
                </form>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
