'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';
import { locales } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminContext';

const languageConfig: Record<string, { flag: string; name: string; nativeName: string }> = {
  sk: { flag: '🇸🇰', name: 'Slovenčina', nativeName: 'SK' },
  en: { flag: '🇬🇧', name: 'English', nativeName: 'EN' },
  cs: { flag: '🇨🇿', name: 'Čeština', nativeName: 'CZ' },
  pl: { flag: '🇵🇱', name: 'Polski', nativeName: 'PL' },
};

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin } = useAdmin();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = ['contact', 'faq', 'reviews', 'surroundings', 'pricing', 'booking', 'amenities', 'gallery', 'hero'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }, []);

  const changeLanguage = useCallback((newLocale: string) => {
    setIsLangOpen(false);
    router.replace(pathname, { locale: newLocale });
  }, [router, pathname]);

  const navItems = [
    { id: 'hero', label: t('home') },
    { id: 'gallery', label: t('gallery') },
    { id: 'amenities', label: t('amenities') },
    { id: 'booking', label: t('booking') },
    { id: 'pricing', label: t('pricing') },
    { id: 'surroundings', label: t('surroundings') },
    { id: 'reviews', label: t('reviews') },
    { id: 'faq', label: t('faq') },
    { id: 'contact', label: t('contact') },
  ];

  const currentLang = languageConfig[locale] || languageConfig.sk;
  const topOffset = isAdmin ? 'top-[52px]' : 'top-0';

  return (
    <nav className={cn(
      'fixed left-0 right-0 z-[200] transition-all duration-300',
      topOffset,
      'bg-white shadow-md'
    )}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest to-wood flex items-center justify-center shadow-md">
              <span className="text-xl">🏠</span>
            </div>
            <span className="font-display text-xl text-graphite hidden sm:block">Chata pri Kaštieli</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg transition-all duration-200',
                  activeSection === item.id
                    ? 'text-wood bg-wood/10 font-medium'
                    : 'text-graphite hover:text-wood hover:bg-cream'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-graphite hover:bg-cream transition-colors"
              >
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.nativeName}</span>
                <svg className={cn('w-3 h-3 transition-transform', isLangOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {locales.map((loc) => {
                    const lang = languageConfig[loc];
                    return (
                      <button
                        key={loc}
                        onClick={() => changeLanguage(loc)}
                        className={cn(
                          'w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-cream transition-colors',
                          locale === loc && 'bg-wood/10 text-wood font-medium'
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => scrollToSection('booking')}
              className="px-4 py-2 bg-graphite text-white rounded-lg text-sm font-semibold hover:bg-graphite/90 transition-colors shadow-md"
            >
              {t('bookNow')}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-graphite hover:bg-cream rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="container-custom py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'w-full px-4 py-3 text-left rounded-lg transition-colors',
                  activeSection === item.id
                    ? 'text-wood bg-wood/10 font-medium'
                    : 'text-graphite hover:bg-cream'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
