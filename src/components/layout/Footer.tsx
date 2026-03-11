import { useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "@/hooks";
import { useT } from "@/providers/TranslationProvider";
import { api } from "@/lib/api";

interface CertResult {
  found: boolean;
  student_name?: string;
  course_title?: string;
  has_file?: boolean;
  file_url?: string;
}

const CertificateChecker = () => {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<CertResult | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    const n = value.trim().toUpperCase();
    if (!n) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.get(`/certificates/${encodeURIComponent(n)}`);
      setResult(data);
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-border mt-10 pt-8">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1" style={{ color: "#8b5cf6" }}>
            სერთიფიკატის შემოწმება
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            შეიყვანეთ სერთიფიკატის ნომერი (მაგ. RS-10097-2026)
          </p>
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => e.key === "Enter" && check()}
              placeholder="RS-XXXXX-XXXX"
              className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50 uppercase tracking-widest"
            />
            <button
              onClick={check}
              disabled={loading || !value.trim()}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}
            >
              {loading ? "..." : "შემოწმება"}
            </button>
          </div>

          {result && (
            <div
              className={`mt-2.5 text-xs rounded-lg px-3 py-2.5 border ${
                result.found
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-red-500/30 bg-red-500/5"
              }`}
            >
              {result.found ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-green-500 font-medium">✓ სერთიფიკატი ნაპოვნია</span>
                  <span className="text-muted-foreground">
                    {result.student_name} · {result.course_title}
                  </span>
                  {result.has_file && result.file_url && (
                    <a
                      href={result.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8b5cf6] font-semibold hover:underline"
                    >
                      სერთიფიკატის ნახვა →
                    </a>
                  )}
                </div>
              ) : (
                <span className="text-red-500 font-medium">✗ სერთიფიკატი ვერ მოიძებნა</span>
              )}
            </div>
          )}
        </div>

        <Link
          to="/certificate"
          className="text-xs text-muted-foreground hover:text-[#8b5cf6] transition-colors md:mt-7 whitespace-nowrap"
        >
          სრული გვერდი →
        </Link>
      </div>
    </div>
  );
};

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

        <CertificateChecker />

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} re:school. {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
