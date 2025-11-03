import { createEffect, createEvent, createStore, sample } from "effector";

import {
  $isInitedDb,
  deleteFromDbFx,
  getAllFx,
  saveToDbFx,
  updateFx,
} from "_processes/indexDb/model/db.model";

import { buildDefaultTags } from "../utils/createDefaultTags";
import { isNotEmptyArray } from "_utils/arrayChecks";

import { INDEX_DB_STORE } from "_processes/indexDb/config";
import type { TTag } from "../types";

const createDefaultTagsFx = createEffect(async () => {
  const defaultTags = buildDefaultTags();

  await Promise.all(
    defaultTags.map((tag) =>
      saveToDbFx({ item: tag, storeName: INDEX_DB_STORE.TAGS })
    )
  );

  return defaultTags;
});

const getAllSavedTagsFx = createEffect(() =>
  getAllFx({ storeName: INDEX_DB_STORE.TAGS })
);

export const saveTagFx = createEffect((tag: TTag) =>
  saveToDbFx({ item: tag, storeName: INDEX_DB_STORE.TAGS })
);

const updateTagFx = createEffect((tag: TTag) =>
  updateFx({ item: tag, storeName: INDEX_DB_STORE.TAGS })
);

const removeTagFx = createEffect((id: TTag["id"]) =>
  deleteFromDbFx({ id, storeName: INDEX_DB_STORE.TAGS })
);

export const updatedTag = createEvent<TTag>();
export const removedTag = createEvent<TTag["id"]>();

export const $tagsCollection = createStore<TTag[]>([]);

$tagsCollection.on(getAllSavedTagsFx.doneData, (_, tags) => tags);
$tagsCollection.on(createDefaultTagsFx.doneData, (_, tags) => tags);

$tagsCollection.on(saveTagFx.doneData, (tags, tag) => [tag, ...tags]);

$tagsCollection.on(removeTagFx.doneData, (tags, result) =>
  tags?.filter((tag) => tag.id !== result)
);

$tagsCollection.on(updateTagFx.done, (tags, { result }) =>
  tags.map((tag) => {
    if (tag.id === result.id) {
      return result;
    }
    return tag;
  })
);

sample({
  clock: $isInitedDb,
  target: getAllSavedTagsFx,
});

sample({
  clock: getAllSavedTagsFx.doneData,
  filter: isNotEmptyArray,
  target: createDefaultTagsFx,
});

sample({
  clock: updatedTag,
  target: updateTagFx,
});

sample({
  clock: removedTag,
  target: removeTagFx,
});
