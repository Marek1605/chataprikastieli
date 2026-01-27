'use client';

import { useTranslations } from 'next-intl';
import { pricingPackages, pricingConfig } from '@/lib/config';

export default function Pricing() {
  const t = useTranslations('pricing');

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="section-label">{t('label')}</span>
          <h2 className="section-title">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-cream rounded-2xl p-8 text-center transition-all hover:-translate-y-2 hover:shadow-xl ${
                pkg.popular ? 'ring-2 ring-wood scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-wood text-white text-xs font-semibold px-4 py-1 rounded-full">
                  {t('popular')}
                </span>
              )}
              <h3 className="font-display text-2xl mb-2">{t(pkg.nameKey.split('.')[1])}</h3>
              <p className="text-gray-500 mb-6">{t(pkg.durationKey.split('.')[1])}</p>
              <div className="mb-6">
                <span className="text-sm text-gray-500">{t('from')}</span>
                <span className="text-4xl font-display ml-2">{pkg.price}</span>
                <span className="text-xl">{pricingConfig.currency}</span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <span className="text-wood">✓</span>
                    {t(feature.split('.')[1])}
                  </li>
                ))}
              </ul>
              <a
                href="#booking"
                className={`btn w-full ${pkg.popular ? 'btn-primary' : 'btn-outline'}`}
                data-nights={pkg.nights}
              >
                {t('cta')}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">{t('note')}</p>
      </div>
    </section>
  );
}
