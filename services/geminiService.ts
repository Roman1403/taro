import { GoogleGenerativeAI } from "@google/generative-ai";
import { TarotCard } from "../types";

const ai = new GoogleGenerativeAI({ apikey: "AIzaSyAMDTwmUn2jRr4b4ixx_QGsnxYrc3whEa" });

export const getTarotInterpretation = async (question: string, cards: TarotCard[]): Promise<string> => {
  const cardList = cards.map(c => `${c.name} (${c.meaning})`).join(", ");
  const prompt = `
    Роль: Старый опытный таролог с глубоким пониманием архетипов.
    Язык: Русский.
    Тон: Спокойный, мудрый, авторитетный, вдумчивый.
    Вопрос пользователя: "${question}"
    Выпавшие карты: ${cardList}

    Задача: Предоставьте комбинированное толкование этих трех карт применительно к конкретному вопросу пользователя.
    
    ВАЖНО! Структура ответа должна быть СТРОГО в таком формате:

    **${cards[0].name}** (позиция: прошлое/корни)
    [2-3 предложения о том, как эта карта связана с вопросом, что она показывает о прошлом или корнях ситуации]

    **${cards[1].name}** (позиция: настоящее)
    [2-3 предложения о текущей ситуации, что происходит сейчас в контексте вопроса]

    **${cards[2].name}** (позиция: будущее/совет)
    [2-3 предложения о потенциальном развитии событий или совете на будущее]

    **Общий вывод:**
    [3-4 предложения: синтез всех трёх карт, целостное видение ситуации и главный совет]

    Ответ должен быть лаконичным (максимум 180 слов).
    Начинайте ответ сразу с толкования.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Оракул хранит молчание в этот момент. Обратитесь к значениям самих карт как к вашему проводнику.";
  } catch (error) {
    console.error("Gemini Interpretation Error:", error);
    return "Необходим момент тихой рефлексии. Звёзды скрыты, но карты остаются символами вашего пути.";
  }
};
