'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'chata_gallery_v1';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

const defaultGallery: GalleryImage[] = [
  { id: '1', src: '/assets/gallery-1.jpg', alt: 'Interiér' },
  { id: '2', src: '/assets/gallery-2.jpg', alt: 'Obývačka' },
  { id: '3', src: '/assets/gallery-3.jpg', alt: 'Spálňa' },
  { id: '4', src: '/assets/gallery-4.jpg', alt: 'Kuchyňa' },
  { id: '5', src: '/assets/surrounding-2.jpg', alt: 'Okolie' },
  { id: '6', src: '/assets/surrounding-3.jpg', alt: 'Príroda' },
  { id: '7', src: '/assets/surrounding-4.jpg', alt: 'Výhľad' },
  { id: '8', src: '/assets/surrounding-5.jpg', alt: 'Les' },
];

function saveGallery(imgs: GalleryImage[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(imgs)); return true; } 
  catch(e) { console.error('Save error', e); return false; }
}

function loadGallery(): GalleryImage[] | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) { const d = JSON.parse(s); if (Array.isArray(d) && d.length) return d; }
  } catch(e) { console.error('Load error', e); }
  return null;
}

export default function Gallery() {
  const t = useTranslations('gallery');
  const [images, setImages] = useState<GalleryImage[]>(defaultGallery);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [editImg, setEditImg] = useState<GalleryImage|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loaded = loadGallery();
    if (loaded) setImages(loaded);
    if (sessionStorage.getItem('chata_admin') === 'true') setIsAdmin(true);
  }, []);

  const flash = (m: string) => { setStatus(m); setTimeout(() => setStatus(''), 2000); };

  const save = (imgs: GalleryImage[]) => {
    setImages(imgs);
    if (saveGallery(imgs)) flash('✅ Uložené!');
    else flash('❌ Chyba!');
  };

  const del = (id: string) => { if(confirm('Zmazať?')) save(images.filter(i=>i.id!==id)); };
  const move = (i: number, d: number) => {
    const n = [...images]; [n[i], n[i+d]] = [n[i+d], n[i]]; save(n);
  };
  const upd = (id: string, alt: string) => { save(images.map(i=>i.id===id?{...i,alt}:i)); setEditImg(null); };

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if(!f) return;
    if(f.size > 5*1024*1024) { alert('Max 5MB!'); return; }
    flash('⏳ Nahrávam...');
    const r = new FileReader();
    r.onload = (ev) => {
      const b64 = ev.target?.result as string;
      if(b64) { save([...images, {id: Date.now().toString(), src: b64, alt: f.name}]); setShowUpload(false); }
    };
    r.readAsDataURL(f);
    e.target.value = '';
  };

  const openLB = (i: number) => { if(!isAdmin) { setCurrentIndex(i); setLightboxOpen(true); document.body.style.overflow='hidden'; }};
  const closeLB = () => { setLightboxOpen(false); document.body.style.overflow=''; };
  const prev = () => setCurrentIndex(p=>(p-1+images.length)%images.length);
  const next = () => setCurrentIndex(p=>(p+1)%images.length);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if(!lightboxOpen) return; if(e.key==='Escape') closeLB(); if(e.key==='ArrowLeft') prev(); if(e.key==='ArrowRight') next(); };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [lightboxOpen]);

  const grid = ['col-span-2 row-span-2','col-span-1','col-span-1','col-span-1','col-span-1','col-span-2','col-span-1','col-span-1','col-span-1','col-span-1'];

  const Img = ({src,alt,fill,cls=''}:{src:string,alt:string,fill:boolean,cls?:string}) => {
    if(src.startsWith('data:')) return <img src={src} alt={alt} className={cn(fill?'absolute inset-0 w-full h-full object-cover':'max-h-[85vh] object-contain rounded-lg',cls)}/>;
    return fill ? <Image src={src} alt={alt} fill className={cn('object-cover',cls)} sizes="25vw"/> : <Image src={src} alt={alt} width={1200} height={800} className="max-h-[85vh] object-contain rounded-lg"/>;
  };

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-white">
      <div className="container-custom">
        <header className="text-center mb-12"><span className="section-label">{t('label')}</span><h2 className="section-title">{t('title')}</h2></header>

        {isAdmin && (
          <div className="mb-6 p-4 bg-amber-100 border-2 border-amber-500 rounded-xl flex flex-wrap gap-3 items-center">
            <span className="font-bold text-amber-800">🔧 Admin</span>
            <button onClick={()=>setShowUpload(true)} className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold">➕ Pridať</button>
            {status && <span className={cn("px-3 py-1 rounded-lg font-bold text-white", status.includes('✅')?'bg-green-500':status.includes('❌')?'bg-red-500':'bg-blue-500')}>{status}</span>}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[150px] md:auto-rows-[180px]">
          {images.map((img,i) => (
            <article key={img.id} className={cn('relative rounded-xl overflow-hidden cursor-pointer group bg-cream',grid[i%grid.length],isAdmin&&'ring-2 ring-amber-400')}>
              <Img src={img.src} alt={img.alt} fill cls="group-hover:scale-105 transition-transform"/>
              {!isAdmin && <button onClick={()=>openLB(i)} className="absolute inset-0"><div className="absolute inset-0 group-hover:bg-black/20 flex items-center justify-center"><span className="opacity-0 group-hover:opacity-100 bg-white/90 rounded-full p-2">🔍</span></div></button>}
              {isAdmin && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-2">{i>0&&<button onClick={()=>move(i,-1)} className="w-10 h-10 bg-white rounded-lg font-bold">←</button>}{i<images.length-1&&<button onClick={()=>move(i,1)} className="w-10 h-10 bg-white rounded-lg font-bold">→</button>}</div>
                  <div className="flex gap-2"><button onClick={()=>setEditImg(img)} className="px-3 py-2 bg-amber-500 text-white rounded-lg font-bold">✏️</button><button onClick={()=>del(img.id)} className="px-3 py-2 bg-red-500 text-white rounded-lg font-bold">🗑️</button></div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      {editImg && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[400] p-4" onClick={()=>setEditImg(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e=>e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">✏️ Upraviť</h3>
            <img src={editImg.src} alt="" className="w-full h-40 object-contain bg-gray-100 rounded-lg mb-4"/>
            <input value={editImg.alt} onChange={e=>setEditImg({...editImg,alt:e.target.value})} className="w-full px-4 py-2 border rounded-lg mb-4" placeholder="Popis"/>
            <div className="flex gap-3"><button onClick={()=>upd(editImg.id,editImg.alt)} className="flex-1 py-3 bg-amber-500 text-white rounded-lg font-bold">✓ OK</button><button onClick={()=>setEditImg(null)} className="flex-1 py-3 bg-gray-200 rounded-lg">Zrušiť</button></div>
          </div>
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[400] p-4" onClick={()=>setShowUpload(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e=>e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">➕ Pridať</h3>
            <button onClick={()=>fileRef.current?.click()} className="w-full py-8 border-2 border-dashed border-amber-400 rounded-xl hover:bg-amber-50 flex flex-col items-center gap-2"><span className="text-4xl">📁</span><span>Vybrať súbor</span></button>
            <input ref={fileRef} type="file" accept="image/*" onChange={upload} className="hidden"/>
          </div>
        </div>
      )}

      {!isAdmin && <div className={cn('lightbox',lightboxOpen&&'active')} onClick={closeLB}>
        <button className="absolute top-4 right-4 z-20 p-3 bg-white/10 rounded-full text-white text-2xl" onClick={closeLB}>✕</button>
        <button className="hidden sm:block absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 rounded-full text-white text-2xl" onClick={e=>{e.stopPropagation();prev();}}>←</button>
        <button className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 rounded-full text-white text-2xl" onClick={e=>{e.stopPropagation();next();}}>→</button>
        <div onClick={e=>e.stopPropagation()}>{lightboxOpen&&images[currentIndex]&&<Img src={images[currentIndex].src} alt={images[currentIndex].alt} fill={false}/>}</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/30 px-4 py-2 rounded-full">{currentIndex+1}/{images.length}</div>
      </div>}
    </section>
  );
}
