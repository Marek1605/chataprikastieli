'use client';

import { useAdmin } from '@/lib/AdminContext';

export default function Reset() {
  const { data } = useAdmin();
  const r = data.reset || {
    label: 'RESET POBYT',
    title: 'Nacerpajte novu energiu',
    items: [
      { icon: '☀️', title: 'Ranne prebuzenie', desc: 'Prebudte sa s prirodzenym svetlom a vyhladom na hory.' },
      { icon: '🚶', title: 'Prechadzky', desc: 'Objavte krasu okolitych lesov a dolin.' },
      { icon: '📵', title: 'Digital detox', desc: 'Odlozte telefon a uzite si cas s blizkymi.' },
      { icon: '😴', title: 'Kvalitny oddych', desc: 'Cisty horsky vzduch a absolutne ticho.' },
    ],
  };

  return (
    <section className="py-20 bg-graphite text-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="section-label !text-wood-light">{r.label}</span>
          <h2 className="section-title !text-white">{r.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {r.items.map((item: any, index: number) => (
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
