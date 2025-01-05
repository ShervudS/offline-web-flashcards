import { useEffect, useRef, useState } from "react";

import { updateCardLearningStatus } from "_features/flashCards/utils/updateCard";

import { TFlashCard } from "_features/flashCards/types";

import styles from "./styles.module.scss";

type TFlashCardProps = {
  card: TFlashCard;
  onCorrect: (arg0: TFlashCard) => void;
  onWrong: (arg0: TFlashCard) => void;
};

export const FlashCard = ({ card, onCorrect, onWrong }: TFlashCardProps) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [card.id]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleCorrect = () => {
    setShowAnswer(false);
    onCorrect(
      updateCardLearningStatus({
        card,
        responseTime: (Date.now() - startTimeRef.current) / 1000,
        isCorrect: true,
      })
    );
  };

  const handleWrong = () => {
    setShowAnswer(false);
    onWrong(
      updateCardLearningStatus({
        card,
        responseTime: (Date.now() - startTimeRef.current) / 1000,
        isCorrect: false,
      })
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.question}>
        <h2>{card.question}</h2>
      </div>

      {showAnswer && (
        <div className={styles.answer}>
          <p>{card.answer}</p>
        </div>
      )}

      <div className={styles.buttons}>
        {!showAnswer ? (
          <button
            className={`${styles.button} ${styles.showAnswer}`}
            onClick={handleShowAnswer}
          >
            Показать ответ
          </button>
        ) : (
          <>
            <button
              className={`${styles.button} ${styles.wrong}`}
              onClick={handleWrong}
            >
              Не помню
            </button>

            <button
              className={`${styles.button} ${styles.correct}`}
              onClick={handleCorrect}
            >
              Помню
            </button>
          </>
        )}
      </div>
    </div>
  );
};
