import { useEffect, useRef, useState } from "react";

import { useBoolean } from "_hooks/useBoolean";

import { buildWordCardHint } from "_features/flashCards/utils/helpers";

import type { Nullable } from "_types/index";
import type { TFlashCard } from "_entities/cards/types";

import styles from "./styles.module.scss";

type TFlashCardProps = {
  card: TFlashCard;
  handleAnswer: (arg0: any) => void;
};

const MSEC_FROM_SEC = 1000;

export const FlashCard = ({ card, handleAnswer }: TFlashCardProps) => {
  const [visibleHintType, setVisibleHintType] =
    useState<Nullable<"letters" | "firstLetter">>(null);
  const startTimeRef = useRef(0);

  const {
    value: isShowAnswer,
    setTrue: onShowAnswer,
    setFalse: onHideAnswer,
  } = useBoolean();

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [card.id]);

  const onShowHintOfLength = () => {
    setVisibleHintType("letters");
  };

  const onShowHintOfFirstLetter = () => {
    setVisibleHintType("firstLetter");
  };

  const onSubmit = (isCorrect: boolean) => {
    const responseTimeSec = Math.floor(
      (Date.now() - startTimeRef.current) / MSEC_FROM_SEC
    );

    onHideAnswer();
    setVisibleHintType(null);

    handleAnswer({
      responseTime: responseTimeSec,
      isCorrect,
      hintType: visibleHintType ?? "none",
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.question}>
        <h2>{card.question}</h2>
      </div>

      <div className={styles.cardHint}>
        {visibleHintType === "letters" && (
          <>
            <p>{buildWordCardHint(card.answer)}</p>

            <button onClick={onShowHintOfFirstLetter}>
              Показать Первую букву
            </button>
          </>
        )}
        {visibleHintType === "firstLetter" && (
          <p>
            {card.answer.at(0)} {buildWordCardHint(card.answer)}
          </p>
        )}
        {!visibleHintType && (
          <button onClick={onShowHintOfLength}>Показать кол-во букв</button>
        )}
      </div>

      <div className={styles.buttons}>
        {isShowAnswer ? (
          <div className={styles.answer}>
            <p>{card.answer}</p>
          </div>
        ) : (
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
          onClick={() => onSubmit(false)}
        >
          Не помню
        </button>

        <button
          className={`${styles.button} ${styles.correct}`}
          onClick={() => onSubmit(true)}
        >
          Помню
        </button>
      </div>
    </div>
  );
};
