import axios from "axios";

import type {
    CreateWorkoutCalendarEventInput,
    WorkoutCalendarEvent,
    WorkoutScheduleKind,
    WorkoutScheduleStatus,
} from "../../utils/Interfaces/WorkoutLog/workoutLog";

interface BackendWorkoutScheduleEvent {
    event_id: number;
    title: string | null;
    event_date: string | null;
    start_time: string | null;
    end_time: string | null;
    session_type: WorkoutScheduleKind | null;
    status: WorkoutScheduleStatus | null;
    notes?: string | null;
    workout_plan_id?: number | null;
    session_id?: number | null;
}

interface GetWorkoutScheduleResponse {
    events: BackendWorkoutScheduleEvent[];
}

interface CreateWorkoutSchedulePayload {
    title: string;
    event_date: string;
    start_time: string;
    end_time: string;
    session_type: WorkoutScheduleKind;
    status: WorkoutScheduleStatus;
    notes?: string;
    workout_plan_id?: number;
}

interface UpdateWorkoutSchedulePayload {
    title?: string;
    event_date?: string;
    start_time?: string;
    end_time?: string;
    session_type?: WorkoutScheduleKind;
    status?: WorkoutScheduleStatus;
    notes?: string;
    workout_plan_id?: number;
}

function normalizeTimeString(value: string) {
    const trimmed = value.trim();

    if (trimmed.length >= 5) {
        return trimmed.slice(0, 5);
    }

    return trimmed;
}

function normalizeBackendClock(value: string | null | undefined) {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    return trimmed.length >= 5 ? trimmed.slice(0, 5) : null;
}

function toFrontendEvent(
    event: BackendWorkoutScheduleEvent,
): WorkoutCalendarEvent | null {
    if (!event?.event_id || !event?.event_date) {
        return null;
    }

    const startTime = normalizeBackendClock(event.start_time);
    const endTime = normalizeBackendClock(event.end_time) ?? startTime;

    if (!startTime || !endTime) {
        console.warn("[Workout Schedule] skipping invalid backend event", event);
        return null;
    }

    return {
        id: String(event.event_id),
        title: event.title?.trim() || "Workout Session",
        date: event.event_date,
        startTime,
        endTime,
        kind: event.session_type ?? "strength",
        status: event.status ?? "scheduled",
        notes: event.notes ?? "",
        source: "database",
        sessionId: event.session_id ?? undefined,
        workoutPlanId: event.workout_plan_id ?? undefined,
    };
}

function toCreatePayload(
    input: CreateWorkoutCalendarEventInput,
): CreateWorkoutSchedulePayload {
    return {
        title: input.title,
        event_date: input.date,
        start_time: normalizeTimeString(input.startTime),
        end_time: normalizeTimeString(input.endTime),
        session_type: input.kind,
        status: input.status,
        notes: input.notes?.trim() || undefined,
        workout_plan_id:
            typeof input.workoutPlanId === "number" ? input.workoutPlanId : undefined,
    };
}

function toUpdatePayload(
    input: Partial<CreateWorkoutCalendarEventInput> & {
        status?: WorkoutScheduleStatus;
        workoutPlanId?: number | null;
    },
): UpdateWorkoutSchedulePayload {
    return {
        title: input.title,
        event_date: input.date,
        start_time: input.startTime
            ? normalizeTimeString(input.startTime)
            : undefined,
        end_time: input.endTime
            ? normalizeTimeString(input.endTime)
            : undefined,
        session_type: input.kind,
        status: input.status,
        notes: input.notes?.trim() || undefined,
        workout_plan_id:
            typeof input.workoutPlanId === "number" ? input.workoutPlanId : undefined,
    };
}

function logAxiosScheduleError(action: string, error: unknown) {
    if (axios.isAxiosError(error)) {
        console.error(`[Workout Schedule] ${action} failed`, {
            status: error.response?.status,
            data: error.response?.data,
            payloadMessage: error.message,
        });
    } else {
        console.error(`[Workout Schedule] ${action} failed`, error);
    }
}

export async function getWorkoutSchedule(startDate: string, endDate: string) {
    const { data } = await axios.get<GetWorkoutScheduleResponse>(
        "http://localhost:8080/workoutAction/schedule",
        {
            withCredentials: true,
            params: {
                start_date: startDate,
                end_date: endDate,
            },
        },
    );

    return (data.events ?? [])
        .map(toFrontendEvent)
        .filter((event): event is WorkoutCalendarEvent => event !== null);
}

export async function createWorkoutScheduleEvent(
    input: CreateWorkoutCalendarEventInput,
) {
    try {
        const { data } = await axios.post<{ event: BackendWorkoutScheduleEvent }>(
            "http://localhost:8080/workoutAction/schedule",
            toCreatePayload(input),
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        const created = toFrontendEvent(data.event);
        if (!created) {
            throw new Error("Backend returned an invalid workout schedule event after create.");
        }

        return created;
    } catch (error) {
        logAxiosScheduleError("create event", error);
        throw error;
    }
}

export async function updateWorkoutScheduleEvent(
    eventId: string | number,
    input: Partial<CreateWorkoutCalendarEventInput> & {
        status?: WorkoutScheduleStatus;
        workoutPlanId?: number | null;
    },
) {
    try {
        const payload = toUpdatePayload(input);

        const { data } = await axios.patch<{ event: BackendWorkoutScheduleEvent }>(
            `http://localhost:8080/workoutAction/schedule/${eventId}`,
            payload,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        const updated = toFrontendEvent(data.event);
        if (!updated) {
            throw new Error("Backend returned an invalid workout schedule event after update.");
        }

        return updated;
    } catch (error) {
        logAxiosScheduleError("update event", error);
        throw error;
    }
}

export async function deleteWorkoutScheduleEvent(eventId: string | number) {
    await axios.delete(`http://localhost:8080/workoutAction/schedule/${eventId}`, {
        withCredentials: true,
    });
}

export async function moveWorkoutScheduleEvent(
    eventId: string | number,
    nextDate: string,
    nextStartTime: string,
    nextEndTime: string,
) {
    return updateWorkoutScheduleEvent(eventId, {
        date: nextDate,
        startTime: nextStartTime,
        endTime: nextEndTime,
    });
}

export async function markWorkoutScheduleEventStatus(
    eventId: string | number,
    status: WorkoutScheduleStatus,
) {
    return updateWorkoutScheduleEvent(eventId, { status });
}
