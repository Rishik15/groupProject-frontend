import { Button, Modal } from "@heroui/react";
import { UserRound } from "lucide-react";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onContinue: () => void;
};

export default function CoachClientInfoModal({
  isOpen,
  setIsOpen,
  onContinue,
}: Props) {
  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen} variant="blur">
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-107.5 rounded-2xl">
            <Modal.CloseTrigger />

            <Modal.Header>
              <div className="flex flex-col gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <UserRound className="h-6 w-6 text-indigo-600" />
                </div>

                <div>
                  <Modal.Heading className="text-xl font-bold text-black">
                    One more step
                  </Modal.Heading>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Your coach application was saved. We also need your basic
                    client profile info so your account can use the full
                    platform while your application is reviewed.
                  </p>
                </div>
              </div>
            </Modal.Header>

            <Modal.Footer>
              <Button
                onPress={onContinue}
                data-testid="Continue"
                className="rounded-xl bg-indigo-500 text-white"
              >
                Continue
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
