'use client';
import { useAdmin } from '@/lib/AdminContext';

export default function Surroundings() {
  const { data } = useAdmin();
  const s = data.surroundings;

  return (
    <section id="surroundings" className="py-16 bg-white">
      <div className="container-custom">
        <header className="text-center mb-12">
          <span className="section-label">{s.label}</span>
          <h2 className="section-title">{s.title}</h2>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {s.attractions.map(a => (
            <div key={a.id} className="bg-cream rounded-2xl overflow-hidden shadow-sm">
              {/* Obrázok BEZ textu */}
              <div className="relative aspect-[4/3] bg-[#d4cfc7]">
                {a.image && (
                  <img 
                    src={a.image} 
                    alt={a.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
              {/* Text pod obrázkom */}
              <div className="p-4">
                <span className="text-xs text-wood font-semibold uppercase">{a.category}</span>
                <h3 className="font-bold text-graphite mt-1">{a.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
