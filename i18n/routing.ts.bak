import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['sk', 'en', 'cs', 'pl'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'sk';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // 'as-needed' means SK (default) has no prefix: chataprikastieli.sk/
  // Other locales get prefix: chataprikastieli.sk/en, /cs, /pl
  localePrefix: 'as-needed',
});

// Export typed navigation utilities for use in components
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
