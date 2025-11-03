import { useEffect, useCallback, type RefObject } from "react";

/**
 * Arguments for the useOutsideClick hook.
 */
type TUseOutsideClickArgs<T extends HTMLElement> = {
  /** Reference to the element to track clicks outside of */
  ref: RefObject<T | null>;
  /** Callback function to execute when clicking outside the element */
  onOutside: (event: MouseEvent | TouchEvent) => void;
  /** Whether the hook is active (defaults to true) */
  isActive?: boolean;
};

/**
 * Return type for the useOutsideClick hook.
 */
type TUseOutsideClick = {
  /** Reference to the tracked element */
  ref: RefObject<HTMLElement | null>;
};

/**
 * Custom hook for detecting clicks outside of a specified element.
 *
 * This hook attaches event listeners to the document to detect clicks outside
 * the referenced element. It supports both mouse and touch events for better
 * mobile compatibility. The hook automatically handles cleanup and can be
 * conditionally enabled/disabled.
 *
 * @param {TUseOutsideClickArgs} args - Configuration object for the hook
 * @param {RefObject<T>} args.ref - Reference to the element to track
 * @param {Function} args.onOutside - Callback executed when clicking outside
 * @param {boolean} [args.isActive=true] - Whether the hook is active
 * @returns {TUseOutsideClick} Object containing the element reference
 */
export const useOutsideClick = <T extends HTMLElement>({
  ref,
  onOutside,
  isActive = true,
}: TUseOutsideClickArgs<T>): TUseOutsideClick => {
  /**
   * Stable callback reference to prevent unnecessary effect re-runs.
   * Memoized to maintain referential equality across renders.
   */
  const stableCallback = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!ref.current) return;

      if (event.target instanceof Node && ref.current.contains(event.target)) {
        return;
      }

      onOutside(event);
    },
    [ref, onOutside]
  );

  useEffect(() => {
    if (!isActive) return;

    document.addEventListener("mousedown", stableCallback, { passive: true });
    document.addEventListener("touchstart", stableCallback, { passive: true });

    return () => {
      document.removeEventListener("mousedown", stableCallback);
      document.removeEventListener("touchstart", stableCallback);
    };
  }, [isActive, stableCallback]);

  return { ref };
};
