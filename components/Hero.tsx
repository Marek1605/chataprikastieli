'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';

export default function Hero() {
  const t = useTranslations('hero');
  const { data } = useAdmin();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { setIsLoaded(true); }, []);

  const { title, subtitle, backgroundImage, badges } = data.hero;
  const isBase64 = backgroundImage.startsWith('data:');

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-wood/70 via-wood-dark/80 to-graphite/90 z-10" />
        {isBase64 ? <img src={backgroundImage} alt="Chata" className="absolute inset-0 w-full h-full object-cover" /> : <Image src={backgroundImage} alt="Chata" fill priority className="object-cover" sizes="100vw" quality={85} />}
      </div>
      <div className={`relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20 pb-24 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-normal text-white mb-4 sm:mb-6 text-shadow-lg leading-tight">{title}</h1>
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          {badges.map((badge, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white">
              <span>{badge.icon}</span><span>{badge.text}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 px-4">
          <a href="#booking" onClick={scrollTo('booking')} className="btn btn-lg bg-white text-graphite hover:bg-cream font-semibold shadow-lg w-full sm:w-auto justify-center">📅 {t('cta1')}</a>
          <a href="#booking" onClick={scrollTo('booking')} className="btn btn-lg bg-transparent text-white border-2 border-white/60 hover:bg-white/15 font-medium w-full sm:w-auto justify-center">{t('cta2')}</a>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white/90">
          <div className="flex items-center gap-2"><span className="text-yellow-400 text-lg">★★★★★</span><span className="font-semibold">4.9/5</span></div>
          <span className="hidden sm:inline text-white/50">•</span>
          <span className="text-sm sm:text-base">{t('socialProof')}</span>
        </div>
      </div>
    </section>
  );
}
