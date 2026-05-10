import { adminGet, adminPatch } from "../../utils/Admin/adminApi";
import type {
  ApproveVideoPayload,
  GetPendingVideosResponse,
  RejectVideoPayload,
  RemoveVideoPayload,
  VideoModerationMutationResponse,
} from "../../utils/Interfaces/Admin";

export const getPendingVideos = () => {
  return adminGet<GetPendingVideosResponse>("/videos/pending");
};

export const approveVideo = (payload: ApproveVideoPayload) => {
  return adminPatch<VideoModerationMutationResponse, ApproveVideoPayload>(
    "/videos/approve",
    payload,
  );
};

export const rejectVideo = (payload: RejectVideoPayload) => {
  return adminPatch<VideoModerationMutationResponse, RejectVideoPayload>(
    "/videos/reject",
    payload,
  );
};

export const removeVideo = (payload: RemoveVideoPayload) => {
  return adminPatch<VideoModerationMutationResponse, RemoveVideoPayload>(
    "/videos/remove",
    payload,
  );
};

const adminVideoModerationService = {
  getPendingVideos,
  approveVideo,
  rejectVideo,
  removeVideo,
};

export default adminVideoModerationService;
