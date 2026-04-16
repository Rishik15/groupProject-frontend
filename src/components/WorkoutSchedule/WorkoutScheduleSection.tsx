import { useState } from "react";

import WorkoutLogModal from "../WorkoutLog/Modal";
import WeeklyWorkoutSchedule from "./WeeklyWorkoutSchedule";

export default function WorkoutScheduleSection() {
    const [isWorkoutLogOpen, setIsWorkoutLogOpen] = useState(false);
    const [refreshToken, setRefreshToken] = useState(0);

    function handleWorkoutLogOpenChange(open: boolean) {
        setIsWorkoutLogOpen(open);

        if (!open) {
            setRefreshToken((previous) => previous + 1);
        }
    }

    return (
        <>
            <WeeklyWorkoutSchedule
                refreshToken={refreshToken}
                onOpenWorkoutLog={() => setIsWorkoutLogOpen(true)}
            />

            <WorkoutLogModal
                isOpen={isWorkoutLogOpen}
                onOpenChange={handleWorkoutLogOpenChange}
            />
        </>
    );
}
