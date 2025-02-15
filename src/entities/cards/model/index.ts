import { createEffect, createStore } from "effector";

// import { IndexDB } from "_processes/indexDb";

import { Nullable } from "_types/index";
import { TFlashCard } from "../types";

// const getAllSavedCardsFx = createEffect(async () => {
//   const cardsDb = new IndexDB<TFlashCard>("flashCards", "cards");

//   return await cardsDb.getAll();
// });

export const createNewCardFx = createEffect((args: any) => {
  console.log("call createNewCardFx >>", args);
});

export const $DB = createStore(null);
export const $cards = createStore<Nullable<TFlashCard[]>>(null);
