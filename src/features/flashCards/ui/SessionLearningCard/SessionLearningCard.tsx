import { useUnit } from "effector-react";

import { Button } from "_shared/Button";
import { LearningProgress } from "./components/LearningProgress";
import { FlashCard } from "./components/FlashCard";

import {
  $amountCardToLearn,
  $currentLearningIdx,
  $hasCardsToLearn,
  $isStudyAvailable,
  $isVisibleStudySession,
  $studyResultsVisible,
  retryedSession,
  startedSession,
} from "./model";

export const SessionLearningCard = () => {
  const [
    isStudyAvailable,
    isVisibleStudySession,
    studyResultsVisible,
    onStartSession,
    currentLearningIdx,
    amountCardToLearn,
    hasCardsToLearn,
    onRetrySession,
  ] = useUnit([
    $isStudyAvailable,
    $isVisibleStudySession,
    $studyResultsVisible,
    startedSession,
    $currentLearningIdx,
    $amountCardToLearn,
    $hasCardsToLearn,
    retryedSession,
  ]);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-5">
      {!hasCardsToLearn && (
        <div>
          <h3>Отсутстуют карточки для изучения</h3>
        </div>
      )}

      {isStudyAvailable && (
        <div>
          <Button onClick={onStartSession}>Начать изучать</Button>
        </div>
      )}

      {isVisibleStudySession && (
        <>
          <div className="flex gap-2 items-center">
            {/* <Button
            // onClick={handlerPrevCard}
            // disabled={!cards || !currentIndex}
            >
              Вернуться
            </Button> */}

            <LearningProgress
              currentPosotion={currentLearningIdx}
              amountCards={amountCardToLearn}
            />
            {/* 
            <Button>Сбросить</Button> */}
          </div>

          <FlashCard />
        </>
      )}

      {studyResultsVisible && (
        <div className="min-w-md max-w-5xl w-full bg-gray-700  dark:bg-gray-400 p-8 rounded-2xl flex flex-col justify-between items-center min-h-50">
          <p className="text-gray-100 dark:text-gray-800">
            Всего изучено карточек: {amountCardToLearn}
          </p>

          <Button onClick={onRetrySession}>Начать заного</Button>
        </div>
      )}
    </div>
  );
};
