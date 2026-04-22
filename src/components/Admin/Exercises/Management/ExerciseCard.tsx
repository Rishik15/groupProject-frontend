import { Button } from "@heroui/react";
import { Pencil, Trash2 } from "lucide-react";
import { formatBooleanLabel } from "../../../../utils/Admin/adminFormatters";
import type { AdminExercise } from "../../../../utils/Interfaces/Admin/adminExercise";

interface ExerciseCardProps {
  exercise: AdminExercise;
  statusLabel: string;
  onEdit: (exercise: AdminExercise) => void;
  onDelete: (exercise: AdminExercise) => void;
}

const ExerciseCard = ({ exercise, statusLabel, onEdit, onDelete }: ExerciseCardProps) => {
  return (
    <div className="flex h-full flex-col rounded-[20px] border border-default-200 bg-default-50 p-5">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-default-900">
            {exercise.exercise_name}
          </h3>
          <p className="mt-1 text-sm text-default-600">
            Equipment: {exercise.equipment ?? "—"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-default-600">
          <span className="rounded-full border border-default-200 bg-white px-3 py-1">
            Status: {statusLabel}
          </span>
          <span className="rounded-full border border-default-200 bg-white px-3 py-1">
            Creator ID: {exercise.created_by}
          </span>
          <span className="rounded-full border border-default-200 bg-white px-3 py-1">
            Has video: {formatBooleanLabel(Boolean(exercise.video_url))}
          </span>
        </div>

        <div className="space-y-1 text-sm text-default-600">
          <p>
            <span className="font-medium text-default-800">Review note:</span>{" "}
            {exercise.video_review_note ?? "—"}
          </p>
          <p className="break-all">
            <span className="font-medium text-default-800">Video URL:</span>{" "}
            {exercise.video_url ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-default-200 pt-4">
        <Button className={"bg-[#5B5EF4]"} onPress={() => onEdit(exercise)}>
          <span className="inline-flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </span>
        </Button>

        <Button className={"bg-[#5B5EF4]"} onPress={() => onDelete(exercise)}>
          <span className="inline-flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ExerciseCard;
