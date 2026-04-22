import { adminGet, adminPatch } from "../../utils/Admin/adminApi";
import type {
  ApproveVideoPayload,
  GetPendingVideosResponse,
  RejectVideoPayload,
  RemoveVideoPayload,
  VideoModerationMutationResponse,
} from "../../utils/Interfaces/Admin";

export const getPendingVideos = (signal?: AbortSignal) => {
  return adminGet<GetPendingVideosResponse>("/videos/pending", signal);
};

export const approveVideo = (
  payload: ApproveVideoPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<VideoModerationMutationResponse, ApproveVideoPayload>(
    "/videos/approve",
    payload,
    signal,
  );
};

export const rejectVideo = (
  payload: RejectVideoPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<VideoModerationMutationResponse, RejectVideoPayload>(
    "/videos/reject",
    payload,
    signal,
  );
};

export const removeVideo = (
  payload: RemoveVideoPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<VideoModerationMutationResponse, RemoveVideoPayload>(
    "/videos/remove",
    payload,
    signal,
  );
};

const adminVideoModerationService = {
  getPendingVideos,
  approveVideo,
  rejectVideo,
  removeVideo,
};

export default adminVideoModerationService;
