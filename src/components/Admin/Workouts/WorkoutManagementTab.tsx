import { Button, Card } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getExercises } from "../../../services/Admin/adminExerciseService";
import {
  createWorkout,
  deleteWorkout,
  getWorkouts,
  updateWorkout,
  updateWorkoutExercises,
} from "../../../services/Admin/adminWorkoutService";
import type { AdminExercise } from "../../../utils/Interfaces/Admin/adminExercise";
import type {
  AdminWorkout,
  CreateWorkoutPayload,
  UpdateWorkoutExercisesPayload,
  UpdateWorkoutPayload,
} from "../../../utils/Interfaces/Admin/adminWorkout";
import WorkoutFilterBar, {
  type WorkoutVisibilityFilter,
} from "./Management/WorkoutFilterBar";
import WorkoutCard from "./Management/WorkoutCard";
import WorkoutActionPanel, {
  type WorkoutActionMode,
} from "./Management/WorkoutActionPanel";

const WorkoutManagementTab = () => {
  const [workouts, setWorkouts] = useState<AdminWorkout[]>([]);
  const [exerciseCatalog, setExerciseCatalog] = useState<AdminExercise[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [visibilityFilter, setVisibilityFilter] =
    useState<WorkoutVisibilityFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<AdminWorkout | null>(null);
  const [actionMode, setActionMode] = useState<WorkoutActionMode>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const actionIsOpen = Boolean(actionMode);

  const loadData = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const [workoutResponse, exerciseResponse] = await Promise.all([
        getWorkouts(signal),
        getExercises(signal),
      ]);

      setWorkouts(workoutResponse.workouts ?? []);
      setExerciseCatalog(exerciseResponse.exercises ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      setError(err instanceof Error ? err.message : "Failed to load workouts.");
      setWorkouts([]);
      setExerciseCatalog([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadData(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredWorkouts = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return workouts.filter((workout) => {
      const visibilityMatches =
        visibilityFilter === "all"
          ? true
          : visibilityFilter === "public"
            ? Number(workout.is_public) === 1
            : Number(workout.is_public) !== 1;

      const searchMatches =
        !query ||
        [
          workout.plan_name,
          workout.description,
          String(workout.plan_id),
          String(workout.author_user_id),
          Number(workout.is_public) === 1 ? "public" : "private",
        ].some((value) => value?.toLowerCase().includes(query));

      return visibilityMatches && searchMatches;
    });
  }, [searchValue, visibilityFilter, workouts]);

  const openCreate = () => {
    setSelectedWorkout(null);
    setActionMode("create");
    setActionError(null);
  };

  const openEditMetadata = (workout: AdminWorkout) => {
    setSelectedWorkout(workout);
    setActionMode("editMetadata");
    setActionError(null);
  };

  const openEditExercises = (workout: AdminWorkout) => {
    setSelectedWorkout(workout);
    setActionMode("editExercises");
    setActionError(null);
  };

  const openDelete = (workout: AdminWorkout) => {
    setSelectedWorkout(workout);
    setActionMode("delete");
    setActionError(null);
  };

  const closeAction = () => {
    setSelectedWorkout(null);
    setActionMode(null);
    setActionError(null);
  };

  const handleCreate = async (payload: CreateWorkoutPayload) => {
    setSubmitting(true);
    setActionError(null);

    try {
      const response = await createWorkout(payload);
      setWorkouts((current) => [response.workout, ...current]);
      closeAction();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Create failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateMetadata = async (payload: UpdateWorkoutPayload) => {
    setSubmitting(true);
    setActionError(null);

    try {
      const response = await updateWorkout(payload);
      setWorkouts((current) =>
        current.map((workout) =>
          workout.plan_id === response.workout.plan_id
            ? { ...workout, ...response.workout }
            : workout,
        ),
      );
      closeAction();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Metadata update failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateExercises = async (
    payload: UpdateWorkoutExercisesPayload,
  ) => {
    setSubmitting(true);
    setActionError(null);

    try {
      const response = await updateWorkoutExercises(payload);
      setWorkouts((current) =>
        current.map((workout) =>
          workout.plan_id === response.workout.plan_id
            ? {
              ...workout,
              ...response.workout,
              total_exercises: payload.exercises.length,
            }
            : workout,
        ),
      );
      closeAction();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Exercise update failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (planId: number) => {
    setSubmitting(true);
    setActionError(null);

    try {
      await deleteWorkout({ plan_id: planId });
      setWorkouts((current) => current.filter((workout) => workout.plan_id !== planId));
      closeAction();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
        <div className="p-6">
          <WorkoutFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            visibilityFilter={visibilityFilter}
            onVisibilityFilterChange={setVisibilityFilter}
            onOpenCreate={openCreate}
            onRefresh={() => void loadData()}
            isRefreshing={loading}
            visibleCount={filteredWorkouts.length}
            totalCount={workouts.length}
          />
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 p-6">
            <div>
              <p className="text-lg font-semibold text-default-900">
                Loading workouts
              </p>
              <p className="mt-1 text-sm text-default-600">
                Pulling workout plans and exercise options from the admin APIs.
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
                Unable to load workouts
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
                    Workout roster
                  </p>
                  <p className="mt-1 text-sm text-default-600">
                    {actionIsOpen
                      ? "The roster is temporarily hidden while you finish the selected workout action."
                      : "Use the action buttons on each card to edit metadata, edit day 1, or delete the workout."}
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
                    Roster paused for active workout editing
                  </p>
                  <p className="mt-2">
                    Finish or cancel the current action to return to the full workout list.
                  </p>
                </div>
              ) : filteredWorkouts.length === 0 ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  No workouts matched your current search and visibility filters.
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-2">
                  {filteredWorkouts.map((workout) => (
                    <WorkoutCard
                      key={workout.plan_id}
                      workout={workout}
                      onEditMetadata={openEditMetadata}
                      onEditExercises={openEditExercises}
                      onDelete={openDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          <WorkoutActionPanel
            actionMode={actionMode}
            selectedWorkout={selectedWorkout}
            exerciseCatalog={exerciseCatalog}
            submitting={submitting}
            actionError={actionError}
            onCancel={closeAction}
            onCreate={(payload) => void handleCreate(payload)}
            onUpdateMetadata={(payload) => void handleUpdateMetadata(payload)}
            onUpdateExercises={(payload) => void handleUpdateExercises(payload)}
            onDelete={(planId) => void handleDelete(planId)}
          />
        </div>
      )}
    </div>
  );
};

export default WorkoutManagementTab;
