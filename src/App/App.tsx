import { Footer } from "_widgets/Footer";
import { Header } from "_widgets/Header";
import { FlashCardsWrapper } from "_features/flashCards/ui/FlashCardsWrapper";

import styles from "./styles.module.scss";

export const App = () => {
  return (
    <>
      <Header />

      <main className={styles.main}>
        <FlashCardsWrapper />
      </main>

      <Footer />
    </>
  );
};
