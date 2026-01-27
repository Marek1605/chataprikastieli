'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Experience() {
  const t = useTranslations('experience');

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="section-label">{t('label')}</span>
          <h2 className="section-title">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-600 leading-relaxed">{t('text1')}</p>
            <p className="text-lg text-gray-600 leading-relaxed">{t('text2')}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-wood/20 to-wood/40">
              <Image
                src="/assets/experience-1.jpg"
                alt="Ranná atmosféra"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mt-8 bg-gradient-to-br from-wood/20 to-wood/40">
              <Image
                src="/assets/experience-2.jpg"
                alt="Večerná atmosféra"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
