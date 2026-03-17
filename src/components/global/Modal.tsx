import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="p-8 space-y-5">
          {title && (
            <p className="font-primary text-[24px] font-semibold text-red-500">
              {title}
            </p>
          )}

          <p className="text-black font-primary text-[16px]">{children}</p>
        </div>

        <div className="flex justify-end px-8 pb-6">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
