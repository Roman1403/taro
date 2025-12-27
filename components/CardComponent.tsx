import React, { useState } from 'react';

const DonationButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  
  // ========== ВСТАВЬТЕ ВАШИ ДАННЫЕ ЗДЕСЬ ==========
  const cardNumber = "2204310154512233"; // Замените на номер вашей карты
  const cardHolder = "Sharov Roman"; // Замените на держателя карты
  const sbpPhone = "+79222946669"; // Замените на ваш номер телефона для СБП
  // =================================================

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
      setCopiedCard(true);
      setTimeout(() => setCopiedCard(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(sbpPhone.replace(/[\s\-\(\)]/g, ''));
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
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
            <h3 className="serif text-2xl text-[#d4af37] mb-4 text-center">
              Поддержать проект
            </h3>
            
            <p className="text-[#d4af37]/70 text-sm mb-6 text-center leading-relaxed">
              Если это предсказание нашло отклик в вашей душе
            </p>

            {/* СБП - приоритетный способ */}
            <div className="bg-[#0a0a0a] border border-[#d4af37]/20 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⚡</span>
                <p className="text-xs text-[#d4af37]/50 uppercase tracking-wider">
                  СБП (Быстрый перевод)
                </p>
              </div>
              <p className="text-[#d4af37] text-lg font-mono tracking-wider mb-3">
                {sbpPhone}
              </p>
              <p className="text-xs text-[#d4af37]/60 mb-3">
                Переведите через приложение банка → СБП → По номеру телефона
              </p>
              <button
                onClick={copyPhone}
                className="w-full py-2 border border-[#d4af37] rounded-full text-[#d4af37] text-xs uppercase tracking-wider hover:bg-[#d4af37] hover:text-black transition-all duration-300"
              >
                {copiedPhone ? '✓ Скопировано' : '📋 Копировать телефон'}
              </button>
            </div>

            {/* Разделитель */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-[1px] bg-[#d4af37]/20"></div>
              <span className="text-xs text-[#d4af37]/40 uppercase tracking-widest">или</span>
              <div className="flex-1 h-[1px] bg-[#d4af37]/20"></div>
            </div>

            {/* Номер карты */}
            <div className="bg-[#0a0a0a] border border-[#d4af37]/20 rounded-lg p-4 mb-6">
              <p className="text-xs text-[#d4af37]/50 uppercase tracking-wider mb-2">
                Номер карты
              </p>
              <p className="text-[#d4af37] text-base font-mono tracking-wider mb-2">
                {cardNumber}
              </p>
              <p className="text-xs text-[#d4af37]/50 uppercase tracking-wider mb-1">
                Владелец
              </p>
              <p className="text-[#d4af37]/80 text-sm mb-3">
                {cardHolder}
              </p>
              <button
                onClick={copyCard}
                className="w-full py-2 border border-[#d4af37]/50 rounded-full text-[#d4af37] text-xs uppercase tracking-wider hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300"
              >
                {copiedCard ? '✓ Скопировано' : '📋 Копировать номер'}
              </button>
            </div>

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
