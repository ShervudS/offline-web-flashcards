import { combine, createEvent, createStore, sample } from "effector";

import { $cards } from "_entities/cards/model";

import { isNotEmptyArray } from "_utils/arrayChecks";

import { type TFlashCard } from "_entities/cards/types";
import type { Nullable } from "_types/index";
import { $card } from "../components/FlashCard/model";

/**
 * Интервал для показа карточки из очереди повторения
 */
const REPEAT_CARD_INTERVAL = 3;
/**
 * Кол-во раз для повторения карточки из очереди повторения
 */
const REPEAT_CARD_COUNT = 3;

// const MSEC_FROM_SEC = 1000;
//   const responseTimeSec = Math.floor(
//     (Date.now() - startTimeRef.current) / MSEC_FROM_SEC
//   );

export const startedSession = createEvent();
export const retryedSession = createEvent();
export const correctedAnswer = createEvent();
export const incorrectedAnswer = createEvent();

export const $isStartedSession = createStore(false);
$isStartedSession.on(startedSession, () => true);

export const $cardQueue = createStore<TFlashCard[]>([]);
export const $repeatQueue = createStore<TFlashCard[]>([]);
export const $currentCard = createStore<Nullable<TFlashCard>>(null);

export const $isRepeatCard = createStore(false);

export const $currentLearningIdx = createStore(0);
$currentLearningIdx.reset(retryedSession);

export const $amountCardToLearn = $cards.map((cards) => cards.length);

const $amountShowCardsFromQueue = createStore(0);

/**
 * Проверка на существование очереди карточек для изучения
 */
export const $hasCardsToLearn = $cards.map((cards) => isNotEmptyArray(cards));

const $isFinishSession = combine(
  {
    currentLearningIdx: $currentLearningIdx,
    amountCardToLearn: $amountCardToLearn,
  },
  ({ currentLearningIdx, amountCardToLearn }) =>
    amountCardToLearn === currentLearningIdx
);

/**
 * Отображение блока с запуском сессии изучения карточек
 */
export const $isStudyAvailable = combine(
  { isStartedSession: $isStartedSession, isFinishSession: $isFinishSession },
  ({ isStartedSession, isFinishSession }) =>
    !isStartedSession && !isFinishSession
);

/**
 * Отображение блока изучения
 * Current card + Progress Bar
 */
export const $isVisibleStudySession = combine(
  {
    isStartedSession: $isStartedSession,
    isFinishSession: $isFinishSession,
    currentCard: $currentCard,
  },
  ({ isStartedSession, isFinishSession, currentCard }) =>
    isStartedSession && !isFinishSession && currentCard
);

/**
 * Отображение итоговой статистики сессии
 */
export const $studyResultsVisible = combine(
  { isStartedSession: $isStartedSession, isFinishSession: $isFinishSession },
  ({ isStartedSession, isFinishSession }) => isStartedSession && isFinishSession
);

/**
 * При запуске сессии берем из стора карточек, карточки и сохраняем их в очередь на изучение
 * ps. Необходимо будет добавить фильтры
 */
sample({
  clock: startedSession,
  source: $cards,
  target: $cardQueue,
});

/**
 * При запуске или сбросе сессии, берем карточку из очереди изучения, игнорируя очередь повторени
 */
sample({
  clock: [startedSession, retryedSession],
  source: $cardQueue,
  fn: (cardQueue) => cardQueue[0],
  target: $currentCard,
});

/**
 * При каждом ответе, если это карточка из основной очереди, увеличиваем счетчик показа из обычной очереди
 */
sample({
  clock: [startedSession, retryedSession],
  source: $amountShowCardsFromQueue,
  filter: $isRepeatCard.map((isRepeatCard) => !isRepeatCard),
  fn: (amountShowCardsFromQueue) => amountShowCardsFromQueue + 1,
  target: $amountShowCardsFromQueue,
});

/**
 * При ЛЮБОМ ответе увеличиваем текущий индекс на 1, если только не карточка повторения, после ошибки
 */
sample({
  clock: [correctedAnswer, incorrectedAnswer],
  source: $currentLearningIdx,
  filter: $isRepeatCard.map((isRepeatCard) => !isRepeatCard),
  fn: (currentLearningIdx) => currentLearningIdx + 1,
  target: $currentLearningIdx,
});

/**
 * При ЛЮБОМ ответе обновляем текущую карточку из очереди изучения
 */
sample({
  clock: [correctedAnswer, incorrectedAnswer],
  source: { cardQueue: $cardQueue, currentLearningIdx: $currentLearningIdx },
  fn: ({ cardQueue, currentLearningIdx }) => {
    return cardQueue[currentLearningIdx];
  },
  target: $currentCard,
});

sample({
  clock: $currentCard,
  target: $card,
});
