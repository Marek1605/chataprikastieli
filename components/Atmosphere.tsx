'use client';
import Image from 'next/image';
import { useAdmin } from '@/lib/AdminContext';

export default function Atmosphere() {
  const { data } = useAdmin();
  const a = data.atmosphere;
  const Img = ({ src, alt }: { src: string; alt: string }) => {
    if (!src) return <div className="absolute inset-0 bg-cream" />;
    if (src.startsWith('data:')) return <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />;
    return <Image src={src} alt={alt} fill className="object-cover" sizes="50vw" />;
  };

  return (
    <section className="py-16 bg-cream">
      <div className="container-custom">
        <header className="text-center mb-12"><span className="section-label">{a.label}</span><h2 className="section-title">{a.title}</h2></header>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6"><p className="text-gray-600 text-lg">{a.text1}</p><p className="text-gray-600 text-lg">{a.text2}</p></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream"><p className="absolute top-4 left-4 z-10 text-graphite font-medium">{a.morningTitle}</p><Img src={a.morningImage} alt={a.morningTitle} /></div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream mt-8"><p className="absolute top-4 left-4 z-10 text-graphite font-medium">{a.eveningTitle}</p><Img src={a.eveningImage} alt={a.eveningTitle} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
