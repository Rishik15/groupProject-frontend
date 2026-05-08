import { useCallback, useEffect, useState } from "react";
import { Button, Card } from "@heroui/react";
import {
  buildBackendMediaUrl,
  deleteProgressPhoto,
  getProgressPhotos,
} from "../../../services/Setting/progressPhotoService";
import type { ProgressPhotoRecord } from "./types";
import { formatDateTime } from "./utils";
import ProgressPhotoGallery from "./ProgressPhotoGallery";
import ProgressPhotoLightbox from "./ProgressPhotoLightbox";
import ProgressPhotoUpload from "./ProgressPhotoUpload";

const ProgressPhotos = () => {
  const [photos, setPhotos] = useState<ProgressPhotoRecord[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [photosError, setPhotosError] = useState("");
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);

  const [photoToDelete, setPhotoToDelete] =
    useState<ProgressPhotoRecord | null>(null);

  const [lightboxPhotoUrl, setLightboxPhotoUrl] = useState<string | null>(null);
  const [lightboxPhotoLabel, setLightboxPhotoLabel] = useState("");

  const loadPhotos = useCallback(async () => {
    try {
      setIsLoadingPhotos(true);
      setPhotosError("");

      const data = await getProgressPhotos();
      setPhotos(data);
    } catch (error) {
      console.error("Failed to fetch progress photos:", error);
      setPhotosError(
        error instanceof Error
          ? error.message
          : "Failed to load progress photos.",
      );
    } finally {
      setIsLoadingPhotos(false);
    }
  }, []);

  const handleOpenPhoto = (photo: ProgressPhotoRecord) => {
    setLightboxPhotoUrl(buildBackendMediaUrl(photo.photo_url));
    setLightboxPhotoLabel(
      photo.caption?.trim() ||
        formatDateTime(photo.taken_at || photo.created_at) ||
        "Progress Photo",
    );
  };

  const handleClosePhoto = () => {
    setLightboxPhotoUrl(null);
    setLightboxPhotoLabel("");
  };

  const handleAskDeletePhoto = (photo: ProgressPhotoRecord) => {
    setPhotoToDelete(photo);
  };

  const handleCancelDelete = () => {
    if (deletingPhotoId !== null) return;
    setPhotoToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!photoToDelete) return;

    try {
      setDeletingPhotoId(photoToDelete.progress_photo_id);
      setPhotosError("");

      await deleteProgressPhoto({
        progressPhotoId: photoToDelete.progress_photo_id,
        mode: "client",
      });

      setPhotos((currentPhotos) =>
        currentPhotos.filter(
          (photo) =>
            photo.progress_photo_id !== photoToDelete.progress_photo_id,
        ),
      );

      if (lightboxPhotoUrl === buildBackendMediaUrl(photoToDelete.photo_url)) {
        handleClosePhoto();
      }

      setPhotoToDelete(null);
    } catch (error) {
      console.error("Failed to delete progress photo:", error);
      setPhotosError(
        error instanceof Error
          ? error.message
          : "Failed to delete progress photo.",
      );
    } finally {
      setDeletingPhotoId(null);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  return (
    <>
      <Card className="w-165 rounded-xl border border-[#E8E8EF] bg-white">
        <div className="flex flex-col gap-6 p-6">
          <div>
            <h2 className="text-lg font-semibold text-[#0F0F14]">
              Progress Photos
            </h2>
            <p className="mt-1 text-sm text-[#72728A]">
              Upload a progress photo to track changes over time.
            </p>
          </div>

          <ProgressPhotoUpload onUploadSuccess={loadPhotos} />

          <ProgressPhotoGallery
            photos={photos}
            isLoading={isLoadingPhotos}
            errorMessage={photosError}
            onOpenPhoto={handleOpenPhoto}
            onDeletePhoto={handleAskDeletePhoto}
            deletingPhotoId={deletingPhotoId}
          />
        </div>
      </Card>

      <ProgressPhotoLightbox
        photoUrl={lightboxPhotoUrl}
        label={lightboxPhotoLabel}
        onClose={handleClosePhoto}
      />

      {photoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#0F0F14]">
              Delete progress photo?
            </h3>

            <p className="mt-2 text-sm text-[#72728A]">
              This will permanently delete this progress photo. This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                className="rounded-md border border-gray-300 bg-white text-sm text-black"
                onPress={handleCancelDelete}
                isDisabled={deletingPhotoId !== null}
              >
                Cancel
              </Button>

              <Button
                className="rounded-md bg-red-500 text-sm font-medium text-white"
                onPress={handleConfirmDelete}
                isDisabled={deletingPhotoId !== null}
              >
                {deletingPhotoId !== null ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProgressPhotos;
