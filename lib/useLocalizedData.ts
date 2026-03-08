'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useAdmin } from '@/lib/AdminContext';

// Pre SK: admin dáta (editovateľné). Pre iné jazyky: preklady z messages/*.json
export function useLocalizedSection(namespace: string, adminSection: string) {
  const locale = useLocale();
  const { data } = useAdmin();
  const t = useTranslations(namespace);

  return {
    locale,
    isDefault: locale === 'sk',
    t,  // translation function
    admin: (data as any)[adminSection], // admin data
    data, // full admin data (for images etc.)
  };
}
