import { ThemeButton } from "_processes/theme/ui/ThemeButton";

export const Header = () => {
  return (
    <header className="pt-4 pb-4 bg-gray-base dark:bg-gray-50 text-gray-100 dark:text-gray-950">
      <div className="flex justify-between items-center content-container">
        FlashCardsLearn
        <ThemeButton />
      </div>
    </header>
  );
};
