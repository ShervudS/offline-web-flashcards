import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";

import { INDEX_DB_NAME, INDEX_DB_STORE } from "_configs/index";

import { Nullable } from "_types/index";
import { TFlashCard } from "../types";
import { $isAppInit } from "_entities/app/model";

const openDbFx = createEffect((): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open(
      INDEX_DB_NAME.FLASH_CARDS,
      1
    );

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(INDEX_DB_STORE.CARDS)) {
        db.createObjectStore(INDEX_DB_STORE.CARDS, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => {
      console.warn("Success. Инициализация базы данных.");
      resolve(request.result);
    };
    request.onerror = (event) => {
      console.warn(`Error. Инициализации базы данных: ${event}`);

      reject(request.error);
    };
  });
});

const getAllSavedCardsFx = createEffect(
  async (db: IDBDatabase): Promise<TFlashCard[]> =>
    new Promise((resolve, reject) => {
      const tx = db.transaction(INDEX_DB_STORE.CARDS, "readonly");
      const store = tx.objectStore(INDEX_DB_STORE.CARDS);
      const request = store.getAll();

      request.onsuccess = (event) => {
        console.warn("Успешно. Карточки получены");
        resolve((event.target as IDBRequest).result as TFlashCard[]);
      };

      request.onerror = () => {
        console.warn("Ошибка. Получение карточек |", request.error);
        reject(request.error);
      };
    })
);

const saveCardFx = createEffect(
  ({
    db,
    card,
  }: {
    db: IDBDatabase;
    card: TFlashCard;
  }): Promise<TFlashCard> => {
    return new Promise((resolve, reject) => {
      const txn = db.transaction(INDEX_DB_STORE.CARDS, "readwrite");
      const store = txn.objectStore(INDEX_DB_STORE.CARDS);

      const request = store.add(card);

      request.onsuccess = () => {
        console.log("Success. Карточка успешно добавлена. | ", card);
        resolve(card);
      };
      request.onerror = (event) => {
        console.log(
          `Error. Карточка не добавлена | ${(event.target as IDBRequest).error}`
        );
        reject();
      };
    });
  }
);

const removeCardFx = createEffect(
  ({ db, id }: { db: IDBDatabase; id: TFlashCard["id"] }): Promise<number> => {
    return new Promise((resolve, reject) => {
      const txn = db.transaction(INDEX_DB_STORE.CARDS, "readwrite");
      const store = txn.objectStore(INDEX_DB_STORE.CARDS);

      const request = store.delete(id);

      request.onsuccess = () => {
        console.log("Success. Карточка  успешно удалена. | ", id);
        resolve(id);
      };
      request.onerror = (event) => {
        console.log(
          `Error. Удаления карточки | ${(event.target as IDBRequest).error}`
        );
        reject();
      };
    });
  }
);

const updateCardFx = createEffect(
  ({
    db,
    card,
  }: {
    db: IDBDatabase;
    card: TFlashCard;
  }): Promise<TFlashCard> => {
    return new Promise((resolve, reject) => {
      const txn = db.transaction(INDEX_DB_STORE.CARDS, "readwrite");
      const store = txn.objectStore(INDEX_DB_STORE.CARDS);

      const request = store.put(card);

      request.onsuccess = () => {
        console.log("Success. Карточка  успешно удалена. | ", card);
        resolve(card);
      };
      request.onerror = (event) => {
        console.log(
          `Error. Удаления карточки | ${(event.target as IDBRequest).error}`
        );
        reject();
      };
    });
  }
);

export const initedDd = createEvent();
export const removedCard = createEvent<TFlashCard["id"]>();

export const $indexDb = createStore<Nullable<IDBDatabase>>(null);
const isInitDb = $indexDb.map((db) => Boolean(db));

export const $cards = createStore<TFlashCard[]>([]);

$indexDb.on(openDbFx.doneData, (_, db) => db);

/**
 * При успешном получении карточек из IndexDB, добавляем карточки в $store
 */
$cards.on(getAllSavedCardsFx.doneData, (_, cards) => cards);

/**
 * При успешном добавлении карточки, добавляем карточку в $store
 */
$cards.on(saveCardFx.doneData, (cards, card) => [...cards, card]);

/**
 * При успешном удалении карточки, удаляем карточку из $store
 */
$cards.on(removeCardFx.doneData, (cards, result) =>
  cards?.filter((card) => card.id !== result)
);

/**
 * При успешном обновлении карточки, обновляем карточку в $store
 */
$cards.on(updateCardFx.done, (cards, { result }) =>
  cards.map((card) => {
    if (card.id === result.id) {
      return result;
    }
    return card;
  })
);

/**
 * Логика инициализации DB
 */
sample({
  clock: $isAppInit,
  target: openDbFx,
});

/**
 * Логика получения карточек после инициализации DB
 */
sample({
  clock: isInitDb,
  source: $indexDb,
  filter: (db) => db !== null,
  target: getAllSavedCardsFx,
});

/**
 * Создание карточки
 * Создакоем копию saveCardFx, чтобы при выхове инстанс IndexDb брался из стора и его не нужно было пробрасывать отдельно
 */
export const saveDataCardFx = attach({
  source: $indexDb,
  effect: saveCardFx,
  mapParams: (card: TFlashCard, db) => {
    if (!db) {
      throw new Error("DB is not initialized");
    }
    return { db, card };
  },
});

/**
 * Удаление карточки
 * Создакоем копию removeCardFx, чтобы при вызове, инстанс IndexDb брался из стора и его не нужно было пробрасывать отдельно
 */
export const removeCardDataFx = attach({
  source: $indexDb,
  effect: removeCardFx,
  mapParams: (id: TFlashCard["id"], db) => {
    if (!db) {
      throw new Error("DB is not initialized");
    }
    return { db, id };
  },
});

sample({
  clock: removedCard,
  target: removeCardDataFx,
});

/**
 * Обновление карточки
 */
export const updateCardDataFx = attach({
  source: $indexDb,
  effect: updateCardFx,
  mapParams: (card: TFlashCard, db) => {
    if (!db) {
      throw new Error("DB is not initialized");
    }
    return { db, card };
  },
});
