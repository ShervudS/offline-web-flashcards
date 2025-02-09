import { Button } from "_shared/Button";
import { LearningProgress } from "./components/LearningProgress";
import { FlashCard } from "./components/FlashCard";

import { useLearningSession } from "_features/flashCards/hooks/useLearningSession";

import type { TFlashCard } from "_entities/cards/types";

type TSessionLearningCard = {
  cards: TFlashCard[];
};

export const SessionLearningCard = ({ cards }: TSessionLearningCard) => {
  const {
    currentCard,
    isStartedSession,
    currentIndex,
    amountCardToLearn,
    handleResponse,
    onStartSession,
    onRetrySession,
  } = useLearningSession(cards);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-5">
      {!isStartedSession && (
        <div>
          <Button onClick={onStartSession}>Начать изучать</Button>
        </div>
      )}

      {isStartedSession && currentCard && (
        <>
          <LearningProgress
            currentPosotion={currentIndex}
            amountCards={amountCardToLearn}
          />

          <FlashCard card={currentCard} handleAnswer={handleResponse} />
        </>
      )}

      {isStartedSession && currentIndex === amountCardToLearn && (
        <div className="min-w-md max-w-5xl w-full bg-gray-700  dark:bg-gray-400 p-8 rounded-2xl flex flex-col justify-between items-center min-h-40">
          <p className="text-gray-100 dark:text-gray-800">Всего изучено карточек: {amountCardToLearn}</p>

          <Button onClick={onRetrySession}>Начать заного</Button>
        </div>
      )}
    </div>
  );
};
