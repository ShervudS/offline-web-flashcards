import { Typography } from "_shared/Typography";

type TLearningProgress = {
  currentPosotion: number;
  amountCards: number;
};

export const LearningProgress = ({
  currentPosotion,
  amountCards,
}: TLearningProgress) => {
  return (
    <div className="flex flex-col items-center gap-3 max-w-3xl w-full">
      <div className="relative w-full h-4 bg-gray-800 dark:bg-gray-400 rounded-xl">
        <div
          className="progress"
          style={{ width: `${(100 / amountCards) * currentPosotion}%` }}
        />
      </div>

      <Typography className="text-lg">
        {`Завершено ${currentPosotion} / ${amountCards}`}
      </Typography>
    </div>
  );
};
