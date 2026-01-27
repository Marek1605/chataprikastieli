'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const languageFlags: Record<string, string> = {
  sk: '🇸🇰',
  en: '🇬🇧',
  cs: '🇨🇿',
  pl: '🇵🇱',
};

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const scrollYRef = useRef(0);

  // Handle scroll - optimized with passive listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      
      // Track active section for highlighting
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
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open - CRITICAL for mobile
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

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const handleLanguageChange = useCallback((newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
    setIsMenuOpen(false);
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
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    // If menu was open, wait for body scroll to restore
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
        role="banner"
      >
        <nav className="container-custom flex items-center justify-between" role="navigation" aria-label="Hlavná navigácia">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className={cn(
              'flex items-center gap-2 font-display text-base sm:text-lg md:text-xl font-medium z-[60] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-wood rounded-lg',
              isScrolled ? 'text-graphite' : 'text-white'
            )}
            aria-label="Chata pri Kaštieli - Domov"
          >
            <span className="text-xl sm:text-2xl" aria-hidden="true">⛰️</span>
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
                    'px-3 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-wood',
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
            {/* Language Switcher */}
            <div className="flex rounded-lg overflow-hidden border border-current/20" role="group" aria-label="Výber jazyka">
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => handleLanguageChange(l)}
                  className={cn(
                    'px-2.5 py-1.5 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-wood focus-visible:ring-inset',
                    isScrolled ? 'text-graphite' : 'text-white',
                    locale === l
                      ? isScrolled
                        ? 'bg-wood text-white'
                        : 'bg-white/30'
                      : 'hover:bg-white/10'
                  )}
                  aria-label={`Prepnúť na ${l.toUpperCase()}`}
                  aria-current={locale === l ? 'true' : undefined}
                >
                  <span className="mr-1" aria-hidden="true">{languageFlags[l]}</span>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            
            <a 
              href="#booking" 
              onClick={(e) => handleNavClick(e, '#booking')}
              className="btn btn-primary text-sm px-5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-wood focus-visible:ring-offset-2"
            >
              {t('cta')}
            </a>
          </div>

          {/* Mobile/Tablet Menu Toggle */}
          <button
            className={cn(
              'xl:hidden z-[60] p-3 -mr-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-wood',
              isMenuOpen ? 'bg-cream' : ''
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Zavrieť menu' : 'Otvoriť menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="flex flex-col justify-center items-center w-6 h-5 relative">
              <span
                className={cn(
                  'absolute w-6 h-0.5 rounded-full transition-all duration-300 ease-out',
                  isScrolled || isMenuOpen ? 'bg-graphite' : 'bg-white',
                  isMenuOpen ? 'rotate-45 top-1/2 -translate-y-1/2' : 'top-0'
                )}
              />
              <span
                className={cn(
                  'absolute w-6 h-0.5 rounded-full transition-all duration-300 ease-out top-1/2 -translate-y-1/2',
                  isScrolled || isMenuOpen ? 'bg-graphite' : 'bg-white',
                  isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                )}
              />
              <span
                className={cn(
                  'absolute w-6 h-0.5 rounded-full transition-all duration-300 ease-out',
                  isScrolled || isMenuOpen ? 'bg-graphite' : 'bg-white',
                  isMenuOpen ? '-rotate-45 top-1/2 -translate-y-1/2' : 'bottom-0'
                )}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile/Tablet Menu Overlay */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-0 z-[55] xl:hidden transition-all duration-300',
          isMenuOpen ? 'visible' : 'invisible pointer-events-none'
        )}
        aria-hidden={!isMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobilné menu"
      >
        {/* Backdrop */}
        <div 
          className={cn(
            'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Menu Panel - Slide from right */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl transition-transform duration-300 ease-out overflow-y-auto overscroll-contain',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Menu Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-cream-dark px-6 py-4 flex items-center justify-between">
            <span className="font-display text-lg text-graphite">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 -mr-2 rounded-lg hover:bg-cream transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-wood"
              aria-label="Zavrieť menu"
            >
              <svg className="w-6 h-6 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 py-6">
            {/* Navigation Links */}
            <nav className="space-y-1" aria-label="Mobilná navigácia">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-4 text-lg font-medium rounded-xl transition-all',
                    'hover:bg-cream active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-wood',
                    activeSection === link.id ? 'bg-cream text-wood' : 'text-graphite'
                  )}
                  style={{ 
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-wood" aria-hidden="true" />
                  )}
                </a>
              ))}
            </nav>

            {/* Language Selector */}
            <div className="mt-8 pt-6 border-t border-cream-dark">
              <p className="text-sm text-gray-500 mb-4 px-4 font-medium">Jazyk / Language</p>
              <div className="grid grid-cols-2 gap-2">
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLanguageChange(l)}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-3.5 text-base font-semibold rounded-xl transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-wood',
                      locale === l 
                        ? 'bg-wood text-white shadow-md' 
                        : 'bg-cream text-graphite hover:bg-cream-dark active:scale-[0.98]'
                    )}
                    aria-current={locale === l ? 'true' : undefined}
                  >
                    <span className="text-xl" aria-hidden="true">{languageFlags[l]}</span>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <a
                href="#booking"
                onClick={(e) => handleNavClick(e, '#booking')}
                className="btn btn-primary w-full text-base py-4 justify-center"
              >
                <span className="mr-2" aria-hidden="true">📅</span>
                {t('cta')}
              </a>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-cream-dark">
              <p className="text-sm text-gray-500 mb-3 px-4">Potrebujete pomoc?</p>
              <a 
                href="tel:+421XXXXXXXXX" 
                className="flex items-center gap-3 px-4 py-3 text-wood font-medium rounded-xl hover:bg-cream transition-colors"
              >
                <span aria-hidden="true">📞</span>
                +421 XXX XXX XXX
              </a>
              <a 
                href="mailto:info@chataprikastieli.sk" 
                className="flex items-center gap-3 px-4 py-3 text-wood font-medium rounded-xl hover:bg-cream transition-colors"
              >
                <span aria-hidden="true">✉️</span>
                info@chataprikastieli.sk
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
