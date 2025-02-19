import type { TFlashCard } from "_entities/cards/types";

type TFlashCardInfo = Pick<TFlashCard, "answer" | "question" | "ef" | "id"> & {
  onRemove: (removeCard: any) => any;
};

export const FlashCardInfo = ({
  id,
  ef,
  answer,
  question,
  onRemove,
}: TFlashCardInfo) => {
  const normalizedEf = Math.min(Math.max(ef, 1.3), 5);

  const onClickToRemove = () => {
    onRemove(id);
  };

  return (
    <div className="flex flex-col p-8 rounded-2xl bg-gray-800 dark:bg-gray-400">
      <button onClick={onClickToRemove}>X</button>

      <div>
        <p className="text-5xl font-bold text-gray-50 first-letter:uppercase">
          {answer}
        </p>
        <p className="text-2xl text-gray-300">{question}</p>
      </div>

      <div className="text-3xl font-bold mt-4 p-4 rounded-xl text-gray-50">
        EF: {normalizedEf.toFixed(2)}
      </div>

      <div className="w-full h-4 rounded-lg mt-6" />
    </div>
  );
};
