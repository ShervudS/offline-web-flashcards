import { FlashCardInfo } from "./FlashCardInfo";

import type { Nullable } from "_types/index";
import type { TFlashCard } from "_entities/cards/types";

import styles from "./styles.module.scss";

type TCardsListPreview = {
  cards: Nullable<TFlashCard[]>;
};

export const CardsListPreview = ({ cards }: TCardsListPreview) => {
  return (
    <div className={styles.list}>
      {cards?.map(({ id, question, answer, ef }) => (
        <FlashCardInfo key={id} ef={ef} question={question} answer={answer} />
      ))}
    </div>
  );
};
