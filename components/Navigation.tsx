'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';
import { locales } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminContext';

const languageConfig: Record<string, { flag: string; name: string; nativeName: string }> = {
  sk: { flag: '🇸🇰', name: 'Slovencina', nativeName: 'SK' },
  en: { flag: '🇬🇧', name: 'English', nativeName: 'EN' },
  cs: { flag: '🇨🇿', name: 'Cestina', nativeName: 'CZ' },
  pl: { flag: '🇵🇱', name: 'Polski', nativeName: 'PL' },
};

export default function Navigation() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, data } = useAdmin();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const nav = data.nav;

  useEffect(() => {
    const handleScroll = () => {
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
    { id: 'hero', label: nav.home },
    { id: 'gallery', label: nav.gallery },
    { id: 'amenities', label: nav.amenities },
    { id: 'booking', label: nav.booking },
    { id: 'pricing', label: nav.pricing },
    { id: 'surroundings', label: nav.surroundings },
    { id: 'reviews', label: nav.reviews },
    { id: 'faq', label: nav.faq },
    { id: 'contact', label: nav.contact },
  ];

  const currentLang = languageConfig[locale] || languageConfig.sk;
  const topOffset = isAdmin ? 'top-[52px]' : 'top-0';

  return (
    <nav className={cn('fixed left-0 right-0 z-[200] bg-white shadow-md', topOffset)}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest to-wood flex items-center justify-center shadow-md">
              <span className="text-xl">🏠</span>
            </div>
            <span className="font-display text-xl text-graphite hidden sm:block">Chata pri Kastieli</span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className={cn('px-3 py-2 text-sm rounded-lg', activeSection === item.id ? 'text-wood bg-wood/10 font-medium' : 'text-graphite hover:text-wood hover:bg-cream')}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={langDropdownRef}>
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-graphite hover:bg-cream">
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.nativeName}</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border py-1 z-50">
                  {locales.map((loc) => (
                    <button key={loc} onClick={() => changeLanguage(loc)} className={cn('w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-cream', locale === loc && 'bg-wood/10 text-wood font-medium')}>
                      <span>{languageConfig[loc].flag}</span>
                      <span>{languageConfig[loc].name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => scrollToSection('booking')} className="px-4 py-2 bg-graphite text-white rounded-lg text-sm font-semibold hover:bg-graphite/90 shadow-md">
              {nav.bookNow}
            </button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-graphite hover:bg-cream rounded-lg">
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="container-custom py-4 space-y-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className={cn('w-full px-4 py-3 text-left rounded-lg', activeSection === item.id ? 'text-wood bg-wood/10 font-medium' : 'text-graphite hover:bg-cream')}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
