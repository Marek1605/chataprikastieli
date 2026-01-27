'use client';

import { useTranslations } from 'next-intl';
import { reviews } from '@/lib/config';

export default function Reviews() {
  const t = useTranslations('reviews');

  return (
    <section id="reviews" className="py-20 bg-cream">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="section-label">{t('label')}</span>
          <h2 className="section-title">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {'★'.repeat(review.rating)}
              </div>
              <p className="text-gray-600 mb-6 italic">
                {t(review.textKey.split('.')[1])}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{review.author}</span>
                <span className="text-gray-400">
                  {t(review.dateKey.split('.')[1])}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
