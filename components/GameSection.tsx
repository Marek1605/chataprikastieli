'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const LuckyWheel = dynamic(() => import('./LuckyWheel'), {
  loading: () => <GameSkeleton />,
  ssr: false
});

const ScratchCard = dynamic(() => import('./ScratchCard'), {
  loading: () => <GameSkeleton />,
  ssr: false
});

function GameSkeleton() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-wood/20 rounded-full" />
        <div className="h-4 w-32 bg-wood/20 rounded" />
      </div>
    </div>
  );
}

type GameType = 'wheel' | 'scratch';

export default function GameSection() {
  const t = useTranslations('games');
  const [activeGame, setActiveGame] = useState<GameType>('wheel');

  return (
    <section id="games" className="relative overflow-hidden">
      <div className="bg-graphite py-6 border-b border-white/10">
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-wood-light">
              {t('label')}
            </span>
            <h2 className="text-xl font-display text-white mt-1">
              {t('title')}
            </h2>
          </div>
          
          <div className="flex gap-2 p-1 bg-white/10 rounded-xl">
            <button
              onClick={() => setActiveGame('wheel')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeGame === 'wheel' 
                  ? 'bg-wood text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg">🎡</span>
              <span className="hidden xs:inline">{t('wheelTab')}</span>
            </button>
            
            <button
              onClick={() => setActiveGame('scratch')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeGame === 'scratch' 
                  ? 'bg-wood text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg">🎫</span>
              <span className="hidden xs:inline">{t('scratchTab')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="transition-all duration-500">
        {activeGame === 'wheel' ? <LuckyWheel /> : <ScratchCard />}
      </div>
    </section>
  );
}
