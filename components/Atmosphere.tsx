'use client';
import { useAdmin } from '@/lib/AdminContext';

export default function Atmosphere() {
  const { data } = useAdmin();
  const a = data.atmosphere;

  return (
    <section className="py-16 bg-cream">
      <div className="container-custom">
        <header className="text-center mb-12">
          <span className="section-label">{a.label}</span>
          <h2 className="section-title">{a.title}</h2>
        </header>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">{a.text1}</p>
            <p className="text-gray-600 text-lg">{a.text2}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#e8e4dc]">
              <p className="absolute top-4 left-4 z-20 text-graphite font-medium bg-white/90 px-3 py-1 rounded text-sm shadow">{a.morningTitle}</p>
              <img 
                src={a.morningImage || '/assets/gallery-2.jpg'} 
                alt={a.morningTitle}
                className="absolute inset-0 w-full h-full object-cover z-10"
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/gallery-2.jpg'; }}
              />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#e8e4dc] mt-8">
              <p className="absolute top-4 left-4 z-20 text-graphite font-medium bg-white/90 px-3 py-1 rounded text-sm shadow">{a.eveningTitle}</p>
              <img 
                src={a.eveningImage || '/assets/gallery-3.jpg'} 
                alt={a.eveningTitle}
                className="absolute inset-0 w-full h-full object-cover z-10"
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/gallery-3.jpg'; }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
