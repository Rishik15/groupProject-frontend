import { Button } from "@heroui/react";
import type { AdminWorkout } from "../../../../utils/Interfaces/Admin/adminWorkout";

interface WorkoutCardProps {
  workout: AdminWorkout;
  onEditMetadata: (workout: AdminWorkout) => void;
  onEditExercises: (workout: AdminWorkout) => void;
  onDelete: (workout: AdminWorkout) => void;
}

const WorkoutCard = ({
  workout,
  onEditMetadata,
  onEditExercises,
  onDelete,
}: WorkoutCardProps) => {
  const visibilityLabel = Number(workout.is_public) === 1 ? "Public" : "Private";

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-default-200 bg-default-50 p-5">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-default-900">
            {workout.plan_name || "Untitled workout"}
          </h3>
          <p className="mt-1 text-sm text-default-600">
            {workout.description || "No description provided."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-default-600">
          <span className="rounded-full border border-default-200 bg-white px-3 py-1">
            {visibilityLabel}
          </span>
          <span className="rounded-full border border-default-200 bg-white px-3 py-1">
            Plan #{workout.plan_id}
          </span>
          <span className="rounded-full border border-default-200 bg-white px-3 py-1">
            Author #{workout.author_user_id}
          </span>
          <span className="rounded-full border border-default-200 bg-white px-3 py-1">
            {workout.total_exercises ?? 0} exercise
            {(workout.total_exercises ?? 0) === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-default-200 pt-4">
        <Button className={"bg-[#5B5EF4]"} onPress={() => onEditMetadata(workout)}>Edit metadata</Button>
        <Button className={"bg-[#5B5EF4]"} onPress={() => onEditExercises(workout)}>Edit day 1</Button>
        <Button className={"bg-[#5B5EF4]"} onPress={() => onDelete(workout)}>Delete</Button>
      </div>
    </div>
  );
};

export default WorkoutCard;
