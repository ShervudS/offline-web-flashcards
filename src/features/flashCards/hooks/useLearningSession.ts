import { useState, useCallback, useRef } from "react";

import { updateCardLearningStatus } from "../utils/updateCard";

import type { TFlashCard } from "_entities/cards/types";
import type { Nullable } from "_types/index";

export type THandleCardResponseProps = {
  responseTime: number;
  isCorrect: boolean;
  hintType: "letters" | "firstLetter" | "none";
};

export const useLearningSession = (initialCards: TFlashCard[]) => {
  const [cardQueue, setCardQueue] = useState<TFlashCard[]>([...initialCards]);
  const [repeatQueue, setRepeatQueue] = useState<TFlashCard[]>([]);
  const [currentCard, setCurrentCard] = useState<Nullable<TFlashCard>>(null);

  const [isStartedSession, setIsStartedSession] = useState(false);
  const [isRepeatCard, setIsRepeatCard] = useState(false);

  const amountCardToLearn = useRef(initialCards.length);
  const [currentLearningIndex, setCurrentLearningIndex] = useState(0);

  const updateCurrentCard = () => {
    if (cardQueue.length === 0 && repeatQueue.length === 0) {
      setCurrentCard(null);
      return null;
    }

    let nextCard: Nullable<TFlashCard> = null;

    if (repeatQueue.length > 0 && cardQueue.length % 3 === 0) {
      nextCard = repeatQueue[0];
      setRepeatQueue((prev) => prev.slice(1));
      setIsRepeatCard(true);
    } else {
      nextCard = cardQueue[0];
      setCardQueue((prev) => prev.slice(1));
      setIsRepeatCard(false);
    }

    setCurrentCard(nextCard);
  };

  const handleResponse = ({
    responseTime,
    isCorrect,
    hintType,
  }: THandleCardResponseProps) => {
    if (!currentCard) return;

    if (!isCorrect) {
      setRepeatQueue((prev) => [...prev, currentCard]);
    } else {
      // TODO: добавить логику обновления информации о карточке в indexDB
      console.log(
        "updateCardLearningStatus >>",
        updateCardLearningStatus({
          card: currentCard,
          responseTime,
          isCorrect,
          hintType,
          isRepeatCard: isRepeatCard,
        })
      );
    }

    setCurrentLearningIndex((prev) => (prev += 1));
    updateCurrentCard();
  };

  const onStartSession = useCallback(() => {
    setIsStartedSession(true);
    updateCurrentCard();
  }, []);

  return {
    currentCard,
    handleResponse,
    currentIndex: currentLearningIndex,
    amountCardToLearn: amountCardToLearn.current,
    onStartSession,
    isStartedSession,
  };
};
