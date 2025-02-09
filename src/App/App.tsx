import { Footer } from "_widgets/Footer";
import { Header } from "_widgets/Header";

import { CardsProvider } from "_entities/cards";

import { FlashCardsWrapper } from "_features/flashCards/ui/FlashCardsWrapper";

export const App = () => {
  return (
    <CardsProvider>
      <Header />

      <main className="flex flex-col gap-1 min-h-screen content-container bg-gray-base dark:bg-gray-50">
        <FlashCardsWrapper />
      </main>

      <Footer />
    </CardsProvider>
  );
};
