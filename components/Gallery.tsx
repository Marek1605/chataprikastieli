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
  const { isAdmin, isEditing, content, uploadImage, addGalleryImage, removeGalleryImage, updateGalleryImage } = useAdmin();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<number | null>(null);

  // Use admin gallery if available, otherwise fall back to config
  const images = content.gallery && content.gallery.length > 0
    ? content.gallery.sort((a, b) => a.order - b.order).map(g => ({ src: g.url, alt: g.alt, id: g.id }))
    : defaultImages.map((img, i) => ({ ...img, id: 'default-' + i }));

  const minSwipeDistance = 50;

  const openLightbox = useCallback((index: number) => {
    if (isEditing && isAdmin) return; // Don't open lightbox in edit mode
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, [isEditing, isAdmin]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, goToPrev, goToNext]);

  // Handle image replacement via upload
  const handleImageReplace = async (file: File, index: number) => {
    setUploading(images[index]?.id || null);
    try {
      const url = await uploadImage(file);
      if (url) {
        const img = images[index];
        if (img.id.startsWith('default-')) {
          // First time editing default images - add to admin gallery
          addGalleryImage({ url, alt: img.alt, category: 'interior' });
        } else {
          updateGalleryImage(img.id, { url });
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(null);
      setReplaceTarget(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && replaceTarget !== null) {
      handleImageReplace(file, replaceTarget);
    }
    e.target.value = '';
  };

  // Handle adding a new image
  const handleAddNew = async (file: File) => {
    setUploading('new');
    try {
      const url = await uploadImage(file);
      if (url) {
        addGalleryImage({ url, alt: 'Nový obrázok', category: 'interior' });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(null);
    }
  };

  const gridClasses = [
    'col-span-2 row-span-2',
    '', '', '',
    '', 'col-span-2',
    '', '', '', '',
  ];

  return (
    <section id="gallery" className="py-16 sm:py-20 lg:py-24 bg-white" aria-labelledby="gallery-title">
      <div className="container-custom">
        <header className="text-center mb-10 sm:mb-12 lg:mb-16">
          <span className="section-label">{t('label')}</span>
          <h2 id="gallery-title" className="section-title">{t('title')}</h2>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 auto-rows-[120px] sm:auto-rows-[160px] md:auto-rows-[180px] lg:auto-rows-[200px]" role="list">
          {images.map((image, index) => (
            <article
              key={image.id}
              className={cn(
                'relative rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group',
                'bg-gradient-to-br from-cream to-cream-dark',
                gridClasses[index % gridClasses.length]
              )}
              role="listitem"
            >
              <button
                className="absolute inset-0 w-full h-full z-10"
                onClick={() => {
                  if (isEditing && isAdmin) {
                    setReplaceTarget(index);
                    fileRef.current?.click();
                  } else {
                    openLightbox(index);
                  }
                }}
                aria-label={isEditing && isAdmin ? `Zmeniť: ${image.alt}` : `Otvoriť: ${image.alt}`}
              />

              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />

              {/* Normal hover overlay */}
              {!isEditing && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
              )}

              {/* Admin edit overlay */}
              {isEditing && isAdmin && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 pointer-events-none flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1">
                    <span className="text-white text-2xl">📷</span>
                    <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      {uploading === image.id ? 'Nahrávam...' : 'Klikni pre zmenu'}
                    </span>
                  </div>
                </div>
              )}

              {/* Uploading indicator */}
              {uploading === image.id && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none z-20">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Delete button in edit mode */}
              {isEditing && isAdmin && !image.id.startsWith('default-') && (
                <button
                  className="absolute top-2 right-2 z-20 w-7 h-7 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); removeGalleryImage(image.id); }}
                  title="Odstrániť obrázok"
                >
                  ✕
                </button>
              )}

              {/* Image label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-3 pointer-events-none">
                <span className="text-white text-xs font-medium">{image.alt}</span>
              </div>
            </article>
          ))}

          {/* Add new image button (admin only) */}
          {isEditing && isAdmin && (
            <article className="relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center cursor-pointer group">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddNew(file);
                  e.target.value = '';
                }}
              />
              <div className="text-center text-gray-400 group-hover:text-gray-600 transition-colors">
                <span className="text-3xl block mb-1">+</span>
                <span className="text-xs font-medium">
                  {uploading === 'new' ? 'Nahrávam...' : 'Pridať fotku'}
                </span>
              </div>
            </article>
          )}
        </div>
      </div>

      {/* Hidden file input for replacing */}
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

      {/* Lightbox */}
      <div
        className={cn('lightbox', lightboxOpen && 'active')}
        onClick={closeLightbox}
        aria-hidden={!lightboxOpen}
        role="dialog"
        aria-modal="true"
      >
        <button className="absolute top-6 right-6 text-white text-4xl opacity-70 hover:opacity-100 transition-opacity z-10"
          onClick={closeLightbox} aria-label={tLightbox('close')}>×</button>
        <button className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-4xl opacity-70 hover:opacity-100 transition-opacity z-10"
          onClick={(e) => { e.stopPropagation(); goToPrev(); }} aria-label={tLightbox('prev')}>‹</button>
        <button className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-4xl opacity-70 hover:opacity-100 transition-opacity z-10"
          onClick={(e) => { e.stopPropagation(); goToNext(); }} aria-label={tLightbox('next')}>›</button>
        <div className="relative max-w-[95vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
          onTouchEnd={(e) => {
            const end = e.changedTouches[0].clientX;
            if (touchStart !== null) {
              const diff = touchStart - end;
              if (Math.abs(diff) > minSwipeDistance) {
                diff > 0 ? goToNext() : goToPrev();
              }
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
          <span className="text-white/90 bg-black/30 px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </section>
  );
}
