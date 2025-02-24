import { useList, useUnit } from "effector-react";

import { FlashCardInfo } from "./FlashCardInfo";

import { $cards, removedCard } from "_entities/cards/model";

export const CardsListPreview = () => {
  const removeCard = useUnit(removedCard);

  return (
    <div className="w-full grid gap-9 grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))]">
      {useList($cards, ({ id, ef, question, answer }) => (
        <FlashCardInfo
          id={id}
          ef={ef}
          question={question}
          answer={answer}
          onRemove={removeCard}
        />
      ))}
    </div>
  );
};
