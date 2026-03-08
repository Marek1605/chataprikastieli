'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const languages = [
  { code: 'sk', flag: '🇸🇰', name: 'SK' },
  { code: 'en', flag: '🇬🇧', name: 'EN' },
  { code: 'cs', flag: '🇨🇿', name: 'CZ' },
  { code: 'pl', flag: '🇵🇱', name: 'PL' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const switchLocale = (newLocale: string) => {
    setOpen(false);
    // Remove current locale prefix from pathname
    let path = pathname;
    for (const lang of languages) {
      if (path.startsWith('/' + lang.code + '/') || path === '/' + lang.code) {
        path = path.slice(lang.code.length + 1) || '/';
        break;
      }
    }
    const newPath = newLocale === 'sk' ? (path || '/') : '/' + newLocale + (path === '/' ? '' : path);
    router.push(newPath);
  };

  const current = languages.find(l => l.code === locale) || languages[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors text-sm font-medium"
        aria-label="Zmeniť jazyk"
      >
        <span>{current.flag}</span>
        <span>{current.name}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border py-1 z-50 min-w-[100px]">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-amber-50 transition-colors ${
                lang.code === locale ? 'bg-amber-50 font-bold text-amber-700' : 'text-gray-700'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
