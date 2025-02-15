import { attach, combine, createEvent, createStore, sample } from "effector";

import { createNewCardFx } from "_entities/cards/model";

import { buildBaseCardConfig } from "_features/flashCards/utils/updateCard";
import { isEmpty } from "_utils/strChecks";

import { Nullable } from "_types/index";

export const enum ERROR_FIELD {
  EMPTY = "empty",
  INVALID = "invalid",
}

/**
 * Создание локальной копии эффекта
 */
const createCardFx = attach({ effect: createNewCardFx });

export const questionChanged = createEvent<string>();
export const answerChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const $question = createStore("");
export const $questionError = createStore<Nullable<ERROR_FIELD>>(null);
export const $answer = createStore("");
export const $answerError = createStore<Nullable<ERROR_FIELD>>(null);

export const $formDisabled = createStore(false);
export const $error = createStore<Nullable<any>>(null);

export const $formValid = combine(
  $questionError,
  $answerError,
  (questionError, answerError) => questionError === null && answerError === null
);

$question.on(questionChanged, (_, question) => question);
$answer.on(answerChanged, (_, answer) => answer);

sample({
  clock: formSubmitted,
  source: $question,
  fn: (question) => {
    if (isEmpty(question)) return ERROR_FIELD.EMPTY;

    return null;
  },
  target: $questionError,
});

sample({
  clock: formSubmitted,
  source: $answer,
  fn: (answer) => {
    if (isEmpty(answer)) return ERROR_FIELD.EMPTY;

    return null;
  },
  target: $answerError,
});

sample({
  clock: formSubmitted,
  source: { question: $question, answer: $answer },
  filter: createCardFx.pending.map((pending) => !pending),
  fn: buildBaseCardConfig,
  target: createCardFx,
});

$error.on(createCardFx.failData, (_, error) => error);
