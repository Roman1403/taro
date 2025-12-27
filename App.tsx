import React, { useState, useEffect, useCallback } from 'react';
import { AppState, TarotCard, Reading, SpreadType } from './types';
import { TAROT_CARDS } from './constants';
import { getTarotInterpretation } from './services/geminiService';
import DonationButton from './components/DonationButton';

const App: React.FC = () => {
  const [step, setStep] = useState<AppState>('input');
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<Reading | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [spreadType, setSpreadType] = useState<SpreadType>('three');

  useEffect(() => {
    const savedQuestion = sessionStorage.getItem('oracle_last_question');
    if (savedQuestion) {
      setQuestion(savedQuestion);
    }
  }, []);

  const handleStartReading = () => {
    if (!question.trim()) return;
    sessionStorage.setItem('oracle_last_question', question);
    setStep('drawing');
  };

  const drawCards = useCallback(() => {
    setIsRevealing(true);
    const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
    
    const cardCount = spreadType === 'one' ? 1 : spreadType === 'three' ? 3 : 10;
    const selected = shuffled.slice(0, cardCount);
    
    setReading({ question, cards: selected });
    setStep('reading');
    
    setTimeout(() => {
      fetchInterpretation(selected);
    }, 2500);
  }, [question, spreadType]);

  const fetchInterpretation = async (cards: TarotCard[]) => {
    setIsInterpreting(true);
    const result = await getTarotInterpretation(question, cards);
    setReading(prev => prev ? { ...prev, interpretation: result } : null);
    setIsInterpreting(false);
    setStep('interpretation');
  };

  const reset = () => {
    setStep('input');
    setReading(null);
    setIsRevealing(false);
    setIsInterpreting(false);
  };

  const copyInterpretation = async () => {
    if (!reading?.interpretation) return;
    
    const text = `🔮 Расклад Таро - ${reading.question}\n\n${reading.interpretation}`;
    
    try {
      await navigator.clipboard.writeText(text);
      alert('✓ Толкование скопировано!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto px-6 py-10 items-center overflow-y-auto bg-[#0a0a0a]">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-[#d4af37]">ОРАКУЛ</h1>
        <div className="w-12 h-[1px] bg-[#d4af37] mx-auto mt-4 opacity-40"></div>
      </header>

      <main className="w-full flex-grow flex flex-col items-center">
        {step === 'input' && (
          <div className="w-full flex flex-col items-center text-center animate-in fade-in duration-1000">
            <h2 className="serif text-2xl mb-8 font-light italic">Что ищет ваша душа?</h2>
            
            {/* Выбор расклада */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setSpreadType('one')}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                  spreadType === 'one' 
                    ? 'bg-[#d4af37] text-black' 
                    : 'border border-[#d4af37]/30 text-[#d4af37]/60 hover:border-[#d4af37]'
                }`}
              >
                1 карта
              </button>
              <button
                onClick={() => setSpreadType('three')}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                  spreadType === 'three' 
                    ? 'bg-[#d4af37] text-black' 
                    : 'border border-[#d4af37]/30 text-[#d4af37]/60 hover:border-[#d4af37]'
                }`}
              >
                3 карты
              </button>
              <button
                onClick={() => setSpreadType('celtic')}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                  spreadType === 'celtic' 
                    ? 'bg-[#d4af37] text-black' 
                    : 'border border-[#d4af37]/30 text-[#d4af37]/60 hover:border-[#d4af37]'
                }`}
              >
                Кельтский крест
              </button>
            </div>
            
            <textarea
              className="w-full bg-transparent border border-[#d4af37]/30 rounded-lg p-4 text-[#d4af37] placeholder-[#d4af37]/20 focus:outline-none focus:border-[#d4af37] transition-all duration-300 min-h-[120px] mb-8 text-center serif text-xl"
              placeholder="Задайте вопрос своему сердцу..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            
            <button
              onClick={handleStartReading}
              disabled={!question.trim()}
              className="px-10 py-3 border border-[#d4af37] rounded-full uppercase tracking-[0.2em] text-sm hover:bg-[#d4af37] hover:text-black transition-all duration-500 disabled:opacity-30 disabled:pointer-events-none"
            >
              Спросить Оракула
            </button>
          </div>
        )}

        {step === 'drawing' && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="serif text-2xl italic tracking-widest mb-8 animate-pulse">
              Перемешиваем судьбу...
            </p>
            
            {/* Анимация карт */}
            <div className="relative w-64 h-96 mb-12">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4af37]/30 rounded-lg"
                  style={{
                    transform: `rotate(${i * 5 - 10}deg) translateY(${i * -2}px)`,
                    animation: `shuffle 2s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
              
              <button 
                onClick={drawCards}
                className="absolute inset-0 flex items-center justify-center z-10"
              >
                <div className="w-24 h-24 rounded-full border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] hover:scale-110 transition-transform bg-black/50">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="0.5"/>
                  </svg>
                </div>
              </button>
            </div>
            
            <p className="text-xs uppercase tracking-widest opacity-40 text-center">
              Нажмите в центр, чтобы вытянуть карты
            </p>
          </div>
        )}

        {(step === 'reading' || step === 'interpretation') && reading && (
          <div className="w-full animate-in fade-in duration-1000">
            <div className="text-center mb-10 px-4">
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2">Путь вопроса</p>
              <p className="serif text-lg italic text-[#d4af37]/80 leading-relaxed">«{reading.question}»</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {reading.cards.map((card, idx) => (
                <div key={card.id} className="flex flex-col items-center space-y-4 group">
                  <div className="relative w-full aspect-[2/3] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4af37]/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-help">
                    <span className="text-6xl">{card.icon}</span>
                    
                    {/* Всплывающая подсказка */}
                    <div className="absolute inset-0 bg-black/95 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center">
                      <p className="text-xs text-[#d4af37]/60 uppercase tracking-widest mb-2">
                        Значение
                      </p>
                      <p className="text-sm text-[#d4af37]/90 leading-relaxed">
                        {card.meaning}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="serif text-xl text-[#d4af37] mb-1">{card.name}</h4>
                    <p className="text-xs uppercase tracking-widest opacity-40">
                      {idx === 0 ? 'ПРОШЛОЕ' : idx === 1 ? 'НАСТОЯЩЕЕ' : 'БУДУЩЕЕ'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {isInterpreting ? (
              <div className="flex flex-col items-center py-10">
                <div className="w-8 h-8 border-t border-r border-[#d4af37] rounded-full animate-spin mb-4"></div>
                <p className="serif italic text-lg opacity-60">Оракул размышляет...</p>
              </div>
            ) : reading.interpretation ? (
              <div className="space-y-6">
                <h3 className="serif text-3xl italic mb-6">Толкование</h3>
                <div className="text-[#d4af37]/90 leading-relaxed text-base max-w-2xl mx-auto text-left space-y-4">
                  {reading.interpretation.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <h4 key={i} className="serif text-xl text-[#d4af37] mt-6 mb-2">{line.replace(/\*\*/g, '')}</h4>;
                    }
                    return line.trim() ? <p key={i} className="leading-relaxed">{line}</p> : null;
                  })}
                </div>
                
                <div className="pt-10">
                  <DonationButton />
                </div>

                <div className="flex flex-col items-center w-full pt-8 gap-4">
                  <button 
                    onClick={copyInterpretation}
                    className="px-8 py-3 border border-[#d4af37]/50 rounded-full text-[#d4af37] uppercase tracking-[0.2em] text-xs hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300"
                  >
                    📋 Копировать ответ
                  </button>
                  
                  <button 
                    onClick={reset}
                    className="px-10 py-4 border-2 border-[#d4af37] rounded-full text-[#d4af37] uppercase tracking-[0.3em] text-sm hover:bg-[#d4af37] hover:text-black transition-all duration-500 font-semibold shadow-lg"
                  >
                    Новая консультация
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </main>

      <footer className="w-full pt-10 pb-4 text-center">
        <p className="text-[8px] uppercase tracking-[0.5em] opacity-20">Древняя мудрость • Современное руководство</p>
      </footer>
    </div>
  );
};

export default App;
