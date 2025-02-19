export type TFlashCard = {
  /**
   * Уникальный идентификатор
   */
  id: number;
  question: string;
  answer: string;
  /**
   * Дата создания
   */
  createDatetime: string;
  /**
   * Дата следующего повторения
   */
  nextReview?: number;
  /**
   * Интервал в днях
   */
  interval: number;
  /**
   * Easiness Factor
   */
  ef: number;
  /**
   * Количество повторений
   */
  repetition: number;
};

export type TCreateFlashCard = Pick<TFlashCard, "question" | "answer">;
export type TUpdateFlashCard = TFlashCard;
export type TRemoveFlashCard = Pick<TFlashCard, "id">;

export type TGetAllSavedCardsFx = (db: IDBDatabase) => Promise<TFlashCard[]>;

export const CARD_HINT = {
  AMOUNT_LETTERS: "letters",
  FIRST_LETTER: "firstLetter",
  DEFAULT: null,
} as const;

export type TCardHint = (typeof CARD_HINT)[keyof typeof CARD_HINT];
