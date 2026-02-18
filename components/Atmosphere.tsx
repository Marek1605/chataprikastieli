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
              <p className="absolute top-4 left-4 z-10 text-graphite font-medium bg-white/80 px-2 py-1 rounded">{a.morningTitle}</p>
              {a.morningImage && (
                <img 
                  src={a.morningImage} 
                  alt={a.morningTitle} 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#e8e4dc] mt-8">
              <p className="absolute top-4 left-4 z-10 text-graphite font-medium bg-white/80 px-2 py-1 rounded">{a.eveningTitle}</p>
              {a.eveningImage && (
                <img 
                  src={a.eveningImage} 
                  alt={a.eveningTitle} 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
