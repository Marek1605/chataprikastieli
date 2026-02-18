'use client';
import { useEffect, useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';

export default function Hero() {
  const { data } = useAdmin();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  const h = data.hero;
  const scroll = (id: string) => (e: React.MouseEvent) => { 
    e.preventDefault(); 
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); 
  };

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Pozadie */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-wood/70 via-wood-dark/80 to-graphite/90 z-10" />
        <img 
          src={h.backgroundImage} 
          alt="Chata pri Kaštieli" 
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      
      {/* Obsah */}
      <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto pt-20 pb-24 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white mb-6 leading-tight">{h.title}</h1>
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">{h.subtitle}</p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {h.badges.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm text-white">
              <span>{b.icon}</span><span>{b.text}</span>
            </span>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 px-4">
          <a href="#booking" onClick={scroll('booking')} className="btn btn-lg bg-white text-graphite hover:bg-cream font-semibold shadow-lg">
            📅 {h.cta1}
          </a>
          <a href="#booking" onClick={scroll('booking')} className="btn btn-lg bg-transparent text-white border-2 border-white/60 hover:bg-white/15">
            {h.cta2}
          </a>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-white/90">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">★★★★★</span>
            <span className="font-semibold">{h.rating}</span>
          </div>
          <span className="text-white/50">•</span>
          <span>{h.ratingText}</span>
        </div>
      </div>
    </section>
  );
}
