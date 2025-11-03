import { memo } from "react";

type TIcon = {
  name: string;
  className?: string;
};

export const Icon = memo(({ name, className }: TIcon) => (
  <svg className={`w-full h-full ${className}`}>
    <use href={`icons.svg#${name}`} />
  </svg>
));
