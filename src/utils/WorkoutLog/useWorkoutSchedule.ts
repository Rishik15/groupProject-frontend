import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
    getActiveWorkoutSession,
    startWorkoutSession,
} from "../../services/WorkoutLog/workoutLogService";
import {
    createWorkoutScheduleEvent,
    deleteWorkoutScheduleEvent,
    getWorkoutSchedule,
    moveWorkoutScheduleEvent,
    updateWorkoutScheduleEvent,
} from "../../services/WorkoutLog/workoutScheduleService";
import type {
    ActiveWorkoutSessionResponse,
    CreateWorkoutCalendarEventInput,
    WorkoutCalendarEvent,
    WorkoutScheduleKind,
    WorkoutScheduleStatus,
} from "../Interfaces/WorkoutLog/workoutLog";

const allowedKinds: WorkoutScheduleKind[] = [
    "strength",
    "cardio",
    "yoga",
    "rest",
    "nutrition",
    "other",
];

const allowedStatuses: WorkoutScheduleStatus[] = [
    "scheduled",
    "active",
    "done",
    "missed",
];

function parseBackendDateTime(value?: string | null) {
    if (!value) {
        return null;
    }

    const normalized = value.includes("T") ? value : value.replace(" ", "T");
    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
}

export function toDateString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getFallbackStartDate() {
    return toDateString(addDays(new Date(), -35));
}

function getFallbackEndDate() {
    return toDateString(addDays(new Date(), 35));
}

export function timeStringToMinutes(value: string) {
    const [hours = "0", minutes = "0"] = value.split(":");
    return Number(hours) * 60 + Number(minutes);
}

