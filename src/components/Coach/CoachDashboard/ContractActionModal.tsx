import { Button, Modal } from "@heroui/react";
import { AlertTriangle, Check, X } from "lucide-react";

type ContractActionType = "accept" | "terminate";

interface ContractActionModalProps {
  isOpen: boolean;
  actionType: ContractActionType;
  clientName?: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ContractActionModal({
  isOpen,
  actionType,
  clientName,
  isLoading = false,
  onClose,
  onConfirm,
}: ContractActionModalProps) {
  const isAccept = actionType === "accept";

  const title = isAccept ? "Accept contract?" : "Terminate contract?";

  const description = isAccept
    ? `Are you sure you want to accept this contract${
        clientName ? ` from ${clientName}` : ""
      }? The client will be moved to your active contracts.`
    : `Are you sure you want to terminate this contract${
        clientName ? ` with ${clientName}` : ""
      }? This will move the contract to history and the client will no longer be active under you.`;

  const confirmText = isAccept ? "Accept Contract" : "Terminate Contract";
  const loadingText = isAccept ? "Accepting..." : "Terminating...";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          onClose();
        }
      }}
    >
      <Modal.Backdrop className="bg-black/40 backdrop-blur-sm">
        <Modal.Container>
          <Modal.Dialog className="relative w-full max-w-md rounded-3xl border border-[#E6E6EE] bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F7FB] text-[#72728A] transition-colors hover:bg-[#ECECFA] hover:text-black disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>

            <Modal.Header className="flex flex-col items-start gap-4 pr-10">
              <div
                className={
                  isAccept
                    ? "flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600"
                    : "flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600"
                }
              >
                {isAccept ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
              </div>

              <div>
                <Modal.Heading className="text-xl font-semibold text-black">
                  {title}
                </Modal.Heading>

                <p className="mt-2 text-sm leading-6 text-[#72728A]">
                  {description}
                </p>
              </div>
            </Modal.Header>

            <Modal.Footer className="mt-6">
              <div className="flex w-full gap-3">
                <Button
                  fullWidth
                  size="lg"
                  variant="ghost"
                  onPress={onClose}
                  isDisabled={isLoading}
                  className="rounded-xl border border-gray-200 bg-white font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>

                <Button
                  fullWidth
                  size="lg"
                  onPress={onConfirm}
                  isDisabled={isLoading}
                  className={
                    isAccept
                      ? "rounded-xl bg-green-500 font-semibold text-white hover:bg-green-600"
                      : "rounded-xl bg-red-500 font-semibold text-white hover:bg-red-600"
                  }
                >
                  {isLoading ? loadingText : confirmText}
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
