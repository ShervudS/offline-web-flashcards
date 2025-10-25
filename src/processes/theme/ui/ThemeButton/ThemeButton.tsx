import { useUnit } from "effector-react";

import { Button } from "_shared/Button";

import { toggedTheme } from "_processes/theme/model/theme.model";

export const ThemeButton = () => {
  const onToggleTheme = useUnit(toggedTheme);

  return (
    <Button onClick={onToggleTheme} size="sm">
      Theme
    </Button>
  );
};
