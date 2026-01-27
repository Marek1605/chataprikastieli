'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface Card {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_PAIRS = [
  { emoji: '🏔️', name: 'mountain' },
  { emoji: '🌲', name: 'tree' },
  { emoji: '🦌', name: 'deer' },
  { emoji: '🍄', name: 'mushroom' },
  { emoji: '🌸', name: 'flower' },
  { emoji: '☀️', name: 'sun' },
  { emoji: '⭐', name: 'star' },
  { emoji: '🏠', name: 'cabin' },
];

export default function MountainMemory() {
  const t = useTranslations('game');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Initialize game
  const initializeGame = useCallback(() => {
    const duplicatedCards = [...CARD_PAIRS, ...CARD_PAIRS];
    const shuffledCards = duplicatedCards
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        emoji: card.emoji,
        name: card.name,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
    setIsPlaying(true);
    setShowInstructions(false);
  }, []);

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mountainMemoryBestScore');
    if (saved) {
      setBestScore(parseInt(saved, 10));
    }
  }, []);

  // Check for win condition
  useEffect(() => {
    if (matches === CARD_PAIRS.length && isPlaying) {
      setIsWon(true);
      setIsPlaying(false);
      
      // Save best score
      if (!bestScore || moves < bestScore) {
        setBestScore(moves);
        localStorage.setItem('mountainMemoryBestScore', moves.toString());
      }
    }
  }, [matches, moves, bestScore, isPlaying]);

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!isPlaying) return;
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prevCards =>
      prevCards.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <section 
      id="game" 
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-wood-dark via-graphite to-graphite-light overflow-hidden"
      aria-labelledby="game-title"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-wood-light mb-3">
            {t('label')}
          </span>
          <h2 
            id="game-title" 
            className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-white mb-3"
          >
            {t('title')}
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </header>

        {/* Game Container */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8">
          {/* Instructions / Start Screen */}
          {showInstructions && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6 animate-bounce">🏔️</div>
              <h3 className="text-xl font-display text-white mb-4">{t('howToPlay')}</h3>
              <p className="text-white/70 text-sm mb-6 max-w-sm mx-auto">
                {t('instructions')}
              </p>
              <button
                onClick={initializeGame}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-wood hover:bg-wood-light text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>🎮</span>
                {t('startGame')}
              </button>
              
              {bestScore && (
                <p className="mt-4 text-wood-light text-sm">
                  {t('bestScore')}: {bestScore} {t('moves')}
                </p>
              )}
            </div>
          )}

          {/* Game Board */}
          {isPlaying && (
            <>
              {/* Stats Bar */}
              <div className="flex justify-between items-center mb-4 sm:mb-6 px-2">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="block text-2xl font-display text-white">{moves}</span>
                    <span className="text-xs text-white/60 uppercase tracking-wide">{t('moves')}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-display text-wood-light">{matches}/{CARD_PAIRS.length}</span>
                    <span className="text-xs text-white/60 uppercase tracking-wide">{t('pairs')}</span>
                  </div>
                </div>
                {bestScore && (
                  <div className="text-center">
                    <span className="block text-lg font-display text-white/80">⭐ {bestScore}</span>
                    <span className="text-xs text-white/60 uppercase tracking-wide">{t('best')}</span>
                  </div>
                )}
              </div>

              {/* Cards Grid */}
              <div 
                className="grid grid-cols-4 gap-2 sm:gap-3"
                role="grid"
                aria-label={t('gameBoard')}
              >
                {cards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isFlipped || card.isMatched}
                    className={`
                      aspect-square rounded-lg sm:rounded-xl
                      flex items-center justify-center
                      text-2xl sm:text-3xl lg:text-4xl
                      transition-all duration-300 transform
                      focus:outline-none focus:ring-2 focus:ring-wood focus:ring-offset-2 focus:ring-offset-transparent
                      ${card.isFlipped || card.isMatched
                        ? 'bg-white rotate-0 scale-100'
                        : 'bg-gradient-to-br from-wood to-wood-dark hover:from-wood-light hover:to-wood cursor-pointer hover:scale-105 active:scale-95'
                      }
                      ${card.isMatched ? 'opacity-70 bg-green-100' : ''}
                    `}
                    style={{
                      transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
                      transformStyle: 'preserve-3d',
                    }}
                    aria-label={card.isFlipped || card.isMatched ? card.name : t('hiddenCard')}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <span className="animate-in fade-in zoom-in duration-300">{card.emoji}</span>
                    ) : (
                      <span className="text-white/30">?</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Reset Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={initializeGame}
                  className="text-white/60 hover:text-white text-sm underline-offset-4 hover:underline transition-colors"
                >
                  {t('restart')}
                </button>
              </div>
            </>
          )}

          {/* Win Screen */}
          {isWon && (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-display text-white mb-2">{t('congratulations')}</h3>
              <p className="text-white/70 mb-2">
                {t('youWon')} <span className="text-wood-light font-semibold">{moves}</span> {t('moves')}!
              </p>
              
              {moves === bestScore && (
                <p className="text-yellow-400 text-sm mb-4 flex items-center justify-center gap-1">
                  <span>⭐</span> {t('newRecord')}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <button
                  onClick={initializeGame}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-wood hover:bg-wood-light text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <span>🔄</span>
                  {t('playAgain')}
                </button>
                <a
                  href="#booking"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300"
                >
                  <span>📅</span>
                  {t('bookNow')}
                </a>
              </div>

              <p className="mt-6 text-white/50 text-xs max-w-xs mx-auto">
                {t('winMessage')}
              </p>
            </div>
          )}
        </div>

        {/* Fun Facts / Tips */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { emoji: '🏔️', text: t('fact1') },
            { emoji: '🌲', text: t('fact2') },
            { emoji: '🦌', text: t('fact3') },
            { emoji: '⭐', text: t('fact4') },
          ].map((fact, i) => (
            <div 
              key={i}
              className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm"
            >
              <span className="text-2xl mb-1 block">{fact.emoji}</span>
              <span className="text-white/60 text-xs">{fact.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
