import type { TCreateFlashCard, TFlashCard } from "_entities/cards/types";

// Максимальное время для правильного ответа (в секундах)
const MAX_TIME_TO_CORRECT = 10;
// Количество миллисекунд в дне
const MILLSEC_IN_DAY = 24 * 60 * 60 * 1000;
// Штрафы за использование подсказок
const hintPenalties = {
  letters: 0.7, // Подсказка с количеством букв: уменьшение на 30%
  firstLetter: 0.85, // Подсказка с первой буквой: уменьшение на 15%
  none: 1, // Без подсказки: без штрафа
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
  // Определяем штраф на основе типа подсказки
  const hintPenalty = hintPenalties[hintType];

  // Рассчитываем качество ответа
  const recallQuality = isCorrect
    ? Math.max(0, (5 - (responseTime / MAX_TIME_TO_CORRECT) * 5) * hintPenalty)
    : 1 * hintPenalty; // Если ответ неверный, применяем штраф за подсказку

  // Обновляем Easiness Factor только если это первый раз или первый правильный ответ в режиме повторения
  if (!isRepeatCard || (isRepeatCard && isCorrect && card.repetition === 0)) {
    card.ef = Math.max(
      1.3,
      card.ef +
        (0.1 - (5 - recallQuality) * (0.08 + (5 - recallQuality) * 0.02))
    );
  }

  if (recallQuality >= 3) {
    // Увеличиваем интервал повторения
    if (card.repetition === 0) {
      card.interval = 1; // Первый интервал
    } else if (card.repetition === 1) {
      card.interval = 6; // Второй интервал
    } else {
      card.interval = Math.round(card.interval * card.ef); // Дальнейшие интервалы
    }
    card.repetition++;
  } else {
    // Если качество низкое, сбрасываем карточку
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
