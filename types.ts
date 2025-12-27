
export interface TarotCard {
  id: string;
  name: string;
  meaning: string;
  description: string;
}

export type AppState = 'input' | 'drawing' | 'reading' | 'interpretation';

export interface Reading {
  question: string;
  cards: TarotCard[];
  interpretation?: string;
}
