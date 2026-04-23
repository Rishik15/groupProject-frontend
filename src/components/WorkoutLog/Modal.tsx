import { Modal } from "@heroui/react";

import ActivityTypeSection from "./ActivityTypeSection";
import CardioLogSection from "./CardioLogSection";
import CurrentSessionSummarySection from "./CurrentSessionSummarySection";
import WorkoutLogModalFooter from "./ModalFooter";
import WorkoutLogModalHeader from "./ModalHeader";
import StrengthLogSection from "./StrengthLogSection";
import WorkoutSessionSection from "./SessionSection";
import useWorkoutLogModal from "../../utils/WorkoutLog/useWorkoutLogModal";

interface WorkoutLogModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function WorkoutLogModal({
    isOpen,
    onOpenChange,
}: WorkoutLogModalProps) {
    const {
        activeActivity,
        activeSession,
        sessionSets,
        sessionCardio,
        isLoadingActiveSession,
        activeSessionError,
        workoutPlanId,
        notes,
        strengthValues,
        cardioValues,
        setActiveActivity,
        setWorkoutPlanId,
        setNotes,
        updateStrengthField,
        updateCardioField,
        handleStartWorkout,
        handleLogStrength,
        handleLogCardio,
        handleFinishWorkout,
        handleClose,
    } = useWorkoutLogModal({
        isOpen,
        onOpenChange,
    });

    const hasActiveSession = activeSession !== null;

    return (
        <Modal>
            <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
                <Modal.Container
                    placement="center"
                    size="md"
                    scroll="inside"
                    className="p-4"
                >
                    <Modal.Dialog
                        aria-label="Log workout activity"
                        className="w-full max-w-[720px] overflow-hidden rounded-3xl bg-white"
                        style={{ border: "1px solid rgba(94, 94, 244, 0.3)" }}
                    >
                        <WorkoutLogModalHeader onClose={handleClose} />

                        <div className="max-h-[80vh] space-y-5 overflow-y-auto bg-white px-5 py-5">
                            <CurrentSessionSummarySection
                                activeSession={activeSession}
                                sessionSets={sessionSets}
                                sessionCardio={sessionCardio}
                                isLoading={isLoadingActiveSession}
                                errorMessage={activeSessionError}
                            />

                            <WorkoutSessionSection
                                workoutPlanId={workoutPlanId}
                                notes={notes}
                                hasActiveSession={hasActiveSession}
                                onWorkoutPlanIdChange={setWorkoutPlanId}
                                onNotesChange={setNotes}
                                onStartWorkout={handleStartWorkout}
                            />

                            <ActivityTypeSection
                                activeActivity={activeActivity}
                                onActivityChange={setActiveActivity}
                            />

                            {activeActivity === "strength" ? (
                                <StrengthLogSection
                                    values={strengthValues}
                                    hasActiveSession={hasActiveSession}
                                    onFieldChange={updateStrengthField}
                                    onLogStrength={handleLogStrength}
                                />
                            ) : (
                                <CardioLogSection
                                    values={cardioValues}
                                    hasActiveSession={hasActiveSession}
                                    onFieldChange={updateCardioField}
                                    onLogCardio={handleLogCardio}
                                />
                            )}
                        </div>

                        <WorkoutLogModalFooter
                            hasActiveSession={hasActiveSession}
                            onCancel={handleClose}
                            onFinish={handleFinishWorkout}
                        />
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
