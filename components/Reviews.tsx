'use client';
import { useAdmin } from '@/lib/AdminContext';

export default function Reviews() {
  const { data } = useAdmin();
  const r = data.reviews;
  if (!r.items.length) return null;

  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="container-custom">
        <header className="text-center mb-12">
          <span className="section-label">{r.label}</span>
          <h2 className="section-title">{r.title}</h2>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {r.items.map(rev => (
            <div key={rev.id} className="bg-cream rounded-2xl p-6 shadow-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < rev.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{rev.text}"</p>
              <div className="flex justify-between">
                <span className="font-semibold text-graphite">{rev.name}</span>
                <span className="text-sm text-gray-500">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