export function minutesToTimeString(totalMinutes: number) {
    const normalized = ((totalMinutes % 1440) + 1440) % 1440;
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function toTimeString(date: Date) {
    return minutesToTimeString(date.getHours() * 60 + date.getMinutes());
}

function addMinutes(date: Date, minutes: number) {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
}

function sanitizeKind(value: unknown): WorkoutScheduleKind {
    if (typeof value === "string" && allowedKinds.includes(value as WorkoutScheduleKind)) {
        return value as WorkoutScheduleKind;
    }

    return "strength";
}

function sanitizeStatus(value: unknown): WorkoutScheduleStatus {
    if (value === "complete") {
        return "done";
    }

    if (typeof value === "string" && allowedStatuses.includes(value as WorkoutScheduleStatus)) {
        return value as WorkoutScheduleStatus;
    }

    return "scheduled";
}

export function combineDateAndTime(dateValue: string, timeValue: string) {
    return new Date(`${dateValue}T${timeValue}:00`);
}

export function getAllowedStatusOptions(
    dateValue: string,
    startTime: string,
    endTime: string,
) {
    const now = new Date();
    const startDateTime = combineDateAndTime(dateValue, startTime);
    const endDateTime = combineDateAndTime(dateValue, endTime);

    if (endDateTime.getTime() <= now.getTime()) {
        return ["missed", "done"] as WorkoutScheduleStatus[];
    }

    if (startDateTime.getTime() <= now.getTime() && endDateTime.getTime() > now.getTime()) {
        return ["active", "done", "missed"] as WorkoutScheduleStatus[];
    }

    return ["scheduled", "done", "missed"] as WorkoutScheduleStatus[];
}

export function normalizeStatusForRange(
    status: WorkoutScheduleStatus,
    dateValue: string,
    startTime: string,
    endTime: string,
) {
    const normalizedStatus = status === "complete" ? "done" : status;
    const allowedStatusOptions = getAllowedStatusOptions(dateValue, startTime, endTime);

    if (allowedStatusOptions.includes(normalizedStatus)) {
        return normalizedStatus;
    }

    if (allowedStatusOptions.includes("scheduled")) {
        return "scheduled";
    }

    if (allowedStatusOptions.includes("active")) {
        return "active";
    }

    return allowedStatusOptions[0] ?? "scheduled";
}

export function getEffectiveStatus(event: WorkoutCalendarEvent): WorkoutScheduleStatus {
    if (event.source === "active-session") {
        return "active";
    }

    if (event.status === "complete" || event.status === "done") {
        return "done";
    }

    if (event.status === "missed") {
        return "missed";
    }

    const now = new Date();
    const endDateTime = combineDateAndTime(event.date, event.endTime);

    if (event.status === "active") {
        return "active";
    }

    if (endDateTime.getTime() <= now.getTime()) {
        return "missed";
    }

    return "scheduled";
}

function getEventDurationMinutes(event: WorkoutCalendarEvent) {
    return Math.max(timeStringToMinutes(event.endTime) - timeStringToMinutes(event.startTime), 15);
}

function sortEvents(events: WorkoutCalendarEvent[]) {
    return [...events].sort((first, second) => {
        if (first.date !== second.date) {
            return first.date.localeCompare(second.date);
        }

        return first.startTime.localeCompare(second.startTime);
    });
}

export default function useWorkoutSchedule(
    refreshToken = 0,
    startDate = getFallbackStartDate(),
    endDate = getFallbackEndDate(),
) {
    const [scheduleEvents, setScheduleEvents] = useState<WorkoutCalendarEvent[]>([]);
    const [activeSessionEvent, setActiveSessionEvent] = useState<WorkoutCalendarEvent | null>(null);
    const [attachedActiveEventId, setAttachedActiveEventId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const attachedActiveEventIdRef = useRef<string | null>(null);
    const activeSessionIdRef = useRef<number | null>(null);

    useEffect(() => {
        attachedActiveEventIdRef.current = attachedActiveEventId;
    }, [attachedActiveEventId]);

    useEffect(() => {
        activeSessionIdRef.current = activeSessionEvent?.sessionId ?? null;
    }, [activeSessionEvent?.sessionId]);

    const loadSchedule = useCallback(async () => {
        try {
            const nextEvents = await getWorkoutSchedule(startDate, endDate);
            setScheduleEvents(
                nextEvents.map((event) => ({
                    ...event,
                    kind: sanitizeKind(event.kind),
                    status: sanitizeStatus(event.status),
                    source: event.source ?? "database",
                })),
            );
        } catch (error) {
            console.error("[Workout Schedule] failed to load schedule", error);
            setErrorMessage("Failed to load the workout schedule.");
            setScheduleEvents([]);
        }
    }, [endDate, startDate]);

    const refreshActiveSession = useCallback(async () => {
        try {
            const response: ActiveWorkoutSessionResponse = await getActiveWorkoutSession();

            if (!response.session?.started_at) {
                const finishedEventId = attachedActiveEventIdRef.current;
                const finishedSessionId = activeSessionIdRef.current;

                if (finishedEventId) {
                    setScheduleEvents((previous) => previous.map((event) => (
                        event.id === finishedEventId
                            ? {
                                ...event,
                                status: "done",
                                sessionId: finishedSessionId ?? event.sessionId,
                            }
                            : event
                    )));
                }

                setActiveSessionEvent(null);
                setAttachedActiveEventId(null);
                return;
            }

            const startedAt = parseBackendDateTime(response.session.started_at);
            if (!startedAt) {
                setActiveSessionEvent(null);
                return;
            }

            const endedAt = parseBackendDateTime(response.session.ended_at);
            const endDateTime = endedAt ?? addMinutes(startedAt, 60);

            setActiveSessionEvent({
                id: `active-session-${response.session.session_id}`,
                title: response.session.notes?.trim() || "Workout Session",
                date: toDateString(startedAt),
                startTime: toTimeString(startedAt),
                endTime: toTimeString(endDateTime),
                kind: "strength",
                status: "active",
                notes: response.session.notes ?? "",
                source: "active-session",
                sessionId: response.session.session_id,
                workoutPlanId: response.session.workout_plan_id ?? undefined,
            });
        } catch (error) {
            console.error("[Workout Schedule] failed to load active session", error);
            setErrorMessage("Failed to load the active workout session.");
            setActiveSessionEvent(null);
        }
    }, []);

    useEffect(() => {
        async function loadAll() {
            setIsLoading(true);
            setErrorMessage(null);
            await loadSchedule();
            await refreshActiveSession();
            setIsLoading(false);
        }

        void loadAll();
    }, [loadSchedule, refreshActiveSession, refreshToken]);

    const addLocalEvent = useCallback(async (input: CreateWorkoutCalendarEventInput) => {
        const created = await createWorkoutScheduleEvent({
            ...input,
            status: normalizeStatusForRange(input.status, input.date, input.startTime, input.endTime),
        });

        setScheduleEvents((previous) => sortEvents([...previous, created]));

        return created;
    }, []);

    const updateLocalEvent = useCallback(async (eventId: string, input: CreateWorkoutCalendarEventInput) => {
        const existing = scheduleEvents.find((event) => event.id === eventId);

        const updated = await updateWorkoutScheduleEvent(eventId, {
            ...input,
            status: normalizeStatusForRange(input.status, input.date, input.startTime, input.endTime),
        });

        setScheduleEvents((previous) => previous.map((event) => (
            event.id === eventId
                ? {
                    ...updated,
                    sessionId: existing?.sessionId ?? updated.sessionId,
                }
                : event
        )));

        return updated;
    }, [scheduleEvents]);

    const moveLocalEvent = useCallback(async (eventId: string, nextDate: string, nextHour: number) => {
        const existing = scheduleEvents.find((event) => event.id === eventId);
        if (!existing) {
            return null;
        }

        const startMinutes = timeStringToMinutes(existing.startTime);
        const durationMinutes = getEventDurationMinutes(existing);
        const originalMinute = startMinutes % 60;
        const nextStartMinutes = nextHour * 60 + originalMinute;
        const nextEndMinutes = nextStartMinutes + durationMinutes;
        const nextStartTime = minutesToTimeString(nextStartMinutes);
        const nextEndTime = minutesToTimeString(nextEndMinutes);

        const updated = await moveWorkoutScheduleEvent(
            eventId,
            nextDate,
            nextStartTime,
            nextEndTime,
        );

        setScheduleEvents((previous) => previous.map((event) => (
            event.id === eventId
                ? {
                    ...updated,
                    sessionId: existing.sessionId ?? updated.sessionId,
                }
                : event
        )));

        return updated;
    }, [scheduleEvents]);

    const removeLocalEvent = useCallback(async (eventId: string) => {
        await deleteWorkoutScheduleEvent(eventId);
        setScheduleEvents((previous) => previous.filter((event) => event.id !== eventId));
        setAttachedActiveEventId((previous) => (previous === eventId ? null : previous));
    }, []);

    const setEventActive = useCallback(async (eventId: string) => {
        const targetEvent = scheduleEvents.find((event) => event.id === eventId);
        if (!targetEvent) {
            return;
        }

        let nextActiveSessionId = activeSessionEvent?.sessionId ?? null;

        if (nextActiveSessionId == null) {
            const response = await startWorkoutSession({
                workout_plan_id: targetEvent.workoutPlanId ?? undefined,
                notes: targetEvent.notes ?? targetEvent.title,
            });

            const typedResponse = response as {
                session?: { session_id?: number | null } | null;
                session_id?: number | null;
            };

            const createdSessionId = typedResponse.session?.session_id ?? typedResponse.session_id ?? null;

            if (typeof createdSessionId === "number" && Number.isFinite(createdSessionId)) {
                nextActiveSessionId = createdSessionId;
            }

            await refreshActiveSession();
        }

        if (nextActiveSessionId == null) {
            setErrorMessage("Failed to attach an active workout session to this block.");
            return;
        }

        setAttachedActiveEventId(eventId);
        setScheduleEvents((previous) => previous.map((event) => {
            if (event.id === eventId) {
                return {
                    ...event,
                    status: "active",
                    sessionId: nextActiveSessionId,
                };
            }

            if (event.sessionId != null && event.sessionId === nextActiveSessionId) {
                return {
                    ...event,
                    status: normalizeStatusForRange(
                        event.status === "active" ? "scheduled" : event.status,
                        event.date,
                        event.startTime,
                        event.endTime,
                    ),
                    sessionId: undefined,
                };
            }

            return event;
        }));
    }, [activeSessionEvent?.sessionId, refreshActiveSession, scheduleEvents]);

    const activeSessionId = activeSessionEvent?.sessionId ?? null;

    const events = useMemo(() => {
        const merged = scheduleEvents.map((event) => {
            const isAttachedActive =
                activeSessionId != null &&
                attachedActiveEventId != null &&
                event.id === attachedActiveEventId;

            if (!isAttachedActive) {
                return event;
            }

            return {
                ...event,
                status: "active" as WorkoutScheduleStatus,
                sessionId: activeSessionId,
            };
        });

        if (activeSessionEvent) {
            const alreadyTracked = merged.some(
                (event) =>
                    (attachedActiveEventId != null && event.id === attachedActiveEventId) ||
                    (activeSessionId != null && event.sessionId != null && event.sessionId === activeSessionId),
            );

            if (!alreadyTracked) {
                merged.push(activeSessionEvent);
            }
        }

        return sortEvents(merged);
    }, [activeSessionEvent, activeSessionId, attachedActiveEventId, scheduleEvents]);

    const activeEvent = useMemo(() => {
        if (activeSessionId != null) {
            const attachedEvent = events.find(
                (event) =>
                    event.source === "database" &&
                    ((attachedActiveEventId != null && event.id === attachedActiveEventId) ||
                        (event.sessionId != null && event.sessionId === activeSessionId)),
            );

            if (attachedEvent) {
                return attachedEvent;
            }
        }

        return activeSessionEvent;
    }, [activeSessionEvent, activeSessionId, attachedActiveEventId, events]);

    return {
        events,
        activeEvent,
        activeSessionId,
        isLoading,
        errorMessage,
        addLocalEvent,
        updateLocalEvent,
        moveLocalEvent,
        removeLocalEvent,
        setEventActive,
        refreshActiveSession,
        refreshSchedule: loadSchedule,
    };
}