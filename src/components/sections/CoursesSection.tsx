import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import AnimatedSection from "../shared/AnimatedSection";
import SectionHeader from "../shared/SectionHeader";
import type { CourseList } from "@/lib/api-types";
import { useT } from "@/providers/TranslationProvider";

const brandColors = ["#e44d90", "#8b5cf6", "#3b82f6", "#06b6d4"];

interface CoursesSectionProps {
  courses: CourseList[];
}

const CoursesSection = ({ courses }: CoursesSectionProps) => {
  const { t } = useT();

  return (
    <section className="py-fluid-section">
      <div className="container mx-auto px-4">
        <SectionHeader title={t('courses_section.title')} subtitle={t('courses_section.subtitle')} />

        <div className="grid md:grid-cols-2 gap-fluid">
          {courses.map((course, i) => {
            const color = brandColors[i % brandColors.length];
            return (
              <AnimatedSection key={course.id} delay={i * 0.1}>
                <div className="group relative rounded-2xl border border-border bg-card p-6 hover:border-opacity-30 transition-all duration-300 h-full" style={{ ['--hover-border' as any]: `${color}50` }}>
                  <div className="flex items-start gap-4 mb-4">
                    <img src={course.image} alt={course.title} className="w-16 h-16 flex-shrink-0" loading="lazy" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold transition-colors" style={{ color }}>{course.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{course.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{course.description}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} style={{ color }} /> {course.duration}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{course.format}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {course.technologies.slice(0, 5).map((tech) => (
                      <span key={tech.id} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground">{tech.name}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/courses/${course.slug}`}
                      className="text-sm font-medium hover:underline inline-flex items-center gap-1 transition-colors"
                      style={{ color }}
                    >
                      {t('courses_section.view_details')} <ArrowRight size={14} />
                    </Link>
                    <Link
                      to="/contact"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('courses_section.register')}
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
