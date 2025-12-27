import { GoogleGenerativeAI } from "@google/generative-ai";
import { TarotCard } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY не найден в переменных окружения");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
model: "gemini-3-flash",  // ← Только эта модель!
// Настройки генерации
const generationConfig = {
  temperature: 0.8,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048, // ← Достаточно для длинных ответов
};

export const getTarotInterpretation = async (question: string, cards: TarotCard[]): Promise<string> => {
  let prompt = '';
  
  if (cards.length === 1) {
    prompt = `
Ты - мудрый таролог. Дай краткое толкование карты Таро для вопроса пользователя.

Вопрос: "${question}"

Карта: ${cards[0].name} (${cards[0].meaning})

Дай ответ в формате:

**${cards[0].name}**
[3-4 предложения: что означает эта карта в контексте вопроса, какой совет она дает]

Тон: спокойный, мудрый.
Язык: русский.
Объем: максимум 80 слов.
`;
  } else if (cards.length === 3) {
    prompt = `
Ты - мудрый таролог. Дай толкование трех карт Таро для конкретного вопроса пользователя.

Вопрос: "${question}"

Карты в раскладе:
1. ${cards[0].name} (${cards[0].meaning}) - ПРОШЛОЕ/КОРНИ
2. ${cards[1].name} (${cards[1].meaning}) - НАСТОЯЩЕЕ
3. ${cards[2].name} (${cards[2].meaning}) - БУДУЩЕЕ/СОВЕТ

ВАЖНО! Структура ответа должна быть СТРОГО такой:

**${cards[0].name}**
[2-3 предложения: как эта карта связана с вопросом пользователя, что она показывает о прошлом или корнях ситуации]

**${cards[1].name}**
[2-3 предложения: что происходит сейчас в контексте вопроса пользователя, текущая ситуация]

**${cards[2].name}**
[2-3 предложения: что ждет в будущем, какой совет дает эта карта для вопроса пользователя]

**Общий вывод**
[2-3 предложения: синтез всех трёх карт, целостное видение ситуации и главный совет]

Тон: спокойный, мудрый, глубокий.
Язык: русский.
Объем: максимум 200 слов.

Начинай ответ сразу с первой карты.
`;
  } else if (cards.length === 10) {
    const cardsText = cards.map((card, i) => `${i + 1}. ${card.name} (${card.meaning})`).join('\n');
    
    prompt = `
Ты - мудрый таролог. Дай подробное толкование расклада Кельтский крест из 10 карт.

Вопрос: "${question}"

Карты в раскладе:
${cardsText}

Позиции расклада:
1 - Текущая ситуация
2 - Препятствие или влияние
3 - Основа ситуации
4 - Недавнее прошлое
5 - Возможное будущее
6 - Ближайшее будущее
7 - Ваше отношение
8 - Внешние влияния
9 - Надежды и страхи
10 - Итоговый результат

Структура ответа - напиши толкование для каждой карты:

**Карта 1: ${cards[0].name}** - Текущая ситуация
[2 предложения]

**Карта 2: ${cards[1].name}** - Препятствие
[2 предложения]

**Карта 3: ${cards[2].name}** - Основа
[2 предложения]

**Карта 4: ${cards[3].name}** - Недавнее прошлое
[2 предложения]

**Карта 5: ${cards[4].name}** - Возможное будущее
[2 предложения]

**Карта 6: ${cards[5].name}** - Ближайшее будущее
[2 предложения]

**Карта 7: ${cards[6].name}** - Ваше отношение
[2 предложения]

**Карта 8: ${cards[7].name}** - Внешние влияния
[2 предложения]

**Карта 9: ${cards[8].name}** - Надежды и страхи
[2 предложения]

**Карта 10: ${cards[9].name}** - Итоговый результат
[2 предложения]

**Общий вывод**
[3-4 предложения: синтез всего расклада и главный совет]

Тон: спокойный, мудрый, глубокий.
Язык: русский.
Объем: максимум 400 слов.
`;
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash",
      generationConfig, // ← Добавили настройки генерации
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Пустой ответ от API");
    }

    return text;
  } catch (error) {
    console.error("Gemini error:", error);
    
    // Fallback тоже использует gemini-3-flash-preview
    try {
      const fallbackModel = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview", // ← Исправлено!
        generationConfig,
      });
      
      const result = await fallbackModel.generateContent(prompt);
      const response = result.response;
      return response.text() || "Оракул хранит молчание.";
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError);
      return "Необходима тишь такой рефлексии. Звёзды скрыты, но карты остаются символами вашего пути.";
    }
  }
};
