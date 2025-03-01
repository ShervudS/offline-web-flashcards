import { ThemeButton } from "_processes/theme/ui/ThemeButton";

export const Header = () => {
  return (
    <header className="pt-4 pb-4">
      <div className="flex justify-between items-center content-container">
        FlashCardsLearn
        <ThemeButton />
      </div>
    </header>
  );
};
