import { CardsListPreview } from "../CardsListPreview";
import { FlashCardForm } from "../FlashCardForm";
import { SessionLearningCard } from "../SessionLearningCard";

export const FlashCardsWrapper = () => {
  return (
    <div className="flex flex-col gap-9 items-baseline">
      <FlashCardForm />

      <SessionLearningCard />

      <div className="w-full">
        <h2 className="text-3xl font-bold mb-2">All flashCards</h2>

        <CardsListPreview />
      </div>
    </div>
  );
};
