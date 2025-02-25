import { useList, useUnit } from "effector-react";

import { FlashCardInfo } from "./FlashCardInfo";

import { $cards, removedCard } from "_entities/cards/model";

export const CardsListPreview = () => {
  const removeCard = useUnit(removedCard);

  return (
    <div className="w-full grid gap-2 grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))] md:gap-5 lg:gap-9">
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
