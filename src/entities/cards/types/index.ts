export type TFlashCard = {
  /**
   * Уникальный идентификатор
   */
  id: string;
  question: string;
  answer: string;
  /**
   * Заметка для перевода
   */
  note?: string;
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
  /**
   * Пользовательские теги
   */
  tags: string[];
};

export type TCreateFlashCard = Pick<
  TFlashCard,
  "question" | "answer" | "note" | "tags"
>;
export type TUpdateFlashCard = TFlashCard;
export type TRemoveFlashCard = Pick<TFlashCard, "id">;

export type TGetAllSavedCardsFx = (db: IDBDatabase) => Promise<TFlashCard[]>;

export const CARD_HINT = {
  AMOUNT_LETTERS: "letters",
  FIRST_LETTER: "firstLetter",
  DEFAULT: null,
} as const;

export type TCardHint = (typeof CARD_HINT)[keyof typeof CARD_HINT];
