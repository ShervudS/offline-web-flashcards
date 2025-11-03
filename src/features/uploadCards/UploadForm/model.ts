import { combine, createEvent, createStore, sample } from "effector";

import { Nullable } from "_types/index";
import { isEmpty } from "_utils/strChecks";
import { $formatedUploadWords } from "../model";

export const ERROR_FIELD = {
  EMPTY: "empty",
  INVALID: "invalid",
} as const;

export type TErrorField = (typeof ERROR_FIELD)[keyof typeof ERROR_FIELD];

export const uploadChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const $upload = createStore("");
export const $uploadError = createStore<Nullable<TErrorField>>(null);

export const $formDisabled = createStore(false);
export const $error = createStore<Nullable<any>>(null);

$upload.on(uploadChanged, (_, upload) => upload);

export const $formValid = combine(
  $uploadError,
  (uploadError) => uploadError === null
);

sample({
  clock: formSubmitted,
  source: $upload,
  fn: (upload) => {
    if (isEmpty(upload)) return ERROR_FIELD.EMPTY;

    return null;
  },
  target: $uploadError,
});

sample({
  clock: formSubmitted,
  source: $upload,
  fn: (uploadText) => {
    console.log(uploadText.split(/[\|\.;\n]/));

    return uploadText
      .split(/[\|\.;\n]/)
      .filter(Boolean)
      .map((entry) => {
        // Важно: ищем длинное тире U+2013 или обычный дефис
        const match = entry.match(/^(.+?)\s*[–-]\s*(.+)$/);
        if (match) {
          return { word: match[1].trim(), translation: match[2].trim() };
        }
        return { word: entry.trim(), translation: "" };
      });
  },
  target: $formatedUploadWords,
});
