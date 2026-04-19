import axios from "axios";

import type {
    CreateWorkoutCalendarEventInput,
    WorkoutCalendarEvent,
    WorkoutScheduleKind,
    WorkoutScheduleStatus,
} from "../../utils/Interfaces/WorkoutLog/workoutLog";

interface BackendWorkoutScheduleEvent {
    event_id: number;
    title: string;
    event_date: string;
    start_time: string;
    end_time: string;
    session_type: WorkoutScheduleKind;
    status: WorkoutScheduleStatus;
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

    if (trimmed.length === 5) {
        return `${trimmed}:00`;
    }

    return trimmed;
}

function toFrontendEvent(event: BackendWorkoutScheduleEvent): WorkoutCalendarEvent {
    return {
        id: String(event.event_id),
        title: event.title,
        date: event.event_date,
        startTime: event.start_time.slice(0, 5),
        endTime: event.end_time.slice(0, 5),
        kind: event.session_type,
        status: event.status,
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

    return (data.events ?? []).map(toFrontendEvent);
}

export async function createWorkoutScheduleEvent(
    input: CreateWorkoutCalendarEventInput,
) {
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

    return toFrontendEvent(data.event);
}

export async function updateWorkoutScheduleEvent(
    eventId: string | number,
    input: Partial<CreateWorkoutCalendarEventInput> & {
        status?: WorkoutScheduleStatus;
        workoutPlanId?: number | null;
    },
) {
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

    return toFrontendEvent(data.event);
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