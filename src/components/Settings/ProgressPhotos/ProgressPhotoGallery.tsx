import type { ProgressPhotoRecord } from "./types";
import { formatDateTime } from "./utils";
import { buildBackendMediaUrl } from "../../../services/Setting/progressPhotoService";

type Props = {
    photos: ProgressPhotoRecord[];
    isLoading: boolean;
    errorMessage: string;
    onOpenPhoto: (photo: ProgressPhotoRecord) => void;
};

const ProgressPhotoGallery = ({
    photos,
    isLoading,
    errorMessage,
    onOpenPhoto,
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
                        const dateLabel = formatDateTime(photo.taken_at || photo.created_at);

                        return (
                            <button
                                key={photo.progress_photo_id}
                                type="button"
                                onClick={() => onOpenPhoto(photo)}
                                className="overflow-hidden rounded-2xl border border-[#E8E8EF] bg-white text-left transition hover:shadow-sm"
                            >
                                <div className="flex h-52 w-full items-center justify-center overflow-hidden bg-[#F7F7FB] p-3">
                                    <img
                                        src={imageSrc}
                                        alt={photo.caption?.trim() || "Progress photo"}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>

                                <div className="space-y-2 p-4">
                                    <div className="line-clamp-2 text-sm font-medium text-[#0F0F14]">
                                        {photo.caption?.trim() || "Progress Photo"}
                                    </div>

                                    {dateLabel && (
                                        <div className="text-xs text-[#72728A]">{dateLabel}</div>
                                    )}

                                    <div className="text-xs font-medium text-indigo-500">
                                        Click to view full size
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProgressPhotoGallery;