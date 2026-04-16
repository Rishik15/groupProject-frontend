import axios from "axios";

import type {
    ActiveWorkoutSessionResponse,
    CardioLogPayload,
    FinishWorkoutPayload,
    StartWorkoutPayload,
    StrengthSetPayload,
} from "../../utils/Interfaces/WorkoutLog/workoutLog";

export async function getActiveWorkoutSession() {
    const { data } = await axios.get<ActiveWorkoutSessionResponse>(
        "http://localhost:8080/workoutAction/active",
        {
            withCredentials: true,
        },
    );

    return data;
}

export async function startWorkoutSession(payload: StartWorkoutPayload) {
    const { data } = await axios.post(
        "http://localhost:8080/workoutAction/start",
        payload,
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        },
    );

    return data;
}

export async function logStrengthSet(payload: StrengthSetPayload) {
    const { data } = await axios.post(
        "http://localhost:8080/exerciseLog/log_weights",
        payload,
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        },
    );

    return data;
}

export async function logCardioActivity(payload: CardioLogPayload) {
    const { data } = await axios.post(
        "http://localhost:8080/exerciseLog/log_cardio",
        payload,
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        },
    );

    return data;
}

export async function finishWorkoutSession(payload: FinishWorkoutPayload) {
    const { data } = await axios.patch(
        "http://localhost:8080/workoutAction/mark_workout_done",
        payload,
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        },
    );

    return data;
}