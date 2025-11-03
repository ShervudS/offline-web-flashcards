export const INDEX_DB_NAME = {
  FLASH_CARDS: "flashCards",
} as const;

export const INDEX_DB_STORE = {
  CARDS: "cards",
  TAGS: "tags",
} as const;

export type TIndexDbStore =
  (typeof INDEX_DB_STORE)[keyof typeof INDEX_DB_STORE];
