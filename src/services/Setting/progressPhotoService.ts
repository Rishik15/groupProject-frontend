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
  const response = await fetch(`${API_BASE_URL}/client/progress-photos`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to load progress photos.");
  }

  return Array.isArray(data?.progressPhotos) ? data.progressPhotos : [];
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

  const response = await fetch(`${API_BASE_URL}/client/progress-photo`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to upload progress photo.");
  }

  return data;
};