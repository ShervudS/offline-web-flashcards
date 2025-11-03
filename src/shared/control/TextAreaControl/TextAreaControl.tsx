import { useId, type ChangeEvent, type InputHTMLAttributes } from "react";

type TTextAreaControl = InputHTMLAttributes<HTMLTextAreaElement> & {
  value?: string;
  label?: string;
  hintText?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  validate?: (value: string) => string | null;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string | null;
  sizeVariant?: "sm" | "md" | "lg";
};

export const TextAreaControl = ({
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
  className = "",
  ...props
}: TTextAreaControl) => {
  const areaId = useId();

  const onBlur = () => {
    onBlurInProps && onBlurInProps();
  };

  const sizeVariants = {
    sm: "",
    md: "pt-0.5 pr-1.5 pb-0.5 pl-1.5 lg:pt-1 lg:pr-3.5 lg:pb-1 lg:pl-3.5",
    lg: "",
  };

  return (
    <div className={`flex flex-col items-start gap-0.5 lg:gap-1 ${className}`}>
      <label
        className="text-gray-100 dark:text-gray-950 select-none"
        htmlFor={areaId}
      >
        {label}
      </label>

      <textarea
        id={areaId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`${sizeVariants[sizeVariant]} block w-full bg-gray-800 dark:bg-gray-500 rounded-md cursor-text border border-solid border-gray-500 dark:border-gray-800 placeholder:text-gray-100 resize-y`}
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
