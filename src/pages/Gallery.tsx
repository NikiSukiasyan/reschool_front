import { useState, useCallback, useEffect } from "react";
import { X, Play, Image, Film, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SEOHead from "@/components/shared/SEOHead";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { useGallery } from "@/hooks";
import { useT } from "@/providers/TranslationProvider";

type Tab = "photos" | "videos";

const Gallery = () => {
  const { t } = useT();
  const { data, isPending } = useGallery();
  const [activeTab, setActiveTab] = useState<Tab>("photos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photos = data?.photos ?? [];
  const videos = data?.videos ?? [];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setLightboxIndex((prev) => prev !== null && prev < photos.length - 1 ? prev + 1 : prev);
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => prev !== null && prev > 0 ? prev - 1 : prev);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, photos.length, closeLightbox]);

  const tabs: { key: Tab; label: string; icon: typeof Image }[] = [
    { key: "photos", label: t("gallery.photos_tab"), icon: Image },
    { key: "videos", label: t("gallery.videos_tab"), icon: Film },
  ];

  return (
    <>
      <SEOHead
        title={t("gallery.page_title")}
        description={t("gallery.page_description")}
        path="/gallery"
      />
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                <span className="gradient-text">{t("gallery.hero_title")}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t("gallery.hero_subtitle")}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Tabs */}
        <section className="border-y border-border bg-card/30">
          <div className="container mx-auto px-4">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                      isActive
                        ? "border-[#8b5cf6] text-[#8b5cf6]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isPending && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isPending && activeTab === "photos" && (
              <>
                {photos.length === 0 ? (
                  <p className="text-center text-muted-foreground py-20">{t("gallery.no_photos")}</p>
                ) : (
                  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {photos.map((photo, i) => (
                      <AnimatedSection key={photo.id} delay={i * 0.05}>
                        <button
                          onClick={() => setLightboxIndex(i)}
                          className="w-full rounded-xl overflow-hidden group cursor-pointer break-inside-avoid"
                        >
                          <div className="relative">
                            <img
                              src={photo.url}
                              alt={photo.caption || ""}
                              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                          </div>
                          {photo.caption && (
                            <p className="text-xs text-muted-foreground mt-2 text-left">{photo.caption}</p>
                          )}
                        </button>
                      </AnimatedSection>
                    ))}
                  </div>
                )}
              </>
            )}

            {!isPending && activeTab === "videos" && (
              <>
                {videos.length === 0 ? (
                  <p className="text-center text-muted-foreground py-20">{t("gallery.no_videos")}</p>
                ) : (
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, i) => (
                      <AnimatedSection key={video.id} delay={i * 0.08}>
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                          <VideoPlayer
                            src={video.url}
                            poster={video.poster ?? undefined}
                          />
                          {video.caption && (
                            <div className="px-4 py-3">
                              <p className="text-sm text-muted-foreground">{video.caption}</p>
                            </div>
                          )}
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors z-10"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <motion.img
              key={lightboxIndex}
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].caption || ""}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />
            {photos[lightboxIndex].caption && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-2 rounded-lg">
                {photos[lightboxIndex].caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
