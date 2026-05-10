import { useEffect, useState } from "react";
import {
  buildBackendMediaUrl,
  type ProgressPhotoRecord,
} from "@/services/Setting/progressPhotoService";
import { getManagedClientProgressPhotos } from "@/services/ManageClients/progressPhotos/progressPhotos";
import { formatDateTime } from "@/components/Settings/ProgressPhotos/utils";

type Props = {
  contractId: number;
};

const ManageProgressPhotos = ({ contractId }: Props) => {
  const [photos, setPhotos] = useState<ProgressPhotoRecord[]>([]);
  const [selectedPhoto, setSelectedPhoto] =
    useState<ProgressPhotoRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getManagedClientProgressPhotos(contractId);
      setPhotos(data);
    } catch (error) {
      console.error("Failed to load client progress photos:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load client progress photos.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [contractId]);

  return (
    <div className="flex max-h-[calc(95vh-3rem)] flex-col overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="rounded-3xl p-5">
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-[#72728A]">
            Loading progress photos...
          </div>
        ) : photos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D9DBE3] bg-[#FAFAFC] px-4 py-10 text-center text-sm text-[#72728A]">
            This client has not uploaded any progress photos yet.
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,260px))] gap-5">
            {photos.map((photo) => {
              const imageSrc = buildBackendMediaUrl(photo.photo_url);
              const dateLabel = formatDateTime(
                photo.taken_at || photo.created_at,
              );

              return (
                <div
                  key={photo.progress_photo_id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPhoto(photo)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      setSelectedPhoto(photo);
                    }
                  }}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-[#E8E8EF] bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-44 w-full items-center justify-center overflow-hidden bg-[#F7F7FB] p-3">
                    <img
                      src={imageSrc}
                      alt={photo.caption?.trim() || "Progress photo"}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="space-y-2 p-4">
                    <div className="line-clamp-2 text-sm font-semibold text-[#0F0F14]">
                      {photo.caption?.trim() || "Progress Photo"}
                    </div>

                    {dateLabel && (
                      <div className="text-xs text-[#72728A]">{dateLabel}</div>
                    )}

                    <div className="text-xs font-medium text-indigo-500">
                      Click to view full size
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedPhoto && (
        <ProgressPhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
};

const ProgressPhotoViewer = ({
  photo,
  onClose,
}: {
  photo: ProgressPhotoRecord;
  onClose: () => void;
}) => {
  const imageSrc = buildBackendMediaUrl(photo.photo_url);
  const label = photo.caption?.trim() || "Progress photo";
  const dateLabel = formatDateTime(photo.taken_at || photo.created_at);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-6"
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key === "Escape" ||
          event.key === "Enter" ||
          event.key === " "
        ) {
          onClose();
        }
      }}
    >
      <div
        className="flex max-h-full max-w-5xl flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-sm font-medium text-white">{label}</div>

          {dateLabel && (
            <div className="mt-1 text-xs text-white/75">{dateLabel}</div>
          )}
        </div>

        <img
          src={imageSrc}
          alt={label}
          className="max-h-[82vh] max-w-full object-contain"
        />

        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#0F0F14] shadow-sm hover:bg-indigo-500 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ManageProgressPhotos;
