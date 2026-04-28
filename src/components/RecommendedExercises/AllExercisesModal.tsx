import { Modal, Button, Card, ScrollShadow } from "@heroui/react";
import type { Plan } from "../../services/RecommendationExercises/types";
import AllExerciseCard from "./AllExerciseCard";

type Props = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  plans: Plan[];
};

const AllExercisesModal = ({ plans, isOpen, setIsOpen }: Props) => {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[800px] h-1000">
          <Modal.CloseTrigger />

          <Modal.Header>
            <p className="text-2xl text-black font-bold">Browse plans</p>
            <p className="text-gray-500">Browse available workout plans.</p>
          </Modal.Header>

          <Modal.Body>
            <ScrollShadow className="max-h-[90%] p-4 mt-6">
              <div className="space-y-4">
                {plans.map((plan) => (
                  <AllExerciseCard key={plan.plan_id} plan={plan} />
                ))}
              </div>
            </ScrollShadow>
          </Modal.Body>

          <Modal.Footer></Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};

export default AllExercisesModal;
