'use client';
import { useAdmin } from '@/lib/AdminContext';
import SafeImage from '@/components/SafeImage';

export default function Surroundings() {
  const { data } = useAdmin();
  const s = data.surroundings;
  const fallbacks = ['/assets/surrounding-1.jpg', '/assets/surrounding-2.jpg', '/assets/surrounding-3.jpg', '/assets/surrounding-4.jpg'];

  return (
    <section id="surroundings" className="py-16 bg-white">
      <div className="container-custom">
        <header className="text-center mb-12">
          <span className="section-label">{s.label}</span>
          <h2 className="section-title">{s.title}</h2>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {s.attractions.map((a, i) => (
            <div key={a.id} className="bg-cream rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3] bg-[#d4cfc7]">
                <SafeImage 
                  src={a.image} 
                  alt={a.title}
                  fallback={fallbacks[i % fallbacks.length]}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="text-xs text-wood font-semibold uppercase tracking-wide">{a.category}</span>
                <h3 className="font-bold text-graphite mt-1 text-lg">{a.title}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
