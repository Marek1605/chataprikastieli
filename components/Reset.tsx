'use client';

import { useTranslations } from 'next-intl';

export default function Reset() {
  const t = useTranslations('reset');

  const items = [
    { icon: '☀️', title: t('item1Title'), desc: t('item1Desc') },
    { icon: '🚶', title: t('item2Title'), desc: t('item2Desc') },
    { icon: '📵', title: t('item3Title'), desc: t('item3Desc') },
    { icon: '😴', title: t('item4Title'), desc: t('item4Desc') },
  ];

  return (
    <section className="py-20 bg-graphite text-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="section-label !text-wood-light">{t('label')}</span>
          <h2 className="section-title !text-white">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-body font-semibold mb-2">{item.title}</h3>
              <p className="text-white/70 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
