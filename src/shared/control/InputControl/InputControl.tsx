import { InputHTMLAttributes } from "react";
import { clsx } from "clsx";

import styles from "./styles.module.scss";

type TInputControl = InputHTMLAttributes<HTMLInputElement> & {
  value?: string;
  label?: string;
  hintText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: (value: string) => string | null;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string | null;
};

export const InputControl = ({
  value,
  onChange,
  type = "text",
  label,
  validate,
  hintText,
  onBlur: onBlurInProps,
  disabled = false,
  error = null,
  ...props
}: TInputControl) => {
  // const [error, setError] = useState<null | string>(null);

  const onBlur = () => {
    // if (validate) {
    //   setError(validate(value));
    // }

    onBlurInProps && onBlurInProps();
  };

  return (
    <label className={styles.control__label}>
      <span className={styles.control__labelText}>{label}</span>

      <div
        className={clsx([
          styles.control__inputWrapper,
          { [styles.control__error]: Boolean(error) },
          { [styles.control__disabled]: disabled },
        ])}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={styles.control__input}
          {...props}
        />
      </div>

      {(error || hintText) && (
        <span className={styles.control__inputHintText}>
          {error || hintText}
        </span>
      )}
    </label>
  );
};
