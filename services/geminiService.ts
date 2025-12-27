import { GoogleGenerativeAI } from "@google/generative-ai";
import { TarotCard } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY не найден в переменных окружения");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const getTarotInterpretation = async (question: string, cards: TarotCard[]): Promise<string> => {
  const prompt = `
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

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest",
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Пустой ответ от API");
    }

    return text;
  } catch (error) {
    console.error("Gemini interpretation error:", error);
    
    // Запасной вариант с другой моделью
    try {
      const fallbackModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest",
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
