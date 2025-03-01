import type {
  ButtonHTMLAttributes,
  PropsWithChildren,
  ReactElement,
} from "react";

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  prefixIcon?: ReactElement;
  postfixIcon?: ReactElement;
  isLoading?: boolean;
};

export const Button = ({
  prefixIcon,
  children,
  postfixIcon,
  variant = "primary",
  size = "md",
  isLoading,
  ...rest
}: PropsWithChildren<TButtonProps>) => {
  const sizeVariants = {
    sm: "gap-1 rounded-sm pt-1 pr-4 pb-1 pl-4",
    md: "gap-1 rounded-xl pt-2 pr-1.5 pb-2 pl-1.5 lg:gap-3.5 lg:rounded-2xl lg:pt-3.5 lg:pr-9 lg:pb-3.5 lg:pl-9",
    lg: "",
  };

  const colorVariants = {
    primary:
      "bg-gray-50 dark:bg-gray-base text-gray-900 dark:text-gray-50 border-gray-50 hover:not-disabled:bg-gray-400 dark:hover:not-disabled:bg-gray-800 hover:not-disabled:border-gray-50",
    secondary: "",
    outline: "",
  };

  return (
    <button
      className={`${colorVariants[variant]} ${sizeVariants[size]} flex items-center justify-center border cursor-pointer disabled:cursor-not-allowed transition-colors duration-200 ease-out`}
      {...rest}
    >
      {prefixIcon}

      <span>{children}</span>

      {postfixIcon}
    </button>
  );
};
