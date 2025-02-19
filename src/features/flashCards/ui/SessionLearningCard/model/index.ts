import { combine, createEvent, createStore, sample } from "effector";

import { $cards } from "_entities/cards/model";

import { isNotEmptyArray } from "_utils/arrayChecks";

import {
  CARD_HINT,
  type TCardHint,
  type TFlashCard,
} from "_entities/cards/types";
import type { Nullable } from "_types/index";

// const MSEC_FROM_SEC = 1000;

export const startedSession = createEvent();
export const retryedSession = createEvent();
export const correctedAnswer = createEvent();
export const uncorrectedAnswer = createEvent();
export const showedHintOfAmountLettres = createEvent();
export const showedHintOfFirstLetter = createEvent();

export const $isStartedSession = createStore(false);

export const $cardQueue = createStore<TFlashCard[]>([]);
export const $repeatQueue = createStore<TFlashCard[]>([]);
export const $currentCard = createStore<Nullable<TFlashCard>>(null);

export const $isRepeatCard = createStore(false);
export const $hintType = createStore<TCardHint>(CARD_HINT.DEFAULT);
export const $responseTime = createStore(0);

export const $currentLearningIdx = createStore(0);
export const $hasCardsToLearn = $cards.map((cards) => isNotEmptyArray(cards));
export const $amountCardToLearn = $cards.map((cards) => cards.length);
export const $isFinishSession = combine(
  {
    currentLearningIdx: $currentLearningIdx,
    amountCardToLearn: $amountCardToLearn,
  },
  ({ currentLearningIdx, amountCardToLearn }) =>
    amountCardToLearn === currentLearningIdx - 1
);

$isStartedSession.on(startedSession, () => true);
$hintType.on(showedHintOfAmountLettres, () => CARD_HINT.AMOUNT_LETTERS);
$hintType.on(showedHintOfFirstLetter, () => CARD_HINT.FIRST_LETTER);

$currentLearningIdx.reset(retryedSession);


/**
 * TODO: Необходимо вынести 4е стора флага
 * - карточек для изучения нет
 * - Блок начала сессии изучения
 * - Блок с сессией обучения
 * - Финишная статистика сессии
 */

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
 * При запуске или сбросе сессии, берем карточку из очереди, игнорируя очередь повторени
 */
sample({
  clock: [startedSession, retryedSession],
  source: $cardQueue,
  fn: (cardQueue) => cardQueue[0],
  target: $currentCard,
});

/**
 * При НЕ ПРАВИЛЬНОМ ответе
 * - Если эта карточка уже из очереди повторения, то сбрасываем кол-во повторений (до 0)
 * - Добавляем карточку в очередь повторения
 */
sample({
  clock: uncorrectedAnswer,
  source: {
    repeatQueue: $repeatQueue,
    currentCard: $currentCard,
    isRepeatCard: $isRepeatCard,
  },
  filter: ({ currentCard }) => Boolean(currentCard),
  fn: ({ repeatQueue, currentCard, isRepeatCard }) => {
    const newRepeatCard: TFlashCard = {
      ...(currentCard as TFlashCard),
      repetition: isRepeatCard ? 0 : currentCard!.repetition + 1,
    };

    return [...repeatQueue, newRepeatCard];
  },
  target: $repeatQueue,
});

/**
 * Обновляем индекс карточки, при ЛЮБОМ ответе, только если это не при ПОВТОРЕ карточки
 */
sample({
  clock: [correctedAnswer, uncorrectedAnswer],
  source: $currentLearningIdx,
  filter: $isRepeatCard.map((isRepeatCard) => !isRepeatCard),
  fn: (idx) => idx + 1,
  target: $currentLearningIdx,
});

/**
 * При правильном ответе
 * - TODO: Добавить проверку на повторение карточки из очереди
 */
sample({
  clock: correctedAnswer,
  source: { cardQueue: $cardQueue, currentIdx: $currentLearningIdx },
  filter: $isFinishSession,
  fn: ({ cardQueue, currentIdx }) => cardQueue[currentIdx],
  target: $currentCard,
});

/**
 * При вызове любого ответа, сбрасываем тип подсказки
 */
sample({
  clock: [correctedAnswer, uncorrectedAnswer],
  fn: () => CARD_HINT.DEFAULT,
  target: $hintType,
});

/**
 * Добавить новый коеффициент, который показывает, через какое кол-во ответов показывается карточка из очереди повтора
 * Добавить коеф на колличество повторений карточек из очереди повторений, сбрасывается при неправильном ответе
 *
 * Happy pass
 * - isStartedSession переводится в положение true
 * - из queue берется первая карточка
 * - response timer устанавливается Date now
 *
 * Обновление текущей карточки
 * - Проверяем коефф_очереди_повтора === 0
 * -    Проверяется есть ли в очереде повтора карточки
 * -        Берется карточка из очереди
 * -        isRepeatCard true
 * - Берем карточку из обычной очереди
 *
 * - Нажатие sussess
 * - responseTime устанавливается время Date now
 * - Проверяется что это карточка isRepeatCard
 * -    Да
 * -       Если счетчик колва повторений < коефф_повторения то
 * -          Да
 * -             +1 к кол-ву повторении
 * -             Добавляется в очередь повторений
 *            Нет
 * -            обновляется индекс
 * -    нет
 *          Рассчета коеээ_еффективности
 * -        обновляется индекс
 * - Обновляется текущая карточка
 * - response timer устанавливается Date now
 *
 * - Нажатие на wrongAnswer
 * - responseTime устанавливается время Date now
 * - Проверяется что это карточка isRepeatCard
 * -    Да
 * -       Если счетчик колва повторений < коефф_повторения то
 * -          Да
 * -             +1 к кол-ву повторении
 * -             Добавляется в очередь повторений
 *            Нет
 * -            обновляется индекс
 * -    нет
 * -        обновляется индекс
 * - Обновляется текущая карточка
 * - response timer устанавливается Date now
 *
 * * Если карточка взялась из очереди повтора
 * - необходимо обновить очередь на slice(1, -1)
 *   (удалить первый элемент, который мы взяли)
 */
