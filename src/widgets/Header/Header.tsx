import { ThemeButton } from "_processed/theme/ui/ThemeButton";

import styles from "./styles.module.scss";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        FlashCardsLearn
        <ThemeButton />
      </div>
    </header>
  );
};
