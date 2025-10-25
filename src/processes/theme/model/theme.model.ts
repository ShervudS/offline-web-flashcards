import { createEffect, createEvent, createStore, sample } from "effector";

import { startedApp } from "_entities/app/model";

import { getFromLocalStorage, saveToLocalStorage } from "_utils/localStorage";

import { WINDOW_MATH_MEDIA } from "_configs/index";

import type { Nullable } from "_types/index";

const STORAGE_THEME_KEY = "theme";
const THEME_DATA_ATTR = "data-theme";
const THEME = {
  DARK: "dark",
  LIGHT: "light",
} as const;
export type TTheme = (typeof THEME)[keyof typeof THEME];

const getSavedThemeFx = createEffect(() => {
  const savedTheme = getFromLocalStorage<TTheme>(STORAGE_THEME_KEY);

  const systemPrefersDark = window.matchMedia(
    WINDOW_MATH_MEDIA.PREFERS_COLOR_SCHEME
  ).matches;

  return savedTheme || (systemPrefersDark ? THEME.DARK : THEME.LIGHT);
});
const saveSelectedThemeFx = createEffect<TTheme, void>((theme) => {
  saveToLocalStorage(STORAGE_THEME_KEY, theme);
});
const setDocumentAttrFx = createEffect<TTheme, void>((theme) => {
  document.documentElement.setAttribute(THEME_DATA_ATTR, theme);
});

export const toggedTheme = createEvent();

export const $theme = createStore<Nullable<TTheme>>(null)
  .on(getSavedThemeFx.doneData, (_, theme) => theme)
  .on(toggedTheme, (prev) => (prev === THEME.DARK ? THEME.LIGHT : THEME.DARK));

sample({
  clock: startedApp,
  target: getSavedThemeFx,
});

sample({
  source: $theme.updates,
  filter: Boolean,
  target: setDocumentAttrFx,
});

sample({
  clock: toggedTheme,
  source: $theme,
  filter: Boolean,
  target: saveSelectedThemeFx,
});
