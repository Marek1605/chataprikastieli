'use client';

import { useAdmin } from '@/lib/AdminContext';
import SafeImage from '@/components/SafeImage';

export default function Experience() {
  const { data } = useAdmin();
  const a = data.atmosphere;

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="section-label">{a.label}</span>
          <h2 className="section-title">{a.title}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-600 leading-relaxed">{a.text1}</p>
            <p className="text-lg text-gray-600 leading-relaxed">{a.text2}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-wood/20 to-wood/40">
              <p className="absolute top-4 left-4 z-20 text-graphite font-medium bg-white/90 px-3 py-1 rounded text-sm shadow">{a.morningTitle}</p>
              <SafeImage
                src={a.morningImage}
                alt={a.morningTitle}
                fallback="/assets/gallery-2.jpg"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mt-8 bg-gradient-to-br from-wood/20 to-wood/40">
              <p className="absolute top-4 left-4 z-20 text-graphite font-medium bg-white/90 px-3 py-1 rounded text-sm shadow">{a.eveningTitle}</p>
              <SafeImage
                src={a.eveningImage}
                alt={a.eveningTitle}
                fallback="/assets/gallery-3.jpg"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
