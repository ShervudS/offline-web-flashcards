import { TFlashCard } from "../types";

const MAX_TIME_TO_CORRECT = 10;
const MILLSEC_IN_DAY = 24 * 60 * 60 * 1000;

type TUpdateCardLearningStatus = {
  card: TFlashCard;
  responseTime: number;
  isCorrect: boolean;
};
/**
 * ref: https://en.wikipedia.org/wiki/SuperMemo#Algorithms
 */
export const updateCardLearningStatus = ({
  card,
  responseTime,
  isCorrect,
}: TUpdateCardLearningStatus) => {
  // Рассчитываем качество ответа
  const recallQuality = isCorrect
    ? Math.max(0, 5 - (responseTime / MAX_TIME_TO_CORRECT) * 5)
    : 1; // Если ответ неверный, качество = 1

  // Обновляем Easiness Factor
  const newEf = Math.max(
    1.3,
    card.ef + (0.1 - (5 - recallQuality) * (0.08 + (5 - recallQuality) * 0.02))
  );

  if (recallQuality >= 3) {
    // Увеличиваем интервал повторения
    if (card.repetition === 0) {
      card.interval = 1;
    } else if (card.repetition === 1) {
      card.interval = 6;
    } else {
      card.interval = Math.round(card.interval * card.ef);
    }
    card.repetition++;
  } else {
    // Если качество низкое, сбрасываем карточку
    card.repetition = 0;
    card.interval = 1;
  }

  // Обновляем дату следующего повторения
  card.nextReview = Date.now() + card.interval * MILLSEC_IN_DAY;
  card.ef = newEf;

  return card;
};

type TGetBaseCardCnfig = (
  newCardData: Pick<TFlashCard, "answer" | "question">
) => TFlashCard;

export const getBaseCardCnfig: TGetBaseCardCnfig = ({ answer, question }) => {
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
