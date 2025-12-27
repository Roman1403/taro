import { GoogleGenerativeAI } from "@google/generative-ai";
import { TarotCard } from "../types";

// Получаем API ключ из переменных окружения
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY не найден в переменных окружения");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const getTarotInterpretation = async (question: string, cards: TarotCard[]): Promise<string> => {
  const cardList = cards.map((c) => `${c.name} (${c.meaning})`).join(", ");
  
  const prompt = `
Роль: Старый опытный таролог с глубоким пониманием архетипов.

Язык: Русский.
Тон: Спокойный, мудрый, авторитетный, мудрецкий.
Вопрос пользователя: "${question}"
Выпавшие карты: ${cardList}

Задача: Предоставьте комбинированное толкование этих трех карт применительно к конкретному вопросу пользователя.

ВАЖНО! Структура ответа должна быть строго в таком формате:

**${cards[0].name}** (позиция: прошлое/корни)
[2-3 предложения о том, как эта карта связана с вопросом, что она показывает о прошлом или корнях ситуации]

**${cards[1].name}** (позиция: настоящее)
[2-3 предложения о текущей ситуации, что происходит сейчас в контексте вопроса]

**${cards[2].name}** (позиция: будущее/совет)
[2-3 предложения о потенциальных развитиях событий или совете на будущее]

**Общий вывод:**
[1-4 предложения: синтез всех трёх карт, целостное видение ситуации и главный совет]

Ответ должен быть лаконичным (максимум 180 слов).

Начинайте ответ сразу с толкования.
`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    });

    if (!model) {
      throw new Error("Не удалось инициализировать модель Gemini");
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Пустой ответ от API");
    }

    return text || "Оракул хранит молчание в этот момент. Обратитесь к значениям самих карт как к вашему проводнику.";
  } catch (error) {
    console.error("Gemini interpretation error:", error);
    return "Необходима тишь такой рефлексии. Звёзды скрыты, но карты остаются символами вашего пути.";
  }
};
