import { Button } from "_shared/Button";
import { LearningProgress } from "./components/LearningProgress";
import { FlashCard } from "./components/FlashCard";

import { useLearningSession } from "_features/flashCards/hooks/useLearningSession";

import type { TFlashCard } from "_entities/cards/types";

import styles from "./styles.module.scss";

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
  } = useLearningSession(cards);

  console.log(currentIndex, amountCardToLearn);

  return (
    <div className={styles.learnCardContainer}>
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
    </div>
  );
};
