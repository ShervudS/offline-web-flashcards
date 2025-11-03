import { useEffect } from "react";
import { useList, useUnit } from "effector-react";

import { FlashCardInfo } from "./FlashCardInfo";
import { Button } from "_shared/Button";

import { useConfirm } from "_shared/ModalConfirm/ConfirmProvider";

import { $cards, removedCard } from "_entities/cards/model";
import { Typography } from "_shared/Typography";

export const CardsListPreview = () => {
  const { showConfirm } = useConfirm();
  const removeCard = useUnit(removedCard);

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target?.dataset?.id) {
      showConfirm({
        title: "Удалить слово?",
        subtitle: "Слово будет безвозвратно удалёно.",
        onConfirm: () => removeCard(target?.dataset?.id as string),
      });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-2 bg-gray-800 dark:bg-gray-200 p-2 rounded-xl  border border-solid border-gray-400">
      <div className="flex justify-between items-center">
        <Typography variant="h2">All flashCards</Typography>

        <Button startIcon="sort" size="sm">Sorting</Button>
      </div>

      <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))]">
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
    </div>
  );
};
