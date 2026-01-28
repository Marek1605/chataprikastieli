'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Question {
  question: string;
  options: string[];
  correct: number;
  image?: string;
  fact: string;
}

const QUESTIONS_SK: Question[] = [
  {
    question: "Ktoré zviera je symbolom Veľkej Fatry?",
    options: ["Medveď hnedý", "Vlk dravý", "Rys ostrovid", "Kamzík vrchovský"],
    correct: 0,
    fact: "Veľká Fatra je domovom približne 100 medveďov hnedých!"
  },
  {
    question: "Aký je najvyšší vrch Veľkej Fatry?",
    options: ["Kriváň", "Ostredok", "Ploská", "Borišov"],
    correct: 1,
    fact: "Ostredok má výšku 1592 m n. m. a ponúka nádherný výhľad na Turiec."
  },
  {
    question: "Ktorý vták s rozpätím krídel až 2,5m žije vo Fatre?",
    options: ["Sokol sťahovavý", "Orol skalný", "Výr skalný", "Bocian biely"],
    correct: 1,
    fact: "Orol skalný je najväčší dravec Slovenska a vo Fatre hniezdi niekoľko párov."
  },
  {
    question: "Ako sa volá národná prírodná rezervácia v Gaderskej doline?",
    options: ["Tlstá", "Suchá dolina", "Padva", "Harmanecká jaskyňa"],
    correct: 0,
    fact: "Rezervácia Tlstá chráni pôvodné bukové a jedľové lesy."
  },
  {
    question: "Ktorá orchidea rastie vo Veľkej Fatre?",
    options: ["Črievičník papučkový", "Tulipán", "Ruža", "Slnečnica"],
    correct: 0,
    fact: "Črievičník papučkový je vzácna orchidea a je prísne chránená!"
  },
  {
    question: "Koľko percent Veľkej Fatry pokrývajú lesy?",
    options: ["50%", "70%", "85%", "95%"],
    correct: 2,
    fact: "Lesy pokrývajú až 85% územia, hlavne buk, jedľa a smrek."
  },
  {
    question: "Ktoré zviera s čiernobielou srsťou žije vo Fatre?",
    options: ["Panda", "Jazvec lesný", "Zebra", "Tučniak"],
    correct: 1,
    fact: "Jazvec lesný je nočné zviera a buduje rozsiahle nory."
  },
  {
    question: "Aká jaskyňa sa nachádza pri Harmanci?",
    options: ["Demänovská", "Harmanecká", "Belianska", "Dobšinská"],
    correct: 1,
    fact: "Harmanecká jaskyňa je dlhá 2763 m a je známa bielymi sintrami."
  },
  {
    question: "Ktorý plaz žije vo Veľkej Fatre?",
    options: ["Krokodíl", "Vretenica severná", "Krajta", "Leguán"],
    correct: 1,
    fact: "Vretenica severná je jediný jedovatý had na Slovensku!"
  },
  {
    question: "Aký je názov doliny známej vodopádmi pri Necpaloch?",
    options: ["Gaderská", "Blatnická", "Necpalská", "Jasenská"],
    correct: 2,
    fact: "Necpalská dolina má krásne vodopády a turistické chodníky."
  },
  {
    question: "Ktorý hmyz opeľuje väčšinu kvetov vo Fatre?",
    options: ["Komár", "Včela medonosná", "Mucha", "Mravec"],
    correct: 1,
    fact: "Včely sú kľúčové pre ekosystém a opeľujú 80% rastlín."
  },
  {
    question: "Aká je typická farba jesenného buka?",
    options: ["Zelená", "Modrá", "Zlatá až oranžová", "Biela"],
    correct: 2,
    fact: "Jesenné farby bukových lesov lákajú tisíce turistov."
  }
];

