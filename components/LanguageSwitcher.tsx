'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/routing';

// Language metadata
const LANG_META: Record<Locale, { flag: string; label: string; nativeName: string }> = {
  sk: { flag: '🇸🇰', label: 'SK', nativeName: 'Slovenčina' },
  en: { flag: '🇬🇧', label: 'EN', nativeName: 'English' },
  cs: { flag: '🇨🇿', label: 'CZ', nativeName: 'Čeština' },
  pl: { flag: '🇵🇱', label: 'PL', nativeName: 'Polski' },
};

interface LanguageSwitcherProps {
  /** 'header' = compact for navbar, 'footer' = horizontal list for footer */
  variant?: 'header' | 'footer';
  /** Additional CSS classes */
  className?: string;
}

export default function LanguageSwitcher({ variant = 'header', className = '' }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  const switchLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) {
        setIsOpen(false);
        return;
      }
      setIsOpen(false);
      router.replace(pathname, { locale: newLocale });
    },
    [locale, pathname, router]
  );

  // Footer variant: horizontal list of flags
  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-2 ${className}`} role="navigation" aria-label="Language selection">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
              ${loc === locale
                ? 'bg-wood text-white shadow-sm'
                : 'text-graphite/60 hover:text-graphite hover:bg-cream-dark/50'
              }
            `}
            aria-label={`Switch to ${LANG_META[loc].nativeName}`}
            aria-current={loc === locale ? 'true' : undefined}
          >
            <span className="mr-1.5">{LANG_META[loc].flag}</span>
            {LANG_META[loc].label}
          </button>
        ))}
      </div>
    );
  }

  // Header variant: dropdown
  const current = LANG_META[locale];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
          text-graphite/80 hover:text-graphite hover:bg-cream-dark/30
          transition-all duration-200 select-none
        "
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Current language: ${current.nativeName}. Click to change.`}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="
            absolute right-0 top-full mt-1 z-50
            min-w-[160px] py-1 rounded-xl
            bg-white/95 backdrop-blur-xl
            border border-cream-dark/30
            shadow-lg shadow-black/8
            animate-in fade-in slide-in-from-top-2 duration-200
          "
          role="listbox"
          aria-label="Select language"
        >
          {locales.map((loc) => {
            const meta = LANG_META[loc];
            const isActive = loc === locale;

            return (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
                  transition-colors duration-150
                  ${isActive
                    ? 'bg-wood/8 text-wood font-semibold'
                    : 'text-graphite/70 hover:bg-cream-dark/20 hover:text-graphite'
                  }
                `}
                role="option"
                aria-selected={isActive}
              >
                <span className="text-lg leading-none flex-shrink-0">{meta.flag}</span>
                <span className="flex-1">{meta.nativeName}</span>
                {isActive && (
                  <svg className="w-4 h-4 text-wood" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
