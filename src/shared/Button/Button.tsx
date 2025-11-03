import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { Icon } from "_shared/Icon";

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  startIcon?: string;
  endIcon?: string;
  isLoading?: boolean;
};

export const Button = ({
  children,
  endIcon,
  startIcon,
  variant = "primary",
  size = "md",
  isLoading,
  className,
  ...rest
}: PropsWithChildren<TButtonProps>) => {
  const sizeVariants = {
    sm: "gap-1 rounded-sm pt-1 pr-4 pb-1 pl-4",
    md: "gap-1 rounded-xl pt-2 pr-1.5 pb-2 pl-1.5 lg:gap-3.5 lg:rounded-2xl lg:pt-3.5 lg:pr-9 lg:pb-3.5 lg:pl-9",
    lg: "",
  };

  const colorVariants = {
    primary:
      "bg-gray-900 dark:bg-gray-200 border-gray-800 dark:border-gray-400 text-gray-50 dark:text-gray-900 border-gray-50 hover:not-disabled:bg-gray-900 dark:hover:not-disabled:bg-gray-300 hover:not-disabled:border-gray-400",
    secondary: "",
    outline: "",
  };

  return (
    <button
      className={`flex items-center justify-center border cursor-pointer disabled:cursor-not-allowed transition-colors duration-200 ease-out ${colorVariants[variant]} ${sizeVariants[size]} ${className}`}
      {...rest}
    >
      {startIcon && (
        <div className="w-5 h-5">
          <Icon name={startIcon} />
        </div>
      )}

      <span>{children}</span>

      {endIcon && (
        <div className="w-5 h-5">
          <Icon name={endIcon} />
        </div>
      )}
    </button>
  );
};
