import { Button, Card } from "@heroui/react";
import { ClipboardPlus, Pencil, Trash2 } from "lucide-react";
import type { AdminExercise } from "../../../../utils/Interfaces/Admin/adminExercise";
import type { ExerciseFormState } from "../ExerciseManagementTab";

type ExerciseActionMode = "create" | "edit" | "delete" | null;

interface ExerciseActionPanelProps {
  selectedExercise: AdminExercise | null;
  actionMode: ExerciseActionMode;
  formState: ExerciseFormState;
  submitting: boolean;
  actionError: string | null;
  onFormChange: (updates: Partial<ExerciseFormState>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const getExercisePreviewSrc = (videoUrl: string) => {
  const trimmed = videoUrl.trim();

  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  return `/src/assets/gifs/${trimmed}`;
};

const getMediaType = (src: string | null): "image" | "video" | null => {
  if (!src) {
    return null;
  }

  const cleaned = src.split("?")[0].toLowerCase();

  if (
    cleaned.endsWith(".mp4") ||
    cleaned.endsWith(".mov") ||
    cleaned.endsWith(".webm") ||
    cleaned.endsWith(".ogg")
  ) {
    return "video";
  }

  if (
    cleaned.endsWith(".gif") ||
    cleaned.endsWith(".png") ||
    cleaned.endsWith(".jpg") ||
    cleaned.endsWith(".jpeg") ||
    cleaned.endsWith(".webp")
  ) {
    return "image";
  }

  return "image";
};

const ExerciseActionPanel = ({
  selectedExercise,
  actionMode,
  formState,
  submitting,
  actionError,
  onFormChange,
  onSubmit,
  onCancel,
}: ExerciseActionPanelProps) => {
  const title =
    actionMode === "create"
      ? "Create exercise"
      : actionMode === "edit"
        ? "Edit exercise"
        : actionMode === "delete"
          ? "Delete exercise"
          : "Action panel";

  const description =
    actionMode === "create"
      ? "Create a new exercise entry. Video URL is optional; if provided, moderation will still apply."
      : actionMode === "edit"
        ? "Update the current exercise metadata or swap the video URL for a new moderation pass."
        : actionMode === "delete"
          ? "Delete this exercise from the database. The backend will reject the action if the exercise is in use."
          : "Select Create, Edit, or Delete to load the exercise management form here.";

  const showForm = actionMode === "create" || actionMode === "edit";
  const showDelete = actionMode === "delete";
  const previewSrc = getExercisePreviewSrc(formState.video_url);
  const mediaType = getMediaType(previewSrc);

  return (
    <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
            Action panel
          </p>
          <p className="mt-1 text-sm text-default-600">{description}</p>
        </div>

        {actionMode ? (
          <>
            <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-default-800">
                {actionMode === "create" ? (
                  <ClipboardPlus className="h-4 w-4" />
                ) : actionMode === "edit" ? (
                  <Pencil className="h-4 w-4" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {title}
              </div>
              <p className="mt-2 text-sm text-default-600">
                {selectedExercise?.exercise_name ?? "New exercise draft"}
              </p>
            </div>

            {showForm ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-default-700"
                    htmlFor="exercise-name"
                  >
                    Exercise name
                  </label>
                  <input
                    id="exercise-name"
                    value={formState.exercise_name}
                    onChange={(event) =>
                      onFormChange({ exercise_name: event.target.value })
                    }
                    className="w-full rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
                    placeholder="Push Up"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-default-700"
                    htmlFor="exercise-equipment"
                  >
                    Equipment
                  </label>
                  <input
                    id="exercise-equipment"
                    value={formState.equipment}
                    onChange={(event) =>
                      onFormChange({ equipment: event.target.value })
                    }
                    className="w-full rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
                    placeholder="Bodyweight"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-default-700">
                    Video preview
                  </label>

                  {previewSrc ? (
                    <div className="max-w-sm overflow-hidden rounded-[16px] border border-default-200 bg-default-50">
                      <div className="aspect-video w-full">
                        {mediaType === "video" ? (
                          <video
                            src={previewSrc}
                            controls
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={previewSrc}
                            alt={formState.exercise_name || "Exercise preview"}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-video max-w-sm w-full flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-default-200 bg-default-50 text-center">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m10 8 6 4-6 4V8z" />
                      </svg>
                      <p className="text-xs text-default-500">
                        No video available for this exercise
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-default-700"
                    htmlFor="exercise-video-url"
                  >
                    Video URL
                  </label>
                  <input
                    id="exercise-video-url"
                    value={formState.video_url}
                    onChange={(event) =>
                      onFormChange({ video_url: event.target.value })
                    }
                    className="w-full rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
                    placeholder="/uploads/exercise_videos/..."
                  />
                </div>

                {actionMode === "create" ? (
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-default-700"
                      htmlFor="exercise-created-by"
                    >
                      Created by user id (optional)
                    </label>
                    <input
                      id="exercise-created-by"
                      value={formState.created_by}
                      onChange={(event) =>
                        onFormChange({ created_by: event.target.value })
                      }
                      className="w-full rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
                      placeholder="12"
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {showDelete && selectedExercise ? (
              <div className="rounded-[20px] border border-default-200 bg-default-50 p-4 text-sm text-default-600">
                <p>
                  You are about to delete{" "}
                  <span className="font-medium text-default-800">
                    {selectedExercise.exercise_name}
                  </span>
                  .
                </p>
                <p className="mt-2">
                  If the exercise is still in use, the backend will reject this
                  request.
                </p>
              </div>
            ) : null}

            {actionError ? (
              <div className="rounded-[18px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                {actionError}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-[#5B5EF4] text-white"
                onPress={onSubmit}
                isDisabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : actionMode === "delete"
                    ? "Confirm delete"
                    : "Confirm action"}
              </Button>

              <Button
                className="bg-[#5B5EF4] text-white"
                onPress={onCancel}
                isDisabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
            Select New Exercise, Edit, or Delete on a card to open the
            exercise management form.
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExerciseActionPanel;