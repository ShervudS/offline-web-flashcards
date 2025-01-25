import type { TCreateFlashCard, TFlashCard } from "_entities/cards/types";

/**
 * Минимальное значение Easiness Factor
 */
const MIN_EF = 1.3;

/**
 * Базовый прирост EF при правильном ответе
 */
const BASE_EF_INCREMENT = 0.2;

/**
 * Множитель для штрафа за низкий recallQuality
 */
const QUALITY_PENALTY_MULTIPLIER = 0.05;

/**
 * Дополнительный множитель штрафа для более сильного эффекта
 */
const QUALITY_PENALTY_EXPONENT = 0.01;

/**
 *  Максимальное время для правильного ответа (в секундах)
 */
const MAX_TIME_TO_CORRECT = 10;

/**
 * Количество миллисекунд в одном дне
 */
const MILLSEC_IN_DAY = 24 * 60 * 60 * 1000;

/**
 * Максимальное значение качества ответа
 */
const MAX_RECALL_QUALITY = 5;

/**
 * Штрафы за использование подсказок
 *
 * - none - Без подсказки: без штрафа.
 * - firstLetter - Подсказка с первой буквой: уменьшение на 15%;
 * - letters - Подсказка с количеством букв: уменьшение на 30%;
 */
const hintPenalties = {
  none: 1,
  letters: 0.8,
  firstLetter: 0.9,
};

type TUpdateCardLearningStatus = {
  card: TFlashCard;
  responseTime: number;
  isCorrect: boolean;
  hintType: "letters" | "firstLetter" | "none";
  /**
   * Flag if word from repeat stack
   */
  isRepeatCard: boolean;
};
/**
 * ref: https://en.wikipedia.org/wiki/SuperMemo#Algorithms
 */
export const updateCardLearningStatus = ({
  card,
  responseTime,
  isCorrect,
  hintType = "none",
  isRepeatCard,
}: TUpdateCardLearningStatus) => {
  const hintPenalty = hintPenalties[hintType];

  /**
   * Рассчитывает качество ответа пользователя.
   *
   * Формула:
   * recallQuality =
   *  isCorrect === true
   *    ? max(0, (MAX_RECALL_QUALITY - (responseTime / MAX_TIME_TO_CORRECT) * MAX_RECALL_QUALITY) * HINT_PENALTY)
   *    : 1 * HINT_PENALTY
   *
   * Где:
   * - MAX_RECALL_QUALITY: Максимальная оценка качества (по умолчанию 5).
   * - responseTime: Время ответа пользователя (в секундах).
   * - MAX_TIME_TO_CORRECT: Максимальное время для корректного ответа (по умолчанию 10 секунд).
   * - HINT_PENALTY: Штраф за использование подсказки (например, 0.8 — уменьшение на 20%).
   *
   * Пример:
   * - При responseTime = 5, MAX_TIME_TO_CORRECT = 10, HINT_PENALTY = 1:
   *   recallQuality = 5 - (5 / 10) * 5 = 3.75.
   */
  const recallQuality = isCorrect
    ? Math.max(
        0,
        (MAX_RECALL_QUALITY -
          (responseTime / MAX_TIME_TO_CORRECT) * MAX_RECALL_QUALITY) *
          hintPenalty
      )
    : 1 * hintPenalty;

  /**
   * Рассчитывает новый Easiness Factor (EF), если это первый раз или первый правильный ответ в режиме повторения.
   *
   * Формула:
   * newEf = max(
   *   MIN_EF,
   *   card.ef + (
   *     BASE_EF_INCREMENT -
   *     (MAX_RECALL_QUALITY - recallQuality) * (
   *       QUALITY_PENALTY_MULTIPLIER +
   *       (MAX_RECALL_QUALITY - recallQuality) * QUALITY_PENALTY_EXPONENT
   *     )
   *   )
   * )
   *
   * Где:
   * - MIN_EF: Минимальное значение Easiness Factor (по умолчанию 1.3).
   * - BASE_EF_INCREMENT: Базовый прирост EF при правильном ответе (по умолчанию 0.2).
   * - MAX_RECALL_QUALITY: Максимальная оценка качества (по умолчанию 5).
   * - QUALITY_PENALTY_MULTIPLIER: Множитель штрафа за разницу в recallQuality (по умолчанию 0.05).
   * - QUALITY_PENALTY_EXPONENT: Дополнительный штрафной множитель (по умолчанию 0.01).
   *
   * Пример:
   * - При card.ef = 2.5, recallQuality = 3.75:
   *   newEf = max(1.3, 2.5 + (0.2 - (5 - 3.75) * (0.05 + (5 - 3.75) * 0.01))).
   */
  if (!isRepeatCard || (isRepeatCard && isCorrect && card.repetition === 0)) {
    card.ef = Math.max(
      MIN_EF,
      card.ef +
        (BASE_EF_INCREMENT -
          (MAX_RECALL_QUALITY - recallQuality) *
            (QUALITY_PENALTY_MULTIPLIER +
              (MAX_RECALL_QUALITY - recallQuality) * QUALITY_PENALTY_EXPONENT))
    );
  }
  

  if (recallQuality >= 3) {
    if (!isRepeatCard) {
      if (card.repetition === 0) {
        card.interval = 1; // Первый интервал
      } else if (card.repetition === 1) {
        card.interval = 6; // Второй интервал
      } else {
        card.interval = Math.round(card.interval * card.ef); // Дальнейшие интервалы
      }
      card.repetition++;
    }
  } else {
    // Если низкое качество ответа, сбрасываем карточку
    card.repetition = 0;
    card.interval = 1;
  }

  // Обновляем дату следующего повторения
  card.nextReview = Date.now() + card.interval * MILLSEC_IN_DAY;

  return card;
};

type TBuildBaseCardCnfig = (newCardData: TCreateFlashCard) => TFlashCard;

export const buildBaseCardConfig: TBuildBaseCardCnfig = ({
  answer,
  question,
}) => {
  const curDateTime = Date.now();

  return {
    answer,
    question,
    id: curDateTime,
    createDatetime: new Date().toISOString(),
    repetition: 0,
    ef: 2.5,
    interval: 1,
    nextReview: curDateTime,
  };
};
