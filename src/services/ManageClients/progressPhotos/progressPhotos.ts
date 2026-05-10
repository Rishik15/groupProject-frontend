import api from "@/services/api";
import type { ProgressPhotoRecord } from "@/services/Setting/progressPhotoService";

export const getManagedClientProgressPhotos = async (
  contract_id: number,
): Promise<ProgressPhotoRecord[]> => {
  const response = await api.get("/manage/progressPhoto/progress-photos", {
    params: { contract_id },
  });

  return Array.isArray(response.data?.progressPhotos)
    ? response.data.progressPhotos
    : [];
};
