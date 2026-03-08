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
        <SafeImage src={h.backgroundImage} alt="Chata pri Kaštieli" fallback="/assets/hero.jpg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>
      <div className={`relative z-10 text-center text-white px-4 max-w-4xl mx-auto transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6 italic">{title}</h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {badges.map((b, i) => (
            <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm flex items-center gap-2 border border-white/20">
              <span>{b.icon}</span> {b.text}
            </span>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a href="#booking" onClick={scroll('booking')} className="px-8 py-4 bg-white text-graphite rounded-xl font-bold text-lg hover:bg-cream transition-colors flex items-center justify-center gap-2">
            🏨 {cta1}
          </a>
          <a href="#pricing" onClick={scroll('pricing')} className="px-8 py-4 border-2 border-white/50 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
            {cta2}
          </a>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/80">
          <span className="text-amber-400">★★★★★</span>
          <span className="font-bold">{rating}</span>
          <span className="mx-1">•</span>
          <span>{ratingText}</span>
        </div>
      </div>
    </section>
  );
}
