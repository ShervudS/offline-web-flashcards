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
    <div className={styles.learningProgressBar}>
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${(100 / amountCards) * currentPosotion}%` }}
        />
      </div>

      <p>{`Завершено ${currentPosotion} / ${amountCards}`}</p>
    </div>
  );
};
