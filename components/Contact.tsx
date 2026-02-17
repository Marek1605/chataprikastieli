'use client';
import { useTranslations } from 'next-intl';
import { useAdmin } from '@/lib/AdminContext';

export default function Contact() {
  const t = useTranslations('contact');
  const { data } = useAdmin();
  const c = data.contact;

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container-custom">
        <header className="text-center mb-12"><span className="section-label">{t('label')}</span><h2 className="section-title">{t('title')}</h2></header>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4"><span className="text-2xl">📍</span><div><h3 className="font-semibold text-graphite">{t('address')}</h3><p className="text-gray-600">{c.address}</p></div></div>
            <div className="flex items-start gap-4"><span className="text-2xl">📞</span><div><h3 className="font-semibold text-graphite">{t('phone')}</h3><a href={`tel:${c.phone}`} className="text-wood hover:underline">{c.phone}</a></div></div>
            <div className="flex items-start gap-4"><span className="text-2xl">✉️</span><div><h3 className="font-semibold text-graphite">{t('email')}</h3><a href={`mailto:${c.email}`} className="text-wood hover:underline">{c.email}</a></div></div>
            <div className="flex items-start gap-4"><span className="text-2xl">🕐</span><div><h3 className="font-semibold text-graphite">{t('hours')}</h3><p className="text-gray-600">Check-in: {c.checkIn} | Check-out: {c.checkOut}</p></div></div>
          </div>
          <div className="bg-cream rounded-2xl p-6">
            <h3 className="font-bold text-lg text-graphite mb-4">{t('findUs')}</h3>
            <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000!2d18.8735!3d49.0735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zTmVjcGFseQ!5e0!3m2!1ssk!2ssk!4v1" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
