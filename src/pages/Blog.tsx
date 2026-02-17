import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SEOHead from "@/components/shared/SEOHead";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { useBlogPosts } from "@/hooks";
import { formatGeorgianDate } from "@/lib/date";
import { useT } from "@/providers/TranslationProvider";

const categoryColors: Record<string, string> = {
  "კარიერა": "bg-[#8b5cf6]/10 text-[#8b5cf6]",
  "დეველოპმენტი": "bg-accent/10 text-accent",
  "დიზაინი": "bg-pink-500/10 text-pink-400",
  "მენეჯმენტი": "bg-amber-500/10 text-amber-400",
  "ტექნოლოგია": "bg-emerald-500/10 text-emerald-400",
  "ისტორია": "bg-violet-500/10 text-violet-400",
};

const Blog = () => {
  const { data: blogPosts, isPending } = useBlogPosts();
  const { t } = useT();

  if (isPending) {
    return (
      <>
        <SEOHead
          title={t('blog.page_title')}
          description={t('blog.page_description')}
          path="/blog"
        />
        <Navbar />
        <main className="pt-24 min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </>
    );
  }

  if (!blogPosts?.length) {
    return (
      <>
        <SEOHead
          title={t('blog.page_title')}
          description={t('blog.page_description')}
          path="/blog"
        />
        <Navbar />
        <main className="pt-24 min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">{t('blog.no_articles')}</p>
        </main>
        <Footer />
      </>
    );
  }

  const featured = blogPosts.find((p) => p.is_featured) ?? blogPosts[0];
  const posts = blogPosts.filter((p) => p.slug !== featured.slug);

  return (
    <>
      <SEOHead
        title={t('blog.page_title')}
        description={t('blog.page_description')}
        path="/blog"
      />
      <Navbar />
      <main className="pt-24">
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                <span className="gradient-text">{t('blog.hero_title')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {t('blog.hero_subtitle')}
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-4">
            {/* Featured */}
            <AnimatedSection className="mb-12">
              <Link to={`/blog/${featured.slug}`} className="block">
                <div className="rounded-2xl border border-border bg-card overflow-hidden group cursor-pointer hover:border-[#8b5cf6]/30 transition-all">
                  <div className="h-48 md:h-64 relative" style={{ background: "var(--gradient-subtle)" }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl md:text-8xl font-black bg-clip-text text-transparent opacity-20" style={{ backgroundImage: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" }}>BLOG</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[featured.category] || "bg-secondary text-muted-foreground"}`}>{featured.category}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-3 group-hover:text-[#8b5cf6] transition-colors">{featured.title}</h2>
                    <p className="text-muted-foreground mb-4">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={12} style={{ color: "#e44d90" }} /> {formatGeorgianDate(featured.date)}</span>
                      <span className="flex items-center gap-1"><Clock size={12} style={{ color: "#06b6d4" }} /> {featured.read_time}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <AnimatedSection key={post.id} delay={i * 0.08}>
                  <Link to={`/blog/${post.slug}`} className="block h-full">
                    <div className="rounded-2xl border border-border bg-card overflow-hidden h-full group cursor-pointer hover:border-[#8b5cf6]/30 transition-all">
                      <div className="h-32 relative" style={{ background: "var(--gradient-subtle)" }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-black" style={{ color: `${["#e44d90", "#8b5cf6", "#3b82f6", "#06b6d4"][i % 4]}15` }}>✦</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryColors[post.category] || "bg-secondary text-muted-foreground"}`}>{post.category}</span>
                        <h3 className="font-bold text-foreground mt-2 mb-2 text-sm group-hover:text-[#e44d90] transition-colors leading-snug">{post.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{post.excerpt}</p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar size={10} style={{ color: "#8b5cf6" }} /> {formatGeorgianDate(post.date)}</span>
                          <span className="flex items-center gap-1"><Clock size={10} style={{ color: "#06b6d4" }} /> {post.read_time}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
