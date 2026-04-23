import { Button, Card } from "@heroui/react";
import { PlusCircle, PencilLine, Rows3, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AdminExercise } from "../../../../utils/Interfaces/Admin/adminExercise";
import type {
  AdminWorkout,
  CreateWorkoutPayload,
  UpdateWorkoutExercisesPayload,
  UpdateWorkoutPayload,
} from "../../../../utils/Interfaces/Admin/adminWorkout";

export type WorkoutActionMode =
  | "create"
  | "editMetadata"
  | "editExercises"
  | "delete"
  | null;

export interface WorkoutExerciseDraft {
  rowId: string;
  exercise_id: string;
  sets: string;
  reps: string;
}

interface WorkoutActionPanelProps {
  actionMode: WorkoutActionMode;
  selectedWorkout: AdminWorkout | null;
  exerciseCatalog: AdminExercise[];
  submitting: boolean;
  actionError: string | null;
  onCancel: () => void;
  onCreate: (payload: CreateWorkoutPayload) => void;
  onUpdateMetadata: (payload: UpdateWorkoutPayload) => void;
  onUpdateExercises: (payload: UpdateWorkoutExercisesPayload) => void;
  onDelete: (planId: number) => void;
}

const createDraft = (): WorkoutExerciseDraft => ({
  rowId: crypto.randomUUID(),
  exercise_id: "",
  sets: "",
  reps: "",
});

