import { useCallback, useState, type Dispatch, type SetStateAction } from "react";

/**
 * Return type for the useBoolean hook.
 * Provides boolean state management with convenient setter methods.
 */
type TUseBoolean = {
  /** Current boolean value */
  value: boolean;
  /** Direct setter function for the boolean value */
  setValue: Dispatch<SetStateAction<boolean>>;
  /** Sets the boolean value to true */
  setTrue: () => void;
  /** Sets the boolean value to false */
  setFalse: () => void;
  /** Toggles the boolean value */
  toggle: () => void;
};

/**
 * Custom hook for managing boolean state with convenient setter methods.
 * 
 * This hook provides a boolean state with additional helper methods to set true,
 * set false, and toggle the value. All returned functions are memoized with useCallback
 * to prevent unnecessary re-renders in consuming components.
 * 
 * @param {boolean} [defaultValue] - Initial boolean value (defaults to false)
 * @returns {TUseBoolean} Object containing the boolean value and setter methods
 */
export const useBoolean = (defaultValue?: boolean): TUseBoolean => {
  const [value, setValue] = useState(!!defaultValue);

  /**
   * Sets the boolean value to true.
   * Memoized to prevent unnecessary re-renders.
   */
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  /**
   * Sets the boolean value to false.
   * Memoized to prevent unnecessary re-renders.
   */
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  /**
   * Toggles the boolean value between true and false.
   * Memoized to prevent unnecessary re-renders.
   */
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return { value, setValue, setTrue, setFalse, toggle };
};
