import type { ReactNode } from "react";
import { Button, Modal } from "@heroui/react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  buttonText?: string;
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  children,
  buttonText = "Close",
}: ModalProps) {
  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        className="bg-black/40 backdrop-blur-sm"
      >
        <Modal.Container>
          <Modal.Dialog className="relative w-full sm:max-w-105 rounded-3xl border border-[#E6E6EE] bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F7FB] text-[#72728A] transition-colors hover:bg-[#ECECFA] hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>

            <Modal.Header className="flex flex-col items-start gap-2 pr-10">
              {title ? (
                <Modal.Heading className="text-xl font-semibold text-black">
                  {title}
                </Modal.Heading>
              ) : null}
            </Modal.Header>

            <Modal.Body className="mt-2">
              <div className="text-sm leading-6 text-[#72728A]">{children}</div>
            </Modal.Body>

            <Modal.Footer className="mt-6">
              <Button
                fullWidth
                size="lg"
                slot="close"
                onPress={onClose}
                className="rounded-xl bg-[#5B5EF4] font-semibold text-white hover:bg-[#4B4EE4]"
              >
                {buttonText}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
