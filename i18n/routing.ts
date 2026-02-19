import { defineRouting } from 'next-intl/routing';

export const locales = ['sk', 'en', 'cs', 'pl'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'sk';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});
