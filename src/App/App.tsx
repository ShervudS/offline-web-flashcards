import { Footer } from "_widgets/Footer";
import { Header } from "_widgets/Header";
import { FlashCardsWrapper } from "_features/flashCards/ui/FlashCardsWrapper";

export const App = () => (
  <>
    <Header />

    <main className="flex flex-col gap-1 min-h-screen content-container">
      <FlashCardsWrapper />
    </main>

    <Footer />
  </>
);
