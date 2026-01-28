'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

// Dynamic imports to reduce initial bundle
const MemoryGame = dynamic(() => import('./MemoryGame'), {
  loading: () => <GameLoading />
});
const NatureQuiz = dynamic(() => import('./NatureQuiz'), {
  loading: () => <GameLoading />
});
const SnakeGame = dynamic(() => import('./SnakeGame'), {
  loading: () => <GameLoading />
});

function GameLoading() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="animate-spin text-4xl mb-4">🎮</div>
      <p className="text-graphite/60">Načítavam hru...</p>
    </div>
  );
}

type GameType = 'hub' | 'pexeso' | 'quiz' | 'snake';

interface GameCard {
  id: GameType;
  emoji: string;
  color: string;
  bgColor: string;
}

const GAMES: GameCard[] = [
  { id: 'pexeso', emoji: '🎴', color: 'text-emerald-600', bgColor: 'bg-emerald-50 hover:bg-emerald-100' },
  { id: 'quiz', emoji: '🦌', color: 'text-green-600', bgColor: 'bg-green-50 hover:bg-green-100' },
  { id: 'snake', emoji: '🐍', color: 'text-purple-600', bgColor: 'bg-purple-50 hover:bg-purple-100' },
];

export default function GameHub() {
  const t = useTranslations('gameHub');
  const [activeGame, setActiveGame] = useState<GameType>('hub');

  const renderGame = () => {
    switch (activeGame) {
      case 'pexeso':
        return <MemoryGame />;
      case 'quiz':
        return <NatureQuiz />;
      case 'snake':
        return <SnakeGame />;
      default:
        return null;
    }
  };

  // Game hub - selection screen
  if (activeGame === 'hub') {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <header className="text-center mb-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-wood mb-3">
              {t('label')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-graphite mb-3">
              {t('title')}
            </h2>
            <p className="text-graphite/60 max-w-xl mx-auto">
              {t('subtitle')}
            </p>
          </header>

          {/* Game cards */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={`${game.bgColor} rounded-2xl p-6 text-left transition-all hover:scale-[1.02] active:scale-[0.98] group`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {game.emoji}
                </div>
                <h3 className={`text-xl font-bold ${game.color} mb-2`}>
                  {t(`${game.id}.title`)}
                </h3>
                <p className="text-sm text-graphite/60 mb-4">
                  {t(`${game.id}.desc`)}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-graphite/40">
                  <span>{t(`${game.id}.players`)}</span>
                  <span>•</span>
                  <span>{t(`${game.id}.time`)}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Fun facts */}
          <div className="mt-10 text-center">
            <p className="text-sm text-graphite/50">
              💡 {t('funFact')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Active game view
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="max-w-lg mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => setActiveGame('hub')}
          className="flex items-center gap-2 text-graphite/60 hover:text-graphite mb-6 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          {t('backToGames')}
        </button>

        {/* Game container */}
        <div className="relative">
          {renderGame()}
        </div>
      </div>
    </section>
  );
}
