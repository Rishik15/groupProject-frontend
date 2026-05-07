import { Trash2 } from "lucide-react";
import type { ProgressPhotoRecord } from "./types";
import { formatDateTime } from "./utils";
import { buildBackendMediaUrl } from "../../../services/Setting/progressPhotoService";

type Props = {
  photos: ProgressPhotoRecord[];
  isLoading: boolean;
  errorMessage: string;
  onOpenPhoto: (photo: ProgressPhotoRecord) => void;
  onDeletePhoto: (photo: ProgressPhotoRecord) => void;
  deletingPhotoId?: number | null;
};

const ProgressPhotoGallery = ({
  photos,
  isLoading,
  errorMessage,
  onOpenPhoto,
  onDeletePhoto,
  deletingPhotoId = null,
}: Props) => {
  return (
    <div className="border-t border-[#E8E8EF] pt-6">
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-[#0F0F14]">
          Progress History
        </h3>
        <p className="mt-1 text-sm text-[#72728A]">
          Your uploaded progress photos, newest first.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-[#72728A]">Loading progress photos...</div>
      ) : photos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D9DBE3] bg-[#FAFAFC] px-4 py-8 text-center text-sm text-[#72728A]">
          No progress photos uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo) => {
            const imageSrc = buildBackendMediaUrl(photo.photo_url);
            const dateLabel = formatDateTime(
              photo.taken_at || photo.created_at,
            );
            const isDeleting = deletingPhotoId === photo.progress_photo_id;

            return (
              <div
                key={photo.progress_photo_id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenPhoto(photo)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    onOpenPhoto(photo);
                  }
                }}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[#E8E8EF] bg-white text-left transition hover:shadow-sm"
              >
                <div className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-[#F7F7FB] p-3">
                  <img
                    src={imageSrc}
                    alt={photo.caption?.trim() || "Progress photo"}
                    className="max-h-full max-w-full object-contain"
                  />

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeletePhoto(photo);
                    }}
                    disabled={isDeleting}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Delete progress photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 p-4">
                  <div className="line-clamp-2 text-sm font-medium text-[#0F0F14]">
                    {photo.caption?.trim() || "Progress Photo"}
                  </div>

                  {dateLabel && (
                    <div className="text-xs text-[#72728A]">{dateLabel}</div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-medium text-indigo-500">
                      Click to view full size
                    </div>

                    {isDeleting && (
                      <div className="text-xs font-medium text-red-500">
                        Deleting...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProgressPhotoGallery;
