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
        <div className="flex flex-wrap justify-end gap-3 border-t border-blue-600/30 bg-white px-5 py-4">
            <Button
                variant="ghost"
                onPress={onCancel}
                className="border border-blue-600/40 text-[11.25px] font-semibold text-[#0F0F14]"
            >
                Cancel
            </Button>

            <Button
                variant="primary"
                onPress={onFinish}
                isDisabled={!hasActiveSession}
                className="bg-blue-600 text-[11.25px] font-semibold text-white"
            >
                Finish Workout
            </Button>
        </div>
    );
}