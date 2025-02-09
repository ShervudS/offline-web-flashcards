import styles from "./styles.module.scss";

type TLearningProgress = {
  currentPosotion: number;
  amountCards: number;
};

export const LearningProgress = ({
  currentPosotion,
  amountCards,
}: TLearningProgress) => {
  return (
    <div className="flex flex-col items-center gap-3 min-w-lg">
      <div className="relative w-full h-4 bg-gray-800 dark:bg-gray-400 rounded-xl">
        <div
          className={styles.progress}
          style={{ width: `${(100 / amountCards) * currentPosotion}%` }}
        />
      </div>

      <p className="text-xl text-gray-500">{`Завершено ${currentPosotion} / ${amountCards}`}</p>
    </div>
  );
};
