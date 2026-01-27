'use client';

import { useTranslations } from 'next-intl';
import { siteConfig } from '@/lib/config';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '#gallery', label: tNav('gallery') },
    { href: '#amenities', label: tNav('amenities') },
    { href: '#booking', label: tNav('booking') },
    { href: '#pricing', label: tNav('pricing') },
    { href: '#surroundings', label: tNav('surroundings') },
    { href: '#contact', label: tNav('contact') },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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

  return (
    <footer 
      className="bg-graphite text-white"
      role="contentinfo"
      aria-label="Pätička stránky"
    >
      {/* Main Footer Content */}
      <div className="container-custom py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a 
              href="#hero" 
              onClick={(e) => handleNavClick(e, '#hero')}
              className="inline-flex items-center gap-2 font-display text-xl font-medium mb-4 hover:text-cream transition-colors"
            >
              <span className="text-2xl" aria-hidden="true">⛰️</span>
              <span>{siteConfig.name}</span>
            </a>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-xs">
              {t('description')}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-medium mb-4">{t('quickLinks')}</h3>
            <nav aria-label="Rýchle odkazy">
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-wood/50 group-hover:bg-wood transition-colors" aria-hidden="true" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-medium mb-4">{t('contact')}</h3>
            <address className="not-italic space-y-3 text-sm">
              <a 
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              >
                <span className="text-lg" aria-hidden="true">📞</span>
                <span>{siteConfig.phone}</span>
              </a>
              <a 
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              >
                <span className="text-lg" aria-hidden="true">✉️</span>
                <span>{siteConfig.email}</span>
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <span className="text-lg" aria-hidden="true">📍</span>
                <span>
                  {siteConfig.address.city}, {siteConfig.address.region}<br />
                  {siteConfig.address.country}
                </span>
              </div>
            </address>
          </div>

          {/* Legal & Booking */}
          <div>
            <h3 className="font-display text-lg font-medium mb-4">{t('legal')}</h3>
            <ul className="space-y-2.5 text-sm mb-6">
              <li>
                <a href="/privacy" className="text-white/70 hover:text-white transition-colors">
                  {t('privacy')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-white/70 hover:text-white transition-colors">
                  {t('terms')}
                </a>
              </li>
            </ul>

            {/* External Booking Links */}
            <div className="space-y-2">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Rezervujte aj cez:</p>
              <div className="flex gap-2">
                <a
                  href={siteConfig.booking.airbnb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs font-medium transition-colors"
                >
                  Airbnb
                </a>
                <a
                  href={siteConfig.booking.bookingCom}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs font-medium transition-colors"
                >
                  Booking.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>
            © {currentYear} {siteConfig.name}. {t('rights')}
          </p>
          <p className="flex items-center gap-1">
            {t('madeWith')} <span className="text-red-400" aria-label="láskou">❤️</span> {t('inSlovakia')}
          </p>
        </div>
      </div>
    </footer>
  );
}
