'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { galleryImages } from '@/lib/config';
import { cn } from '@/lib/utils';

export default function Gallery() {
  const t = useTranslations('gallery');
  const tLightbox = useTranslations('lightbox');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

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
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  // Keyboard navigation
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

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  // Responsive grid classes for masonry-like layout
  const gridClasses = [
    'col-span-2 row-span-2', // Large main image
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1', // Wide image
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
  ];

  return (
    <section 
      id="gallery" 
      className="py-16 sm:py-20 lg:py-24 bg-white"
      aria-labelledby="gallery-title"
    >
      <div className="container-custom">
        {/* Section Header */}
        <header className="text-center mb-10 sm:mb-12 lg:mb-16">
          <span className="section-label">{t('label')}</span>
          <h2 id="gallery-title" className="section-title">{t('title')}</h2>
        </header>

        {/* Gallery Grid */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 auto-rows-[120px] sm:auto-rows-[160px] md:auto-rows-[180px] lg:auto-rows-[200px]"
          role="list"
          aria-label="Fotografie chaty"
        >
          {galleryImages.map((image, index) => (
            <article
              key={index}
              className={cn(
                'relative rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group',
                'bg-gradient-to-br from-cream to-cream-dark',
                'focus-within:ring-2 focus-within:ring-wood focus-within:ring-offset-2',
                gridClasses[index]
              )}
              role="listitem"
            >
              <button
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                  }
                }}
                className="absolute inset-0 w-full h-full focus:outline-none"
                aria-label={`${t('openImage')} - ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  loading={index < 4 ? 'eager' : 'lazy'}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2 sm:p-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <div
        ref={lightboxRef}
        className={cn('lightbox', lightboxOpen && 'active')}
        onClick={closeLightbox}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-hidden={!lightboxOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Galéria fotografií"
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          onClick={closeLightbox}
          aria-label={tLightbox('close')}
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation buttons - hidden on mobile (use swipe) */}
        <button
          className="hidden sm:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          aria-label={tLightbox('prev')}
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          className="hidden sm:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          aria-label={tLightbox('next')}
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image container */}
        <div
          className="relative max-w-[95vw] max-h-[85vh] sm:max-w-[90vw] sm:max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {lightboxOpen && (
            <Image
              src={galleryImages[currentIndex].src}
              alt={galleryImages[currentIndex].alt}
              width={1200}
              height={800}
              className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-lg"
              priority
            />
          )}
        </div>

        {/* Counter and swipe hint */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/90 text-sm sm:text-base font-medium bg-black/30 px-4 py-2 rounded-full">
            {currentIndex + 1} / {galleryImages.length}
          </span>
          <span className="text-white/60 text-xs sm:hidden">
            ← Swipe pre navigáciu →
          </span>
        </div>
      </div>
    </section>
  );
}
