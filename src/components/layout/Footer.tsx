import { Link } from "react-router-dom";
import { useSettings } from "@/hooks";
import { useT } from "@/providers/TranslationProvider";

const Footer = () => {
  const { data: settings } = useSettings();
  const { t } = useT();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src="/images/logo.webp" alt="re:school" className="h-8 mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {t('footer.mission')}
            </p>
            <div className="flex gap-4">
              {settings ? (
                Object.entries(settings.social).map(([key, url]) => (
                  <a key={key} href={url || '#'} className="text-muted-foreground hover:text-[#8b5cf6] transition-colors text-sm">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </a>
                ))
              ) : (
                ["Facebook", "Instagram", "TikTok", "LinkedIn"].map(s => (
                  <a key={s} href="#" className="text-muted-foreground hover:text-[#8b5cf6] transition-colors text-sm">{s}</a>
                ))
              )}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "#e44d90" }}>{t('footer.courses_title')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/courses" className="hover:text-[#e44d90] transition-colors">{t('footer.courses.web_dev')}</Link></li>
              <li><Link to="/courses" className="hover:text-[#e44d90] transition-colors">{t('footer.courses.full_stack')}</Link></li>
              <li><Link to="/courses" className="hover:text-[#e44d90] transition-colors">{t('footer.courses.it_pm')}</Link></li>
              <li><Link to="/courses" className="hover:text-[#e44d90] transition-colors">{t('footer.courses.online_video')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "#8b5cf6" }}>{t('footer.company_title')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-[#8b5cf6] transition-colors">{t('footer.about_link')}</Link></li>
              <li><Link to="/students" className="hover:text-[#8b5cf6] transition-colors">{t('footer.students_link')}</Link></li>
              <li><Link to="/blog" className="hover:text-[#8b5cf6] transition-colors">{t('footer.blog_link')}</Link></li>
              <li><Link to="/contact" className="hover:text-[#8b5cf6] transition-colors">{t('footer.contact_link')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "#06b6d4" }}>{t('footer.contact_title')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{settings?.contact.phone || '+995 598 773 288'}</li>
              <li>{settings?.contact.email || 'info@reschool.world'}</li>
              <li>{settings?.contact.address || 'თბილისი, საქართველო'}</li>
              <li>{settings?.contact.working_hours || 'ორშ-პარ 10:00-19:00'}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} re:school. {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
