'use client';
import { useTranslations } from 'next-intl';
import { useAdmin } from '@/lib/AdminContext';

export default function Reviews() {
  const t = useTranslations('reviews');
  const { data } = useAdmin();
  const reviews = data.reviews;
  if (!reviews || reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container-custom">
        <header className="text-center mb-12"><span className="section-label">{t('label')}</span><h2 className="section-title">{t('title')}</h2></header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="bg-cream rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-3">{[...Array(5)].map((_, i) => <span key={i} className={i < r.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>)}</div>
              <p className="text-gray-700 mb-4 italic">"{r.text}"</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-graphite">{r.name}</span>
                <span className="text-sm text-gray-500">{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
