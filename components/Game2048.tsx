'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type Grid = (number | null)[][];
const GRID_SIZE = 4;

export default function Game2048() {
  const t = useTranslations('game2048');
  const [grid, setGrid] = useState<Grid>(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const addNewTile = useCallback((g: Grid) => {
    const emptyCells: { row: number; col: number }[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!g[row][col]) emptyCells.push({ row, col });
      }
    }
    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      g[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }, []);

  const initGame = useCallback(() => {
    const newGrid: Grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    addNewTile(newGrid);
    addNewTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setStarted(true);
  }, [addNewTile]);

  useEffect(() => {
    const saved = localStorage.getItem('game2048Best');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  const slideRow = (row: (number | null)[]): { newRow: (number | null)[]; points: number } => {
    let arr = row.filter(x => x !== null) as number[];
    let points = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        points += arr[i];
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < GRID_SIZE) arr.push(null as any);
    return { newRow: arr, points };
  };

  const rotateGrid = (g: Grid, times: number): Grid => {
    let result = g.map(r => [...r]);
    for (let t = 0; t < times; t++) {
      result = result[0].map((_, i) => result.map(row => row[i]).reverse());
    }
    return result;
  };

  const canMove = (g: Grid): boolean => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!g[row][col]) return true;
        if (col < GRID_SIZE - 1 && g[row][col] === g[row][col + 1]) return true;
        if (row < GRID_SIZE - 1 && g[row][col] === g[row + 1][col]) return true;
      }
    }
    return false;
  };

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || !started) return;

    let newGrid = grid.map(row => [...row]);
    let totalPoints = 0;
    let moved = false;

    const rotations: Record<string, number> = { left: 0, up: 1, right: 2, down: 3 };
    newGrid = rotateGrid(newGrid, rotations[direction]);

    for (let i = 0; i < GRID_SIZE; i++) {
      const { newRow, points } = slideRow(newGrid[i]);
      if (JSON.stringify(newRow) !== JSON.stringify(newGrid[i])) moved = true;
      newGrid[i] = newRow;
      totalPoints += points;
    }

    newGrid = rotateGrid(newGrid, (4 - rotations[direction]) % 4);

    if (moved) {
      addNewTile(newGrid);
      setGrid(newGrid);
      const newScore = score + totalPoints;
      setScore(newScore);
      
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('game2048Best', newScore.toString());
      }

      // Check for 2048
      for (const row of newGrid) {
        if (row.includes(2048) && !won) {
          setWon(true);
        }
      }

      if (!canMove(newGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, score, bestScore, gameOver, won, started, addNewTile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key.replace('Arrow', '').toLowerCase() as any);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      move(dx > 0 ? 'right' : 'left');
    } else if (Math.abs(dy) > 50) {
      move(dy > 0 ? 'down' : 'up');
    }
    setTouchStart(null);
  };

  const getTileStyle = (value: number | null) => {
    const colors: Record<number, string> = {
      2: 'bg-[#eee4da] text-[#776e65]',
      4: 'bg-[#ede0c8] text-[#776e65]',
      8: 'bg-[#f2b179] text-white',
      16: 'bg-[#f59563] text-white',
      32: 'bg-[#f67c5f] text-white',
      64: 'bg-[#f65e3b] text-white',
      128: 'bg-[#edcf72] text-white',
      256: 'bg-[#edcc61] text-white',
      512: 'bg-[#edc850] text-white',
      1024: 'bg-[#edc53f] text-white text-lg',
      2048: 'bg-[#edc22e] text-white text-lg',
    };
    return value ? colors[value] || 'bg-[#3c3a32] text-white text-lg' : 'bg-[#cdc1b4]/50';
  };

  if (!started) {
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-md mx-auto px-4 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-600 mb-3">
            {t('label')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-graphite mb-4">2048</h2>
          <p className="text-graphite/60 mb-8">{t('subtitle')}</p>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096].map(n => (
                <div key={n} className={`aspect-square rounded flex items-center justify-center font-bold text-xs ${getTileStyle(n)}`}>
                  {n}
                </div>
              ))}
            </div>
            <p className="text-sm text-graphite/70 mb-4">{t('instructions')}</p>
            <div className="flex justify-center gap-2 text-2xl mb-2">
              <span>⬆️</span><span>⬇️</span><span>⬅️</span><span>➡️</span>
            </div>
            <p className="text-xs text-graphite/50">{t('controls')}</p>
          </div>

          {bestScore > 0 && (
            <p className="text-sm text-graphite/60 mb-4">
              {t('yourBest')}: <span className="font-bold text-amber-600">{bestScore}</span>
            </p>
          )}
          
          <button
            onClick={initGame}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            🎮 {t('startGame')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-display font-bold text-graphite">2048</h2>
          <div className="flex gap-2">
            <div className="bg-[#bbada0] rounded-lg px-4 py-2 text-center min-w-[80px]">
              <div className="text-[10px] text-white/70 uppercase">{t('score')}</div>
              <div className="text-xl font-bold text-white">{score}</div>
            </div>
            <div className="bg-[#bbada0] rounded-lg px-4 py-2 text-center min-w-[80px]">
              <div className="text-[10px] text-white/70 uppercase">{t('best')}</div>
              <div className="text-xl font-bold text-white">{bestScore}</div>
            </div>
          </div>
        </div>

        <div 
          className="relative bg-[#bbada0] rounded-xl p-3 touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid grid-cols-4 gap-3">
            {grid.flat().map((value, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center font-bold text-2xl transition-all ${getTileStyle(value)}`}
              >
                {value}
              </div>
            ))}
          </div>

          {(gameOver || won) && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center">
              <div className="text-5xl mb-3">{won ? '🏆' : '😢'}</div>
              <h3 className="text-2xl font-bold text-graphite mb-1">
                {won ? t('youWon') : t('gameOver')}
              </h3>
              <p className="text-graphite/60 mb-4">{t('finalScore')}: {score}</p>
              <button
                onClick={initGame}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl"
              >
                {t('playAgain')}
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center">
          <button onClick={initGame} className="text-sm text-amber-600 hover:underline">
            🔄 {t('newGame')}
          </button>
        </div>
      </div>
    </section>
  );
}
