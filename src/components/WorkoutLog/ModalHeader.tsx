interface WorkoutLogModalHeaderProps {
    onClose: () => void;
}

export default function WorkoutLogModalHeader({
    onClose,
}: WorkoutLogModalHeaderProps) {
    return (
        <div
            className="bg-white px-5 py-5"
            style={{ borderBottom: "1px solid rgba(94, 94, 244, 0.3)" }}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11.25px] font-medium text-[#72728A]">
                        Workout Tracker
                    </p>

                    <h2 className="mt-1 text-[18.75px] font-semibold text-[#0F0F14]">
                        Log Workout Activity
                    </h2>

                    <p className="mt-2 max-w-xl text-[11.25px] text-[#72728A]">
                        Start a workout session, choose the activity type, and log only the
                        fields the backend actually expects.
                    </p>
                </div>

                <button
                    type="button"
                    className="rounded-xl px-3 py-2 text-[11.25px] font-semibold text-[#0F0F14] transition"
                    style={{ border: "1px solid rgba(94, 94, 244, 0.4)" }}
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
