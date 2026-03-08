'use client';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAdmin } from '@/lib/AdminContext';
import SafeImage from '@/components/SafeImage';

export default function Hero() {
  const locale = useLocale();
  const t = useTranslations('hero');
  const { data } = useAdmin();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  const sk = locale === 'sk';
  const h = data.hero;

  const title = sk ? h.title : t('title');
  const subtitle = sk ? h.subtitle : t('subtitle');
  const cta1 = sk ? h.cta1 : t('cta1');
  const cta2 = sk ? h.cta2 : t('cta2');
  const rating = sk ? h.rating : t('rating');
  const ratingText = sk ? h.ratingText : t('socialProof');
  const badges = sk ? h.badges : [
    { icon: '🔒', text: t('badge1') },
    { icon: '🏔️', text: t('badge2') },
    { icon: '🤫', text: t('badge3') },
    { icon: '🔑', text: t('badge4') },
  ];

  const scroll = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-wood/70 via-wood-dark/80 to-graphite/90 z-10" />
        <SafeImage
          src={h.backgroundImage}
          alt="Chata pri Kaštieli"
          fallback="/assets/hero.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white mb-6 leading-tight">{title}</h1>
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">{subtitle}</p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {badges.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm text-white">
              <span>{b.icon}</span><span>{b.text}</span>
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 px-4">
          <a href="#booking" onClick={scroll('booking')} className="btn btn-lg bg-white text-graphite hover:bg-cream font-semibold shadow-lg">📅 {cta1}</a>
          <a href="#booking" onClick={scroll('booking')} className="btn btn-lg bg-transparent text-white border-2 border-white/60 hover:bg-white/15">{cta2}</a>
        </div>

        <div className="flex items-center justify-center gap-4 text-white/90">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">★★★★★</span>
            <span className="font-semibold">{rating}</span>
          </div>
          <span className="text-white/50">•</span>
          <span>{ratingText}</span>
        </div>
      </div>
    </section>
  );
}
