'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Hero() {
  const t = useTranslations('hero');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const badges = [
    { icon: '🔒', text: t('badge1') },
    { icon: '🏔️', text: t('badge2') },
    { icon: '🤫', text: t('badge3') },
    { icon: '🔑', text: t('badge4') },
  ];

  const handleScrollToBooking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('booking');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      aria-label="Úvodná sekcia"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-wood/70 via-wood-dark/80 to-graphite/90 z-10" />
        <Image
          src="/assets/hero.jpg"
          alt="Chata pri Kaštieli - Luxusná horská chata v Turci s výhľadom na Malú Fatru"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzXT9Ks7fVLWa8s0vIkfyPDIzBXK9qSADx+HPvNWl3Nots3jhsLSJIhwWJIl4oPuQ5PPHevlKVmTZYDqGaLtn/9k="
        />
      </div>

      {/* Content */}
      <div 
        className={`relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20 pb-24 sm:pt-24 sm:pb-28 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Main Heading - SEO optimized with proper h1 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-normal text-white mb-4 sm:mb-6 text-shadow-lg leading-tight">
          {t('title')}
        </h1>
        
        {/* Subtitle with more SEO content */}
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
          {t('subtitle')}
        </p>

        {/* Trust Badges - responsive grid */}
        <div 
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2"
          role="list"
          aria-label="Výhody ubytovania"
        >
          {badges.map((badge, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white transition-all duration-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
              role="listitem"
            >
              <span aria-hidden="true">{badge.icon}</span>
              <span>{badge.text}</span>
            </span>
          ))}
        </div>

        {/* CTA Buttons - touch optimized */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 px-4">
          <a
            href="#booking"
            onClick={handleScrollToBooking}
            className="btn btn-lg bg-white text-graphite hover:bg-cream font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <span aria-hidden="true">📅</span>
            {t('cta1')}
          </a>
          <a
            href="#booking"
            onClick={handleScrollToBooking}
            className="btn btn-lg bg-transparent text-white border-2 border-white/60 hover:bg-white/15 hover:border-white font-medium w-full sm:w-auto justify-center"
          >
            {t('cta2')}
          </a>
        </div>

        {/* Social Proof / Rating - SEO important */}
        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white/90 transition-all duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="flex items-center gap-2" aria-label="Hodnotenie 4.9 z 5 hviezdičiek">
            <span className="text-yellow-400 tracking-wider text-lg" aria-hidden="true">★★★★★</span>
            <span className="font-semibold">4.9/5</span>
          </div>
          <span className="hidden sm:inline text-white/50">•</span>
          <span className="text-sm sm:text-base">{t('socialProof')}</span>
        </div>
      </div>

      {/* Scroll Indicator - hidden on very small screens */}
      <a
        href="#overview"
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow hidden xs:block"
        aria-label="Prejsť na ďalšiu sekciu"
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById('overview');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full relative flex items-start justify-center pt-2">
          <div className="w-1 h-2.5 bg-white/70 rounded-full animate-pulse" />
        </div>
      </a>

      {/* Schema.org structured data hint for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageObject',
            contentUrl: '/assets/hero.jpg',
            description: 'Luxusná horská chata v Turci s panoramatickým výhľadom na Malú Fatru',
            name: 'Chata pri Kaštieli - Hero Image',
          }),
        }}
      />
    </section>
  );
}
