import api from "@/services/api";

export type ProgressPhotoRecord = {
  progress_photo_id: number;
  user_id: number;
  photo_url: string;
  caption?: string | null;
  taken_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const buildBackendMediaUrl = (photoUrl?: string | null) => {
  if (!photoUrl) return "";

  if (/^https?:\/\//i.test(photoUrl)) {
    return photoUrl;
  }

  return `${API_BASE_URL}${photoUrl.startsWith("/") ? "" : "/"}${photoUrl}`;
};

export const getProgressPhotos = async (): Promise<ProgressPhotoRecord[]> => {
  const response = await api.get("/client/progress-photos");

  return Array.isArray(response.data?.progressPhotos)
    ? response.data.progressPhotos
    : [];
};

export const uploadProgressPhoto = async (params: {
  file: File;
  caption?: string;
  takenAtIso?: string;
}) => {
  const formData = new FormData();

  formData.append("photo", params.file);

  if (params.caption?.trim()) {
    formData.append("caption", params.caption.trim());
  }

  if (params.takenAtIso) {
    formData.append("taken_at", params.takenAtIso);
  }

  const response = await api.post("/client/progress-photo", formData);

  return response.data;
};