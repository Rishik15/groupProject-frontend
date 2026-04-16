import { Button } from "@heroui/react";

interface WorkoutLogModalFooterProps {
    hasActiveSession: boolean;
    onCancel: () => void;
    onFinish: () => Promise<void>;
}

export default function WorkoutLogModalFooter({
    hasActiveSession,
    onCancel,
    onFinish,
}: WorkoutLogModalFooterProps) {
    return (
        <div
            className="flex flex-wrap justify-end gap-3 bg-white px-5 py-4"
            style={{ borderTop: "1px solid rgba(94, 94, 244, 0.3)" }}
        >
            <Button
                variant="ghost"
                onPress={onCancel}
                className="text-[11.25px] font-semibold text-[#0F0F14]"
                style={{ border: "1px solid rgba(94, 94, 244, 0.4)" }}
            >
                Cancel
            </Button>

            <Button
                variant="primary"
                onPress={onFinish}
                isDisabled={!hasActiveSession}
                className="text-[11.25px] font-semibold text-white"
                style={{ backgroundColor: "#5E5EF4" }}
            >
                Finish Workout
            </Button>
        </div>
    );
}
