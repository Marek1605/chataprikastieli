'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { faqItems } from '@/lib/config';
import { cn } from '@/lib/utils';

export default function FAQ() {
  const t = useTranslations('faq');
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-16">
          <span className="section-label">{t('label')}</span>
          <h2 className="section-title">{t('title')}</h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={cn(
                  'faq-item border border-cream-dark rounded-xl overflow-hidden transition-all',
                  isOpen && 'active bg-cream'
                )}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium pr-4">
                    {t(item.questionKey.split('.')[1])}
                  </span>
                  <span className="faq-icon text-2xl text-wood transition-transform duration-300 flex-shrink-0">
                    +
                  </span>
                </button>
                <div className="faq-answer">
                  <div className="px-6 pb-6 text-gray-600">
                    {t(item.answerKey.split('.')[1])}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
