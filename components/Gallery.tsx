'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'chata_gallery_v2';
interface GalleryImage { id: string; src: string; alt: string; }

const defaultGallery: GalleryImage[] = [
  { id: '1', src: '/assets/gallery-1.jpg', alt: 'Interiér' },
  { id: '2', src: '/assets/gallery-2.jpg', alt: 'Obývačka' },
  { id: '3', src: '/assets/gallery-3.jpg', alt: 'Spálňa' },
  { id: '4', src: '/assets/gallery-4.jpg', alt: 'Kuchyňa' },
  { id: '5', src: '/assets/surrounding-2.jpg', alt: 'Okolie' },
  { id: '6', src: '/assets/surrounding-3.jpg', alt: 'Príroda' },
];

function saveG(imgs: GalleryImage[]) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(imgs)); return true; } catch { return false; } }
function loadG(): GalleryImage[] | null { try { const s = localStorage.getItem(STORAGE_KEY); if (s) { const d = JSON.parse(s); if (Array.isArray(d) && d.length) return d; } } catch {} return null; }

export default function Gallery() {
  const t = useTranslations('gallery');
  const [images, setImages] = useState<GalleryImage[]>(defaultGallery);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { const l = loadG(); if (l) setImages(l); if (sessionStorage.getItem('chata_admin') === 'true') setIsAdmin(true); }, []);

  const flash = (m: string) => { setStatus(m); setTimeout(() => setStatus(''), 2000); };
  const save = (imgs: GalleryImage[]) => { setImages(imgs); saveG(imgs) ? flash('✅ Uložené!') : flash('❌ Chyba!'); };
  const del = (id: string) => { if (confirm('Zmazať?')) save(images.filter(i => i.id !== id)); };

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alert('Max 5MB!'); return; }
    flash('⏳ Nahrávam...');
    const r = new FileReader();
    r.onload = (ev) => { const b64 = ev.target?.result as string; if (b64) { save([...images, { id: Date.now().toString(), src: b64, alt: f.name }]); setShowUpload(false); } };
    r.readAsDataURL(f); e.target.value = '';
  };

  const Img = ({ src, alt, fill }: { src: string; alt: string; fill: boolean }) => {
    if (src.startsWith('data:')) return <img src={src} alt={alt} className={fill ? 'absolute inset-0 w-full h-full object-cover' : 'max-h-[80vh] object-contain'} />;
    return fill ? <Image src={src} alt={alt} fill className="object-cover" sizes="25vw" /> : <Image src={src} alt={alt} width={1200} height={800} className="max-h-[80vh] object-contain" />;
  };

  const grid = ['col-span-2 row-span-2', 'col-span-1', 'col-span-1', 'col-span-1', 'col-span-1', 'col-span-2'];

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container-custom">
        <header className="text-center mb-12"><span className="section-label">{t('label')}</span><h2 className="section-title">{t('title')}</h2></header>
        {isAdmin && (
          <div className="mb-6 p-4 bg-green-100 border-4 border-green-500 rounded-xl flex flex-wrap gap-3 items-center">
            <span className="font-bold text-green-800 text-lg">🔧 NOVÝ ADMIN PANEL</span>
            <button onClick={() => setShowUpload(true)} className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold text-lg">➕ PRIDAŤ OBRÁZOK</button>
            {status && <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold">{status}</span>}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[150px] md:auto-rows-[180px]">
          {images.map((img, i) => (
            <article key={img.id} className={cn('relative rounded-xl overflow-hidden cursor-pointer group bg-cream', grid[i % grid.length], isAdmin && 'ring-4 ring-green-500')}>
              <Img src={img.src} alt={img.alt} fill />
              {isAdmin && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <button onClick={() => del(img.id)} className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold text-lg">🗑️ ZMAZAŤ</button>
                </div>
              )}
              {!isAdmin && <button onClick={() => { setCurrentIndex(i); setLightboxOpen(true); }} className="absolute inset-0" />}
            </article>
          ))}
        </div>
      </div>
      {showUpload && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[400] p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6">➕ Pridať obrázok</h3>
            <button onClick={() => fileRef.current?.click()} className="w-full py-12 border-4 border-dashed border-green-500 rounded-xl hover:bg-green-50 flex flex-col items-center gap-3">
              <span className="text-5xl">📁</span>
              <span className="text-xl font-bold">Klikni pre výber súboru</span>
              <span className="text-gray-500">Max 5MB</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={upload} className="hidden" />
          </div>
        </div>
      )}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[400]" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white text-4xl font-bold" onClick={() => setLightboxOpen(false)}>✕</button>
          <Img src={images[currentIndex]?.src || ''} alt={images[currentIndex]?.alt || ''} fill={false} />
        </div>
      )}
    </section>
  );
}
