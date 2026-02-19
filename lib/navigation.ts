import { useRouter as useNextRouter, usePathname as useNextPathname } from 'next/navigation';

const LOCALES = ['sk', 'en', 'cs', 'pl'];
const DEFAULT_LOCALE = 'sk';

export function usePathname() {
  const pathname = useNextPathname();
  for (const locale of LOCALES) {
    if (pathname === '/' + locale || pathname.startsWith('/' + locale + '/')) {
      return pathname.slice(locale.length + 1) || '/';
    }
  }
  return pathname;
}

export function useRouter() {
  const router = useNextRouter();
  return {
    ...router,
    replace(href: string, options?: { locale?: string }) {
      const prefix = options?.locale && options.locale !== DEFAULT_LOCALE ? '/' + options.locale : '';
      router.replace(prefix + href);
    },
    push(href: string, options?: { locale?: string }) {
      const prefix = options?.locale && options.locale !== DEFAULT_LOCALE ? '/' + options.locale : '';
      router.push(prefix + href);
    },
  };
}
