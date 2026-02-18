'use client';
import { useAdmin } from '@/lib/AdminContext';

export default function Overview() {
  const { data } = useAdmin();
  const o = data.overview;

  return (
    <section id="overview" className="py-16 bg-white">
      <div className="container-custom">
        <header className="text-center mb-12">
          <span className="section-label">{o.label}</span>
          <h2 className="section-title">{o.title}</h2>
        </header>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-600 text-lg mb-8">{o.description}</p>
            <div className="grid grid-cols-2 gap-4">
              {o.features.map(f => (
                <div key={f.id} className="flex items-center gap-3 p-4 bg-cream rounded-xl">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="text-2xl font-bold text-graphite">{f.value}</p>
                    <p className="text-sm text-gray-500">{f.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#d4cfc7]">
            {o.image ? (
              <img 
                src={o.image} 
                alt={o.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
