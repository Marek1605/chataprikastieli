'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';
import { locales } from '@/lib/i18n';
import { cn } from '@/lib/utils';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const scrollYRef = useRef(0);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll
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

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollYRef.current > 0) {
        window.scrollTo(0, scrollYRef.current);
      }
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsLangOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // === FIXED LANGUAGE SWITCH ===
  // Uses next-intl's router which handles locale prefixes correctly
  const handleLanguageChange = useCallback((newLocale: string) => {
    if (newLocale === locale) {
      setIsLangOpen(false);
      setIsMenuOpen(false);
      return; // No-op for same language
    }
    
    setIsLangOpen(false);
    setIsMenuOpen(false);
    
    // next-intl router handles locale prefix automatically
    router.replace(pathname, { locale: newLocale as any });
  }, [locale, pathname, router]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const wasMenuOpen = isMenuOpen;
    setIsMenuOpen(false);
    
    const scrollToElement = () => {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    };

    if (wasMenuOpen) {
      setTimeout(scrollToElement, 50);
    } else {
      scrollToElement();
    }
  }, [isMenuOpen]);

  const navLinks = [
    { href: '#hero', label: t('home'), id: 'hero' },
    { href: '#gallery', label: t('gallery'), id: 'gallery' },
    { href: '#amenities', label: t('amenities'), id: 'amenities' },
    { href: '#booking', label: t('booking'), id: 'booking' },
    { href: '#pricing', label: t('pricing'), id: 'pricing' },
    { href: '#surroundings', label: t('surroundings'), id: 'surroundings' },
    { href: '#reviews', label: t('reviews'), id: 'reviews' },
    { href: '#faq', label: t('faq'), id: 'faq' },
    { href: '#contact', label: t('contact'), id: 'contact' },
  ];

  const currentLang = languageConfig[locale] || languageConfig['sk'];

  // === Language Dropdown Component ===
  const LanguageDropdown = ({ mobile = false }: { mobile?: boolean }) => {
    if (mobile) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {locales.map((l) => {
            const lang = languageConfig[l];
            const isActive = l === locale;
            return (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left',
                  isActive
                    ? 'bg-wood text-white shadow-md'
                    : 'bg-cream text-graphite hover:bg-cream-dark active:scale-[0.98]'
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <span className="font-semibold text-sm">{lang.nativeName}</span>
                  <span className="block text-xs opacity-70">{lang.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    // Desktop dropdown
    return (
      <div ref={langDropdownRef} className="relative">
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
            isScrolled
              ? 'text-graphite hover:bg-cream'
              : 'text-white hover:bg-white/10'
          )}
          aria-expanded={isLangOpen}
          aria-haspopup="true"
        >
          <span className="text-base">{currentLang.flag}</span>
          <span>{currentLang.nativeName}</span>
          <svg 
            className={cn('w-3.5 h-3.5 transition-transform', isLangOpen && 'rotate-180')} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        <div className={cn(
          'absolute right-0 top-full mt-2 w-48 py-1 bg-white rounded-xl shadow-xl border border-gray-100 transition-all origin-top-right z-[100]',
          isLangOpen 
            ? 'opacity-100 scale-100 visible' 
            : 'opacity-0 scale-95 invisible pointer-events-none'
        )}>
          {locales.map((l) => {
            const lang = languageConfig[l];
            const isActive = l === locale;
            return (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left',
                  isActive
                    ? 'bg-cream text-wood font-semibold'
                    : 'text-graphite hover:bg-gray-50'
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1">
                  <span className="block font-medium">{lang.name}</span>
                </div>
                {isActive && (
                  <svg className="w-4 h-4 text-wood" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/98 backdrop-blur-xl shadow-md py-2'
            : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent py-3 sm:py-4'
        )}
      >
        <nav className="container-custom flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className={cn(
              'flex items-center gap-2 font-display text-base sm:text-lg md:text-xl font-medium z-[60] transition-colors',
              isScrolled ? 'text-graphite' : 'text-white'
            )}
          >
            <span className="text-xl sm:text-2xl">⛰️</span>
            <span className="hidden sm:inline">Chata pri Kaštieli</span>
            <span className="sm:hidden">Chata</span>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-lg transition-all',
                    isScrolled 
                      ? 'text-graphite hover:bg-cream' 
                      : 'text-white/90 hover:text-white hover:bg-white/10',
                    activeSection === link.id && (isScrolled ? 'bg-cream text-wood' : 'bg-white/20 text-white')
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Right Side */}
          <div className="hidden xl:flex items-center gap-3">
            <LanguageDropdown />
            <a 
              href="#booking" 
              onClick={(e) => handleNavClick(e, '#booking')}
              className="btn btn-primary text-sm px-5 py-2.5"
            >
              {t('cta')}
            </a>
          </div>

          {/* Mobile Right Side: Language + Hamburger */}
          <div className="xl:hidden flex items-center gap-1 z-[60]">
            {/* Mobile mini language switcher */}
            {!isMenuOpen && (
              <div ref={!isMenuOpen ? langDropdownRef : undefined} className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={cn(
                    'flex items-center gap-1 px-2 py-2 rounded-lg text-sm font-semibold transition-all',
                    isScrolled ? 'text-graphite' : 'text-white'
                  )}
                >
                  <span>{currentLang.flag}</span>
                  <span className="text-xs">{currentLang.nativeName}</span>
                  <svg className={cn('w-3 h-3 transition-transform', isLangOpen && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mobile dropdown */}
                <div className={cn(
                  'absolute right-0 top-full mt-2 w-44 py-1 bg-white rounded-xl shadow-xl border border-gray-100 transition-all origin-top-right z-[100]',
                  isLangOpen 
                    ? 'opacity-100 scale-100 visible' 
                    : 'opacity-0 scale-95 invisible pointer-events-none'
                )}>
                  {locales.map((l) => {
                    const lang = languageConfig[l];
                    const isActive = l === locale;
                    return (
                      <button
                        key={l}
                        onClick={() => handleLanguageChange(l)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left',
                          isActive
                            ? 'bg-cream text-wood font-semibold'
                            : 'text-graphite hover:bg-gray-50'
                        )}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                        {isActive && (
                          <svg className="w-4 h-4 text-wood ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hamburger */}
            <button
              className={cn(
                'p-3 -mr-2 rounded-xl transition-all',
                isMenuOpen ? 'bg-cream' : ''
              )}
              onClick={() => { setIsMenuOpen(!isMenuOpen); setIsLangOpen(false); }}
              aria-label={isMenuOpen ? 'Zavrieť menu' : 'Otvoriť menu'}
              aria-expanded={isMenuOpen}
            >
              <div className="flex flex-col justify-center items-center w-6 h-5 relative">
                <span className={cn(
                  'absolute w-6 h-0.5 rounded-full transition-all duration-300',
                  isScrolled || isMenuOpen ? 'bg-graphite' : 'bg-white',
                  isMenuOpen ? 'rotate-45 top-1/2 -translate-y-1/2' : 'top-0'
                )} />
                <span className={cn(
                  'absolute w-6 h-0.5 rounded-full transition-all duration-300 top-1/2 -translate-y-1/2',
                  isScrolled || isMenuOpen ? 'bg-graphite' : 'bg-white',
                  isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                )} />
                <span className={cn(
                  'absolute w-6 h-0.5 rounded-full transition-all duration-300',
                  isScrolled || isMenuOpen ? 'bg-graphite' : 'bg-white',
                  isMenuOpen ? '-rotate-45 top-1/2 -translate-y-1/2' : 'bottom-0'
                )} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[55] xl:hidden transition-all duration-300',
          isMenuOpen ? 'visible' : 'invisible pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div 
          className={cn(
            'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={cn(
          'absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl transition-transform duration-300 ease-out overflow-y-auto overscroll-contain',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
          {/* Menu Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-cream-dark px-6 py-4 flex items-center justify-between">
            <span className="font-display text-lg text-graphite">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 -mr-2 rounded-lg hover:bg-cream transition-colors"
            >
              <svg className="w-6 h-6 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 py-6">
            {/* Nav Links */}
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-4 text-lg font-medium rounded-xl transition-all',
                    'hover:bg-cream active:scale-[0.98]',
                    activeSection === link.id ? 'bg-cream text-wood' : 'text-graphite'
                  )}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-wood" />
                  )}
                </a>
              ))}
            </nav>

            {/* Language Selector in Mobile Menu */}
            <div className="mt-8 pt-6 border-t border-cream-dark">
              <p className="text-sm text-gray-500 mb-4 px-4 font-medium">{t('languageSelect')}</p>
              <LanguageDropdown mobile />
            </div>

            {/* CTA */}
            <div className="mt-8">
              <a
                href="#booking"
                onClick={(e) => handleNavClick(e, '#booking')}
                className="btn btn-primary w-full text-base py-4 justify-center"
              >
                <span className="mr-2">📅</span>
                {t('cta')}
              </a>
            </div>

            {/* Contact */}
            <div className="mt-8 pt-6 border-t border-cream-dark">
              <a href="tel:+421XXXXXXXXX" className="flex items-center gap-3 px-4 py-3 text-wood font-medium rounded-xl hover:bg-cream">
                <span>📞</span> +421 XXX XXX XXX
              </a>
              <a href="mailto:info@chataprikastieli.sk" className="flex items-center gap-3 px-4 py-3 text-wood font-medium rounded-xl hover:bg-cream">
                <span>✉️</span> info@chataprikastieli.sk
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
