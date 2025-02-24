import { createEvent, createStore, sample } from "effector";

import {
  CARD_HINT,
  type TCardHint,
  type TFlashCard,
} from "_entities/cards/types";
import type { Nullable } from "_types/index";

export const displayedCard = createEvent();
export const showedHintOfAmountLettres = createEvent();
export const showedHintOfFirstLetter = createEvent();
export const answeredCard = createEvent();

export const $card = createStore<Nullable<TFlashCard>>(null);
export const $hintType = createStore<TCardHint>(CARD_HINT.DEFAULT);
export const $showTime = createStore(0);
export const $responseTime = createStore(0);


$hintType.on(showedHintOfAmountLettres, () => CARD_HINT.AMOUNT_LETTERS);
$hintType.on(showedHintOfFirstLetter, () => CARD_HINT.FIRST_LETTER);

$showTime.on($card, () => Date.now());
$responseTime.on(answeredCard, () => Date.now());

$hintType.reset($card);

export const $isVisibleBtnOnShowAmounLetters = $hintType.map(
  (hintType) => hintType === CARD_HINT.DEFAULT
);

export const $isVisibleAmountLetters = $hintType.map(
  (hintType) => hintType === CARD_HINT.AMOUNT_LETTERS
);

export const $isVisibleFirstLetter = $hintType.map(
  (hintType) => hintType === CARD_HINT.FIRST_LETTER
);
