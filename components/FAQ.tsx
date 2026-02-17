'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAdmin } from '@/lib/AdminContext';

export default function FAQ() {
  const t = useTranslations('faq');
  const { data } = useAdmin();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = data.faq;
  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-cream">
      <div className="container-custom">
        <header className="text-center mb-12"><span className="section-label">{t('label')}</span><h2 className="section-title">{t('title')}</h2></header>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <span className="font-medium text-graphite">{faq.question}</span>
                <span className={`text-2xl transition-transform ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openIndex === i && <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
