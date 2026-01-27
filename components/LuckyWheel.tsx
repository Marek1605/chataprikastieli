'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface Prize {
  id: number;
  text: string;
  color: string;
  probability: number;
  value: string;
  emoji: string;
}

const PRIZES: Prize[] = [
  { id: 1, text: '10%', color: '#8B7355', probability: 25, value: '10%', emoji: '🎁' },
  { id: 2, text: '5%', color: '#A68B5B', probability: 30, value: '5%', emoji: '✨' },
  { id: 3, text: '15%', color: '#6B5344', probability: 10, value: '15%', emoji: '🏆' },
  { id: 4, text: '🍀', color: '#4A7C59', probability: 5, value: 'free-night', emoji: '🌟' },
  { id: 5, text: '7%', color: '#8B7355', probability: 20, value: '7%', emoji: '🎊' },
  { id: 6, text: '😢', color: '#B85450', probability: 10, value: 'none', emoji: '🍃' },
];

const SEGMENT_ANGLE = 360 / PRIZES.length;

export default function LuckyWheel() {
  const t = useTranslations('wheel');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    const played = localStorage.getItem('wheelPlayed');
    if (played) {
      setHasPlayed(true);
      setShowEmailForm(false);
    }
  }, []);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  const selectPrize = useCallback((): Prize => {
    const totalProbability = PRIZES.reduce((sum, p) => sum + p.probability, 0);
    let random = Math.random() * totalProbability;
    
    for (const prize of PRIZES) {
      random -= prize.probability;
      if (random <= 0) return prize;
    }
    return PRIZES[0];
  }, []);

  const spinWheel = useCallback(() => {
    if (isSpinning || (hasPlayed && !prize)) return;

    setIsSpinning(true);
    setPrize(null);

    const selectedPrize = selectPrize();
    const prizeIndex = PRIZES.findIndex(p => p.id === selectedPrize.id);
    
    const baseSpins = 5;
    const prizeAngle = prizeIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const finalRotation = baseSpins * 360 + (360 - prizeAngle) + Math.random() * (SEGMENT_ANGLE * 0.6) - SEGMENT_ANGLE * 0.3;
    
    setRotation(prev => prev + finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setPrize(selectedPrize);
      setShowModal(true);
      setHasPlayed(true);
      localStorage.setItem('wheelPlayed', 'true');
      localStorage.setItem('wheelPrize', JSON.stringify(selectedPrize));
      
      if (email) {
        localStorage.setItem('wheelEmail', email);
      }
    }, 5000);
  }, [isSpinning, hasPlayed, prize, selectPrize, email]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmailValid) {
      setShowEmailForm(false);
    }
  };

  const resetWheel = () => {
    localStorage.removeItem('wheelPlayed');
    localStorage.removeItem('wheelPrize');
    setHasPlayed(false);
    setPrize(null);
    setShowEmailForm(true);
    setEmail('');
    setRotation(0);
  };

  return (
    <section 
      id="lucky-wheel" 
      className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-graphite via-graphite-light to-wood-dark overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🏔️</div>
        <div className="absolute top-20 right-20 text-4xl">🌲</div>
        <div className="absolute bottom-20 left-20 text-5xl">⭐</div>
        <div className="absolute bottom-10 right-10 text-4xl">🍀</div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-8 sm:mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-wood-light mb-3">
            {t('label')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-white mb-3">
            {t('title')}
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          <div className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-white drop-shadow-lg" />
            </div>

            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-wood-light via-wood to-wood-dark blur-xl opacity-50 scale-110" />

            <div 
              className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full shadow-2xl overflow-hidden border-4 border-white/20"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {PRIZES.map((prize, index) => {
                  const startAngle = index * SEGMENT_ANGLE;
                  const endAngle = startAngle + SEGMENT_ANGLE;
                  const startRad = (startAngle - 90) * Math.PI / 180;
                  const endRad = (endAngle - 90) * Math.PI / 180;
                  
                  const x1 = 50 + 50 * Math.cos(startRad);
                  const y1 = 50 + 50 * Math.sin(startRad);
                  const x2 = 50 + 50 * Math.cos(endRad);
                  const y2 = 50 + 50 * Math.sin(endRad);
                  
                  const textAngle = startAngle + SEGMENT_ANGLE / 2;
                  const textRad = (textAngle - 90) * Math.PI / 180;
                  const textX = 50 + 32 * Math.cos(textRad);
                  const textY = 50 + 32 * Math.sin(textRad);

                  return (
                    <g key={prize.id}>
                      <path
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                        fill={prize.color}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="0.5"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      >
                        {prize.text}
                      </text>
                    </g>
                  );
                })}
                <circle cx="50" cy="50" r="12" fill="#2C2C2C" stroke="white" strokeWidth="2" />
                <text x="50" y="50" fill="white" fontSize="8" textAnchor="middle" dominantBaseline="middle">🏔️</text>
              </svg>
            </div>
          </div>

          <div className="w-full max-w-sm">
            {showEmailForm && !hasPlayed ? (
              <form onSubmit={handleEmailSubmit} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-xl font-display text-white mb-2">{t('enterEmail')}</h3>
                <p className="text-white/60 text-sm mb-4">{t('emailHint')}</p>
                
                <div className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-wood-light transition-colors"
                    required
                  />
                  
                  <button
                    type="submit"
                    disabled={!isEmailValid}
                    className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                      isEmailValid 
                        ? 'bg-wood hover:bg-wood-light text-white hover:scale-[1.02]' 
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    {t('continue')}
                  </button>
                </div>

                <p className="text-white/40 text-xs mt-4 text-center">{t('privacyNote')}</p>
              </form>
            ) : !hasPlayed ? (
              <div className="text-center">
                <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className={`relative px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                    isSpinning 
                      ? 'bg-white/20 text-white/50 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-wood to-wood-light text-white hover:scale-105 hover:shadow-xl active:scale-95'
                  }`}
                >
                  {isSpinning ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">🎰</span>
                      {t('spinning')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      {t('spin')}
                    </span>
                  )}
                </button>
                {email && <p className="text-white/50 text-sm mt-4">📧 {email}</p>}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-xl font-display text-white mb-2">{t('alreadyPlayed')}</h3>
                <p className="text-white/60 text-sm mb-4">{t('alreadyPlayedHint')}</p>
                
                <a href="#booking" className="inline-block px-6 py-3 bg-wood hover:bg-wood-light text-white font-medium rounded-xl transition-all duration-300">
                  {t('bookNow')}
                </a>

                <button onClick={resetWheel} className="block mx-auto mt-4 text-white/40 text-xs hover:text-white/60 underline">
                  (Demo: Skúsiť znova)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 max-w-2xl mx-auto">
          {PRIZES.map((prize) => (
            <div key={prize.id} className="text-center p-2 rounded-lg bg-white/5" style={{ borderBottom: `3px solid ${prize.color}` }}>
              <span className="text-xl">{prize.emoji}</span>
              <span className="block text-white/70 text-xs mt-1">
                {prize.value === 'none' ? t('noLuck') : prize.value === 'free-night' ? t('freeNight') : `${t('discount')} ${prize.value}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showModal && prize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            {prize.value === 'none' ? (
              <>
                <div className="text-6xl mb-4">😢</div>
                <h3 className="text-2xl font-display text-graphite mb-2">{t('noWin')}</h3>
                <p className="text-graphite/60 mb-6">{t('noWinText')}</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h3 className="text-2xl font-display text-graphite mb-2">{t('youWon')}</h3>
                <div className="py-4 px-6 bg-gradient-to-r from-wood to-wood-light rounded-xl text-white mb-4">
                  <span className="text-3xl font-bold">
                    {prize.value === 'free-night' ? t('freeNightPrize') : `${prize.value} ${t('discountText')}`}
                  </span>
                </div>
                <p className="text-graphite/60 text-sm mb-6">{t('prizeHint')}</p>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#booking" className="flex-1 py-3 bg-graphite hover:bg-black text-white font-medium rounded-xl transition-colors" onClick={() => setShowModal(false)}>
                {t('useNow')}
              </a>
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-cream hover:bg-cream-dark text-graphite font-medium rounded-xl transition-colors">
                {t('later')}
              </button>
            </div>

            {prize.value !== 'none' && (
              <p className="text-graphite/40 text-xs mt-4">
                {t('codeHint')}: <strong>WHEEL{prize.value.replace('%', '')}</strong>
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
