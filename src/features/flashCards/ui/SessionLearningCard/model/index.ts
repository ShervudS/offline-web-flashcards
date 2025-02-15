import { createEvent, createStore } from "effector";

import { TFlashCard } from "_entities/cards/types";

import { Nullable } from "_types/index";

export const startedSession = createEvent();

export const $isStartedSession = createStore(false);
export const $isRepeatCard = createStore(false);

export const $cardQueue = createStore<TFlashCard[]>([]);
export const $repeatQueue = createStore<TFlashCard[]>([]);
export const $currentCard = createStore<Nullable<TFlashCard>>(null);

export const $currentLearningIdx = createStore(0);
export const $amountCardToLearn = createStore(0);

// import { createEvent, createStore, sample } from "effector";
// import { updateCardLearningStatus } from "../utils/updateCard";

// import type { TFlashCard } from "_entities/cards/types";
// import type { Nullable } from "_types/index";

// // Создаем события
// export const updateCardQueue = createEvent<TFlashCard[]>();
// export const updateRepeatQueue = createEvent<TFlashCard[]>();
// export const updateCurrentCard = createEvent<Nullable<TFlashCard>>();
// export const setIsStartedSession = createEvent<boolean>();
// export const setIsRepeatCard = createEvent<boolean>();
// export const setCurrentLearningIndex = createEvent<number>();
// export const handleResponse = createEvent<{
//   responseTime: number;
//   isCorrect: boolean;
//   hintType: "letters" | "firstLetter" | "none";
// }>();

// // Создаем хранилища
// export const $cardQueue = createStore<TFlashCard[]>([]).on(
//   updateCardQueue,
//   (_, queue) => queue
// );

// export const $repeatQueue = createStore<TFlashCard[]>([]).on(
//   updateRepeatQueue,
//   (_, queue) => queue
// );

// export const $currentCard = createStore<Nullable<TFlashCard>>(null).on(
//   updateCurrentCard,
//   (_, card) => card
// );

// export const $isStartedSession = createStore(false).on(
//   setIsStartedSession,
//   (_, started) => started
// );

// export const $isRepeatCard = createStore(false).on(
//   setIsRepeatCard,
//   (_, isRepeat) => isRepeat
// );

// export const $currentLearningIndex = createStore(0).on(
//   setCurrentLearningIndex,
//   (_, index) => index
// );

// // Состояния для управления количеством карт для обучения
// export const $amountCardToLearn = createStore(0);

// // Логика для обновления текущей карточки
// const updateCurrentCardLogic = sample({
//   source: [$cardQueue, $repeatQueue],
//   clock: [$cardQueue, $repeatQueue],
//   fn: ([cardQueue, repeatQueue]) => {
//     if (cardQueue.length === 0 && repeatQueue.length === 0) {
//       return null;
//     }

//     let nextCard: Nullable<TFlashCard> = null;
//     let updatedRepeatQueue = [...repeatQueue];
//     let updatedCardQueue = [...cardQueue];
//     let isRepeatCard = false;

//     if (repeatQueue.length > 0 && cardQueue.length % 3 === 0) {
//       nextCard = repeatQueue[0];
//       updatedRepeatQueue = repeatQueue.slice(1);
//       isRepeatCard = true;
//     } else {
//       nextCard = cardQueue[0];
//       updatedCardQueue = cardQueue.slice(1);
//       isRepeatCard = false;
//     }

//     // Обновляем состояния
//     updateRepeatQueue(updatedRepeatQueue);
//     updateCardQueue(updatedCardQueue);
//     setIsRepeatCard(isRepeatCard);
//     updateCurrentCard(nextCard);

//     return nextCard;
//   },
// });

// // Обработчик ответов
// sample({
//   source: [$currentCard, $isRepeatCard, $currentLearningIndex],
//   clock: handleResponse,
//   fn: (
//     [currentCard, isRepeatCard, currentLearningIndex],
//     { responseTime, isCorrect, hintType }
//   ) => {
//     if (!currentCard) return;

//     let updatedRepeatQueue = $repeatQueue.getState();
//     let recallQuality = isCorrect
//       ? Math.max(0, (5 - responseTime / 10) * 5)
//       : 1;

//     if (isCorrect) {
//       // Обновляем карточку
//       console.log(
//         "updateCardLearningStatus >>",
//         updateCardLearningStatus({
//           card: currentCard,
//           responseTime,
//           isCorrect,
//           hintType,
//           isRepeatCard,
//         })
//       );
//     } else {
//       updatedRepeatQueue = [...updatedRepeatQueue, currentCard];
//       updateRepeatQueue(updatedRepeatQueue);
//     }

//     setCurrentLearningIndex(currentLearningIndex + 1);
//     updateCurrentCardLogic(); // Обновляем текущую карточку
//   },
// });

// // Логика для старта сессии
// export const onStartSession = () => {
//   setIsStartedSession(true);
//   updateCurrentCardLogic();
// };

// // Логика для повторного начала сессии
// export const onRetrySession = () => {
//   setCurrentLearningIndex(0);
//   updateCurrentCardLogic();
// };
