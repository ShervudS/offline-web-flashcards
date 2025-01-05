import { ButtonHTMLAttributes, PropsWithChildren, ReactElement } from "react";

import styles from "./styles.module.scss";

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  prefixIcon?: ReactElement;
  postfixIcon?: ReactElement;
};

export const Button = ({
  prefixIcon,
  children,
  postfixIcon,
  ...rest
}: PropsWithChildren<TButtonProps>) => (
  <button className={styles.button} {...rest}>
    {prefixIcon}

    <span>{children}</span>

    {postfixIcon}
  </button>
);
