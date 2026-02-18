'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminContext';

export default function Gallery() {
  const { data } = useAdmin();
  const [lightbox, setLightbox] = useState(false);
  const [idx, setIdx] = useState(0);
  const g = data.gallery;
  const imgs = g.images;

  const grid = ['col-span-2 row-span-2', 'col-span-1', 'col-span-1', 'col-span-1', 'col-span-1', 'col-span-2', 'col-span-1', 'col-span-1'];
  if (!imgs.length) return null;

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container-custom">
        <header className="text-center mb-12">
          <span className="section-label">{g.label}</span>
          <h2 className="section-title">{g.title}</h2>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[150px] md:auto-rows-[180px]">
          {imgs.map((img, i) => (
            <article key={img.id} className={cn('relative rounded-xl overflow-hidden cursor-pointer group bg-cream', grid[i % grid.length])}>
              <img 
                src={img.src} 
                alt={img.alt} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/gallery-1.jpg'; }}
              />
              <button onClick={() => { setIdx(i); setLightbox(true); }} className="absolute inset-0 hover:bg-black/20 transition-colors" />
            </article>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[500]" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300">✕</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300" onClick={e => { e.stopPropagation(); setIdx(p => (p - 1 + imgs.length) % imgs.length); }}>←</button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300" onClick={e => { e.stopPropagation(); setIdx(p => (p + 1) % imgs.length); }}>→</button>
          <div onClick={e => e.stopPropagation()}>
            <img src={imgs[idx]?.src || ''} alt={imgs[idx]?.alt || ''} className="max-h-[80vh] max-w-[90vw] object-contain" />
          </div>
          <div className="absolute bottom-4 text-white bg-black/50 px-4 py-2 rounded-full">{idx + 1} / {imgs.length}</div>
        </div>
      )}
    </section>
  );
}
