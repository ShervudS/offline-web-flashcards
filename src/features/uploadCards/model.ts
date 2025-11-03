import { createStore } from "effector";

export type TUploadWord = {
  word: string;
  translation: string;
};

export const $formatedUploadWords = createStore<TUploadWord[]>([]);
