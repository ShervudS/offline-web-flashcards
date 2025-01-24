import { useContext } from "react";

import { CardsListPreview } from "../CardsListPreview";
import { SessionLearningCard } from "../SessionLearningCard";
import { FlashCardForm } from "../FlashCardForm";

import { CardsContext } from "_entities/cards";

import styles from "./style.module.scss";

export const FlashCardsWrapper = () => {
  const { cards, onCreateFlashCard } = useContext(CardsContext);

  return (
    <div className={styles.flashCardWrapper}>
      <FlashCardForm onSave={onCreateFlashCard} />

      <div>
        {/* <Button onClick={handlerPrevCard} disabled={!cards || !currentIndex}>
          Вернуться
        </Button>

        <Button onClick={resetCurIndex} disabled={!currentIndex}>
          Сбросить
        </Button> */}
      </div>

      {cards && <SessionLearningCard cards={cards} />}

      <div className={styles.allCardList}>
        <h2>All flashCards</h2>

        <CardsListPreview cards={cards} />
      </div>
    </div>
  );
};
