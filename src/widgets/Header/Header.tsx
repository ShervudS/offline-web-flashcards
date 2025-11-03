import { Link } from "atomic-router-react";

import { ThemeButton } from "_processes/theme/ui/ThemeButton";

import { routes } from "_processes/routing";

export const Header = () => (
  <header className="pt-4 pb-4">
    <div className="flex justify-between items-center content-container">
      <Link to={routes.home}>FlashCardsLearn</Link>

      <ThemeButton />
    </div>
  </header>
);
