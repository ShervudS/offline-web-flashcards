import { FlashCardInfo } from "./FlashCardInfo";

import { TFlashCard } from "_features/flashCards/types";

import styles from "./styles.module.scss";

type TCardsListPreview = {
  cards: TFlashCard[] | null;
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
