
import React, { useState } from 'react';
import { BANK_CARD_NUMBER } from '../constants';

const DonationButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BANK_CARD_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-12 mb-8 animate-fade-in">
      <button
        onClick={handleCopy}
        className="px-8 py-3 bg-[#d4af37] text-black font-semibold rounded-full tracking-widest text-sm uppercase gold-glow transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {copied ? 'Скопировано' : 'Поблагодарить автора'}
      </button>
      <p className="text-xs opacity-50 font-light italic">
        {copied ? 'Спасибо. Энергия возвращается.' : 'Если это предсказание нашло отклик в вашей душе'}
      </p>
    </div>
  );
};

export default DonationButton;
