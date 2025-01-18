import { useCallback, useEffect, useState } from "react";

import { FlashCardForm } from "../FlashCardForm";
import { CardsListPreview } from "../CardsListPreview";
import { CardsIndexedDB } from "_features/flashCards/store";
import { FlashCard } from "../FlashCard/FlashCard";
import { Button } from "_shared/Button";

import { TFlashCard } from "_features/flashCards/types";

import styles from "./style.module.scss";
import { LearningProgress } from "../LearningProgress";

export const FlashCardsWrapper = () => {
  const cardsDb = new CardsIndexedDB("flashCards", "cards");

  const [cards, setCards] = useState<TFlashCard[] | null>(null);
  const [isStartLearning, setIsStartLearning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const initializeDatabase = async () => {
      const cardsFromDB = await cardsDb.getAll();

      console.log(cardsFromDB);

      setCards(cardsFromDB);
    };

    initializeDatabase();
  }, []);

  const handleNextCard = () => {
    setCurrentIndex((prev) => (prev += 1));
  };

  const handlerPrevCard = () => {
    setCurrentIndex((prev) => (prev -= 1));
  };

  const resetCurIndex = () => {
    setCurrentIndex(0);
  };

  const handleCorrect = useCallback((card: TFlashCard) => {
    console.log(`Карточка ${card.id} запомнена!`);
    handleNextCard();
  }, []);

  const handleWrong = useCallback((card: TFlashCard) => {
    console.log(`Карточка ${card.id} не запомнена!`);
    handleNextCard();
  }, []);

  const onSaveFlashCard = useCallback(async (cardData: TFlashCard) => {
    try {
      await cardsDb.add(cardData);

      setCards((prev) => [...(prev || []), cardData]);
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    }
  }, []);

  return (
    <div className={styles.flashCardWrapper}>
      <FlashCardForm onSave={onSaveFlashCard} />

      <div>
        <Button onClick={handlerPrevCard} disabled={!cards || !currentIndex}>
          Вернуться
        </Button>

        <Button onClick={resetCurIndex} disabled={!currentIndex}>
          Сбросить
        </Button>
      </div>

      <div className={styles.learnCardContainer}>
        {!isStartLearning && (
          <div>
            <Button onClick={() => setIsStartLearning(true)}>
              Начать изучать
            </Button>
          </div>
        )}

        {isStartLearning && cards?.[currentIndex] && (
          <>
            <LearningProgress
              currentPosotion={currentIndex}
              amountCards={cards.length}
            />

            <FlashCard
              card={cards[currentIndex]}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          </>
        )}
      </div>

      <div className={styles.allCardList}>
        <h2>All flashCards</h2>

        <CardsListPreview cards={cards} />
      </div>
    </div>
  );
};
