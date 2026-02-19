import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, Locale, defaultLocale } from '@/lib/i18n';
import { siteConfig } from '@/lib/config';
import type { Metadata, Viewport } from 'next';
import Providers from '@/components/Providers';
import '../globals.css';

export const dynamic = 'force-dynamic';

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const tSeo = await getTranslations({ locale, namespace: 'seo' });
  
  const title = t('title');
  const description = t('description');
  const url = `${siteConfig.url}/${locale}`;
  
  // Alternate language URLs
  const languages: Record<string, string> = {};
  locales.forEach(l => {
    languages[l] = `${siteConfig.url}/${l}`;
  });
  languages['x-default'] = `${siteConfig.url}/${defaultLocale}`;

  return {
    title: {
      default: `${title} | ${tSeo('tagline')}`,
      template: `%s | ${title}`,
    },
    description: description,
    keywords: tSeo('keywords'),
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'cs' ? 'cs_CZ' : locale === 'pl' ? 'pl_PL' : 'en_US',
      url: url,
      siteName: title,
      title: `${title} | ${tSeo('tagline')}`,
      description: description,
      images: [
        {
          url: `${siteConfig.url}/assets/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${tSeo('tagline')}`,
      description: description,
      images: [`${siteConfig.url}/assets/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add your verification codes here
      // google: 'your-google-verification-code',
    },
    category: 'travel',
  };
}

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F5F0' },
    { media: '(prefers-color-scheme: dark)', color: '#2D2D2D' },
  ],
};

// JSON-LD Structured Data
function generateStructuredData(locale: string, t: any) {
  const baseUrl = siteConfig.url;
  
  // LocalBusiness schema for better Google Maps/Search visibility
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${baseUrl}/#lodging`,
    name: siteConfig.name,
    description: t('description'),
    url: `${baseUrl}/${locale}`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: 'SK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      // Add actual coordinates
      latitude: '49.0',
      longitude: '18.9',
    },
    image: `${baseUrl}/assets/hero.jpg`,
    priceRange: '€€',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Kitchen', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Terrace', value: true },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
    checkinTime: '15:00',
    checkoutTime: '10:00',
    numberOfRooms: 3,
    petsAllowed: true,
  };

  // BreadcrumbList for navigation
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Domov',
        item: `${baseUrl}/${locale}`,
      },
    ],
  };

  // WebSite schema
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: siteConfig.name,
    description: t('description'),
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // FAQPage schema
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Aký je čas príchodu a odchodu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Check-in je od 15:00, check-out do 10:00.',
        },
      },
      {
        '@type': 'Question',
        name: 'Môžem si priviesť domáce zviera?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Áno, domáce zvieratá sú vítané po predchádzajúcej dohode.',
        },
      },
      {
        '@type': 'Question',
        name: 'Je k dispozícii parkovanie?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Áno, bezplatné parkovanie je priamo pri chate.',
        },
      },
    ],
  };

  return [localBusiness, breadcrumb, website, faqPage];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: 'meta' });
  const structuredData = generateStructuredData(locale, t);

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data */}
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
      </head>
      <body className="min-h-screen bg-cream-light antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-wood focus:text-white focus:rounded-lg"
            >
              Preskočiť na hlavný obsah
            </a>
            
            <main id="main-content">
              {children}
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
