import React, { useState } from 'react';

const DonationButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const cardNumber = "2200 7007 1234 5678"; // Замените на ваш номер карты
  const cardHolder = "IVAN IVANOV"; // Замените на ваше имя

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-8 py-3 bg-[#d4af37] text-black rounded-full uppercase tracking-[0.3em] text-sm font-medium hover:bg-[#c49d2f] transition-all duration-500 shadow-lg hover:shadow-xl"
      >
        Поблагодарить автора
      </button>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-[#1a1a1a] border border-[#d4af37]/30 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="serif text-2xl text-[#d4af37] mb-6 text-center">
              Поддержать проект
            </h3>
            
            <p className="text-[#d4af37]/70 text-sm mb-6 text-center leading-relaxed">
              Если это предсказание нашло отклик в вашей душе
            </p>

            <div className="bg-[#0a0a0a] border border-[#d4af37]/20 rounded-lg p-4 mb-4">
              <p className="text-xs text-[#d4af37]/50 uppercase tracking-wider mb-2">
                Номер карты
              </p>
              <p className="text-[#d4af37] text-lg font-mono tracking-wider mb-3">
                {cardNumber}
              </p>
              <p className="text-xs text-[#d4af37]/50 uppercase tracking-wider mb-1">
                Владелец
              </p>
              <p className="text-[#d4af37]/80 text-sm">
                {cardHolder}
              </p>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full py-3 border-2 border-[#d4af37] rounded-full text-[#d4af37] uppercase tracking-[0.2em] text-sm hover:bg-[#d4af37] hover:text-black transition-all duration-300 mb-4"
            >
              {copied ? '✓ Скопировано' : 'Скопировать номер'}
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full text-[#d4af37]/40 text-xs uppercase tracking-widest hover:text-[#d4af37]/70 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationButton;
