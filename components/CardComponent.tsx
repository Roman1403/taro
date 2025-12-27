
import React, { useState, useEffect } from 'react';
import { TarotCard } from '../types';

interface CardComponentProps {
  card: TarotCard;
  index: number;
  revealed: boolean;
  onReveal?: () => void;
}

const CardComponent: React.FC<CardComponentProps> = ({ card, index, revealed, onReveal }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (revealed) {
      const timer = setTimeout(() => setIsFlipped(true), index * 400);
      return () => clearTimeout(timer);
    }
  }, [revealed, index]);

  return (
    <div 
      className="relative w-full aspect-[2/3] perspective-1000 cursor-pointer mb-6 md:mb-0"
      onClick={() => !isFlipped && onReveal?.()}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-[#0f0f0f] border border-[#d4af37]/40 rounded-lg flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
             <svg width="80%" height="80%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="#d4af37" strokeWidth="0.5" />
                <path d="M50 5 L50 95 M5 50 L95 50" stroke="#d4af37" strokeWidth="0.5" />
                <path d="M15 15 L85 85 M15 85 L85 15" stroke="#d4af37" strokeWidth="0.5" />
             </svg>
          </div>
          <div className="serif text-2xl opacity-40 font-light tracking-widest text-[#d4af37]">ОРАКУЛ</div>
        </div>

        {/* Card Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#0a0a0a] border border-[#d4af37] rounded-lg p-4 flex flex-col items-center justify-between text-center shadow-2xl">
          <div className="w-full h-2/3 flex items-center justify-center opacity-80">
             {/* Abstract Minimalist Illustration Placeholder */}
             <svg viewBox="0 0 100 120" className="w-4/5 h-auto text-[#d4af37]">
                <rect x="10" y="10" width="80" height="100" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 2" />
                <path d="M20 110 L80 110 M50 20 L50 40" stroke="currentColor" strokeWidth="1" />
                <text x="50" y="70" textAnchor="middle" fontSize="4" fill="currentColor" className="opacity-40">{card.description}</text>
             </svg>
          </div>
          <div className="flex flex-col gap-1 w-full mt-2">
            <h3 className="text-lg md:text-xl font-medium tracking-wide border-b border-[#d4af37]/20 pb-1">{card.name}</h3>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-60 mt-2">{card.meaning}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
