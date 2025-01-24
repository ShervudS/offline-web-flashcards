import { Footer } from "_widgets/Footer";
import { Header } from "_widgets/Header";

import { CardsProvider } from "_entities/cards";

import { FlashCardsWrapper } from "_features/flashCards/ui/FlashCardsWrapper";

import styles from "./styles.module.scss";

export const App = () => {
  return (
    <CardsProvider>
      <Header />

      <main className={styles.main}>
        <FlashCardsWrapper />
      </main>

      <Footer />
    </CardsProvider>
  );
};
