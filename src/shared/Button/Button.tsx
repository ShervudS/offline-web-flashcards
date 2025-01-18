import type {
  ButtonHTMLAttributes,
  PropsWithChildren,
  ReactElement,
} from "react";
import clsx from "clsx";

import styles from "./styles.module.scss";

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  prefixIcon?: ReactElement;
  postfixIcon?: ReactElement;
};

export const Button = ({
  prefixIcon,
  children,
  postfixIcon,
  variant = "primary",
  ...rest
}: PropsWithChildren<TButtonProps>) => (
  <button
    className={clsx([
      styles.baseButton,
      {
        [styles.primaryButtonColors]: variant === "primary",
        [styles.secondaryButtonColors]: variant === "secondary",
        [styles.outlineButtonColors]: variant === "outline",
      },
    ])}
    {...rest}
  >
    {prefixIcon}

    <span>{children}</span>

    {postfixIcon}
  </button>
);
