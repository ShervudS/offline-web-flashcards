import { createEffect, createEvent, createStore, sample } from "effector";

import {
  $isInitedDb,
  deleteFromDbFx,
  getAllFx,
  saveToDbFx,
  updateFx,
} from "_processes/indexDb/model/db.model";

import { INDEX_DB_STORE } from "_processes/indexDb/config";

import type { TFlashCard } from "../types";

const getAllSavedCardsFx = createEffect(() =>
  getAllFx({ storeName: INDEX_DB_STORE.CARDS })
);

export const saveCardFx = createEffect((card: TFlashCard) =>
  saveToDbFx({ item: card, storeName: INDEX_DB_STORE.CARDS })
);

const updateCardFx = createEffect((card: TFlashCard) =>
  updateFx({ item: card, storeName: INDEX_DB_STORE.CARDS })
);

const removeCardFx = createEffect((id: TFlashCard["id"]) =>
  deleteFromDbFx({ id, storeName: INDEX_DB_STORE.CARDS })
);

export const updatedCard = createEvent<TFlashCard>();
export const removedCard = createEvent<TFlashCard["id"]>();

export const $cards = createStore<TFlashCard[]>([]);

$cards.on(getAllSavedCardsFx.doneData, (_, cards) => cards);

$cards.on(saveCardFx.doneData, (cards, card) => [card, ...cards]);

$cards.on(removeCardFx.doneData, (cards, result) =>
  cards?.filter((card) => card.id !== result)
);

$cards.on(updateCardFx.done, (cards, { result }) =>
  cards.map((card) => {
    if (card.id === result.id) {
      return result;
    }
    return card;
  })
);

/**
 * Логика получения карточек после инициализации DB
 */
sample({
  clock: $isInitedDb,
  target: getAllSavedCardsFx,
});

sample({
  clock: updatedCard,
  target: updateCardFx,
});

sample({
  clock: removedCard,
  target: removeCardFx,
});
