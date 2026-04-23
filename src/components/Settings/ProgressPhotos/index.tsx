import { useCallback, useEffect, useState } from "react";
import { Card } from "@heroui/react";
import {
    buildBackendMediaUrl,
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
                    />
                </div>
            </Card>

            <ProgressPhotoLightbox
                photoUrl={lightboxPhotoUrl}
                label={lightboxPhotoLabel}
                onClose={handleClosePhoto}
            />
        </>
    );
};

export default ProgressPhotos;