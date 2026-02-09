'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { galleryImages as defaultImages } from '@/lib/config';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/lib/AdminContext';

export default function Gallery() {
  const t = useTranslations('gallery');
  const tLightbox = useTranslations('lightbox');
  const admin = useAdmin();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetIndex, setTargetIndex] = useState<number>(-1);

  // Build images list: admin gallery first, then defaults as fallback
  const adminGallery = admin.content.gallery || [];
  const hasAdminImages = adminGallery.length > 0;

  const images = hasAdminImages
    ? [...adminGallery].sort((a, b) => a.order - b.order).map(g => ({
        id: g.id, src: g.url, alt: g.alt, category: g.category
      }))
    : defaultImages.map((img, i) => ({
        id: `def-${i}`, src: img.src, alt: img.alt, category: 'interior' as const
      }));

  // Lightbox
  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex(p => (p - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(p => (p + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightboxOpen, closeLightbox, goToPrev, goToNext]);

  // === ADMIN: Click on image to replace ===
  const onImageClick = (index: number) => {
    if (admin.isAdmin && admin.isEditing) {
      // In edit mode: open file picker to replace this image
      setTargetIndex(index);
      fileInputRef.current?.click();
    } else {
      // Normal mode: open lightbox
      openLightbox(index);
    }
  };

  // === ADMIN: Handle file selected ===
  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || targetIndex < 0) return;

    const img = images[targetIndex];
    setUploadingId(img.id);

    try {
      const url = await admin.uploadImage(file);
      if (!url) return;

      if (img.id.startsWith('def-')) {
        // Replacing a default placeholder - add as new admin image
        admin.addGalleryImage({ url, alt: img.alt || file.name, category: 'interior' });
      } else {
        // Replacing existing admin image
        admin.updateGalleryImage(img.id, { url });
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload zlyhal: ' + (err instanceof Error ? err.message : 'Neznáma chyba'));
    } finally {
      setUploadingId(null);
      setTargetIndex(-1);
    }
  };

  // === ADMIN: Add brand new image ===
  const onAddNewImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadingId('new');
    try {
      const url = await admin.uploadImage(file);
      if (url) {
        admin.addGalleryImage({ url, alt: file.name.replace(/\.[^.]+$/, ''), category: 'interior' });
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploadingId(null);
    }
  };

  const gridClasses = [
    'col-span-2 row-span-2', '', '', '',
    '', 'col-span-2', '', '', '', '',
  ];

  return (
    <section id="gallery" className="py-16 sm:py-20 lg:py-24 bg-white" aria-labelledby="gallery-title">
      <div className="container-custom">
        <header className="text-center mb-10 sm:mb-12 lg:mb-16">
          <span className="section-label">{t('label')}</span>
          <h2 id="gallery-title" className="section-title">{t('title')}</h2>
          {admin.isAdmin && admin.isEditing && (
            <p className="mt-2 text-sm text-amber-600 font-medium bg-amber-50 inline-block px-4 py-1 rounded-full">
              ✏️ Režim editácie — kliknite na obrázok pre jeho zmenu
            </p>
          )}
        </header>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 auto-rows-[120px] sm:auto-rows-[160px] md:auto-rows-[180px] lg:auto-rows-[200px]">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                'relative rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group',
                'bg-gradient-to-br from-stone-200 to-stone-300',
                gridClasses[index % gridClasses.length],
                admin.isAdmin && admin.isEditing && 'ring-2 ring-amber-400/50 ring-offset-1',
              )}
              onClick={() => onImageClick(index)}
              role="button"
              tabIndex={0}
              aria-label={admin.isEditing ? `Zmeniť: ${image.alt}` : image.alt}
            >
              {/* The image */}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
                onError={(e) => {
                  // Hide broken images
                  (e.target as HTMLImageElement).style.opacity = '0';
                }}
              />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 sm:p-3 pointer-events-none">
                <span className="text-white text-xs sm:text-sm font-medium drop-shadow">{image.alt}</span>
              </div>

              {/* Normal hover */}
              {!(admin.isAdmin && admin.isEditing) && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
              )}

              {/* ADMIN: Edit overlay */}
              {admin.isAdmin && admin.isEditing && (
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/30 transition-all duration-200 pointer-events-none flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-1.5">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl">📷</span>
                    </div>
                    <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full shadow">
                      Klikni → zmeniť fotku
                    </span>
                  </div>
                </div>
              )}

              {/* Uploading spinner */}
              {uploadingId === image.id && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 pointer-events-none">
                  <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-white text-xs font-medium">Nahrávam...</span>
                </div>
              )}

              {/* ADMIN: Delete button */}
              {admin.isAdmin && admin.isEditing && !image.id.startsWith('def-') && (
                <button
                  className="absolute top-2 right-2 z-20 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); admin.removeGalleryImage(image.id); }}
                  title="Odstrániť"
                >✕</button>
              )}
            </div>
          ))}

          {/* ADMIN: Add new image tile */}
          {admin.isAdmin && admin.isEditing && (
            <div className="relative rounded-lg sm:rounded-xl border-3 border-dashed border-amber-400 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-center cursor-pointer group min-h-[120px]">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={onAddNewImage}
              />
              <div className="text-center text-amber-600 group-hover:text-amber-700 transition-colors pointer-events-none">
                {uploadingId === 'new' ? (
                  <>
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span className="text-xs font-medium">Nahrávam...</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl block mb-2">+</span>
                    <span className="text-xs font-bold">Pridať novú fotku</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input for image replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onFileSelected}
      />

      {/* Lightbox */}
      <div
        className={cn('lightbox', lightboxOpen && 'active')}
        onClick={closeLightbox}
        aria-hidden={!lightboxOpen}
      >
        <button
          className="absolute top-6 right-6 text-white text-4xl opacity-70 hover:opacity-100 z-10"
          onClick={closeLightbox}
        >×</button>
        <button
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-white text-4xl opacity-70 hover:opacity-100 z-10 p-2"
          onClick={(e) => { e.stopPropagation(); goToPrev(); }}
        >‹</button>
        <button
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-white text-4xl opacity-70 hover:opacity-100 z-10 p-2"
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
        >›</button>
        <div
          className="relative max-w-[95vw] max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
          onTouchEnd={(e) => {
            const end = e.changedTouches[0].clientX;
            if (touchStart !== null && Math.abs(touchStart - end) > 50) {
              touchStart - end > 0 ? goToNext() : goToPrev();
            }
            setTouchStart(null);
          }}
        >
          {lightboxOpen && images[currentIndex] && (
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              width={1200}
              height={800}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              priority
            />
          )}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="text-white/90 bg-black/40 px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </section>
  );
}
