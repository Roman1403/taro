
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, TarotCard, Reading } from './types';
import { TAROT_CARDS } from './constants';
import { getTarotInterpretation } from './services/geminiService';
import CardComponent from './components/CardComponent';
import DonationButton from './components/DonationButton';

const App: React.FC = () => {
  const [step, setStep] = useState<AppState>('input');
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<Reading | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);

  // Restore session
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
    const selected = shuffled.slice(0, 3);
    setReading({ question, cards: selected });
    setStep('reading');
    
    // Auto-progress to interpretation after animation
    setTimeout(() => {
      fetchInterpretation(selected);
    }, 2500);
  }, [question]);

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

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto px-6 py-10 items-center overflow-y-auto bg-[#0a0a0a]">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-[#d4af37]">ОРАКУЛ</h1>
        <div className="w-12 h-[1px] bg-[#d4af37] mx-auto mt-4 opacity-40"></div>
      </header>

      <main className="w-full flex-grow flex flex-col items-center">
        {step === 'input' && (
          <div className="w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="serif text-2xl mb-8 font-light italic">Что ищет ваша душа?</h2>
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
          <div className="flex flex-col items-center justify-center animate-pulse py-20">
            <p className="serif text-2xl italic tracking-widest">Перемешиваем судьбу...</p>
            <div className="mt-12">
               <button 
                onClick={drawCards}
                className="w-24 h-24 rounded-full border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] hover:scale-110 transition-transform"
               >
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="0.5"/>
                 </svg>
               </button>
            </div>
            <p className="mt-8 text-xs uppercase tracking-widest opacity-40 text-center">Нажмите в центр, чтобы вытянуть карты</p>
          </div>
        )}

        {(step === 'reading' || step === 'interpretation') && reading && (
          <div className="w-full animate-in fade-in duration-1000">
            {/* Question Recap */}
            <div className="text-center mb-10 px-4">
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2">Путь вопроса</p>
              <p className="serif text-lg italic text-[#d4af37]/80 leading-relaxed">«{reading.question}»</p>
            </div>

            {/* Cards Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {reading.cards.map((card, idx) => (
                <CardComponent key={card.id} card={card} index={idx} revealed={isRevealing} />
              ))}
            </div>

            {/* Interpretation Section */}
            {(isInterpreting || reading.interpretation) && (
              <div className="w-full text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-8">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent mb-10"></div>
                
                {isInterpreting ? (
                   <div className="flex flex-col items-center py-10">
                      <div className="w-8 h-8 border-t border-r border-[#d4af37] rounded-full animate-spin mb-4"></div>
                      <p className="serif italic text-lg opacity-60">Оракул размышляет...</p>
                   </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="serif text-3xl italic mb-6">Толкование</h3>
                    <div className="text-[#d4af37]/90 leading-relaxed serif text-xl max-w-md mx-auto whitespace-pre-wrap">
                      {reading.interpretation}
                    </div>
                    
                    <div className="pt-10">
                      <DonationButton />
                    </div>

                    <button 
                      onClick={reset}
                      className="text-[10px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity pb-10"
                    >
                      Новая консультация
                    </button>
                  </div>
                )}
              </div>
            )}
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
