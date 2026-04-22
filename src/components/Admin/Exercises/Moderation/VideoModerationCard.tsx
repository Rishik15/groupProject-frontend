import { Button } from "@heroui/react";
import { Check, Eraser, X } from "lucide-react";
import type { AdminModeratedVideo } from "../../../../utils/Interfaces/Admin/adminVideoModeration";

interface VideoModerationCardProps {
  video: AdminModeratedVideo;
  statusLabel: string;
  onApprove: (video: AdminModeratedVideo) => void;
  onReject: (video: AdminModeratedVideo) => void;
  onRemove: (video: AdminModeratedVideo) => void;
}

const VideoModerationCard = ({
  video,
  statusLabel,
  onApprove,
  onReject,
  onRemove,
}: VideoModerationCardProps) => {
  return (
    <div className="flex h-full flex-col rounded-[20px] border border-default-200 bg-default-50 p-5">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-default-900">{video.exercise_name}</h3>
          <p className="mt-1 text-sm text-default-600">Creator ID: {video.created_by}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-default-600">
          <span className="rounded-full border border-default-200 bg-white px-3 py-1">
            Status: {statusLabel}
          </span>
          <span className="rounded-full border border-default-200 bg-white px-3 py-1">
            Exercise ID: {video.exercise_id}
          </span>
        </div>

        <div className="space-y-1 text-sm text-default-600">
          <p>
            <span className="font-medium text-default-800">Review note:</span>{" "}
            {video.video_review_note ?? "—"}
          </p>
          <p className="break-all">
            <span className="font-medium text-default-800">Video URL:</span>{" "}
            {video.video_url ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-default-200 pt-4">
        <Button className={"bg-[#5B5EF4]"} onPress={() => onApprove(video)}>
          <span className="inline-flex items-center gap-2">
            <Check className="h-4 w-4" />
            Approve
          </span>
        </Button>

        <Button className={"bg-[#5B5EF4]"} onPress={() => onReject(video)}>
          <span className="inline-flex items-center gap-2">
            <X className="h-4 w-4" />
            Reject
          </span>
        </Button>

        <Button className={"bg-[#5B5EF4]"} onPress={() => onRemove(video)}>
          <span className="inline-flex items-center gap-2">
            <Eraser className="h-4 w-4" />
            Remove
          </span>
        </Button>
      </div>
    </div>
  );
};

export default VideoModerationCard;
