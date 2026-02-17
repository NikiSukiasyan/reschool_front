import AnimatedSection from "../shared/AnimatedSection";
import type { Partner } from "@/lib/api-types";
import { useT } from "@/providers/TranslationProvider";

interface PartnersProps {
  partners: Partner[];
}

const Partners = ({ partners }: PartnersProps) => {
  const { t } = useT();

  return (
    <section className="py-16 border-y border-border">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <p className="text-center text-sm text-[#06b6d4] mb-8 tracking-wider uppercase">{t('partners.trusted_partners')}</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {partners.map((partner) => (
              <span key={partner.id} className="text-xl md:text-2xl font-bold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
                {partner.name}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Partners;