export default function NatureQuiz() {
  const t = useTranslations('quiz');
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [showFact, setShowFact] = useState(false);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Shuffle and pick 8 questions
    const shuffled = [...QUESTIONS_SK].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 8));
  }, []);

  const handleAnswer = (index: number) => {
    if (answered !== null) return;
    
    setAnswered(index);
    if (index === questions[currentQ].correct) {
      setScore(s => s + 1);
    }
    setShowFact(true);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ(q => q + 1);
      setAnswered(null);
      setShowFact(false);
    }
  };

  const restartQuiz = () => {
    const shuffled = [...QUESTIONS_SK].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 8));
    setCurrentQ(0);
    setScore(0);
    setAnswered(null);
    setShowFact(false);
    setFinished(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { emoji: '🏆', text: t('excellent') };
    if (percentage >= 60) return { emoji: '🌟', text: t('great') };
    if (percentage >= 40) return { emoji: '👍', text: t('good') };
    return { emoji: '📚', text: t('tryAgain') };
  };

  if (!started) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
        <div className="text-5xl mb-4">🦌</div>
        <h3 className="text-2xl font-bold text-graphite mb-2">{t('quizTitle')}</h3>
        <p className="text-graphite/60 mb-6">{t('quizSubtitle')}</p>
        
        <div className="grid grid-cols-4 gap-2 mb-6">
          {['🐻', '🦅', '🌲', '🦊', '🐺', '🦔', '🌸', '🏔️'].map((emoji, i) => (
            <div key={i} className="aspect-square bg-green-50 rounded-xl flex items-center justify-center text-2xl">
              {emoji}
            </div>
          ))}
        </div>

        <p className="text-sm text-graphite/50 mb-4">{t('quizInfo')}</p>
        
        <button
          onClick={() => setStarted(true)}
          className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl transition-all"
        >
          🎯 {t('startQuiz')}
        </button>
      </div>
    );
  }

  if (finished) {
    const result = getScoreMessage();
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
        <div className="text-6xl mb-4">{result.emoji}</div>
        <h3 className="text-2xl font-bold text-graphite mb-2">{result.text}</h3>
        <p className="text-graphite/60 mb-4">
          {t('yourScore')}: <span className="font-bold text-green-600">{score}/{questions.length}</span>
        </p>
        
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-green-800">
            {score >= 6 ? t('expertLevel') : score >= 4 ? t('goodKnowledge') : t('learnMore')}
          </p>
        </div>

        <button
          onClick={restartQuiz}
          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl"
        >
          🔄 {t('playAgainQuiz')}
        </button>
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Progress */}
      <div className="bg-green-100 px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-medium text-green-800">
          {t('question')} {currentQ + 1}/{questions.length}
        </span>
        <span className="text-sm font-medium text-green-800">
          {t('score')}: {score}
        </span>
      </div>

      <div className="p-6">
        {/* Question */}
        <h3 className="text-lg font-bold text-graphite mb-4">{q.question}</h3>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {q.options.map((option, index) => {
            let btnClass = "w-full py-3 px-4 rounded-xl text-left font-medium transition-all ";
            
            if (answered === null) {
              btnClass += "bg-gray-100 hover:bg-green-100 text-graphite";
            } else if (index === q.correct) {
              btnClass += "bg-green-500 text-white";
            } else if (index === answered) {
              btnClass += "bg-red-500 text-white";
            } else {
              btnClass += "bg-gray-100 text-graphite/50";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answered !== null}
                className={btnClass}
              >
                {index === q.correct && answered !== null && "✓ "}
                {index === answered && index !== q.correct && "✗ "}
                {option}
              </button>
            );
          })}
        </div>

        {/* Fact */}
        {showFact && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-amber-800">
              <span className="font-bold">💡 {t('didYouKnow')}</span> {q.fact}
            </p>
          </div>
        )}

        {/* Next button */}
        {answered !== null && (
          <button
            onClick={nextQuestion}
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl"
          >
            {currentQ + 1 >= questions.length ? t('seeResults') : t('nextQuestion')} →
          </button>
        )}
      </div>
    </div>
  );
}
