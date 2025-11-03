import { Typography } from "_shared/Typography";
import { IconButton } from "_shared/IconButton/IconButton";

import type { TFlashCard } from "_entities/cards/types";

type TFlashCardInfo = Pick<TFlashCard, "answer" | "question" | "ef" | "id"> & {
  onRemove: (removeCardId: TFlashCard["id"]) => any;
};

export const FlashCardInfo = ({ id, ef, answer, question }: TFlashCardInfo) => {
  return (
    <div className="flex flex-col p-2 rounded-2xl relative border border-solid border-gray-500 dark:border-gray-400 bg-gray-900 dark:bg-gray-200 md:p-4 lg:p-6">
      <IconButton
        data-id={id}
        icon="close"
        className="absolute top-2.5 right-2.5 w-1 h-"
      />

      <Typography className="text-center text-xl first-letter:uppercase truncate">
        {answer}
      </Typography>

      <Typography className="text-sm first-letter:uppercase truncate">
        {question}
      </Typography>

      <Typography className="font-bold mt-4 text-gray-50">
        {`EF: ${Math.min(Math.max(ef, 1.3), 5).toFixed(2)}`}
      </Typography>
    </div>
  );
};
