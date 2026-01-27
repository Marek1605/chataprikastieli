'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface Prize {
  id: number;
  text: string;
  emoji: string;
  probability: number;
  value: string;
}

const PRIZES: Prize[] = [
  { id: 1, text: '10%', emoji: '🎁', probability: 25, value: '10%' },
  { id: 2, text: '5%', emoji: '✨', probability: 30, value: '5%' },
  { id: 3, text: '15%', emoji: '🏆', probability: 12, value: '15%' },
  { id: 4, text: '🌟', emoji: '🌟', probability: 3, value: 'free-night' },
  { id: 5, text: '7%', emoji: '🎊', probability: 20, value: '7%' },
  { id: 6, text: '😢', emoji: '🍃', probability: 10, value: 'none' },
];

export default function ScratchCard() {
  const t = useTranslations('scratch');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const played = localStorage.getItem('scratchPlayed');
    if (played) {
      setHasPlayed(true);
      const savedPrize = localStorage.getItem('scratchPrize');
      if (savedPrize) {
        setPrize(JSON.parse(savedPrize));
      }
    } else {
      const totalProbability = PRIZES.reduce((sum, p) => sum + p.probability, 0);
      let random = Math.random() * totalProbability;
      
      for (const p of PRIZES) {
        random -= p.probability;
        if (random <= 0) {
          setPrize(p);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || hasPlayed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#8B7355');
    gradient.addColorStop(0.5, '#A68B5B');
    gradient.addColorStop(1, '#6B5344');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 16px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t('scratchHere'), rect.width / 2, rect.height / 2 - 10);
    
    ctx.font = '24px sans-serif';
    ctx.fillText('👆', rect.width / 2, rect.height / 2 + 20);
  }, [hasPlayed, t]);

  const calculateScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    return (transparentPixels / (pixels.length / 4)) * 100;
  }, []);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = (x - rect.left) * (canvas.width / rect.width);
    const canvasY = (y - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(canvasX / 2, canvasY / 2, 25, 0, Math.PI * 2);
    ctx.fill();

    if (lastPointRef.current) {
      ctx.lineWidth = 50;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x / 2, lastPointRef.current.y / 2);
      ctx.lineTo(canvasX / 2, canvasY / 2);
      ctx.stroke();
    }

    lastPointRef.current = { x: canvasX, y: canvasY };

    const percentage = calculateScratchPercentage();
    setScratchPercentage(percentage);

    if (percentage > 50 && !isRevealed) {
      revealCard();
    }
  }, [isRevealed, calculateScratchPercentage]);

  const revealCard = useCallback(() => {
    setIsRevealed(true);
    setHasPlayed(true);
    setShowResult(true);
    
    if (prize) {
      localStorage.setItem('scratchPlayed', 'true');
      localStorage.setItem('scratchPrize', JSON.stringify(prize));
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [prize]);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsScratching(true);
    lastPointRef.current = null;

    const point = 'touches' in e ? e.touches[0] : e;
    scratch(point.clientX, point.clientY);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isScratching) return;
    e.preventDefault();

    const point = 'touches' in e ? e.touches[0] : e;
    scratch(point.clientX, point.clientY);
  };

  const handleEnd = () => {
    setIsScratching(false);
    lastPointRef.current = null;
  };

  const resetCard = () => {
    localStorage.removeItem('scratchPlayed');
    localStorage.removeItem('scratchPrize');
    setHasPlayed(false);
    setIsRevealed(false);
    setShowResult(false);
    setScratchPercentage(0);
    
    const totalProbability = PRIZES.reduce((sum, p) => sum + p.probability, 0);
    let random = Math.random() * totalProbability;
    for (const p of PRIZES) {
      random -= p.probability;
      if (random <= 0) {
        setPrize(p);
        break;
      }
    }
  };

  return (
    <section 
      id="scratch-game" 
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-cream via-cream-light to-cream-dark overflow-hidden"
    >
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <header className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-wood mb-3">
            {t('label')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-graphite mb-3">
            {t('title')}
          </h2>
          <p className="text-graphite/60 text-sm sm:text-base max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </header>

        <div className="relative mx-auto" style={{ maxWidth: '320px' }}>
          <div className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-wood/20 ${isRevealed ? 'animate-pulse' : ''}`} style={{ aspectRatio: '4/3' }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-cream-light to-cream">
              {prize && (
                <>
                  <div className={`text-6xl mb-3 ${isRevealed ? 'animate-bounce' : ''}`}>
                    {prize.value === 'none' ? '😢' : prize.emoji}
                  </div>
                  <div className="text-center">
                    {prize.value === 'none' ? (
                      <>
                        <p className="text-xl font-display text-graphite mb-1">{t('noLuck')}</p>
                        <p className="text-sm text-graphite/60">{t('tryAgain')}</p>
                      </>
                    ) : prize.value === 'free-night' ? (
                      <>
                        <p className="text-sm text-wood font-semibold uppercase tracking-wide">{t('youWon')}</p>
                        <p className="text-3xl font-display font-bold text-graphite">{t('freeNight')}</p>
                        <p className="text-sm text-graphite/60 mt-1">{t('prizeHint')}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-wood font-semibold uppercase tracking-wide">{t('youWon')}</p>
                        <p className="text-4xl font-display font-bold text-graphite">{prize.text}</p>
                        <p className="text-lg text-wood">{t('discount')}</p>
                        <p className="text-sm text-graphite/60 mt-1">{t('prizeHint')}</p>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {!hasPlayed && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-pointer touch-none"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                style={{ touchAction: 'none' }}
              />
            )}
          </div>

          {!isRevealed && !hasPlayed && scratchPercentage > 0 && (
            <div className="mt-4">
              <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                <div className="h-full bg-wood transition-all duration-300" style={{ width: `${Math.min(scratchPercentage * 2, 100)}%` }} />
              </div>
              <p className="text-xs text-graphite/50 text-center mt-2">
                {scratchPercentage > 30 ? t('almostThere') : t('keepScratching')}
              </p>
            </div>
          )}
        </div>

        {showResult && prize && (
          <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {prize.value !== 'none' && (
              <div className="mb-4 p-4 bg-success/10 rounded-xl inline-block">
                <p className="text-sm text-success font-medium">
                  {t('codeLabel')}: <span className="font-bold">SCRATCH{prize.value.replace('%', '')}</span>
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#booking" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-graphite hover:bg-black text-white font-medium rounded-xl transition-all duration-300 hover:scale-105">
                <span>📅</span>
                {t('bookNow')}
              </a>
            </div>

            <button onClick={resetCard} className="mt-4 text-graphite/40 text-xs hover:text-graphite/60 underline">
              (Demo: {t('playAgain')})
            </button>
          </div>
        )}

        {hasPlayed && !showResult && prize && (
          <div className="mt-8 text-center">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <p className="text-lg font-display text-graphite mb-2">{t('alreadyPlayed')}</p>
              {prize.value !== 'none' && (
                <p className="text-sm text-graphite/60 mb-4">
                  {t('yourPrize')}: <span className="font-bold text-wood">{prize.value === 'free-night' ? t('freeNight') : `${prize.text} ${t('discount')}`}</span>
                </p>
              )}
              <a href="#booking" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-wood hover:bg-wood-light text-white font-medium rounded-xl transition-colors">
                {t('usePrize')}
              </a>
              <button onClick={resetCard} className="block mx-auto mt-4 text-graphite/40 text-xs hover:text-graphite/60 underline">
                (Demo: {t('playAgain')})
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {[
            { step: '1', icon: '👆', text: t('step1') },
            { step: '2', icon: '🎁', text: t('step2') },
            { step: '3', icon: '📧', text: t('step3') },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-wood/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">{item.icon}</span>
              </div>
              <p className="text-xs text-graphite/60">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
