import type { WorkoutCalendarEvent } from "../Interfaces/WorkoutLog/workoutLog";

const STORAGE_KEY = "workout-weekly-schedule-local-events";

export function loadStoredWorkoutEvents(
    sanitizeEvent: (value: unknown) => WorkoutCalendarEvent | null,
) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [] as WorkoutCalendarEvent[];
        }

        const parsed = JSON.parse(raw) as unknown[];
        if (!Array.isArray(parsed)) {
            return [] as WorkoutCalendarEvent[];
        }

        return parsed
            .map((entry) => sanitizeEvent(entry))
            .filter((entry): entry is WorkoutCalendarEvent => entry !== null)
            .filter((entry) => entry.source === "local");
    } catch (error) {
        console.error("[Workout Schedule] failed to parse local events", error);
        return [] as WorkoutCalendarEvent[];
    }
}

export function saveStoredWorkoutEvents(events: WorkoutCalendarEvent[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}
