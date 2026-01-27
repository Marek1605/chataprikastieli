'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_PAIRS = [
  '🏔️', '🌲', '🦌', '🐻', '🌸', '⛷️', '🏕️', '🌅',
  '🦅', '🍄', '🌿', '❄️'
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function MemoryGame() {
  const t = useTranslations('pexeso');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [isChecking, setIsChecking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerNames, setPlayerNames] = useState({ player1: '', player2: '' });
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');

  const getGridConfig = () => {
    switch (gridSize) {
      case 'small': return { pairs: 6, cols: 'grid-cols-4' };
      case 'medium': return { pairs: 8, cols: 'grid-cols-4' };
      case 'large': return { pairs: 12, cols: 'grid-cols-6' };
    }
  };

  const initGame = useCallback(() => {
    const config = getGridConfig();
    const selectedPairs = CARD_PAIRS.slice(0, config.pairs);
    const cardPairs = [...selectedPairs, ...selectedPairs];
    const shuffled = shuffleArray(cardPairs);
    
    const newCards: Card[] = shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
    
    setCards(newCards);
    setFlippedCards([]);
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
    setGameOver(false);
  }, [gridSize]);

  useEffect(() => {
    if (gameStarted) {
      initGame();
    }
  }, [gameStarted, initGame]);

  const handleCardClick = (cardId: number) => {
    if (isChecking) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flippedCards.length >= 2) return;

    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      
      const [first, second] = newFlipped;
      const firstCard = newCards.find(c => c.id === first);
      const secondCard = newCards.find(c => c.id === second);

      setTimeout(() => {
        if (firstCard?.emoji === secondCard?.emoji) {
          // Match found!
          const matchedCards = newCards.map(c => 
            c.id === first || c.id === second ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          
          setScores(prev => ({
            ...prev,
            [currentPlayer === 1 ? 'player1' : 'player2']: 
              prev[currentPlayer === 1 ? 'player1' : 'player2'] + 1
          }));

          // Check if game over
          if (matchedCards.every(c => c.isMatched)) {
            setGameOver(true);
          }
        } else {
          // No match - flip back and switch player
          const resetCards = newCards.map(c => 
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          );
          setCards(resetCards);
          setCurrentPlayer(prev => prev === 1 ? 2 : 1);
        }
        
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const getWinner = () => {
    if (scores.player1 > scores.player2) return playerNames.player1 || t('player1');
    if (scores.player2 > scores.player1) return playerNames.player2 || t('player2');
    return null; // Remíza
  };

  // Setup screen
  if (!gameStarted) {
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-3">
              {t('label')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-graphite mb-2">
              {t('title')}
            </h2>
            <p className="text-graphite/60">{t('subtitle')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
            {/* Player names */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-graphite mb-1">
                  🔵 {t('player1Name')}
                </label>
                <input
                  type="text"
                  value={playerNames.player1}
                  onChange={e => setPlayerNames(p => ({ ...p, player1: e.target.value }))}
                  placeholder={t('player1')}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-graphite mb-1">
                  🔴 {t('player2Name')}
                </label>
                <input
                  type="text"
                  value={playerNames.player2}
                  onChange={e => setPlayerNames(p => ({ ...p, player2: e.target.value }))}
                  placeholder={t('player2')}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Grid size */}
            <div>
              <label className="block text-sm font-medium text-graphite mb-2">
                {t('difficulty')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small', label: t('easy'), pairs: 6 },
                  { id: 'medium', label: t('medium'), pairs: 8 },
                  { id: 'large', label: t('hard'), pairs: 12 },
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setGridSize(option.id as any)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      gridSize === option.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-graphite hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                    <span className="block text-xs opacity-70">{option.pairs} {t('pairs')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={() => setGameStarted(true)}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              🎮 {t('startGame')}
            </button>
          </div>

          {/* How to play */}
          <div className="mt-6 p-4 bg-white/50 rounded-xl text-center">
            <h4 className="font-semibold text-graphite mb-2">{t('howToPlay')}</h4>
            <p className="text-sm text-graphite/70">{t('instructions')}</p>
          </div>
        </div>
      </section>
    );
  }

  // Game over screen
  if (gameOver) {
    const winner = getWinner();
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-4">{winner ? '🏆' : '🤝'}</div>
            <h2 className="text-2xl font-bold text-graphite mb-2">
              {winner ? `${winner} ${t('wins')}!` : t('draw')}
            </h2>
            
            <div className="flex justify-center gap-8 my-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mx-auto mb-2">
                  {scores.player1}
                </div>
                <p className="text-sm text-graphite/60">{playerNames.player1 || t('player1')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-2xl font-bold text-red-600 mx-auto mb-2">
                  {scores.player2}
                </div>
                <p className="text-sm text-graphite/60">{playerNames.player2 || t('player2')}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={initGame}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl"
              >
                🔄 {t('playAgain')}
              </button>
              <button
                onClick={() => setGameStarted(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-graphite font-bold rounded-xl"
              >
                ⚙️ {t('newGame')}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Game board
  const config = getGridConfig();
  
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="max-w-lg mx-auto px-4">
        {/* Score board */}
        <div className="flex justify-between items-center mb-6">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
            currentPlayer === 1 ? 'bg-blue-500 text-white scale-105' : 'bg-white text-graphite'
          }`}>
            <span className="text-xl">🔵</span>
            <div>
              <p className="text-xs opacity-70">{playerNames.player1 || t('player1')}</p>
              <p className="text-xl font-bold">{scores.player1}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-graphite/50 uppercase">{t('turn')}</p>
            <p className="font-bold text-graphite">
              {currentPlayer === 1 
                ? (playerNames.player1 || t('player1'))
                : (playerNames.player2 || t('player2'))
              }
            </p>
          </div>

          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
            currentPlayer === 2 ? 'bg-red-500 text-white scale-105' : 'bg-white text-graphite'
          }`}>
            <div className="text-right">
              <p className="text-xs opacity-70">{playerNames.player2 || t('player2')}</p>
              <p className="text-xl font-bold">{scores.player2}</p>
            </div>
            <span className="text-xl">🔴</span>
          </div>
        </div>

        {/* Game grid */}
        <div className={`grid ${config.cols} gap-2 sm:gap-3`}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched || isChecking}
              className={`aspect-square rounded-xl text-3xl sm:text-4xl transition-all duration-300 transform ${
                card.isFlipped || card.isMatched
                  ? 'bg-white shadow-lg rotate-0'
                  : 'bg-emerald-500 hover:bg-emerald-400 hover:scale-105 rotate-0'
              } ${card.isMatched ? 'opacity-50' : ''}`}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {(card.isFlipped || card.isMatched) ? card.emoji : '❓'}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={initGame}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-graphite rounded-xl text-sm font-medium"
          >
            🔄 {t('restart')}
          </button>
          <button
            onClick={() => setGameStarted(false)}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-graphite rounded-xl text-sm font-medium"
          >
            ⚙️ {t('settings')}
          </button>
        </div>
      </div>
    </section>
  );
}
