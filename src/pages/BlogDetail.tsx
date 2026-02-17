import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Calendar, Clock, ArrowLeft, User, Share2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SEOHead from "@/components/shared/SEOHead";
import { articleJsonLd } from "@/lib/seo";
import { useBlogPost, useBlogPosts } from "@/hooks";
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

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isPending, isError } = useBlogPost(slug!);
  const { data: allPosts } = useBlogPosts();
  const relatedPosts = allPosts?.filter((p) => p.slug !== slug).slice(0, 3) || [];
  const { t } = useT();

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

  if (isError || !post) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t('blog_detail.not_found')}</h1>
            <Link to="/blog" className="text-[#8b5cf6] hover:underline">{t('blog_detail.back_to_blog')}</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        image={post.og_image || undefined}
        jsonLd={articleJsonLd(post)}
      />
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "var(--gradient-subtle)" }} />
          <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full opacity-20 blur-[100px]" style={{ background: "hsl(265, 85%, 65%)" }} />

          <div className="container mx-auto px-4 py-16 relative z-10">
            <AnimatedSection>
              <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#e44d90] transition-colors mb-8">
                <ArrowLeft size={14} /> {t('blog_detail.back_to_blog')}
              </Link>

              <div className="max-w-3xl">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColors[post.category] || "bg-secondary text-muted-foreground"}`}>
                  {post.category}
                </span>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mt-4 mb-6 leading-tight bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" }}>
                  {post.title}
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <User size={14} style={{ color: "#e44d90" }} /> {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={14} style={{ color: "#8b5cf6" }} /> {formatGeorgianDate(post.date)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={14} style={{ color: "#06b6d4" }} /> {post.read_time}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-12">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-3 prose-custom"
              >
                <div className="max-w-none space-y-6">
                  {post.content.split("\n").map((line, i) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;

                    if (trimmed.startsWith("## ")) {
                      return (
                        <h2 key={i} className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2" style={{ color: "#8b5cf6" }}>
                          <span className="w-1 h-6 rounded-full inline-block" style={{ background: "linear-gradient(180deg, #e44d90, #8b5cf6)" }} />
                          {trimmed.slice(3)}
                        </h2>
                      );
                    }

                    if (trimmed.startsWith("### ")) {
                      return (
                        <h3 key={i} className="text-lg font-bold mt-6 mb-3" style={{ color: "#3b82f6" }}>
                          {trimmed.slice(4)}
                        </h3>
                      );
                    }

                    if (trimmed.startsWith("> ")) {
                      return (
                        <blockquote key={i} className="border-l-4 pl-6 py-3 my-6 rounded-r-xl" style={{ borderColor: "#8b5cf6", background: "rgba(139, 92, 246, 0.05)" }}>
                          <p className="text-foreground italic font-medium text-sm leading-relaxed">
                            {trimmed.slice(2)}
                          </p>
                        </blockquote>
                      );
                    }

                    if (trimmed.startsWith("- **") || trimmed.startsWith("- ")) {
                      const content = trimmed.slice(2);
                      return (
                        <li key={i} className="text-sm text-muted-foreground leading-relaxed ml-4 list-disc marker:text-[#e44d90]" dangerouslySetInnerHTML={{ __html: formatBold(content) }} />
                      );
                    }

                    if (/^\d+\.\s/.test(trimmed)) {
                      const content = trimmed.replace(/^\d+\.\s/, "");
                      return (
                        <li key={i} className="text-sm text-muted-foreground leading-relaxed ml-4 list-decimal marker:text-[#8b5cf6]" dangerouslySetInnerHTML={{ __html: formatBold(content) }} />
                      );
                    }

                    if (trimmed.startsWith("|")) {
                      if (trimmed.includes("---")) return null;
                      const cells = trimmed.split("|").filter(Boolean).map((c) => c.trim());
                      const isHeader = i > 0 && post.content.split("\n")[i + 1]?.includes("---");
                      return (
                        <div key={i} className={`grid gap-4 py-2 px-3 rounded-lg text-sm ${isHeader ? "font-bold text-foreground bg-secondary" : "text-muted-foreground border-b border-border"}`} style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
                          {cells.map((cell, j) => <span key={j}>{cell}</span>)}
                        </div>
                      );
                    }

                    return (
                      <p key={i} className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: formatBold(trimmed) }} />
                    );
                  })}
                </div>
              </motion.article>

              {/* Sidebar */}
              <aside className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
                  <h4 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "#06b6d4" }}>
                    <Share2 size={14} style={{ color: "#06b6d4" }} /> {t('blog_detail.share')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Facebook", "LinkedIn"].map((platform) => (
                      <button key={platform} className="px-3 py-1.5 rounded-lg bg-secondary text-xs text-muted-foreground hover:text-[#8b5cf6] transition-colors">
                        {platform}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="font-bold text-sm mb-4" style={{ color: "#8b5cf6" }}>{t('blog_detail.related_articles')}</h4>
                    <div className="space-y-4">
                      {relatedPosts.map((rp) => (
                        <Link
                          key={rp.id}
                          to={`/blog/${rp.slug}`}
                          className="block group"
                        >
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${categoryColors[rp.category] || "bg-secondary text-muted-foreground"}`}>
                            {rp.category}
                          </span>
                          <p className="text-xs font-semibold text-foreground mt-1 group-hover:text-[#e44d90] transition-colors leading-snug">
                            {rp.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground">{rp.read_time}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-3">{t('blog_detail.interested_in_career')}</p>
                    <Link
                      to="/contact"
                      className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)" }}
                    >
                      {t('blog_detail.register_now')}
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

function formatBold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>');
}

export default BlogDetail;
