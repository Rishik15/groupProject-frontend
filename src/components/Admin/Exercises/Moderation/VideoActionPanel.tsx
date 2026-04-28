import { Button, Card } from "@heroui/react";
import { Check, Eraser, X } from "lucide-react";
import { ADMIN_API_BASE } from "../../../../utils/Admin/adminApi";
import type { AdminModeratedVideo } from "../../../../utils/Interfaces/Admin/adminVideoModeration";

type VideoActionMode = "approve" | "reject" | "remove" | null;

interface VideoActionPanelProps {
  selectedVideo: AdminModeratedVideo | null;
  actionMode: VideoActionMode;
  reviewNote: string;
  submitting: boolean;
  actionError: string | null;
  onReviewNoteChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const getBackendOrigin = () => {
  if (
    ADMIN_API_BASE.startsWith("http://") ||
    ADMIN_API_BASE.startsWith("https://")
  ) {
    return ADMIN_API_BASE.replace(/\/admin$/, "");
  }

  return "http://localhost:8080";
};

const getVideoSrc = (videoUrl: string | null) => {
  if (!videoUrl) return null;
  if (videoUrl.startsWith("http://") || videoUrl.startsWith("https://"))
    return videoUrl;
  return `${getBackendOrigin()}${videoUrl.startsWith("/") ? videoUrl : `/${videoUrl}`}`;
};

const VideoActionPanel = ({
  selectedVideo,
  actionMode,
  reviewNote,
  submitting,
  actionError,
  onReviewNoteChange,
  onSubmit,
  onCancel,
}: VideoActionPanelProps) => {
  const title =
    actionMode === "approve"
      ? "Approve video"
      : actionMode === "reject"
        ? "Reject video"
        : actionMode === "remove"
          ? "Remove video"
          : "Action panel";

  const description =
    actionMode === "approve"
      ? "Approve this pending exercise clip and remove it from the moderation queue."
      : actionMode === "reject"
        ? "Reject this clip with a required review note explaining the issue."
        : actionMode === "remove"
          ? "Remove the current clip from the exercise and mark the moderation result accordingly."
          : "Select Approve, Reject, or Remove on a card to open the video moderation panel here.";

  const previewSrc = getVideoSrc(selectedVideo?.video_url ?? null);

  return (
    <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
            Action panel
          </p>
          <p className="mt-1 text-sm text-default-600">{description}</p>
        </div>

        {actionMode && selectedVideo ? (
          <>
            <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-default-800">
                {actionMode === "approve" ? (
                  <Check className="h-4 w-4" />
                ) : actionMode === "reject" ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Eraser className="h-4 w-4" />
                )}
                {title}
              </div>
              <p className="mt-2 text-sm text-default-600">
                {selectedVideo.exercise_name}
              </p>
              <p className="mt-1 text-sm text-default-600">
                Creator ID: {selectedVideo.created_by}
              </p>
            </div>

            <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
              {previewSrc ? (
                <video
                  key={previewSrc}
                  controls
                  className="w-full rounded-[16px] border border-default-200 bg-black"
                  src={previewSrc}
                />
              ) : (
                <div className="rounded-[16px] border border-dashed border-default-300 bg-white px-4 py-8 text-center text-sm text-default-500">
                  No video preview available for this exercise.
                </div>
              )}
            </div>

            {actionMode === "reject" ? (
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-default-700"
                  htmlFor="video-review-note"
                >
                  Review note
                </label>
                <textarea
                  id="video-review-note"
                  value={reviewNote}
                  onChange={(event) => onReviewNoteChange(event.target.value)}
                  rows={5}
                  className="w-full rounded-[18px] border border-default-200 px-4 py-3 text-sm outline-none transition focus:border-default-400"
                  placeholder="Explain why the clip is being rejected"
                />
              </div>
            ) : null}

            {actionError ? (
              <div className="rounded-[18px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                {actionError}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button
                className={"bg-[#5B5EF4]"}
                onPress={onSubmit}
                isDisabled={submitting}
              >
                {submitting ? "Saving..." : "Confirm action"}
              </Button>
              <Button
                className={"bg-[#5B5EF4]"}
                onPress={onCancel}
                isDisabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
            Select Approve, Reject, or Remove on a card to open the moderation
            panel.
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoActionPanel;
