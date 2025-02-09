import { useEffect, useRef, useState } from "react";

import { useBoolean } from "_hooks/useBoolean";

import { buildWordCardHint } from "_features/flashCards/utils/helpers";

import type { Nullable } from "_types/index";
import type { TFlashCard } from "_entities/cards/types";

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
    <div className="min-w-md max-w-5xl w-full bg-gray-800 dark:bg-gray-400 p-8 rounded-2xl text-center">
      <div className="text-3xl font-bold mb-6 text-gray-100 dark:text-gray-900 first-letter:uppercase">
        <h2>{card.question}</h2>
      </div>

      <div className="tracking-widest">
        {visibleHintType === "letters" && (
          <>
            <p className="text-gray-100 dark:text-gray-900">{buildWordCardHint(card.answer)}</p>

            <button onClick={onShowHintOfFirstLetter}>
              Показать Первую букву
            </button>
          </>
        )}
        {visibleHintType === "firstLetter" && (
          <p className="text-gray-100 dark:text-gray-900">
            {card.answer.at(0)} {buildWordCardHint(card.answer)}
          </p>
        )}
        {!visibleHintType && (
          <button onClick={onShowHintOfLength}>Показать кол-во букв</button>
        )}
      </div>

      <div className="flex justify-around mt-6">
        {isShowAnswer ? (
          <div className="text-2xl italic mt-6 text-gray-100 dark:text-gray-900">
            <p>{card.answer}</p>
          </div>
        ) : (
          <button
            className="pt-4 pr-8 pb-4 pl-8 text-2xl rounded-lg border-none cursor-pointer transition-colors bg-blue-700 hover:bg-blue-600 "
            onClick={onShowAnswer}
          >
            Показать ответ
          </button>
        )}
      </div>

      <div className="flex justify-between items-center gap-4">
        <button
          className="pt-4 pr-6 pb-4 pl-6 text-2xl rounded-lg border-none cursor-pointer transition-colors bg-red-700 hover:bg-red-600"
          onClick={() => onSubmit(false)}
        >
          Не помню
        </button>

        <button
          className="pt-4 pr-6 pb-4 pl-6 text-2xl rounded-lg border-none cursor-pointer transition-colors bg-green-700 hover:bg-green-600"
          onClick={() => onSubmit(true)}
        >
          Помню
        </button>
      </div>
    </div>
  );
};
