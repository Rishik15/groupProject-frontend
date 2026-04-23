type Props = {
    photoUrl: string | null;
    label: string;
    onClose: () => void;
};

const ProgressPhotoLightbox = ({ photoUrl, label, onClose }: Props) => {
    if (!photoUrl) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6"
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
            <div className="flex max-h-full max-w-5xl flex-col items-center gap-3">
                <div className="text-center text-sm font-medium text-white">
                    {label}
                </div>

                <img
                    src={photoUrl}
                    alt={label || "Progress photo"}
                    className="max-h-[85vh] max-w-full rounded-2xl bg-white object-contain shadow-2xl"
                />

                <div className="text-xs text-white/80">Click anywhere to close</div>
            </div>
        </div>
    );
};

export default ProgressPhotoLightbox;