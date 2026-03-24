import axios from "axios";

import type {
    ActiveWorkoutSessionResponse,
    CardioLogPayload,
    FinishWorkoutPayload,
    StartWorkoutPayload,
    StrengthSetPayload,
    WorkoutSessionSummary,
} from "../../utils/Interfaces/WorkoutLog/workoutLog";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const DEV_USER_ID = 1;

/**
 * Temporary dev-only header.
 * This only works if the backend is updated to read X-Debug-User-Id
 * when there is no real login session yet.
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "X-Debug-User-Id": String(DEV_USER_ID),
    },
});

interface StartWorkoutResponse {
    message: string;
    session: WorkoutSessionSummary;
}

interface BasicMessageResponse {
    message: string;
}

export async function getActiveWorkoutSession(): Promise<ActiveWorkoutSessionResponse> {
    const response = await api.get("/workoutAction/active");
    return response.data;
}

export async function startWorkoutSession(
    payload: StartWorkoutPayload,
): Promise<StartWorkoutResponse> {
    console.log("[Workout Log Service] startWorkoutSession", payload);

    const response = await api.post("/workoutAction/start", payload);
    return response.data;
}

export async function logStrengthSet(
    payload: StrengthSetPayload,
): Promise<BasicMessageResponse> {
    console.log("[Workout Log Service] logStrengthSet", payload);

    const response = await api.post("/exerciseLog/log_weights", payload);
    return response.data;
}

export async function logCardioActivity(
    payload: CardioLogPayload,
): Promise<BasicMessageResponse> {
    console.log("[Workout Log Service] logCardioActivity", payload);

    const response = await api.post("/exerciseLog/log_cardio", payload);
    return response.data;
}

export async function finishWorkoutSession(
    payload: FinishWorkoutPayload,
): Promise<BasicMessageResponse> {
    console.log("[Workout Log Service] finishWorkoutSession", payload);

    const response = await api.patch("/workoutAction/mark_workout_done", payload);
    return response.data;
}

