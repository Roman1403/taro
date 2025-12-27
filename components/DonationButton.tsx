import React, { useState } from 'react';

const DonationButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  
  // ========== ВАШИ ДАННЫЕ (скрыты от показа) ==========
  const cardNumberRaw = "2204310154512233";
  const cardHolder = "Sharov Roman";
  const sbpPhoneRaw = "+79222946669";
  // ====================================================

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(cardNumberRaw);
      setCopiedCard(true);
      setTimeout(() => setCopiedCard(false), 2000);
    } catch (err) {
      console.error('Failed to copy card:', err);
    }
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(sbpPhoneRaw);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch (err) {
      console.error('Failed to copy phone:', err);
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
            <div className="bg-[#0a0a0a] border border-[#d4af37]/20 rounded-lg p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚡</span>
                <p className="text-sm text-[#d4af37] uppercase tracking-wider font-semibold">
                  СБП (Быстрый перевод)
                </p>
              </div>
              <p className="text-xs text-[#d4af37]/60 mb-4 leading-relaxed">
                Откройте приложение банка → СБП → По номеру телефона
              </p>
              <button
                onClick={copyPhone}
                className="w-full py-3 bg-[#d4af37] text-black rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#c49d2f] transition-all duration-300 shadow-lg"
              >
                {copiedPhone ? '✓ Телефон скопирован!' : '📱 Копировать номер телефона'}
              </button>
            </div>

            {/* Разделитель */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-[1px] bg-[#d4af37]/20"></div>
              <span className="text-xs text-[#d4af37]/40 uppercase tracking-widest">или</span>
              <div className="flex-1 h-[1px] bg-[#d4af37]/20"></div>
            </div>

            {/* Номер карты */}
            <div className="bg-[#0a0a0a] border border-[#d4af37]/20 rounded-lg p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💳</span>
                <p className="text-sm text-[#d4af37] uppercase tracking-wider font-semibold">
                  Банковская карта
                </p>
              </div>
              <p className="text-xs text-[#d4af37]/60 mb-2">
                Владелец: {cardHolder}
              </p>
              <p className="text-xs text-[#d4af37]/50 mb-4 leading-relaxed">
                Перевод на карту любого банка России
              </p>
              <button
                onClick={copyCard}
                className="w-full py-3 border-2 border-[#d4af37] rounded-full text-[#d4af37] text-xs uppercase tracking-wider font-semibold hover:bg-[#d4af37] hover:text-black transition-all duration-300"
              >
                {copiedCard ? '✓ Номер карты скопирован!' : '💳 Копировать номер карты'}
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
