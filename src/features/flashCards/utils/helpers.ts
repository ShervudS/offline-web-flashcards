type TBuildWordCardHint = (word: string) => string;

export const buildWordCardHint: TBuildWordCardHint = (word) =>
  word
    .split(" ")
    .map((el) => "_ ".repeat(el.length))
    .join("  ");
