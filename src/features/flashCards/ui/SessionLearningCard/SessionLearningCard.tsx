import { useUnit } from "effector-react";

import { Button } from "_shared/Button";
import { Typography } from "_shared/Typography";
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
          <Typography variant="h3">Отсутстуют карточки для изучения</Typography>
        </div>
      )}

      {isStudyAvailable && (
        <div>
          <Button onClick={onStartSession}>Начать изучать</Button>
        </div>
      )}

      {isVisibleStudySession && (
        <>
          <LearningProgress
            currentPosotion={currentLearningIdx}
            amountCards={amountCardToLearn}
          />

          <FlashCard />
        </>
      )}

      {studyResultsVisible && (
        <div className="max-w-5xl w-full bg-gray-700  dark:bg-gray-400 p-8 rounded-2xl flex flex-col justify-between items-center min-h-50">
          <Typography>{`Всего изучено карточек: ${amountCardToLearn}`}</Typography>

          <Button onClick={onRetrySession}>Начать заного</Button>
        </div>
      )}
    </div>
  );
};
