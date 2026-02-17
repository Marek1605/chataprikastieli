'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminContext';

export default function Gallery() {
  const t = useTranslations('gallery');
  const { data } = useAdmin();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = data.gallery;

  const Img = ({ src, alt, fill }: { src: string; alt: string; fill: boolean }) => {
    if (src.startsWith('data:')) return <img src={src} alt={alt} className={fill ? 'absolute inset-0 w-full h-full object-cover' : 'max-h-[80vh] object-contain'} />;
    return fill ? <Image src={src} alt={alt} fill className="object-cover" sizes="25vw" /> : <Image src={src} alt={alt} width={1200} height={800} className="max-h-[80vh] object-contain" />;
  };

  const grid = ['col-span-2 row-span-2', 'col-span-1', 'col-span-1', 'col-span-1', 'col-span-1', 'col-span-2', 'col-span-1', 'col-span-1'];
  if (!images || images.length === 0) return null;

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container-custom">
        <header className="text-center mb-12"><span className="section-label">{t('label')}</span><h2 className="section-title">{t('title')}</h2></header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[150px] md:auto-rows-[180px]">
          {images.map((img, i) => (
            <article key={img.id} className={cn('relative rounded-xl overflow-hidden cursor-pointer group bg-gray-200', grid[i % grid.length])}>
              <Img src={img.src} alt={img.alt} fill />
              <button onClick={() => { setCurrentIndex(i); setLightboxOpen(true); }} className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
            </article>
          ))}
        </div>
      </div>
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[500]" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white text-4xl" onClick={() => setLightboxOpen(false)}>✕</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl" onClick={(e) => { e.stopPropagation(); setCurrentIndex(p => (p - 1 + images.length) % images.length); }}>←</button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl" onClick={(e) => { e.stopPropagation(); setCurrentIndex(p => (p + 1) % images.length); }}>→</button>
          <div onClick={e => e.stopPropagation()}><Img src={images[currentIndex]?.src || ''} alt={images[currentIndex]?.alt || ''} fill={false} /></div>
          <div className="absolute bottom-4 text-white">{currentIndex + 1} / {images.length}</div>
        </div>
      )}
    </section>
  );
}
