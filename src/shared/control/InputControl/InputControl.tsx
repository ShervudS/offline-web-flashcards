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
  sizeVariant?: "sm" | "md" | "lg";
};

export const InputControl = ({
  value,
  onChange,
  type = "text",
  sizeVariant = "md",
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

  const sizeVariants = {
    sm: "",
    md: "pt-0.5 pr-1.5 pb-0.5 pl-1.5 lg:pt-1 lg:pr-3.5 lg:pb-1 lg:pl-3.5",
    lg: "",
  };

  return (
    <div className="flex flex-col gap-0.5 lg:gap-1">
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
        className={`${sizeVariants[sizeVariant]} block bg-gray-800 dark:bg-gray-600 rounded-md cursor-text border border-solid border-gray-500 dark:border-gray-800 placeholder:text-gray-100`}
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
