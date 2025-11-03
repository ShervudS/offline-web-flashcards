import { useEffect } from "react";
import { createPortal } from "react-dom";

import { Button } from "_shared/Button";

interface IModalConfirm {
  title?: string;
  subtitle?: string;
  confirmLabel?: string;
  rejectLabel?: string;
  onConfirm: () => void;
  onReject: () => void;
}

export const ModalConfirm = ({
  title = "Подтверждение",
  subtitle = "Вы уверены?",
  confirmLabel = "Да",
  rejectLabel = "Отмена",
  onConfirm,
  onReject,
}: IModalConfirm) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onReject();
    };
    document.addEventListener("keydown", handleEsc);

    return () => document.removeEventListener("keydown", handleEsc);
  }, [onReject]);

  return createPortal(
    <div
      onClick={onReject}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="mt-2 text-gray-600">{subtitle}</p>

        <div className="mt-4 flex justify-between">
          <Button onClick={onReject}>{rejectLabel}</Button>

          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
