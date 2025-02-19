import { createEvent, createStore } from "effector";

export const startedApp = createEvent();

export const $isAppInit = createStore(false);

$isAppInit.on(startedApp, () => true);
