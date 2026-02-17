import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/providers/TranslationProvider";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useT();
  const nextLocale = locale === 'ka' ? 'en' : 'ka';
  const label = locale === 'ka' ? 'EN' : 'KA';

  return (
    <motion.button
      onClick={() => setLocale(nextLocale)}
      className="
        relative flex items-center gap-1.5
        px-3 py-1.5 rounded-lg
        text-xs font-semibold tracking-wide
        text-muted-foreground hover:text-foreground
        transition-colors duration-200
        border border-border/50 hover:border-border
        hover:bg-secondary/50
      "
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label={`Switch to ${nextLocale === 'en' ? 'English' : 'Georgian'}`}
    >
      <Globe size={14} />
      <span>{label}</span>
    </motion.button>
  );
};

const NavLink = ({
  to,
  label,
  isActive,
  onClick,
}: {
  to: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`
      relative px-4 py-2 2xl:px-5 2xl:py-2.5 rounded-lg
      text-[13px] 2xl:text-sm font-medium
      transition-all duration-200 ease-out
      ${isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground/80"
      }
    `}
  >
    {/* Hover/active background */}
    <motion.span
      className="absolute inset-0 rounded-lg"
      style={{ background: "hsl(var(--secondary))" }}
      initial={false}
      animate={{ opacity: isActive ? 0.8 : 0 }}
      whileHover={{ opacity: isActive ? 0.8 : 0.4 }}
      transition={{ duration: 0.15 }}
    />

    <span className="relative z-10">{label}</span>

    {/* Active indicator line */}
    {isActive && (
      <motion.span
        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
        style={{
          background: "linear-gradient(90deg, #e44d90, #8b5cf6, #3b82f6)",
        }}
        layoutId="nav-active"
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      />
    )}
  </Link>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { t } = useT();

  const navLinks = [
    { to: "/", label: t('nav.home') },
    { to: "/courses", label: t('nav.courses') },
    { to: "/about", label: t('nav.about') },
    { to: "/students", label: t('nav.students') },
    { to: "/blog", label: t('nav.blog') },
    { to: "/contact", label: t('nav.contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="transition-all duration-300"
        style={{
          background: scrolled
            ? "hsl(var(--background) / 0.88)"
            : "hsl(var(--background) / 0.4)",
          backdropFilter: "blur(16px) saturate(1.2)",
          WebkitBackdropFilter: "blur(16px) saturate(1.2)",
          borderBottom: `1px solid hsl(var(--border) / ${scrolled ? "0.5" : "0"})`,
        }}
      >
        <nav className="container mx-auto px-4 2xl:px-6 flex items-center justify-between h-[68px] 2xl:h-[76px]">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group" aria-label={t('nav.home_page')}>
            <img
              src="/images/logo.webp"
              alt="re:school"
              className="h-8 2xl:h-9 transition-all duration-200 group-hover:brightness-110"
            />
          </Link>

          {/* Desktop links — centered */}
          <div className="hidden lg:flex items-center gap-0.5 2xl:gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                label={link.label}
                isActive={location.pathname === link.to}
              />
            ))}
          </div>

          {/* CTA + Language */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/contact"
              className="
                relative inline-flex items-center
                px-5 py-2 2xl:px-6 2xl:py-2.5
                rounded-xl text-[13px] 2xl:text-sm font-semibold text-white
                transition-all duration-200
                hover:brightness-110 hover:shadow-lg
                active:scale-[0.97]
              "
              style={{
                background: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)",
                boxShadow: "0 2px 16px -4px hsl(270 60% 50% / 0.25)",
              }}
            >
              {t('nav.register')}
            </Link>
          </div>

          {/* Mobile: language + toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher />
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label={t('nav.open_menu')}
              whileTap={{ scale: 0.92 }}
            >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden"
            style={{
              background: "hsl(var(--background) / 0.97)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid hsl(var(--border) / 0.4)",
            }}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-0.5">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.to;
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center px-4 py-3 rounded-xl text-sm font-medium
                        transition-colors duration-150
                        ${isActive
                          ? "text-foreground bg-secondary/80"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        }
                      `}
                    >
                      {isActive && (
                        <span
                          className="w-1 h-4 rounded-full mr-3"
                          style={{ background: "linear-gradient(180deg, #e44d90, #8b5cf6)" }}
                        />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.2 }}
                className="mt-3"
              >
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #e44d90, #8b5cf6, #3b82f6, #06b6d4)",
                  }}
                >
                  {t('nav.register')}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
