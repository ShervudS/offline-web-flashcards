import { useUnit } from "effector-react";

import {
  $currentCard,
  $hintType,
  correctedAnswer,
  showedHintOfAmountLettres,
  showedHintOfFirstLetter,
  uncorrectedAnswer,
} from "../../model";

import { useBoolean } from "_hooks/useBoolean";

import { buildWordCardHint } from "_features/flashCards/utils/helpers";

export const FlashCard = () => {
  // const [visibleHintType, setVisibleHintType] =
  //   useState<Nullable<"letters" | "firstLetter">>(null);
  // const startTimeRef = useRef(0);

  const [
    card,
    hintType,
    onUncorrect,
    onCorrect,
    onShowHintOfAmountLetters,
    onShowHintOfFirstLetter,
  ] = useUnit([
    $currentCard,
    $hintType,
    uncorrectedAnswer,
    correctedAnswer,
    showedHintOfAmountLettres,
    showedHintOfFirstLetter,
  ]);

  const {
    value: isShowAnswer,
    setTrue: onShowAnswer,
    setFalse: onHideAnswer,
  } = useBoolean();

  // useEffect(() => {
  //   startTimeRef.current = Date.now();
  // }, [card.id]);

  // const onShowHintOfLength = () => {
  //   setVisibleHintType("letters");
  // };

  // const onShowHintOfFirstLetter = () => {
  //   setVisibleHintType("firstLetter");
  // };

  // const onSubmit = (isCorrect: boolean) => {
  //   const responseTimeSec = Math.floor(
  //     (Date.now() - startTimeRef.current) / MSEC_FROM_SEC
  //   );

  //   onHideAnswer();
  //   setVisibleHintType(null);

  //   handleAnswer({
  //     responseTime: responseTimeSec,
  //     isCorrect,
  //     hintType: visibleHintType ?? "none",
  //   });
  // };

  const onUncorrectAnswer = () => {
    onUncorrect();
    onHideAnswer();
  };

  const onCorrectAnswer = () => {
    onCorrect();
    onHideAnswer();
  };

  return (
    <div className="min-w-md max-w-5xl w-full bg-gray-800 dark:bg-gray-400 p-8 rounded-2xl text-center">
      <div className="text-3xl font-bold mb-6 text-gray-100 dark:text-gray-900 first-letter:uppercase">
        <h2>{card?.question}</h2>
      </div>

      <div className="tracking-widest">
        {hintType === "letters" && (
          <>
            <p className="text-gray-100 dark:text-gray-900">
              {buildWordCardHint(card?.answer || "")}
            </p>

            <button onClick={onShowHintOfFirstLetter}>
              Показать Первую букву
            </button>
          </>
        )}
        {hintType === "firstLetter" && (
          <p className="text-gray-100 dark:text-gray-900">
            {card?.answer.at(0)} {buildWordCardHint(card?.answer || "")}
          </p>
        )}
        {!hintType && (
          <button onClick={onShowHintOfAmountLetters}>
            Показать кол-во букв
          </button>
        )}
      </div>

      <div className="flex justify-around mt-6">
        {isShowAnswer ? (
          <div className="text-2xl italic mt-6 text-gray-100 dark:text-gray-900">
            <p>{card?.answer}</p>
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
          onClick={onUncorrectAnswer}
        >
          Не помню
        </button>

        <button
          className="pt-4 pr-6 pb-4 pl-6 text-2xl rounded-lg border-none cursor-pointer transition-colors bg-green-700 hover:bg-green-600"
          onClick={onCorrectAnswer}
        >
          Помню
        </button>
      </div>
    </div>
  );
};
