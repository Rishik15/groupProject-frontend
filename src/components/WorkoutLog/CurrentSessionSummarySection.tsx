import WorkoutLogSectionCard from "./SectionCard";
import type {
    WorkoutCardioEntry,
    WorkoutSessionSummary,
    WorkoutSetEntry,
} from "../../utils/Interfaces/WorkoutLog/workoutLog";

interface CurrentSessionSummarySectionProps {
    activeSession: WorkoutSessionSummary | null;
    sessionSets: WorkoutSetEntry[];
    sessionCardio: WorkoutCardioEntry[];
    isLoading: boolean;
    errorMessage: string | null;
}

export default function CurrentSessionSummarySection({
    activeSession,
    sessionSets,
    sessionCardio,
    isLoading,
    errorMessage,
}: CurrentSessionSummarySectionProps) {
    if (isLoading) {
        return (
            <WorkoutLogSectionCard
                title="Current Workout"
                description="Loading the active workout session."
            >
                <div className="text-[11.25px] text-[#72728A]">
                    Loading current workout session...
                </div>
            </WorkoutLogSectionCard>
        );
    }

    if (errorMessage) {
        return (
            <WorkoutLogSectionCard
                title="Current Workout"
                description="The workout session could not be loaded."
            >
                <div className="text-[11.25px] text-[#72728A]">{errorMessage}</div>
            </WorkoutLogSectionCard>
        );
    }

    if (!activeSession) {
        return (
            <WorkoutLogSectionCard
                title="Current Workout"
                description="There is no active session yet."
            >
                <div className="text-[11.25px] text-[#72728A]">
                    Start a workout session to begin logging sets or cardio.
                </div>
            </WorkoutLogSectionCard>
        );
    }

    return (
        <WorkoutLogSectionCard
            title="Current Active Session"
            description="This is the single active workout session returned by the backend."
        >
            <div className="space-y-2 text-[11.25px] text-[#72728A]">
                <div>
                    Session ID:{" "}
                    <span className="font-semibold text-[#0F0F14]">
                        {activeSession.session_id}
                    </span>
                </div>

                <div>
                    Started At:{" "}
                    <span className="font-semibold text-[#0F0F14]">
                        {activeSession.started_at ?? "Not provided"}
                    </span>
                </div>

                <div>
                    Notes:{" "}
                    <span className="font-semibold text-[#0F0F14]">
                        {activeSession.notes || "None"}
                    </span>
                </div>

                <div>
                    Logged Strength Sets:{" "}
                    <span className="font-semibold text-[#0F0F14]">
                        {sessionSets.length}
                    </span>
                </div>

                <div>
                    Logged Cardio Entries:{" "}
                    <span className="font-semibold text-[#0F0F14]">
                        {sessionCardio.length}
                    </span>
                </div>
            </div>
        </WorkoutLogSectionCard>
    );
}
