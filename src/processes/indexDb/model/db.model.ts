import { attach, createEffect, createStore, sample } from "effector";

import { startedApp } from "_entities/app/model";

import { INDEX_DB_NAME, INDEX_DB_STORE, TIndexDbStore } from "../config";
import type { Nullable } from "_types/index";

const initIndexDbFx = createEffect<void, IDBDatabase>(
  async () =>
    new Promise((resolve, reject) => {
      const request = indexedDB.open(INDEX_DB_NAME.FLASH_CARDS, 2);

      request.onerror = (event) => {
        console.warn(`Error. Инициализации базы данных: ${event}`);
        reject(new Error("IndexedDB init failed"));
      };
      request.onsuccess = () => {
        console.warn("Success. Инициализация базы данных.");
        resolve(request.result);
      };
      request.onupgradeneeded = () => {
        const db = request.result;

        console.log('111 >>', 111);

        if (!db.objectStoreNames.contains(INDEX_DB_STORE.CARDS)) {
          db.createObjectStore(INDEX_DB_STORE.CARDS, {
            keyPath: "id",
            autoIncrement: true,
          });
        }

        if (!db.objectStoreNames.contains(INDEX_DB_STORE.TAGS)) {
          db.createObjectStore(INDEX_DB_STORE.TAGS, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };
    })
);

const getItemByIdBaseFx = createEffect<
  { db: IDBDatabase; storeName: TIndexDbStore; id: string },
  any | null
>(
  async ({ db, storeName, id }) =>
    new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], "readonly");
      const store = tx.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(new Error("Failed to read item"));
    })
);

const updateBaseFx = createEffect<
  { db: IDBDatabase; storeName: TIndexDbStore; item: any },
  any
>(
  async ({ db, storeName, item }) =>
    new Promise((resolve, reject) => {
      const txn = db.transaction(storeName, "readwrite");
      const store = txn.objectStore(storeName);

      const request = store.put(item);

      request.onsuccess = () => {
        if (import.meta.env.DEV) {
          console.log("Success. Карточка  успешно удалена. | ", item);
        }

        resolve(item);
      };
      request.onerror = (event) => {
        console.log(
          `Error. Удаления карточки | ${(event.target as IDBRequest).error}`
        );
        reject();
      };
    })
);

const saveItemBaseFx = createEffect<
  { db: IDBDatabase; storeName: TIndexDbStore; item: any },
  any
>(
  async ({ db, storeName, item }) =>
    new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], "readwrite");
      const store = tx.objectStore(storeName);
      const request = store.put(item);

      request.onsuccess = () => resolve(item);
      request.onerror = () => reject(new Error("Failed to save item"));
    })
);

const getAllBaseFx = createEffect<
  { db: IDBDatabase; storeName: TIndexDbStore },
  any[]
>(
  async ({ db, storeName }) =>
    new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], "readonly");
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error("Failed to get all items"));
    })
);

const deleteItemBaseFx = createEffect<
  { db: IDBDatabase; storeName: TIndexDbStore; id: string },
  string
>(
  async ({ db, storeName, id }) =>
    new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], "readwrite");
      const store = tx.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(new Error("Failed to delete item"));
    })
);

const $db = createStore<Nullable<IDBDatabase>>(null).on(
  initIndexDbFx.doneData,
  (_, db) => db
);

export const $isInitedDb = $db.map((db) => Boolean(db));

export const saveToDbFx = attach({
  source: $db,
  mapParams: ({ item, storeName }: any, db) => {
    if (!db) throw new Error("DB not initialized");
    return { db, storeName, item };
  },
  effect: saveItemBaseFx,
});

export const updateFx = attach({
  source: $db,
  mapParams: ({ item, storeName }: any, db) => {
    if (!db) throw new Error("DB not initialized");
    return { db, storeName, item };
  },
  effect: updateBaseFx,
});

export const getItemByIdFx = attach({
  source: $db,
  effect: getItemByIdBaseFx,
  mapParams: ({ id, storeName }: any, db) => {
    if (!db) throw new Error("DB not initialized");
    return { db, storeName, id };
  },
});

export const deleteFromDbFx = attach({
  source: $db,
  mapParams: ({ id, storeName }: any, db) => {
    if (!db) throw new Error("DB not initialized");
    return { db, storeName, id };
  },
  effect: deleteItemBaseFx,
});

export const getAllFx = attach({
  source: $db,
  effect: getAllBaseFx,
  mapParams: ({ storeName }, db) => {
    if (!db) throw new Error("DB not initialized");

    return { db, storeName };
  },
});

sample({
  clock: startedApp,
  target: initIndexDbFx,
});
