'use client';

import { useTranslations } from 'next-intl';

export default function WhyUs() {
  const t = useTranslations('whyUs');

  const benefits = [
    { icon: '🌲', title: t('benefit1Title'), desc: t('benefit1Desc') },
    { icon: '✨', title: t('benefit2Title'), desc: t('benefit2Desc') },
    { icon: '🎯', title: t('benefit3Title'), desc: t('benefit3Desc') },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-on-scroll">
          <span className="section-label">{t('label')}</span>
          <h2 className="section-title">{t('title')}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{t('text')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-xl text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="font-body text-lg font-semibold mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
