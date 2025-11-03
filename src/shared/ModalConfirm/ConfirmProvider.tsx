import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { ModalConfirm } from "./ModalConfirm";
import { Nullable } from "_types/index";

type ConfirmPayload = {
  title?: string;
  subtitle?: string;
  confirmLabel?: string;
  rejectLabel?: string;
  onConfirm: () => void;
  onReject?: () => void;
};

type ConfirmContextType = {
  showConfirm: (payload: ConfirmPayload) => void;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [modalData, setModalData] = useState<Nullable<ConfirmPayload>>(null);

  const showConfirm = useCallback((payload: ConfirmPayload) => {
    setModalData(payload);
  }, []);

  const handleConfirm = () => {
    modalData?.onConfirm?.();
    setModalData(null);
  };

  const handleCancel = () => {
    modalData?.onReject?.();
    setModalData(null);
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}

      {modalData && (
        <ModalConfirm
          title={modalData?.title}
          subtitle={modalData?.subtitle}
          confirmLabel={modalData?.confirmLabel}
          rejectLabel={modalData?.rejectLabel}
          onConfirm={handleConfirm}
          onReject={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
};
