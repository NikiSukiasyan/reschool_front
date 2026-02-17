import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Partners from "@/components/sections/Partners";
import CoursesSection from "@/components/sections/CoursesSection";
import Process from "@/components/sections/Process";
import WhyUs from "@/components/sections/WhyUs";
import Testimonials from "@/components/sections/Testimonials";
import CTASection from "@/components/sections/CTASection";
import SEOHead from "@/components/shared/SEOHead";
import { organizationJsonLd } from "@/lib/seo";
import { useHomePage, useSettings } from "@/hooks";

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const { data, isPending } = useHomePage();
  const { data: settings } = useSettings();

  if (isPending || !data) {
    return <Loading />;
  }

  return (
    <>
      <SEOHead
        path="/"
        jsonLd={organizationJsonLd(settings?.social)}
      />
      <Navbar />
      <main>
        <Hero statistics={data.statistics} banners={data.banners} heroCards={data.hero_cards} />
        <Partners partners={data.partners} />
        <CoursesSection courses={data.courses} />
        <Process steps={data.process} />
        <WhyUs cards={data.why_us} />
        <Testimonials testimonials={data.testimonials} />
        <CTASection phone={settings?.contact.phone} />
      </main>
      <Footer />
    </>
  );
};

export default Index;
