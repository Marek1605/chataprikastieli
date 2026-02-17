'use client';
import { useAdmin } from '@/lib/AdminContext';

export default function Amenities() {
  const { data } = useAdmin();
  const a = data.amenities;

  return (
    <section id="amenities" className="py-16 bg-cream">
      <div className="container-custom">
        <header className="text-center mb-12"><span className="section-label">{a.label}</span><h2 className="section-title">{a.title}</h2></header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {a.categories.map(c => (
            <div key={c.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4"><span className="text-3xl">{c.icon}</span><h3 className="font-bold text-lg text-graphite">{c.title}</h3></div>
              <ul className="space-y-2 text-gray-600">{c.items.map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-wood mt-1">•</span><span>{item}</span></li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
