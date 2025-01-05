import { TFlashCard, TUpdateFlashCard } from "../types";

export class CardsIndexedDB {
  private dbName: string;
  private storeName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, storeName: string, version: number = 1) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
  }

  private async ensureDBInitialized(): Promise<void> {
    if (this.db) return;

    await this.init();
  }

  /**
   * Инициализация базы данных
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        if (!this.db.objectStoreNames.contains(this.storeName)) {
          this.db.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log("Инициализация базы данных. Успешна");
        resolve();
      };

      request.onerror = (event) => {
        reject(
          `Ошибка инициализации базы данных: ${
            (event.target as IDBOpenDBRequest).error
          }`
        );
      };
    });
  }

  /**
   * Добавить данные
   */
  async add(data: TFlashCard): Promise<string> {
    await this.ensureDBInitialized();

    return new Promise((resolve, reject) => {
      if (!this.db) return reject("База данных не инициализирована.");

      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      const request = store.add(data);

      request.onsuccess = () => resolve("Данные успешно добавлены.");
      request.onerror = (event) =>
        reject(
          `Ошибка добавления данных: ${(event.target as IDBRequest).error}`
        );
    });
  }

  /**
   * Обновить данные
   */
  async update(data: TUpdateFlashCard): Promise<string> {
    await this.ensureDBInitialized();

    return new Promise((resolve, reject) => {
      if (!this.db) return reject("База данных не инициализирована.");

      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      const request = store.put(data);

      request.onsuccess = () => resolve("Данные успешно обновлены.");
      request.onerror = (event) =>
        reject(
          `Ошибка обновления данных: ${(event.target as IDBRequest).error}`
        );
    });
  }

  /**
   * Получить данные по ключу
   */
  async get(id: number): Promise<TFlashCard | undefined> {
    await this.ensureDBInitialized();

    return new Promise((resolve, reject) => {
      if (!this.db) return reject("База данных не инициализирована.");

      const transaction = this.db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);

      const request = store.get(id);

      request.onsuccess = (event) =>
        resolve((event.target as IDBRequest).result as TFlashCard | undefined);
      request.onerror = (event) =>
        reject(
          `Ошибка получения данных: ${(event.target as IDBRequest).error}`
        );
    });
  }

  /**
   * Удалить данные
   */
  async delete(id: TFlashCard["id"]): Promise<string> {
    await this.ensureDBInitialized();

    return new Promise((resolve, reject) => {
      if (!this.db) return reject("База данных не инициализирована.");

      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      const request = store.delete(id);

      request.onsuccess = () => resolve("Данные успешно удалены.");
      request.onerror = (event) =>
        reject(`Ошибка удаления данных: ${(event.target as IDBRequest).error}`);
    });
  }

  /**
   * Получить все данные
   */
  async getAll(): Promise<TFlashCard[]> {
    await this.ensureDBInitialized();

    return new Promise((resolve, reject) => {
      if (!this.db) return reject("База данных не инициализирована.");

      const transaction = this.db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);

      const request = store.getAll();

      request.onsuccess = (event) =>
        resolve((event.target as IDBRequest).result as TFlashCard[]);
      request.onerror = (event) =>
        reject(
          `Ошибка получения всех данных: ${(event.target as IDBRequest).error}`
        );
    });
  }
}
