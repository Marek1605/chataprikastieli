'use client';

import { useTranslations } from 'next-intl';

export default function Overview() {
  const t = useTranslations('overview');

  const items = [
    { icon: '👥', title: t('capacity'), desc: t('capacityDesc') },
    { icon: '❤️', title: t('couples'), desc: t('couplesDesc') },
    { icon: '🚗', title: t('parking'), desc: t('parkingDesc') },
    { icon: '📶', title: t('wifi'), desc: t('wifiDesc') },
  ];

  return (
    <section id="overview" className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="text-center p-8 animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-body font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
