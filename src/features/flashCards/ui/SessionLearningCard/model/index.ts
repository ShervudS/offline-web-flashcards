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

const $intervalToShowRepeatCard = createStore(0);
const $learnedCards = createStore<TFlashCard[]>([]);

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

const $isLastCard = combine(
  { cardQueue: $cardQueue, repeatQueue: $repeatQueue },
  ({ cardQueue, repeatQueue }) =>
    isNotEmptyArray(cardQueue) && isNotEmptyArray(repeatQueue)
);

/**
 * При запуске сессии берем из стора карточек, карточки и сохраняем их в очередь на изучение
 * TODO: Необходимо будет добавить фильтры
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
  source: $intervalToShowRepeatCard,
  filter: $isRepeatCard.map((isRepeatCard) => !isRepeatCard),
  fn: (intervalToShowRepeatCard) => intervalToShowRepeatCard + 1,
  target: $intervalToShowRepeatCard,
});

/**
 * При ПРАВИЛЬНОМ ответе увеличиваем текущий индекс на 1, если только не карточка повторения, после ошибки
 */
sample({
  clock: [correctedAnswer, incorrectedAnswer],
  source: $currentLearningIdx,
  filter: $isRepeatCard.map((isRepeatCard) => !isRepeatCard),
  fn: (currentLearningIdx) => currentLearningIdx + 1,
  target: $currentLearningIdx,
});

/**
 * При НЕ правильном ответе.
 * Добавляем текущую карточку в очередь повторения и сбрасываем до начального значения, кол-во оставшихся повторений
 */
sample({
  clock: incorrectedAnswer,
  source: {
    repeatQueue: $repeatQueue,
    currentCard: $currentCard,
    isRepeatCard: $isRepeatCard,
  },
  filter: $currentCard.map((currentCard) => !currentCard),
  fn: ({ repeatQueue, currentCard }) => [
    ...repeatQueue,
    Object.assign(currentCard as TFlashCard, { repetition: REPEAT_CARD_COUNT }),
  ],
  target: $repeatQueue,
});

sample({
  clock: [correctedAnswer, incorrectedAnswer],
  source: {
    cardQueue: $cardQueue,
    currentLearningIdx: $currentLearningIdx,
    repeatQueue: $repeatQueue,
    intervalToShowRepeatCard: $intervalToShowRepeatCard,
  },
  filter: $isLastCard.map((isLastCard) => !isLastCard),
  fn: ({
    cardQueue,
    currentLearningIdx,
    repeatQueue,
    intervalToShowRepeatCard,
  }) => {
    if (
      repeatQueue.length > 0 &&
      intervalToShowRepeatCard === REPEAT_CARD_INTERVAL
    ) {
      return repeatQueue[0];
    }

    if (cardQueue.length === 0 && repeatQueue.length > 0) {
      return repeatQueue[0];
    }

    return cardQueue[currentLearningIdx];
  },
  target: $currentCard,
});

// sample({
//   clock: [correctedAnswer, incorrectedAnswer],
//   source: {
//     cardQueue: $cardQueue,
//     currentLearningIdx: $currentLearningIdx,
//     repeatQueue: $repeatQueue,
//     isRepeatCard: $isRepeatCard,
//     intervalToShowRepeatCard: $intervalToShowRepeatCard,
//   },
//   // fn: ({ intervalToShowRepeatCard, cardQueue, currentLearningIdx }) => {
//   //   // if (intervalToShowRepeatCard !cardQueue.length){}

//   //   cardQueue[currentLearningIdx];

//   //   return {
//   //     currentCard: cardQueue[currentLearningIdx],
//   //     isRepeatCard: false,
//   //     intervalToShowRepeatCard: intervalToShowRepeatCard - 1,
//   //   };
//   // },
//   target: {
//     currentCard: $currentCard,
//     isRepeatCard: $isRepeatCard,
//     intervalToShowRepeatCard: $intervalToShowRepeatCard,
//   },
// });

/**
 * При ПРАВИЛЬНОМ ответете
 * И если это карточка из очереди повторения проверям что это последнее повторение.
 * Добавляем текущую карточку в список изученных карточек
 */
sample({
  clock: correctedAnswer,
  source: {
    currentCard: $currentCard,
    learnedCards: $learnedCards,
    isRepeatCard: $isRepeatCard,
  },
  filter: ({ currentCard, isRepeatCard }) =>
    isRepeatCard ? currentCard?.repetition === 0 : true,
  fn: ({ currentCard, learnedCards }) => [
    ...learnedCards,
    currentCard as TFlashCard,
  ],
  target: $learnedCards,
});

/**
 * При обновленни текущей карточки, записываем это в модель карточки
 */
sample({
  clock: $currentCard,
  filter: $isLastCard.map((isLastCard) => !isLastCard),
  target: $card,
});
