import { TFlashCard } from "_features/flashCards/types";

import styles from "./styles.module.scss";

type TFlashCardInfo = Pick<TFlashCard, "answer" | "question" | "ef">;

export const FlashCardInfo = ({ ef, answer, question }: TFlashCardInfo) => {
  // Нормализация EF для правильной визуализации от 1.3 до 5
  const normalizedEf = Math.min(Math.max(ef, 1.3), 5);

  // Преобразование EF в процент для шкалы
  const efPercentage = ((normalizedEf - 1.3) / (5 - 1.3)) * 100;

  // Генерация цвета на основе EF (hsl)
  const efColor = `hsl(${efPercentage}, 80%, 50%)`;

  return (
    <div className={styles.card}>
      {/* Секция с двумя словами */}
      <div className={styles.wordSection}>
        <p className={styles.word}>{answer}</p>
        <p className={styles.translation}>{question}</p>
      </div>

      {/* Easiness Factor с динамическим цветом */}
      <div className={styles.ef} style={{ backgroundColor: efColor }}>
        EF: {normalizedEf.toFixed(2)}
      </div>

      {/* Прогресс-бар EF */}
      <div
        className={styles.efBar}
        style={{ width: `${efPercentage}%`, backgroundColor: efColor }}
      />
    </div>
  );
};
