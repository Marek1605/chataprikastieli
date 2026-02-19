import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale corresponds to the [locale] segment
  let locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
    // Timezone for date formatting
    timeZone: 'Europe/Bratislava',
    // Default number and date formats
    formats: {
      number: {
        currency: {
          style: 'currency',
          currency: 'EUR',
        },
      },
    },
  };
});
