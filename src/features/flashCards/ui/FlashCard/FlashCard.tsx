import { useEffect, useRef } from "react";

import {
  buildWordCardHint,
  updateCardLearningStatus,
} from "_features/flashCards/utils/updateCard";

import { TFlashCard } from "_features/flashCards/types";

import { useBoolean } from "_hooks/useBoolean";

import styles from "./styles.module.scss";

type TFlashCardProps = {
  card: TFlashCard;
  onCorrect: (arg0: TFlashCard) => void;
  onWrong: (arg0: TFlashCard) => void;
};

export const FlashCard = ({ card, onCorrect, onWrong }: TFlashCardProps) => {
  const {
    value: isShowAnswer,
    setTrue: onShowAnswer,
    setFalse: onHideAnswer,
  } = useBoolean();
  const {
    value: isShowHint,
    setTrue: onShowHint,
    setFalse: onHideHint,
  } = useBoolean();

  const startTimeRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [card.id]);

  const handleCorrect = () => {
    onHideAnswer();
    onHideHint();
    onCorrect(
      updateCardLearningStatus({
        card,
        responseTime: (Date.now() - startTimeRef.current) / 1000,
        isCorrect: true,
      })
    );
  };

  const handleWrong = () => {
    onHideAnswer();
    onHideHint();
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

      {isShowAnswer && (
        <div className={styles.answer}>
          <p>{card.answer}</p>
        </div>
      )}

      <div className={styles.cardHint}>
        {isShowHint && <p>{buildWordCardHint(card.answer)}</p>}
        <button onClick={onShowHint}>Показать подсказку</button>
      </div>

      {/* {showHint && (
        <div className={styles.answer}>
          <p>{buildWordCardHint(card.answer)}</p>
        </div>
      )} */}

      <div className={styles.buttons}>
        {!isShowAnswer && (
          <button
            className={`${styles.button} ${styles.showAnswer}`}
            onClick={onShowAnswer}
          >
            Показать ответ
          </button>
        )}
      </div>

      <div className={styles.cardAnswerActions}>
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
      </div>
    </div>
  );
};
