import { useEffect, useState } from "react";

import {
    finishWorkoutSession,
    getActiveWorkoutSession,
    logCardioActivity,
    logStrengthSet,
    startWorkoutSession,
} from "../../services/WorkoutLog/workoutLogService";
import type {
    ActiveWorkoutSessionResponse,
    CardioLogFormValues,
    StrengthLogFormValues,
    WorkoutActivityType,
    WorkoutCardioEntry,
    WorkoutSessionSummary,
    WorkoutSetEntry,
} from "../Interfaces/WorkoutLog/workoutLog";

interface UseWorkoutLogModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const initialStrengthValues: StrengthLogFormValues = {
    exercise_id: "",
    set_number: "1",
    reps: "",
    weight: "",
    rpe: "",
    datetimeFinished: "",
};

const initialCardioValues: CardioLogFormValues = {
    performed_at: "",
    steps: "",
    distance_km: "",
    duration_min: "",
    calories: "",
    avg_hr: "",
};

function toOptionalNumber(value: string) {
    if (value.trim() === "") {
        return undefined;
    }

    return Number(value);
}

function hasAtLeastOneCardioMetric(values: CardioLogFormValues) {
    return [
        values.steps,
        values.distance_km,
        values.duration_min,
        values.calories,
        values.avg_hr,
    ].some((value) => value.trim() !== "");
}

export default function useWorkoutLogModal({
    isOpen,
    onOpenChange,
}: UseWorkoutLogModalProps) {
    const [activeActivity, setActiveActivity] =
        useState<WorkoutActivityType>("strength");

    const [activeSession, setActiveSession] =
        useState<WorkoutSessionSummary | null>(null);
    const [sessionSets, setSessionSets] = useState<WorkoutSetEntry[]>([]);
    const [sessionCardio, setSessionCardio] = useState<WorkoutCardioEntry[]>([]);
    const [isLoadingActiveSession, setIsLoadingActiveSession] = useState(false);
    const [activeSessionError, setActiveSessionError] = useState<string | null>(
        null,
    );

    const [workoutPlanId, setWorkoutPlanId] = useState("");
    const [notes, setNotes] = useState("");
    const [strengthValues, setStrengthValues] =
        useState<StrengthLogFormValues>(initialStrengthValues);
    const [cardioValues, setCardioValues] =
        useState<CardioLogFormValues>(initialCardioValues);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        void loadActiveWorkoutSession();
    }, [isOpen]);

    function updateStrengthField(
        field: keyof StrengthLogFormValues,
        value: string,
    ) {
        setStrengthValues((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function updateCardioField(
        field: keyof CardioLogFormValues,
        value: string,
    ) {
        setCardioValues((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function resetLocalState() {
        setActiveActivity("strength");
        setActiveSession(null);
        setSessionSets([]);
        setSessionCardio([]);
        setIsLoadingActiveSession(false);
        setActiveSessionError(null);
        setWorkoutPlanId("");
        setNotes("");
        setStrengthValues(initialStrengthValues);
        setCardioValues(initialCardioValues);
    }

    function handleClose() {
        resetLocalState();
        onOpenChange(false);
    }

    async function loadActiveWorkoutSession() {
        setIsLoadingActiveSession(true);
        setActiveSessionError(null);

        try {
            const response: ActiveWorkoutSessionResponse =
                await getActiveWorkoutSession();

            setActiveSession(response.session);
            setSessionSets(Array.isArray(response.sets) ? response.sets : []);
            setSessionCardio(Array.isArray(response.cardio) ? response.cardio : []);

            if (response.session) {
                setWorkoutPlanId(
                    response.session.workout_plan_id != null
                        ? String(response.session.workout_plan_id)
                        : "",
                );
                setNotes(response.session.notes ?? "");
            } else {
                setWorkoutPlanId("");
                setNotes("");
            }
        } catch (error) {
            console.error("[Workout Log Modal] Failed to load active session", error);
            setActiveSessionError("Failed to load the current workout session.");
            setActiveSession(null);
            setSessionSets([]);
            setSessionCardio([]);
        } finally {
            setIsLoadingActiveSession(false);
        }
    }

    async function handleStartWorkout() {
        try {
            const payload = {
                workout_plan_id:
                    workoutPlanId.trim() === "" ? undefined : Number(workoutPlanId),
                notes: notes.trim() || undefined,
            };

            console.log("[Workout Log Modal] start payload copy", payload);
            await startWorkoutSession(payload);
            await loadActiveWorkoutSession();
        } catch (error) {
            console.error("[Workout Log Modal] Failed to start workout", error);
            setActiveSessionError("Failed to start the workout session.");
        }
    }

    async function handleLogStrength() {
        if (!activeSession) {
            return;
        }

        const exerciseId = Number(strengthValues.exercise_id);
        const setNumber = Number(strengthValues.set_number);

        if (!Number.isFinite(exerciseId) || exerciseId <= 0) {
            setActiveSessionError("Exercise ID is required and must be greater than 0.");
            return;
        }

        if (!Number.isFinite(setNumber) || setNumber <= 0) {
            setActiveSessionError("Set Number is required and must be greater than 0.");
            return;
        }

        try {
            setActiveSessionError(null);

            const payload = {
                session_id: activeSession.session_id,
                exercise_id: exerciseId,
                set_number: setNumber,
                reps: toOptionalNumber(strengthValues.reps),
                weight: toOptionalNumber(strengthValues.weight),
                rpe: toOptionalNumber(strengthValues.rpe),
                datetimeFinished: strengthValues.datetimeFinished || undefined,
            };

            console.log("[Workout Log Modal] strength payload copy", payload);
            await logStrengthSet(payload);
            await loadActiveWorkoutSession();
        } catch (error) {
            console.error("[Workout Log Modal] Failed to log strength", error);
            setActiveSessionError("Failed to log the strength set.");
        }
    }

    async function handleLogCardio() {
        if (!activeSession) {
            return;
        }

        if (!hasAtLeastOneCardioMetric(cardioValues)) {
            setActiveSessionError(
                "Enter at least one cardio metric: steps, distance, duration, calories, or average heart rate.",
            );
            return;
        }

        try {
            setActiveSessionError(null);

            const payload = {
                session_id: activeSession.session_id,
                performed_at: cardioValues.performed_at || undefined,
                steps: toOptionalNumber(cardioValues.steps),
                distance_km: toOptionalNumber(cardioValues.distance_km),
                duration_min: toOptionalNumber(cardioValues.duration_min),
                calories: toOptionalNumber(cardioValues.calories),
                avg_hr: toOptionalNumber(cardioValues.avg_hr),
            };

            console.log("[Workout Log Modal] cardio payload copy", payload);
            await logCardioActivity(payload);
            await loadActiveWorkoutSession();
        } catch (error) {
            console.error("[Workout Log Modal] Failed to log cardio", error);
            setActiveSessionError("Failed to log the cardio activity.");
        }
    }

    async function handleFinishWorkout() {
        if (!activeSession) {
            return;
        }

        try {
            setActiveSessionError(null);

            const payload = {
                session_id: activeSession.session_id,
            };

            console.log("[Workout Log Modal] finish payload copy", payload);
            await finishWorkoutSession(payload);
            handleClose();
        } catch (error) {
            console.error("[Workout Log Modal] Failed to finish workout", error);
            setActiveSessionError("Failed to finish the workout session.");
        }
    }

    return {
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
    };
}
