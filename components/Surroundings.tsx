'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { surroundingPlaces } from '@/lib/config';

export default function Surroundings() {
  const t = useTranslations('surroundings');

  return (
    <section id="surroundings" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="section-label">{t('label')}</span>
          <h2 className="section-title">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {surroundingPlaces.map((place) => (
            <div
              key={place.id}
              className="group bg-cream rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-wood/20 to-wood/40">
                <Image
                  src={place.image}
                  alt={t(place.titleKey.split('.')[1])}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-wood uppercase tracking-wider">
                  {t(place.type.split('.')[1])}
                </span>
                <h3 className="font-display text-lg mt-1 mb-2">
                  {t(place.titleKey.split('.')[1])}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(place.descKey.split('.')[1])}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
