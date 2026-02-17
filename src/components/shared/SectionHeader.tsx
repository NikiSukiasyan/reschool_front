import AnimatedSection from "./AnimatedSection";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
}

const SectionHeader = ({ title, subtitle, gradient = true }: SectionHeaderProps) => (
  <AnimatedSection className="text-center mb-12 2xl:mb-16">
    <h2 className={`text-fluid-section font-bold mb-4 ${gradient ? "gradient-text" : ""}`}>
      {title}
    </h2>
    {subtitle && (
      <p className="text-muted-foreground text-fluid-body max-w-2xl mx-auto">{subtitle}</p>
    )}
  </AnimatedSection>
);

export default SectionHeader;
