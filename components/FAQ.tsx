'use client';
import { useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';

export default function FAQ() {
  const { data } = useAdmin();
  const f = data.faq;
  const [open, setOpen] = useState<number | null>(0);
  if (!f.items.length) return null;

  return (
    <section id="faq" className="py-16 bg-cream">
      <div className="container-custom">
        <header className="text-center mb-12">
          <span className="section-label">{f.label}</span>
          <h2 className="section-title">{f.title}</h2>
        </header>
        <div className="max-w-3xl mx-auto space-y-4">
          {f.items.map((faq, i) => (
            <div key={faq.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button 
                onClick={() => setOpen(open === i ? null : i)} 
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
              >
                <span className="font-medium text-graphite">{faq.question}</span>
                <span className={`text-2xl transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === i && <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
