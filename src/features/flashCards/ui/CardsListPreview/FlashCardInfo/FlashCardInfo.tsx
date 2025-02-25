import type { TFlashCard } from "_entities/cards/types";

type TFlashCardInfo = Pick<TFlashCard, "answer" | "question" | "ef" | "id"> & {
  onRemove: (removeCardId: TFlashCard["id"]) => any;
};

export const FlashCardInfo = ({
  id,
  ef,
  answer,
  question,
  onRemove,
}: TFlashCardInfo) => {
  const onClickToRemove = () => {
    onRemove(id);
  };

  return (
    <div className="flex flex-col p-2 rounded-2xl relative border border-solid border-gray-500 dark:border-gray-400 bg-gray-900 dark:bg-gray-200 md:p-4 lg:p-8">
      <button
        onClick={onClickToRemove}
        className="absolute top-3 right-3 cursor-pointer text-gray-500 lg:top-5 lg:right-5"
      >
        X
      </button>

      <p className="text-3xl font-bold text-gray-50 dark:text-gray-900 text-center first-letter:uppercase truncate lg:text-4xl">
        {answer}
      </p>

      <p className="text-2xl text-center text-gray-400 dark:text-gray-700 truncate lg:text-3xl">
        {question}
      </p>

      <p className="text-2xl font-bold mt-4 text-gray-50 dark:text-gray-800 lg:text-3xl">
        {`EF: ${Math.min(Math.max(ef, 1.3), 5).toFixed(2)}`}
      </p>
    </div>
  );
};
