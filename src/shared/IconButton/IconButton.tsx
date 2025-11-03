import { ButtonHTMLAttributes } from "react";

import { Icon } from "_shared/Icon/Icon";

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: any;
  size?: "sm" | "md" | "lg";
  className?: string;
};
export const IconButton = ({
  icon,
  size = "md",
  className = "",
  ...rest
}: TButtonProps) => {
  const sizeVariants = {
    sm: "rounded-sm w-4 h-4",
    md: "rounded-xl w-5 h-5",
    lg: "rounded-lg w-6 h-6",
  };

  return (
    <button
      className={`flex items-center justify-center border cursor-pointer disabled:cursor-not-allowed transition-colors duration-200 ease-out border-none ${sizeVariants[size]} ${className}`}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  );
};
