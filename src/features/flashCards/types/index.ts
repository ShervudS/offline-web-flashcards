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

export type TCreateFlashCard = Omit<TFlashCard, "id">;
export type TUpdateFlashCard = TFlashCard;
