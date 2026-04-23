import { Button, Card } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createExercise,
  deleteExercise,
  getExercises,
  updateExercise,
} from "../../../services/Admin/adminExerciseService";
import { formatVideoStatusLabel } from "../../../utils/Admin/adminFormatters";
import type { AdminExercise } from "../../../utils/Interfaces/Admin/adminExercise";
import ExerciseActionPanel from "./Management/ExerciseActionPanel";
import ExerciseCard from "./Management/ExerciseCard";
import ExerciseFilterBar from "./Management/ExerciseFilterBar";

type ExerciseActionMode = "create" | "edit" | "delete" | null;

export type ExerciseFormState = {
  exercise_name: string;
  equipment: string;
  video_url: string;
  created_by: string;
};

const EMPTY_FORM: ExerciseFormState = {
  exercise_name: "",
  equipment: "",
  video_url: "",
  created_by: "",
};

const ExerciseManagementTab = () => {
  const [exercises, setExercises] = useState<AdminExercise[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedExercise, setSelectedExercise] = useState<AdminExercise | null>(null);
  const [actionMode, setActionMode] = useState<ExerciseActionMode>(null);
  const [formState, setFormState] = useState<ExerciseFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const actionIsOpen = Boolean(actionMode);

  const loadExercises = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getExercises(signal);
      setExercises(response.exercises ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      setError(err instanceof Error ? err.message : "Failed to load exercises.");
      setExercises([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadExercises(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredExercises = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return exercises;

    return exercises.filter((exercise) => {
      const values = [
        exercise.exercise_name,
        exercise.equipment,
        exercise.video_status,
        exercise.video_review_note,
        String(exercise.created_by),
      ];

      return values.some((value) => value?.toLowerCase().includes(query));
    });
  }, [exercises, searchValue]);

  const openCreate = () => {
    setSelectedExercise(null);
    setActionMode("create");
    setFormState(EMPTY_FORM);
    setActionError(null);
  };

  const openEdit = (exercise: AdminExercise) => {
    setSelectedExercise(exercise);
    setActionMode("edit");
    setFormState({
      exercise_name: exercise.exercise_name ?? "",
      equipment: exercise.equipment ?? "",
      video_url: exercise.video_url ?? "",
      created_by: String(exercise.created_by ?? ""),
    });
    setActionError(null);
  };

  const openDelete = (exercise: AdminExercise) => {
    setSelectedExercise(exercise);
    setActionMode("delete");
    setFormState({
      exercise_name: exercise.exercise_name ?? "",
      equipment: exercise.equipment ?? "",
      video_url: exercise.video_url ?? "",
      created_by: String(exercise.created_by ?? ""),
    });
    setActionError(null);
  };

  const closeAction = () => {
    setSelectedExercise(null);
    setActionMode(null);
    setFormState(EMPTY_FORM);
    setActionError(null);
  };

  const submitAction = async () => {
    if (!actionMode) return;

    if ((actionMode === "create" || actionMode === "edit") && !formState.exercise_name.trim()) {
      setActionError("Exercise name is required.");
      return;
    }

    if (actionMode === "delete" && !selectedExercise) {
      setActionError("Select an exercise before deleting.");
      return;
    }

    setSubmitting(true);
    setActionError(null);

    try {
      if (actionMode === "create") {
        const response = await createExercise({
          exercise_name: formState.exercise_name.trim(),
          equipment: formState.equipment.trim() || null,
          video_url: formState.video_url.trim() || null,
          created_by: formState.created_by.trim()
            ? Number(formState.created_by.trim())
            : undefined,
        });

        setExercises((current) => [response.exercise, ...current]);
      }

      if (actionMode === "edit" && selectedExercise) {
        const response = await updateExercise({
          exercise_id: selectedExercise.exercise_id,
          exercise_name: formState.exercise_name.trim() || undefined,
          equipment: formState.equipment.trim() || null,
          video_url: formState.video_url.trim() || null,
        });

        setExercises((current) =>
          current.map((exercise) =>
            exercise.exercise_id === response.exercise.exercise_id
              ? response.exercise
              : exercise,
          ),
        );
      }

      if (actionMode === "delete" && selectedExercise) {
        await deleteExercise({
          exercise_id: selectedExercise.exercise_id,
        });

        setExercises((current) =>
          current.filter(
            (exercise) => exercise.exercise_id !== selectedExercise.exercise_id,
          ),
        );
      }

      closeAction();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
        <div className="p-6">
          <ExerciseFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onRefresh={() => void loadExercises()}
            onCreate={openCreate}
            isRefreshing={loading}
            visibleCount={filteredExercises.length}
            totalCount={exercises.length}
          />
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 p-6">
            <div>
              <p className="text-lg font-semibold text-default-900">Loading exercises</p>
              <p className="mt-1 text-sm text-default-600">
                Pulling the latest exercise database for admin management.
              </p>
            </div>
            <RefreshCw className="h-5 w-5 animate-spin text-default-500" />
          </div>
        </Card>
      ) : error ? (
        <Card className="rounded-[24px] border border-danger/20 bg-white shadow-sm">
          <div className="flex items-start gap-3 p-6">
            <div className="rounded-full bg-danger/10 p-2 text-danger">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-default-900">
                Unable to load exercises
              </p>
              <p className="mt-1 text-sm text-default-600">{error}</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
          <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                    Exercise roster
                  </p>
                  <p className="mt-1 text-sm text-default-600">
                    {actionIsOpen
                      ? "The roster is temporarily hidden while you finish the selected exercise action."
                      : `${filteredExercises.length} of ${exercises.length} exercise${exercises.length === 1 ? "" : "s"} shown.`}
                  </p>
                </div>

                {actionIsOpen ? (
                  <Button className={"bg-[#5B5EF4]"} onPress={closeAction} isDisabled={submitting}>
                    Back to roster
                  </Button>
                ) : null}
              </div>

              {actionIsOpen ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  <p className="font-medium text-default-800">
                    Roster paused for active exercise management
                  </p>
                  <p className="mt-2">
                    Finish or cancel the current action on{" "}
                    <span className="font-medium text-default-800">
                      {selectedExercise?.exercise_name ?? "new exercise draft"}
                    </span>{" "}
                    to return to the full exercise list.
                  </p>
                </div>
              ) : filteredExercises.length === 0 ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  No exercises matched your current search.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredExercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.exercise_id}
                      exercise={exercise}
                      statusLabel={formatVideoStatusLabel(exercise.video_status)}
                      onEdit={openEdit}
                      onDelete={openDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          <ExerciseActionPanel
            selectedExercise={selectedExercise}
            actionMode={actionMode}
            formState={formState}
            submitting={submitting}
            actionError={actionError}
            onFormChange={(updates) =>
              setFormState((current) => ({ ...current, ...updates }))
            }
            onSubmit={() => void submitAction()}
            onCancel={closeAction}
          />
        </div>
      )}
    </div>
  );
};

export default ExerciseManagementTab;
