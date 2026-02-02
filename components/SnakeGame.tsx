'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 15;
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const t = useTranslations('snake');
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Load best score
  useEffect(() => {
    const saved = localStorage.getItem('snakeBestScore');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(s => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  const initGame = useCallback(() => {
    const initialSnake = [{ x: 7, y: 7 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setStarted(true);
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake(currentSnake => {
      const head = { ...currentSnake[0] };
      const dir = directionRef.current;

      switch (dir) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (currentSnake.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      const newSnake = [head, ...currentSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > bestScore) {
            setBestScore(newScore);
            localStorage.setItem('snakeBestScore', newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, isPaused, gameOver, bestScore]);

  // Game loop
  useEffect(() => {
    if (started && !gameOver && !isPaused) {
      const speed = Math.max(80, INITIAL_SPEED - Math.floor(score / 50) * 10);
      gameLoopRef.current = setInterval(moveSnake, speed);
      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
    }
  }, [started, gameOver, isPaused, moveSnake, score]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!started) return;
      
      const key = e.key;
      const currentDir = directionRef.current;

      if (key === ' ' || key === 'Escape') {
        e.preventDefault();
        setIsPaused(p => !p);
        return;
      }

      let newDir: Direction | null = null;

      if ((key === 'ArrowUp' || key === 'w' || key === 'W') && currentDir !== 'DOWN') {
        newDir = 'UP';
      } else if ((key === 'ArrowDown' || key === 's' || key === 'S') && currentDir !== 'UP') {
        newDir = 'DOWN';
      } else if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && currentDir !== 'RIGHT') {
        newDir = 'LEFT';
      } else if ((key === 'ArrowRight' || key === 'd' || key === 'D') && currentDir !== 'LEFT') {
        newDir = 'RIGHT';
      }

      if (newDir) {
        e.preventDefault();
        directionRef.current = newDir;
        setDirection(newDir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started]);

  // Touch controls
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const currentDir = directionRef.current;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30 && currentDir !== 'LEFT') {
        directionRef.current = 'RIGHT';
        setDirection('RIGHT');
      } else if (dx < -30 && currentDir !== 'RIGHT') {
        directionRef.current = 'LEFT';
        setDirection('LEFT');
      }
    } else {
      if (dy > 30 && currentDir !== 'UP') {
        directionRef.current = 'DOWN';
        setDirection('DOWN');
      } else if (dy < -30 && currentDir !== 'DOWN') {
        directionRef.current = 'UP';
        setDirection('UP');
      }
    }
    
    touchStartRef.current = null;
  };

  // Mobile D-pad controls
  const handleDPad = (dir: Direction) => {
    const currentDir = directionRef.current;
    if (
      (dir === 'UP' && currentDir !== 'DOWN') ||
      (dir === 'DOWN' && currentDir !== 'UP') ||
      (dir === 'LEFT' && currentDir !== 'RIGHT') ||
      (dir === 'RIGHT' && currentDir !== 'LEFT')
    ) {
      directionRef.current = dir;
      setDirection(dir);
    }
  };

  if (!started) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
        <div className="text-5xl mb-4">🐍</div>
        <h3 className="text-2xl font-bold text-graphite mb-2">{t('title')}</h3>
        <p className="text-graphite/60 mb-6">{t('subtitle')}</p>
        
        <div className="bg-gray-900 rounded-xl p-4 mb-6 mx-auto w-32 h-32 flex items-center justify-center">
          <div className="grid grid-cols-4 gap-1">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-sm ${
                  [5, 6, 7, 11].includes(i) ? 'bg-green-500' : 
                  i === 9 ? 'bg-red-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {bestScore > 0 && (
          <p className="text-sm text-graphite/60 mb-4">
            {t('yourBest')}: <span className="font-bold text-purple-600">{bestScore}</span>
          </p>
        )}

        <p className="text-xs text-graphite/50 mb-4">{t('controls')}</p>
        
        <button
          onClick={initGame}
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg rounded-xl transition-all"
        >
          🎮 {t('startGame')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-purple-100 px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-medium text-purple-800">
          {t('score')}: {score}
        </span>
        <span className="text-sm font-medium text-purple-800">
          {t('best')}: {bestScore}
        </span>
      </div>

      {/* Game board */}
      <div 
        className="p-4 relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="bg-gray-900 rounded-xl p-2 mx-auto touch-none"
          style={{ 
            width: 'min(100%, 320px)',
            aspectRatio: '1',
          }}
        >
          <div 
            className="grid gap-[1px] w-full h-full"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          >
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              
              const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
              const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;

              let cellClass = "rounded-sm transition-colors ";
              if (isSnakeHead) {
                cellClass += "bg-green-400";
              } else if (isSnakeBody) {
                cellClass += "bg-green-600";
              } else if (isFood) {
                cellClass += "bg-red-500 animate-pulse";
              } else {
                cellClass += "bg-gray-800";
              }

              return <div key={index} className={cellClass} />;
            })}
          </div>
        </div>

        {/* Pause/Game Over overlay */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 text-center mx-4">
              <div className="text-4xl mb-2">{gameOver ? '💀' : '⏸️'}</div>
              <h3 className="text-xl font-bold text-graphite mb-2">
                {gameOver ? t('gameOver') : t('paused')}
              </h3>
              {gameOver && (
                <p className="text-graphite/60 mb-4">{t('finalScore')}: {score}</p>
              )}
              <button
                onClick={gameOver ? initGame : () => setIsPaused(false)}
                className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg"
              >
                {gameOver ? t('playAgain') : t('resume')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="p-4 pt-0 sm:hidden">
        <div className="grid grid-cols-3 gap-2 w-32 mx-auto">
          <div />
          <button onClick={() => handleDPad('UP')} className="aspect-square bg-purple-100 rounded-lg flex items-center justify-center text-xl active:bg-purple-200">⬆️</button>
          <div />
          <button onClick={() => handleDPad('LEFT')} className="aspect-square bg-purple-100 rounded-lg flex items-center justify-center text-xl active:bg-purple-200">⬅️</button>
          <button onClick={() => setIsPaused(p => !p)} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-sm active:bg-gray-200">
            {isPaused ? '▶️' : '⏸️'}
          </button>
          <button onClick={() => handleDPad('RIGHT')} className="aspect-square bg-purple-100 rounded-lg flex items-center justify-center text-xl active:bg-purple-200">➡️</button>
          <div />
          <button onClick={() => handleDPad('DOWN')} className="aspect-square bg-purple-100 rounded-lg flex items-center justify-center text-xl active:bg-purple-200">⬇️</button>
          <div />
        </div>
      </div>

      {/* Desktop hint */}
      <p className="text-center text-xs text-graphite/40 pb-4 hidden sm:block">
        {t('keyboardHint')}
      </p>
    </div>
  );
}
