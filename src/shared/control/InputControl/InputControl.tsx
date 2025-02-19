import { ChangeEvent, InputHTMLAttributes, useId } from "react";

type TInputControl = InputHTMLAttributes<HTMLInputElement> & {
  value?: string;
  label?: string;
  hintText?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
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
  const inputId = useId();

  const onBlur = () => {
    onBlurInProps && onBlurInProps();
  };

  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-gray-100 dark:text-gray-950 select-none"
        htmlFor={inputId}
      >
        {label}
      </label>

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className="block bg-gray-800 dark:bg-gray-600 pt-1 pr-3.5 pb-1 pl-3.5 rounded-md cursor-text border border-solid border-gray-100 dark:border-gray-950"
        {...props}
      />

      {(error || hintText) && (
        <span className="text-gray-50 text-lg font-normal">
          {error || hintText}
        </span>
      )}
    </div>
  );
};