const WorkoutActionPanel = ({
  actionMode,
  selectedWorkout,
  exerciseCatalog,
  submitting,
  actionError,
  onCancel,
  onCreate,
  onUpdateMetadata,
  onUpdateExercises,
  onDelete,
}: WorkoutActionPanelProps) => {
  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [isPublic, setIsPublic] = useState("0");
  const [exerciseDrafts, setExerciseDrafts] = useState<WorkoutExerciseDraft[]>([
    createDraft(),
  ]);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (actionMode === "create") {
      setPlanName("");
      setDescription("");
      setAuthorUserId("");
      setIsPublic("0");
      setExerciseDrafts([createDraft()]);
      setLocalError(null);
      return;
    }

    if (selectedWorkout) {
      setPlanName(selectedWorkout.plan_name ?? "");
      setDescription(selectedWorkout.description ?? "");
      setAuthorUserId(String(selectedWorkout.author_user_id ?? ""));
      setIsPublic(String(selectedWorkout.is_public ?? 0));
      setExerciseDrafts([createDraft()]);
      setLocalError(null);
    }
  }, [actionMode, selectedWorkout]);

  const title = useMemo(() => {
    switch (actionMode) {
      case "create":
        return "Create workout";
      case "editMetadata":
        return "Edit metadata";
      case "editExercises":
        return "Edit day 1 exercises";
      case "delete":
        return "Delete workout";
      default:
        return "Action panel";
    }
  }, [actionMode]);

  const icon = useMemo(() => {
    switch (actionMode) {
      case "create":
        return <PlusCircle className="h-4 w-4" />;
      case "editMetadata":
        return <PencilLine className="h-4 w-4" />;
      case "editExercises":
        return <Rows3 className="h-4 w-4" />;
      case "delete":
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Rows3 className="h-4 w-4" />;
    }
  }, [actionMode]);

  const updateDraft = (
    rowId: string,
    field: keyof Omit<WorkoutExerciseDraft, "rowId">,
    value: string,
  ) => {
    setExerciseDrafts((current) =>
      current.map((draft) =>
        draft.rowId === rowId ? { ...draft, [field]: value } : draft,
      ),
    );
  };

  const addDraftRow = () => {
    setExerciseDrafts((current) => [...current, createDraft()]);
  };

  const removeDraftRow = (rowId: string) => {
    setExerciseDrafts((current) =>
      current.length === 1
        ? [createDraft()]
        : current.filter((draft) => draft.rowId !== rowId),
    );
  };

  const buildExercises = () => {
    const normalized = exerciseDrafts
      .filter((draft) => draft.exercise_id)
      .map((draft) => ({
        exercise_id: Number(draft.exercise_id),
        sets: draft.sets ? Number(draft.sets) : null,
        reps: draft.reps ? Number(draft.reps) : null,
      }));

    if (normalized.some((entry) => Number.isNaN(entry.exercise_id))) {
      throw new Error("Every exercise row must select a valid exercise.");
    }

    if (
      normalized.some(
        (entry) =>
          (entry.sets !== null && Number.isNaN(entry.sets)) ||
          (entry.reps !== null && Number.isNaN(entry.reps)),
      )
    ) {
      throw new Error("Sets and reps must be valid numbers when provided.");
    }

    return normalized;
  };

  const handleSubmit = () => {
    setLocalError(null);

    try {
      if (actionMode === "create") {
        if (!planName.trim()) {
          throw new Error("Plan name is required.");
        }

        if (!authorUserId.trim()) {
          throw new Error("Author user id is required.");
        }

        onCreate({
          plan_name: planName.trim(),
          description: description.trim() || null,
          author_user_id: Number(authorUserId),
          is_public: Number(isPublic),
          exercises: buildExercises(),
        });
        return;
      }

      if (actionMode === "editMetadata" && selectedWorkout) {
        if (!planName.trim()) {
          throw new Error("Plan name is required.");
        }

        onUpdateMetadata({
          plan_id: selectedWorkout.plan_id,
          plan_name: planName.trim(),
          description: description.trim() || null,
          is_public: Number(isPublic),
        });
        return;
      }

      if (actionMode === "editExercises" && selectedWorkout) {
        onUpdateExercises({
          plan_id: selectedWorkout.plan_id,
          exercises: buildExercises(),
        });
        return;
      }

      if (actionMode === "delete" && selectedWorkout) {
        onDelete(selectedWorkout.plan_id);
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Action failed.");
    }
  };

  return (
    <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
            Action panel
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium text-default-800">
            {icon}
            {title}
          </div>
          <p className="mt-2 text-sm text-default-600">
            {actionMode === "editExercises"
              ? "This editor currently updates only the first day of the workout because that is the backend behavior available now."
              : "Select an action from the roster or create a new workout to load the form here."}
          </p>
        </div>

        {selectedWorkout ? (
          <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
            <p className="text-sm font-semibold text-default-900">
              {selectedWorkout.plan_name || "Untitled workout"}
            </p>
            <p className="mt-1 text-sm text-default-600">
              Plan #{selectedWorkout.plan_id} · Author #{selectedWorkout.author_user_id}
            </p>
          </div>
        ) : null}

        {actionMode === null ? (
          <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
            Select Create workout, Edit metadata, Edit day 1, or Delete to open a workflow here.
          </div>
        ) : null}

        {(actionMode === "create" || actionMode === "editMetadata") ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-default-700" htmlFor="workout-plan-name">
                Plan name
              </label>
              <input
                id="workout-plan-name"
                value={planName}
                onChange={(event) => setPlanName(event.target.value)}
                className="w-full rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-default-700" htmlFor="workout-description">
                Description
              </label>
              <textarea
                id="workout-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded-[18px] border border-default-200 px-4 py-3 text-sm outline-none transition focus:border-default-400"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {actionMode === "create" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-default-700" htmlFor="workout-author-id">
                    Author user id
                  </label>
                  <input
                    id="workout-author-id"
                    value={authorUserId}
                    onChange={(event) => setAuthorUserId(event.target.value)}
                    className="w-full rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-medium text-default-700" htmlFor="workout-visibility">
                  Visibility
                </label>
                <select
                  id="workout-visibility"
                  value={isPublic}
                  onChange={(event) => setIsPublic(event.target.value)}
                  className="w-full rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
                >
                  <option value="0">Private</option>
                  <option value="1">Public</option>
                </select>
              </div>
            </div>
          </div>
        ) : null}

        {(actionMode === "create" || actionMode === "editExercises") ? (
          <div className="space-y-4 rounded-[20px] border border-default-200 bg-default-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-default-900">Day 1 exercises</p>
                <p className="mt-1 text-xs text-default-500">
                  Add one or more exercise rows. Sets and reps are optional.
                </p>
              </div>
              <Button className={"bg-[#5B5EF4]"} onPress={addDraftRow}>Add row</Button>
            </div>

            <div className="space-y-3">
              {exerciseDrafts.map((draft, index) => (
                <div
                  key={draft.rowId}
                  className="grid gap-3 rounded-[18px] border border-default-200 bg-white p-3 md:grid-cols-[1.6fr_0.7fr_0.7fr_auto]"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-default-600">
                      Exercise {index + 1}
                    </label>
                    <select
                      value={draft.exercise_id}
                      onChange={(event) =>
                        updateDraft(draft.rowId, "exercise_id", event.target.value)
                      }
                      className="w-full rounded-[14px] border border-default-200 px-3 py-2 text-sm outline-none transition focus:border-default-400"
                    >
                      <option value="">Select exercise</option>
                      {exerciseCatalog.map((exercise) => (
                        <option key={exercise.exercise_id} value={exercise.exercise_id}>
                          {exercise.exercise_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-default-600">Sets</label>
                    <input
                      value={draft.sets}
                      onChange={(event) =>
                        updateDraft(draft.rowId, "sets", event.target.value)
                      }
                      className="w-full rounded-[14px] border border-default-200 px-3 py-2 text-sm outline-none transition focus:border-default-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-default-600">Reps</label>
                    <input
                      value={draft.reps}
                      onChange={(event) =>
                        updateDraft(draft.rowId, "reps", event.target.value)
                      }
                      className="w-full rounded-[14px] border border-default-200 px-3 py-2 text-sm outline-none transition focus:border-default-400"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button className={"bg-[#5B5EF4]"} onPress={() => removeDraftRow(draft.rowId)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {actionMode === "delete" ? (
          <div className="rounded-[20px] border border-danger/20 bg-danger/5 p-4 text-sm text-default-700">
            Delete this workout plan and its current workout-day structure. This cannot be undone.
          </div>
        ) : null}

        {localError || actionError ? (
          <div className="rounded-[18px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            {localError || actionError}
          </div>
        ) : null}

        {actionMode !== null ? (
          <div className="flex flex-wrap gap-2">
            <Button className={"bg-[#5B5EF4]"} onPress={handleSubmit} isDisabled={submitting}>
              {submitting ? "Saving..." : "Confirm action"}
            </Button>
            <Button className={"bg-[#5B5EF4]"} onPress={onCancel} isDisabled={submitting}>
              Cancel
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default WorkoutActionPanel;
