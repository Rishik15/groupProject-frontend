import { Button, Modal } from "@heroui/react";
import { Repeat2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export default function CoachModeIntroModal({ isOpen, setIsOpen }: Props) {
  const closeModal = () => {
    sessionStorage.removeItem("showCoachModeIntro");
    setIsOpen(false);
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen} variant="blur">
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-107.5 rounded-2xl">
            <Modal.CloseTrigger />

            <Modal.Header>
              <div className="flex flex-col gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <Repeat2 className="h-6 w-6 text-indigo-600" />
                </div>

                <div>
                  <Modal.Heading className="text-xl font-bold text-black">
                    You are now in coach mode
                  </Modal.Heading>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    You can switch back to client mode anytime by clicking your
                    avatar in the navbar and selecting Switch Role.
                  </p>
                </div>
              </div>
            </Modal.Header>

            <Modal.Footer>
              <Button
                onPress={closeModal}
                className="rounded-xl bg-indigo-500 text-white"
              >
                Got it
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
