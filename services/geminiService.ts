
import { GoogleGenAI } from "@google/genai";
import { TarotCard } from "../types";

const ai = new GoogleGenerativeAI({ apikey: "AIzaSyAAO3XmnSm2zRr0h4lXx_Q5dnxYrc3vHx4" });

export const getTarotInterpretation = async (question: string, cards: TarotCard[]): Promise<string> => {
  const cardList = cards.map(c => `${c.name} (${c.meaning})`).join(", ");
  const prompt = `
    Роль: Старший опытный таролог с глубоким пониманием архетипов.
    Язык: Русский.
    Тон: Спокойный, мудрый, авторитетный, вдумчивый.
    Вопрос пользователя: "${question}"
    Выпавшие карты: ${cardList}

    Задача: Предоставьте комбинированное толкование этих трех карт применительно к конкретному вопросу пользователя.
    Сфокусируйтесь на рефлексии и внутреннем руководстве. Не делайте драматических предсказаний и не выдавайте вымышленные утверждения за факты.
    Ответ должен быть лаконичным (максимум 180 слов).
    Начинайте ответ сразу с толкования.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Оракул хранит молчание в этот момент. Обратитесь к значениям самих карт как к вашему проводнику.";
  } catch (error) {
    console.error("Gemini Interpretation Error:", error);
    return "Необходим момент тихой рефлексии. Звезды скрыты, но карты остаются символами вашего пути.";
  }
};
