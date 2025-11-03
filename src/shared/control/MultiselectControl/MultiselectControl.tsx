import { useId, type ChangeEvent, type SelectHTMLAttributes } from "react";

type TOption = {
  id: string;
  name: string;
  value: string | number;
};

type TMultiselectControl = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hintText?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  validate?: (value: string) => string | null;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string | null;
  sizeVariant?: "sm" | "md" | "lg";
  options: TOption[];
};

export const MultiselectControl = ({
  value,
  onChange,
  sizeVariant = "md",
  label,
  validate,
  hintText,
  error = null,
  options,
  ...props
}: TMultiselectControl) => {
  const selectId = useId();

  const sizeVariants = {
    sm: "",
    md: "pt-0.5 pr-1.5 pb-0.5 pl-1.5 lg:pt-1 lg:pr-3.5 lg:pb-1 lg:pl-3.5",
    lg: "",
  };

  return (
    <div className="flex flex-col items-start gap-0.5 lg:gap-1">
      {label && (
        <label
          className="text-gray-100 dark:text-gray-950 select-none"
          htmlFor={selectId}
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        value={value}
        onChange={onChange}
        className={`${sizeVariants[sizeVariant]} block w-full bg-gray-800 dark:bg-gray-600 rounded-md cursor-text border border-solid border-gray-500 dark:border-gray-800 placeholder:text-gray-100`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>

      {(error || hintText) && (
        <span className="text-gray-50 text-lg font-normal">
          {error || hintText}
        </span>
      )}
    </div>
  );
};
