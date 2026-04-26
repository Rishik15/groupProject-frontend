import { Button, Card } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  approveVideo,
  getPendingVideos,
  rejectVideo,
  removeVideo,
} from "../../../services/Admin/adminVideoModerationService";
import { formatVideoStatusLabel } from "../../../utils/Admin/adminFormatters";
import type { AdminModeratedVideo } from "../../../utils/Interfaces/Admin/adminVideoModeration";
import VideoActionPanel from "./Moderation/VideoActionPanel";
import VideoModerationCard from "./Moderation/VideoModerationCard";

type VideoActionMode = "approve" | "reject" | "remove" | null;

const VideoModerationTab = () => {
  const [videos, setVideos] = useState<AdminModeratedVideo[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVideo, setSelectedVideo] = useState<AdminModeratedVideo | null>(null);
  const [actionMode, setActionMode] = useState<VideoActionMode>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const actionIsOpen = Boolean(selectedVideo && actionMode);

  const loadVideos = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPendingVideos(signal);
      setVideos(response.videos ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      setError(err instanceof Error ? err.message : "Failed to load pending videos.");
      setVideos([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadVideos(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredVideos = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return videos;

    return videos.filter((video) => {
      const values = [
        video.exercise_name,
        video.video_status,
        video.video_review_note,
        String(video.created_by),
        video.video_url,
      ];

      return values.some((value) => value?.toLowerCase().includes(query));
    });
  }, [videos, searchValue]);

  const openAction = (
    video: AdminModeratedVideo,
    mode: Exclude<VideoActionMode, null>,
  ) => {
    setSelectedVideo(video);
    setActionMode(mode);
    setReviewNote(mode === "reject" ? video.video_review_note ?? "" : "");
    setActionError(null);
  };

  const closeAction = () => {
    setSelectedVideo(null);
    setActionMode(null);
    setReviewNote("");
    setActionError(null);
  };

  const submitAction = async () => {
    if (!selectedVideo || !actionMode) return;

    if (actionMode === "reject" && !reviewNote.trim()) {
      setActionError("A review note is required when rejecting a video.");
      return;
    }

    setSubmitting(true);
    setActionError(null);

    try {
      if (actionMode === "approve") {
        await approveVideo({ exercise_id: selectedVideo.exercise_id });
      }

      if (actionMode === "reject") {
        await rejectVideo({
          exercise_id: selectedVideo.exercise_id,
          video_review_note: reviewNote.trim(),
        });
      }

      if (actionMode === "remove") {
        await removeVideo({ exercise_id: selectedVideo.exercise_id });
      }

      setVideos((current) =>
        current.filter((video) => video.exercise_id !== selectedVideo.exercise_id),
      );
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
        <div className="flex flex-col gap-4 p-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-default-900">Video moderation</h2>
            <p className="mt-1 text-sm text-default-600">
              Review pending exercise videos, search the queue, and approve,
              reject, or remove clips from the admin moderation surface.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-[340px]">
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by exercise, creator id, or video URL"
              className="rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
            />

            <div className="flex flex-wrap gap-2">
              <Button onPress={() => void loadVideos()} isDisabled={loading} className={"bg-[#5B5EF4]"}>
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                  Refresh
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 p-6">
            <div>
              <p className="text-lg font-semibold text-default-900">
                Loading pending videos
              </p>
              <p className="mt-1 text-sm text-default-600">
                Pulling the latest moderation queue from the admin video endpoints.
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
                Unable to load pending videos
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
                    Pending moderation roster
                  </p>
                  <p className="mt-1 text-sm text-default-600">
                    {actionIsOpen
                      ? "The roster is temporarily hidden while you finish the selected moderation action."
                      : `${filteredVideos.length} of ${videos.length} pending video${videos.length === 1 ? "" : "s"} shown.`}
                  </p>
                </div>

                {actionIsOpen ? (
                  <Button onPress={closeAction} isDisabled={submitting}>
                    Back to roster
                  </Button>
                ) : null}
              </div>

              {actionIsOpen ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  <p className="font-medium text-default-800">
                    Roster paused for active moderation
                  </p>
                  <p className="mt-2">
                    Finish or cancel the current action on{" "}
                    <span className="font-medium text-default-800">
                      {selectedVideo?.exercise_name}
                    </span>{" "}
                    to return to the full moderation queue.
                  </p>
                </div>
              ) : filteredVideos.length === 0 ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  No pending videos matched your current search.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredVideos.map((video) => (
                    <VideoModerationCard
                      key={video.exercise_id}
                      video={video}
                      statusLabel={formatVideoStatusLabel(video.video_status)}
                      onApprove={(targetVideo) => openAction(targetVideo, "approve")}
                      onReject={(targetVideo) => openAction(targetVideo, "reject")}
                      onRemove={(targetVideo) => openAction(targetVideo, "remove")}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          <VideoActionPanel
            selectedVideo={selectedVideo}
            actionMode={actionMode}
            reviewNote={reviewNote}
            submitting={submitting}
            actionError={actionError}
            onReviewNoteChange={setReviewNote}
            onSubmit={() => void submitAction()}
            onCancel={closeAction}
          />
        </div>
      )}
    </div>
  );
};

export default VideoModerationTab;
