export type WorkoutActivityType = "strength" | "cardio";

export type WorkoutScheduleKind =
    | "strength"
    | "cardio"
    | "yoga"
    | "rest"
    | "nutrition"
    | "other";

export type WorkoutScheduleStatus =
    | "scheduled"
    | "active"
    | "complete"
    | "done"
    | "missed";

export interface WorkoutSessionSummary {
    session_id: number;
    user_id?: number;
    started_at?: string | null;
    ended_at?: string | null;
    workout_plan_id?: number | null;
    notes?: string | null;
}

export interface StartWorkoutPayload {
    workout_plan_id?: number | null;
    notes?: string;
}

export interface StrengthSetPayload {
    session_id: number;
    exercise_id: number;
    set_number: number;
    reps?: number;
    weight?: number;
    rpe?: number;
    datetimeFinished?: string;
}

export interface CardioLogPayload {
    session_id?: number | null;
    performed_at?: string;
    steps?: number;
    distance_km?: number;
    duration_min?: number;
    calories?: number;
    avg_hr?: number;
}

export interface FinishWorkoutPayload {
    session_id: number;
}

export interface StrengthLogFormValues {
    exercise_id: string;
    set_number: string;
    reps: string;
    weight: string;
    rpe: string;
    datetimeFinished: string;
}

export interface CardioLogFormValues {
    performed_at: string;
    steps: string;
    distance_km: string;
    duration_min: string;
    calories: string;
    avg_hr: string;
}

export interface WorkoutSetEntry {
    set_log_id: number;
    session_id: number;
    exercise_id: number;
    set_number: number;
    reps?: number | null;
    weight?: number | null;
    rpe?: number | null;
    performed_at?: string | null;
}

export interface WorkoutCardioEntry {
    cardio_log_id: number;
    session_id?: number | null;
    user_id?: number;
    performed_at?: string | null;
    steps?: number | null;
    distance_km?: number | null;
    duration_min?: number | null;
    calories?: number | null;
    avg_hr?: number | null;
}

export interface ActiveWorkoutSessionResponse {
    message?: string;
    session: WorkoutSessionSummary | null;
    sets?: WorkoutSetEntry[];
    cardio?: WorkoutCardioEntry[];
}

export interface WorkoutCalendarEvent {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    kind: WorkoutScheduleKind;
    status: WorkoutScheduleStatus;
    notes?: string;
    source: "database" | "local" | "active-session";
    sessionId?: number;
    workoutPlanId?: number;
}

export interface CreateWorkoutCalendarEventInput {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    kind: WorkoutScheduleKind;
    status: WorkoutScheduleStatus;
    notes?: string;
    workoutPlanId?: number | null;
}
