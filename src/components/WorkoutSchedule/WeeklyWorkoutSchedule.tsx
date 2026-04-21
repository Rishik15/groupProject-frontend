import { useMemo, useState } from "react";

import type {
    CreateWorkoutCalendarEventInput,
    WorkoutCalendarEvent,
} from "../../utils/Interfaces/WorkoutLog/workoutLog";
import useWorkoutSchedule, {
    toDateString,
} from "../../utils/WorkoutLog/useWorkoutSchedule";
import AddSessionModal from "./AddSessionModal";
import CossWorkoutCalendar from "./CossWorkoutCalendar";

interface WeeklyWorkoutScheduleProps {
    refreshToken?: number;
    onOpenWorkoutLog: (event?: WorkoutCalendarEvent | null) => void;
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfWeek(date: Date) {
    const nextDate = new Date(date);
    nextDate.setHours(0, 0, 0, 0);
    nextDate.setDate(nextDate.getDate() - nextDate.getDay());
    return nextDate;
}

function endOfWeek(date: Date) {
    const nextDate = startOfWeek(date);
    nextDate.setDate(nextDate.getDate() + 6);
    return nextDate;
}

function getHourFromTime(time: string) {
    const [hours = "0"] = time.split(":");
    const parsed = Number(hours);
    return Number.isFinite(parsed) ? parsed : 0;
}

export default function WeeklyWorkoutSchedule({
    refreshToken = 0,
    onOpenWorkoutLog,
}: WeeklyWorkoutScheduleProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => toDateString(new Date()));
    const [selectedStartTime, setSelectedStartTime] = useState("06:00");
    const [editingEvent, setEditingEvent] = useState<WorkoutCalendarEvent | null>(null);

    const rangeStart = useMemo(
        () => toDateString(startOfWeek(startOfMonth(currentDate))),
        [currentDate],
    );

    const rangeEnd = useMemo(
        () => toDateString(endOfWeek(endOfMonth(currentDate))),
        [currentDate],
    );

    const {
        events,
        activeEvent,
        loggableEvents,
        activeSessionId,
        isLoading,
        errorMessage,
        addLocalEvent,
        updateLocalEvent,
        moveLocalEvent,
        removeLocalEvent,
        setEventActive,
        refreshActiveSession,
        refreshSchedule,
    } = useWorkoutSchedule(refreshToken, rangeStart, rangeEnd);

    function handleOpenAddSession(date: Date) {
        setEditingEvent(null);
        setSelectedDate(toDateString(date));
        setSelectedStartTime("06:00");
        setIsAddSessionOpen(true);
    }

    function handleOpenEditSession(event: WorkoutCalendarEvent) {
        if (event.source === "active-session") {
            onOpenWorkoutLog(activeEvent);
            return;
        }

        setEditingEvent(event);
        setSelectedDate(event.date);
        setSelectedStartTime(event.startTime);
        setIsAddSessionOpen(true);
    }

    async function refreshWorkoutScheduleState() {
        await refreshActiveSession();
        await refreshSchedule();
    }

    async function handleCreateSession(input: CreateWorkoutCalendarEventInput) {
        await addLocalEvent(input);
        await refreshWorkoutScheduleState();
    }

    async function handleUpdateSession(
        eventId: string,
        input: CreateWorkoutCalendarEventInput,
    ) {
        await updateLocalEvent(eventId, input);
        await refreshWorkoutScheduleState();
    }

    async function handleDeleteSession(eventId: string) {
        await removeLocalEvent(eventId);
        await refreshWorkoutScheduleState();
    }

    async function handleSetActiveSession(eventId: string) {
        await setEventActive(eventId);
        await refreshWorkoutScheduleState();
    }

    async function handleMoveEventToDate(eventId: string, nextDate: string) {
        const targetEvent = events.find((event: WorkoutCalendarEvent) => event.id === eventId);
        if (!targetEvent) {
            return;
        }

        const isAttachedActive =
            activeSessionId != null &&
            targetEvent.sessionId != null &&
            targetEvent.sessionId === activeSessionId;

        if (targetEvent.source === "active-session" || isAttachedActive) {
            return;
        }

        const nextHour = getHourFromTime(targetEvent.startTime);

        try {
            await moveLocalEvent(eventId, nextDate, nextHour);
            await refreshWorkoutScheduleState();
        } catch (error) {
            console.error("[Workout Schedule] failed to move schedule event", error);
        }
    }

    async function handleLogWorkoutFromHeader(event: WorkoutCalendarEvent) {
        const isAttachedActive =
            activeSessionId != null &&
            event.sessionId != null &&
            event.sessionId === activeSessionId;

        try {
            if (!isAttachedActive && event.source !== "active-session") {
                await setEventActive(event.id);
                await refreshWorkoutScheduleState();
            }

            onOpenWorkoutLog(event);
        } catch (error) {
            console.error("[Workout Schedule] failed to open workout logger", error);
        }
    }

    return (
        <>
            {errorMessage ? (
                <div
                    className="mb-4 rounded-2xl px-4 py-3 text-[11.25px] text-[#72728A]"
                    style={{
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#F8FAFC",
                    }}
                >
                    {errorMessage}
                </div>
            ) : null}

            <CossWorkoutCalendar
                currentDate={currentDate}
                events={events}
                activeSessionId={activeSessionId}
                isLoading={isLoading}
                loggableEvents={loggableEvents}
                onCurrentDateChange={setCurrentDate}
                onAddSession={handleOpenAddSession}
                onEditSession={handleOpenEditSession}
                onMoveEventToDate={handleMoveEventToDate}
                onLogWorkout={handleLogWorkoutFromHeader}
            />

            <AddSessionModal
                isOpen={isAddSessionOpen}
                onOpenChange={(open) => {
                    setIsAddSessionOpen(open);
                    if (!open) {
                        setEditingEvent(null);
                    }
                }}
                defaultDate={selectedDate}
                defaultStartTime={selectedStartTime}
                editingEvent={editingEvent}
                onCreate={handleCreateSession}
                onUpdate={handleUpdateSession}
                onDelete={handleDeleteSession}
                onSetActive={handleSetActiveSession}
            />
        </>
    );
}