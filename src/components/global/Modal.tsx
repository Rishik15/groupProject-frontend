import type { ReactNode } from "react";
import { Modal, Button } from "@heroui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const CustomModal = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-105 p-6">

            <Modal.Header className="flex flex-col items-start gap-3">
              <Modal.CloseTrigger />

              {title && (
                <Modal.Heading className="text-2xl font-semibold text-foreground">
                  {title}
                </Modal.Heading>
              )}

              <p className="text-md text-muted leading-relaxed">{children}</p>
            </Modal.Header>

            <Modal.Footer className="mt-6">
              <Button
                fullWidth
                size="lg"
                slot="close"
                className="bg-indigo-600 hover:bg-indigo-700 text-gray-200 font-semibold rounded-xl"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default CustomModal;
