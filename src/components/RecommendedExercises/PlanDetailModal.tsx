import { Modal, Button, ScrollShadow, Card } from "@heroui/react";
import type { ExerciseResponse } from "./ExerciseCard";
import { useState } from "react";
import assign_plan from "../../services/RecommendationExercises/assignPlan";
type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseData: ExerciseResponse | null;
  planName: string;
  plan_id: number;
  goal: string;
  level: string;
  days: string;
  duration: string;
};

const PlanDetailModal = ({
  isOpen,
  onOpenChange,
  exerciseData,
  planName,
  plan_id,
  goal,
  level,
  days,
  duration,
}: Props) => {
  const grouped: Record<
    number,
    {
      dayLabel: string;
      exercises: ExerciseResponse["exercises"];
    }
  > = {};

  exerciseData?.exercises.forEach((ex) => {
    if (!grouped[ex.day_order]) {
      grouped[ex.day_order] = {
        dayLabel: ex.day_label,
        exercises: [],
      };
    }

    grouped[ex.day_order].exercises.push(ex);
  });
  const handleAssign = async () => {
    try {
      await assign_plan(plan_id);
      setSubmit(true);
    } catch (err) {
      console.error("Failed to assign plan:", err);
    }
  };

  const groupedDays = Object.entries(grouped)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([dayOrder, value]) => ({
      dayOrder: Number(dayOrder),
      dayLabel: value.dayLabel,
      exercises: value.exercises.sort(
        (a, b) => a.order_in_workout - b.order_in_workout,
      ),
    }));
  const [submit, setSubmit] = useState(false);

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container>
          <Modal.Dialog className="max-w-2xl">
            <Modal.Header>
              <div>
                <Modal.Heading className="font-bold text-2xl">
                  {planName}
                </Modal.Heading>
                <p className="mt-1 text-sm text-gray-500">
                  Quick look at the plan before assigning it.
                </p>
              </div>
            </Modal.Header>

            <Modal.Body className="mt-5">
              <ScrollShadow className="max-h-[420px] pr-2">
                <div className="space-y-4">
                  <Card className="rounded-2xl border border-gray-200 p-4 shadow-none">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-gray-500">Goal</p>
                        <p className="font-semibold text-gray-900">{goal}</p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-gray-500">Level</p>
                        <p className="font-semibold text-gray-900">{level}</p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-gray-500">Schedule</p>
                        <p className="font-semibold text-gray-900">{days}</p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-gray-500">Duration</p>
                        <p className="font-semibold text-gray-900">
                          {duration}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {groupedDays.map((day) => (
                    <Card
                      key={day.dayOrder}
                      className="rounded-2xl border border-gray-200 p-4 shadow-none"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {day.dayLabel}
                          </p>
                          <p className="text-sm text-gray-500">
                            {day.exercises.length} exercise
                            {day.exercises.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {day.exercises.map((ex) => (
                          <div
                            key={`${day.dayOrder}-${ex.order_in_workout}-${ex.exercise_name}`}
                            className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {ex.order_in_workout}. {ex.exercise_name}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {ex.equipment}
                              </p>
                            </div>

                            <div className="shrink-0 text-sm font-semibold text-gray-700">
                              {ex.sets_goal} × {ex.reps_goal}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollShadow>
            </Modal.Body>

            <Modal.Footer>
              <Button
                className="h-11 rounded-xl border-2 border-gray-300 bg-white font-bold text-black"
                onPress={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                className={`${
                  submit
                    ? "h-11 rounded-xl border-green-500 bg-[#E4FBF0] text-[#5E8F7E]"
                    : "h-11 rounded-xl bg-indigo-500 font-bold text-white"
                }`}
                onPress={handleAssign}
              >
                {submit ? "Assigned" : "Assign Plan"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PlanDetailModal;
